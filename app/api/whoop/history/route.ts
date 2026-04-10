// ============================================
// GET /api/whoop/history
// Returns daily snapshots for AI briefing generation.
// Protected by admin secret to prevent public access.
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { getSnapshots } from '@/lib/whoop-history';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Rate limit: 10 req/min per IP
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`history:${ip}`, 10, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  // Require admin secret via header (avoid leaking secrets in URLs/logs)
  const secret = request.headers.get('x-admin-secret');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || !secret || secret.length !== adminSecret.length ||
      !timingSafeEqual(Buffer.from(secret), Buffer.from(adminSecret))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const daysParam = parseInt(request.nextUrl.searchParams.get('days') ?? '90', 10);
  const days = Number.isNaN(daysParam) || daysParam < 1 ? 90 : Math.min(daysParam, 90);
  const snapshots = await getSnapshots(days);

  return NextResponse.json({
    count: snapshots.length,
    snapshots,
  });
}
