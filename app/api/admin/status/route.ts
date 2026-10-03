// ============================================
// GET /api/admin/status
// Returns all API connection statuses (admin-only)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, adminUnauthorizedResponse } from '@/lib/admin-auth';
import { getAllConnections } from '@/lib/api-connections';
import { getService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return adminUnauthorizedResponse();
  }

  const connections = await getAllConnections();

  // Ignore persisted rows for integrations that are no longer registered.
  return NextResponse.json({
    connections: connections.filter((connection) => getService(connection.id)),
  });
}
