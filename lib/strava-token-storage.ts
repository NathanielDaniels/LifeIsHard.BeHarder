// ============================================
// Strava Token Storage - Supabase Backed
//
// Table: strava_tokens
//   id              text PRIMARY KEY  (always 'primary')
//   access_token    text
//   refresh_token   text
//   expires_at      bigint            (Unix ms timestamp)
//   strava_user_id  bigint
//   updated_at      timestamptz
//
// Mirrors whoop-token-storage.ts pattern.
// Key difference: Strava tokens expire every 6 hours (vs WHOOP ~24h).
// ============================================

import { supabase } from './supabase';
import { StravaTokens } from '@/types/strava';

const TABLE = 'strava_tokens';
const SINGLE_USER_ID = 'primary';

// Refresh 10 minutes before expiry
const EXPIRY_BUFFER_MS = 10 * 60 * 1000;

// ============================================
// Read / Write
// ============================================

export async function getStoredTokens(): Promise<StravaTokens | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('access_token, refresh_token, expires_at')
      .eq('id', SINGLE_USER_ID)
      .maybeSingle();

    if (error || !data) return null;

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    };
  } catch (err) {
    console.error('[strava-token-storage] getStoredTokens error:', err);
    return null;
  }
}

export async function storeTokens(
  tokens: StravaTokens,
  userId?: number,
): Promise<void> {
  const row: Record<string, unknown> = {
    id: SINGLE_USER_ID,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: tokens.expires_at,
    updated_at: new Date().toISOString(),
  };

  if (userId !== undefined) {
    row.strava_user_id = userId;
  }

  const { error } = await supabase
    .from(TABLE)
    .upsert(row, { onConflict: 'id' });

  if (error) {
    console.error('[strava-token-storage] storeTokens error:', JSON.stringify({ message: error.message, code: error.code, details: error.details, hint: error.hint }));
    throw new Error(`Token storage failed: ${error.message}`);
  }
}

export async function clearTokens(): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', SINGLE_USER_ID);

  if (error) {
    console.error('[strava-token-storage] clearTokens error:', error);
    throw new Error(`Token clear failed: ${error.message}`);
  }
}

export async function isAuthorized(): Promise<boolean> {
  const tokens = await getStoredTokens();
  return tokens !== null;
}

// ============================================
// Token refresh error classification
// ============================================

export class TokenExpiredError extends Error {
  constructor() {
    super('Strava refresh token is expired or revoked. Re-authorization required.');
    this.name = 'TokenExpiredError';
  }
}

export class TokenRefreshError extends Error {
  constructor(cause: string) {
    super(`Token refresh failed: ${cause}`);
    this.name = 'TokenRefreshError';
  }
}

// ============================================
// Get valid access token (auto-refresh)
// ============================================

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getStoredTokens();
  if (!tokens) return null;

  const isExpired = Date.now() >= tokens.expires_at - EXPIRY_BUFFER_MS;

  if (!isExpired) return tokens.access_token;

  return refreshWithRetry(tokens.refresh_token);
}

export async function forceRefreshToken(): Promise<string | null> {
  const tokens = await getStoredTokens();
  if (!tokens) return null;
  console.log('[strava-token-storage] Forcing token refresh due to API 401...');
  return refreshWithRetry(tokens.refresh_token);
}

async function refreshWithRetry(refreshToken: string): Promise<string> {
  const { refreshAccessToken } = await import('./strava-client');

  // Attempt 1
  try {
    const newTokens = await refreshAccessToken(refreshToken);
    await storeTokens(newTokens);
    return newTokens.access_token;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (isAuthError(message)) {
      // Race condition mitigation: another worker may have refreshed
      await sleep(2000);
      const dbTokens = await getStoredTokens();
      if (dbTokens && dbTokens.refresh_token !== refreshToken) {
        console.log('[strava-token-storage] Concurrency race prevented. Using new token from DB.');
        return dbTokens.access_token;
      }

      console.error('[strava-token-storage] Refresh token expired/revoked:', message);
      await clearTokens().catch(() => {});
      throw new TokenExpiredError();
    }

    console.warn('[strava-token-storage] Refresh attempt 1 failed, retrying in 1.5s:', message);
  }

  // Attempt 2
  await sleep(1500);
  try {
    const newTokens = await refreshAccessToken(refreshToken);
    await storeTokens(newTokens);
    return newTokens.access_token;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (isAuthError(message)) {
      await sleep(2000);
      const dbTokens = await getStoredTokens();
      if (dbTokens && dbTokens.refresh_token !== refreshToken) {
        console.log('[strava-token-storage] Concurrency race prevented on retry.');
        return dbTokens.access_token;
      }

      await clearTokens().catch(() => {});
      throw new TokenExpiredError();
    }

    console.error('[strava-token-storage] Refresh attempt 2 failed:', message);
    throw new TokenRefreshError(message);
  }
}

function isAuthError(message: string): boolean {
  const lower = message.toLowerCase();

  if (lower.includes('500') || lower.includes('server_error')) {
    return false;
  }

  if (lower.includes('401') || lower.includes('unauthorized')) {
    return true;
  }

  if (
    lower.includes('invalid_grant') ||
    lower.includes('invalid grant') ||
    lower.includes('invalid_client') ||
    lower.includes('authorization code') ||
    lower.includes('token has been revoked')
  ) {
    return true;
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
