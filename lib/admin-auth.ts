// ============================================
// Admin Authentication Helper
// Two auth modes:
//   1. Header-based (x-admin-secret) — for API/cron calls
//   2. Cookie-based session — for the browser admin dashboard
// ============================================

import { NextRequest } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ============================================
// Header-Based Auth (existing)
// ============================================

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

  return constantTimeEqual(providedSecret, adminSecret);
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

// ============================================
// Cookie-Based Session Auth (new — for admin dashboard)
// ============================================

/**
 * Verify admin password and return true if it matches.
 * Uses ADMIN_PASSWORD env var. Falls back to ADMIN_SECRET for backward compat.
 */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  if (!expected) {
    // No password set — only allow in dev
    return process.env.NODE_ENV !== 'production';
  }
  return constantTimeEqual(password, expected);
}

/**
 * Create a signed session cookie value.
 * Format: {expiresAt}:{hmacSignature}
 */
export async function createSessionCookie(): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const signature = await sign(String(expiresAt));
  return `${expiresAt}:${signature}`;
}

/**
 * Verify an admin session from the request cookies.
 * Returns true if the session cookie is present, valid, and not expired.
 */
export async function verifySessionCookie(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) return false;

  const colonIdx = cookie.indexOf(':');
  if (colonIdx === -1) return false;

  const expiresAt = parseInt(cookie.slice(0, colonIdx), 10);
  const signature = cookie.slice(colonIdx + 1);

  if (isNaN(expiresAt) || Date.now() >= expiresAt) return false;

  const expectedSig = await sign(String(expiresAt));
  return constantTimeEqual(signature, expectedSig);
}

/**
 * Check admin access via either cookie session or header secret.
 * Prefer this in admin API routes.
 */
export async function verifyAdminRequest(request: NextRequest): Promise<boolean> {
  // Try cookie first (browser dashboard)
  if (await verifySessionCookie(request)) return true;
  // Fall back to header (API/cron)
  return verifyAdminAccess(request);
}

/**
 * Build Set-Cookie header for the admin session.
 */
export function sessionCookieHeader(value: string): string {
  const parts = [
    `${SESSION_COOKIE}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_DURATION_MS / 1000)}`,
  ];
  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }
  return parts.join('; ');
}

/**
 * Build Set-Cookie header to clear the admin session.
 */
export function clearSessionCookieHeader(): string {
  const parts = [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }
  return parts.join('; ');
}

// ============================================
// Crypto Helpers
// ============================================

function getSigningKey(): string {
  // Use ADMIN_PASSWORD or ADMIN_SECRET as the HMAC key
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || 'dev-only-key';
}

async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSigningKey()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return bufferToHex(sig);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let match = true;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) match = false;
  }
  return match;
}
