export interface Race {
  date: string;
  name: string;
  location: string;
  type: 'triathlon' | 'running';
  isTarget?: boolean;
  result?: string;
}

export const RACES_2026: Race[] = [
  { date: '2026-04-11', name: 'AlphaWin Napa Valley Triathlon', location: 'CA State Championship', type: 'triathlon' },
  { date: '2026-06-07', name: "Leon's Triathlon", location: 'Hammond, IN', type: 'triathlon' },
  { date: '2026-06-19', name: 'SuperTri Long Beach Legacy Triathlon', location: 'Long Beach, CA', type: 'triathlon' },
  { date: '2026-06-28', name: 'Pleasant Prairie Triathlon', location: 'Pleasant Prairie, WI', type: 'triathlon' },
  { date: '2026-07-26', name: 'San Francisco Marathon', location: 'San Francisco, CA', type: 'running' },
  { date: '2026-08-09', name: 'USA Para Triathlon National Championships', location: 'Milwaukee, WI', type: 'triathlon', isTarget: true },
  { date: '2026-08-23', name: 'SuperTri Chicago Triathlon', location: 'IL State Championship', type: 'triathlon' },
  { date: '2026-10-25', name: 'San Diego Triathlon', location: 'San Diego, CA', type: 'triathlon' },
  { date: '2026-11-15', name: 'Berkeley Half Marathon', location: 'Berkeley, CA', type: 'running' },
  { date: '2026-12-06', name: 'California International Marathon', location: 'Sacramento, CA', type: 'running' },
];

export const KEY_DATES = {
  accident: new Date('2020-11-01'),
  sobriety: new Date('2020-01-20'),
} as const;

export function getNextRace(): Race | undefined {
  const today = new Date();
  return RACES_2026.find((r) => new Date(r.date) > today);
}

export function getDaysUntil(date: Date): number {
  return Math.max(0, Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export function getDaysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}
