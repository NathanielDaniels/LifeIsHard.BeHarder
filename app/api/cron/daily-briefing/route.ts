// ============================================
// GET /api/cron/daily-briefing
//
// Runs daily via Vercel cron. Steps:
// 1. Snapshot today's WHOOP data to Supabase
// 2. Prune snapshots older than 90 days
//
// AI briefing generation + email is handled locally
// via Claude Code (no Anthropic API cost).
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/whoop-token-storage';
import { snapshotToday, saveAllWorkouts, pruneOldSnapshots } from '@/lib/whoop-history';

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

    // 3. Prune old data
    const pruned = await pruneOldSnapshots();
    if (pruned > 0) {
      console.log(`[daily-briefing] Pruned ${pruned} old snapshots`);
    }

    const elapsed = Date.now() - startTime;
    return NextResponse.json({
      success: true,
      date: snapshot.date,
      workoutsSaved: workoutResult.saved,
      prunedCount: pruned,
      elapsedMs: elapsed,
    });
  } catch (error) {
    console.error('[daily-briefing] Cron error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
