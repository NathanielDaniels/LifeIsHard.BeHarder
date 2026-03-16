export interface Race {
  date: string;
  name: string;
  location: string;
  type: 'triathlon' | 'running';
  isTarget?: boolean;
  result?: string;
  distance?: string;
  course?: string;
  description?: string;
  championship?: string;
  website?: string;
}

export const RACES_2026: Race[] = [
  {
    date: '2026-04-11',
    name: 'AlphaWin Napa Valley Triathlon',
    location: 'Napa Valley, CA',
    type: 'triathlon',
    distance: 'Sprint',
    course: '750m swim · 20km bike · 5km run',
    description: 'First race of the season. Setting the tone.',
    championship: 'CA North State Championship',
    website: 'https://alpha.win/event/napa-valley-ca-2/',
  },
  {
    date: '2026-06-07',
    name: "Leon's Triathlon",
    location: 'Hammond, IN',
    type: 'triathlon',
    distance: 'Sprint',
    course: '500m swim · 18.7km bike · 5km run',
    description: 'Back in the Midwest. Racing where it started.',
    website: 'https://www.trisignup.com/Race/IN/Hammond/AmericaSRaceLeonSTriathlon',
  },
  {
    date: '2026-06-19',
    name: 'SuperTri Long Beach Legacy Triathlon',
    location: 'Long Beach, CA',
    type: 'triathlon',
    distance: 'Sprint',
    course: '750m swim · 20km bike · 5km run',
    description: 'West coast showcase. Big field, bigger stage.',
    website: 'https://by.supertri.com/long-beach/',
  },
  {
    date: '2026-06-28',
    name: 'Pleasant Prairie Triathlon',
    location: 'Pleasant Prairie, WI',
    type: 'triathlon',
    distance: 'Para Sprint',
    course: '750m swim · 23km bike · 5km run',
    description: 'Midwest turf. No excuses.',
    website: 'https://www.pleasantprairietri.com/',
  },
  {
    date: '2026-07-26',
    name: 'San Francisco Marathon',
    location: 'San Francisco, CA',
    type: 'running',
    distance: 'Full Marathon',
    course: '26.2 miles',
    description: '26.2 through the city by the bay. Golden Gate and back.',
    website: 'https://www.thesfmarathon.com/',
  },
  {
    date: '2026-08-09',
    name: 'USA Para Triathlon National Championships',
    location: 'Milwaukee, WI',
    type: 'triathlon',
    isTarget: true,
    distance: 'Sprint',
    course: '750m swim · 20km bike · 5km run',
    description: 'Everything builds to this.',
    championship: 'National Championship',
    website: 'https://www.usatriathlon.org/2026-usa-triathlon-nationals',
  },
  {
    date: '2026-08-23',
    name: 'SuperTri Chicago Triathlon',
    location: 'Chicago, IL',
    type: 'triathlon',
    distance: 'Sprint',
    course: '750m swim · 20km bike · 5km run',
    description: 'Racing in the city that changed everything.',
    championship: 'Illinois State Championship',
    website: 'https://by.supertri.com/chicago-triathlon/',
  },
  {
    date: '2026-10-25',
    name: 'San Diego Triathlon Challenge',
    location: 'La Jolla, CA',
    type: 'triathlon',
    distance: 'Long Course',
    course: '1mi swim · 30mi bike · 8mi run',
    description: 'CAF flagship event. Nothing left to prove, everything left to give.',
    website: 'https://www.challengedathletes.org/events/2026-san-diego-triathlon-challenge/',
  },
  {
    date: '2026-11-15',
    name: 'Berkeley Half Marathon',
    location: 'Berkeley, CA',
    type: 'running',
    distance: 'Half Marathon',
    course: '13.1 miles',
    description: 'Speed over distance. Testing the engine.',
    website: 'https://berkeleyhalfmarathon.com/',
  },
  {
    date: '2026-12-06',
    name: 'California International Marathon',
    location: 'Sacramento, CA',
    type: 'running',
    distance: 'Full Marathon',
    course: '26.2 miles',
    description: 'Closing out the year. Full send.',
    website: 'https://runsra.org/california-international-marathon/',
  },
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
