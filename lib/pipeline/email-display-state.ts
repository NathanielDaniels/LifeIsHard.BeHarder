const CHART_KEYS = [
  'recovery_trend',
  'hrv_trend',
  'strain_trend',
  'discipline_balance',
  'training_load',
  'recovery_load_ratio',
  'race_readiness',
  'consistency_calendar',
  'hr_zones',
  'recovery_performance',
  'training_efficiency',
  'sleep_recovery',
] as const

export type EmailChartKey = typeof CHART_KEYS[number]

export type EmailSectionPriority = 'permanent' | 'contextual' | 'dashboard_only' | 'suppressed'

export interface EmailChartDecision {
  key: EmailChartKey
  priority: EmailSectionPriority
  selected: boolean
  reason: string
  heading?: string
  caption?: string
}

export interface EmailDisplayState {
  permanentCharts: EmailChartKey[]
  contextualCharts: EmailChartKey[]
  dashboardOnlyCharts: EmailChartKey[]
  suppressedCharts: EmailChartDecision[]
  chartDecisions: EmailChartDecision[]
  brandImage: {
    heroSrc: string
    footerSrc: string
    rationale: string
  }
}

export interface EmailDisplayBriefing {
  date?: string
  headline?: string
  trainingCall?: string
  coachNote?: string
  keyNumbers?: Array<{
    label?: string
    value?: string
    baseline?: string
    trend?: string
  }>
  recoveryScore?: number | null
  recoveryColor?: string | null
  nextRaceName?: string
  nextRaceDaysOut?: number | null
}

export interface BuildEmailDisplayStateInput {
  briefing?: EmailDisplayBriefing
  chartPreferences: Record<string, boolean>
  hasWhoop: boolean
  snapshots: Array<{
    date: string
    recovery_score: number | null
    hrv: number | null
    strain: number | null
    sleep_performance?: number | null
  }>
  workouts: Array<{
    date: string
    sport: string
    zone_zero_ms?: number | null
    zone_one_ms?: number | null
    zone_two_ms?: number | null
    zone_three_ms?: number | null
    zone_four_ms?: number | null
    zone_five_ms?: number | null
  }>
  enrichedWorkouts?: Array<{
    date: string
    sport: string
    distance_m: number | null
    avg_power: number | null
    strain: number | null
    splits: any[] | null
  }>
  disciplineBalance?: Record<string, { minutes: number; pct: number }>
  sport?: string
}

export interface EmailContentThemes {
  sleep: boolean
  recovery: boolean
  load: boolean
  performance: boolean
  race: boolean
  intensity: boolean
  strength: boolean
}

const CHART_COPY: Record<EmailChartKey, { heading: string; caption?: string }> = {
  recovery_trend: { heading: 'RECOVERY' },
  hrv_trend: { heading: 'HRV' },
  strain_trend: { heading: 'STRAIN' },
  discipline_balance: { heading: '14-DAY TRAINING BALANCE' },
  training_load: {
    heading: '4-WEEK TRAINING LOAD',
    caption: 'Total cardiovascular strain per week. Rising weeks = volume building. Strain is HR-based, so use it as direction rather than the whole story.',
  },
  recovery_load_ratio: {
    heading: 'RECOVERY / LOAD RATIO',
    caption: 'Recovery divided by recent strain load. Above the normal range means room to adapt; below it means fatigue is starting to outpace readiness.',
  },
  race_readiness: { heading: 'RACE READINESS' },
  consistency_calendar: {
    heading: '28-DAY ACTIVITY',
    caption: 'Daily training rhythm across the last four weeks. Useful for dashboard review when consistency is the coaching topic.',
  },
  hr_zones: {
    heading: 'HEART RATE ZONES (14-DAY)',
    caption: 'Total training minutes per HR zone. Use this when the day is about aerobic control, tempo, threshold, or intensity discipline.',
  },
  recovery_performance: {
    heading: 'RECOVERY x PERFORMANCE',
    caption: 'Each dot connects readiness with pace or power. Useful when the coaching point is whether recovery is translating into output.',
  },
  training_efficiency: {
    heading: 'TRAINING EFFICIENCY',
    caption: 'Strain per kilometer over time. Lower cost for similar work means the engine is getting more economical.',
  },
  sleep_recovery: {
    heading: 'SLEEP -> RECOVERY',
    caption: 'How recent sleep performance maps to next-day recovery. Use it when the coaching point is bedtime, sleep debt, or recovery response.',
  },
}

const COACH_ASSET_BASE = 'https://meetcoachdave.com/Coach%20DAVE'
const TRANSPARENT_BASE = `${COACH_ASSET_BASE}/transparent`
const FOOTER_SRC = `${TRANSPARENT_BASE}/thumbsUp_transparent.png`

export function detectEmailContentThemes(input: BuildEmailDisplayStateInput): EmailContentThemes {
  const briefing = input.briefing ?? {}
  const keyNumbers = Array.isArray(briefing.keyNumbers) ? briefing.keyNumbers : []
  const text = [
    briefing.headline,
    briefing.trainingCall,
    briefing.coachNote,
    ...keyNumbers.flatMap((keyNumber) => [
      keyNumber?.label,
      keyNumber?.value,
      keyNumber?.baseline,
      keyNumber?.trend,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const raceName = typeof briefing.nextRaceName === 'string' ? briefing.nextRaceName.trim() : ''
  const daysOut = Number(briefing.nextRaceDaysOut)

  return {
    sleep: /\b(sleep|sleep performance|sleep debt|bedtime|wake|rem|deep sleep)\b/i.test(text),
    recovery: /\b(recovery|hrv|rhr|resting heart|readiness|recover|green|yellow|red)\b/i.test(text) ||
      input.hasWhoop && (briefing.recoveryScore != null || briefing.recoveryColor != null),
    load: /\b(load|strain|build|volume|fatigue|atl|ctl|tsb|overreach|overreaching|recovery[-/ ]load|workload)\b/i.test(text),
    performance: /\b(pace|power|efficiency|efficient|splits?|speed|watts?|performance|faster|output)\b/i.test(text),
    race: raceName.length > 0 && Number.isFinite(daysOut) && daysOut >= 0 && daysOut <= 120,
    intensity: /\b(intensity|z1|z2|z3|z4|z5|zone ?[1-5]|threshold|aerobic|tempo|vo2|max effort|heart rate|hr zone)\b/i.test(text),
    strength: /\b(strength|lift|lifting|weights?|dumbbell|kettlebell|squat|deadlift|carry|plank|push-up|pushup)\b/i.test(text),
  }
}

export function buildEmailDisplayState(input: BuildEmailDisplayStateInput): EmailDisplayState {
  const themes = detectEmailContentThemes(input)
  const decisions = new Map<EmailChartKey, EmailChartDecision>()
  const contextualCandidates: EmailChartKey[] = []
  const dashboardOnly: EmailChartKey[] = []

  function addDecision(decision: EmailChartDecision): void {
    decisions.set(decision.key, withCopy(decision))
  }

  for (const key of CHART_KEYS) {
    if (input.chartPreferences?.[key] === false) {
      addDecision({
        key,
        priority: 'suppressed',
        selected: false,
        reason: 'Disabled by chart preference.',
      })
    }
  }

  const recoveryCount = countSnapshots(input.snapshots, 'recovery_score')
  const hrvCount = countSnapshots(input.snapshots, 'hrv')
  const strainCount = countSnapshots(input.snapshots, 'strain')
  const sleepPairs = countSleepRecoveryPairs(input.snapshots)
  const zoneWorkoutCount = countZoneWorkouts(input.workouts)
  const enrichedPerformancePoints = countRecoveryPerformancePoints(input)
  const efficiencyPoints = countEfficiencyPoints(input)
  const disciplineMinutes = totalDisciplineMinutes(input)

  maybePermanent('recovery_trend', input.hasWhoop && recoveryCount >= 3, input.hasWhoop ? 'Needs at least 3 recovery scores.' : 'WHOOP data is not available.')
  maybePermanent('hrv_trend', input.hasWhoop && hrvCount >= 3, input.hasWhoop ? 'Needs at least 3 HRV values.' : 'WHOOP data is not available.')

  if (themes.recovery || themes.load) {
    maybeContextual('strain_trend', input.hasWhoop && strainCount >= 3, input.hasWhoop ? 'Needs at least 3 strain values.' : 'WHOOP data is not available.')
  } else {
    dashboardOnly.push('strain_trend')
  }

  if (themes.sleep) {
    maybeContextual('sleep_recovery', input.hasWhoop && sleepPairs >= 5, input.hasWhoop ? 'Needs at least 5 sleep/recovery pairs.' : 'WHOOP data is not available.')
  } else if (sleepPairs >= 5) {
    dashboardOnly.push('sleep_recovery')
  }

  if (themes.load) {
    maybeContextual('training_load', input.hasWhoop && strainCount >= 14, input.hasWhoop ? 'Needs at least 14 strain snapshots for load.' : 'WHOOP data is not available.')
    maybeContextual('recovery_load_ratio', input.hasWhoop && recoveryCount >= 5 && strainCount >= 5, input.hasWhoop ? 'Needs enough recovery and strain snapshots.' : 'WHOOP data is not available.')
  } else {
    dashboardOnly.push('training_load', 'recovery_load_ratio')
  }

  if (themes.performance) {
    if (enrichedPerformancePoints >= 3) {
      maybeContextual('recovery_performance', input.hasWhoop, input.hasWhoop ? 'Needs WHOOP recovery data.' : 'WHOOP data is not available.')
      dashboardOnly.push('training_efficiency')
    } else {
      maybeContextual('training_efficiency', efficiencyPoints >= 4, 'Needs at least 4 distance workouts with strain.')
      suppressIfMissing('recovery_performance', 'Needs at least 3 enriched workouts with pace or power.')
    }
  } else {
    dashboardOnly.push('recovery_performance', 'training_efficiency')
  }

  if (themes.intensity) {
    maybeContextual('hr_zones', zoneWorkoutCount >= 2, 'Needs HR zone duration data from at least 2 workouts.')
  } else if (zoneWorkoutCount >= 2) {
    dashboardOnly.push('hr_zones')
  }

  if (themes.race) {
    maybeContextual('race_readiness', input.hasWhoop && recoveryCount >= 3, input.hasWhoop ? 'Needs recovery trend data for race readiness.' : 'WHOOP data is not available.')
  } else {
    dashboardOnly.push('race_readiness')
  }

  if (themes.race && disciplineMinutes > 0) {
    maybeContextual('discipline_balance', true, '')
  } else {
    dashboardOnly.push('discipline_balance')
  }

  if ((themes.race || /consisten/i.test(contentText(input))) && input.workouts.length > 0) {
    maybeContextual('consistency_calendar', recoveryCount >= 7 || input.workouts.length > 0, 'Needs recent workout or snapshot data.')
  } else {
    dashboardOnly.push('consistency_calendar')
  }

  for (const key of uniqueKeys(dashboardOnly)) {
    if (!decisions.has(key)) {
      addDecision({
        key,
        priority: 'dashboard_only',
        selected: false,
        reason: 'Useful for dashboard review, but not central to today\'s email.',
      })
    }
  }

  const contextualSelected = contextualCandidates
    .filter((key) => decisions.get(key)?.selected)
    .slice(0, 3)

  for (const key of contextualCandidates) {
    const decision = decisions.get(key)
    if (!decision || contextualSelected.includes(key)) continue
    addDecision({
      ...decision,
      priority: 'dashboard_only',
      selected: false,
      reason: 'Contextual chart limit reached for a compact email.',
    })
  }

  for (const key of CHART_KEYS) {
    if (!decisions.has(key)) {
      addDecision({
        key,
        priority: 'dashboard_only',
        selected: false,
        reason: 'Not central to today\'s briefing.',
      })
    }
  }

  const chartDecisions = CHART_KEYS.map((key) => decisions.get(key)!)
  const selected = chartDecisions.filter((decision) => decision.selected)

  return {
    permanentCharts: selected.filter((decision) => decision.priority === 'permanent').map((decision) => decision.key),
    contextualCharts: selected.filter((decision) => decision.priority === 'contextual').map((decision) => decision.key),
    dashboardOnlyCharts: chartDecisions.filter((decision) => decision.priority === 'dashboard_only').map((decision) => decision.key),
    suppressedCharts: chartDecisions.filter((decision) => decision.priority === 'suppressed'),
    chartDecisions,
    brandImage: selectBrandImage(input, themes),
  }

  function maybePermanent(key: EmailChartKey, available: boolean, weakReason: string): void {
    if (decisions.has(key)) return
    if (available) {
      addDecision({
        key,
        priority: 'permanent',
        selected: true,
        reason: 'Core readiness trend for WHOOP-connected athletes.',
      })
    } else {
      addDecision({
        key,
        priority: 'suppressed',
        selected: false,
        reason: weakReason,
      })
    }
  }

  function maybeContextual(key: EmailChartKey, available: boolean, weakReason: string): void {
    if (decisions.has(key)) return
    if (available) {
      contextualCandidates.push(key)
      addDecision({
        key,
        priority: 'contextual',
        selected: true,
        reason: 'Selected because today\'s briefing emphasizes this signal.',
      })
    } else {
      addDecision({
        key,
        priority: 'suppressed',
        selected: false,
        reason: weakReason,
      })
    }
  }

  function suppressIfMissing(key: EmailChartKey, reason: string): void {
    if (decisions.has(key)) return
    addDecision({
      key,
      priority: 'suppressed',
      selected: false,
      reason,
    })
  }
}

export function isEmailChartSelected(displayState: EmailDisplayState, key: EmailChartKey): boolean {
  return displayState.chartDecisions.some((decision) => decision.key === key && decision.selected)
}

function withCopy(decision: EmailChartDecision): EmailChartDecision {
  return {
    ...CHART_COPY[decision.key],
    ...decision,
  }
}

function countSnapshots(
  snapshots: BuildEmailDisplayStateInput['snapshots'],
  key: 'recovery_score' | 'hrv' | 'strain'
): number {
  return snapshots.filter((snapshot) => typeof snapshot[key] === 'number').length
}

function countSleepRecoveryPairs(snapshots: BuildEmailDisplayStateInput['snapshots']): number {
  let count = 0
  for (let i = 0; i < snapshots.length - 1; i++) {
    if (snapshots[i].sleep_performance != null && snapshots[i + 1].recovery_score != null) {
      count += 1
    }
  }
  return count
}

function totalZoneMinutes(workouts: BuildEmailDisplayStateInput['workouts']): number {
  return workouts.reduce((sum, workout) => {
    return sum +
      ((workout.zone_one_ms ?? 0) +
        (workout.zone_two_ms ?? 0) +
        (workout.zone_three_ms ?? 0) +
        (workout.zone_four_ms ?? 0) +
        (workout.zone_five_ms ?? 0)) / 60_000
  }, 0)
}

function countZoneWorkouts(workouts: BuildEmailDisplayStateInput['workouts']): number {
  return workouts.filter((workout) => {
    return ((workout.zone_one_ms ?? 0) +
      (workout.zone_two_ms ?? 0) +
      (workout.zone_three_ms ?? 0) +
      (workout.zone_four_ms ?? 0) +
      (workout.zone_five_ms ?? 0)) > 0
  }).length
}

function totalDisciplineMinutes(input: BuildEmailDisplayStateInput): number {
  if (input.disciplineBalance) {
    return Object.values(input.disciplineBalance).reduce((sum, discipline) => sum + discipline.minutes, 0)
  }

  return totalZoneMinutes(input.workouts)
}

function countRecoveryPerformancePoints(input: BuildEmailDisplayStateInput): number {
  const snapshotMap = new Map(input.snapshots.map((snapshot) => [snapshot.date, snapshot]))

  return (input.enrichedWorkouts ?? []).filter((workout) => {
    const snapshot = snapshotMap.get(workout.date)
    if (!snapshot?.recovery_score) return false
    if (workout.sport === 'cycling' && workout.avg_power) return true
    if (workout.sport === 'running' && workout.splits && workout.splits.length > 0) return true
    return false
  }).length
}

function countEfficiencyPoints(input: BuildEmailDisplayStateInput): number {
  const snapshotMap = new Map(input.snapshots.map((snapshot) => [snapshot.date, snapshot]))

  return (input.enrichedWorkouts ?? []).filter((workout) => {
    const snapshot = snapshotMap.get(workout.date)
    return !!snapshot?.strain && !!workout.distance_m && workout.distance_m >= 500
  }).length
}

function contentText(input: BuildEmailDisplayStateInput): string {
  const briefing = input.briefing ?? {}
  return [briefing.headline, briefing.trainingCall, briefing.coachNote]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function selectBrandImage(input: BuildEmailDisplayStateInput, themes: EmailContentThemes): EmailDisplayState['brandImage'] {
  const recoveryColor = String(input.briefing?.recoveryColor ?? '').toLowerCase()

  if (themes.strength) {
    return {
      heroSrc: `${TRANSPARENT_BASE}/focus.png`,
      footerSrc: FOOTER_SRC,
      rationale: 'Strength/training-focused day uses a coaching-focused Coach Dave asset.',
    }
  }

  if (recoveryColor === 'red') {
    return {
      heroSrc: `${TRANSPARENT_BASE}/armcrossed_full_transparent.png`,
      footerSrc: FOOTER_SRC,
      rationale: 'Red/rest day uses a calm recovery Coach Dave asset.',
    }
  }

  if (recoveryColor === 'yellow') {
    return {
      heroSrc: `${TRANSPARENT_BASE}/briefing-transparent.png`,
      footerSrc: FOOTER_SRC,
      rationale: 'Yellow/controlled day uses a briefing Coach Dave asset.',
    }
  }

  if (themes.performance || themes.race || recoveryColor === 'green') {
    return {
      heroSrc: `${TRANSPARENT_BASE}/cheer_transparent.png`,
      footerSrc: FOOTER_SRC,
      rationale: 'Green/high-readiness day uses an upbeat Coach Dave asset.',
    }
  }

  return {
    heroSrc: `${TRANSPARENT_BASE}/briefing2-transparent.png`,
    footerSrc: FOOTER_SRC,
    rationale: 'Default day uses a neutral coaching Coach Dave asset.',
  }
}

function uniqueKeys(keys: EmailChartKey[]): EmailChartKey[] {
  return Array.from(new Set(keys))
}
