// ============================================
// GET /api/whoop/stats
// Returns current WHOOP stats (Supabase-cached)
// ============================================

import { NextRequest, NextResponse } from "next/server";
import {
  isWhoopEnabled,
  fetchWhoopStats,
  getDemoStats,
} from "@/lib/whoop-client";
import {
  getValidAccessToken,
  TokenExpiredError,
  TokenRefreshError,
} from "@/lib/whoop-token-storage";
import { getStatsWithCache } from "@/lib/whoop-cache";
import { WhoopStats } from "@/types/whoop";
import { rateLimit, getClientIP, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Rate limit: 30 req/min per IP
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`stats:${ip}`, 30, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  // WHOOP not configured - return demo
  if (!isWhoopEnabled()) {
    return NextResponse.json({ ...getDemoStats(), mode: "demo" });
  }

  // Get access token
  let accessToken: string | null;
  try {
    accessToken = await getValidAccessToken();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      // Refresh token is dead - tell the client to show re-auth UI
      return NextResponse.json(
        { ...getDemoStats(), mode: "unauthorized", authRequired: true },
        { status: 200 },
      );
    }
    if (err instanceof TokenRefreshError) {
      // Transient failure - return stale cache if available, otherwise demo
      const { getStaleStats } = await import("@/lib/whoop-cache");
      const staleResult = await getStaleStats();
      if (staleResult) {
        return NextResponse.json({
          ...staleResult.stats,
          mode: "stale",
          warning: "Using cached data - token refresh temporarily failed",
        });
      }
      return NextResponse.json({
        ...getDemoStats(),
        mode: "error",
        error: err.message,
      });
    }
    // Unknown error
    console.error("[stats] getValidAccessToken unexpected error:", err);
    return NextResponse.json({ ...getDemoStats(), mode: "error" });
  }

  // Never authorized
  if (!accessToken) {
    return NextResponse.json(
      { ...getDemoStats(), mode: "unauthorized", authRequired: true },
      { status: 200 },
    );
  }

  // Fetch stats (cache-first)
  try {
    const stats: WhoopStats = await getStatsWithCache(() =>
      fetchWhoopStats(accessToken!),
    );
    return NextResponse.json({ ...stats, mode: "live" });
  } catch (err: any) {
    console.error("[stats] fetchWhoopStats error:", err);

    if (err.message === "WHOOP_UNAUTHORIZED") {
      console.warn(
        "[stats] WHOOP_UNAUTHORIZED from API. Attempting forced token refresh...",
      );
      try {
        const { forceRefreshToken } = await import("@/lib/whoop-token-storage");
        const newAccessToken = await forceRefreshToken();

        if (newAccessToken) {
          console.log(
            "[stats] Forced refresh succeeded. Retrying fetchWhoopStats...",
          );
          const { fetchWhoopStats } = await import("@/lib/whoop-client");
          const { setCachedStats } = await import("@/lib/whoop-cache");

          const stats = await fetchWhoopStats(newAccessToken);
          await setCachedStats(stats);
          return NextResponse.json({ ...stats, mode: "live" });
        }
      } catch (retryErr: any) {
        console.error(
          "[stats] Forced refresh / retry failed:",
          retryErr.message || String(retryErr),
        );

        if (
          retryErr.name === "TokenExpiredError" ||
          retryErr.message === "WHOOP_UNAUTHORIZED"
        ) {
          // Token is definitively dead or new access token is immediately rejected.
          const { clearTokens } = await import("@/lib/whoop-token-storage");
          await clearTokens().catch(() => {});

          return NextResponse.json(
            { ...getDemoStats(), mode: "unauthorized", authRequired: true },
            { status: 200 },
          );
        }
      }

      // If we reach here, it's a transient error during refresh/retry.
      // Fall through to the stale cache / generic error logic.
    }

    // Try stale cache before giving up
    const { getStaleStats } = await import("@/lib/whoop-cache");
    const staleResult = await getStaleStats();
    if (staleResult) {
      return NextResponse.json({
        ...staleResult.stats,
        mode: "stale",
        warning: "Using cached data - WHOOP API temporarily unavailable",
      });
    }

    return NextResponse.json(
      {
        ...getDemoStats(),
        mode: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 200 }, // Always 200 so the UI keeps working
    );
  }
}

// // ============================================
// // GET /api/whoop/stats
// // Returns current WHOOP stats (cached)
// // ============================================

// import { NextRequest, NextResponse } from 'next/server';
// import { isWhoopEnabled, fetchWhoopStats, getDemoStats } from '@/lib/whoop-client';
// import { getValidAccessToken } from '@/lib/whoop-token-storage';
// import { getStatsWithCache } from '@/lib/whoop-cache';
// import { WhoopStats } from '@/types/whoop';
// import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

// export const dynamic = 'force-dynamic';

// export async function GET(request: NextRequest) {
//   // --- Rate Limiting: 30 requests/minute per IP ---
//   const ip = getClientIP(request);
//   const { success, resetAt } = rateLimit(`stats:${ip}`, 30, 60 * 1000);
//   if (!success) return rateLimitResponse(resetAt);

//   try {
//     // Check if WHOOP integration is enabled
//     if (!isWhoopEnabled()) {
//       // Return demo data in development/demo mode
//       const demoStats = getDemoStats();
//       return NextResponse.json({
//         ...demoStats,
//         mode: 'demo',
//       });
//     }

//     // Get valid access token (auto-refreshes if needed)
//     const accessToken = await getValidAccessToken();

//     if (!accessToken) {
//       // Not authorized yet - return demo data with auth prompt
//       return NextResponse.json({
//         ...getDemoStats(),
//         mode: 'unauthorized',
//         authRequired: true,
//       });
//     }

//     // Fetch stats with caching
//     const stats: WhoopStats = await getStatsWithCache(() =>
//       fetchWhoopStats(accessToken)
//     );

//     return NextResponse.json({
//       ...stats,
//       mode: 'live',
//     });

//   } catch (error) {
//     console.error('Error fetching WHOOP stats:', error);

//     // Return demo data on error
//     return NextResponse.json({
//       ...getDemoStats(),
//       mode: 'error',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     }, { status: 200 }); // Still 200 so the UI works
//   }
// }
