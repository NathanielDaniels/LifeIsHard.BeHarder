// ============================================
// WHOOP Token Storage (Supabase)
// Replaces the old fs-based whoop-storage.ts
// Single-user setup: one row in whoop_tokens table
// ============================================

import { supabase } from './supabase';
import { WhoopTokens } from '@/types/whoop';

const TABLE = 'whoop_tokens';
const SINGLE_USER_ID = 'primary';

// ============================================
// Public API
// ============================================

export async function getStoredTokens(): Promise<WhoopTokens | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('access_token, refresh_token, expires_at')
    .eq('id', SINGLE_USER_ID)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
  };
}

export async function storeTokens(tokens: WhoopTokens, userId?: number): Promise<void> {
  const row: Record<string, unknown> = {
    id: SINGLE_USER_ID,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: tokens.expires_at,
    updated_at: new Date().toISOString(),
  };

  if (userId !== undefined) {
    row.whoop_user_id = userId;
  }

  const { error } = await supabase
    .from(TABLE)
    .upsert(row, { onConflict: 'id' });

  if (error) {
    console.error('Failed to store WHOOP tokens in Supabase:', error);
    throw new Error(`Token storage failed: ${error.message}`);
  }
}

export async function clearTokens(): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', SINGLE_USER_ID);

  if (error) {
    console.error('Failed to clear WHOOP tokens from Supabase:', error);
    throw new Error(`Token clear failed: ${error.message}`);
  }
}

export async function isAuthorized(): Promise<boolean> {
  const tokens = await getStoredTokens();
  return tokens !== null;
}

export async function getValidAccessToken(): Promise<string | null> {
  const { refreshAccessToken } = await import('./whoop-client');

  const tokens = await getStoredTokens();
  if (!tokens) {
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  const isExpired = Date.now() >= (tokens.expires_at - 5 * 60 * 1000);

  if (!isExpired) {
    return tokens.access_token;
  }

  // Token expired, try to refresh
  try {
    const newTokens = await refreshAccessToken(tokens.refresh_token);
    await storeTokens(newTokens);
    return newTokens.access_token;
  } catch (error) {
    console.error('Failed to refresh token, retrying once...', error);
    // Retry once after a brief delay (network blip, server restart, etc.)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTokens = await refreshAccessToken(tokens.refresh_token);
      await storeTokens(newTokens);
      return newTokens.access_token;
    } catch (retryError) {
      console.error('Token refresh retry also failed:', retryError);
      // Don't clear tokens — the refresh token may still be valid
      // for a future request. Only explicit disconnect should clear tokens.
      return null;
    }
  }
}
