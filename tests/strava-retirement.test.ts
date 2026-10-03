import assert from 'node:assert/strict';
import { test } from 'node:test';
import { NextRequest } from 'next/server';

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://database.test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.ADMIN_SECRET = 'test-admin';
process.env.CRON_SECRET = 'test-cron';
process.env.RESEND_API_KEY = 'test-email-key';

test('Strava retirement preserves WHOOP monitoring and hides stale connections', async (t) => {
  const { getAllServices, getService } = await import('../lib/services');
  const { GET: status } = await import('../app/api/admin/status/route');
  const { GET: healthCheck } = await import('../app/api/cron/health-check/route');
  const { POST: reconnect } = await import('../app/api/admin/reconnect/route');
  const originalFetch = globalThis.fetch;
  const whoop = getService('whoop')!;
  const originalHealthCheck = whoop.checkHealth;
  const requests: string[] = [];
  const emails: { text: string }[] = [];
  globalThis.fetch = async (input, options) => {
    const url = String(input);
    requests.push(url);
    if (url === 'https://api.resend.com/emails') {
      emails.push(JSON.parse(String(options?.body)));
      return Response.json({ id: 'test-email' });
    }
    assert.ok(url.startsWith('https://database.test/'), `Unexpected external call: ${url}`);
    return Response.json(url.includes('/api_connections') ? [
      { id: 'whoop', display_name: 'WHOOP', status: 'connected' },
      { id: 'strava', display_name: 'Strava', status: 'expired' },
    ] : []);
  };
  whoop.checkHealth = async () => ({
    status: 'connected', tokenExpiresAt: null, lastError: null, details: null,
  });
  try {
    await t.test('retired Strava cannot be reconnected through the registry', () => {
      assert.deepEqual(getAllServices().map((service) => service.id), ['whoop']);
      assert.equal(getService('strava'), undefined);
    });
    await t.test('admin status excludes a stale Strava database row', async () => {
      const response = await status(new NextRequest('https://site.test/api/admin/status', {
        headers: { 'x-admin-secret': 'test-admin' },
      }));
      assert.equal(response.status, 200);
      assert.deepEqual((await response.json()).connections.map((row: { id: string }) => row.id), ['whoop']);
    });
    await t.test('admin reconnect rejects the retired service', async () => {
      const before = requests.length;
      const response = await reconnect(new NextRequest('https://site.test/api/admin/reconnect', {
        method: 'POST', headers: { 'x-admin-secret': 'test-admin', 'content-type': 'application/json' },
        body: JSON.stringify({ serviceId: 'strava' }),
      }));
      assert.equal(response.status, 400);
      assert.equal(requests.length, before);
    });
    await t.test('healthy WHOOP does not generate a Strava reconnect email', async () => {
      const response = await healthCheck(new NextRequest('https://site.test/api/cron/health-check', {
        headers: { authorization: 'Bearer test-cron' },
      }));
      const body = await response.json();
      assert.equal(body.checked, 1);
      assert.equal(body.alerts, 0);
      assert.deepEqual(Object.keys(body.results), ['whoop']);
      assert.equal(emails.length, 0);
    });
    await t.test('expired WHOOP still generates its own reconnect alert', async () => {
      whoop.checkHealth = async () => ({
        status: 'expired', tokenExpiresAt: null, lastError: 'Expired WHOOP token', details: null,
      });
      const response = await healthCheck(new NextRequest('https://site.test/api/cron/health-check', {
        headers: { authorization: 'Bearer test-cron' },
      }));
      assert.equal((await response.json()).alerts, 1);
      assert.equal(emails.length, 1);
      assert.match(emails[0].text, /WHOOP: Token EXPIRED/);
      assert.doesNotMatch(emails[0].text, /Strava/i);
    });
    await t.test('legacy Strava routes return Gone without accessing providers or storage', async () => {
      const routes = [
        ['auth', 'GET'], ['callback', 'GET'], ['activities', 'GET'],
        ['sync', 'POST'], ['disconnect', 'POST'],
      ] as const;
      for (const [name, method] of routes) {
        const before = requests.length;
        const route = await import(`../app/api/strava/${name}/route`);
        const response = await route[method](new NextRequest(`https://site.test/api/strava/${name}`, {
          method, headers: { 'x-admin-secret': 'test-admin' },
        }));
        assert.equal(response.status, 410, name);
        assert.equal(requests.length, before, name);
      }
      const before = requests.length;
      const { GET } = await import('../app/api/cron/strava-sync/route');
      assert.equal((await GET()).status, 410);
      assert.equal(requests.length, before);
    });
  } finally {
    whoop.checkHealth = originalHealthCheck;
    globalThis.fetch = originalFetch;
  }
});
