/**
 * Test script — renders the daily briefing email with real data and sends it.
 * Usage: npx tsx scripts/test-briefing-email.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually (Next.js handles this normally, but we're outside Next)
const envPath = resolve(__dirname, '..', '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    if (line.startsWith('#') || !line.includes('=')) continue;
    const [key, ...rest] = line.split('=');
    let value = rest.join('=').trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key.trim()] = value;
  }
} catch {
  console.error(`Could not read ${envPath} — run with env vars set directly`);
}

import React from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DailyBriefingEmail from '../emails/daily-briefing-email';
import { recoverySparkline, hrvSparkline, strainSparkline } from '../lib/quickchart';
import type { DailySnapshot } from '../types/whoop';

const TO = 'nathanieldaniels.dev@gmail.com';

// Real data from today's WHOOP pull
const mockSnapshots: DailySnapshot[] = [
  { date: '2026-04-03', recovery_score: 55, hrv: 35.2, resting_heart_rate: 68, spo2: 95.1, skin_temp: 33.5, strain: 8.2, calories: 1850, average_heart_rate: 72, max_heart_rate: 145, workout_sport: null, workout_strain: null, workout_duration_minutes: null, workout_avg_hr: null, workout_max_hr: null, workout_calories: null, sleep_performance: 72, sleep_efficiency: 88, sleep_duration_minutes: 410, sleep_disturbances: 3, sleep_light_minutes: 180, sleep_deep_minutes: 95, sleep_rem_minutes: 105, sleep_debt_minutes: 30, sleep_respiratory_rate: 15.2 },
  { date: '2026-04-04', recovery_score: 42, hrv: 32.1, resting_heart_rate: 70, spo2: 94.8, skin_temp: 33.8, strain: 12.5, calories: 2200, average_heart_rate: 78, max_heart_rate: 162, workout_sport: 'Running', workout_strain: 10.2, workout_duration_minutes: 45, workout_avg_hr: 142, workout_max_hr: 162, workout_calories: 520, sleep_performance: 58, sleep_efficiency: 82, sleep_duration_minutes: 360, sleep_disturbances: 5, sleep_light_minutes: 170, sleep_deep_minutes: 75, sleep_rem_minutes: 85, sleep_debt_minutes: 55, sleep_respiratory_rate: 15.8 },
  { date: '2026-04-05', recovery_score: 48, hrv: 33.8, resting_heart_rate: 69, spo2: 95.3, skin_temp: 33.6, strain: 6.1, calories: 1650, average_heart_rate: 70, max_heart_rate: 120, workout_sport: null, workout_strain: null, workout_duration_minutes: null, workout_avg_hr: null, workout_max_hr: null, workout_calories: null, sleep_performance: 65, sleep_efficiency: 85, sleep_duration_minutes: 390, sleep_disturbances: 4, sleep_light_minutes: 175, sleep_deep_minutes: 85, sleep_rem_minutes: 95, sleep_debt_minutes: 40, sleep_respiratory_rate: 15.5 },
  { date: '2026-04-06', recovery_score: 58, hrv: 36.4, resting_heart_rate: 67, spo2: 95.8, skin_temp: 33.4, strain: 9.8, calories: 1920, average_heart_rate: 74, max_heart_rate: 155, workout_sport: 'Cycling', workout_strain: 8.5, workout_duration_minutes: 60, workout_avg_hr: 135, workout_max_hr: 155, workout_calories: 480, sleep_performance: 74, sleep_efficiency: 89, sleep_duration_minutes: 420, sleep_disturbances: 2, sleep_light_minutes: 185, sleep_deep_minutes: 100, sleep_rem_minutes: 110, sleep_debt_minutes: 20, sleep_respiratory_rate: 15.0 },
  { date: '2026-04-07', recovery_score: 52, hrv: 34.9, resting_heart_rate: 68, spo2: 94.2, skin_temp: 33.7, strain: 11.3, calories: 2100, average_heart_rate: 76, max_heart_rate: 158, workout_sport: 'Running', workout_strain: 9.8, workout_duration_minutes: 35, workout_avg_hr: 148, workout_max_hr: 158, workout_calories: 410, sleep_performance: 68, sleep_efficiency: 86, sleep_duration_minutes: 400, sleep_disturbances: 3, sleep_light_minutes: 178, sleep_deep_minutes: 90, sleep_rem_minutes: 100, sleep_debt_minutes: 35, sleep_respiratory_rate: 15.3 },
  { date: '2026-04-08', recovery_score: 62, hrv: 38.7, resting_heart_rate: 66, spo2: 97.3, skin_temp: 33.3, strain: 4.2, calories: 1480, average_heart_rate: 68, max_heart_rate: 110, workout_sport: null, workout_strain: null, workout_duration_minutes: null, workout_avg_hr: null, workout_max_hr: null, workout_calories: null, sleep_performance: 80, sleep_efficiency: 91, sleep_duration_minutes: 445, sleep_disturbances: 1, sleep_light_minutes: 190, sleep_deep_minutes: 110, sleep_rem_minutes: 120, sleep_debt_minutes: 10, sleep_respiratory_rate: 14.8 },
  { date: '2026-04-09', recovery_score: 75, hrv: 40.7, resting_heart_rate: 67, spo2: 93.8, skin_temp: 34.2, strain: 7.5, calories: 1780, average_heart_rate: 71, max_heart_rate: 138, workout_sport: 'Swimming', workout_strain: 6.2, workout_duration_minutes: 40, workout_avg_hr: 128, workout_max_hr: 138, workout_calories: 320, sleep_performance: 82, sleep_efficiency: 92, sleep_duration_minutes: 450, sleep_disturbances: 1, sleep_light_minutes: 192, sleep_deep_minutes: 115, sleep_rem_minutes: 118, sleep_debt_minutes: 5, sleep_respiratory_rate: 14.6 },
  { date: '2026-04-10', recovery_score: 81, hrv: 42.0, resting_heart_rate: 64, spo2: 94.6, skin_temp: 33.7, strain: 0.2, calories: 572, average_heart_rate: 65, max_heart_rate: 104, workout_sport: null, workout_strain: null, workout_duration_minutes: null, workout_avg_hr: null, workout_max_hr: null, workout_calories: null, sleep_performance: 88, sleep_efficiency: 94, sleep_duration_minutes: 470, sleep_disturbances: 0, sleep_light_minutes: 195, sleep_deep_minutes: 125, sleep_rem_minutes: 130, sleep_debt_minutes: 0, sleep_respiratory_rate: 14.4 },
];

async function main() {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('RESEND_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('Building chart URLs...');
  const recoveryChartUrl = recoverySparkline(mockSnapshots, 7);
  const hrvChartUrl = hrvSparkline(mockSnapshots, 7);
  const strainChartUrl = strainSparkline(mockSnapshots, 7);

  console.log('Rendering email template...');
  const element = DailyBriefingEmail({
    date: '2026-04-10',
    recoveryScore: 81,
    recoveryColor: 'green',
    headline: 'Strongest recovery in a week — body is primed for race day tomorrow.',
    nextRaceName: 'AlphaWin Napa Valley Triathlon',
    nextRaceDaysOut: 1,
    nextRaceDistance: 'Sprint — 750m swim · 20km bike · 5km run',
    nationalsDaysOut: 121,
    periodizationPhase: 'BUILD',
    trainingCall: 'Race prep only. 15-min shakeout jog at conversational pace, dynamic stretching, 5-min race visualization. Lay out transition gear tonight. Early dinner, hydrate, lights out by 10pm. Trust the training — the hay is in the barn.',
    keyNumbers: [
      { label: 'HRV', value: '42.0 ms', baseline: '38.0 ms', trend: 'up' },
      { label: 'RHR', value: '64 bpm', baseline: '66 bpm', trend: 'up' },
      { label: 'SpO2', value: '94.6%', baseline: '95.6%', trend: 'warning' },
    ],
    coachNote: "Patrick — 81 recovery, HRV at a personal high, three straight days of green. You're walking into Napa Valley in the best shape of the past two weeks. Don't overthink the swim start, settle into your rhythm on the bike, and unleash on the run. This is your first race of the season — set the tone. Life is hard. Be harder.",
    recoveryChartUrl,
    hrvChartUrl,
    strainChartUrl,
  });

  const html = await render(element);

  console.log(`Sending to ${TO}...`);
  const resend = new Resend(resendKey);

  const result = await resend.emails.send({
    from: 'Coach AI <patrick@patrickwingert.com>',
    to: TO,
    subject: 'Daily Briefing — 2026-04-10 | 1d to AlphaWin Napa Valley Triathlon',
    html,
    text: 'Recovery: 81 (GREEN) — Strongest recovery in a week. Race prep day. Full HTML email — view in a client that supports HTML.',
  });

  console.log('Sent!', result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
