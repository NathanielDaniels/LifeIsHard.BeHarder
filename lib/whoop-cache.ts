// ============================================
// WHOOP Stats Cache
// In-memory cache with configurable TTL
// Reduces API calls while keeping data fresh
// ============================================

import { WhoopStats } from '@/types/whoop';

interface CacheEntry {
  stats: WhoopStats;
  timestamp: number;
}

// In-memory cache (resets on server restart)
let cache: CacheEntry | null = null;

// Cache TTL in milliseconds (default: 5 minutes)
const CACHE_TTL = parseInt(process.env.WHOOP_CACHE_TTL || '300000', 10);

// Minimum time between API calls even if cache is invalidated (30 seconds)
const MIN_FETCH_INTERVAL = 30000;

let lastFetchTime = 0;

// ============================================
// Cache Operations
// ============================================

export function getCachedStats(): WhoopStats | null {
  if (!cache) return null;
  
  const age = Date.now() - cache.timestamp;
  if (age > CACHE_TTL) {
    return null; // Cache expired
  }
  
  return cache.stats;
}

export function setCachedStats(stats: WhoopStats): void {
  cache = {
    stats,
    timestamp: Date.now(),
  };
  lastFetchTime = Date.now();
}

export function invalidateCache(): void {
  cache = null;
}

export function canFetch(): boolean {
  return Date.now() - lastFetchTime >= MIN_FETCH_INTERVAL;
}

export function getCacheAge(): number | null {
  if (!cache) return null;
  return Date.now() - cache.timestamp;
}

// ============================================
// Fetch with Cache
// ============================================

export async function getStatsWithCache(
  fetchFn: () => Promise<WhoopStats>
): Promise<WhoopStats> {
  // Return cached if fresh
  const cached = getCachedStats();
  if (cached) {
    return cached;
  }
  
  // Rate limit protection
  if (!canFetch()) {
    // Return stale cache if available, otherwise throw
    if (cache) {
      return cache.stats;
    }
    throw new Error('Rate limited - please wait before retrying');
  }
  
  // Fetch fresh data
  const stats = await fetchFn();
  setCachedStats(stats);
  
  return stats;
}

// ============================================
// Webhook Cache Update
// Called when webhook notifies us of new data
// ============================================

export function updateCacheFromWebhook(
  type: 'workout' | 'sleep' | 'recovery',
  data: Partial<WhoopStats>
): void {
  if (!cache) return;
  
  // Merge new data into cache
  cache.stats = {
    ...cache.stats,
    ...data,
    lastUpdated: new Date().toISOString(),
  };
  cache.timestamp = Date.now();
}
