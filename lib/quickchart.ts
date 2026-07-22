// ============================================
// QuickChart URL Builders
//
// Generates chart image URLs via quickchart.io
// for embedding in emails. Each function returns
// a URL that renders as a PNG when used in <img>.
//
// Ported from patrick-wingert-site/lib/quickchart.ts
// All functions are data-generic — they accept plain
// arrays matching the athlete_snapshots / athlete_workouts
// DB schema shapes.
// ============================================

const BASE = 'https://quickchart.io/chart';
const ORANGE = '#f97316';
const GREEN = '#22c55e';
const YELLOW = '#eab308';
const RED = '#ef4444';
const BG = '#050505';
const GRID = 'rgba(255,255,255,0.035)';
const AXIS = 'rgba(255,255,255,0.12)';
const LABEL_COLOR = 'rgba(255,255,255,0.46)';
const DAILY_LINE = 'rgba(255,255,255,0.34)';
const STACK_DIVIDER = '#050505';
const ACTIVITY_COLOR_PALETTE = [
  '#8b5cf6',
  '#ef4444',
  '#d946ef',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#14b8a6',
  '#facc15',
  '#ec4899',
  '#38bdf8',
  '#a855f7',
  '#f59e0b',
  '#22c55e',
  '#64748b',
];

// Sport-specific colors for discipline chart
export const SPORT_COLORS: Record<string, string> = {
  'running': '#ef4444',
  'cycling': '#3b82f6',
  'spin': '#8b5cf6',
  'swimming': '#06b6d4',
  'triathlon': ORANGE,
  'strength-training': '#d946ef',
  'weightlifting': '#d946ef',
  'functional-fitness': '#d946ef',
  'strength': '#d946ef',
  'bodybuilding': '#7c8798',
  'workout': '#f59e0b',
  'walking': '#84cc16',
  'massage-therapy': '#f97316',
  'yoga': '#10b981',
  'hiking': '#84cc16',
  'cardio': '#f59e0b',
  'ultimate': '#f59e0b',
  'other': '#6b7280',
};

// Shape matching athlete_snapshots DB rows (WHOOP-sourced)
export interface DailySnapshot {
  date: string;
  recovery_score: number | null;
  hrv: number | null;
  strain: number | null;
  sleep_performance?: number | null;
  workout_sport: string | null;
}

export interface FitnessFormSnapshot {
  date: string;
  ctl: number | null;
  atl: number | null;
  tsb: number | null;
  readiness_score?: number | null;
}

function encode(config: object): string {
  return `${BASE}?c=${encodeURIComponent(JSON.stringify(config))}&w=480&h=130&bkg=${encodeURIComponent(BG)}&f=png&devicePixelRatio=2`;
}

export function encodeLarge(config: object, w = 480, h = 300): string {
  return `${BASE}?c=${encodeURIComponent(JSON.stringify(config))}&w=${w}&h=${h}&bkg=${encodeURIComponent(BG)}&f=png&devicePixelRatio=2`;
}

function recentDays(snapshots: DailySnapshot[], days: number): DailySnapshot[] {
  return snapshots.slice(-days);
}

function formatDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

function uniqueActivityColors(sports: string[]): Record<string, string> {
  const colors: Record<string, string> = {};
  const used = new Set<string>();
  let paletteIndex = 0;

  for (const sport of sports) {
    let color = SPORT_COLORS[sport];

    if (!color || used.has(color.toLowerCase())) {
      while (
        paletteIndex < ACTIVITY_COLOR_PALETTE.length &&
        used.has(ACTIVITY_COLOR_PALETTE[paletteIndex].toLowerCase())
      ) {
        paletteIndex += 1;
      }
      color = ACTIVITY_COLOR_PALETTE[paletteIndex] || '#6b7280';
      paletteIndex += 1;
    }

    colors[sport] = color;
    used.add(color.toLowerCase());
  }

  return colors;
}

export function fitnessFormChart(snapshots: FitnessFormSnapshot[], days = 21): string {
  const recent = snapshots
    .filter((s) => s.ctl != null && s.atl != null && s.tsb != null)
    .slice(-days);
  if (recent.length < 5) return '';

  const labels = recent.map((s, index) => index % 3 === 0 || index === recent.length - 1 ? formatDate(s.date) : '');
  const tsbValues = recent.map((s) => Math.round((s.tsb ?? 0) * 10) / 10);

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Fitness',
          data: recent.map((s) => Math.round((s.ctl ?? 0) * 10) / 10),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.08)',
          borderWidth: 2.5,
          pointRadius: 0,
          fill: false,
          tension: 0.35,
          yAxisID: 'load',
        },
        {
          type: 'line',
          label: 'Fatigue',
          data: recent.map((s) => Math.round((s.atl ?? 0) * 10) / 10),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.08)',
          borderWidth: 2.5,
          pointRadius: 0,
          fill: false,
          tension: 0.35,
          yAxisID: 'load',
        },
        {
          label: 'Form',
          data: tsbValues,
          backgroundColor: tsbValues.map((v) => v >= 5 ? 'rgba(34,197,94,0.75)' : v >= -10 ? 'rgba(234,179,8,0.70)' : 'rgba(239,68,68,0.75)'),
          borderWidth: 0,
          barPercentage: 0.58,
          categoryPercentage: 0.76,
          yAxisID: 'form',
        },
      ],
    },
    options: {
      layout: { padding: { top: 10, right: 6, bottom: 0, left: 0 } },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: LABEL_COLOR,
          fontSize: 10,
          boxWidth: 10,
          padding: 12,
          usePointStyle: true,
        },
      },
      scales: {
        yAxes: [
          {
            id: 'load',
            position: 'left',
            ticks: { fontColor: LABEL_COLOR, fontSize: 10, beginAtZero: true },
            gridLines: { color: GRID, zeroLineColor: AXIS, drawBorder: false },
            scaleLabel: { display: true, labelString: 'CTL / ATL', fontColor: LABEL_COLOR, fontSize: 9 },
          },
          {
            id: 'form',
            position: 'right',
            ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
            gridLines: { display: false, drawBorder: false },
            scaleLabel: { display: true, labelString: 'FORM', fontColor: LABEL_COLOR, fontSize: 9 },
          },
        ],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 9, maxRotation: 0 },
          gridLines: { display: false, drawBorder: false },
        }],
      },
      annotation: {
        annotations: [
          { type: 'line', mode: 'horizontal', scaleID: 'form', value: 0, borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1 },
        ],
      },
    },
  };

  return encodeLarge(config, 480, 230);
}

// ============================================
// Recovery Sparkline — line with green/yellow/red zones
// ============================================

export function recoverySparkline(snapshots: DailySnapshot[], days = 7): string {
  const recent = recentDays(snapshots, days);
  const labels = recent.map((s) => formatDate(s.date));
  const data = recent.map((s) => s.recovery_score ?? null);

  const pointColors = data.map((v) => {
    if (v === null) return LABEL_COLOR;
    if (v >= 67) return GREEN;
    if (v >= 34) return YELLOW;
    return RED;
  });

  const config = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: ORANGE,
        borderWidth: 2.5,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        pointRadius: 4,
        fill: false,
        tension: 0.3,
        spanGaps: true,
      }],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            fontColor: LABEL_COLOR,
            fontSize: 10,
            stepSize: 50,
            callback: (v: number) => {
              if (v === 0) return '0';
              if (v === 50) return '';
              if (v === 100) return '100';
              return '';
            },
          },
          gridLines: { color: GRID, zeroLineColor: GRID },
        }],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { display: false },
        }],
      },
      annotation: {
        annotations: [
          { type: 'box', yMin: 67, yMax: 100, backgroundColor: 'rgba(34,197,94,0.045)', borderWidth: 0 },
          { type: 'box', yMin: 34, yMax: 67, backgroundColor: 'rgba(234,179,8,0.04)', borderWidth: 0 },
          { type: 'box', yMin: 0, yMax: 34, backgroundColor: 'rgba(239,68,68,0.045)', borderWidth: 0 },
        ],
      },
    },
  };

  return encode(config);
}

// ============================================
// HRV Sparkline — line chart with baseline reference
// ============================================

export function hrvSparkline(snapshots: DailySnapshot[], days = 7): string {
  const recent = recentDays(snapshots, days);
  const labels = recent.map((s) => formatDate(s.date));
  const data = recent.map((s) => s.hrv != null ? Math.round(s.hrv * 10) / 10 : null);

  const allHRV = snapshots.filter((s) => s.hrv != null).map((s) => s.hrv!);
  const baseline = allHRV.length > 0
    ? Math.round((allHRV.reduce((a, b) => a + b, 0) / allHRV.length) * 10) / 10
    : null;

  const datasets: any[] = [{
    label: 'HRV',
    data,
    borderColor: ORANGE,
    borderWidth: 2.5,
    pointBackgroundColor: ORANGE,
    pointRadius: 3,
    fill: false,
    tension: 0.3,
    spanGaps: true,
  }];

  if (baseline !== null) {
    datasets.push({
      label: 'Baseline',
      data: new Array(labels.length).fill(baseline),
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      borderDash: [5, 3],
      pointRadius: 0,
      fill: false,
    });
  }

  const config = {
    type: 'line',
    data: { labels, datasets },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { color: GRID, zeroLineColor: GRID },
        }],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { display: false },
        }],
      },
    },
  };

  return encode(config);
}

// ============================================
// Strain Sparkline — bar chart
// ============================================

export function strainSparkline(snapshots: DailySnapshot[], days = 7): string {
  const recent = recentDays(snapshots, days);
  const labels = recent.map((s) => formatDate(s.date));
  const data = recent.map((s) => s.strain != null ? Math.round(s.strain * 10) / 10 : null);

  const barColors = data.map((v) => {
    if (v === null) return LABEL_COLOR;
    if (v >= 14) return RED;
    if (v >= 10) return ORANGE;
    return 'rgba(249,115,22,0.5)';
  });

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: barColors,
        borderRadius: 2,
      }],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: { min: 0, max: 21, fontColor: LABEL_COLOR, fontSize: 10, stepSize: 7 },
          gridLines: { color: GRID, zeroLineColor: GRID },
        }],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { display: false },
        }],
      },
    },
  };

  return encode(config);
}

// ============================================
// Discipline Balance — doughnut chart
// ============================================

export interface DisciplineData {
  [sport: string]: { minutes: number; pct: number };
}

function formatSportName(sport: string): string {
  return sport
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function sportKey(sport: string): string {
  return sport.toLowerCase().trim().replace(/\s+/g, '-');
}

// ============================================
// Training Load Progression — weekly strain totals
// ============================================

export function trainingLoadChart(snapshots: DailySnapshot[], weeks = 4): string {
  if (snapshots.length < 7) return '';

  const weekBuckets: { label: string; strain: number; days: number }[] = [];
  const recent = snapshots.slice(-(weeks * 7));

  for (let w = 0; w < weeks; w++) {
    const start = w * 7;
    const end = start + 7;
    const weekSnaps = recent.slice(start, end);
    if (weekSnaps.length === 0) continue;

    const totalStrain = weekSnaps.reduce((sum, s) => sum + (s.strain ?? 0), 0);
    const firstDate = weekSnaps[0].date;
    const lastDate = weekSnaps[weekSnaps.length - 1].date;
    weekBuckets.push({
      label: `${formatDate(firstDate)}–${formatDate(lastDate)}`,
      strain: Math.round(totalStrain * 10) / 10,
      days: weekSnaps.length,
    });
  }

  if (weekBuckets.length === 0) return '';

  const barColors = weekBuckets.map((w) => {
    if (w.strain >= 80) return RED;
    if (w.strain >= 55) return ORANGE;
    return 'rgba(249,115,22,0.45)';
  });
  const maxStrain = Math.max(...weekBuckets.map((w) => w.strain));
  const yAxisMax = Math.max(10, Math.ceil(maxStrain * 1.16));

  const config = {
    type: 'bar',
    data: {
      labels: weekBuckets.map((w) => w.label),
      datasets: [{
        label: 'Weekly Strain',
        data: weekBuckets.map((w) => w.strain),
        backgroundColor: barColors,
        borderRadius: 4,
      }],
    },
    options: {
      layout: { padding: { top: 18 } },
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10, beginAtZero: true, max: yAxisMax },
          gridLines: { color: GRID, zeroLineColor: GRID },
          scaleLabel: {
            display: true,
            labelString: 'TOTAL STRAIN',
            fontColor: LABEL_COLOR,
            fontSize: 9,
          },
        }],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 9 },
          gridLines: { display: false },
        }],
      },
      plugins: {
        datalabels: {
          color: '#ffffff',
          font: { size: 11, weight: 'bold' },
          anchor: 'end',
          align: 'top',
          clip: false,
          formatter: (v: number) => v.toFixed(0),
        },
      },
    },
  };

  return encodeLarge(config, 480, 200);
}

// ============================================
// Recovery Strain Index — heuristic recovery normalized against WHOOP strain
// ============================================

export function recoveryLoadRatioChart(snapshots: DailySnapshot[], days = 21): string {
  const recent = recentDays(snapshots, days);
  if (recent.length < 5) return '';

  const labels = recent.map((s) => formatDate(s.date));

  const MAX_RATIO = 4.0;
  const ratios = recent.map((s) => {
    const recovery = s.recovery_score;
    const strain = s.strain;
    if (recovery == null || strain == null || strain < 2.0) return null;
    const ratio = recovery / (strain * 4.76);
    return Math.round(Math.min(ratio, MAX_RATIO) * 100) / 100;
  });

  const movingAvg = ratios.map((_, i) => {
    const window = ratios.slice(Math.max(0, i - 6), i + 1).filter((v) => v !== null) as number[];
    return window.length >= 3 ? Math.round((window.reduce((a, b) => a + b, 0) / window.length) * 100) / 100 : null;
  });

  const zoneColor = (v: number | null) => {
    if (v === null) return LABEL_COLOR;
    if (v >= 2.5) return GREEN;
    if (v >= 1.0) return YELLOW;
    return RED;
  };
  const pointColors = ratios.map(zoneColor);

  const config = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Daily Index',
          data: ratios,
          borderColor: DAILY_LINE,
          backgroundColor: DAILY_LINE,
          borderWidth: 2,
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          pointRadius: 4,
          fill: false,
          tension: 0,
          spanGaps: true,
        },
        {
          label: '7-Day Trend',
          data: movingAvg,
          borderColor: ORANGE,
          borderWidth: 2.5,
          pointRadius: 0,
          fill: false,
          tension: 0.4,
          spanGaps: true,
        },
      ],
    },
    options: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: LABEL_COLOR,
          fontSize: 10,
          boxWidth: 20,
          padding: 16,
          usePointStyle: true,
        },
      },
      scales: {
        yAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10, min: 0, max: MAX_RATIO + 0.5, stepSize: 0.5 },
          gridLines: { color: GRID, zeroLineColor: GRID },
          scaleLabel: {
            display: true,
            labelString: 'RECOVERY STRAIN INDEX',
            fontColor: LABEL_COLOR,
            fontSize: 9,
          },
        }],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 9, maxTicksLimit: 7 },
          gridLines: { display: false },
        }],
      },
      annotation: {
        annotations: [
          { type: 'box', yMin: 2.5, yMax: MAX_RATIO + 0.5, backgroundColor: 'rgba(34,197,94,0.06)' },
          { type: 'box', yMin: 1.0, yMax: 2.5, backgroundColor: 'rgba(234,179,8,0.04)' },
          { type: 'box', yMin: 0, yMax: 1.0, backgroundColor: 'rgba(239,68,68,0.06)' },
          { type: 'line', mode: 'horizontal', scaleID: 'y-axis-0', value: 2.5, borderColor: 'rgba(34,197,94,0.5)', borderWidth: 1.5, borderDash: [6, 4] },
          { type: 'line', mode: 'horizontal', scaleID: 'y-axis-0', value: 1.0, borderColor: 'rgba(239,68,68,0.5)', borderWidth: 1.5, borderDash: [6, 4] },
        ],
      },
    },
  };

  return encodeLarge(config, 480, 220);
}

// ============================================
// Race Readiness Score — composite gauge
// ============================================

export interface RaceReadinessInput {
  recoveryTrend: number;       // avg recovery last 7 days (0-100)
  fitnessReadiness?: number | null; // TSB/form readiness from the fitness model (0-100)
  trainingConsistency: number; // workouts per week in last 14 days
  targetWorkoutsPerWeek?: number; // athlete-specific target, defaults to 5
  disciplineBalance: number;   // 0-100, coverage of athlete/race-specific disciplines
  nextRaceName: string;
  disciplineLabel?: string;
}

function clampPct(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export interface RaceReadinessBreakdown {
  score: number;
  recovery: number;
  fitness: number | null;
  consistency: number;
  specificity: number;
  consistencyTarget: number;
  disciplineLabel: string;
}

export function computeReadinessBreakdown(input: RaceReadinessInput): RaceReadinessBreakdown {
  const recovery = clampPct(input.recoveryTrend);
  const fitness = input.fitnessReadiness == null ? null : clampPct(input.fitnessReadiness);
  const consistencyTarget = Math.max(1, input.targetWorkoutsPerWeek ?? 5);
  const consistency = clampPct((input.trainingConsistency / consistencyTarget) * 100);
  const specificity = clampPct(input.disciplineBalance);
  const disciplineLabel = input.disciplineLabel || 'target sport';

  const score = fitness == null
    ? Math.round(recovery * 0.5 + consistency * 0.3 + specificity * 0.2)
    : Math.round(fitness * 0.4 + recovery * 0.35 + consistency * 0.15 + specificity * 0.1);

  return { score, recovery, fitness, consistency, specificity, consistencyTarget, disciplineLabel };
}

export function raceReadinessGauge(input: RaceReadinessInput): string {
  const { score } = computeReadinessBreakdown(input);

  const color = score >= 70 ? GREEN : score >= 45 ? YELLOW : RED;

  const config = {
    type: 'radialGauge',
    data: {
      datasets: [{
        data: [score],
        backgroundColor: color,
        borderWidth: 0,
      }],
    },
    options: {
      trackColor: 'rgba(255,255,255,0.06)',
      roundedCorners: true,
      centerPercentage: 75,
      centerArea: {
        text: `${score}%`,
        fontColor: '#ffffff',
        fontSize: 36,
        subText: input.nextRaceName.split(' ').slice(0, 3).join(' '),
        subFontSize: 10,
        subFontColor: LABEL_COLOR,
      },
    },
  };

  return encodeLarge(config, 300, 300);
}

// ============================================
// Workout Consistency Calendar — 28-day activity view
// ============================================

export interface WorkoutEntry {
  date: string;
  sport: string;
}

export function targetDisciplinesForSport(sport: string): { keys: string[]; label: string } {
  const normalized = sport.toLowerCase();
  if (normalized.includes('triathlon')) {
    return { keys: ['swimming', 'cycling', 'running'], label: 'swim/bike/run' };
  }
  if (normalized.includes('running') || normalized.includes('marathon')) {
    return { keys: ['running'], label: 'run' };
  }
  if (normalized.includes('cycling') || normalized.includes('bike')) {
    return { keys: ['cycling'], label: 'bike' };
  }
  if (normalized.includes('swimming')) {
    return { keys: ['swimming'], label: 'swim' };
  }
  return { keys: ['running', 'cycling', 'strength-training', 'weightlifting', 'functional-fitness'], label: 'training mix' };
}

export function computeSpecificity(
  recentWorkouts: WorkoutEntry[],
  sport: string,
  disciplineBalance?: Record<string, { minutes: number; pct: number }>,
): { score: number; label: string } {
  const target = targetDisciplinesForSport(sport);
  const normalizedKeys = new Set(target.keys.map((key) => key.toLowerCase()));
  const covered = new Set<string>();

  for (const [discipline, data] of Object.entries(disciplineBalance || {})) {
    if ((data.minutes ?? 0) > 0 && normalizedKeys.has(discipline.toLowerCase())) {
      covered.add(discipline.toLowerCase());
    }
  }

  for (const workout of recentWorkouts) {
    const workoutSport = workout.sport.toLowerCase();
    if (workoutSport === 'triathlon') {
      for (const discipline of ['swimming', 'cycling', 'running']) {
        if (normalizedKeys.has(discipline)) covered.add(discipline);
      }
      continue;
    }
    if (normalizedKeys.has(workoutSport)) covered.add(workoutSport);
    if (workoutSport === 'spin' && normalizedKeys.has('cycling')) covered.add('cycling');
  }

  const score = target.keys.length > 0 ? (covered.size / target.keys.length) * 100 : 0;
  return { score, label: target.label };
}

// Recovery/wellness/non-training activities excluded from training charts
const NON_TRAINING: Set<string> = new Set([
  'steam-room', 'percussive-massage', 'sauna', 'ice-bath',
  'meditation', 'stretching', 'massage', 'cold-plunge',
  'breathwork', 'dog-walking', 'activity',
  'massage-therapy',
  'cold-shower', 'red_light_therapy', 'red-light-therapy',
]);

export function consistencyCalendar(snapshots: DailySnapshot[], days = 28, workouts?: WorkoutEntry[]): string {
  const recent = recentDays(snapshots, days);
  if (recent.length < 7) return '';

  const labels = recent.map((s) => {
    const [, m, d] = s.date.split('-');
    return `${parseInt(m)}/${parseInt(d)}`;
  });

  const dateToSports: Record<string, string[]> = {};
  for (const s of recent) {
    dateToSports[s.date] = [];
  }

  const workoutDates = new Set(workouts ? workouts.map((w) => w.date) : []);

  if (workouts && workouts.length > 0) {
    for (const w of workouts) {
      const key = sportKey(w.sport);
      if (dateToSports[w.date] !== undefined && !NON_TRAINING.has(key)) {
        dateToSports[w.date].push(key);
      }
    }
  }

  for (const s of recent) {
    if (!workoutDates.has(s.date) && s.workout_sport) {
      const key = sportKey(s.workout_sport);
      if (!NON_TRAINING.has(key)) dateToSports[s.date].push(key);
    }
  }

  const allSports = Array.from(new Set(
    Object.values(dateToSports).flat().filter((s): s is string => s != null)
  ));

  if (allSports.length === 0) return '';

  const sportColors = uniqueActivityColors(allSports);

  const datasets: any[] = allSports.map((sport) => ({
    label: formatSportName(sport),
    data: recent.map((s) => {
      const count = dateToSports[s.date].filter((sp) => sp === sport).length;
      return count > 0 ? count : null;
    }),
    backgroundColor: sportColors[sport],
    borderColor: STACK_DIVIDER,
    borderWidth: 2,
    borderSkipped: false,
    borderRadius: 2,
  }));

  const config = {
    type: 'bar',
    data: { labels, datasets },
    options: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: LABEL_COLOR,
          fontSize: 9,
          boxWidth: 10,
          padding: 10,
          usePointStyle: true,
        },
      },
      scales: {
        yAxes: [{ display: false, stacked: true, ticks: { min: 0 } }],
        xAxes: [{
          stacked: true,
          ticks: { fontColor: LABEL_COLOR, fontSize: 7, maxRotation: 45 },
          gridLines: { display: false },
        }],
      },
      plugins: { datalabels: { display: false } },
    },
  };

  return encodeLarge(config, 480, 160);
}

// ============================================
// Days Since Last Discipline — sport-aware gap tracker
// ============================================

export interface DaysSinceItem {
  key: string;
  label: string;
  icon: string;
  days: number | null;
}

const DISCIPLINE_CONFIG: Record<string, Array<{ key: string; label: string; icon: string; sports: string[] }>> = {
  triathlon: [
    { key: 'swim', label: 'SWIM', icon: '🏊', sports: ['swimming', 'swim', 'triathlon'] },
    { key: 'bike', label: 'BIKE', icon: '🚴', sports: ['cycling', 'spin', 'spinning', 'triathlon', 'virtualride'] },
    { key: 'run',  label: 'RUN',  icon: '🏃', sports: ['running', 'run', 'triathlon'] },
  ],
  running: [
    { key: 'run',      label: 'RUN',      icon: '🏃', sports: ['running', 'run', 'trail running'] },
    { key: 'strength', label: 'STRENGTH', icon: '💪', sports: ['strength', 'weight training', 'weightlifting', 'functional fitness'] },
  ],
  cycling: [
    { key: 'bike',     label: 'RIDE',     icon: '🚴', sports: ['cycling', 'spin', 'spinning', 'virtualride', 'mountain biking'] },
    { key: 'strength', label: 'STRENGTH', icon: '💪', sports: ['strength', 'weight training', 'weightlifting', 'functional fitness'] },
  ],
  swimming: [
    { key: 'swim',     label: 'SWIM',     icon: '🏊', sports: ['swimming', 'swim'] },
    { key: 'strength', label: 'STRENGTH', icon: '💪', sports: ['strength', 'weight training', 'weightlifting', 'functional fitness'] },
  ],
  'general fitness': [
    { key: 'strength', label: 'STRENGTH', icon: '💪', sports: ['strength', 'weight training', 'weightlifting', 'functional fitness', 'crossfit', 'hiit', 'powerlifting'] },
    { key: 'cardio',   label: 'CARDIO',   icon: '🏃', sports: ['running', 'cycling', 'rowing', 'elliptical', 'stairmaster', 'walking'] },
    { key: 'mobility', label: 'MOBILITY', icon: '🧘', sports: ['yoga', 'pilates', 'stretching', 'meditation'] },
  ],
};

export function computeDaysSince(workouts: WorkoutEntry[], today: string, sport = 'triathlon'): DaysSinceItem[] {
  const config = DISCIPLINE_CONFIG[sport] ?? DISCIPLINE_CONFIG['triathlon'];
  const todayDate = new Date(today + 'T00:00:00');
  const lastDates: Record<string, string | null> = {};
  for (const d of config) lastDates[d.key] = null;

  for (const w of workouts) {
    const s = w.sport.toLowerCase();
    for (const disc of config) {
      if (disc.sports.some(ds => s === ds || s.includes(ds) || ds.includes(s))) {
        if (lastDates[disc.key] === null || w.date > lastDates[disc.key]!) {
          lastDates[disc.key] = w.date;
        }
      }
    }
  }

  const daysBetween = (d: string | null) =>
    d ? Math.floor((todayDate.getTime() - new Date(d + 'T00:00:00').getTime()) / 86400000) : null;

  return config.map(disc => ({
    key: disc.key,
    label: disc.label,
    icon: disc.icon,
    days: daysBetween(lastDates[disc.key]),
  }));
}

// ============================================
// HR Zone Distribution — time in each heart rate zone
// ============================================

export interface WorkoutWithZones {
  date: string;
  sport: string;
  zone_zero_ms: number | null;
  zone_one_ms: number | null;
  zone_two_ms: number | null;
  zone_three_ms: number | null;
  zone_four_ms: number | null;
  zone_five_ms: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hrZoneChart(workouts: WorkoutWithZones[], days = 14): string {
  const training = workouts.filter((w) =>
    !NON_TRAINING.has(sportKey(w.sport)) &&
    (w.zone_one_ms || w.zone_two_ms || w.zone_three_ms || w.zone_four_ms || w.zone_five_ms)
  );
  if (training.length < 2) return '';

  const msToMin = (ms: number | null) => Math.round((ms || 0) / 60000);
  const zones = {
    'Zone 1': training.reduce((sum, w) => sum + msToMin(w.zone_one_ms), 0),
    'Zone 2': training.reduce((sum, w) => sum + msToMin(w.zone_two_ms), 0),
    'Zone 3': training.reduce((sum, w) => sum + msToMin(w.zone_three_ms), 0),
    'Zone 4': training.reduce((sum, w) => sum + msToMin(w.zone_four_ms), 0),
    'Zone 5': training.reduce((sum, w) => sum + msToMin(w.zone_five_ms), 0),
  };

  const zoneColors = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444'];
  const labels = Object.keys(zones);
  const data = Object.values(zones);
  const maxMinutes = Math.max(...data);
  const yAxisMax = Math.max(10, Math.ceil(maxMinutes * 1.12));

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: zoneColors,
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      layout: { padding: { top: 14 } },
      legend: { display: false },
      scales: {
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10, beginAtZero: true },
          gridLines: { color: GRID, zeroLineColor: GRID },
          scaleLabel: { display: true, labelString: 'MINUTES', fontColor: LABEL_COLOR, fontSize: 9 },
        }],
        yAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 11, beginAtZero: true, max: yAxisMax },
          gridLines: { display: false },
        }],
      },
      plugins: {
        datalabels: {
          color: '#ffffff',
          font: { size: 10, weight: 'bold' },
          anchor: 'end',
          align: 'start',
          offset: 2,
          clamp: true,
          clip: false,
        },
      },
    },
  };

  return encodeLarge(config, 480, 200);
}

export function disciplineBalanceChart(disciplines: DisciplineData): string {
  const trainingEntries = Object.entries(disciplines)
    .filter(([sport]) => !NON_TRAINING.has(sportKey(sport)))
    .sort((a, b) => b[1].minutes - a[1].minutes);
  if (trainingEntries.length === 0) return '';

  const totalMin = trainingEntries.reduce((sum, [, d]) => sum + d.minutes, 0);
  const significant: [string, { minutes: number; pct: number }][] = [];
  let otherMin = 0;
  for (const [sport, d] of trainingEntries) {
    if ((d.minutes / totalMin) * 100 >= 3) {
      significant.push([sport, d]);
    } else {
      otherMin += d.minutes;
    }
  }
  if (otherMin > 0) {
    significant.push(['other', { minutes: otherMin, pct: (otherMin / totalMin) * 100 }]);
  }

  const labels = significant.map(([sport]) => formatSportName(sportKey(sport)));
  const data = significant.map(([, d]) => d.minutes);
  const sportColors = uniqueActivityColors(significant.map(([sport]) => sportKey(sport)));
  const colors = significant.map(([sport]) => sportColors[sportKey(sport)]);

  const config = {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: BG,
        borderWidth: 2,
      }],
    },
    options: {
      legend: {
        position: 'right',
        labels: { fontColor: LABEL_COLOR, fontSize: 11, padding: 12, usePointStyle: true },
      },
      plugins: {
        datalabels: {
          color: '#ffffff',
          font: { size: 12, weight: 'bold' },
          formatter: (value: number, ctx: any) => {
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            if (total === 0) return '';
            const pct = Math.round((value / total) * 100);
            return pct >= 4 ? `${pct}%` : '';
          },
        },
      },
      cutoutPercentage: 55,
    },
  };

  return encodeLarge(config, 480, 260);
}
