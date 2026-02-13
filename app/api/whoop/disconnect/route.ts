// ============================================
// POST /api/whoop/disconnect
// Revokes access and clears stored tokens
// Protected: requires admin secret
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken, clearTokens } from '@/lib/whoop-storage';
import { invalidateCache } from '@/lib/whoop-cache';
import { verifyAdminAccess, adminUnauthorizedResponse } from '@/lib/admin-auth';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // --- Rate Limiting: 5 requests/minute ---
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`disconnect:${ip}`, 5, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  // --- Admin auth check ---
  if (!verifyAdminAccess(request)) {
    return adminUnauthorizedResponse();
  }

  try {
    const accessToken = await getValidAccessToken();
    
    // If we have a token, try to revoke it on WHOOP's side
    if (accessToken) {
      try {
        await fetch('https://api.prod.whoop.com/developer/v2/user/access', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (err) {
        // Log but don't fail - we still want to clear local tokens
        console.error('Failed to revoke token on WHOOP:', err);
      }
    }
    
    // Clear local tokens
    await clearTokens();
    
    // Clear cache
    invalidateCache();
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect' },
      { status: 500 }
    );
  }
}
