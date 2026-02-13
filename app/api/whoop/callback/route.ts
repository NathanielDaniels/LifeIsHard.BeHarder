// ============================================
// GET /api/whoop/callback
// OAuth callback - exchanges code for tokens
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getProfile } from '@/lib/whoop-client';
import { storeTokens } from '@/lib/whoop-storage';
import { invalidateCache } from '@/lib/whoop-cache';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  // Handle OAuth errors
  if (error) {
    console.error('WHOOP OAuth error:', error);
    return NextResponse.redirect(
      new URL(`/admin/whoop?error=${encodeURIComponent(error)}`, request.url)
    );
  }
  
  // Validate required params
  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/admin/whoop?error=missing_params', request.url)
    );
  }
  
  // Validate state (CSRF protection)
  const cookieStore = await cookies();
  const storedState = cookieStore.get('whoop_oauth_state')?.value;
  
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      new URL('/admin/whoop?error=invalid_state', request.url)
    );
  }
  
  // Clear state cookie
  cookieStore.delete('whoop_oauth_state');
  
  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    
    // Get user profile to verify and store user ID
    const profile = await getProfile(tokens.access_token);
    
    // Store tokens
    await storeTokens(tokens, profile.user_id);
    
    // Clear any cached data
    invalidateCache();
    
    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/admin/whoop?success=true&user=${encodeURIComponent(profile.first_name)}`, request.url)
    );
    
  } catch (err) {
    console.error('Token exchange error:', err);
    return NextResponse.redirect(
      new URL(`/admin/whoop?error=${encodeURIComponent('token_exchange_failed')}`, request.url)
    );
  }
}
