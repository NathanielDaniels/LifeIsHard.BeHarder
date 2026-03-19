// ============================================
// GET /api/admin/status
// Returns all API connection statuses (admin-only)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, adminUnauthorizedResponse } from '@/lib/admin-auth';
import { getAllConnections } from '@/lib/api-connections';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return adminUnauthorizedResponse();
  }

  const connections = await getAllConnections();

  return NextResponse.json({ connections });
}
