import test from 'node:test';
import assert from 'node:assert/strict';

import { fetchFreshWhoopStats } from '../lib/whoop-live';
import { fetchWhoopStats } from '../lib/whoop-client';
import type { WhoopStats } from '../types/whoop';

function stats(lastUpdated: string): WhoopStats {
  return {
    connected: true,
    lastUpdated,
    recovery: 72,
    restingHeartRate: 58,
    hrv: 41,
    spo2: 98,
    skinTemp: 35,
    strain: 6.2,
    calories: 1200,
    averageHeartRate: 72,
    maxHeartRate: 151,
    lastWorkout: null,
    currentHeartRate: 58,
    heartRateSource: 'resting',
  };
}

test('fetchFreshWhoopStats calls WHOOP again for every website request', async () => {
  let upstreamCalls = 0;
  const fetchFromWhoop = async () => {
    upstreamCalls += 1;
    return stats(`request-${upstreamCalls}`);
  };

  const first = await fetchFreshWhoopStats('access-token', fetchFromWhoop);
  const second = await fetchFreshWhoopStats('access-token', fetchFromWhoop);

  assert.equal(upstreamCalls, 2);
  assert.equal(first.lastUpdated, 'request-1');
  assert.equal(second.lastUpdated, 'request-2');
});

test('fetchWhoopStats rejects when WHOOP rate limits every upstream metric request', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response('rate limited', {
      status: 429,
      headers: { 'Content-Type': 'text/plain' },
    });

  try {
    await assert.rejects(
      () => fetchWhoopStats('access-token'),
      /Rate limited by WHOOP API/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
