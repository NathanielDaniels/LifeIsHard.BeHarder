// ============================================
// GET /api/cron/daily-briefing
//
// Runs daily via Vercel cron. Steps:
// 1. Snapshot today's WHOOP data
// 2. Load 90 days of snapshots
// 3. Generate AI briefing
// 4. Prune snapshots older than 90 days
// ============================================

import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/whoop-token-storage';
import { snapshotToday, getSnapshots, pruneOldSnapshots } from '@/lib/whoop-history';
import { generateBriefing, saveBriefing } from '@/lib/ai-briefing';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // seconds

export async function GET() {
  const startTime = Date.now();

  try {
    // 1. Get access token
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'WHOOP not connected — skipping briefing' },
        { status: 200 }, // Don't fail the cron
      );
    }

    // 2. Snapshot today's data
    const snapshot = await snapshotToday(accessToken);
    console.log(`[daily-briefing] Snapshot saved for ${snapshot.date}`);

    // 3. Load 90 days of history
    const snapshots = await getSnapshots(90);
    console.log(`[daily-briefing] Loaded ${snapshots.length} days of history`);

    // 4. Generate AI briefing
    const markdown = await generateBriefing(snapshots);
    const today = new Date().toISOString().split('T')[0];
    await saveBriefing(today, markdown, snapshots.length);
    console.log(`[daily-briefing] Briefing generated and saved`);

    // 5. Prune old data
    const pruned = await pruneOldSnapshots();
    if (pruned > 0) {
      console.log(`[daily-briefing] Pruned ${pruned} old snapshots`);
    }

    const elapsed = Date.now() - startTime;
    return NextResponse.json({
      success: true,
      date: today,
      snapshotCount: snapshots.length,
      prunedCount: pruned,
      elapsedMs: elapsed,
    });
  } catch (error) {
    console.error('[daily-briefing] Cron error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
