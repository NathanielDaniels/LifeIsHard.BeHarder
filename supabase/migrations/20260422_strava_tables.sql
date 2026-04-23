-- ============================================
-- Strava Integration Tables
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Token storage (mirrors whoop_tokens)
CREATE TABLE IF NOT EXISTS strava_tokens (
  id              TEXT PRIMARY KEY DEFAULT 'primary',
  access_token    TEXT NOT NULL,
  refresh_token   TEXT NOT NULL,
  expires_at      BIGINT NOT NULL,          -- Unix ms timestamp
  strava_user_id  BIGINT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. OAuth state for CSRF protection (mirrors whoop_oauth_state)
CREATE TABLE IF NOT EXISTS strava_oauth_state (
  id              TEXT PRIMARY KEY DEFAULT 'primary',
  state           TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activity records (enriched on insert)
CREATE TABLE IF NOT EXISTS strava_activities (
  strava_activity_id  BIGINT PRIMARY KEY,
  date                DATE NOT NULL,
  name                TEXT NOT NULL,
  type                TEXT NOT NULL,         -- Run, Ride, Swim
  sport_type          TEXT NOT NULL,         -- TrailRun, MountainBikeRide, etc.
  distance_meters     REAL,
  moving_time_seconds INTEGER,
  elapsed_time_seconds INTEGER,
  elevation_gain_meters REAL,
  average_speed_mps   REAL,
  max_speed_mps       REAL,
  average_heartrate   REAL,
  max_heartrate       REAL,
  average_watts       REAL,
  max_watts           REAL,
  weighted_average_watts REAL,
  average_cadence     REAL,
  suffer_score        REAL,
  calories            REAL,
  has_heartrate       BOOLEAN DEFAULT FALSE,
  device_watts        BOOLEAN DEFAULT FALSE,
  summary_polyline    TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strava_activities_date
  ON strava_activities (date DESC);

CREATE INDEX IF NOT EXISTS idx_strava_activities_type
  ON strava_activities (type);

-- 4. Sync log for smart polling
CREATE TABLE IF NOT EXISTS strava_sync_log (
  id                  TEXT PRIMARY KEY DEFAULT 'primary',
  last_checked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_id    BIGINT,
  last_activity_at    TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security — server-only access
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_oauth_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_sync_log ENABLE ROW LEVEL SECURITY;

-- Seed the sync log row
INSERT INTO strava_sync_log (id) VALUES ('primary')
  ON CONFLICT (id) DO NOTHING;

-- 5. Ensure strava exists in api_connections
INSERT INTO api_connections (id, display_name, status)
  VALUES ('strava', 'Strava', 'disconnected')
  ON CONFLICT (id) DO NOTHING;
