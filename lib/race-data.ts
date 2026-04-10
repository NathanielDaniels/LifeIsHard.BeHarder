export interface Race {
  date: string;
  name: string;
  location: string;
  coords: [number, number]; // [lng, lat] for map projection
  type: 'triathlon' | 'running';
  isTarget?: boolean;
  result?: string;
  distance?: string;
  course?: string;
  description?: string;
  championship?: string;
  website?: string;
  cityCode: string;
  stateFips: string;
}

export const SF_HOME: [number, number] = [-122.44, 37.76];

export const RACES_2026: Race[] = [
  {
    date: '2026-04-11',
    name: 'AlphaWin Napa Valley Triathlon',
    location: 'Napa Valley, CA',
    coords: [-122.29, 38.30],
    type: 'triathlon',
    distance: 'Sprint',
    course: '750m swim · 20km bike · 5km run',
    description: 'First race of the season. Setting the tone.',
    championship: 'CA North State Championship',
    website: 'https://alpha.win/event/napa-valley-ca-2/',
    cityCode: 'NPA',
    stateFips: '06',
  },
  {
    date: '2026-06-07',
    name: "Leon's Triathlon",
    location: 'Hammond, IN',
    coords: [-87.50, 41.58],
    type: 'triathlon',
    distance: 'Sprint',
    course: '500m swim · 18.7km bike · 5km run',
    description: 'Back in the Midwest. Racing where it started.',
    website: 'https://www.trisignup.com/Race/IN/Hammond/AmericaSRaceLeonSTriathlon',
    cityCode: 'HMD',
    stateFips: '18',
  },
  {
    date: '2026-06-28',
    name: 'Pleasant Prairie Triathlon',
    location: 'Pleasant Prairie, WI',
    coords: [-87.93, 42.55],
    type: 'triathlon',
    distance: 'Sprint',
    course: '750m swim · 23km bike · 5km run',
    description: 'Midwest turf. No excuses.',
    website: 'https://www.pleasantprairietri.com/',
    cityCode: 'PPR',
    stateFips: '55',
  },
  {
    date: '2026-07-19',
    name: 'SuperTri Long Beach Legacy Triathlon',
    location: 'Long Beach, CA',
    coords: [-118.19, 33.77],
    type: 'triathlon',
    distance: 'Sprint',
    course: '750m swim · 20km bike · 5km run',
    description: 'West coast showcase. Big field, bigger stage.',
    website: 'https://by.supertri.com/long-beach/',
    cityCode: 'LBC',
    stateFips: '06',
  },
  {
    date: '2026-07-26',
    name: 'San Francisco Marathon',
    location: 'San Francisco, CA',
    coords: [-122.44, 37.76],
    type: 'running',
    distance: 'Full Marathon',
    course: '42.2km',
    description: '42.2km through the city by the bay. Golden Gate and back.',
    website: 'https://www.thesfmarathon.com/',
    cityCode: 'SFO',
    stateFips: '06',
  },
  {
    date: '2026-08-09',
    name: 'USA Para Triathlon National Championships',
    location: 'Milwaukee, WI',
    coords: [-87.91, 43.04],
    type: 'triathlon',
    isTarget: true,
    distance: 'Sprint',
    course: '750m swim · 20km bike · 5km run',
    description: 'Everything builds to this.',
    championship: 'National Championship',
    website: 'https://www.usatriathlon.org/2026-usa-triathlon-nationals',
    cityCode: 'MKE',
    stateFips: '55',
  },
  {
    date: '2026-08-23',
    name: 'SuperTri Chicago Triathlon',
    location: 'Chicago, IL',
    coords: [-87.63, 41.88],
    type: 'triathlon',
    distance: 'Sprint',
    course: '750m swim · 20km bike · 5km run',
    description: 'Racing in the city that changed everything.',
    championship: 'Illinois State Championship',
    website: 'https://by.supertri.com/chicago-triathlon/',
    cityCode: 'CHI',
    stateFips: '17',
  },
  {
    date: '2026-10-25',
    name: 'San Diego Triathlon Challenge',
    location: 'La Jolla, CA',
    coords: [-117.27, 32.85],
    type: 'triathlon',
    distance: 'Long Course',
    course: '1.6km swim · 48km bike · 13km run',
    description: 'CAF flagship event. Nothing left to prove, everything left to give.',
    website: 'https://www.challengedathletes.org/events/2026-san-diego-triathlon-challenge/',
    cityCode: 'SDG',
    stateFips: '06',
  },
  {
    date: '2026-11-15',
    name: 'Berkeley Half Marathon',
    location: 'Berkeley, CA',
    coords: [-122.27, 37.87],
    type: 'running',
    distance: 'Half Marathon',
    course: '21.1km',
    description: 'Speed over distance. Testing the engine.',
    website: 'https://berkeleyhalfmarathon.com/',
    cityCode: 'BRK',
    stateFips: '06',
  },
  {
    date: '2026-12-06',
    name: 'California International Marathon',
    location: 'Sacramento, CA',
    coords: [-121.49, 38.58],
    type: 'running',
    distance: 'Full Marathon',
    course: '42.2km',
    description: 'Closing out the year. Full send.',
    website: 'https://runsra.org/california-international-marathon/',
    cityCode: 'SAC',
    stateFips: '06',
  },
];

export const KEY_DATES = {
  accident: new Date('2020-11-01'),
  sobriety: new Date('2020-01-20'),
} as const;

export function getNextRace(): Race | undefined {
  const today = todayLocal();
  return RACES_2026.find((r) => parseLocalDate(r.date) >= today);
}

// Parse 'YYYY-MM-DD' as local midnight, not UTC midnight.
// new Date('2026-04-11') = UTC midnight = April 10 5pm PST (wrong).
// parseLocalDate('2026-04-11') = local midnight April 11 (correct).
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function todayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toLocalMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysUntil(date: Date): number {
  const target = toLocalMidnight(date);
  const now = todayLocal();
  return Math.max(0, Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export function getDaysSince(date: Date): number {
  const target = toLocalMidnight(date);
  const now = todayLocal();
  return Math.round((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
}
