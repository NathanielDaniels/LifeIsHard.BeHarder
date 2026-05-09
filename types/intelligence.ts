// ============================================
// Intelligence Card Types
// Used by evening-briefing-email.tsx
// Produced by compute-intelligence.py
// ============================================

export interface PerformanceContext {
  grade: string              // "A", "B+", "C-", etc.
  gradeColor: string         // hex color for the grade
  todayPace: string          // "6:45/km"
  todayRecovery: number      // 52
  todayRecoveryColor: string // "yellow"
  comparisonText: string     // "stronger than last week's 6:20/km on green (81%)"
  effortPerRecovery: number  // 12.9
  comparisonEPR: number      // 7.7
}

export interface PatternDetection {
  pattern: string            // "3 of your last 4 PRs came after green recovery + sleep > 7.5 hrs"
  todayMatch: boolean        // does today match the pattern conditions
  confidence: number         // 0-100
  sampleCount: number        // number of data points
}

export interface RecoveryCostForecast {
  expectedZone: 'green' | 'yellow' | 'red'
  expectedRange: string      // "55-65%"
  todayStrain: number
  todaySport: string
  todayDuration: string      // "90 min"
  historicalAvg: number      // avg next-day recovery after similar load
  explanation: string
}

export interface TemperatureImpact {
  tempC: number
  baselineTempC: number
  paceDeltaSecPerKm: number  // positive = slower
  explanation: string
  raceImplication?: string   // "Nationals forecast: 26°C..."
}

export interface DisciplineRecoveryCost {
  disciplines: {
    sport: string            // "Swim", "Run", "Bike"
    emoji: string            // "🏊", "🏃", "🚴"
    costPerStrain: number    // recovery points lost per unit strain
    label: string            // "low cost", "moderate", "high cost"
  }[]
  insight: string            // "Long bike sessions (>90 min) hit 2x harder..."
}

export interface IntelligenceOutput {
  performanceContext?: PerformanceContext
  patternDetection?: PatternDetection
  recoveryCostForecast?: RecoveryCostForecast
  temperatureImpact?: TemperatureImpact
  disciplineRecoveryCost?: DisciplineRecoveryCost
}

export interface EveningBriefingProps {
  date: string
  // Workout recap
  workoutName: string
  workoutSport: string       // "Run", "Ride", "Swim"
  workoutDistance: string     // "5.2 km"
  workoutDuration: string    // "32:15"
  workoutStrain: number | null
  // Intelligence cards
  intelligence: IntelligenceOutput
  // Coach analysis
  coachAnalysis: string
  // Check-in
  q1Label?: string
  q1Buttons?: { label: string; url: string }[]
  q2Label?: string
  q2Buttons?: { label: string; url: string }[]
  checkinUrl?: string
}
