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
const LABEL_COLOR = 'rgba(255,255,255,0.4)';

// Sport-specific colors for discipline chart
const SPORT_COLORS: Record<string, string> = {
  'running': '#ef4444',      // red
  'cycling': '#3b82f6',      // blue
  'spin': '#3b82f6',         // blue (same as cycling)
  'swimming': '#06b6d4',     // cyan
  'triathlon': ORANGE,       // orange
  'strength-training': '#a855f7', // purple
  'steam-room': '#6b7280',   // gray
  'percussive-massage': '#6b7280', // gray
  'yoga': '#10b981',         // emerald
  'hiking': '#84cc16',       // lime
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
  const ratios = recent.map((s) => {
    const recovery = s.recovery_score;
    const strain = s.strain;
    if (recovery == null || strain == null || strain < 0.5) return null;
    return Math.round((recovery / (strain * 4.76)) * 100) / 100;
  });

  // 7-day moving average for trend line
  const movingAvg = ratios.map((_, i) => {
    const window = ratios.slice(Math.max(0, i - 6), i + 1).filter((v) => v !== null) as number[];
    return window.length >= 3 ? Math.round((window.reduce((a, b) => a + b, 0) / window.length) * 100) / 100 : null;
  });

  // Color points: green if ratio > 1 (recovery outpacing load), red if < 0.7
  const pointColors = ratios.map((v) => {
    if (v === null) return LABEL_COLOR;
    if (v >= 1.0) return GREEN;
    if (v >= 0.7) return YELLOW;
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
          borderColor: 'rgba(249,115,22,0.4)',
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
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { color: GRID, zeroLineColor: GRID },
          scaleLabel: {
            display: true,
            labelString: 'RECOVERY / LOAD',
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
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 1.0,
            borderColor: 'rgba(34,197,94,0.3)',
            borderWidth: 1,
            borderDash: [4, 4],
            label: { content: 'ADAPTED', enabled: true, fontSize: 8, backgroundColor: 'rgba(0,0,0,0.5)', fontColor: GREEN },
          },
        ],
      },
    },
  };

  return encodeLarge(config, 480, 200);
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
  const recoveryComponent = Math.min(100, input.recoveryTrend);
  const consistencyComponent = Math.min(100, (input.trainingConsistency / 5) * 100); // 5 workouts/week = 100%
  const balanceComponent = input.disciplineBalance;

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

  return encodeLarge(config, 300, 300);
}

// ============================================
// Workout Consistency Calendar — 28-day activity view
// Each bar = one day, colored by sport or gray for rest
// ============================================

export function consistencyCalendar(snapshots: DailySnapshot[], days = 28): string {
  const recent = recentDays(snapshots, days);
  if (recent.length < 7) return '';

  const labels = recent.map((s) => {
    const [, , d] = s.date.split('-');
    return parseInt(d).toString();
  });

  // Each day gets a strain value (workout strain if available, else 0)
  const data = recent.map((s) => s.workout_strain ?? (s.workout_sport ? s.strain ?? 0.5 : 0.5));

  // Color by sport type, gray for rest days
  const barColors = recent.map((s) => {
    if (!s.workout_sport) return 'rgba(255,255,255,0.06)'; // rest day — barely visible
    return SPORT_COLORS[s.workout_sport] || ORANGE;
  });

  // Border to highlight workout days
  const borderColors = recent.map((s) => {
    if (!s.workout_sport) return 'transparent';
    return SPORT_COLORS[s.workout_sport] || ORANGE;
  });

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 2,
      }],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{
          display: false,
          ticks: { min: 0 },
        }],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 8 },
          gridLines: { display: false },
        }],
      },
      plugins: {
        datalabels: { display: false },
      },
    },
  };

  return encodeLarge(config, 480, 100);
}

export function disciplineBalanceChart(disciplines: DisciplineData): string {
  const entries = Object.entries(disciplines).sort((a, b) => b[1].minutes - a[1].minutes);
  if (entries.length === 0) return '';

  const labels = entries.map(([sport]) => formatSportName(sport));
  const data = entries.map(([, d]) => d.minutes);
  const colors = entries.map(([sport]) => SPORT_COLORS[sport] || '#6b7280');

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
          font: { size: 11, weight: 'bold' },
          formatter: (value: number, ctx: any) => {
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            if (total === 0) return '';
            const pct = Math.round((value / total) * 100);
            return pct >= 5 ? `${pct}%` : '';
          },
        },
      },
      cutoutPercentage: 55,
    },
  };

  return encodeLarge(config, 480, 260);
}
