# Mini Route Map Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich the SVG-based mini route maps in race calendar cards with county mesh, state highlighting, water bodies, curved arc routes, distance labels, and city codes.

**Architecture:** Pure SVG enhancement on the existing `react-simple-maps` stack. No new npm dependencies. One new utility file (`lib/geo-utils.ts`), extended race data (`lib/race-data.ts`), and a rewritten map component (`components/shared/MiniRouteMap.tsx`). County data comes from the same `us-atlas` CDN already in use.

**Tech Stack:** React 18, react-simple-maps v3, TypeScript, SVG

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `lib/geo-utils.ts` | Create | Haversine distance calculation, distance formatting |
| `lib/race-data.ts` | Modify | Add `cityCode` and `stateFips` fields to `Race` interface and all race entries |
| `components/shared/MiniRouteMap.tsx` | Modify | All visual enhancements: county mesh, state highlight, lakes, arc route, labels |

---

### Task 1: Create geo-utils.ts

**Files:**
- Create: `lib/geo-utils.ts`

- [ ] **Step 1: Create the utility file with haversine and formatting helpers**

```typescript
// lib/geo-utils.ts

/**
 * Haversine distance between two [lng, lat] points, in miles.
 */
export function haversineDistance(
  a: [number, number],
  b: [number, number]
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const aCalc =
    sinLat * sinLat +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
}

/**
 * Format a distance in miles with commas: 1847 -> "1,847"
 */
export function formatMiles(miles: number): string {
  return Math.round(miles).toLocaleString('en-US');
}
```

Note: `arcControlPoint` was originally specced but is not needed. `react-simple-maps` `Line` component draws geodesic paths which naturally curve on the Albers USA projection. Cross-country routes get a visible arc for free.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/geo-utils.ts
git commit -m "feat: add geo utility functions for map enhancements"
```

---

### Task 2: Extend race data with city codes and state FIPS

**Files:**
- Modify: `lib/race-data.ts`

- [ ] **Step 1: Add new fields to the Race interface**

Add `cityCode` and `stateFips` to the `Race` interface:

```typescript
export interface Race {
  date: string;
  name: string;
  location: string;
  coords: [number, number];
  type: 'triathlon' | 'running';
  isTarget?: boolean;
  result?: string;
  distance?: string;
  course?: string;
  description?: string;
  championship?: string;
  website?: string;
  cityCode: string;    // Airport-style abbreviation for map label
  stateFips: string;   // 2-digit FIPS code for state highlighting
}
```

- [ ] **Step 2: Add cityCode and stateFips to every race entry**

FIPS codes: CA=06, IN=18, WI=55, IL=17. City codes chosen for readability at small sizes.

```typescript
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
    date: '2026-06-28',
    name: 'Pleasant Prairie Triathlon',
    location: 'Pleasant Prairie, WI',
    coords: [-87.93, 42.55],
    type: 'triathlon',
    distance: 'Para Sprint',
    course: '750m swim · 23km bike · 5km run',
    description: 'Midwest turf. No excuses.',
    website: 'https://www.pleasantprairietri.com/',
    cityCode: 'PPR',
    stateFips: '55',
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/race-data.ts
git commit -m "feat: add city codes and state FIPS to race data"
```

---

### Task 3: Update RaceCalendar to pass new props

**Files:**
- Modify: `components/shared/RaceCalendar.tsx`

- [ ] **Step 1: Pass cityCode and stateFips to MiniRouteMap**

Find the `<MiniRouteMap` usage (around line 178) and add the new props:

```tsx
<MiniRouteMap
  destination={race.coords}
  themeColor={themeColor}
  isTarget={race.isTarget}
  cityCode={race.cityCode}
  stateFips={race.stateFips}
/>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Will fail until MiniRouteMap accepts the new props (Task 4). That's fine — this task is staged but committed together with Task 4.

---

### Task 4: Rewrite MiniRouteMap with all enhancements

**Files:**
- Modify: `components/shared/MiniRouteMap.tsx`

This is the main task. The component grows from ~120 lines to ~250 lines with all layers.

- [ ] **Step 1: Update the interface and imports**

Replace the current imports and interface:

```tsx
'use client';

import { memo, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';
import { SF_HOME } from '@/lib/race-data';
import { haversineDistance, formatMiles } from '@/lib/geo-utils';

interface MiniRouteMapProps {
  destination: [number, number];
  themeColor: string;
  isTarget?: boolean;
  cityCode: string;
  stateFips: string;
}

const STATES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const COUNTIES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

// Great Lakes approximate centers and radii for SVG rendering [lng, lat]
const GREAT_LAKES: Array<{ center: [number, number]; rx: number; ry: number }> = [
  { center: [-87.5, 44.5], rx: 1.2, ry: 2.0 },  // Lake Michigan
  { center: [-82.5, 44.0], rx: 1.5, ry: 1.8 },  // Lake Huron
  { center: [-86.5, 47.0], rx: 2.0, ry: 0.8 },  // Lake Superior
  { center: [-81.0, 42.2], rx: 1.5, ry: 0.5 },  // Lake Erie
  { center: [-77.5, 43.5], rx: 1.0, ry: 0.3 },  // Lake Ontario
];

const MIN_DISTANCE_LABEL = 50; // Don't show distance for < 50 miles
```

- [ ] **Step 2: Rewrite the component body**

Replace the entire function body:

```tsx
function MiniRouteMap({ destination, themeColor, isTarget, cityCode, stateFips }: MiniRouteMapProps) {
  const isLocal = Math.abs(destination[0] - SF_HOME[0]) < 0.5 &&
                  Math.abs(destination[1] - SF_HOME[1]) < 0.5;

  const isCA = destination[0] < -114;

  const projection = isCA ? 'geoMercator' as const : 'geoAlbersUsa' as const;
  const projectionConfig = isCA
    ? { scale: 2200, center: [-119.5, 36.0] as [number, number] }
    : { scale: 1000 };

  const distance = useMemo(
    () => haversineDistance(SF_HOME, destination),
    [destination]
  );
  const showDistance = distance >= MIN_DISTANCE_LABEL;

  return (
    <div className="w-full max-w-[280px] aspect-[5/3] rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.05]">
      <ComposableMap
        projection={projection}
        projectionConfig={projectionConfig}
        width={800}
        height={480}
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <filter id={`glow-${cityCode}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`routeGlow-${cityCode}`}>
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`routeGrad-${cityCode}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={themeColor} stopOpacity={0.3} />
            <stop offset="50%" stopColor={themeColor} stopOpacity={0.8} />
            <stop offset="100%" stopColor={themeColor} stopOpacity={0.3} />
          </linearGradient>
        </defs>

        {/* Layer 1: County mesh (faint background texture) */}
        {!isCA && (
          <Geographies geography={COUNTIES_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="none"
                  stroke={
                    String(geo.id).startsWith(stateFips)
                      ? `${themeColor}14` // ~8% opacity for highlighted state counties
                      : 'rgba(255,255,255,0.02)'
                  }
                  strokeWidth={0.3}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
        )}

        {/* Layer 2: State outlines + destination state highlight */}
        <Geographies geography={STATES_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isHighlighted = String(geo.id).padStart(2, '0') === stateFips;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlighted ? `${themeColor}0F` : 'rgba(255,255,255,0.03)'}
                  stroke={isHighlighted ? `${themeColor}33` : 'rgba(255,255,255,0.06)'}
                  strokeWidth={isHighlighted ? 0.8 : (isCA ? 0.8 : 0.4)}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* Layer 3: Great Lakes (only on US-wide view) */}
        {!isCA && GREAT_LAKES.map((lake, i) => (
          <Marker key={`lake-${i}`} coordinates={lake.center}>
            <ellipse
              rx={lake.rx * 15}
              ry={lake.ry * 15}
              fill="rgba(100,160,255,0.04)"
              stroke="rgba(100,160,255,0.06)"
              strokeWidth={0.3}
            />
          </Marker>
        ))}

        {/* Layer 4: Route */}
        {!isLocal && (
          <RouteArc
            from={SF_HOME}
            to={destination}
            themeColor={themeColor}
            cityCode={cityCode}
            isCA={isCA}
          />
        )}

        {/* Layer 5: SF home dot + label */}
        <Marker coordinates={SF_HOME}>
          <circle r={isCA ? 4 : 2.5} fill="white" opacity={0.6} />
          <text
            y={isCA ? 16 : 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontFamily="monospace"
            fontSize={isCA ? 10 : 7}
            letterSpacing={0.5}
          >
            SF
          </text>
        </Marker>

        {/* Layer 6: Destination dot + label + pulse */}
        <Marker coordinates={destination}>
          {/* Glow */}
          <circle
            r={isTarget ? 5 : (isCA ? 4 : 3)}
            fill={themeColor}
            opacity={0.15}
            filter={`url(#glow-${cityCode})`}
          />
          {/* Dot */}
          <circle
            r={isTarget ? 3.5 : (isCA ? 3 : 2.5)}
            fill={isTarget ? themeColor : 'white'}
            opacity={isTarget ? 1 : 0.8}
          />
          {/* Pulse ring (target races only) */}
          {isTarget && (
            <circle r={5} fill="none" stroke={themeColor} strokeWidth={0.6} opacity={0.4}>
              <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
            </circle>
          )}
          {/* City code label */}
          <text
            y={isCA ? -10 : -8}
            textAnchor="middle"
            fill={isTarget ? `${themeColor}99` : 'rgba(255,255,255,0.5)'}
            fontFamily="monospace"
            fontSize={isCA ? 10 : 7}
            fontWeight={isTarget ? 'bold' : 'normal'}
            letterSpacing={0.5}
          >
            {cityCode}
          </text>
        </Marker>

        {/* Layer 7: Distance label (above route midpoint) */}
        {showDistance && !isLocal && (
          <DistanceLabel
            from={SF_HOME}
            to={destination}
            distance={distance}
            isCA={isCA}
          />
        )}
      </ComposableMap>
    </div>
  );
}
```

- [ ] **Step 3: Add the RouteArc sub-component**

Add above the main component in the same file:

```tsx
interface RouteArcProps {
  from: [number, number];
  to: [number, number];
  themeColor: string;
  cityCode: string;
  isCA: boolean;
}

function RouteArc({ from, to, themeColor, cityCode, isCA }: RouteArcProps) {
  // react-simple-maps Line component only draws straight lines.
  // For the arc, we use two straight Lines (glow + main) since
  // react-simple-maps doesn't support path-based routes.
  // The visual arc effect comes from the blur glow creating depth.
  return (
    <>
      {/* Glow line */}
      <Line
        from={from}
        to={to}
        stroke={themeColor}
        strokeWidth={isCA ? 7 : 5}
        strokeLinecap="round"
        strokeOpacity={0.08}
        style={{ filter: `url(#routeGlow-${cityCode})` }}
      />
      {/* Main line */}
      <Line
        from={from}
        to={to}
        stroke={themeColor}
        strokeWidth={isCA ? 2 : 1.5}
        strokeLinecap="round"
        strokeOpacity={0.7}
      />
      {/* Animated dash overlay */}
      <Line
        from={from}
        to={to}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeDasharray="4,12"
      />
    </>
  );
}
```

Note: `react-simple-maps` `Line` draws geodesic lines on the projected map, which naturally curve on the Albers USA projection. For cross-country routes this produces a visible arc. For CA-local routes (Mercator), lines appear straight which is appropriate for short distances. The animated dash uses CSS `stroke-dasharray`; the `stroke-dashoffset` animation requires a raw SVG element. If the static dashes look good enough during visual QA, keep them. If animation is desired, we can add a `<style>` tag with a `@keyframes` animation targeting the dash line by class name.

- [ ] **Step 4: Add the DistanceLabel sub-component**

Add above RouteArc in the same file:

```tsx
interface DistanceLabelProps {
  from: [number, number];
  to: [number, number];
  distance: number;
  isCA: boolean;
}

function DistanceLabel({ from, to, distance, isCA }: DistanceLabelProps) {
  // Position at midpoint of from/to. On the projected map,
  // Marker at the geographic midpoint is close enough.
  const midLng = (from[0] + to[0]) / 2;
  const midLat = (from[1] + to[1]) / 2;
  // Offset slightly north so the label sits above the route line
  const offsetLat = isCA ? 0.3 : 1.5;
  const label = `${formatMiles(distance)} MI`;
  const fontSize = isCA ? 9 : 6;
  const padX = isCA ? 6 : 4;
  const padY = isCA ? 4 : 3;
  const textWidth = label.length * fontSize * 0.6;

  return (
    <Marker coordinates={[midLng, midLat + offsetLat]}>
      <rect
        x={-textWidth / 2 - padX}
        y={-fontSize / 2 - padY}
        width={textWidth + padX * 2}
        height={fontSize + padY * 2}
        rx={2}
        fill="rgba(5,5,5,0.85)"
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgba(255,255,255,0.5)"
        fontFamily="monospace"
        fontSize={fontSize}
        letterSpacing={0.8}
      >
        {label}
      </text>
    </Marker>
  );
}
```

- [ ] **Step 5: Keep memo export**

Ensure the file ends with:

```tsx
export default memo(MiniRouteMap);
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 7: Commit Tasks 3 + 4 together**

```bash
git add components/shared/MiniRouteMap.tsx components/shared/RaceCalendar.tsx
git commit -m "feat: enrich mini route maps with county mesh, state highlighting, lakes, and labels"
```

---

### Task 5: Visual QA and Tuning

**Files:**
- Possibly adjust: `components/shared/MiniRouteMap.tsx`, `lib/geo-utils.ts`

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Open the race calendar and expand each race card**

Check each of these 10 races visually:

| Race | Key things to verify |
|---|---|
| Napa Valley | CA zoom, short route, NPA label, no distance (close to SF) |
| Leon's (Hammond) | US view, IN state highlight, HMD label, Great Lakes visible |
| Long Beach | CA zoom, LBC label, state highlight |
| Pleasant Prairie | US view, WI highlight, PPR label, Great Lakes |
| SF Marathon | Local race, SFO label, no route line, no distance |
| Milwaukee Nationals | US view, WI highlight, MKE label, pulsing target ring, Great Lakes |
| Chicago | US view, IL highlight, CHI label, Great Lakes |
| San Diego | CA zoom, SDG label, long intra-CA route |
| Berkeley | CA zoom, BRK label, very short route, no distance |
| Sacramento/CIM | CA zoom, SAC label, short route |

- [ ] **Step 3: Tune opacity/sizing values if needed**

Common adjustments during visual QA:
- County mesh opacity (currently `0.02`) — increase if invisible, decrease if noisy
- State highlight opacity (`0.06` fill, `0.2` stroke) — should be subtle, not glaring
- Great Lake ellipse sizes — may need adjustment once rendered on the real projection
- Distance label offset (`offsetLat`) — ensure it doesn't overlap the route on any race
- City code label position (`y` offset) — ensure it doesn't collide with the dot

- [ ] **Step 4: Check mobile viewport (375px)**

Maps should still render cleanly at small sizes. Text should remain readable.

- [ ] **Step 5: Commit any tuning changes**

```bash
git add components/shared/MiniRouteMap.tsx lib/geo-utils.ts
git commit -m "fix: tune map visual parameters after QA"
```

---

### Task 6: Final verification and push

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run CodeRabbit review**

Run: `coderabbit review --plain -t uncommitted`
Address any flagged issues.

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Push**

```bash
git push origin feat/full-site-build
```
