// ============================================
// Admin Authentication Helper
// Simple secret-based auth for admin endpoints
// ============================================

import { NextRequest } from 'next/server';

/**
 * Verify admin access using ADMIN_SECRET env var.
 * Checks the `x-admin-secret` header against the configured secret.
 * Returns true if ADMIN_SECRET is not set (dev mode passthrough).
 */
export function verifyAdminAccess(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  
  // If no admin secret is configured, block in production
  if (!adminSecret) {
    return process.env.NODE_ENV !== 'production';
  }
  
  const providedSecret = request.headers.get('x-admin-secret');
  if (!providedSecret) return false;
  
  // Constant-time comparison to prevent timing attacks
  if (providedSecret.length !== adminSecret.length) return false;
  
  let match = true;
  for (let i = 0; i < adminSecret.length; i++) {
    if (providedSecret[i] !== adminSecret[i]) match = false;
  }
  return match;
}

/**
 * Returns a 401 Unauthorized response for admin routes.
 */
export function adminUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized. Admin access required.' }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
