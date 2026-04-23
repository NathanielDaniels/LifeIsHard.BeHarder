// ============================================
// Strava Service Provider
// Wraps Strava functions into ServiceProvider interface
// ============================================

import { ServiceProvider, ServiceHealthResult } from '@/types/api-tokens';

// ============================================
// Internal helpers
// ============================================

function isConfigured(): boolean {
  return (
    process.env.STRAVA_ENABLED === 'true' &&
    !!process.env.STRAVA_CLIENT_ID &&
    !!process.env.STRAVA_CLIENT_SECRET
  );
}

/**
 * Verify the token works by hitting the /athlete endpoint.
 * Strava doesn't have multiple scoped endpoints like WHOOP,
 * so a single call is sufficient.
 */
async function pingEndpoint(
  accessToken: string,
  expiresAt: number,
): Promise<ServiceHealthResult> {
  const { getAthlete } = await import('@/lib/strava-client');

  try {
    const athlete = await getAthlete(accessToken);
    return {
      status: 'connected',
      tokenExpiresAt: expiresAt,
      lastError: null,
      details: {
        athleteId: athlete.id,
        name: `${athlete.firstname} ${athlete.lastname}`,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes('STRAVA_UNAUTHORIZED') || message.includes('401')) {
      return {
        status: 'expired',
        tokenExpiresAt: expiresAt,
        lastError: 'Strava returned 401. Token is dead.',
        details: null,
      };
    }

    return {
      status: 'error',
      tokenExpiresAt: expiresAt,
      lastError: message,
      details: null,
    };
  }
}

// ============================================
// Service Provider
// ============================================

export const stravaService: ServiceProvider = {
  id: 'strava',
  displayName: 'Strava',

  isConfigured,

  async checkHealth(): Promise<ServiceHealthResult> {
    if (!isConfigured()) {
      return {
        status: 'disconnected',
        tokenExpiresAt: null,
        lastError: 'Strava is not configured (missing env vars)',
        details: null,
      };
    }

    const { getStoredTokens, getValidAccessToken, TokenExpiredError } =
      await import('@/lib/strava-token-storage');
    const tokens = await getStoredTokens();

    if (!tokens) {
      return {
        status: 'disconnected',
        tokenExpiresAt: null,
        lastError: 'No tokens stored. Authorization required.',
        details: null,
      };
    }

    // Auto-refresh if needed
    let accessToken: string | null;
    try {
      accessToken = await getValidAccessToken();
    } catch (err) {
      const isExpired = err instanceof TokenExpiredError;
      return {
        status: isExpired ? 'expired' : 'error',
        tokenExpiresAt: tokens.expires_at,
        lastError: err instanceof Error ? err.message : 'Token refresh failed.',
        details: null,
      };
    }

    if (!accessToken) {
      return {
        status: 'disconnected',
        tokenExpiresAt: null,
        lastError: 'No valid token available.',
        details: null,
      };
    }

    // Re-read tokens to get current expires_at (may have been refreshed)
    const currentTokens = await getStoredTokens();
    const currentExpiry = currentTokens?.expires_at ?? tokens.expires_at;

    // Verify the token actually works
    try {
      const result = await pingEndpoint(accessToken, currentExpiry);

      // If 401, try force-refresh to self-heal
      if (result.status === 'expired') {
        console.log('[strava-service] Endpoint 401. Attempting force refresh...');
        const { forceRefreshToken } = await import('@/lib/strava-token-storage');
        try {
          const newToken = await forceRefreshToken();
          if (newToken) {
            const refreshedTokens = await getStoredTokens();
            const newExpiry = refreshedTokens?.expires_at ?? currentExpiry;
            const retryResult = await pingEndpoint(newToken, newExpiry);
            if (retryResult.status === 'connected') {
              console.log('[strava-service] Self-heal succeeded.');
            }
            return retryResult;
          }
        } catch (healErr) {
          console.error('[strava-service] Self-heal failed:', healErr instanceof Error ? healErr.message : healErr);
        }
      }

      return result;
    } catch (err) {
      return {
        status: 'error',
        tokenExpiresAt: currentExpiry,
        lastError: err instanceof Error ? err.message : 'Health check failed.',
        details: null,
      };
    }
  },

  async getOAuthUrl(): Promise<string | null> {
    if (!isConfigured()) return null;

    const { getAuthorizationUrl } = await import('@/lib/strava-client');
    const { supabase } = await import('@/lib/supabase');

    const state = crypto.randomUUID();
    const { error } = await supabase
      .from('strava_oauth_state')
      .upsert({ id: 'primary', state, created_at: new Date().toISOString() });

    if (error) {
      console.error('Failed to persist Strava OAuth state:', error);
      return null;
    }

    return getAuthorizationUrl(state);
  },
};
