// ============================================
// POST /api/admin/login
// Password login — sets httpOnly session cookie
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminPassword,
  createSessionCookie,
  sessionCookieHeader,
} from '@/lib/admin-auth';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per minute
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`admin-login:${ip}`, 5, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  try {
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password.' },
        { status: 401 },
      );
    }

    const cookieValue = await createSessionCookie();

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': sessionCookieHeader(cookieValue),
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 },
    );
  }
}
