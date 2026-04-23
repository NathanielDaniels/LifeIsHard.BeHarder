// ============================================
// GET /api/strava/activities
// Returns cached Strava activities from Supabase
// Query params: ?days=90 (default 90)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getActivities } from '@/lib/strava-history';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const parsedDays = parseInt(
    request.nextUrl.searchParams.get('days') || '90',
    10,
  );
  const days = Number.isNaN(parsedDays) || parsedDays < 1 ? 90 : parsedDays;

  try {
    const activities = await getActivities(Math.min(days, 365));

    return NextResponse.json({
      activities,
      count: activities.length,
      days,
    });
  } catch (error) {
    console.error('[strava/activities] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 },
    );
  }
}
