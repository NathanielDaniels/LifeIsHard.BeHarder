// ============================================
// WHOOP Service Provider
// Wraps existing WHOOP functions into ServiceProvider interface
// ============================================

import { ServiceProvider, ServiceHealthResult } from '@/types/api-tokens';

// ============================================
// Internal helpers (no `this` ambiguity)
// ============================================

function isConfigured(): boolean {
  return (
    process.env.WHOOP_ENABLED === 'true' &&
    !!process.env.WHOOP_CLIENT_ID &&
    !!process.env.WHOOP_CLIENT_SECRET
  );
}

async function pingEndpoints(
  accessToken: string,
  expiresAt: number,
): Promise<ServiceHealthResult> {
  const { verifyTokenHealth } = await import('@/lib/whoop-client');
  const report = await verifyTokenHealth(accessToken);

  if (report.allHealthy) {
    return {
      status: 'connected',
      tokenExpiresAt: expiresAt,
      lastError: null,
      details: {
        recovery: report.recovery,
        cycle: report.cycle,
        workout: report.workout,
      },
    };
  }

  // Some endpoints failed
  const failedEndpoints = Object.entries(report)
    .filter(([key, val]) => key !== 'allHealthy' && typeof val === 'object' && val && !val.ok)
    .map(([key, val]) => `${key}:${(val as { status: number }).status}`);

  // If all endpoints return 401, token is dead
  const allUnauthorized = failedEndpoints.every(e => e.endsWith(':401'));
  if (allUnauthorized && failedEndpoints.length > 0) {
    return {
      status: 'expired',
      tokenExpiresAt: expiresAt,
      lastError: 'All endpoints returned 401. Token is dead.',
      details: { failedEndpoints },
    };
  }

  return {
    status: 'error',
    tokenExpiresAt: expiresAt,
    lastError: `Unhealthy endpoints: ${failedEndpoints.join(', ')}`,
    details: { failedEndpoints },
  };
}

// ============================================
// Service Provider
// ============================================

export const whoopService: ServiceProvider = {
  id: 'whoop',
  displayName: 'WHOOP',

  isConfigured,

  async checkHealth(): Promise<ServiceHealthResult> {
    if (!isConfigured()) {
      return {
        status: 'disconnected',
        tokenExpiresAt: null,
        lastError: 'WHOOP is not configured (missing env vars)',
        details: null,
      };
    }

    // Check if tokens exist at all
    const { getStoredTokens, getValidAccessToken, TokenExpiredError } =
      await import('@/lib/whoop-token-storage');
    const tokens = await getStoredTokens();

    if (!tokens) {
      return {
        status: 'disconnected',
        tokenExpiresAt: null,
        lastError: 'No tokens stored. Authorization required.',
        details: null,
      };
    }

    // Let the existing token management handle refresh logic.
    // getValidAccessToken() auto-refreshes expired tokens and stores new ones.
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

    // Re-read tokens to get the current expires_at (may have been refreshed above)
    const currentTokens = await getStoredTokens();
    const currentExpiry = currentTokens?.expires_at ?? tokens.expires_at;

    // Token is valid — verify endpoints actually respond
    try {
      return await pingEndpoints(accessToken, currentExpiry);
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

    const { getAuthorizationUrl } = await import('@/lib/whoop-client');
    const { supabase } = await import('@/lib/supabase');

    const state = crypto.randomUUID();
    const { error } = await supabase
      .from('whoop_oauth_state')
      .upsert({ id: 'primary', state, created_at: new Date().toISOString() });

    if (error) {
      console.error('Failed to persist OAuth state:', error);
      return null;
    }

    return getAuthorizationUrl(state);
  },
};
