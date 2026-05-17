// ============================================
// GET /api/cron/daily-briefing
//
// Runs daily via Vercel cron. Steps:
// 1. Snapshot today's WHOOP data to Supabase
// 2. Sync new Strava activities (smart poll)
// 3. Prune old data (90-day retention)
//
// AI briefing generation + email is handled locally
// via Claude Code (no Anthropic API cost).
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/whoop-token-storage';
import { getValidAccessToken as getStravaToken } from '@/lib/strava-token-storage';
import { snapshotToday, saveAllWorkouts, pruneOldSnapshots } from '@/lib/whoop-history';
import { syncNewActivities, pruneOldActivities } from '@/lib/strava-history';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sets this automatically)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    // 1. Get access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'WHOOP not connected — skipping snapshot' },
        { status: 200 },
      );
    }

    // 2. Snapshot today's data + save all workouts in parallel
    const [snapshot, workoutResult] = await Promise.all([
      snapshotToday(accessToken),
      saveAllWorkouts(accessToken).catch((err) => {
        console.error('[daily-briefing] saveAllWorkouts failed (non-fatal):', err);
        return { saved: 0, errors: [String(err)] };
      }),
    ]);
    console.log(`[daily-briefing] Snapshot saved for ${snapshot.date}, ${workoutResult.saved} workout(s) stored`);

    // 3. Sync Strava activities (non-fatal if not connected)
    let stravaSynced = 0;
    const stravaToken = await getStravaToken();
    if (stravaToken) {
      try {
        const stravaResult = await syncNewActivities(stravaToken);
        stravaSynced = stravaResult.newActivities;
        if (stravaSynced > 0) {
          console.log(`[daily-briefing] Strava: ${stravaSynced} new activity(s) synced`);
        }
      } catch (err) {
        console.error('[daily-briefing] Strava sync failed (non-fatal):', err);
      }
    }

    // 4. Prune old data
    const [pruned, stravaPruned] = await Promise.all([
      pruneOldSnapshots(),
      pruneOldActivities().catch(() => 0),
    ]);
    if (pruned > 0) {
      console.log(`[daily-briefing] Pruned ${pruned} old WHOOP snapshots`);
    }
    if (stravaPruned > 0) {
      console.log(`[daily-briefing] Pruned ${stravaPruned} old Strava activities`);
    }

    const elapsed = Date.now() - startTime;
    return NextResponse.json({
      success: true,
      date: snapshot.date,
      workoutsSaved: workoutResult.saved,
      stravaSynced,
      prunedCount: pruned + stravaPruned,
      elapsedMs: elapsed,
    });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null
        ? JSON.stringify(error)
        : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error('[daily-briefing] Cron error:', message, stack || '');
    return NextResponse.json(
      { error: message, stack: stack?.split('\n').slice(0, 3) },
      { status: 500 },
    );
  }
}
