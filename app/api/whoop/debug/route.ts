import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/whoop-token-storage';

async function whoopFetch(path: string, token: string) {
  const res = await fetch(`https://api.prod.whoop.com/developer${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function GET() {
  const token = await getValidAccessToken();
  if (!token) return NextResponse.json({ error: 'no token' });

  const [cycle, recovery, workout, sleep, profile] = await Promise.all([
    whoopFetch('/v1/cycle?limit=1', token),
    whoopFetch('/v1/recovery?limit=1', token),
    whoopFetch('/v1/activity/workout?limit=1', token),
    whoopFetch('/v1/activity/sleep?limit=1', token),
    whoopFetch('/v1/user/profile/basic', token),
  ]);

  return NextResponse.json({ cycle, recovery, workout, sleep, profile });
}