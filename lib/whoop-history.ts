// ============================================
// WHOOP History — Daily Snapshot Storage
//
// Fetches recovery + cycle + workout data for a given date,
// merges into a single DailySnapshot row, and upserts to Supabase.
//
// Table: whoop_daily_snapshots
//   date                  DATE UNIQUE
//   recovery_score        SMALLINT
//   hrv, spo2, strain...  (see types/whoop.ts DailySnapshot)
// ============================================

import { supabase } from './supabase';
import {
  getRecoveryHistory,
  getCycleHistory,
  getWorkoutHistory,
  getSleepHistory,
} from './whoop-client';
import type { DailySnapshot, WorkoutRecord, WhoopRecovery, WhoopCycle, WhoopWorkout, WhoopSleep } from '@/types/whoop';

const TABLE = 'whoop_daily_snapshots';
const WORKOUTS_TABLE = 'whoop_workouts';

// Minimum workout duration to include (matches whoop-client.ts)
const MIN_WORKOUT_DURATION_MINUTES = 19;

// ============================================
// Build a snapshot from raw API data
// ============================================

function buildSnapshot(
  date: string,
  recovery: WhoopRecovery | null,
  cycle: WhoopCycle | null,
  workout: WhoopWorkout | null,
  sleep: WhoopSleep | null = null,
): DailySnapshot {
  const workoutDuration = workout?.start && workout?.end
    ? Math.round((new Date(workout.end).getTime() - new Date(workout.start).getTime()) / 60000)
    : null;

  const workoutCals = workout?.score?.kilojoule
    ? Math.round(workout.score.kilojoule * 0.239)
    : null;

  const cycleCals = cycle?.score?.kilojoule
    ? Math.round(cycle.score.kilojoule * 0.239)
    : null;

  const stages = sleep?.score?.stage_summary;
  const sleepDuration = stages
    ? Math.round((stages.total_in_bed_time_milli - stages.total_awake_time_milli) / 60000)
    : null;
  const sleepDebt = sleep?.score?.sleep_needed?.need_from_sleep_debt_milli
    ? Math.round(sleep.score.sleep_needed.need_from_sleep_debt_milli / 60000)
    : null;

  return {
    date,
    recovery_score: recovery?.score?.recovery_score ?? null,
    resting_heart_rate: recovery?.score?.resting_heart_rate ?? null,
    hrv: recovery?.score?.hrv_rmssd_milli ?? null,
    spo2: recovery?.score?.spo2_percentage ?? null,
    skin_temp: recovery?.score?.skin_temp_celsius ?? null,
    strain: cycle?.score?.strain ?? null,
    calories: cycleCals,
    average_heart_rate: cycle?.score?.average_heart_rate ?? null,
    max_heart_rate: cycle?.score?.max_heart_rate ?? null,
    workout_sport: workout?.sport_name ?? null,
    workout_strain: workout?.score?.strain ?? null,
    workout_duration_minutes: workoutDuration,
    workout_avg_hr: workout?.score?.average_heart_rate ?? null,
    workout_max_hr: workout?.score?.max_heart_rate ?? null,
    workout_calories: workoutCals,
    sleep_performance: sleep?.score?.sleep_performance_percentage ?? null,
    sleep_efficiency: sleep?.score?.sleep_efficiency_percentage ?? null,
    sleep_duration_minutes: sleepDuration,
    sleep_disturbances: stages?.disturbance_count ?? null,
    sleep_light_minutes: stages ? Math.round(stages.total_light_sleep_time_milli / 60000) : null,
    sleep_deep_minutes: stages ? Math.round(stages.total_slow_wave_sleep_time_milli / 60000) : null,
    sleep_rem_minutes: stages ? Math.round(stages.total_rem_sleep_time_milli / 60000) : null,
    sleep_debt_minutes: sleepDebt,
    sleep_respiratory_rate: sleep?.score?.respiratory_rate ?? null,
  };
}

// ============================================
// Match records to dates
// ============================================

function toDateString(isoString: string): string {
  return isoString.split('T')[0];
}

/**
 * Convert a UTC ISO timestamp to a local date string using a WHOOP timezone offset.
 * WHOOP offsets are like "-05:00" or "+05:30".
 * A workout at 2026-04-17T01:30:00Z with offset "-05:00" → 2026-04-16 (8:30pm CDT).
 */
function toLocalDateString(isoString: string, timezoneOffset?: string): string {
  if (!timezoneOffset) return toDateString(isoString);
  const dt = new Date(isoString);
  const match = timezoneOffset.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!match) return toDateString(isoString);
  const sign = match[1] === '+' ? 1 : -1;
  const offsetMinutes = sign * (parseInt(match[2]) * 60 + parseInt(match[3]));
  const local = new Date(dt.getTime() + offsetMinutes * 60000);
  return local.toISOString().split('T')[0];
}

function findBestWorkout(workouts: WhoopWorkout[], date: string): WhoopWorkout | null {
  const dayWorkouts = workouts
    .filter((w) => {
      if (!w.start) return false;
      // Use start date in the athlete's LOCAL timezone as the canonical date.
      // A workout at 8pm CDT (1am UTC next day) belongs to the day it was performed.
      const startDate = toLocalDateString(w.start, w.timezone_offset);
      return startDate === date;
    })
    .filter((w) => {
      if (!w.start || !w.end) return false;
      const dur = (new Date(w.end).getTime() - new Date(w.start).getTime()) / 60000;
      return dur >= MIN_WORKOUT_DURATION_MINUTES;
    })
    .sort((a, b) => (b.score?.strain ?? 0) - (a.score?.strain ?? 0));

  return dayWorkouts[0] ?? null;
}

// ============================================
// Snapshot a single day (for daily cron)
// ============================================

export async function snapshotToday(accessToken: string): Promise<DailySnapshot> {
  const today = new Date().toISOString().split('T')[0];
  // Extend workout fetch range by 1 day in each direction to catch workouts
  // that cross UTC midnight (e.g., 8pm CDT = 1am UTC next day).
  // findBestWorkout filters by local date, so extra results are harmless.
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const start = `${yesterday}T00:00:00.000Z`;
  const end = `${today}T23:59:59.999Z`;

  const [recoveries, cycles, workouts, sleeps] = await Promise.all([
    getRecoveryHistory(accessToken, start, end),
    getCycleHistory(accessToken, start, end),
    getWorkoutHistory(accessToken, start, end),
    getSleepHistory(accessToken, 1).catch(() => []),
  ]);

  // Find the most recent non-nap sleep
  const latestSleep = sleeps.find((s) => !s.nap && s.score_state === 'SCORED') ?? null;

  const snapshot = buildSnapshot(
    today,
    recoveries[0] ?? null,
    cycles[0] ?? null,
    findBestWorkout(workouts, today),
    latestSleep,
  );

  await upsertSnapshot(snapshot);
  return snapshot;
}

// ============================================
// Backfill N days of history
// ============================================

export async function backfillHistory(
  accessToken: string,
  days: number = 90,
): Promise<{ inserted: number; errors: string[] }> {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const startISO = start.toISOString();
  const endISO = end.toISOString();

  // Fetch all history in parallel
  const [recoveries, cycles, workouts, sleeps] = await Promise.all([
    getRecoveryHistory(accessToken, startISO, endISO),
    getCycleHistory(accessToken, startISO, endISO),
    getWorkoutHistory(accessToken, startISO, endISO),
    getSleepHistory(accessToken, days).catch(() => []),
  ]);

  // Group by date
  const recoveryByDate = new Map(
    recoveries.map((r) => [toDateString(r.created_at), r]),
  );
  const cycleByDate = new Map(
    cycles.map((c) => [toDateString(c.start), c]),
  );
  // Group sleep by date (non-nap, scored only)
  const sleepByDate = new Map<string, typeof sleeps[0]>();
  for (const s of sleeps) {
    if (!s.nap && s.score_state === 'SCORED') {
      const d = toDateString(s.created_at);
      if (!sleepByDate.has(d)) sleepByDate.set(d, s);
    }
  }

  // Build snapshots for each day
  const snapshots: DailySnapshot[] = [];
  const errors: string[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    try {
      const snapshot = buildSnapshot(
        dateStr,
        recoveryByDate.get(dateStr) ?? null,
        cycleByDate.get(dateStr) ?? null,
        findBestWorkout(workouts, dateStr),
        sleepByDate.get(dateStr) ?? null,
      );
      snapshots.push(snapshot);
    } catch (err) {
      errors.push(`${dateStr}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Batch upsert
  let inserted = 0;
  if (snapshots.length > 0) {
    const { error } = await supabase
      .from(TABLE)
      .upsert(snapshots, { onConflict: 'date' });

    if (error) {
      errors.push(`Supabase upsert error: ${error.message}`);
    } else {
      inserted = snapshots.length;
    }
  }

  return { inserted, errors };
}

// ============================================
// Read snapshots for AI briefing
// ============================================

export async function getSnapshots(days: number = 90): Promise<DailySnapshot[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .gte('date', cutoff.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('[whoop-history] getSnapshots error:', error);
    return [];
  }

  return (data ?? []) as DailySnapshot[];
}

// ============================================
// Cleanup old snapshots (keep 90 days)
// ============================================

export async function pruneOldSnapshots(): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const { count, error } = await supabase
    .from(TABLE)
    .delete({ count: 'exact' })
    .lt('date', cutoff.toISOString().split('T')[0]);

  if (error) {
    console.error('[whoop-history] prune error:', error);
    return 0;
  }

  return count ?? 0;
}

// ============================================
// Workout Storage — ALL workouts, no filtering
// ============================================

function buildWorkoutRecord(workout: WhoopWorkout): WorkoutRecord {
  const duration = workout.start && workout.end
    ? Math.round((new Date(workout.end).getTime() - new Date(workout.start).getTime()) / 60000)
    : null;

  const calories = workout.score?.kilojoule
    ? Math.round(workout.score.kilojoule * 0.239)
    : null;

  const zones = workout.score?.zone_durations;

  return {
    whoop_workout_id: workout.id,
    date: toDateString(workout.start),
    sport_name: workout.sport_name ?? null,
    strain: workout.score?.strain ?? null,
    avg_hr: workout.score?.average_heart_rate ?? null,
    max_hr: workout.score?.max_heart_rate ?? null,
    duration_minutes: duration,
    calories,
    distance_meters: workout.score?.distance_meter ?? null,
    zone_zero_ms: zones?.zone_zero_milli ?? null,
    zone_one_ms: zones?.zone_one_milli ?? null,
    zone_two_ms: zones?.zone_two_milli ?? null,
    zone_three_ms: zones?.zone_three_milli ?? null,
    zone_four_ms: zones?.zone_four_milli ?? null,
    zone_five_ms: zones?.zone_five_milli ?? null,
    score_state: workout.score_state ?? null,
  };
}

export async function saveAllWorkouts(
  accessToken: string,
): Promise<{ saved: number; errors: string[] }> {
  const today = new Date().toISOString().split('T')[0];
  const start = `${today}T00:00:00.000Z`;
  const end = `${today}T23:59:59.999Z`;
  const errors: string[] = [];

  const workouts = await getWorkoutHistory(accessToken, start, end);
  if (workouts.length === 0) return { saved: 0, errors };

  const records = workouts.map(buildWorkoutRecord);

  const { error } = await supabase
    .from(WORKOUTS_TABLE)
    .upsert(records, { onConflict: 'whoop_workout_id' });

  if (error) {
    errors.push(`Supabase upsert error: ${error.message}`);
    return { saved: 0, errors };
  }

  return { saved: records.length, errors };
}

export async function backfillWorkouts(
  accessToken: string,
  days: number = 90,
): Promise<{ saved: number; errors: string[] }> {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const errors: string[] = [];
  const workouts = await getWorkoutHistory(accessToken, start.toISOString(), end.toISOString());

  if (workouts.length === 0) return { saved: 0, errors };

  const records = workouts.map(buildWorkoutRecord);

  const { error } = await supabase
    .from(WORKOUTS_TABLE)
    .upsert(records, { onConflict: 'whoop_workout_id' });

  if (error) {
    errors.push(`Supabase upsert error: ${error.message}`);
    return { saved: 0, errors };
  }

  return { saved: records.length, errors };
}

export async function getWorkouts(days: number = 90): Promise<WorkoutRecord[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const { data, error } = await supabase
    .from(WORKOUTS_TABLE)
    .select('*')
    .gte('date', cutoff.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    console.error('[whoop-history] getWorkouts error:', error);
    return [];
  }

  return (data ?? []) as WorkoutRecord[];
}

// ============================================
// Supabase write
// ============================================

async function upsertSnapshot(snapshot: DailySnapshot): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert(snapshot, { onConflict: 'date' });

  if (error) {
    console.error('[whoop-history] upsertSnapshot error:', error);
    throw error;
  }
}
