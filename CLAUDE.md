# CLAUDE.md - Patrick Wingert Website

## Project Overview

Premium personal website for **Patrick Wingert**, an adaptive-triathlon athlete and member of the **2026 Dare2Tri Elite Development Team**. The site tells his story of resilience through cinematic, boundary-pushing web design integrated with live biometric data from his WHOOP device.

**Project codename:** Project Pulse
**Developer:** Nathaniel
**Domain:** patrickwingert.com

---

## The Story

Patrick Wingert lost his **right leg below the knee** on **November 1, 2020** when his motorcycle was hit by a car in Chicago. Nine months earlier - on **January 20, 2020** - he had gotten sober. His marriage had ended. The restaurant group he'd spent years building collapsed during COVID. Then he lost his leg.

In **October 2022**, less than two years after amputation, Patrick flew to Bhutan alone - a country he'd dreamed of visiting since reading about it as a sophomore at Lyons Township High School in 2002. Over 29 days he walked **250 miles** across the **Trans Bhutan Trail**, crossing 12 mountain passes and climbing 14,000+ feet of elevation. He became the **first American** and **first below-knee amputee** to complete the entire trail. He was also the first Westerner since COVID reopening.

Today, he competes in triathlon and marathon events, training toward podium finishes at state championships and qualification for **USA Para Triathlon National Championships (August 2026, Milwaukee)**.

**Motto:** "Life is Hard. Be Harder."

### Key People
- **Wife** and **parents** - core support system
- **David Rotter** - prosthetist
- **Keri** - friend at Dare2Tri who got him into adaptive sports
- **Melissa Stockwell** - mentor/connection through Dare2Tri

### Key Dates
```
Sobriety:       January 20, 2020
Accident:       November 1, 2020
Bhutan Trek:    October 24 – November 22, 2022
Next Race:      April 11, 2026 (AlphaWin Napa Valley Triathlon - California State Championship)
```

### 2026 Race Calendar
**Triathlon:**
- Apr 11: AlphaWin Napa Valley Triathlon (CA State Championship)
- Jun 7: Leon's Triathlon, Hammond, IN
- Jul 19: SuperTri Long Beach Legacy Triathlon
- Jun 28: Pleasant Prairie Triathlon, WI
- Aug 9: USA Para Triathlon National Championships, Milwaukee
- Aug 23: SuperTri Chicago Triathlon (IL State Championship)

**Running:**
- Jul 26: San Francisco Marathon
- Nov 15: Berkeley Half Marathon
- Dec 6: California International Marathon

### Credentials
- Dare2Tri Elite Development Team Athlete (2026)
- First American & first below-knee amputee to thru-hike the Trans Bhutan Trail
- Record-setting trekker
- Won his very first triathlon at Train to Race camp

---

## Design Philosophy

### Quality Standard
**This is not template-level work.** Every output should make people stop scrolling and say "what the hell is this?" - in the best way possible. Safe, generic designs will be rejected. Push boundaries on every deliverable. This standard applies to all future work on this project.

### Aesthetic
- **Cinematic / sports documentary** - think Netflix sports doc opening credits
- **Premium and editorial** - more Monocle than ESPN
- **High-energy but controlled** - aggressive typography balanced with breathing room
- **Dark, moody, dramatic** - the site should feel like walking into a film

### Brand Colors
- **Primary background:** Near-black (#050505)
- **Accent color:** Vibrant orange (dynamic via VitalityContext theme, defaults ~#f97316)
- **Text:** White with various opacity levels for hierarchy
- **Supporting:** Cyan (#0ff) and magenta (#f0f) for glitch effects only

### Typography
- **Display font:** Bebas Neue (font-display) - used for all major headings, "LIFE IS HARD. BE HARDER.", stats, section titles
- **Body/mono font:** Inter - general body text
- **Mono/UI font:** System mono or Space Mono - used for labels, tracking text, status messages, technical UI elements
- The distinctive serifed "I" in Bebas Neue is a key character of the typography - preserve this

### Visual Effects (Current Implementation)
- **ECG heartbeat line** - SVG animation behind hero, speed synced to actual heart rate
- **Glitch typography** - chromatic aberration (cyan/magenta ghosts) on "BE HARDER."
- **Film grain / noise overlay** - subtle texture across entire page
- **Scanlines** - CRT monitor effect
- **Running scan line** - slow horizontal sweep
- **Floating particles** - orange particles drifting upward
- **3D parallax** - mouse-tracking depth on multiple layers
- **Custom crosshair cursor** - with smooth follow and hover scaling
- **Vignette** - edge darkening
- **Floating background text** - huge ghosted text scrolling in background
- **Animated counters** - numbers count up with eased animation

---

## Technical Stack

### Framework & Dependencies
- **Next.js 14.2.18** (App Router)
- **React 18**
- **Framer Motion 11.x** - all animations and scroll-driven interactions
- **Lenis** - smooth scrolling (via SmoothScroll component)
- **Tailwind CSS 3.4** - styling
- **TypeScript** - strict mode

### Project Structure
```
patrick-wingert-site/
├── app/
│   ├── page.tsx                    # Currently renders ComingSoonClient
│   ├── coming-soon-client.tsx      # ACTIVE - the deployed coming soon page
│   ├── page_full-site.tsx          # IN DEVELOPMENT - the full multi-section site
│   ├── layout.tsx                  # Root layout (Inter + Bebas Neue fonts, Providers)
│   ├── globals.css                 # Global styles, animations, utilities
│   └── api/
│       ├── subscribe/              # Email capture endpoint
│       └── whoop/                  # WHOOP OAuth + data endpoints
│           ├── auth/route.ts
│           ├── callback/route.ts
│           ├── stats/route.ts
│           ├── webhook/route.ts
│           └── disconnect/route.ts
├── components/
│   ├── Providers.tsx               # Context wrappers
│   ├── SmoothScroll.tsx            # Lenis smooth scroll
│   ├── SoundController.tsx         # Audio management
│   └── sections/                   # Full site sections
│       ├── HeroSection.tsx
│       ├── TheShift.tsx
│       ├── ProstheticReveal.tsx
│       ├── ByTheNumbers.tsx
│       ├── BhutanJourney.tsx
│       ├── LiveStats.tsx
│       ├── TheMission.tsx
│       ├── SupportCTA.tsx
│       └── InstagramFeed.tsx
├── contexts/
│   ├── VitalityContext.tsx          # Theme + energy state management
│   └── WhoopContext.tsx             # WHOOP data + connection state
├── lib/
│   ├── whoop-client.ts             # WHOOP API client
│   ├── whoop-storage.ts            # Token persistence
│   └── whoop-cache.ts              # Response caching
├── types/
│   └── whoop.ts                    # WHOOP TypeScript types
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Two-Version System
- **`coming-soon-client.tsx`** - Currently deployed and live. This is the page visitors see.
- **`page_full-site.tsx`** - The full multi-section storytelling site, in active development. Once complete, it replaces the coming soon page.

When editing, be clear about which version you're modifying.

---

## WHOOP Integration

### Architecture
The site connects to Patrick's WHOOP device via OAuth 2.0 to display real biometric data.

```
Browser → WhoopProvider (React Context) → /api/whoop/stats → WHOOP API
                                                ↑
                                    /api/whoop/webhook (push updates)
```

### Dual-Mode System
The site operates in two modes with graceful fallback:

| Mode | Trigger | Data Source |
|------|---------|-------------|
| **Live** | Valid WHOOP credentials + connected | Real WHOOP API data |
| **Demo** | No credentials or connection error | Realistic placeholder data via VitalityContext |

### Data Points Displayed
- Recovery Score (0-100%, color-coded: green ≥67, yellow ≥34, red <34)
- Daily Strain (0-21 scale)
- Heart Rate (current/resting/max/average)
- HRV (heart rate variability in ms)
- Blood Oxygen (SpO2 %)
- Skin Temperature
- Calories burned
- Last Workout details (sport, duration, strain, HR stats)

### Heart Rate Behavior
WHOOP doesn't provide real-time HR streaming via API. Instead:
- After a workout completes (via webhook), show the **workout average HR**
- Over ~2 hours, the displayed HR **decays back to resting HR**
- This creates an "echo of training" effect - visitors see the aftermath of real effort
- The heartbeat ECG animation speed syncs to the current displayed HR

### Rate Limits
- 100 requests/minute, 10,000 requests/day
- Server-side caching (5-min intervals) keeps usage at ~288 calls/day (~3% of limit)
- Webhooks handle real-time updates without polling

### Environment Variables
```env
WHOOP_ENABLED=true
WHOOP_CLIENT_ID=<from WHOOP developer dashboard>
WHOOP_CLIENT_SECRET=<from WHOOP developer dashboard>
WHOOP_REDIRECT_URI=https://patrickwingert.com/api/whoop/callback
```

---

## Coming Soon Page - Intro Sequence

The boot sequence is a cinematic loading experience tied to the WHOOP connection:

### Phase Progression
```
Phase 0: Boot screen (WHOOP connecting, progress bar, status log)
         → Waits for WHOOP data OR 8s fallback timeout
         → Minimum 2.5s cinematic duration
Phase 1: Hero title reveals ("LIFE IS HARD. BE HARDER." with blur-in)
Phase 2: Name + subtitle + decorative line appear
Phase 3: Scroll indicator + live stats bar
Phase 4-6: Remaining elements cascade in
```

### Progress Bar Logic
The progress bar is synced to actual WHOOP connection status:
- `idle` → 5%
- `connecting` → 30%
- `syncing` → 60%
- `connected` / `error` → 100%

Smooth animation eases between milestones. If API hangs, forced completion at 8 seconds.

---

## Coming Soon Page - Sections

1. **Hero** - "LIFE IS HARD. BE HARDER." with ECG line, parallax, glitch text, live HR display
2. **The Story / Stats** - "THEY SAID IT WAS IMPOSSIBLE. THEY WERE WRONG." + three animated counters (Days Since Accident, Days Sober, Days Until Next Race)
3. **Live Biometrics** - Full WHOOP data dashboard (recovery, strain, HR, HRV, SpO2, temp, calories, last workout)
4. **Email Capture** - "DON'T MISS THE MOMENT." + email subscription form with glow effects
5. **Footer** - Minimal branding

---

## Full Site - Sections (In Development)

The full site (`page_full-site.tsx`) uses scroll-driven storytelling with an orange journey line tracking progress:

1. **HeroSection** - Main entrance
2. **TheShift** - The turning point in Patrick's life
3. **ProstheticReveal** - The prosthetic as identity, not limitation
4. **LiveStats** - WHOOP biometric dashboard
5. **ByTheNumbers** - Key stats and achievements
6. **BhutanJourney** - The Trans Bhutan Trail story
7. **TheMission** - Dare2Tri and advocacy work
8. **InstagramFeed** - Dynamic social content
9. **SupportCTA** - Sponsorship and donation (Dare2Tri general fund + direct athlete sponsorship)

---

## Content & Copy

### Voice & Tone
- Direct, punchy, zero fluff
- Short sentences that hit hard
- Earned confidence, not arrogance
- The story speaks for itself - don't over-explain
- "He didn't go looking for meaning. He went to finish something he started in his head twenty years ago."

### Social Links
- Instagram: https://www.instagram.com/patwingit
- Strava: https://www.strava.com (needs specific profile link)
- Dare2Tri: https://www.dare2tri.org

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

Plan Mode - Code Review Framework:

Before making any significant code changes, run through this review. For every issue found, explain the concrete tradeoffs, give an opinionated recommendation, and ask for input before assuming a direction.

Engineering Preferences:

- DRY is non-negotiable - flag repetition aggressively. The WHOOP stats cards, biometric grid items, and phase animation patterns are prime candidates.
- Engineered enough - not fragile/hacky, not over-abstracted. A well-placed helper function beats copy-paste; a premature abstraction layer beats neither.
- Handle more edge cases, not fewer - WHOOP API failures, demo mode fallbacks, serverless cold starts, and token expiry are all real scenarios. Account for them explicitly.
- Explicit over clever - especially in animation timing, context state, and API response handling. Future-you needs to read this at 11pm.
- Bias toward fewer dependencies - before adding a package, ask if Framer Motion or native browser APIs already cover it.

1. Architecture Review
Evaluate:

- WHOOP data flow - is the boundary between WhoopContext, VitalityContext, and components clean? No component should reach past its context.
- Serverless gotchas - any file system reads/writes outside of /tmp? Any state assumed to persist between function invocations? (Learned the hard way with token storage.)
- API route structure - are /api/whoop/* routes handling errors and returning consistent shapes? A failed fetch should never crash the UI.
- Context coupling - VitalityContext and WhoopContext should remain independently functional. Demo mode must work with zero env vars set.
- Two-version system integrity - changes to shared components (Providers, SmoothScroll, contexts) affect both coming-soon-client.tsx and the full site. Flag blast radius.

2. Code Quality Review
Evaluate:   

- DRY violations - the biometric stat cards in coming-soon-client.tsx are a known repeat pattern. Should be extracted.
- Error handling - every fetch() call needs a catch. Every WHOOP API response needs a null/undefined guard before accessing .data.
- TypeScript strictness - no any, no @ts-expect-error unless genuinely unavoidable and commented.
- Dead code - commented-out blocks (like the old static status messages) should be removed, not left as clutter.
- Magic numbers - animation durations, phase timing delays, and HR decay constants should be named constants, not inline literals.

3. Animation & Performance Review
Evaluate:

- Framer Motion overhead - are useTransform and useSpring hooks being created at the top level of components (correct) or inside loops/conditionals (wrong)?
- will-change and GPU layers - fixed position elements with continuous animation (scan line, particles, ECG) should not cause layout thrash.
- Particle count - 30 particles is the current default. On low-end mobile this may tank FPS. Should respect prefers-reduced-motion.
- useEffect cleanup - every requestAnimationFrame loop, timer, and event listener must return a cleanup function. Check cursor follow, counter animation, and progress bar RAF loops.
- Re-render triggers - mousePosition state updates on every mousemove. Ensure this doesn't cascade re-renders into expensive child components.

4. WHOOP Integration Review
Evaluate:

- Token persistence - tokens must go through Supabase, never the filesystem. Flag any fs imports in API routes.
- Dual-mode fallback - if WHOOP_ENABLED=false or credentials are missing, the site must render correctly in demo mode with no console errors.
- Rate limit safety - no unbounded polling. All client-side fetches must go through the cached /api/whoop/stats endpoint, not direct WHOOP API calls.
- Webhook reliability - the webhook handler must respond with 200 quickly and process async. Long-running webhook handlers will time out on Vercel.
- HR decay correctness - the post-workout HR decay logic should handle edge cases: no workout today, workout older than 2 hours, resting HR unavailable.

5. Design Quality Review
Evaluate:

- Does it clear the bar? Would this make someone stop scrolling and say "what the hell is this?" - in a good way. If not, it's not done.
- Orange discipline - accent color used for emphasis, not decoration. Count orange elements per viewport. If it's more than 3-4, pull back.
- Typography hierarchy - Bebas Neue for display, Inter for body, mono for UI labels. No mixing outside these roles.
- Mobile degradation - custom cursor hidden on touch, particle count reduced, parallax disabled. Verify on 375px viewport.
- Intro sequence sacred - the boot animation with WHOOP progress bar is a signature element. Any change to it requires explicit discussion.

For Each Issue Found

- Describe the problem concretely, with file and line references.
- Present 2–3 options including "do nothing" where reasonable.
- For each option: implementation effort, risk, impact on other code, maintenance burden.
- Give a recommended option and explain why it maps to the preferences above.
- Ask whether to proceed before making the change.

Workflow

- Don't assume priorities on timeline or scale.
- For BIG CHANGES (new sections, refactors, integration work): work through interactively, one review area at a time, max 4 top issues per area.
- For SMALL CHANGES (bug fixes, copy updates, style tweaks): work through interactively ONE question per review area.
- After each section, pause and ask for feedback before moving on.

---

## Important Notes

- **Never use placeholder or generic designs.** Every component should feel premium, cinematic, and intentional.
- **Preserve the intro sequence** - the boot animation with WHOOP connection is a signature element. Don't remove or simplify it.
- **The heartbeat motif is central** - ECG lines, pulsing elements synced to HR, the "Vitality Engine" concept ties everything together.
- **Orange is earned, not sprayed.** Use the accent color for emphasis moments, not decoration. White/gray hierarchy does the heavy lifting.
- **Test both WHOOP modes** - always ensure the site works in demo mode when credentials aren't available.
- **Mobile matters** - all effects should degrade gracefully. Custom cursor hides on touch devices.
- **Accessibility** - glitch effects use `aria-hidden`, reduced motion media query is respected in globals.css.
