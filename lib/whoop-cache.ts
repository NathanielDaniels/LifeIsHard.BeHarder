// ============================================
// WHOOP Stats Cache — Supabase Backed
//
// Why Supabase instead of in-memory?
// Vercel serverless functions are stateless. Every cold start,
// every new instance, every redeployment resets in-memory state.
// Storing cache in Supabase means it persists across all of that.
//
// Table: whoop_cache
//   id          text PRIMARY KEY  (always 'primary')
//   stats       jsonb             (serialized WhoopStats)
//   fetched_at  timestamptz       (when we last hit the WHOOP API)
//   updated_at  timestamptz       (last write)
// ============================================

import { supabase } from "./supabase";
import { WhoopStats } from "@/types/whoop";

const TABLE = "whoop_cache";
const CACHE_ID = "primary";

// How long cached data is considered fresh (1 minute for near real-time updates)
const CACHE_TTL_MS = parseInt(process.env.WHOOP_CACHE_TTL || "60000", 10);

// Minimum gap between WHOOP API calls regardless of cache state (30 seconds)
// Protects against stampedes on cold starts
const MIN_FETCH_INTERVAL_MS = 30_000;

// ============================================
// Types
// ============================================

interface CacheRow {
  id: string;
  stats: WhoopStats;
  fetched_at: string;
  updated_at: string;
}

// ============================================
// Read
// ============================================

/**
 * Returns cached stats if they exist and are within TTL.
 * Returns null if cache is missing, expired, or Supabase errors.
 */
export async function getCachedStats(): Promise<WhoopStats | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("stats, fetched_at")
      .eq("id", CACHE_ID)
      .maybeSingle();

    if (error || !data) return null;

    const ageMs = Date.now() - new Date(data.fetched_at).getTime();
    if (ageMs > CACHE_TTL_MS) return null; // Expired

    return data.stats as WhoopStats;
  } catch (err) {
    console.error("[whoop-cache] getCachedStats error:", err);
    return null;
  }
}

/**
 * Returns stale cached stats regardless of TTL.
 * Used as a last resort when WHOOP API is unreachable.
 */
export async function getStaleStats(): Promise<{
  stats: WhoopStats;
  fetchedAt: string;
} | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("stats, fetched_at")
      .eq("id", CACHE_ID)
      .maybeSingle();

    if (error || !data) return null;
    return { stats: data.stats as WhoopStats, fetchedAt: data.fetched_at };
  } catch (err) {
    console.error("[whoop-cache] getStaleStats error:", err);
    return null;
  }
}

// ============================================
// Write
// ============================================

export async function setCachedStats(stats: WhoopStats): Promise<void> {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase.from(TABLE).upsert(
      {
        id: CACHE_ID,
        stats,
        fetched_at: now,
        updated_at: now,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("[whoop-cache] setCachedStats error:", error);
    }
  } catch (err) {
    console.error("[whoop-cache] setCachedStats exception:", err);
  }
}

/**
 * Invalidates cache by setting fetched_at far in the past.
 * Does NOT delete the row — keeps stale data available as fallback.
 */
export async function invalidateCache(): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE)
      .update({
        fetched_at: new Date(0).toISOString(), // epoch = always expired
        updated_at: new Date().toISOString(),
      })
      .eq("id", CACHE_ID);

    if (error) {
      console.error("[whoop-cache] invalidateCache error:", error);
    }
  } catch (err) {
    console.error("[whoop-cache] invalidateCache exception:", err);
  }
}

// ============================================
// Rate-limit guard
// ============================================

/**
 * Checks if enough time has passed since the last fetch.
 * Reads fetched_at from Supabase so it's consistent across instances.
 */
export async function canFetch(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("fetched_at")
      .eq("id", CACHE_ID)
      .maybeSingle();

    if (error || !data) return true; // No record = definitely can fetch

    const msSinceLastFetch = Date.now() - new Date(data.fetched_at).getTime();
    return msSinceLastFetch >= MIN_FETCH_INTERVAL_MS;
  } catch {
    return true; // On error, allow the fetch
  }
}

// ============================================
// Primary fetch-with-cache entry point
// ============================================

/**
 * Returns fresh stats, using cache when possible.
 *
 * Priority order:
 * 1. Fresh cache (within TTL) → return immediately
 * 2. Can fetch → hit WHOOP API, store result, return
 * 3. Rate-limited but stale cache exists → return stale (better than demo)
 * 4. Rate-limited, no cache → throw (caller falls back to demo)
 */
export async function getStatsWithCache(
  fetchFn: () => Promise<WhoopStats>,
): Promise<WhoopStats> {
  // 1. Fresh cache hit
  const cached = await getCachedStats();
  if (cached) return cached;

  // 2. Fetch if not rate-limited
  const ok = await canFetch();
  if (ok) {
    const stats = await fetchFn();
    await setCachedStats(stats); // Fire and store — don't await failure
    return stats;
  }

  // 3. Rate-limited — return stale rather than nothing
  const staleResult = await getStaleStats();
  if (staleResult) {
    const ageMinutes = Math.round(
      (Date.now() - new Date(staleResult.fetchedAt).getTime()) / 60000,
    );
    console.warn(
      `[whoop-cache] Serving stale data — last fresh fetch was ${ageMinutes}m ago`,
    );
    return staleResult.stats;
  }

  // 4. Nothing available
  throw new Error("Rate-limited and no cached data available");
}

// ============================================
// Webhook partial update
// Called by webhook handler to merge new data without a full API refetch
// ============================================

export async function updateCacheFromWebhook(
  _type: "workout" | "recovery",
  data: Partial<WhoopStats>,
): Promise<void> {
  try {
    const staleResult = await getStaleStats();
    if (!staleResult) return; // Nothing to merge into

    const merged: WhoopStats = {
      ...staleResult.stats,
      ...data,
      lastUpdated: new Date().toISOString(),
    };

    await setCachedStats(merged);
  } catch (err) {
    console.error("[whoop-cache] updateCacheFromWebhook error:", err);
  }
}

// // ============================================
// // WHOOP Stats Cache
// // In-memory cache with configurable TTL
// // Reduces API calls while keeping data fresh
// // ============================================

// import { WhoopStats } from '@/types/whoop';

// interface CacheEntry {
//   stats: WhoopStats;
//   timestamp: number;
// }

// // In-memory cache (resets on server restart)
// let cache: CacheEntry | null = null;

// // Cache TTL in milliseconds (default: 5 minutes)
// const CACHE_TTL = parseInt(process.env.WHOOP_CACHE_TTL || '300000', 10);

// // Minimum time between API calls even if cache is invalidated (30 seconds)
// const MIN_FETCH_INTERVAL = 30000;

// let lastFetchTime = 0;

// // ============================================
// // Cache Operations
// // ============================================

// export function getCachedStats(): WhoopStats | null {
//   if (!cache) return null;

//   const age = Date.now() - cache.timestamp;
//   if (age > CACHE_TTL) {
//     return null; // Cache expired
//   }

//   return cache.stats;
// }

// export function setCachedStats(stats: WhoopStats): void {
//   cache = {
//     stats,
//     timestamp: Date.now(),
//   };
//   lastFetchTime = Date.now();
// }

// export function invalidateCache(): void {
//   cache = null;
// }

// export function canFetch(): boolean {
//   return Date.now() - lastFetchTime >= MIN_FETCH_INTERVAL;
// }

// export function getCacheAge(): number | null {
//   if (!cache) return null;
//   return Date.now() - cache.timestamp;
// }

// // ============================================
// // Fetch with Cache
// // ============================================

// export async function getStatsWithCache(
//   fetchFn: () => Promise<WhoopStats>
// ): Promise<WhoopStats> {
//   // Return cached if fresh
//   const cached = getCachedStats();
//   if (cached) {
//     return cached;
//   }

//   // Rate limit protection
//   if (!canFetch()) {
//     // Return stale cache if available, otherwise throw
//     if (cache) {
//       return cache.stats;
//     }
//     throw new Error('Rate limited - please wait before retrying');
//   }

//   // Fetch fresh data
//   const stats = await fetchFn();
//   setCachedStats(stats);

//   return stats;
// }

// // ============================================
// // Webhook Cache Update
// // Called when webhook notifies us of new data
// // ============================================

// export function updateCacheFromWebhook(
//   type: 'workout' | 'sleep' | 'recovery',
//   data: Partial<WhoopStats>
// ): void {
//   if (!cache) return;

//   // Merge new data into cache
//   cache.stats = {
//     ...cache.stats,
//     ...data,
//     lastUpdated: new Date().toISOString(),
//   };
//   cache.timestamp = Date.now();
// }
