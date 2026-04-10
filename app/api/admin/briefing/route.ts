// ============================================
// GET /api/admin/briefing
// Returns today's AI briefing (or most recent)
// Protected by admin auth
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { getTodayBriefing, getLatestBriefing } from '@/lib/ai-briefing';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify admin session
  const isAuthed = await verifyAdminRequest(request);
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Try today's briefing first, fall back to most recent
  const briefing = await getTodayBriefing() ?? await getLatestBriefing();

  if (!briefing) {
    return NextResponse.json({
      available: false,
      message: 'No briefing generated yet. Run the daily briefing cron or wait for the morning run.',
    });
  }

  return NextResponse.json({
    available: true,
    ...briefing,
  });
}
