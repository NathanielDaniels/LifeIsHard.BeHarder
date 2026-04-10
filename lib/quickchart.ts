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

function encode(config: object): string {
  return `${BASE}?c=${encodeURIComponent(JSON.stringify(config))}&w=480&h=130&bkg=${encodeURIComponent(BG)}&f=png`;
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
