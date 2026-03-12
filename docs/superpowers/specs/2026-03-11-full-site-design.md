# Full Site Design Spec — patrickwingert.com

**Date:** 2026-03-11
**Status:** Approved by Patrick & Nathaniel
**Replaces:** `page.full-site.tsx` (current placeholder build)

---

## Overview

The full site replaces the coming-soon page with an immersive, scroll-driven documentary experience telling Patrick Wingert's story. It uses an **In Media Res** narrative structure — opening mid-action, flashing back to the darkest moments, then building forward through recovery, proof of capability, and a clear call to action.

### Design Pillars

1. **Documentary Spine + Data Pulse** — The story unfolds cinematically (full-bleed photography, dramatic copy, scroll-driven reveals) with a persistent biometric heartbeat thread running through everything. WHOOP data doesn't replace the story — it validates it.

2. **Continuous Scroll with Cinematic Beats** — No snap sections. Lenis smooth scroll throughout. Pacing comes from negative space and animation density, not mechanical scroll-locking. One exception: the Bhutan section scrolls horizontally.

3. **Living Thread: Pulse + Bursts** — A minimal persistent heartbeat element (ECG line) stays visible at all times. At key narrative moments, additional data cards animate in contextually. The persistent element reacts to the story — dims during the fall, intensifies during peak moments.

---

## Key Design Decisions

### Narrative Structure: In Media Res
Open with Patrick in motion. Flash back to how he got here. Build forward to what's next. End with the ask at peak emotional investment.

### Boot Sequence: Evolved
The coming-soon page boot sequence (8-second blocking overlay) is compressed to ~1.5 seconds and layered OVER the cold open image instead of blocking it. The HUD "powers up" over the hero image — boot text flickers, ECG activates, stats populate. No black screen gate.

### Biometric Framing: Honest
WHOOP does not provide real-time heart rate streaming. The section is framed as "today's readout" not "live telemetry feed." **Recovery** is the hero metric (changes daily, color-coded, meaningful). Heart rate is displayed as resting/baseline. The ECG heartbeat animation is a visual motif synced to resting HR, not presented as a literal live monitor.

### Instagram Feed: Removed
The embedded Instagram feed section is cut. Instagram content is better served as real photography woven into story sections. Social links remain in the CTA section.

### Support Structure: Two Paths
The tiered mountain metaphor (Base Camp / High Camp / Summit) is replaced with two clear paths: "Support Dare2Tri" (tax-deductible, organizational) and "Sponsor Patrick" (direct partnership). Simpler, more honest, less friction.

---

## Section Architecture

### Section 01: THE COLD OPEN

**Purpose:** Immediate immersion. You land in the middle of the action.

**Layout:** Full-viewport hero image, edge-to-edge. Patrick mid-race or mid-trek — peak intensity photography.

**Typography:**
- "PATRICK WINGERT" — mono, tracked, above title at ~40% opacity
- "LIFE IS HARD. BE HARDER." — Bebas Neue, `clamp(4rem, 12vw, 11rem)`, positioned bottom-left over gradient scrim
- "BE HARDER." gets the glitch effect (cyan/magenta chromatic aberration) carried from coming-soon page
- "ADAPTIVE ATHLETE • DARE2TRI ELITE TEAM" — mono, tracked, below title at ~35% opacity

**Boot Sequence (1.5s):**
1. Hero image loads slightly desaturated/dark
2. HUD boot text flickers in top-left (3-4 fast status lines, fades to ~10% opacity after)
3. ECG heartbeat line draws across at ~60% height
4. Image saturates to full color
5. Bottom stats bar populates left-to-right

**Bottom Stats Bar:** Recovery % (color-coded), Strain, HRV, Resting HR. Persistent across scroll until Section 2 fades it.

**Scroll Behavior:** Hero image parallaxes (scale 1 → 1.05, slight y offset). Title fades and rises. Scroll indicator appears after 5s idle.

**Biometric Thread:** ECG line activates during boot. Bottom stats bar shows today's WHOOP readout. HR corner display (top-right) shows resting heart rate.

---

### Section 02: THE FALL

**Purpose:** The gut punch. Contrast that makes everything after it meaningful.

**Layout:** Vertical scroll through date stamps with minimal copy. No hero images. Text-driven, dark, sparse. Generous negative space between each date.

**Content Sequence:**
1. **JANUARY 20, 2020** — "THE DAY HE GOT SOBER. Nine months before the accident. The first thing he lost wasn't his leg."
2. **2020** — "THE YEAR EVERYTHING COLLAPSED. Marriage ended. The restaurant group he'd spent years building fell apart during COVID. Rock bottom has a basement."
3. **NOVEMBER 1, 2020** — "CHICAGO, ILLINOIS. A car hit his motorcycle. He lost his right leg below the knee."
4. Deliberate negative space — near-total darkness
5. Transition: "SIGNAL RECOVERED" / "HEARTBEAT DETECTED..."

**Typography:** Dates in massive Bebas Neue (72px+). Supporting copy in small tracked mono — sparse, clinical, like a medical record. Short sentences. No paragraphs.

**Color:** Orange accent DISAPPEARS entirely. The journey line dims. The bottom HUD fades out. Everything goes monochrome. Only color: faint red glow on the flatline ECG at the accident date.

**Biometric Thread — THE FLATLINE:** The persistent ECG slows as user scrolls deeper. At November 1, 2020, it goes to a straight line. Not dramatic — just stops. After deliberate negative space (scrolling through darkness), the line starts again. Faint, then stronger. This is the transition into Section 3.

**Photography:** Minimal or none. The absence of imagery after the full-bleed cold open IS the design. The loss of visuals mirrors the loss in the story.

**Copy Tone:** Clinical. Almost cold. No adjectives, no emotional manipulation. The facts are heavy enough.

---

### Section 03: THE REBUILD

**Purpose:** The defibrillator moment. Orange floods back. The heartbeat is strong. Patient becomes athlete.

**Layout:** Alternating split-screen blocks (image left/text right, then reversed). Each block is a chapter: prosthetic fitting, first steps, discovering Dare2Tri, first race.

**Content Blocks:**

1. **Opening headline:** "THEY SAID IT WAS IMPOSSIBLE. THEY WERE WRONG." — first orange text after the void
2. **The Prosthetic** (split): Photo of Patrick with David Rotter + "NOT A REPLACEMENT. AN UPGRADE." copy about carbon fiber, titanium, Rotter Prosthetics
3. **The Prosthetic Reveal** (full-width): Macro prosthetic photography shot like a product reveal. Scroll-driven: starts grayscale with 3D perspective (rotateY: 15°), transitions to full color and flat. Pulsing orange border glow. Tech overlay: "PROSTHETIC SYSTEM // ACTIVE" with material specs in data cards
4. **Dare2Tri Discovery** (split, reversed): Training photo + "SOMEONE SAID 'TRY THIS.'" — Keri, first session, the catalyst
5. **The Counters** (centered): Days Since Accident / Days Sober / Days Until Next Race. Same animated counter component from coming-soon page. 2-second count-up with easeOut.

**Color:** Orange returns at full intensity. Journey line re-illuminates. Ambient glows return. After Section 2's monochrome, this feels like sunrise.

**Photography:** Full color returns. Prosthetic detail shots, training photos, Dare2Tri moments. The contrast from Section 2's void to vivid imagery is deliberate.

**Biometric Thread:** ECG back and strong. Tech overlay on prosthetic reveal connects to the data-as-proof concept. The heartbeat's return from the flatline IS the emotional moment.

---

### Section 04: THE PROOF — BHUTAN TREK

**Purpose:** The crown jewel. "Wait, he did WHAT?" The section that earns the horizontal scroll.

**Layout:** Two parts. A vertical intro moment, then a horizontal scroll section over 300vh.

**Intro (vertical):**
- "OCTOBER 2022. BHUTAN." in massive Bebas Neue
- Mountain range outline or map silhouette fades in behind text
- Stats appear one line at a time on scroll: "250 MILES. 12 PASSES. 29 DAYS. FIRST AMERICAN. FIRST AMPUTEE."

**Horizontal Scroll:**
- 5-7 journey panels slide left as user scrolls vertically
- Each panel: trek photo (full or half panel), day range label, location name, 1-2 sentences of copy
- Panels get progressively more intense — altitude rises, weather worsens, stakes escalate

**Live Telemetry Overlay (fixed, top-right):**
- ALTITUDE: animates from 8,000ft to 14,000ft and back down
- TEMPERATURE: animates from 65°F to 32°F and back up
- DAY: increments from 1 to 29
- All synced to horizontal scroll progress

**Mountain Profile:** Elevation cross-section SVG at bottom. A moving position marker (orange dot) tracks scroll progress along the profile. Shows the climb visually.

**Progress Bar:** Thin horizontal line at bottom fills left to right. Day labels at intervals. Milestone markers at key points.

**Data Bursts:** At key moments (highest pass, longest day, final mile), data cards slide in showing contextual stats — elevation gain, distance, estimated strain. Styled like WHOOP biometric cards for visual consistency.

**Exit:** Final panel: "NOVEMBER 22, 2022. TRAIL COMPLETE." Transition back to vertical scroll. Centered accomplishment: "FIRST AMERICAN. FIRST BELOW-KNEE AMPUTEE. 250 MILES."

---

### Section 05: THE MACHINE — WHOOP BIOMETRICS

**Purpose:** Past tense shifts to present. The WHOOP data that's been a subtle thread expands into the full dashboard.

**Transition In:** The persistent ECG line (thin, marginal) suddenly EXPANDS — thicker stroke, brighter glow, filling viewport width. "TODAY'S READOUT" appears. Biometric cards populate outward from the heartbeat line, as if generated by the pulse.

**Layout:** Full-width biometric dashboard. Recovery as hero metric (large, centered, color-coded). Supporting stats in a responsive grid below. Last workout in its own row at bottom.

**Hero Metric — Recovery:**
- Large centered display with color-coding (green ≥67%, yellow ≥34%, red <34%)
- "TODAY'S RECOVERY" label
- Subtext: date of reading

**Data Grid (reuse BiometricCard from coming-soon):**
- Daily Strain (/21)
- Resting Heart Rate (BPM)
- HRV (ms)
- Calories (kcal)
- Average Heart Rate (BPM)
- Each card has tooltip overlay for explanation (same component)

**Last Workout Card:** Sport name, duration, strain, avg HR, max HR, calories. Same design as coming-soon page.

**Section Header:** Live green dot if connected to WHOOP, orange dot if demo mode. Date stamp. "POWERED BY WHOOP • [LIVE/DEMO] DATA • UPDATED [TIME]" footer.

**Framing:** "Today's readout" — honest about what the data represents. Not "live telemetry" but "what Patrick's body looks like today."

---

### Section 06: THE MISSION

**Purpose:** Forward-looking. What Patrick is training for. The section sponsors read most carefully.

**Part 1 — Dare2Tri Context (split layout):**
- Team photo + narrative about the Elite Development Team
- What acceptance means, what the program provides
- "NOT JUST COMPETING. REPRESENTING."

**Part 2 — 2026 Race Calendar (grid):**
- Race cards: date, name, location, type (triathlon/running)
- Next upcoming race: highlighted border + "NEXT — XX DAYS" badge with live countdown
- USA Para Triathlon Nationals (Aug 9, Milwaukee): two-column hero card, "THE TARGET" badge, orange border
- Past races show results as season progresses
- Separated into TRIATHLON and RUNNING sub-grids

**Race Data (from CLAUDE.md):**
- Apr 11: AlphaWin Napa Valley Triathlon (CA State Championship)
- Jun 7: Leon's Triathlon, Hammond, IN
- Jun 19: SuperTri Long Beach Legacy Triathlon
- Jun 28: Pleasant Prairie Triathlon, WI
- Aug 9: USA Para Triathlon National Championships, Milwaukee ← THE TARGET
- Aug 23: SuperTri Chicago Triathlon (IL State Championship)
- Jul 26: San Francisco Marathon
- Nov 15: Berkeley Half Marathon
- Dec 6: California International Marathon

**Biometric Thread:** Subtle — ECG returns to quiet margin state. Optional data card: "DAYS UNTIL NATIONALS: XX."

---

### Section 07: THE ASK

**Purpose:** The conversion point at peak emotional investment. The story earned this moment.

**Headline:** "FUEL THE MISSION." with subhead: "YOU'VE SEEN THE STORY"

**Supporting Copy:** Brief — Patrick trains full-time toward Nationals. Equipment, travel, coaching, race fees add up. Every contribution powers the next mile.

**Two Paths:**
1. **Support Dare2Tri** (primary CTA) — "Support the organization that makes adaptive athletics possible." Links to Dare2Tri fundraiser page. Tax-deductible badge. Filled orange button.
2. **Sponsor Patrick** (secondary CTA) — "Put your brand behind the mission. Equipment, travel, race sponsorship." Contact/email path. Outlined white button.

**Sponsor Logos:** Current supporters below CTAs — Adaptive Training Foundation, Challenged Athletes Foundation, David Rotter Prosthetics. Grayscale → color on hover. Social proof.

**Email Capture:** Below sponsors. "FOLLOW THE JOURNEY" + email form (reuse from coming-soon). For people not ready to donate but want to stay connected.

**Social Links:** Instagram, Strava, Dare2Tri fundraiser, Linktree. Same icons from coming-soon page.

**Biometric Thread:** ECG calm and steady. Optional: "DAYS UNTIL NATIONALS: XX" countdown for urgency.

---

### Section 08: FOOTER

**Purpose:** Quiet signature. The story is told.

**Layout:** Slim bar. "PATRICK WINGERT" left, Dare2Tri logo right.

**ECG Farewell:** A thin ECG heartbeat line runs across the top of the footer — the last visual pulse. The heartbeat continues after the page ends.

**Optional:** "BUILT WITH WHOOP DATA" credit in 9px mono, centered.

---

## Persistent Elements (All Sections)

| Element | Behavior |
|---|---|
| ECG heartbeat line | Always present in margin. S2: slows as user scrolls deeper, flatlines at accident date (straight line), then faint red glow. Returns faintly at S2→S3 transition, strengthens through S3. Expands to full-width in S5. Returns to subtle margin in S6-S8. Synced to resting HR. See S2 section for canonical flatline behavior. |
| Orange journey line | Fixed position, left edge of viewport, 6px wide, 0px from left edge. Tracks overall scroll progress (height maps to scrollYProgress). Pulsing orb (12px diameter) at the bottom of the filled line. Glow: `0 0 20px rgba(249,115,22,0.8)`. S2: glow fades to 0, line color shifts to white/10. S3: glow and orange return. Hidden on mobile (≤1024px). Same component as current `page.full-site.tsx` journey line, enhanced with section-aware dimming. |
| Custom crosshair cursor | Desktop only. Smooth follow with hover scaling. Same as coming-soon page. Hidden on touch devices. |
| Film grain / noise | Fixed overlay, opacity ~3.5%. Same SVG noise from coming-soon. |
| Scanlines | Fixed overlay, opacity ~20%. CRT monitor effect. |
| Running scan line | Slow horizontal sweep, 8s cycle. |
| Floating particles | Orange particles drifting upward. Reduced/absent in S2 (The Fall). Full density elsewhere. Respect `prefers-reduced-motion`. |
| Vignette | Edge darkening. Consistent across sections. |
| Lenis smooth scroll | Continuous weighted feel. No snap behavior anywhere. |

## Sections Removed from Original Build

| Original Section | Disposition |
|---|---|
| InstagramFeed | Cut. Instagram content is better as photography in story sections. Social links remain in CTA. |
| SupportCTA (mountain tiers) | Replaced with two-path approach in The Ask (S7). Simpler, more honest. |

## Components to Reuse from Coming-Soon Page

| Component | Source | Used In |
|---|---|---|
| BiometricCard | `coming-soon-client.tsx` | S5 (The Machine) |
| AnimatedCounter | `coming-soon-client.tsx` | S3 (The Rebuild) |
| GlitchText | `coming-soon-client.tsx` | S1 (Cold Open) |
| FloatingParticles | `coming-soon-client.tsx` | Persistent layer |
| Email form | `coming-soon-client.tsx` | S7 (The Ask) |
| Social links | `coming-soon-client.tsx` | S7 (The Ask) |
| Custom cursor | `coming-soon-client.tsx` | Persistent layer |
| Atmospheric overlays | `coming-soon-client.tsx` | Persistent layer |

## Mobile Adaptations

All sections must degrade gracefully on viewports ≤768px (tablet) and ≤375px (phone).

| Section | Mobile Behavior |
|---|---|
| S1 Cold Open | Hero image uses `object-fit: cover` with focal point on Patrick. Title scales via `clamp()`. Bottom stats bar stacks vertically or reduces to 2 key stats (Recovery, Strain). Boot HUD text hidden on mobile. |
| S2 The Fall | Works as-is — text-driven layout is inherently responsive. Date font scales down. Negative space reduced proportionally. |
| S3 The Rebuild | Split-screen blocks stack vertically (image on top, text below). Prosthetic reveal becomes single-column. Counters stack to 1-column on phone, 3-column on tablet+. |
| S4 Bhutan Trek | Horizontal scroll becomes a **vertical card stack** on mobile — each journey panel is a full-width card that scrolls normally. Telemetry overlay becomes inline between cards rather than fixed. Mountain profile SVG stays as a thin banner. |
| S5 The Machine | Biometric grid goes to 2-column on tablet, 1-column on phone. Recovery hero stays full-width. Last workout card stacks its stats. |
| S6 The Mission | Dare2Tri split stacks vertically. Race calendar goes single-column. Nationals card stays prominent. |
| S7 The Ask | Two-path CTAs stack vertically. Email form stays single-column (already responsive from coming-soon). |
| S8 Footer | Stays as-is — already a simple flex row. |

**Global mobile rules:**
- Custom crosshair cursor: hidden on touch devices (`@media (pointer: coarse)`)
- Parallax effects: disabled on mobile (no `mouseMove` tracking)
- Floating particles: count reduced to 10 on mobile, 0 if `prefers-reduced-motion`
- Journey line: hidden on mobile (already specified)
- Persistent ECG: moves from margin to a thin line above the bottom stats bar on mobile, or hidden

---

## Boot Sequence Timing Detail

The 1.5-second boot is a concurrent sequence, not sequential steps:

```
0.0s ─ Hero image appears (desaturated, brightness: 0.7)
0.0s ─ Boot text starts typing in top-left (3 lines, each 0.15s apart)
0.3s ─ ECG line begins drawing left-to-right (0.4s duration)
0.5s ─ Image begins saturating to full color (0.5s ease-out)
0.7s ─ Boot text fades to 10% opacity
0.8s ─ Bottom stats bar slides up and populates left-to-right (stagger: 0.1s per stat)
1.2s ─ All elements at final state
1.5s ─ Boot complete, scroll unlocked
```

Steps overlap — the image saturation happens WHILE the ECG draws and stats populate. The effect is everything "warming up" simultaneously, not sequentially.

If WHOOP data hasn't loaded by 1.5s, stats show loading shimmer and populate when ready (no blocking).

---

## Section Transitions

| Boundary | Transition |
|---|---|
| S1 → S2 | Continuous scroll. As S1 scrolls up, the hero image parallaxes away. Between sections: ~20vh of near-black negative space. S2 content fades in via `whileInView`. The bottom stats bar and HUD elements fade to 0 opacity over the last 20% of S1's scroll range. |
| S2 → S3 | The ECG flatline holds through the negative space after the accident date. "SIGNAL RECOVERED" / "HEARTBEAT DETECTED..." text types in with 0.3s per line. A faint orange glow bleeds in from edges (radial gradient, opacity 0 → 0.15 over 1s). S3's opening headline fades in immediately after. No hard cut — the light returns gradually. |
| S3 → S4 | ~15vh negative space. S4 intro text ("OCTOBER 2022. BHUTAN.") fades in. When user scrolls past the intro, the horizontal scroll container takes over. |
| S4 → S5 | Horizontal scroll ends. "TRAIL COMPLETE" text sits centered. ~10vh space. S5 transition: the ECG line (which has been marginal) grows thicker and brighter, expanding across the full viewport width over 0.5s as the section enters view. |
| S5 → S6 | Standard continuous scroll. ~15vh space. S5 data cards fade out as user scrolls past. ECG returns to subtle margin state. |
| S6 → S7 | ~10vh space. Minimal transition — the narrative naturally flows from "here's the goal" to "here's how to help." |
| S7 → S8 | S7 content ends. Footer appears with the ECG farewell line. No dramatic transition — the quiet ending is intentional. |

---

## Bhutan Trek Panel Content

Panels are hardcoded with approximate data based on the Trans Bhutan Trail:

| Panel | Days | Location | Altitude | Temp | Copy |
|---|---|---|---|---|---|
| 1 | Day 1-4 | Haa to Paro | 8,200ft | 62°F | "He flew to Bhutan alone. A country he'd dreamed of since reading about it as a sophomore in 2002. Twenty years later, he was standing at the trailhead." |
| 2 | Day 5-10 | Paro to Thimphu | 9,800ft | 55°F | "The first passes tested the prosthetic on terrain it was never designed for. Mud, rock, switchbacks. He adjusted. The leg adjusted." |
| 3 | Day 11-16 | Thimphu to Bumthang | 12,500ft | 42°F | "Above the treeline, the air thinned and the temperature dropped. Every step above 12,000 feet was a negotiation with the mountain." |
| 4 | Day 17-22 | Bumthang Highlands | 14,000ft | 32°F | "The highest pass. 14,000 feet. Below-freezing wind. One leg of carbon fiber and titanium on a path most people wouldn't attempt with two." |
| 5 | Day 23-26 | Descent to Trashigang | 9,500ft | 50°F | "The descent was its own challenge. Downhill punishes a prosthetic differently — every step is a controlled fall." |
| 6 | Day 27-29 | Trashigang to Finish | 8,000ft | 60°F | "November 22, 2022. Trail complete. 250 miles. 12 passes. First American. First below-knee amputee." |

**Data burst triggers:**
- Panel 4 (highest pass): Burst shows "ALTITUDE: 14,000ft • ELEVATION GAIN: 6,200ft • ESTIMATED STRAIN: 19+"
- Panel 6 (finish): Burst shows "TOTAL DISTANCE: 250mi • TOTAL PASSES: 12 • DURATION: 29 DAYS"

**Mountain Profile SVG:** Hand-drawn approximation of the elevation cross-section. Not GPS-accurate — a stylized representation showing the general shape: gradual climb, multiple peaks in the middle section, descent at the end. Built as an inline SVG path, not an external asset. Reference waypoints: 8,200ft → 9,800ft → 12,500ft → 14,000ft → 9,500ft → 8,000ft.

---

## Loading & Skeleton States

| Component | Loading State |
|---|---|
| S1 bottom stats bar | Shimmer/skeleton cards (gray pulse animation) until WHOOP data arrives. Stats populated individually as each value resolves. |
| S5 biometric dashboard | Recovery hero shows a "—" with shimmer until data loads. Grid cards show skeleton state. Last workout card hidden until data available. If demo mode, demo data populates immediately (no loading state needed). |
| S6 race countdown | Computed client-side from hardcoded dates — no loading state needed. |

---

## Assets Required

Photography is confirmed available (strong library). Specific needs per section:

| Section | Asset | Status | Notes |
|---|---|---|---|
| S1 | Hero action photo (Patrick racing/training) | Needed from library | Full-bleed, landscape preferred, high-res. Focal point should be on Patrick for mobile crop. |
| S3 | Patrick with David Rotter / prosthetic fitting | Needed from library | Split-layout, can be portrait or landscape |
| S3 | Prosthetic detail / macro shot | Needed from library | Product-reveal quality. Carbon fiber texture, dramatic lighting preferred. |
| S3 | Dare2Tri training session | Needed from library | Early training or first adaptive sports moment |
| S4 | 6 Bhutan trek photos | Needed from library | One per panel. Progressive: trailhead → valleys → highlands → summit → descent → finish |
| S5 | None | N/A | Data-driven section, no photography |
| S6 | Dare2Tri team photo | Needed from library | Group/team context |
| S7 | None | N/A | CTA section, text-driven |

**Existing assets in `/public`:**
- `pat-crop.png` — usable in S3 or as fallback
- `pat-run.jpg` — potential S1 hero candidate
- `pat-crop-run.png` — potential S1 hero candidate
- Sponsor logos in `/public/sponsors/` — confirmed for S7

---

## Data Sources

| Data | Source | Update Method |
|---|---|---|
| WHOOP biometrics | WHOOP API via `/api/whoop/stats` | Automatic via server-side caching (5-min) + webhooks |
| Race calendar | Hardcoded in component data file | Manual update by developer |
| Race results | Hardcoded in component data file | Manual update as races complete |
| Day counters | Computed client-side from constants | Automatic |
| Bhutan trek data | Hardcoded in component | Static — historical data |
| Strava link | `https://strava.app.link/gVriWQZiL0b` | From coming-soon page (confirmed) |

---

## Resolved Optionals

These items were marked "optional" during design — resolved here:

| Item | Decision | Rationale |
|---|---|---|
| S6: "DAYS UNTIL NATIONALS" card | **Yes — include** | Connects biometric thread to race calendar. Creates urgency. |
| S7: Nationals countdown for urgency | **No — skip** | Redundant with S6. The ask section should feel earned, not pressured. |
| S8: "BUILT WITH WHOOP DATA" credit | **Yes — include** | Subtle, honest, and acknowledges the tech that makes the site unique. |

---

## Technical Notes

- **File structure:** Each section becomes its own component in `components/sections/`. The main page file (`page.full-site.tsx`) orchestrates section order and passes shared state (scroll progress, WHOOP data).
- **Shared context:** VitalityContext and WhoopContext remain as-is. The persistent biometric thread reads from WhoopContext.
- **Scroll tracking:** A single `useScroll` on the page container drives the journey line and section-aware biometric behavior. Each section component receives its own scroll progress via Framer Motion's `whileInView` or section-specific `useScroll` with `target` refs.
- **The persistent ECG:** A new component that lives at the page level (not inside any section). It reads heart rate from WhoopContext and section scroll position to adjust its behavior (dim in S2, expand in S5, etc.).
- **Horizontal scroll (S4):** Implemented via a tall container (300vh) with `useTransform` mapping `scrollYProgress` to horizontal `x` translation. Same technique as existing BhutanJourney component.
- **Demo mode:** All sections must render correctly with demo/fallback WHOOP data. No console errors when `WHOOP_ENABLED=false`.
