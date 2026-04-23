// ============================================
// POST /api/strava/sync
// Manually trigger Strava activity sync (admin-only)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, adminUnauthorizedResponse } from '@/lib/admin-auth';
import { getValidAccessToken } from '@/lib/strava-token-storage';
import { syncNewActivities, backfillActivities } from '@/lib/strava-history';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return adminUnauthorizedResponse();
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: 'No valid Strava token. Re-authorize first.' },
      { status: 401 },
    );
  }

  const mode = request.nextUrl.searchParams.get('mode') || 'sync';

  if (mode === 'backfill') {
    const result = await backfillActivities(accessToken);
    return NextResponse.json({
      mode: 'backfill',
      saved: result.saved,
      errors: result.errors,
    });
  }

  const result = await syncNewActivities(accessToken);
  return NextResponse.json({
    mode: 'sync',
    newActivities: result.newActivities,
    errors: result.errors,
  });
}
