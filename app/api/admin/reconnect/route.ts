// ============================================
// POST /api/admin/reconnect
// Returns OAuth URL for a service (admin-only)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest, adminUnauthorizedResponse } from '@/lib/admin-auth';
import { getService } from '@/lib/services';

export async function POST(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return adminUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const serviceId = typeof body.serviceId === 'string' ? body.serviceId : '';

    const service = getService(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: `Unknown service: ${serviceId}` },
        { status: 400 },
      );
    }

    if (!service.isConfigured()) {
      return NextResponse.json(
        { error: `${service.displayName} is not configured. Check environment variables.` },
        { status: 400 },
      );
    }

    const url = await service.getOAuthUrl();
    if (!url) {
      return NextResponse.json(
        { error: `${service.displayName} does not support OAuth reconnection.` },
        { status: 400 },
      );
    }

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request.' },
      { status: 400 },
    );
  }
}
