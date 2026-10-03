import { NextResponse } from 'next/server';

/** Old connection and sync URLs must not access providers or legacy storage. */
export function stravaRetiredResponse() {
  return NextResponse.json(
    { error: 'Strava integration has been retired. No reconnection is needed.' },
    { status: 410 },
  );
}
