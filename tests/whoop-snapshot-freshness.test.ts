import test from 'node:test';
import assert from 'node:assert/strict';

import { selectSnapshotSourcesForDate } from '../lib/whoop-snapshot-freshness';
import type { WhoopCycle, WhoopRecovery, WhoopSleep } from '../types/whoop';

function recovery(date: string, score: number): WhoopRecovery {
  return {
    cycle_id: 1,
    sleep_id: `sleep-${date}`,
    user_id: 1,
    created_at: `${date}T14:40:00.000Z`,
    updated_at: `${date}T14:45:00.000Z`,
    score_state: 'SCORED',
    score: {
      user_calibrating: false,
      recovery_score: score,
      resting_heart_rate: score === 73 ? 60 : 61,
      hrv_rmssd_milli: score === 73 ? 32.98233 : 23.5285,
      spo2_percentage: score === 73 ? 98.5 : 97.2,
      skin_temp_celsius: score === 73 ? 35.229668 : 34.990665,
    },
  };
}

function cycle(date: string, strain: number): WhoopCycle {
  return {
    id: 1,
    user_id: 1,
    created_at: `${date}T14:00:00.000Z`,
    updated_at: `${date}T14:01:00.000Z`,
    start: `${date}T12:00:00.000Z`,
    end: `${date}T23:59:59.000Z`,
    timezone_offset: '-05:00',
    score_state: 'SCORED',
    score: {
      strain,
      kilojoule: 2700,
      average_heart_rate: 59,
      max_heart_rate: 88,
    },
  };
}

function sleep(wakeDate: string, performance: number): WhoopSleep {
  return {
    id: `sleep-${wakeDate}`,
    cycle_id: 1,
    user_id: 1,
    created_at: `${wakeDate}T14:30:00.000Z`,
    updated_at: `${wakeDate}T14:35:00.000Z`,
    start: `${wakeDate}T05:00:00.000Z`,
    end: `${wakeDate}T12:30:00.000Z`,
    timezone_offset: '-05:00',
    nap: false,
    score_state: 'SCORED',
    score: {
      stage_summary: {
        total_in_bed_time_milli: 8 * 60 * 60 * 1000,
        total_awake_time_milli: 30 * 60 * 1000,
        total_no_data_time_milli: 0,
        total_light_sleep_time_milli: 260 * 60 * 1000,
        total_slow_wave_sleep_time_milli: 104 * 60 * 1000,
        total_rem_sleep_time_milli: 87 * 60 * 1000,
        sleep_cycle_count: 4,
        disturbance_count: 19,
      },
      sleep_needed: {
        baseline_milli: 8 * 60 * 60 * 1000,
        need_from_sleep_debt_milli: 14 * 60 * 1000,
        need_from_recent_strain_milli: 0,
        need_from_recent_nap_milli: 0,
      },
      respiratory_rate: 16.4648,
      sleep_performance_percentage: performance,
      sleep_consistency_percentage: 90,
      sleep_efficiency_percentage: 92,
    },
  };
}

test('does not use yesterday recovery or sleep for today snapshot', () => {
  const sources = selectSnapshotSourcesForDate({
    date: '2026-05-17',
    recoveries: [recovery('2026-05-16', 42)],
    cycles: [cycle('2026-05-17', 0.4), cycle('2026-05-16', 17.1)],
    workouts: [],
    sleeps: [sleep('2026-05-16', 97)],
  });

  assert.equal(sources.recovery, null);
  assert.equal(sources.sleep, null);
  assert.equal(sources.cycle?.score?.strain, 0.4);
  assert.deepEqual(sources.missingRequiredSources, ['recovery', 'sleep']);
});

test('selects same-day recovery and sleep even when older records are first', () => {
  const sources = selectSnapshotSourcesForDate({
    date: '2026-05-17',
    recoveries: [recovery('2026-05-16', 42), recovery('2026-05-17', 73)],
    cycles: [cycle('2026-05-16', 17.1), cycle('2026-05-17', 0.4)],
    workouts: [],
    sleeps: [sleep('2026-05-16', 97), sleep('2026-05-17', 96)],
  });

  assert.equal(sources.recovery?.score?.recovery_score, 73);
  assert.equal(sources.sleep?.score?.sleep_performance_percentage, 96);
  assert.equal(sources.cycle?.score?.strain, 0.4);
  assert.deepEqual(sources.missingRequiredSources, []);
});
