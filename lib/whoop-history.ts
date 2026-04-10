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
} from './whoop-client';
import type { DailySnapshot, WhoopRecovery, WhoopCycle, WhoopWorkout } from '@/types/whoop';

const TABLE = 'whoop_daily_snapshots';

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
  };
}

// ============================================
// Match records to dates
// ============================================

function toDateString(isoString: string): string {
  return isoString.split('T')[0];
}

function findBestWorkout(workouts: WhoopWorkout[], date: string): WhoopWorkout | null {
  const dayWorkouts = workouts
    .filter((w) => toDateString(w.start) === date || toDateString(w.end) === date)
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
  const start = `${today}T00:00:00.000Z`;
  const end = `${today}T23:59:59.999Z`;

  const [recoveries, cycles, workouts] = await Promise.all([
    getRecoveryHistory(accessToken, start, end),
    getCycleHistory(accessToken, start, end),
    getWorkoutHistory(accessToken, start, end),
  ]);

  const snapshot = buildSnapshot(
    today,
    recoveries[0] ?? null,
    cycles[0] ?? null,
    findBestWorkout(workouts, today),
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
  const [recoveries, cycles, workouts] = await Promise.all([
    getRecoveryHistory(accessToken, startISO, endISO),
    getCycleHistory(accessToken, startISO, endISO),
    getWorkoutHistory(accessToken, startISO, endISO),
  ]);

  // Group by date
  const recoveryByDate = new Map(
    recoveries.map((r) => [toDateString(r.created_at), r]),
  );
  const cycleByDate = new Map(
    cycles.map((c) => [toDateString(c.start), c]),
  );

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
      );
      snapshots.push(snapshot);
    } catch (err) {
      errors.push(`${dateStr}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Batch upsert
  if (snapshots.length > 0) {
    const { error } = await supabase
      .from(TABLE)
      .upsert(snapshots, { onConflict: 'date' });

    if (error) {
      errors.push(`Supabase upsert error: ${error.message}`);
    }
  }

  return { inserted: snapshots.length, errors };
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
