// ============================================
// GET /api/athlete/zones
// Returns athlete training zones (power, pace, CSS).
// Protected by admin secret.
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || !secret || secret.length !== adminSecret.length ||
      !timingSafeEqual(Buffer.from(secret), Buffer.from(adminSecret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('athlete_zones')
    .select('*');

  if (error) {
    console.error('[athlete/zones] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
  }

  return NextResponse.json({
    count: data.length,
    zones: data,
  });
}
