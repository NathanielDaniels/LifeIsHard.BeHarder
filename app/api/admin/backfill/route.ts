// ============================================
// POST /api/admin/backfill
// One-time endpoint to backfill 90 days of WHOOP history
// Protected by admin auth
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getValidAccessToken } from '@/lib/whoop-token-storage';
import { backfillHistory, backfillWorkouts } from '@/lib/whoop-history';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // backfill needs time

export async function POST(request: NextRequest) {
  const isAuthed = await verifyAdminRequest(request);
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'WHOOP not connected' },
        { status: 400 },
      );
    }

    const { days = 90 } = await request.json().catch(() => ({}));
    const cappedDays = Math.min(days, 365);

    const [snapshotResult, workoutResult] = await Promise.all([
      backfillHistory(accessToken, Math.min(cappedDays, 90)),
      backfillWorkouts(accessToken, cappedDays),
    ]);

    return NextResponse.json({
      success: true,
      snapshots: snapshotResult,
      workouts: workoutResult,
    });
  } catch (error) {
    console.error('[backfill] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Backfill failed' },
      { status: 500 },
    );
  }
}
