// ============================================
// GET /api/cron/strava-sync
// Vercel Cron — syncs new Strava activities to Supabase.
// Runs every 4 hours. Token refresh is handled internally.
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/strava-token-storage';
import { syncNewActivities } from '@/lib/strava-history';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sets this automatically)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    console.error('[strava-sync] No valid Strava token. Re-authorize required.');
    return NextResponse.json(
      { error: 'No valid Strava token. Re-authorize via /admin.' },
      { status: 401 },
    );
  }

  try {
    const result = await syncNewActivities(accessToken);
    console.log(
      `[strava-sync] Synced ${result.newActivities} new activities, ${result.errors} errors`,
    );
    return NextResponse.json({
      synced: result.newActivities,
      errors: result.errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[strava-sync] Sync failed:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
