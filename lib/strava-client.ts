// ============================================
// Strava API Client
// Server-side only - handles OAuth and API calls
//
// Mirrors whoop-client.ts pattern.
// ============================================

import { StravaTokens, StravaAthlete, StravaActivity } from '@/types/strava';

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';

// ============================================
// Configuration
// ============================================

export function getStravaConfig() {
  return {
    clientId: process.env.STRAVA_CLIENT_ID || '',
    clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
    redirectUri: process.env.STRAVA_REDIRECT_URI || '',
    enabled: process.env.STRAVA_ENABLED === 'true',
  };
}

export function isStravaEnabled(): boolean {
  const config = getStravaConfig();
  return config.enabled && !!config.clientId && !!config.clientSecret && !!config.redirectUri;
}

// ============================================
// OAuth Flow
// ============================================

const SCOPES = [
  'read',
  'activity:read_all', // all activities including private
].join(',');

export function getAuthorizationUrl(state: string): string {
  const config = getStravaConfig();

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: SCOPES,
    state,
    approval_prompt: 'auto',
  });

  return `${STRAVA_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<StravaTokens> {
  const config = getStravaConfig();

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
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
    // Strava returns expires_at in seconds — convert to ms for consistency with WHOOP
    expires_at: data.expires_at * 1000,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<StravaTokens> {
  const config = getStravaConfig();

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed (${response.status}): ${error}`);
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    expires_at: data.expires_at * 1000,
  };
}

// ============================================
// API Request Helper
// ============================================

async function stravaFetch<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${STRAVA_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (response.status === 429) {
    const limit = response.headers.get('X-RateLimit-Limit');
    const usage = response.headers.get('X-RateLimit-Usage');
    throw new Error(`Rate limited by Strava API (limit: ${limit}, usage: ${usage})`);
  }

  if (response.status === 401) {
    throw new Error('STRAVA_UNAUTHORIZED');
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Strava API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ============================================
// Data Fetching
// ============================================

export async function getAthlete(accessToken: string): Promise<StravaAthlete> {
  return stravaFetch<StravaAthlete>('/athlete', accessToken);
}

/**
 * Fetches activities created after a given Unix timestamp.
 * Used for smart polling — only fetch what's new.
 *
 * Strava paginates at 30 per page by default, max 200.
 */
export async function getActivitiesAfter(
  accessToken: string,
  afterEpoch: number,
  perPage = 30,
): Promise<StravaActivity[]> {
  const all: StravaActivity[] = [];
  let page = 1;

  do {
    const params = new URLSearchParams({
      after: String(afterEpoch),
      per_page: String(perPage),
      page: String(page),
    });

    const activities = await stravaFetch<StravaActivity[]>(
      `/athlete/activities?${params}`,
      accessToken,
    );

    if (!activities.length) break;
    all.push(...activities);

    // If we got fewer than perPage, we've reached the end
    if (activities.length < perPage) break;
    page++;
  } while (true);

  return all;
}

/**
 * Fetches a single activity by ID with full detail.
 */
export async function getActivity(
  accessToken: string,
  activityId: number,
): Promise<StravaActivity> {
  return stravaFetch<StravaActivity>(`/activities/${activityId}`, accessToken);
}

/**
 * Fetches recent activities (most recent first).
 * Used for initial backfill.
 */
export async function getRecentActivities(
  accessToken: string,
  perPage = 30,
  page = 1,
): Promise<StravaActivity[]> {
  const params = new URLSearchParams({
    per_page: String(perPage),
    page: String(page),
  });

  return stravaFetch<StravaActivity[]>(
    `/athlete/activities?${params}`,
    accessToken,
  );
}
