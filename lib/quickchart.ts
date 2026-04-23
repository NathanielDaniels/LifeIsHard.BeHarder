// ============================================
// QuickChart URL Builders
//
// Generates chart image URLs via quickchart.io
// for embedding in emails. Each function returns
// a URL that renders as a PNG when used in <img>.
// ============================================

import type { DailySnapshot } from '@/types/whoop';

const BASE = 'https://quickchart.io/chart';
const ORANGE = '#f97316';
const GREEN = '#22c55e';
const YELLOW = '#eab308';
const RED = '#ef4444';
const BG = '#0a0a0a';
const GRID = 'rgba(255,255,255,0.06)';
const LABEL_COLOR = 'rgba(255,255,255,0.55)';

// Sport-specific colors for discipline chart — every training sport gets a distinct color
const SPORT_COLORS: Record<string, string> = {
  'running': '#ef4444',      // red
  'cycling': '#3b82f6',      // blue
  'spin': '#8b5cf6',         // violet (distinct from cycling)
  'swimming': '#06b6d4',     // cyan
  'triathlon': ORANGE,       // orange
  'strength-training': '#d946ef', // fuchsia
  'weightlifting': '#d946ef',     // fuchsia (same category)
  'functional-fitness': '#d946ef', // fuchsia (same category)
  'yoga': '#10b981',         // emerald
  'hiking': '#84cc16',       // lime
  'ultimate': '#f59e0b',     // amber
  'other': '#6b7280',        // gray — catch-all bucket
};

function encode(config: object): string {
  return `${BASE}?c=${encodeURIComponent(JSON.stringify(config))}&w=480&h=130&bkg=${encodeURIComponent(BG)}&f=png`;
}

function encodeLarge(config: object, w = 480, h = 300): string {
  return `${BASE}?c=${encodeURIComponent(JSON.stringify(config))}&w=${w}&h=${h}&bkg=${encodeURIComponent(BG)}&f=png`;
}

function recentDays(snapshots: DailySnapshot[], days: number): DailySnapshot[] {
  return snapshots.slice(-days);
}

function formatDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

// ============================================
// Recovery Sparkline — line with green/yellow/red zones
// ============================================

export function recoverySparkline(snapshots: DailySnapshot[], days = 7): string {
  const recent = recentDays(snapshots, days);
  const labels = recent.map((s) => formatDate(s.date));
  const data = recent.map((s) => s.recovery_score ?? null);

  // Color each point by recovery zone
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
          { type: 'box', yMin: 67, yMax: 100, backgroundColor: 'rgba(34,197,94,0.08)' },
          { type: 'box', yMin: 34, yMax: 67, backgroundColor: 'rgba(234,179,8,0.06)' },
          { type: 'box', yMin: 0, yMax: 34, backgroundColor: 'rgba(239,68,68,0.06)' },
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

  // Compute baseline from all snapshots
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

  // Color bars by intensity
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

// ============================================
// Training Load Progression — weekly strain totals
// Shows 4-week periodization: is volume building?
// ============================================

export function trainingLoadChart(snapshots: DailySnapshot[], weeks = 4): string {
  if (snapshots.length < 7) return '';

  // Group snapshots into ISO weeks (Mon–Sun)
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

  // Color bars by intensity (weekly total strain thresholds)
  const barColors = weekBuckets.map((w) => {
    if (w.strain >= 80) return RED;
    if (w.strain >= 55) return ORANGE;
    return 'rgba(249,115,22,0.45)';
  });

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
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10, beginAtZero: true },
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
          formatter: (v: number) => v.toFixed(0),
        },
      },
    },
  };

  return encodeLarge(config, 480, 200);
}

// ============================================
// Recovery-to-Load Ratio — fitness trajectory
// Rising = fitness building, falling = overreaching
// ============================================

export function recoveryLoadRatioChart(snapshots: DailySnapshot[], days = 21): string {
  const recent = recentDays(snapshots, days);
  if (recent.length < 5) return '';

  const labels = recent.map((s) => formatDate(s.date));

  // Compute ratio: recovery / strain (higher = better adapted)
  // Normalize strain to 0-100 scale (strain is 0-21, multiply by ~4.76)
  // Filter out very low strain days (<2) — they produce meaningless ratios
  const MAX_RATIO = 4.0; // Cap to prevent outliers from blowing the scale
  const ratios = recent.map((s) => {
    const recovery = s.recovery_score;
    const strain = s.strain;
    if (recovery == null || strain == null || strain < 2.0) return null;
    const ratio = recovery / (strain * 4.76);
    return Math.round(Math.min(ratio, MAX_RATIO) * 100) / 100;
  });

  // 7-day moving average for trend line
  const movingAvg = ratios.map((_, i) => {
    const window = ratios.slice(Math.max(0, i - 6), i + 1).filter((v) => v !== null) as number[];
    return window.length >= 3 ? Math.round((window.reduce((a, b) => a + b, 0) / window.length) * 100) / 100 : null;
  });

  // Color points by zone: green = strong adaptation, yellow = normal, red = overreaching
  const pointColors = ratios.map((v) => {
    if (v === null) return LABEL_COLOR;
    if (v >= 2.5) return GREEN;
    if (v >= 1.0) return YELLOW;
    return RED;
  });

  const config = {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Daily Ratio',
          data: ratios,
          borderColor: pointColors,
          borderWidth: 1.5,
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          pointRadius: 3,
          fill: false,
          tension: 0.2,
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
          boxWidth: 12,
          padding: 16,
          usePointStyle: true,
          generateLabels: () => [
            {
              text: 'Adapted (>2.5)',
              fillStyle: GREEN,
              strokeStyle: GREEN,
              pointStyle: 'circle',
              hidden: false,
            },
            {
              text: 'Normal (1–2.5)',
              fillStyle: YELLOW,
              strokeStyle: YELLOW,
              pointStyle: 'circle',
              hidden: false,
            },
            {
              text: 'Strained (<1)',
              fillStyle: RED,
              strokeStyle: RED,
              pointStyle: 'circle',
              hidden: false,
            },
            {
              text: '7-Day Trend',
              fillStyle: ORANGE,
              strokeStyle: ORANGE,
              pointStyle: 'line',
              hidden: false,
              datasetIndex: 1,
            },
          ],
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: LABEL_COLOR,
            fontSize: 10,
            min: 0,
            max: MAX_RATIO + 0.5,
            stepSize: 0.5,
          },
          gridLines: { color: GRID, zeroLineColor: GRID },
          scaleLabel: {
            display: true,
            labelString: 'RECOVERY ÷ LOAD',
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
          {
            type: 'box',
            yMin: 2.5,
            yMax: MAX_RATIO + 0.5,
            backgroundColor: 'rgba(34,197,94,0.06)',
          },
          {
            type: 'box',
            yMin: 1.0,
            yMax: 2.5,
            backgroundColor: 'rgba(234,179,8,0.04)',
          },
          {
            type: 'box',
            yMin: 0,
            yMax: 1.0,
            backgroundColor: 'rgba(239,68,68,0.06)',
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 2.5,
            borderColor: 'rgba(34,197,94,0.5)',
            borderWidth: 1.5,
            borderDash: [6, 4],
          },
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 1.0,
            borderColor: 'rgba(239,68,68,0.5)',
            borderWidth: 1.5,
            borderDash: [6, 4],
          },
        ],
      },
    },
  };

  return encodeLarge(config, 480, 220);
}

// ============================================
// Race Readiness Score — composite gauge
// Recovery trend + consistency + discipline balance
// ============================================

export interface RaceReadinessInput {
  recoveryTrend: number;       // avg recovery last 7 days (0-100)
  trainingConsistency: number; // workouts per week in last 14 days
  disciplineBalance: number;   // 0-100, how balanced across swim/bike/run
  nextRaceName: string;
}

export function raceReadinessGauge(input: RaceReadinessInput): string {
  // Weighted composite:
  // 40% recovery trend (are you recovered?)
  // 35% training consistency (have you been training?)
  // 25% discipline balance (are you training the right things?)
  const recoveryComponent = Math.min(100, Math.round(input.recoveryTrend));
  const consistencyComponent = Math.min(100, Math.round((input.trainingConsistency / 5) * 100)); // 5 workouts/week = 100%
  const balanceComponent = Math.round(input.disciplineBalance);

  const score = Math.round(
    recoveryComponent * 0.4 +
    consistencyComponent * 0.35 +
    balanceComponent * 0.25
  );

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

  // Return the URL plus the component scores for the email caption
  return encodeLarge(config, 300, 300);
}

// Exported so the email renderer can build a detailed caption
export function computeReadinessBreakdown(input: RaceReadinessInput): {
  score: number;
  recovery: number;
  consistency: number;
  balance: number;
} {
  const recovery = Math.min(100, Math.round(input.recoveryTrend));
  const consistency = Math.min(100, Math.round((input.trainingConsistency / 5) * 100));
  const balance = Math.round(input.disciplineBalance);
  const score = Math.round(recovery * 0.4 + consistency * 0.35 + balance * 0.25);
  return { score, recovery, consistency, balance };
}

// ============================================
// Workout Consistency Calendar — 28-day activity view
// Stacked bars: each segment = one workout, colored by sport
// Uniform height per workout so it's about consistency, not strain
// ============================================

export interface WorkoutEntry {
  date: string;
  sport: string;
}

export function consistencyCalendar(snapshots: DailySnapshot[], days = 28, workouts?: WorkoutEntry[]): string {
  const recent = recentDays(snapshots, days);
  if (recent.length < 7) return '';

  const labels = recent.map((s) => {
    const [, m, d] = s.date.split('-');
    return `${parseInt(m)}/${parseInt(d)}`;
  });

  // Build a map of date → list of training sports
  const dateToSports: Record<string, string[]> = {};
  for (const s of recent) {
    dateToSports[s.date] = [];
  }

  // Dates covered by the workouts file
  const workoutDates = new Set(workouts ? workouts.map((w) => w.date) : []);

  // Use workouts file for dates it covers, snapshot data for older dates
  if (workouts && workouts.length > 0) {
    for (const w of workouts) {
      if (dateToSports[w.date] !== undefined && !NON_TRAINING.has(w.sport)) {
        dateToSports[w.date].push(w.sport);
      }
    }
  }
  // Fill in older dates from snapshots (workouts file only covers ~14 days)
  for (const s of recent) {
    if (!workoutDates.has(s.date) && s.workout_sport && !NON_TRAINING.has(s.workout_sport)) {
      dateToSports[s.date].push(s.workout_sport);
    }
  }

  // Collect all unique sports across all days
  const allSports = Array.from(new Set(
    Object.values(dateToSports).flat().filter((s): s is string => s != null)
  ));

  if (allSports.length === 0) return '';

  // One dataset per sport — stacked, uniform height (1 per workout)
  const datasets: any[] = allSports.map((sport) => ({
    label: formatSportName(sport),
    data: recent.map((s) => {
      const count = dateToSports[s.date].filter((sp) => sp === sport).length;
      return count > 0 ? count : null;
    }),
    backgroundColor: SPORT_COLORS[sport] || ORANGE,
    borderColor: SPORT_COLORS[sport] || ORANGE,
    borderWidth: 1,
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
        yAxes: [{
          display: false,
          stacked: true,
          ticks: { min: 0 },
        }],
        xAxes: [{
          stacked: true,
          ticks: { fontColor: LABEL_COLOR, fontSize: 7, maxRotation: 45 },
          gridLines: { display: false },
        }],
      },
      plugins: {
        datalabels: { display: false },
      },
    },
  };

  return encodeLarge(config, 480, 160);
}

// Recovery/wellness/non-training activities excluded from training charts
const NON_TRAINING: Set<string> = new Set([
  'steam-room', 'percussive-massage', 'sauna', 'ice-bath',
  'meditation', 'stretching', 'massage', 'cold-plunge',
  'breathwork', 'dog-walking', 'activity',
  'cold-shower', 'red_light_therapy', 'red-light-therapy',
]);

// ============================================
// Days Since Last Discipline — swim/bike/run gap tracker
// ============================================

export interface DaysSinceDiscipline {
  swim: number | null;   // null = never in dataset
  bike: number | null;
  run: number | null;
}

export function computeDaysSince(workouts: WorkoutEntry[], today: string): DaysSinceDiscipline {
  const swimSports = new Set(['swimming', 'triathlon']);
  const bikeSports = new Set(['cycling', 'spin', 'triathlon']);
  const runSports = new Set(['running', 'triathlon']);

  const todayDate = new Date(today + 'T00:00:00');
  let lastSwim: string | null = null;
  let lastBike: string | null = null;
  let lastRun: string | null = null;

  for (const w of workouts) {
    if (swimSports.has(w.sport) && (lastSwim === null || w.date > lastSwim)) lastSwim = w.date;
    if (bikeSports.has(w.sport) && (lastBike === null || w.date > lastBike)) lastBike = w.date;
    if (runSports.has(w.sport) && (lastRun === null || w.date > lastRun)) lastRun = w.date;
  }

  const daysBetween = (d: string | null) => {
    if (!d) return null;
    const diff = Math.floor((todayDate.getTime() - new Date(d + 'T00:00:00').getTime()) / 86400000);
    return diff;
  };

  return {
    swim: daysBetween(lastSwim),
    bike: daysBetween(lastBike),
    run: daysBetween(lastRun),
  };
}

// ============================================
// HR Zone Distribution — time in each heart rate zone
// Shows training intensity across recent workouts
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

export function hrZoneChart(workouts: WorkoutWithZones[], days = 14): string {
  // Filter to training workouts with zone data
  const training = workouts.filter((w) =>
    !NON_TRAINING.has(w.sport) &&
    (w.zone_one_ms || w.zone_two_ms || w.zone_three_ms || w.zone_four_ms || w.zone_five_ms)
  );
  if (training.length < 2) return '';

  // Aggregate total minutes per zone across all workouts
  const msToMin = (ms: number | null) => Math.round((ms || 0) / 60000);
  const zones = {
    'Zone 1': training.reduce((sum, w) => sum + msToMin(w.zone_one_ms), 0),
    'Zone 2': training.reduce((sum, w) => sum + msToMin(w.zone_two_ms), 0),
    'Zone 3': training.reduce((sum, w) => sum + msToMin(w.zone_three_ms), 0),
    'Zone 4': training.reduce((sum, w) => sum + msToMin(w.zone_four_ms), 0),
    'Zone 5': training.reduce((sum, w) => sum + msToMin(w.zone_five_ms), 0),
  };

  const zoneColors = [
    '#3b82f6', // Z1 blue — easy/recovery
    '#22c55e', // Z2 green — aerobic base
    '#eab308', // Z3 yellow — tempo
    '#f97316', // Z4 orange — threshold
    '#ef4444', // Z5 red — max effort
  ];

  const labels = Object.keys(zones);
  const data = Object.values(zones);
  const total = data.reduce((a, b) => a + b, 0);

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
      legend: { display: false },
      scales: {
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10, beginAtZero: true },
          gridLines: { color: GRID, zeroLineColor: GRID },
          scaleLabel: {
            display: true,
            labelString: 'MINUTES',
            fontColor: LABEL_COLOR,
            fontSize: 9,
          },
        }],
        yAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 11 },
          gridLines: { display: false },
        }],
      },
      plugins: {
        datalabels: {
          color: '#ffffff',
          font: { size: 10, weight: 'bold' },
          anchor: 'end',
          align: 'right',
          formatter: (v: number) => {
            if (total === 0) return '';
            const pct = Math.round((v / total) * 100);
            return `${v}m (${pct}%)`;
          },
        },
      },
    },
  };

  return encodeLarge(config, 480, 200);
}

export function disciplineBalanceChart(disciplines: DisciplineData): string {
  // Filter to actual training disciplines only
  const trainingEntries = Object.entries(disciplines)
    .filter(([sport]) => !NON_TRAINING.has(sport))
    .sort((a, b) => b[1].minutes - a[1].minutes);
  if (trainingEntries.length === 0) return '';

  // Group anything under 3% into "Other"
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

  const labels = significant.map(([sport]) => formatSportName(sport));
  const data = significant.map(([, d]) => d.minutes);
  const colors = significant.map(([sport]) => SPORT_COLORS[sport] || '#6b7280');

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
        labels: {
          fontColor: LABEL_COLOR,
          fontSize: 11,
          padding: 12,
          usePointStyle: true,
        },
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
