// ============================================
// WHOOP API Client
// Server-side only - handles OAuth and API calls
// ============================================

import {
  WhoopTokens,
  WhoopProfile,
  WhoopRecovery,
  WhoopCycle,
  WhoopSleep,
  WhoopWorkout,
  WhoopStats,
  DEMO_WHOOP_STATS,
} from '@/types/whoop';

const WHOOP_API_BASE = 'https://api.prod.whoop.com';
const WHOOP_AUTH_URL = `${WHOOP_API_BASE}/oauth/oauth2/auth`;
const WHOOP_TOKEN_URL = `${WHOOP_API_BASE}/oauth/oauth2/token`;
const WHOOP_API_URL = `${WHOOP_API_BASE}/developer`;

// ============================================
// Configuration
// ============================================

export function getWhoopConfig() {
  return {
    clientId: process.env.WHOOP_CLIENT_ID || '',
    clientSecret: process.env.WHOOP_CLIENT_SECRET || '',
    redirectUri: process.env.WHOOP_REDIRECT_URI || '',
    enabled: process.env.WHOOP_ENABLED === 'true',
  };
}

export function isWhoopEnabled(): boolean {
  const config = getWhoopConfig();
  return config.enabled && !!config.clientId && !!config.clientSecret;
}

// ============================================
// OAuth Flow
// ============================================

const SCOPES = [
  'offline',           // Refresh tokens
  'read:profile',      // Basic profile
  'read:recovery',     // Recovery scores
  'read:cycles',       // Daily strain
  'read:workout',      // Workout data
  // Add back when enabled in WHOOP Developer Portal:
  // 'read:sleep',        // Sleep data
  // 'read:body_measurement', // Height, weight, max HR
];

export function getAuthorizationUrl(state: string): string {
  const config = getWhoopConfig();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    state,
  });
  
  return `${WHOOP_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<WhoopTokens> {
  const config = getWhoopConfig();
  
  const response = await fetch(WHOOP_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }
  
  const data = await response.json();
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in * 1000),
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<WhoopTokens> {
  const config = getWhoopConfig();
  
  const response = await fetch(WHOOP_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: 'offline',
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }
  
  const data = await response.json();
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    expires_at: Date.now() + (data.expires_in * 1000),
  };
}

// ============================================
// API Request Helper
// ============================================

async function whoopFetch<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${WHOOP_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (response.status === 429) {
    throw new Error('Rate limited by WHOOP API');
  }
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WHOOP API error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

// ============================================
// Data Fetching
// ============================================

export async function getProfile(accessToken: string): Promise<WhoopProfile> {
  return whoopFetch<WhoopProfile>('/v2/user/profile/basic', accessToken);
}

export async function getLatestRecovery(accessToken: string): Promise<WhoopRecovery | null> {
  const response = await whoopFetch<{ records: WhoopRecovery[] }>(
    '/v2/recovery?limit=1',
    accessToken
  );
  return response.records[0] || null;
}

export async function getLatestCycle(accessToken: string): Promise<WhoopCycle | null> {
  const response = await whoopFetch<{ records: WhoopCycle[] }>(
    '/v2/cycle?limit=1',
    accessToken
  );
  return response.records[0] || null;
}

export async function getLatestSleep(accessToken: string): Promise<WhoopSleep | null> {
  const response = await whoopFetch<{ records: WhoopSleep[] }>(
    '/v2/activity/sleep?limit=1',
    accessToken
  );
  return response.records[0] || null;
}

export async function getLatestWorkout(accessToken: string): Promise<WhoopWorkout | null> {
  const response = await whoopFetch<{ records: WhoopWorkout[] }>(
    '/v2/activity/workout?limit=1',
    accessToken
  );
  return response.records[0] || null;
}

// ============================================
// Aggregated Stats
// ============================================

export async function fetchWhoopStats(accessToken: string): Promise<WhoopStats> {
  try {
    // Fetch all data in parallel
    const [recovery, cycle, sleep, workout] = await Promise.all([
      getLatestRecovery(accessToken).catch(() => null),
      getLatestCycle(accessToken).catch(() => null),
      getLatestSleep(accessToken).catch(() => null),
      getLatestWorkout(accessToken).catch(() => null),
    ]);
    
    // Calculate current heart rate with decay
    const { currentHeartRate, heartRateSource } = calculateCurrentHeartRate(
      recovery?.score?.resting_heart_rate || null,
      workout
    );
    
    // Convert sleep duration from milliseconds to minutes
    const sleepDurationMs = sleep?.score?.stage_summary?.total_in_bed_time_milli || 0;
    const sleepDurationMinutes = Math.round(sleepDurationMs / 60000);
    
    // Convert workout duration
    let workoutDurationMinutes: number | null = null;
    if (workout?.start && workout?.end) {
      const start = new Date(workout.start).getTime();
      const end = new Date(workout.end).getTime();
      workoutDurationMinutes = Math.round((end - start) / 60000);
    }
    
    // Convert kilojoules to calories (1 kJ = 0.239 kcal)
    const cycleCals = cycle?.score?.kilojoule 
      ? Math.round(cycle.score.kilojoule * 0.239) 
      : null;
    const workoutCals = workout?.score?.kilojoule
      ? Math.round(workout.score.kilojoule * 0.239)
      : null;
    
    return {
      connected: true,
      lastUpdated: new Date().toISOString(),
      
      // Recovery
      recovery: recovery?.score?.recovery_score ?? null,
      restingHeartRate: recovery?.score?.resting_heart_rate ?? null,
      hrv: recovery?.score?.hrv_rmssd_milli ?? null,
      spo2: recovery?.score?.spo2_percentage ?? null,
      skinTemp: recovery?.score?.skin_temp_celsius ?? null,
      
      // Strain
      strain: cycle?.score?.strain ?? null,
      calories: cycleCals,
      averageHeartRate: cycle?.score?.average_heart_rate ?? null,
      maxHeartRate: cycle?.score?.max_heart_rate ?? null,
      
      // Sleep
      sleepPerformance: sleep?.score?.sleep_performance_percentage ?? null,
      sleepDuration: sleepDurationMinutes || null,
      sleepConsistency: sleep?.score?.sleep_consistency_percentage ?? null,
      
      // Last workout
      lastWorkout: workout?.score ? {
        sport: workout.sport_name || 'Activity',
        strain: workout.score.strain,
        duration: workoutDurationMinutes || 0,
        averageHeartRate: workout.score.average_heart_rate,
        maxHeartRate: workout.score.max_heart_rate,
        calories: workoutCals || 0,
        completedAt: workout.end,
      } : null,
      
      currentHeartRate,
      heartRateSource,
    };
  } catch (error) {
    console.error('Error fetching WHOOP stats:', error);
    throw error;
  }
}

// ============================================
// Heart Rate Decay Calculation
// ============================================

/**
 * Calculate the current heart rate based on:
 * - Resting heart rate (baseline)
 * - Last workout average HR
 * - Time since workout ended
 * 
 * Heart rate decays from workout avg back to resting over ~2 hours
 */
function calculateCurrentHeartRate(
  restingHR: number | null,
  workout: WhoopWorkout | null
): { currentHeartRate: number; heartRateSource: 'resting' | 'workout' | 'decay' } {
  const defaultResting = 65;
  const resting = restingHR ?? defaultResting;
  
  if (!workout?.score || !workout.end) {
    return { currentHeartRate: resting, heartRateSource: 'resting' };
  }
  
  const workoutEndTime = new Date(workout.end).getTime();
  const now = Date.now();
  const timeSinceWorkout = now - workoutEndTime;
  
  // Decay period: 2 hours (in milliseconds)
  const DECAY_PERIOD = 2 * 60 * 60 * 1000;
  
  // If workout was more than 2 hours ago, use resting
  if (timeSinceWorkout >= DECAY_PERIOD) {
    return { currentHeartRate: resting, heartRateSource: 'resting' };
  }
  
  // If workout just ended (within 5 minutes), use workout HR
  if (timeSinceWorkout < 5 * 60 * 1000) {
    return { 
      currentHeartRate: workout.score.average_heart_rate, 
      heartRateSource: 'workout' 
    };
  }
  
  // Calculate decay using exponential easing
  // Fast initial drop, then gradual settling
  const progress = timeSinceWorkout / DECAY_PERIOD;
  const easedProgress = 1 - Math.pow(1 - progress, 2); // Ease-out quadratic
  
  const workoutHR = workout.score.average_heart_rate;
  const currentHR = Math.round(workoutHR - (workoutHR - resting) * easedProgress);
  
  return { currentHeartRate: currentHR, heartRateSource: 'decay' };
}

// ============================================
// Demo Mode
// ============================================

export function getDemoStats(): WhoopStats {
  // Recalculate decay for demo mode based on demo workout time
  const demoWorkoutEnd = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
  
  return {
    ...DEMO_WHOOP_STATS,
    lastUpdated: new Date().toISOString(),
    lastWorkout: DEMO_WHOOP_STATS.lastWorkout ? {
      ...DEMO_WHOOP_STATS.lastWorkout,
      completedAt: demoWorkoutEnd.toISOString(),
    } : null,
  };
}
