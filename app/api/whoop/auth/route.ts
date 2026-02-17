// ============================================
// GET /api/whoop/auth
// Initiates OAuth flow - redirects to WHOOP login
// Protected: requires admin secret via query param
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl, isWhoopEnabled } from '@/lib/whoop-client';
import { supabase } from '@/lib/supabase';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  // --- Rate Limiting: 5 requests/minute ---
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`auth:${ip}`, 5, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  // --- Admin auth: check secret passed as query param ---
  // (We use query param here because this is a redirect link, not an API call)
  const adminSecret = process.env.ADMIN_SECRET;
  if (adminSecret) {
    const providedSecret = request.nextUrl.searchParams.get('secret');
    if (providedSecret !== adminSecret) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'ADMIN_SECRET not configured.' },
      { status: 500 }
    );
  }

  // Check if WHOOP is configured
  if (!isWhoopEnabled()) {
    return NextResponse.json(
      { error: 'WHOOP integration is not configured' },
      { status: 400 }
    );
  }
  
  // Generate state for CSRF protection
  const state = generateState();

  // Store state in Supabase (survives cross-domain redirects unlike cookies)
  const { error: upsertError } = await supabase
    .from('whoop_oauth_state')
    .upsert({ id: 'primary', state, created_at: new Date().toISOString() }, { onConflict: 'id' });

  if (upsertError) {
    console.error('Failed to store OAuth state in Supabase:', upsertError);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }

  // Redirect to WHOOP authorization
  const authUrl = getAuthorizationUrl(state);

  return NextResponse.redirect(authUrl);
}

function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
