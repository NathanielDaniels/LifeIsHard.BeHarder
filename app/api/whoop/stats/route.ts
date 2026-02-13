// ============================================
// GET /api/whoop/stats
// Returns current WHOOP stats (cached)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { isWhoopEnabled, fetchWhoopStats, getDemoStats } from '@/lib/whoop-client';
import { getValidAccessToken } from '@/lib/whoop-storage';
import { getStatsWithCache } from '@/lib/whoop-cache';
import { WhoopStats } from '@/types/whoop';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // --- Rate Limiting: 30 requests/minute per IP ---
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`stats:${ip}`, 30, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  try {
    // Check if WHOOP integration is enabled
    if (!isWhoopEnabled()) {
      // Return demo data in development/demo mode
      const demoStats = getDemoStats();
      return NextResponse.json({
        ...demoStats,
        mode: 'demo',
      });
    }
    
    // Get valid access token (auto-refreshes if needed)
    const accessToken = await getValidAccessToken();
    
    if (!accessToken) {
      // Not authorized yet - return demo data with auth prompt
      return NextResponse.json({
        ...getDemoStats(),
        mode: 'unauthorized',
        authRequired: true,
      });
    }
    
    // Fetch stats with caching
    const stats: WhoopStats = await getStatsWithCache(() => 
      fetchWhoopStats(accessToken)
    );
    
    return NextResponse.json({
      ...stats,
      mode: 'live',
    });
    
  } catch (error) {
    console.error('Error fetching WHOOP stats:', error);
    
    // Return demo data on error
    return NextResponse.json({
      ...getDemoStats(),
      mode: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 200 }); // Still 200 so the UI works
  }
}
