-- Strava Enrichment: add detail fields + JSONB extras
-- Run in Supabase SQL Editor

-- List-endpoint fields (no extra API calls)
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS average_temp REAL;
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS start_time_local TEXT;
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS trainer BOOLEAN DEFAULT FALSE;
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS pr_count INTEGER DEFAULT 0;
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS gear_id TEXT;
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS perceived_exertion REAL;
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS workout_type INTEGER;

-- Enrichment data from detail + zones API calls
ALTER TABLE strava_activities ADD COLUMN IF NOT EXISTS extras JSONB;
