// ============================================
// POST /api/admin/logout
// Clears the admin session cookie
// ============================================

import { NextResponse } from 'next/server';
import { clearSessionCookieHeader } from '@/lib/admin-auth';

export async function POST() {
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearSessionCookieHeader(),
      },
    },
  );
}
