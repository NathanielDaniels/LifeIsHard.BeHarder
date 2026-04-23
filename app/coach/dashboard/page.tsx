import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';

async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session?.value) return false;

  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;
  if (!secret) return false;

  const colonIdx = session.value.indexOf(':');
  if (colonIdx === -1) return false;

  const expiresAt = session.value.slice(0, colonIdx);
  const signature = session.value.slice(colonIdx + 1);

  if (Date.now() >= parseInt(expiresAt, 10)) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(expiresAt));
  const expected = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return signature === expected;
}

export default async function CoachDashboardPage() {
  const isAuthed = await verifySession();
  if (!isAuthed) {
    redirect('/admin');
  }
  return <DashboardClient />;
}
