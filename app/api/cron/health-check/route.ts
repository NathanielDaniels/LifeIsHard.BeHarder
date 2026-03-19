// ============================================
// GET /api/cron/health-check
// Daily Vercel Cron — checks all API services,
// writes status to Supabase, emails alerts on failure.
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllServices } from '@/lib/services';
import { updateConnectionHealth } from '@/lib/api-connections';
import { ServiceHealthResult } from '@/types/api-tokens';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // seconds — generous for multiple API pings

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sets this automatically)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = getAllServices();
  const results: Record<string, ServiceHealthResult> = {};
  const alerts: string[] = [];

  // Check all services in parallel
  await Promise.all(
    services.map(async (service) => {
      try {
        const result = await service.checkHealth();
        results[service.id] = result;

        // Write result to Supabase
        await updateConnectionHealth(service.id, result).catch((err) =>
          console.error(`[health-check] Failed to write ${service.id} status:`, err)
        );

        // Collect alerts for non-healthy statuses
        if (result.status !== 'connected') {
          const label = service.displayName;
          switch (result.status) {
            case 'expired':
              alerts.push(`${label}: Token EXPIRED. Re-authorization required.`);
              break;
            case 'expiring':
              alerts.push(`${label}: Token expiring within 24 hours.`);
              break;
            case 'error':
              alerts.push(`${label}: Health check error — ${result.lastError || 'unknown'}`);
              break;
            case 'disconnected':
              alerts.push(`${label}: Not connected.`);
              break;
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[health-check] ${service.id} threw:`, message);
        results[service.id] = {
          status: 'error',
          tokenExpiresAt: null,
          lastError: message,
          details: null,
        };
        alerts.push(`${service.displayName}: Unexpected error — ${message}`);
      }
    }),
  );

  // Send alert email if any service is unhealthy
  if (alerts.length > 0) {
    await sendAlertEmail(alerts).catch((err) =>
      console.error('[health-check] Failed to send alert email:', err)
    );
  }

  console.log('[health-check] Complete:', JSON.stringify(results));

  return NextResponse.json({
    checked: Object.keys(results).length,
    alerts: alerts.length,
    results,
  });
}

// ============================================
// Alert Email via Resend
// ============================================

async function sendAlertEmail(alerts: string[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[health-check] RESEND_API_KEY not set, skipping alert email');
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  // Supports comma-separated emails: "patrick@patrickwingert.com,nathaniel@example.com"
  const toRaw = process.env.ALERT_EMAIL || 'patrick@patrickwingert.com';
  const to = toRaw.split(',').map((e) => e.trim()).filter(Boolean);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://patrickwingert.com';

  const alertList = alerts.map((a) => `  • ${a}`).join('\n');

  await resend.emails.send({
    from: `Patrick Wingert Site <${process.env.RESEND_FROM_EMAIL || 'patrick@patrickwingert.com'}>`,
    to,
    subject: `API Alert: ${alerts.length} issue${alerts.length > 1 ? 's' : ''} detected`,
    text: [
      'API Health Check Alert',
      '======================',
      '',
      alertList,
      '',
      `Fix it: ${siteUrl}/admin`,
      '',
      'This is an automated daily check. If an API token has expired,',
      'visit the admin dashboard to reconnect.',
    ].join('\n'),
  });

  console.log(`[health-check] Alert email sent to ${to}`);
}
