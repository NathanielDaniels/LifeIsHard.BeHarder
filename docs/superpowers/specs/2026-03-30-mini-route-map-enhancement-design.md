# Mini Route Map Enhancement — Design Spec

**Date:** 2026-03-30
**Status:** Approved
**Component:** `components/shared/MiniRouteMap.tsx`

## Summary

Enrich the existing SVG-based mini route maps in the race calendar cards with additional geographic layers, improved route visualization, and informational labels. No new dependencies. Same `react-simple-maps` architecture, richer visual output.

## Current State

The `MiniRouteMap` component renders inside expanded `RaceCalendar` cards. It uses `react-simple-maps` with `us-atlas@3/states-10m.json` (state boundaries only). Each map shows:

- Faint state outlines (`rgba(255,255,255,0.03)` fill, `0.06` stroke)
- Straight route line from SF home to destination (orange, with blur glow)
- White dot at SF, white/orange dot at destination
- Pulsing ring animation on "target" races (nationals)
- Smart projection: zoomed Mercator for CA races, Albers USA for out-of-state

**Problem:** The maps feel empty. State outlines alone don't provide enough geographic context, and the straight route line looks basic.

## Enhancements

### 1. County Mesh Layer

Add county boundaries from `us-atlas@3/counties-10m.json` as a faint mesh within states.

- **Fill:** none
- **Stroke:** `rgba(255,255,255,0.02)`, width `0.3`
- **Purpose:** Adds geographic texture without visual noise. The county grid gives the map a "data visualization" feel consistent with the site's technical aesthetic.

### 2. Destination State Highlight

The state containing the race destination gets a subtle accent treatment.

- **Fill:** `rgba(themeColor, 0.06)`
- **Stroke:** `rgba(themeColor, 0.2)`, width `0.8`
- **County lines within highlighted state:** `rgba(themeColor, 0.08)` instead of white
- **Requires:** A lookup mapping each race destination to its FIPS state code for matching against the TopoJSON `id` field.

### 3. Water Bodies

Add Great Lakes and major coastal outlines for landmark context. Use Natural Earth 110m lakes simplified GeoJSON (or a hand-curated minimal set for just the Great Lakes).

- **Fill:** `rgba(100, 160, 255, 0.04)`
- **Stroke:** `rgba(100, 160, 255, 0.06)`, width `0.3`
- **Scope:** Great Lakes only for the US-wide view. Pacific coast is implicit from the state outlines. Keep it minimal.

### 4. Curved Arc Route

Replace the straight `<Line>` with a quadratic bezier `<path>` that arcs above the direct route.

- **Main line:** gradient stroke (fades at endpoints, strongest at midpoint), width `1.8`
- **Glow:** same path, width `8`, opacity `0.08`, Gaussian blur filter
- **Animated dashes:** same path, white at `0.15` opacity, `stroke-dasharray="2,8"`, animated `stroke-dashoffset` cycling over 2s
- **Arc height:** proportional to distance. Short routes (CA to CA) get a subtle arc. Cross-country routes get a higher arc.
- **Implementation:** Calculate a control point offset perpendicular to the midpoint of the route. Use `react-simple-maps`' projection to convert lat/lng to screen coords, compute the bezier control point in screen space, then render a raw SVG `<path>`.

### 5. Distance Label

Show the straight-line distance between SF and the destination.

- **Position:** Above the arc's apex, not overlapping the route line
- **Background:** Dark pill (`rgba(5,5,5,0.8)`, `rx="2"`)
- **Text:** Monospace, `rgba(255,255,255,0.5)`, letter-spacing `0.8`, format `"X,XXX MI"`
- **Computation:** Haversine formula from SF_HOME to destination coordinates, rounded to nearest mile. Can be a simple utility function since there are only 10 races.
- **Skip for local races** where SF and destination are very close (< 50 mi).

### 6. City Labels

Add origin and destination city codes in monospace.

- **Origin (SF):** Below the home dot, `rgba(255,255,255,0.4)`, font-size `7`
- **Destination:** Above the destination dot, `rgba(themeColor, 0.6)`, font-weight bold
- **City codes:** Use airport-style abbreviations: SF, MKE, NPA (Napa), HMD (Hammond), LBC (Long Beach), PP (Pleasant Prairie), CHI, SFO (marathon), BRK (Berkeley), SAC (Sacramento/CIM)
- **Rendered as SVG `<text>`** elements positioned relative to marker coordinates

### 7. Pulsing Target Ring (Existing, Preserved)

No changes. The animated ring on nationals/priority races stays as-is.

## Data Requirements

| Data Source | Current | New |
|---|---|---|
| State boundaries | `us-atlas@3/states-10m.json` (CDN) | Keep |
| County boundaries | N/A | `us-atlas@3/counties-10m.json` (CDN) |
| Great Lakes | N/A | Small inline GeoJSON or simplified Natural Earth data |
| State FIPS lookup | N/A | Simple object mapping destination coords to state FIPS code |
| City codes | N/A | Added to race data in `lib/race-data.ts` |
| Distances | N/A | Computed via haversine, can be static constants |

## Files Modified

- `components/shared/MiniRouteMap.tsx` — main component, all enhancements
- `lib/race-data.ts` — add city codes, state FIPS codes, pre-computed distances per race
- `lib/geo-utils.ts` (new) — haversine distance, bezier control point calculation

## Performance Considerations

- **County TopoJSON is larger** than states-only (~200KB vs ~30KB). Both are fetched from CDN and cached by the browser. The county file loads once and is shared across all map instances.
- **SVG complexity increases** but remains lightweight compared to WebGL. Each map adds ~50-100 SVG elements for county lines. React-simple-maps handles this efficiently with its Geography component.
- **Memoization preserved.** The component stays wrapped in `memo()`. Props haven't changed shape.

## What This Does NOT Include

- No new npm dependencies
- No interactive maps (no zoom, pan, or click)
- No MapLibre/mapcn/WebGL
- No changes to the 3D globe (CobeGlobe/RaceGlobe)
- No changes to the RaceCalendar card layout or expand behavior

## Visual Reference

Mockups saved in `.superpowers/brainstorm/61728-1774899007/content/map-comparison-v2.html`. The mockup geography is hand-drawn for concept purposes. Implementation uses real TopoJSON data.
