// ============================================
// GET + POST /api/workout-rx
// GET: Returns existing prescription for a date (dedup check).
// POST: Stores a new workout prescription.
// Protected by admin secret.
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkAuth(request: NextRequest): boolean {
  const secret = request.headers.get('x-admin-secret');
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || !secret || secret.length !== adminSecret.length) return false;
  return timingSafeEqual(Buffer.from(secret), Buffer.from(adminSecret));
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date = request.nextUrl.searchParams.get('date');
  if (!date) {
    return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('workout_prescriptions')
    .select('*')
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.error('[workout-rx] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch prescription' }, { status: 500 });
  }

  return NextResponse.json({ prescription: data });
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { date: string; discipline?: string; workout_json: unknown; was_rest_day: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.date || body.workout_json === undefined || body.was_rest_day === undefined) {
    return NextResponse.json({ error: 'Missing required fields: date, workout_json, was_rest_day' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('workout_prescriptions')
    .upsert({
      date: body.date,
      discipline: body.discipline || null,
      workout_json: body.workout_json,
      was_rest_day: body.was_rest_day,
    }, { onConflict: 'date' })
    .select()
    .single();

  if (error) {
    console.error('[workout-rx] POST error:', error);
    return NextResponse.json({ error: 'Failed to store prescription' }, { status: 500 });
  }

  return NextResponse.json({ prescription: data }, { status: 201 });
}
