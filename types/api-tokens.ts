// ============================================
// API Token Health Monitoring Types
// Shared interface for all external API services
// ============================================

// ============================================
// Service Provider Interface
// ============================================

/**
 * Every external API service (WHOOP, Instagram, Strava) implements this.
 * The cron job and admin dashboard use it to check health and trigger reconnects
 * without knowing the specifics of each API.
 */
export interface ServiceProvider {
  /** Unique ID matching the api_connections table (e.g. 'whoop') */
  id: string;

  /** Human-readable name for the admin dashboard */
  displayName: string;

  /** Whether this service is configured (env vars present) */
  isConfigured(): boolean;

  /**
   * Check if the service's token is valid and data is flowing.
   * Should NOT throw — return a result object instead.
   */
  checkHealth(): Promise<ServiceHealthResult>;

  /**
   * Return the OAuth authorization URL to reconnect this service.
   * Returns null if not applicable (e.g. API key-based services).
   */
  getOAuthUrl(): Promise<string | null>;
}

// ============================================
// Health Check Result
// ============================================

export type ConnectionStatus = 'connected' | 'expiring' | 'expired' | 'error' | 'disconnected';

export interface ServiceHealthResult {
  status: ConnectionStatus;
  tokenExpiresAt: number | null; // Unix ms timestamp
  lastError: string | null;
  details: Record<string, unknown> | null;
}

// ============================================
// Database Record (api_connections table)
// ============================================

export interface ConnectionRecord {
  id: string;
  display_name: string;
  status: ConnectionStatus;
  token_expires_at: string | null; // ISO timestamp from Supabase
  last_health_check: string | null;
  last_successful_fetch: string | null;
  last_error: string | null;
  health_details: Record<string, unknown> | null;
  updated_at: string;
}
