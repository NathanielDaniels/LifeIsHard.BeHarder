// ============================================
// WHOOP API Types
// ============================================

export interface WhoopTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp
}

export interface WhoopProfile {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface WhoopBodyMeasurement {
  height_meter: number;
  weight_kilogram: number;
  max_heart_rate: number;
}

export interface WhoopCycleScore {
  strain: number;
  kilojoule: number;
  average_heart_rate: number;
  max_heart_rate: number;
}

export interface WhoopCycle {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE';
  score: WhoopCycleScore | null;
}

export interface WhoopRecoveryScore {
  user_calibrating: boolean;
  recovery_score: number;
  resting_heart_rate: number;
  hrv_rmssd_milli: number;
  spo2_percentage: number;
  skin_temp_celsius: number;
}

export interface WhoopRecovery {
  cycle_id: number;
  sleep_id: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE';
  score: WhoopRecoveryScore | null;
}

export interface WhoopSleepStages {
  total_in_bed_time_milli: number;
  total_awake_time_milli: number;
  total_no_data_time_milli: number;
  total_light_sleep_time_milli: number;
  total_slow_wave_sleep_time_milli: number;
  total_rem_sleep_time_milli: number;
  sleep_cycle_count: number;
  disturbance_count: number;
}

export interface WhoopSleepNeeded {
  baseline_milli: number;
  need_from_sleep_debt_milli: number;
  need_from_recent_strain_milli: number;
  need_from_recent_nap_milli: number;
}

export interface WhoopSleepScore {
  stage_summary: WhoopSleepStages;
  sleep_needed: WhoopSleepNeeded;
  respiratory_rate: number;
  sleep_performance_percentage: number;
  sleep_consistency_percentage: number;
  sleep_efficiency_percentage: number;
}

export interface WhoopSleep {
  id: string;
  cycle_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE';
  score: WhoopSleepScore | null;
}

export interface WhoopWorkoutZones {
  zone_zero_milli: number;
  zone_one_milli: number;
  zone_two_milli: number;
  zone_three_milli: number;
  zone_four_milli: number;
  zone_five_milli: number;
}

export interface WhoopWorkoutScore {
  strain: number;
  average_heart_rate: number;
  max_heart_rate: number;
  kilojoule: number;
  percent_recorded: number;
  distance_meter?: number;
  altitude_gain_meter?: number;
  altitude_change_meter?: number;
  zone_durations: WhoopWorkoutZones;
}

export interface WhoopWorkout {
  id: string;
  v1_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  sport_id: number;
  sport_name: string;
  score_state: 'SCORED' | 'PENDING_SCORE' | 'UNSCORABLE';
  score: WhoopWorkoutScore | null;
}

// ============================================
// Webhook Event Types
// ============================================

export type WhoopWebhookEventType = 
  | 'workout.updated'
  | 'sleep.updated'
  | 'recovery.updated';

export interface WhoopWebhookPayload {
  user_id: number;
  id: string; // UUID of the resource
  type: WhoopWebhookEventType;
  trace_id: string;
  timestamp: string;
}

// ============================================
// Aggregated Stats (What we display)
// ============================================

export interface WhoopStats {
  // Connection status
  connected: boolean;
  lastUpdated: string | null;
  
  // Recovery metrics (from morning)
  recovery: number | null;           // 0-100
  restingHeartRate: number | null;   // BPM
  hrv: number | null;                // ms (RMSSD)
  spo2: number | null;               // percentage
  skinTemp: number | null;           // celsius
  
  // Daily strain
  strain: number | null;             // 0-21
  calories: number | null;           // kilojoules converted to kcal
  averageHeartRate: number | null;   // BPM
  maxHeartRate: number | null;       // BPM
  
  // Sleep metrics
  sleepPerformance: number | null;   // percentage
  sleepDuration: number | null;      // minutes
  sleepConsistency: number | null;   // percentage
  
  // Last workout
  lastWorkout: {
    sport: string;
    strain: number;
    duration: number;                // minutes
    averageHeartRate: number;
    maxHeartRate: number;
    calories: number;
    completedAt: string;
  } | null;
  
  // For HR animation decay
  currentHeartRate: number;          // Calculated: decays from workout avg to resting
  heartRateSource: 'resting' | 'workout' | 'decay';
}

// ============================================
// Demo/Fallback Data
// ============================================

export const DEMO_WHOOP_STATS: WhoopStats = {
  connected: false,
  lastUpdated: null,
  
  recovery: 78,
  restingHeartRate: 52,
  hrv: 45,
  spo2: 98,
  skinTemp: 33.5,
  
  strain: 14.2,
  calories: 2850,
  averageHeartRate: 72,
  maxHeartRate: 178,
  
  sleepPerformance: 85,
  sleepDuration: 442,
  sleepConsistency: 88,
  
  lastWorkout: {
    sport: 'Swimming',
    strain: 16.8,
    duration: 134,
    averageHeartRate: 156,
    maxHeartRate: 178,
    calories: 890,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  
  currentHeartRate: 72,
  heartRateSource: 'resting',
};
