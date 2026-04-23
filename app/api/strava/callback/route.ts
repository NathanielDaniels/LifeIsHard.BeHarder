// ============================================
// GET /api/strava/callback
// OAuth callback - exchanges code for tokens
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getAthlete } from '@/lib/strava-client';
import { storeTokens } from '@/lib/strava-token-storage';
import { markConnected } from '@/lib/api-connections';
import { backfillActivities } from '@/lib/strava-history';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('Strava OAuth error:', error);
    return NextResponse.redirect(
      new URL(`/admin?error=strava_${encodeURIComponent(error)}`, request.url),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/admin?error=strava_missing_params', request.url),
    );
  }

  // Validate state (CSRF protection)
  const { data: stateRow, error: stateError } = await supabase
    .from('strava_oauth_state')
    .select('state, created_at')
    .eq('id', 'primary')
    .single();

  if (stateError || !stateRow || stateRow.state !== state) {
    console.error('Strava OAuth state mismatch:', {
      stateError,
      hasRow: !!stateRow,
      matches: stateRow?.state === state,
    });
    return NextResponse.redirect(
      new URL('/admin?error=strava_invalid_state', request.url),
    );
  }

  // Check state is not older than 10 minutes
  const stateAge = Date.now() - new Date(stateRow.created_at).getTime();
  if (stateAge > 10 * 60 * 1000) {
    return NextResponse.redirect(
      new URL('/admin?error=strava_state_expired', request.url),
    );
  }

  // Delete used state
  await supabase.from('strava_oauth_state').delete().eq('id', 'primary');

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get athlete profile
    const athlete = await getAthlete(tokens.access_token);

    // Store tokens in Supabase
    await storeTokens(tokens, athlete.id);

    // Record connection status (fire-and-forget)
    markConnected('strava', tokens.expires_at).catch(() => {});

    // Backfill recent activities in the background (fire-and-forget)
    backfillActivities(tokens.access_token)
      .then((result) => {
        console.log(`[strava-callback] Backfilled ${result.saved} activities`);
        if (result.errors.length > 0) {
          console.warn('[strava-callback] Backfill errors:', result.errors);
        }
      })
      .catch((err) => {
        console.error('[strava-callback] Backfill failed:', err);
      });

    return NextResponse.redirect(
      new URL(
        `/admin?success=strava&user=${encodeURIComponent(athlete.firstname)}`,
        request.url,
      ),
    );
  } catch (err) {
    console.error('Strava token exchange error:', err);
    return NextResponse.redirect(
      new URL('/admin?error=strava_token_exchange_failed', request.url),
    );
  }
}
