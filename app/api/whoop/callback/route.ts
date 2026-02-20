// ============================================
// GET /api/whoop/callback
// OAuth callback - exchanges code for tokens
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getProfile, verifyTokenHealth } from '@/lib/whoop-client';
import { storeTokens } from '@/lib/whoop-token-storage';
import { invalidateCache } from '@/lib/whoop-cache';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  // Handle OAuth errors
  if (error) {
    console.error('WHOOP OAuth error:', error);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // Validate required params
  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/?error=missing_params', request.url)
    );
  }

  // Validate state (CSRF protection) — read from Supabase
  const { data: stateRow, error: stateError } = await supabase
    .from('whoop_oauth_state')
    .select('state, created_at')
    .eq('id', 'primary')
    .single();

  if (stateError || !stateRow || stateRow.state !== state) {
    console.error('OAuth state mismatch:', { stateError, hasRow: !!stateRow, matches: stateRow?.state === state });
    return NextResponse.redirect(
      new URL('/?error=invalid_state', request.url)
    );
  }

  // Check state is not older than 10 minutes
  const stateAge = Date.now() - new Date(stateRow.created_at).getTime();
  if (stateAge > 10 * 60 * 1000) {
    console.error('OAuth state expired:', { ageMs: stateAge });
    return NextResponse.redirect(
      new URL('/?error=state_expired', request.url)
    );
  }

  // Delete used state from Supabase
  await supabase.from('whoop_oauth_state').delete().eq('id', 'primary');

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get user profile to verify and store user ID
    const profile = await getProfile(tokens.access_token);

    // Store tokens in Supabase
    try {
      await storeTokens(tokens, profile.user_id);
    } catch (storageErr) {
      console.error('Supabase storage error:', storageErr);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent('token_storage_failed')}`, request.url)
      );
    }

    // Verify all endpoints work with the fresh token
    verifyTokenHealth(tokens.access_token).catch(() => {}); // fire-and-forget

    // Clear any cached data
    invalidateCache();

    // Redirect to home on success
    return NextResponse.redirect(
      new URL(`/?success=true&user=${encodeURIComponent(profile.first_name)}`, request.url)
    );

  } catch (err) {
    console.error('Token exchange error:', err);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent('token_exchange_failed')}`, request.url)
    );
  }
}
