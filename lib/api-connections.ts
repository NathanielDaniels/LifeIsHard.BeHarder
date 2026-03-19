// ============================================
// API Connections — Supabase CRUD
//
// Table: api_connections
//   id                    text PRIMARY KEY  ('whoop', 'instagram', 'strava')
//   display_name          text NOT NULL
//   status                text NOT NULL DEFAULT 'disconnected'
//   token_expires_at      timestamptz
//   last_health_check     timestamptz
//   last_successful_fetch timestamptz
//   last_error            text
//   health_details        jsonb
//   updated_at            timestamptz DEFAULT now()
// ============================================

import { supabase } from './supabase';
import { ConnectionRecord, ConnectionStatus, ServiceHealthResult } from '@/types/api-tokens';

const TABLE = 'api_connections';

// ============================================
// Read
// ============================================

export async function getConnection(id: string): Promise<ConnectionRecord | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`[api-connections] getConnection(${id}) error:`, error);
    return null;
  }

  return data as ConnectionRecord | null;
}

export async function getAllConnections(): Promise<ConnectionRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('id');

  if (error) {
    console.error('[api-connections] getAllConnections error:', error);
    return [];
  }

  return (data ?? []) as ConnectionRecord[];
}

// ============================================
// Write — called after health checks
// ============================================

export async function updateConnectionHealth(
  id: string,
  result: ServiceHealthResult,
): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      status: result.status,
      token_expires_at: result.tokenExpiresAt
        ? new Date(result.tokenExpiresAt).toISOString()
        : null,
      last_health_check: new Date().toISOString(),
      last_error: result.lastError,
      health_details: result.details,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(`[api-connections] updateConnectionHealth(${id}) error:`, error);
    return false;
  }

  return true;
}

// ============================================
// Write — called from WHOOP routes
// ============================================

/**
 * Mark a service as connected after successful OAuth callback.
 * Clears any previous error state.
 */
export async function markConnected(
  id: string,
  tokenExpiresAt?: number,
): Promise<void> {
  const update: Record<string, unknown> = {
    status: 'connected' as ConnectionStatus,
    last_error: null,
    updated_at: new Date().toISOString(),
  };
  if (tokenExpiresAt) {
    update.token_expires_at = new Date(tokenExpiresAt).toISOString();
  }

  const { error } = await supabase
    .from(TABLE)
    .update(update)
    .eq('id', id);

  if (error) {
    console.error(`[api-connections] markConnected(${id}) error:`, error);
  }
}

/**
 * Mark a service as disconnected (after explicit disconnect or token death).
 */
export async function markDisconnected(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      status: 'disconnected' as ConnectionStatus,
      token_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(`[api-connections] markDisconnected(${id}) error:`, error);
  }
}

/**
 * Touch the last_successful_fetch timestamp.
 * Called after every successful live data fetch.
 */
export async function touchLastFetch(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      last_successful_fetch: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(`[api-connections] touchLastFetch(${id}) error:`, error);
  }
}
