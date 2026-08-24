// ============================================
// Cross-Source Chart Builders
//
// Charts that combine WHOOP + Strava data —
// visualizations that neither app can show alone.
// Uses QuickChart.io (Chart.js v2) for email PNGs.
// ============================================

import { SPORT_COLORS, encodeLarge } from './quickchart'

const ORANGE = '#f97316'
const GRID = 'rgba(255,255,255,0.06)'
const LABEL_COLOR = 'rgba(255,255,255,0.55)'

function formatDate(d: string): string {
  const [, m, day] = d.split('-')
  return `${parseInt(m)}/${parseInt(day)}`
}

function formatSportName(sport: string): string {
  return sport
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ============================================
// Recovery × Performance — scatter plot
// ============================================

export interface RecoveryPerformancePoint {
  date: string
  recovery: number
  pace_sec_per_km?: number
  avg_power?: number
  sport: string
}

export function averageSplitPaceSecPerKm(splits: any[] | null | undefined): number | null {
  if (!splits || splits.length === 0) return null

  const paces = splits
    .map((split) => {
      if (typeof split.pace_sec_per_km === 'number' && split.pace_sec_per_km > 0) {
        return split.pace_sec_per_km
      }

      const distanceM = split.distance_m ?? split.distance
      const movingTimeS = split.moving_time_s ?? split.moving_time
      if (typeof distanceM !== 'number' || typeof movingTimeS !== 'number' || distanceM <= 0 || movingTimeS <= 0) {
        return null
      }
      return movingTimeS / (distanceM / 1000)
    })
    .filter((pace): pace is number => pace != null)

  if (paces.length === 0) return null
  return paces.reduce((sum, pace) => sum + pace, 0) / paces.length
}

export function recoveryPerformanceChart(points: RecoveryPerformancePoint[]): string | null {
  if (points.length < 3) return null

  const running = points.filter(p => p.pace_sec_per_km != null)
  const cycling = points.filter(p => p.avg_power != null)

  const datasets: any[] = []

  if (running.length >= 2) {
    datasets.push({
      label: 'Running Pace',
      data: running.map(p => ({
        x: p.recovery,
        y: Math.round((p.pace_sec_per_km! / 60) * 10) / 10,
      })),
      backgroundColor: SPORT_COLORS.running || '#ef4444',
      pointRadius: 6,
    })
  }

  if (cycling.length >= 2) {
    datasets.push({
      label: 'Cycling Power',
      data: cycling.map(p => ({ x: p.recovery, y: p.avg_power })),
      backgroundColor: SPORT_COLORS.cycling || '#3b82f6',
      pointRadius: 6,
    })
  }

  if (datasets.length === 0) return null

  const primaryIsRunning = running.length >= cycling.length

  const config = {
    type: 'scatter',
    data: { datasets },
    options: {
      legend: {
        display: datasets.length > 1,
        labels: { fontColor: LABEL_COLOR, fontSize: 10 },
      },
      scales: {
        xAxes: [{
          scaleLabel: { display: true, labelString: 'Recovery Score', fontColor: LABEL_COLOR, fontSize: 10 },
          ticks: { min: 0, max: 100, fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { color: GRID, zeroLineColor: GRID },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: primaryIsRunning ? 'Pace (min/km)' : 'Power (watts)',
            fontColor: LABEL_COLOR,
            fontSize: 10,
          },
          ticks: {
            fontColor: LABEL_COLOR,
            fontSize: 10,
            reverse: primaryIsRunning, // Lower pace = faster = top
          },
          gridLines: { color: GRID, zeroLineColor: GRID },
        }],
      },
    },
  }

  return encodeLarge(config, 480, 260)
}

// ============================================
// Training Efficiency — strain per km over time
// ============================================

export interface EfficiencyPoint {
  date: string
  sport?: string | null
  strain: number
  distance_km: number
  avg_power?: number | null
}

export type TrainingEfficiencyMetric = 'run_strain_per_km' | 'bike_watts_per_strain' | 'distance_strain_per_km'

export function buildTrainingEfficiencySeries(points: EfficiencyPoint[]): {
  metric: TrainingEfficiencyMetric
  label: string
  axisLabel: string
  betterDirection: 'down' | 'up'
  data: Array<{ date: string; value: number }>
} | null {
  const running = points
    .filter(p => p.sport === 'running' && p.distance_km > 0 && p.strain > 0)
    .map(p => ({ date: p.date, value: Math.round((p.strain / p.distance_km) * 100) / 100 }))

  const cycling = points
    .filter(p => ['cycling', 'spin'].includes(String(p.sport)) && p.avg_power != null && p.avg_power > 0 && p.strain > 0)
    .map(p => ({ date: p.date, value: Math.round((p.avg_power! / p.strain) * 10) / 10 }))

  if (running.length >= 4 && running.length >= cycling.length) {
    return {
      metric: 'run_strain_per_km',
      label: 'Run strain / km',
      axisLabel: 'RUN STRAIN PER KM',
      betterDirection: 'down',
      data: running,
    }
  }

  if (cycling.length >= 4) {
    return {
      metric: 'bike_watts_per_strain',
      label: 'Bike watts / strain',
      axisLabel: 'BIKE WATTS PER STRAIN',
      betterDirection: 'up',
      data: cycling,
    }
  }

  const distance = points
    .filter(p => p.distance_km > 0 && p.strain > 0)
    .map(p => ({ date: p.date, value: Math.round((p.strain / p.distance_km) * 100) / 100 }))

  if (distance.length < 4) return null

  return {
    metric: 'distance_strain_per_km',
    label: 'Strain / km',
    axisLabel: 'STRAIN PER KM',
    betterDirection: 'down',
    data: distance,
  }
}

export function trainingEfficiencyChart(points: EfficiencyPoint[]): string | null {
  const series = buildTrainingEfficiencySeries(points)
  if (!series) return null

  const config = {
    type: 'line',
    data: {
      labels: series.data.map(d => formatDate(d.date)),
      datasets: [{
        label: series.label,
        data: series.data.map(d => d.value),
        borderColor: ORANGE,
        backgroundColor: 'rgba(249,115,22,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: ORANGE,
        borderWidth: 2.5,
        spanGaps: true,
      }],
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 9, maxRotation: 45 },
          gridLines: { color: GRID },
        }],
        yAxes: [{
          scaleLabel: { display: true, labelString: series.axisLabel, fontColor: LABEL_COLOR, fontSize: 9 },
          ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { color: GRID, zeroLineColor: GRID },
        }],
      },
    },
  }

  return encodeLarge(config, 480, 220)
}

// ============================================
// Recovery Cost By Discipline — DAVE derived
// ============================================

export interface RecoveryCostPoint {
  sport: string
  recovery: number
  nextDayRecovery: number
}

export interface RecoveryCostSummary {
  sport: string
  avgDelta: number
  count: number
}

export function buildRecoveryCostByDiscipline(points: RecoveryCostPoint[]): RecoveryCostSummary[] {
  const grouped = new Map<string, number[]>()

  for (const point of points) {
    const sport = point.sport.toLowerCase().trim().replace(/\s+/g, '-')
    if (!sport || point.recovery == null || point.nextDayRecovery == null) continue
    const delta = point.nextDayRecovery - point.recovery
    grouped.set(sport, [...(grouped.get(sport) || []), delta])
  }

  return Array.from(grouped.entries())
    .filter(([, deltas]) => deltas.length >= 2)
    .map(([sport, deltas]) => ({
      sport: formatSportName(sport),
      avgDelta: Math.round((deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length) * 10) / 10,
      count: deltas.length,
    }))
    .sort((a, b) => a.avgDelta - b.avgDelta)
}

export function recoveryCostByDisciplineChart(points: RecoveryCostPoint[]): string | null {
  const data = buildRecoveryCostByDiscipline(points)
  if (data.length < 1) return null

  const config = {
    type: 'horizontalBar',
    data: {
      labels: data.map((d) => d.sport),
      datasets: [{
        data: data.map((d) => d.avgDelta),
        backgroundColor: data.map((d) => d.avgDelta < -8 ? 'rgba(239,68,68,0.82)' : d.avgDelta < 0 ? 'rgba(234,179,8,0.78)' : 'rgba(34,197,94,0.78)'),
        borderWidth: 0,
      }],
    },
    options: {
      layout: { padding: { top: 12, right: 22, bottom: 0, left: 0 } },
      legend: { display: false },
      scales: {
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { color: GRID, zeroLineColor: 'rgba(255,255,255,0.22)', drawBorder: false },
          scaleLabel: { display: true, labelString: 'NEXT-DAY RECOVERY CHANGE', fontColor: LABEL_COLOR, fontSize: 9 },
        }],
        yAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 11 },
          gridLines: { display: false, drawBorder: false },
        }],
      },
      plugins: {
        datalabels: {
          color: '#ffffff',
          anchor: (ctx: any) => ctx.dataset.data[ctx.dataIndex] < 0 ? 'start' : 'end',
          align: (ctx: any) => ctx.dataset.data[ctx.dataIndex] < 0 ? 'left' : 'right',
          font: { size: 10, weight: 'bold' },
          formatter: (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}`,
        },
      },
    },
  }

  return encodeLarge(config, 480, 210)
}

// ============================================
// Durability Trend — DAVE derived
// ============================================

export interface DurabilityPoint {
  date: string
  trained: boolean
  nextDayRecovery: number | null
}

export interface DurabilitySeriesPoint {
  date: string
  score: number
  trainingDays: number
}

export function buildDurabilitySeries(points: DurabilityPoint[], windowDays = 7): DurabilitySeriesPoint[] {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date))
  const result: DurabilitySeriesPoint[] = []

  for (let i = windowDays - 1; i < sorted.length; i++) {
    const window = sorted.slice(i - (windowDays - 1), i + 1)
    const trainingDays = window.filter((p) => p.trained && p.nextDayRecovery != null)
    if (trainingDays.length < 3) continue
    const durableDays = trainingDays.filter((p) => (p.nextDayRecovery ?? 0) >= 34)
    result.push({
      date: sorted[i].date,
      score: Math.round((durableDays.length / trainingDays.length) * 100),
      trainingDays: trainingDays.length,
    })
  }

  return result
}

export function durabilityTrendChart(points: DurabilityPoint[]): string | null {
  const data = buildDurabilitySeries(points)
  if (data.length < 1) return null

  const config = {
    type: 'line',
    data: {
      labels: data.map((d, index) => index % 2 === 0 || index === data.length - 1 ? formatDate(d.date) : ''),
      datasets: [{
        label: 'Durability',
        data: data.map((d) => d.score),
        borderColor: '#c8ff00',
        backgroundColor: 'rgba(200,255,0,0.10)',
        pointBackgroundColor: data.map((d) => d.score >= 80 ? '#22c55e' : d.score >= 55 ? '#eab308' : '#ef4444'),
        pointBorderColor: data.map((d) => d.score >= 80 ? '#22c55e' : d.score >= 55 ? '#eab308' : '#ef4444'),
        pointRadius: 4,
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
      }],
    },
    options: {
      layout: { padding: { top: 12, right: 10, bottom: 0, left: 0 } },
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: { min: 0, max: 100, fontColor: LABEL_COLOR, fontSize: 10, stepSize: 25 },
          gridLines: { color: GRID, zeroLineColor: GRID, drawBorder: false },
          scaleLabel: { display: true, labelString: 'DURABILITY %', fontColor: LABEL_COLOR, fontSize: 9 },
        }],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 9, maxRotation: 0 },
          gridLines: { display: false, drawBorder: false },
        }],
      },
    },
  }

  return encodeLarge(config, 480, 200)
}

// ============================================
// Plan vs Actual — DAVE prescribed vs observed
// ============================================

export interface PlanAdherencePoint {
  date: string
  plannedDiscipline: string | null
  wasRestDay: boolean
  actualSports: string[]
}

export interface PlanAdherenceSeriesPoint {
  date: string
  score: 0 | 50 | 100
  status: 'matched' | 'missed' | 'mismatch' | 'rested' | 'extra'
}

function disciplineMatches(planned: string | null, actualSport: string): boolean {
  if (!planned) return false
  const plan = planned.toLowerCase()
  const actual = actualSport.toLowerCase()
  if (plan === 'run') return actual.includes('run')
  if (plan === 'bike') return actual.includes('cycl') || actual.includes('spin') || actual.includes('bike')
  if (plan === 'swim') return actual.includes('swim')
  return actual.includes(plan)
}

export function buildPlanAdherenceSeries(points: PlanAdherencePoint[]): PlanAdherenceSeriesPoint[] {
  return [...points]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((point) => {
      const actualTraining = point.actualSports.length > 0
      if (point.wasRestDay) {
        return {
          date: point.date,
          score: actualTraining ? 50 : 100,
          status: actualTraining ? 'extra' : 'rested',
        }
      }

      if (!actualTraining) return { date: point.date, score: 0, status: 'missed' }
      const matched = point.actualSports.some((sport) => disciplineMatches(point.plannedDiscipline, sport))
      return {
        date: point.date,
        score: matched ? 100 : 50,
        status: matched ? 'matched' : 'mismatch',
      }
    })
}

export function planAdherenceChart(points: PlanAdherencePoint[]): string | null {
  const data = buildPlanAdherenceSeries(points)
  if (data.length < 3) return null

  const config = {
    type: 'bar',
    data: {
      labels: data.map((d) => formatDate(d.date)),
      datasets: [{
        label: 'Plan Match',
        data: data.map((d) => d.score),
        backgroundColor: data.map((d) => d.score === 100 ? 'rgba(34,197,94,0.78)' : d.score === 50 ? 'rgba(234,179,8,0.76)' : 'rgba(239,68,68,0.78)'),
        borderWidth: 0,
        barPercentage: 0.58,
        categoryPercentage: 0.78,
      }],
    },
    options: {
      layout: { padding: { top: 14, right: 8, bottom: 0, left: 0 } },
      legend: { display: false },
      scales: {
        yAxes: [{
          ticks: { min: 0, max: 100, fontColor: LABEL_COLOR, fontSize: 10, stepSize: 50 },
          gridLines: { color: GRID, zeroLineColor: GRID, drawBorder: false },
          scaleLabel: { display: true, labelString: 'PLAN MATCH', fontColor: LABEL_COLOR, fontSize: 9 },
        }],
        xAxes: [{
          ticks: { fontColor: LABEL_COLOR, fontSize: 9, maxRotation: 0 },
          gridLines: { display: false, drawBorder: false },
        }],
      },
      plugins: {
        datalabels: {
          color: '#ffffff',
          font: { size: 9, weight: 'bold' },
          anchor: 'end',
          align: 'top',
          formatter: (value: number) => value === 100 ? 'MATCH' : value === 50 ? 'PARTIAL' : 'MISS',
        },
      },
    },
  }

  return encodeLarge(config, 480, 200)
}

// ============================================
// Sleep → Recovery — scatter plot
// ============================================

export interface SleepRecoveryPoint {
  date: string
  sleepPerformance: number
  nextDayRecovery: number
}

export function sleepRecoveryChart(points: SleepRecoveryPoint[]): string | null {
  if (points.length < 5) return null

  const config = {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Sleep → Recovery',
        data: points.map(p => ({ x: p.sleepPerformance, y: p.nextDayRecovery })),
        backgroundColor: '#8b5cf6',
        pointRadius: 5,
      }],
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [{
          scaleLabel: { display: true, labelString: 'Sleep Performance %', fontColor: LABEL_COLOR, fontSize: 10 },
          ticks: { min: 0, max: 100, fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { color: GRID, zeroLineColor: GRID },
        }],
        yAxes: [{
          scaleLabel: { display: true, labelString: 'Next-Day Recovery', fontColor: LABEL_COLOR, fontSize: 10 },
          ticks: { min: 0, max: 100, fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { color: GRID, zeroLineColor: GRID },
        }],
      },
    },
  }

  return encodeLarge(config, 480, 260)
}

// ============================================
// Split Analysis — per-km pace bars + HR overlay
// ============================================

export interface SplitData {
  km: number
  pace_sec_per_km: number
  avg_hr?: number
}

export function splitAnalysisChart(splits: SplitData[]): string | null {
  if (splits.length < 2) return null

  const paceData = splits.map(s => Math.round(s.pace_sec_per_km / 6) / 10) // sec → decimal min
  const avgPace = paceData.reduce((a, b) => a + b, 0) / paceData.length

  const datasets: any[] = [{
    label: 'Pace (min/km)',
    data: paceData,
    backgroundColor: paceData.map(p =>
      p < avgPace ? 'rgba(34,197,94,0.7)' : 'rgba(249,115,22,0.7)'
    ),
    borderRadius: 4,
    yAxisID: 'y-pace',
  }]

  const hasHR = splits.some(s => s.avg_hr != null)
  if (hasHR) {
    datasets.push({
      label: 'Avg HR',
      data: splits.map(s => s.avg_hr ?? null),
      type: 'line',
      borderColor: '#ef4444',
      pointRadius: 3,
      pointBackgroundColor: '#ef4444',
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      yAxisID: 'y-hr',
      spanGaps: true,
    })
  }

  const yAxes: any[] = [{
    id: 'y-pace',
    position: 'left',
    scaleLabel: { display: true, labelString: 'PACE (MIN/KM)', fontColor: LABEL_COLOR, fontSize: 9 },
    ticks: { fontColor: LABEL_COLOR, fontSize: 10, reverse: true },
    gridLines: { color: GRID, zeroLineColor: GRID },
  }]

  if (hasHR) {
    yAxes.push({
      id: 'y-hr',
      position: 'right',
      scaleLabel: { display: true, labelString: 'HEART RATE', fontColor: LABEL_COLOR, fontSize: 9 },
      ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
      gridLines: { display: false },
    })
  }

  const config = {
    type: 'bar',
    data: {
      labels: splits.map(s => `${s.km}`),
      datasets,
    },
    options: {
      legend: {
        display: hasHR,
        labels: { fontColor: LABEL_COLOR, fontSize: 10 },
      },
      scales: {
        xAxes: [{
          scaleLabel: { display: true, labelString: 'KILOMETER', fontColor: LABEL_COLOR, fontSize: 9 },
          ticks: { fontColor: LABEL_COLOR, fontSize: 10 },
          gridLines: { color: GRID },
        }],
        yAxes,
      },
    },
  }

  return encodeLarge(config, 480, 220)
}
