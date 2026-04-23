import type { DailySnapshot, WorkoutRecord } from '@/types/whoop';

// Non-training activities to filter from charts
const NON_TRAINING = new Set([
  'steam-room', 'percussive-massage', 'sauna', 'ice-bath',
  'meditation', 'stretching', 'massage', 'cold-plunge',
  'breathwork', 'dog-walking', 'activity',
  'cold-shower', 'red_light_therapy', 'red-light-therapy',
]);

// Sport colors — matches quickchart.ts palette
export const SPORT_COLORS: Record<string, string> = {
  running: '#ef4444',
  cycling: '#3b82f6',
  spin: '#8b5cf6',
  swimming: '#06b6d4',
  triathlon: '#f97316',
  'strength-training': '#d946ef',
  weightlifting: '#d946ef',
  'functional-fitness': '#d946ef',
  yoga: '#10b981',
  hiking: '#84cc16',
  ultimate: '#f59e0b',
  other: '#6b7280',
};

// Zone colors for HR distribution
export const ZONE_COLORS = [
  '#3b82f6', // Z1 blue
  '#22c55e', // Z2 green
  '#eab308', // Z3 yellow
  '#f97316', // Z4 orange
  '#ef4444', // Z5 red
];

export function isTrainingActivity(sport: string | null): boolean {
  return sport != null && !NON_TRAINING.has(sport);
}

// Recovery trend data for Recharts
export function recoveryTrendData(snapshots: DailySnapshot[]) {
  return snapshots.map(s => ({
    date: s.date,
    recovery: s.recovery_score,
    hrv: s.hrv ? Math.round(s.hrv * 10) / 10 : null,
    rhr: s.resting_heart_rate,
    strain: s.strain ? Math.round(s.strain * 10) / 10 : null,
    zone: s.recovery_score != null
      ? s.recovery_score >= 67 ? 'green' : s.recovery_score >= 34 ? 'yellow' : 'red'
      : null,
  }));
}

// Weekly training load aggregation
export function weeklyTrainingLoad(snapshots: DailySnapshot[], weeks = 4) {
  const recent = snapshots.slice(-(weeks * 7));
  const buckets: { label: string; strain: number; workouts: number }[] = [];

  for (let w = 0; w < weeks; w++) {
    const start = w * 7;
    const weekSnaps = recent.slice(start, start + 7);
    if (weekSnaps.length === 0) continue;

    buckets.push({
      label: `${weekSnaps[0].date.slice(5)} – ${weekSnaps[weekSnaps.length - 1].date.slice(5)}`,
      strain: Math.round(weekSnaps.reduce((sum, s) => sum + (s.strain ?? 0), 0) * 10) / 10,
      workouts: weekSnaps.filter(s => isTrainingActivity(s.workout_sport)).length,
    });
  }
  return buckets;
}

const MAX_RATIO = 4.0;

// Recovery-to-load ratio
export function recoveryLoadRatioData(snapshots: DailySnapshot[]) {
  return snapshots.map((s, i) => {
    const recovery = s.recovery_score;
    const strain = s.strain;
    if (recovery == null || strain == null || strain < 2.0) {
      return { date: s.date, ratio: null, movingAvg: null, zone: null };
    }
    const ratio = Math.min(recovery / (strain * 4.76), MAX_RATIO);

    // 7-day moving average
    const window = snapshots.slice(Math.max(0, i - 6), i + 1)
      .map(ws => {
        if (ws.recovery_score == null || ws.strain == null || ws.strain < 2.0) return null;
        return Math.min(ws.recovery_score / (ws.strain * 4.76), MAX_RATIO);
      })
      .filter((v): v is number => v !== null);
    const movingAvg = window.length >= 3 ? window.reduce((a, b) => a + b, 0) / window.length : null;

    return {
      date: s.date,
      ratio: Math.round(ratio * 100) / 100,
      movingAvg: movingAvg ? Math.round(movingAvg * 100) / 100 : null,
      zone: ratio >= 2.5 ? 'green' : ratio >= 1.0 ? 'yellow' : 'red',
    };
  });
}

// HR zone aggregation from workouts
export function hrZoneAggregation(workouts: WorkoutRecord[]) {
  const training = workouts.filter(w => isTrainingActivity(w.sport_name) &&
    (w.zone_one_ms || w.zone_two_ms || w.zone_three_ms || w.zone_four_ms || w.zone_five_ms));

  const msToMin = (ms: number | null) => Math.round((ms || 0) / 60000);

  return {
    zone1: training.reduce((sum, w) => sum + msToMin(w.zone_one_ms), 0),
    zone2: training.reduce((sum, w) => sum + msToMin(w.zone_two_ms), 0),
    zone3: training.reduce((sum, w) => sum + msToMin(w.zone_three_ms), 0),
    zone4: training.reduce((sum, w) => sum + msToMin(w.zone_four_ms), 0),
    zone5: training.reduce((sum, w) => sum + msToMin(w.zone_five_ms), 0),
  };
}

// Days since last swim/bike/run — triathlon counts toward all three
export function daysSinceDisciplines(workouts: WorkoutRecord[], today: string) {
  const swimSports = new Set(['swimming', 'triathlon']);
  const bikeSports = new Set(['cycling', 'spin', 'triathlon']);
  const runSports = new Set(['running', 'triathlon']);

  const todayMs = new Date(today + 'T00:00:00').getTime();
  let lastSwim: string | null = null;
  let lastBike: string | null = null;
  let lastRun: string | null = null;

  for (const w of workouts) {
    const sport = w.sport_name;
    if (!sport) continue;
    if (swimSports.has(sport) && (lastSwim === null || w.date > lastSwim)) lastSwim = w.date;
    if (bikeSports.has(sport) && (lastBike === null || w.date > lastBike)) lastBike = w.date;
    if (runSports.has(sport) && (lastRun === null || w.date > lastRun)) lastRun = w.date;
  }

  const daysBetween = (d: string | null) => {
    if (!d) return null;
    return Math.floor((todayMs - new Date(d + 'T00:00:00').getTime()) / 86400000);
  };

  return { swim: daysBetween(lastSwim), bike: daysBetween(lastBike), run: daysBetween(lastRun) };
}

// Race readiness composite score
export function raceReadinessScore(snapshots: DailySnapshot[], workouts: WorkoutRecord[]) {
  const last7 = snapshots.slice(-7);
  const avgRecovery = last7.filter(s => s.recovery_score != null)
    .reduce((sum, s) => sum + s.recovery_score!, 0)
    / Math.max(1, last7.filter(s => s.recovery_score != null).length);

  const last14 = snapshots.slice(-14);
  const workoutDays = last14.filter(s => isTrainingActivity(s.workout_sport)).length;
  const consistency = Math.min(100, Math.round(((workoutDays / 14) * 7 / 5) * 100));

  // Discipline balance (swim/bike/run)
  const sportMinutes: Record<string, number> = {};
  for (const w of workouts) {
    if (w.sport_name && isTrainingActivity(w.sport_name)) {
      sportMinutes[w.sport_name] = (sportMinutes[w.sport_name] || 0) + (w.duration_minutes || 0);
    }
  }
  const swimMin = sportMinutes['swimming'] || 0;
  const bikeMin = (sportMinutes['cycling'] || 0) + (sportMinutes['spin'] || 0);
  const runMin = sportMinutes['running'] || 0;
  const triTotal = swimMin + bikeMin + runMin;
  let balance = 0;
  if (triTotal > 0) {
    const pcts = [swimMin, bikeMin, runMin].map(m => (m / triTotal) * 100).filter(p => p > 0);
    if (pcts.length >= 2) {
      const ideal = 100 / pcts.length;
      const deviation = pcts.reduce((sum, p) => sum + Math.abs(p - ideal), 0) / 2;
      balance = Math.round(Math.max(0, 100 - deviation * 2));
    } else {
      balance = 20;
    }
  }

  const recovery = Math.min(100, Math.round(avgRecovery));
  const score = Math.round(recovery * 0.4 + consistency * 0.35 + balance * 0.25);

  return { score, recovery, consistency, balance };
}

// Consistency calendar — 28-day workout heatmap data
export function consistencyCalendarData(snapshots: DailySnapshot[], workouts: WorkoutRecord[]) {
  const last28 = snapshots.slice(-28);
  const workoutsByDate = new Map<string, WorkoutRecord[]>();
  for (const w of workouts) {
    if (!isTrainingActivity(w.sport_name)) continue;
    const existing = workoutsByDate.get(w.date) || [];
    existing.push(w);
    workoutsByDate.set(w.date, existing);
  }

  return last28.map(s => ({
    date: s.date,
    strain: s.strain,
    recovery: s.recovery_score,
    workouts: workoutsByDate.get(s.date) || [],
    sport: s.workout_sport,
  }));
}

// Discipline balance for doughnut chart
export function disciplineBalanceData(workouts: WorkoutRecord[]) {
  const minutes: Record<string, number> = {};
  for (const w of workouts) {
    if (!w.sport_name || !isTrainingActivity(w.sport_name)) continue;
    const sport = w.sport_name;
    minutes[sport] = (minutes[sport] || 0) + (w.duration_minutes || 0);
  }

  return Object.entries(minutes)
    .map(([sport, mins]) => ({
      sport,
      minutes: Math.round(mins),
      color: SPORT_COLORS[sport] || SPORT_COLORS.other,
    }))
    .sort((a, b) => b.minutes - a.minutes);
}
