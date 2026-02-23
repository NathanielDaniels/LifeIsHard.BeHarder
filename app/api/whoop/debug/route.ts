import { NextResponse } from 'next/server';
import { getStoredTokens } from '@/lib/whoop-token-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tokens = await getStoredTokens();
  
  if (!tokens) {
    return NextResponse.json({ error: 'No tokens in Supabase' });
  }

  const token = tokens.access_token;

  const [profile, workout, recovery, cycle] = await Promise.all([
    fetch('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async r => ({ status: r.status, body: await r.text() })),
    fetch('https://api.prod.whoop.com/developer/v1/activity/workout?limit=5', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async r => ({ status: r.status, body: await r.text() })),
    fetch('https://api.prod.whoop.com/developer/v1/recovery?limit=1', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async r => ({ status: r.status, body: await r.text() })),
    fetch('https://api.prod.whoop.com/developer/v1/cycle?limit=1', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async r => ({ status: r.status, body: await r.text() })),
  ]);

  return NextResponse.json({
    tokenPrefix: token.substring(0, 20) + '...',
    profile,
    workout,
    recovery,
    cycle,
  });
}

// export const dynamic = 'force-dynamic';

// import { NextResponse } from 'next/server';
// import { getValidAccessToken } from '@/lib/whoop-token-storage';

// async function whoopFetch(path: string, token: string) {
//   const res = await fetch(`https://api.prod.whoop.com/developer${path}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.json();
// }

// export async function GET() {
//   const token = await getValidAccessToken();
//   if (!token) return NextResponse.json({ error: 'no token' });

//   const [cycle, recovery, workout, profile] = await Promise.all([
//     whoopFetch('/v1/cycle?limit=1', token),
//     whoopFetch('/v1/recovery?limit=1', token),
//     whoopFetch('/v1/activity/workout?limit=1', token),
//     // whoopFetch('/v1/activity/sleep?limit=1', token),
//     whoopFetch('/v1/user/profile/basic', token),
//   ]);

//   return NextResponse.json({ cycle, recovery, workout, profile });
// }