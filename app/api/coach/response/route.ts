import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// HMAC verification for quick-tap buttons
async function verifyToken(date: string, token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production' && token === 'dev-token';

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`coach-response:${date}`));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time comparison
  if (token.length !== expected.length) return false;
  let match = true;
  for (let i = 0; i < token.length; i++) {
    if (token[i] !== expected[i]) match = false;
  }
  return match;
}

// Generate token for a given date (used by email pipeline)
export async function generateToken(date: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') throw new Error('ADMIN_SECRET is required in production');
    return 'dev-token';
  }
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`coach-response:${date}`));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// GET — handles quick-tap button clicks (redirects to thank-you or check-in)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const status = searchParams.get('status');
  const token = searchParams.get('token');

  if (!date || !status || !token) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  if (!(await verifyToken(date, token))) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Save response to Supabase
  const { error } = await supabase.from('coach_responses').insert({
    date,
    response_type: 'quick-tap',
    status,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to save coach response:', error);
  }

  // Redirect to check-in page with confirmation + option to add more detail
  const checkinUrl = new URL('/coach/checkin', request.url);
  checkinUrl.searchParams.set('date', date);
  checkinUrl.searchParams.set('token', token);
  checkinUrl.searchParams.set('confirmed', error ? 'error' : status);

  return NextResponse.redirect(checkinUrl);
}

// POST — handles check-in form submissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, token, limbStatus, energyLevel, notes } = body;

    if (!date || !token) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (!(await verifyToken(date, token))) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { error } = await supabase.from('coach_responses').insert({
      date,
      response_type: 'checkin-form',
      status: limbStatus || null,
      energy_level: energyLevel || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to save coach response:', error);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
