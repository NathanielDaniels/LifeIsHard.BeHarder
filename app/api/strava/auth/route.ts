// ============================================
// GET /api/strava/auth
// Initiates OAuth flow - redirects to Strava login
// Protected: requires admin secret via query param
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl, isStravaEnabled } from '@/lib/strava-client';
import { supabase } from '@/lib/supabase';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // --- Rate Limiting: 5 requests/minute ---
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`strava-auth:${ip}`, 5, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  // --- Admin auth ---
  const adminSecret = process.env.ADMIN_SECRET;
  if (adminSecret) {
    const providedSecret = request.nextUrl.searchParams.get('secret');
    if (providedSecret !== adminSecret) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 },
      );
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'ADMIN_SECRET not configured.' },
      { status: 500 },
    );
  }

  if (!isStravaEnabled()) {
    return NextResponse.json(
      { error: 'Strava integration is not configured' },
      { status: 400 },
    );
  }

  // Generate state for CSRF protection
  const state = generateState();

  // Store state in Supabase (survives cross-domain redirects)
  const { error: upsertError } = await supabase
    .from('strava_oauth_state')
    .upsert(
      { id: 'primary', state, created_at: new Date().toISOString() },
      { onConflict: 'id' },
    );

  if (upsertError) {
    console.error('Failed to store Strava OAuth state:', upsertError);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 },
    );
  }

  const authUrl = getAuthorizationUrl(state);
  return NextResponse.redirect(authUrl);
}

function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
