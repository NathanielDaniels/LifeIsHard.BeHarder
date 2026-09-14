// ============================================
// GET /api/whoop/stats
// Returns current WHOOP stats directly from WHOOP without persisting responses
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { isWhoopEnabled, getDemoStats } from "@/lib/whoop-client";
import {
  getValidAccessToken,
  TokenExpiredError,
  TokenRefreshError,
} from "@/lib/whoop-token-storage";
import { fetchFreshWhoopStats } from "@/lib/whoop-live";
import { WhoopStats } from "@/types/whoop";
import { rateLimit, getClientIP, rateLimitResponse } from "@/lib/rate-limit";
import { touchLastFetch } from "@/lib/api-connections";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
};

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

export async function GET(request: NextRequest) {
  // Rate limit: 30 req/min per IP
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`stats:${ip}`, 30, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  // WHOOP not configured - return demo
  if (!isWhoopEnabled()) {
    return json({ ...getDemoStats(), mode: "demo" });
  }

  // Get access token
  let accessToken: string | null;
  try {
    accessToken = await getValidAccessToken();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      // Refresh token is dead - tell the client to show re-auth UI
      return json({ ...getDemoStats(), mode: "unauthorized", authRequired: true });
    }
    if (err instanceof TokenRefreshError) {
      return json({
        ...getDemoStats(),
        mode: "error",
        error: err.message,
      });
    }
    // Unknown error
    console.error("[stats] getValidAccessToken unexpected error:", err);
    return json({ ...getDemoStats(), mode: "error" });
  }

  // Never authorized
  if (!accessToken) {
    return json({ ...getDemoStats(), mode: "unauthorized", authRequired: true });
  }

  // Fetch directly from WHOOP for this request. Biometric responses are never persisted.
  try {
    const stats: WhoopStats = await fetchFreshWhoopStats(accessToken);

    // Record successful data fetch before responding
    await touchLastFetch('whoop').catch(() => {});

    return json({ ...stats, mode: "live" });
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
          const stats = await fetchFreshWhoopStats(newAccessToken);
          await touchLastFetch('whoop').catch(() => {});
          return json({ ...stats, mode: "live" });
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

          return json({ ...getDemoStats(), mode: "unauthorized", authRequired: true });
        }
      }

      // If we reach here, it's a transient error during refresh/retry.
      // Fall through to the stale cache / generic error logic.
    }

    return json({
      ...getDemoStats(),
      mode: "error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
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
