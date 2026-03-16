// ============================================
// WHOOP Token Storage - Supabase Backed
//
// Table: whoop_tokens
//   id              text PRIMARY KEY  (always 'primary')
//   access_token    text
//   refresh_token   text
//   expires_at      bigint            (Unix ms timestamp)
//   whoop_user_id   bigint
//   updated_at      timestamptz
// ============================================

import { supabase } from "./supabase";
import { WhoopTokens } from "@/types/whoop";

const TABLE = "whoop_tokens";
const SINGLE_USER_ID = "primary";

// Refresh token 10 minutes before expiry (was 5 - more headroom)
const EXPIRY_BUFFER_MS = 10 * 60 * 1000;

// ============================================
// Read / Write
// ============================================

export async function getStoredTokens(): Promise<WhoopTokens | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("access_token, refresh_token, expires_at")
      .eq("id", SINGLE_USER_ID)
      .maybeSingle();

    if (error || !data) return null;

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    };
  } catch (err) {
    console.error("[whoop-token-storage] getStoredTokens error:", err);
    return null;
  }
}

export async function storeTokens(
  tokens: WhoopTokens,
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
    row.whoop_user_id = userId;
  }

  const { error } = await supabase
    .from(TABLE)
    .upsert(row, { onConflict: "id" });

  if (error) {
    console.error("[whoop-token-storage] storeTokens error:", error);
    throw new Error(`Token storage failed: ${error.message}`);
  }
}

export async function clearTokens(): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", SINGLE_USER_ID);

  if (error) {
    console.error("[whoop-token-storage] clearTokens error:", error);
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
    super(
      "WHOOP refresh token is expired or revoked. Re-authorization required.",
    );
    this.name = "TokenExpiredError";
  }
}

export class TokenRefreshError extends Error {
  constructor(cause: string) {
    super(`Token refresh failed: ${cause}`);
    this.name = "TokenRefreshError";
  }
}

// ============================================
// Get valid access token (auto-refresh)
// ============================================

/**
 * Returns a valid access token, refreshing if needed.
 *
 * Returns:
 *   string  - valid token, ready to use
 *   null    - no tokens stored (never authorized)
 *
 * Throws:
 *   TokenExpiredError   - refresh token is dead, need full re-auth
 *   TokenRefreshError   - transient failure, can retry later
 */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getStoredTokens();
  if (!tokens) return null; // Never connected

  const isExpired = Date.now() >= tokens.expires_at - EXPIRY_BUFFER_MS;
  console.log("[DEBUG] Token Expiry Check:", {
    now: Date.now(),
    expiresAt: tokens.expires_at,
    expiresAtType: typeof tokens.expires_at,
    buffer: EXPIRY_BUFFER_MS,
    isExpired,
  });

  if (!isExpired) return tokens.access_token;

  // Token expired - attempt refresh
  return refreshWithRetry(tokens.refresh_token);
}

/**
 * Forcefully refreshes the access token, bypassing the local expiry check.
 * Useful when the WHOOP API returns 401 indicating the token is dead despite our local timestamp.
 */
export async function forceRefreshToken(): Promise<string | null> {
  const tokens = await getStoredTokens();
  if (!tokens) return null;
  console.log("[whoop-token-storage] Forcing token refresh due to API 401...");
  return refreshWithRetry(tokens.refresh_token);
}

async function refreshWithRetry(refreshToken: string): Promise<string> {
  const { refreshAccessToken } = await import("./whoop-client");

  // Attempt 1
  try {
    const newTokens = await refreshAccessToken(refreshToken);
    await storeTokens(newTokens);
    // Fire-and-forget health check after successful refresh
    import("./whoop-client")
      .then(({ verifyTokenHealth }) =>
        verifyTokenHealth(newTokens.access_token),
      )
      .catch(() => {}); // swallow - observability only
    return newTokens.access_token;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // WHOOP returns 401/400 when refresh token is expired/revoked
    // Don't retry - re-auth is required
    if (isAuthError(message)) {
      // Race condition mitigation: Wait 2 seconds for any concurrent worker's `upsert` to land in Supabase
      await sleep(2000);
      const dbTokens = await getStoredTokens();
      if (dbTokens && dbTokens.refresh_token !== refreshToken) {
        console.log(
          "[whoop-token-storage] Concurrency race condition prevented. Returning new access token from DB.",
          {
            old: refreshToken.slice(-4),
            new: dbTokens.refresh_token.slice(-4),
          },
        );
        return dbTokens.access_token;
      }

      console.error(
        "[whoop-token-storage] Refresh token expired/revoked:",
        message,
      );
      // Clear dead tokens so the UI doesn't keep trying
      await clearTokens().catch(() => {}); // swallow - best effort
      throw new TokenExpiredError();
    }

    console.warn(
      "[whoop-token-storage] Refresh attempt 1 failed, retrying in 1.5s:",
      message,
    );
  }

  // Attempt 2 - 1.5s delay for transient network issues
  await sleep(1500);
  try {
    const newTokens = await refreshAccessToken(refreshToken);
    await storeTokens(newTokens);
    // Fire-and-forget health check after successful retry
    import("./whoop-client")
      .then(({ verifyTokenHealth }) =>
        verifyTokenHealth(newTokens.access_token),
      )
      .catch(() => {}); // swallow - observability only
    return newTokens.access_token;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (isAuthError(message)) {
      await sleep(2000);
      const dbTokens = await getStoredTokens();
      if (dbTokens && dbTokens.refresh_token !== refreshToken) {
        console.log(
          "[whoop-token-storage] Concurrency race condition prevented on retry. Returning new access token from DB.",
        );
        return dbTokens.access_token;
      }

      await clearTokens().catch(() => {});
      throw new TokenExpiredError();
    }

    console.error("[whoop-token-storage] Refresh attempt 2 failed:", message);
    throw new TokenRefreshError(message);
  }
}

function isAuthError(message: string): boolean {
  const lower = message.toLowerCase();

  // If it's a 500 server error, it's a WHOOP outage, NOT a dead token
  if (lower.includes("500") || lower.includes("server_error")) {
    return false;
  }

  // A 401 on the token endpoint definitively means the token/client is bad
  if (lower.includes("401") || lower.includes("unauthorized")) {
    return true;
  }

  // Explicitly check for definitive OAuth2 invalidation signals
  if (
    lower.includes("invalid_grant") ||
    lower.includes("invalid grant") ||
    lower.includes("invalid_client") ||
    lower.includes("token has been revoked")
  ) {
    return true;
  }

  // A generic 400 could be rate limiting, malformed request, or temporary API weirdness.
  // We should NOT clear tokens just for a generic 400 unless it has invalid_grant.
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// // ============================================
// // WHOOP Token Storage (Supabase)
// // Replaces the old fs-based whoop-storage.ts
// // Single-user setup: one row in whoop_tokens table
// // ============================================

// import { supabase } from './supabase';
// import { WhoopTokens } from '@/types/whoop';

// const TABLE = 'whoop_tokens';
// const SINGLE_USER_ID = 'primary';

// // ============================================
// // Public API
// // ============================================

// export async function getStoredTokens(): Promise<WhoopTokens | null> {
//   const { data, error } = await supabase
//     .from(TABLE)
//     .select('access_token, refresh_token, expires_at')
//     .eq('id', SINGLE_USER_ID)
//     .single();

//   if (error || !data) {
//     return null;
//   }

//   return {
//     access_token: data.access_token,
//     refresh_token: data.refresh_token,
//     expires_at: data.expires_at,
//   };
// }

// export async function storeTokens(tokens: WhoopTokens, userId?: number): Promise<void> {
//   const row: Record<string, unknown> = {
//     id: SINGLE_USER_ID,
//     access_token: tokens.access_token,
//     refresh_token: tokens.refresh_token,
//     expires_at: tokens.expires_at,
//     updated_at: new Date().toISOString(),
//   };

//   if (userId !== undefined) {
//     row.whoop_user_id = userId;
//   }

//   const { error } = await supabase
//     .from(TABLE)
//     .upsert(row, { onConflict: 'id' });

//   if (error) {
//     console.error('Failed to store WHOOP tokens in Supabase:', error);
//     throw new Error(`Token storage failed: ${error.message}`);
//   }
// }

// export async function clearTokens(): Promise<void> {
//   const { error } = await supabase
//     .from(TABLE)
//     .delete()
//     .eq('id', SINGLE_USER_ID);

//   if (error) {
//     console.error('Failed to clear WHOOP tokens from Supabase:', error);
//     throw new Error(`Token clear failed: ${error.message}`);
//   }
// }

// export async function isAuthorized(): Promise<boolean> {
//   const tokens = await getStoredTokens();
//   return tokens !== null;
// }

// export async function getValidAccessToken(): Promise<string | null> {
//   const { refreshAccessToken } = await import('./whoop-client');

//   const tokens = await getStoredTokens();
//   if (!tokens) {
//     return null;
//   }

//   // Check if token is expired (with 5 minute buffer)
//   const isExpired = Date.now() >= (tokens.expires_at - 5 * 60 * 1000);

//   if (!isExpired) {
//     return tokens.access_token;
//   }

//   // Token expired, try to refresh
//   try {
//     const newTokens = await refreshAccessToken(tokens.refresh_token);
//     await storeTokens(newTokens);
//     return newTokens.access_token;
//   } catch (error) {
//     console.error('Failed to refresh token, retrying once...', error);
//     // Retry once after a brief delay (network blip, server restart, etc.)
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       const newTokens = await refreshAccessToken(tokens.refresh_token);
//       await storeTokens(newTokens);
//       return newTokens.access_token;
//     } catch (retryError) {
//       console.error('Token refresh retry also failed:', retryError);
//       // Don't clear tokens - the refresh token may still be valid
//       // for a future request. Only explicit disconnect should clear tokens.
//       return null;
//     }
//   }
// }
