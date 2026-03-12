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
| ECG heartbeat line | Always present in margin. Dims in S2 (flatlines at accident). Returns strong in S3. Expands to full-width in S5. Calm in S6-S8. Synced to resting HR. |
| Orange journey line | Left edge, tracks scroll progress. Dims in S2, returns in S3. Pulsing orb at current position. Hidden on mobile. |
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

## Technical Notes

- **File structure:** Each section becomes its own component in `components/sections/`. The main page file (`page.full-site.tsx`) orchestrates section order and passes shared state (scroll progress, WHOOP data).
- **Shared context:** VitalityContext and WhoopContext remain as-is. The persistent biometric thread reads from WhoopContext.
- **Scroll tracking:** A single `useScroll` on the page container drives the journey line and section-aware biometric behavior. Each section component receives its own scroll progress via Framer Motion's `whileInView` or section-specific `useScroll` with `target` refs.
- **The persistent ECG:** A new component that lives at the page level (not inside any section). It reads heart rate from WhoopContext and section scroll position to adjust its behavior (dim in S2, expand in S5, etc.).
- **Horizontal scroll (S4):** Implemented via a tall container (300vh) with `useTransform` mapping `scrollYProgress` to horizontal `x` translation. Same technique as existing BhutanJourney component.
- **Demo mode:** All sections must render correctly with demo/fallback WHOOP data. No console errors when `WHOOP_ENABLED=false`.
