# PATRICK WINGERT

**Life is Hard. Be Harder.**

Premium personal website for Patrick Wingert, adaptive-triathlon athlete and member of the 2026 Dare2Tri Elite Development Team. A cinematic, data-driven web experience integrated with live biometric data from his WHOOP device.

**Domain:** [patrickwingert.com](https://patrickwingert.com) | [View Brand Identity System](https://patrickwingert.com/patrick-wingert-brand-identity.html)

---

## The Story

Patrick Wingert lost his right leg below the knee on November 1, 2020 when his motorcycle was hit by a car in Chicago. Nine months earlier he had gotten sober. His marriage had ended. The restaurant group he'd spent years building collapsed during COVID. Then he lost his leg.

In October 2022, less than two years after amputation, Patrick flew to Bhutan alone and walked 250 miles across the Trans Bhutan Trail, crossing 12 mountain passes and climbing 14,000+ feet of elevation. First American. First below-knee amputee. Ever.

Today he competes in triathlon and marathon events with the Dare2Tri Elite Development Team, targeting the 2026 USA Para Triathlon National Championships in Milwaukee.

---

## Tech Stack

- **Next.js 14** (App Router) with **TypeScript**
- **Framer Motion** for animations and scroll-driven interactions
- **Lenis** for smooth scrolling
- **Tailwind CSS** with custom theme system
- **WHOOP API** integration via OAuth 2.0 for live biometric data
- **Cobe** for 3D interactive globe
- **react-simple-maps** for 2D race map
- **Resend** for transactional email
- **Supabase** for token persistence
- **Vercel** for deployment

## Getting Started

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
WHOOP_ENABLED=true
WHOOP_CLIENT_ID=
WHOOP_CLIENT_SECRET=
WHOOP_REDIRECT_URI=https://patrickwingert.com/api/whoop/callback
RESEND_API_KEY=
SUBSCRIBE_NOTIFY_EMAIL=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

The site runs in demo mode when WHOOP credentials are unavailable.

---

## Brand Identity

### Positioning

Patrick occupies the raw, confrontational end of the adaptive athlete spectrum. Most adaptive athlete brands focus on soft inspiration. Patrick's is cinematic, data-driven, unapologetic. Think sports documentary, not charity campaign.

### Colors

| Name         | Hex       | Role                                                |
| ------------ | --------- | --------------------------------------------------- |
| Void Black   | `#050505` | Primary background. 80%+ of visual real estate.     |
| Pulse Orange | `#F97316` | The heartbeat. Primary accent. Earned, not sprayed. |
| Signal White | `#FFFFFF` | Primary text. Various opacities for hierarchy.      |
| Cyan         | `#00FFFC` | Glitch effects only                                 |
| Magenta      | `#FF00FF` | Glitch effects only                                 |

**Orange is earned.** Use for the moment that needs to hit hardest. One word in a headline, one stat in a grid, one CTA. White/gray hierarchy does the heavy lifting.

### Typography

| Font           | Role    | Usage                                                                                                      |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| **Bebas Neue** | Display | Headlines, stats, tagline. Always uppercase, tracking >= 0.04em. The serifed "I" is a signature character. |
| **Inter**      | Body    | Clean, invisible. Body copy, descriptions, longer text. Weights 300-700.                                   |
| **Space Mono** | UI/Data | Labels, status messages, tracking text, timestamps. Always uppercase with wide letter-spacing.             |

### Voice

Direct, punchy, zero fluff. Short sentences that hit hard. Earned confidence, not arrogance. Story speaks for itself.

**The brand does:** Use short direct sentences. Let data speak. Show confidence earned through results. Confront.

**The brand never:** Uses soft motivational cliches. Over-explains. Reduces story to "overcoming disability" feel-good narrative. Victimizes.

### Brand Rules

1. **THE TAGLINE IS SACRED** - "Life is Hard. Be Harder." Always Bebas Neue, always caps, "BE HARDER." always in Pulse Orange.
2. **ORANGE IS EARNED** - Never spray across layout. Use for emphasis moments only.
3. **DARK FIRST** - Primary context always dark. Light backgrounds are exception, never default.
4. **NEVER SOFT** - No pastels. No rounded-everything. No soft gradients. This brand confronts.
5. **DATA IS REAL** - Never fabricate biometric numbers. Use demo mode with realistic ranges if API unavailable.
6. **THE PROSTHETIC IS VISIBLE** - Never hide or minimize. It's equipment, not limitation.
7. **NO INSPIRATION PORN** - Never frame as "overcoming disability" in a way that reduces Patrick to feel-good story.
8. **CINEMATIC STANDARD** - Every deliverable should feel like a Netflix sports documentary opening sequence.

---

## Architecture

### Two-Version System

- **`coming-soon-client.tsx`** - Currently deployed and live
- **`page_full-site.tsx`** - Full multi-section storytelling site, in development

### WHOOP Integration

```
Browser -> WhoopProvider (Context) -> /api/whoop/stats -> WHOOP API
                                           ^
                                 /api/whoop/webhook (push updates)
```

Dual-mode: live data when connected, realistic demo data as fallback. Heart rate displays post-workout average that decays to resting over ~2 hours. Server-side caching at 5-min intervals keeps API usage at ~3% of rate limits.

### Key Features

- **Heartbeat visualization** synced to actual heart rate
- **Cinematic boot sequence** with WHOOP connection progress
- **Interactive race map** with fly-to zoom, keyboard nav, state highlighting
- **3D globe** with race markers and route arcs
- **Glitch typography** with chromatic aberration
- **Film grain, scanlines, floating particles** for documentary feel
- **Custom crosshair cursor** with smooth follow
- **Animated counters** for key stats
- **Live biometric dashboard** (recovery, strain, HR, HRV, SpO2)

---

## Social

- **Instagram:** [@patwingit](https://www.instagram.com/patwingit)
- **Dare2Tri:** [dare2tri.org](https://www.dare2tri.org)

---

Built by [Nathaniel Daniels](https://github.com/NathanielDaniels). Powered by Pulse Orange.
