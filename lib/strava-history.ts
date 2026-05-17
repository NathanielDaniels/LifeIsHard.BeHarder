// ============================================
// Strava History — Smart Sync & Activity Storage
//
// Smart polling strategy:
//   1. Check strava_sync_log for last_checked_at
//   2. Call GET /athlete/activities?after={last_checked_at} — 1 cheap call
//   3. Only if new activities found → upsert them to strava_activities
//   4. Update sync log with latest timestamp
//
// This keeps daily API usage to ~288 lightweight checks (every 5 min)
// plus a handful of full fetches only when Patrick logs a workout.
//
// Table: strava_activities (see types/strava.ts StravaActivityRecord)
// Table: strava_sync_log (single-row tracker)
// ============================================

import { supabase } from './supabase';
import { getActivitiesAfter, getRecentActivities, getActivity, getActivityZones } from './strava-client';
import type { StravaActivity, StravaActivityRecord, StravaExtras, StravaSyncLog } from '@/types/strava';

const ACTIVITIES_TABLE = 'strava_activities';
const SYNC_LOG_TABLE = 'strava_sync_log';
const SINGLE_ID = 'primary';

// Keep 90 days of activities (matches WHOOP retention)
const RETENTION_DAYS = 90;

// ============================================
// Build a record from the API response
// ============================================

function buildActivityRecord(activity: StravaActivity): StravaActivityRecord {
  // Extract local date from start_date_local (ISO format)
  const date = (activity.start_date_local ?? activity.start_date ?? '').split('T')[0];

  return {
    strava_activity_id: activity.id,
    date,
    name: activity.name,
    type: activity.type,
    sport_type: activity.sport_type,
    distance_meters: activity.distance ?? null,
    moving_time_seconds: activity.moving_time ?? null,
    elapsed_time_seconds: activity.elapsed_time ?? null,
    elevation_gain_meters: activity.total_elevation_gain ?? null,
    average_speed_mps: activity.average_speed ?? null,
    max_speed_mps: activity.max_speed ?? null,
    average_heartrate: activity.average_heartrate ?? null,
    max_heartrate: activity.max_heartrate ?? null,
    average_watts: activity.average_watts ?? null,
    max_watts: activity.max_watts ?? null,
    weighted_average_watts: activity.weighted_average_watts ?? null,
    average_cadence: activity.average_cadence ?? null,
    suffer_score: activity.suffer_score ?? null,
    calories: activity.calories ?? null,
    has_heartrate: activity.has_heartrate ?? false,
    device_watts: activity.device_watts ?? false,
    summary_polyline: activity.map?.summary_polyline ?? null,
    average_temp: activity.average_temp ?? null,
    start_time_local: activity.start_date_local
      ? activity.start_date_local.split('T')[1]?.split('+')[0]?.split('-')[0]?.slice(0, 8) ?? null
      : null,
    trainer: activity.trainer ?? false,
    pr_count: activity.pr_count ?? 0,
    description: activity.description ?? null,
    gear_id: activity.gear_id ?? null,
    perceived_exertion: activity.perceived_exertion ?? null,
    workout_type: activity.workout_type ?? null,
    extras: null, // populated by enrichment step
  };
}

// ============================================
// Enrichment — fetch detail + zones per activity
// ============================================

const MAX_ENRICH_PER_SYNC = 10; // 2 calls each = 20 API calls max

async function enrichActivity(
  accessToken: string,
  activityId: number,
): Promise<StravaExtras | null> {
  try {
    const [detail, zones] = await Promise.all([
      getActivity(accessToken, activityId),
      getActivityZones(accessToken, activityId).catch(() => null),
    ]);

    const extras: StravaExtras = {
      enriched: true,
      enriched_at: new Date().toISOString(),
    };

    // Splits (per-km for running, per-100m for swimming)
    if (detail.splits_metric && detail.splits_metric.length > 0) {
      extras.splits = detail.splits_metric.map((s: any) => ({
        distance_m: s.distance,
        elapsed_time_s: s.elapsed_time,
        moving_time_s: s.moving_time,
        avg_hr: s.average_heartrate ?? null,
        pace_sec_per_km: s.distance > 0
          ? Math.round(s.elapsed_time / (s.distance / 1000))
          : null,
        elevation_diff: s.elevation_difference ?? null,
      }));
    }

    // Laps (only if more than 1 — single lap = no structure)
    if (detail.laps && detail.laps.length > 1) {
      extras.laps = detail.laps.map((l: any) => ({
        name: l.name,
        distance_m: l.distance,
        elapsed_time_s: l.elapsed_time,
        avg_hr: l.average_heartrate ?? null,
        max_hr: l.max_heartrate ?? null,
        avg_watts: l.average_watts ?? null,
        avg_cadence: l.average_cadence ?? null,
      }));
    }

    // Best efforts (PRs for standard distances)
    if (detail.best_efforts && detail.best_efforts.length > 0) {
      extras.best_efforts = detail.best_efforts.map((e: any) => ({
        name: e.name,
        elapsed_time_s: e.elapsed_time,
        distance_m: e.distance,
        pr_rank: e.pr_rank ?? null,
      }));
    }

    // Device info
    if (detail.device_name) {
      extras.device_name = detail.device_name;
    }

    // Calories from detail (more accurate than list endpoint)
    if (detail.calories) {
      extras.calories_burned = detail.calories;
    }

    // Normalized power (cycling)
    if (detail.weighted_average_watts) {
      extras.normalized_power = detail.weighted_average_watts;
    }

    // Cadence from detail
    if (detail.average_cadence) {
      extras.avg_cadence = detail.average_cadence;
    }

    // HR zones from Strava
    if (zones && Array.isArray(zones)) {
      const hrZones = zones.find((z: any) => z.type === 'heartrate');
      if (hrZones?.distribution_buckets) {
        extras.hr_zones = hrZones.distribution_buckets.map((b: any) => ({
          min: b.min,
          max: b.max,
          time_s: b.time,
        }));
      }

      const powerZones = zones.find((z: any) => z.type === 'power');
      if (powerZones?.distribution_buckets) {
        extras.power_zones = powerZones.distribution_buckets.map((b: any) => ({
          min: b.min,
          max: b.max,
          time_s: b.time,
        }));
      }
    }

    return extras;
  } catch (err) {
    console.error(`[strava-history] enrichActivity failed for ${activityId}:`, err);
    return null;
  }
}

async function enrichNewActivities(
  accessToken: string,
  activityIds: number[],
): Promise<number> {
  let enriched = 0;
  const toEnrich = activityIds.slice(0, MAX_ENRICH_PER_SYNC);

  for (const id of toEnrich) {
    const extras = await enrichActivity(accessToken, id);
    if (!extras) continue;

    const { error } = await supabase
      .from(ACTIVITIES_TABLE)
      .update({ extras })
      .eq('strava_activity_id', id);

    if (error) {
      console.error(`[strava-history] Failed to save extras for ${id}:`, error);
      continue;
    }

    enriched++;
  }

  if (enriched > 0) {
    console.log(`[strava-history] Enriched ${enriched}/${toEnrich.length} activities`);
  }

  return enriched;
}

// ============================================
// Sync Log — track what we've already fetched
// ============================================

async function getSyncLog(): Promise<StravaSyncLog | null> {
  const { data, error } = await supabase
    .from(SYNC_LOG_TABLE)
    .select('*')
    .eq('id', SINGLE_ID)
    .maybeSingle();

  if (error) {
    console.error('[strava-history] getSyncLog error:', error);
    return null;
  }

  return data as StravaSyncLog | null;
}

async function updateSyncLog(
  lastActivityId: number | null,
  lastActivityAt: string | null,
): Promise<void> {
  const { error } = await supabase
    .from(SYNC_LOG_TABLE)
    .upsert(
      {
        id: SINGLE_ID,
        last_checked_at: new Date().toISOString(),
        last_activity_id: lastActivityId,
        last_activity_at: lastActivityAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );

  if (error) {
    console.error('[strava-history] updateSyncLog error:', error);
  }
}

// ============================================
// Smart Sync — only fetch new activities
// ============================================

export interface SyncResult {
  checked: boolean;
  newActivities: number;
  errors: string[];
}

/**
 * Smart sync: checks for new activities since last sync.
 * Returns the count of new activities found and stored.
 *
 * Cost: 1 API call if nothing new, 1 call if new activities found
 * (activities list endpoint returns enough detail, no need for
 * per-activity detail calls).
 */
export async function syncNewActivities(accessToken: string): Promise<SyncResult> {
  const errors: string[] = [];
  const syncLog = await getSyncLog();

  // Determine the "after" timestamp for the Strava API
  // Default to 24 hours ago if no sync log exists
  let afterEpoch: number;
  if (syncLog?.last_checked_at) {
    // Use last check time, but subtract 1 hour for overlap safety
    afterEpoch = Math.floor(new Date(syncLog.last_checked_at).getTime() / 1000) - 3600;
  } else {
    afterEpoch = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
  }

  // Fetch new activities from Strava
  const activities = await getActivitiesAfter(accessToken, afterEpoch);

  if (activities.length === 0) {
    // Nothing new — just update the check timestamp
    await updateSyncLog(
      syncLog?.last_activity_id ?? null,
      syncLog?.last_activity_at ?? null,
    );
    return { checked: true, newActivities: 0, errors };
  }

  // Build records and upsert
  const records = activities.map(buildActivityRecord);

  const { error } = await supabase
    .from(ACTIVITIES_TABLE)
    .upsert(records, { onConflict: 'strava_activity_id' });

  if (error) {
    errors.push(`Supabase upsert error: ${error.message}`);
    return { checked: true, newActivities: 0, errors };
  }

  // Update sync log with the newest activity's info
  const newest = activities.reduce((a, b) =>
    new Date(a.start_date) > new Date(b.start_date) ? a : b,
  );

  await updateSyncLog(newest.id, newest.start_date);

  // Enrich new activities with detail + zones
  const activityIds = activities.map((a) => a.id);
  const enrichedCount = await enrichNewActivities(accessToken, activityIds);
  console.log(`[strava-history] Synced ${records.length} new, enriched ${enrichedCount}`);

  return { checked: true, newActivities: records.length, errors };
}

// ============================================
// Backfill — initial load of historical data
// ============================================

export async function backfillActivities(
  accessToken: string,
  maxPages = 10,
): Promise<{ saved: number; errors: string[] }> {
  const errors: string[] = [];
  const allActivities: StravaActivity[] = [];

  // Fetch pages of activities (most recent first)
  for (let page = 1; page <= maxPages; page++) {
    const activities = await getRecentActivities(accessToken, 30, page);
    if (activities.length === 0) break;
    allActivities.push(...activities);

    // Stop if we've gone past the retention window
    const oldest = activities[activities.length - 1];
    const oldestDate = new Date(oldest.start_date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

    if (oldestDate < cutoff) break;
  }

  if (allActivities.length === 0) {
    return { saved: 0, errors };
  }

  // Filter to retention window
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const recent = allActivities.filter(
    (a) => new Date(a.start_date) >= cutoff,
  );

  const records = recent.map(buildActivityRecord);

  const { error } = await supabase
    .from(ACTIVITIES_TABLE)
    .upsert(records, { onConflict: 'strava_activity_id' });

  if (error) {
    errors.push(`Supabase upsert error: ${error.message}`);
    return { saved: 0, errors };
  }

  // Update sync log with the newest activity
  if (recent.length > 0) {
    const newest = recent.reduce((a, b) =>
      new Date(a.start_date) > new Date(b.start_date) ? a : b,
    );
    await updateSyncLog(newest.id, newest.start_date);
  }

  console.log(`[strava-history] Backfilled ${records.length} activities`);
  return { saved: records.length, errors };
}

// ============================================
// Read activities from Supabase
// ============================================

export async function getActivities(days = 90): Promise<StravaActivityRecord[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const { data, error } = await supabase
    .from(ACTIVITIES_TABLE)
    .select('*')
    .gte('date', cutoff.toISOString().split('T')[0])
    .order('date', { ascending: false });

  if (error) {
    console.error('[strava-history] getActivities error:', error);
    return [];
  }

  return (data ?? []) as StravaActivityRecord[];
}

// ============================================
// Prune old activities (keep 90 days)
// ============================================

export async function pruneOldActivities(): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const { count, error } = await supabase
    .from(ACTIVITIES_TABLE)
    .delete({ count: 'exact' })
    .lt('date', cutoff.toISOString().split('T')[0]);

  if (error) {
    console.error('[strava-history] prune error:', error);
    return 0;
  }

  return count ?? 0;
}

// ============================================
// Backfill enrichment for existing activities
// ============================================

export async function backfillEnrichment(
  accessToken: string,
  batchSize = 10,
): Promise<{ enriched: number; errors: string[] }> {
  const errors: string[] = [];

  // Find activities without enrichment
  const { data, error } = await supabase
    .from(ACTIVITIES_TABLE)
    .select('strava_activity_id')
    .is('extras', null)
    .order('date', { ascending: false })
    .limit(batchSize);

  if (error || !data?.length) {
    return { enriched: 0, errors: error ? [error.message] : [] };
  }

  const ids = data.map((r) => r.strava_activity_id);
  const enriched = await enrichNewActivities(accessToken, ids);

  console.log(`[strava-history] Backfill: enriched ${enriched}/${ids.length}`);
  return { enriched, errors };
}
