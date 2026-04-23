// ============================================
// POST /api/strava/disconnect
// Clears Strava tokens and marks as disconnected
// Protected: requires admin auth
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { clearTokens } from '@/lib/strava-token-storage';
import { markDisconnected } from '@/lib/api-connections';
import { verifyAdminRequest, adminUnauthorizedResponse } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return adminUnauthorizedResponse();

  try {
    await clearTokens();
    await markDisconnected('strava');

    return NextResponse.json({ success: true, message: 'Strava disconnected' });
  } catch (error) {
    console.error('[strava/disconnect] Error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Strava' },
      { status: 500 },
    );
  }
}
