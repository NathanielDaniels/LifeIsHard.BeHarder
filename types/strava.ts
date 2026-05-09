// ============================================
// Strava API Types
// ============================================

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp (seconds from Strava, stored as ms)
}

// ============================================
// API Response Types
// ============================================

export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string; // avatar URL
  city: string;
  state: string;
  country: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string; // Run, Ride, Swim, etc.
  sport_type: string; // TrailRun, MountainBikeRide, etc.
  start_date: string; // ISO 8601 UTC
  start_date_local: string; // ISO 8601 local
  timezone: string; // e.g. "(GMT-06:00) America/Chicago"
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  average_speed: number; // m/s
  max_speed: number; // m/s
  average_heartrate?: number; // BPM (only if HR monitor)
  max_heartrate?: number; // BPM
  average_watts?: number; // watts (cycling power)
  max_watts?: number; // watts
  weighted_average_watts?: number; // normalized power
  average_cadence?: number; // RPM or SPM
  suffer_score?: number; // Strava's relative effort
  calories?: number;
  has_heartrate: boolean;
  device_watts: boolean; // true if power meter, false if estimated
  map?: {
    id: string;
    summary_polyline: string;
  };
  average_temp?: number;      // celsius
  trainer?: boolean;          // indoor trainer
  pr_count?: number;          // personal records hit
  perceived_exertion?: number; // RPE 1-10
  workout_type?: number;      // Strava workout sub-classification
  gear_id?: string;           // equipment identifier
  description?: string;       // athlete's activity notes
  // Detail endpoint fields (only present on detail calls)
  splits_metric?: any[];
  laps?: any[];
  best_efforts?: any[];
  device_name?: string;
}

// ============================================
// Enrichment Types (stored in extras JSONB)
// ============================================

export interface StravaSplit {
  distance_m: number;
  elapsed_time_s: number;
  moving_time_s: number;
  avg_hr: number | null;
  pace_sec_per_km: number | null;
  elevation_diff: number | null;
}

export interface StravaBestEffort {
  name: string;           // "1 mile", "5k", etc.
  elapsed_time_s: number;
  distance_m: number;
  pr_rank: number | null; // 1 = PR, 2 = 2nd best, etc.
}

export interface StravaHRZone {
  min: number;
  max: number;
  time_s: number;
}

export interface StravaLap {
  name: string;
  distance_m: number;
  elapsed_time_s: number;
  avg_hr: number | null;
  max_hr: number | null;
  avg_watts: number | null;
  avg_cadence: number | null;
}

export interface StravaExtras {
  enriched: boolean;
  enriched_at: string;
  splits?: StravaSplit[];
  best_efforts?: StravaBestEffort[];
  hr_zones?: StravaHRZone[];
  laps?: StravaLap[];
  power_zones?: StravaHRZone[];
  device_name?: string;
  calories_burned?: number;
  normalized_power?: number;
  avg_cadence?: number;
}

export interface StravaStream {
  type: string;
  data: number[];
  series_type: 'distance' | 'time';
  original_size: number;
  resolution: 'low' | 'medium' | 'high';
}

// ============================================
// Supabase Record Types
// ============================================

export interface StravaActivityRecord {
  strava_activity_id: number; // Strava activity ID — upsert key
  date: string; // YYYY-MM-DD (local date)
  name: string;
  type: string; // Run, Ride, Swim
  sport_type: string; // TrailRun, MountainBikeRide, etc.
  distance_meters: number | null;
  moving_time_seconds: number | null;
  elapsed_time_seconds: number | null;
  elevation_gain_meters: number | null;
  average_speed_mps: number | null; // m/s
  max_speed_mps: number | null;
  average_heartrate: number | null;
  max_heartrate: number | null;
  average_watts: number | null;
  max_watts: number | null;
  weighted_average_watts: number | null;
  average_cadence: number | null;
  suffer_score: number | null;
  calories: number | null;
  has_heartrate: boolean;
  device_watts: boolean;
  summary_polyline: string | null;
  average_temp: number | null;
  start_time_local: string | null;   // HH:MM:SS
  trainer: boolean;
  pr_count: number;
  description: string | null;
  gear_id: string | null;
  perceived_exertion: number | null;
  workout_type: number | null;
  extras: StravaExtras | null;
}

export interface StravaSyncLog {
  id: string; // always 'primary'
  last_checked_at: string; // ISO timestamp
  last_activity_id: number | null;
  last_activity_at: string | null; // ISO timestamp of newest activity
  updated_at: string;
}
