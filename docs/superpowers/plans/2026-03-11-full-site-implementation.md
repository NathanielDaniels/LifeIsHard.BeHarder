# Full Site Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full patrickwingert.com site — an 8-section, scroll-driven cinematic documentary with persistent biometric thread, replacing the current placeholder full-site build.

**Architecture:** Each section is an independent React component in `components/sections/`. A page-level orchestrator (`app/page.full-site.tsx`) composes them with shared scroll state and persistent overlay elements (ECG, journey line, cursor, atmospheric layers). WHOOP data flows through existing WhoopContext; VitalityContext drives theming. Components extracted from `coming-soon-client.tsx` become shared modules in `components/shared/`.

**Tech Stack:** Next.js 14 (App Router), React 18, Framer Motion 11, Lenis (smooth scroll), Tailwind CSS 3.4, TypeScript (strict)

**Spec:** `docs/superpowers/specs/2026-03-11-full-site-design.md`

---

## File Structure

### New Files to Create

```
components/
├── shared/
│   ├── BiometricCard.tsx          # Extracted from coming-soon-client.tsx
│   ├── AnimatedCounter.tsx        # Extracted from coming-soon-client.tsx
│   ├── GlitchText.tsx             # Extracted from coming-soon-client.tsx
│   ├── FloatingParticles.tsx      # Extracted from coming-soon-client.tsx
│   ├── EmailCapture.tsx           # Email form extracted from coming-soon-client.tsx
│   ├── SocialLinks.tsx            # Social link icons extracted from coming-soon-client.tsx
│   └── CustomCursor.tsx           # Cursor extracted from coming-soon-client.tsx
├── persistent/
│   ├── PersistentECG.tsx          # Page-level ECG heartbeat line (section-aware)
│   ├── JourneyLine.tsx            # Left-edge scroll progress line (section-aware)
│   └── AtmosphericOverlays.tsx    # Film grain, scanlines, vignette, scan line, particles
└── sections/
    ├── ColdOpen.tsx               # S1: Full-bleed hero + HUD boot
    ├── TheFall.tsx                 # S2: Date stamps, darkness, flatline
    ├── TheRebuild.tsx             # S3: Prosthetic reveal, counters, orange returns
    ├── TheProof.tsx               # S4: Bhutan horizontal scroll + telemetry
    ├── TheMachine.tsx             # S5: WHOOP biometric dashboard
    ├── TheMission.tsx             # S6: Dare2Tri + race calendar (rewrite existing)
    ├── TheAsk.tsx                 # S7: Two-path CTA + email + sponsors
    └── SiteFooter.tsx             # S8: Minimal footer + ECG farewell

lib/
└── race-data.ts                   # Race calendar data + results (hardcoded)
```

### Files to Modify

```
app/page.full-site.tsx             # Complete rewrite — new section composition + persistent layers
app/coming-soon-client.tsx         # Update imports to use shared components (no functional change)
```

### Files to Delete (replaced by new sections)

```
components/sections/HeroSection.tsx
components/sections/TheShift.tsx
components/sections/ProstheticReveal.tsx
components/sections/ByTheNumbers.tsx
components/sections/BhutanJourney.tsx
components/sections/LiveStats.tsx
components/sections/InstagramFeed.tsx
components/sections/SupportCTA.tsx
```

Note: `components/sections/TheMission.tsx` is rewritten in place, not deleted.

---

## Chunk 1: Extract Shared Components

Extract reusable components from `coming-soon-client.tsx` into `components/shared/`. Update coming-soon imports. No visual changes — purely structural.

### Task 1: Extract GlitchText

**Files:**
- Create: `components/shared/GlitchText.tsx`
- Modify: `app/coming-soon-client.tsx`

- [ ] **Step 1: Create GlitchText component**

Extract the `GlitchText` function from `coming-soon-client.tsx:57-93`. Make it a standalone export:

```tsx
'use client';

interface GlitchTextProps {
  text: string;
  themeColor: string;
}

export default function GlitchText({ text, themeColor }: GlitchTextProps) {
  return (
    <span className="relative inline-block">
      <span
        className="relative z-10"
        style={{
          color: themeColor,
          textShadow: `0 0 30px ${themeColor}66, 3px 3px 0 rgba(0,0,0,0.4)`,
        }}
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 z-0 opacity-80"
        style={{ color: '#0ff', animation: 'glitch-1 3s infinite' }}
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 z-0 opacity-80"
        style={{ color: '#f0f', animation: 'glitch-2 3s infinite' }}
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}
```

- [ ] **Step 2: Update coming-soon-client.tsx to import from shared**

Replace the inline `GlitchText` function (lines 57-93) with:
```tsx
import GlitchText from '@/components/shared/GlitchText';
```

Remove the old inline function definition.

- [ ] **Step 3: Verify coming-soon page still works**

Run: `npm run dev`
Navigate to localhost:3000. Verify the "BE HARDER." glitch effect renders identically.

- [ ] **Step 4: Commit**

```bash
git add components/shared/GlitchText.tsx app/coming-soon-client.tsx
git commit -m "refactor: extract GlitchText to shared component"
```

---

### Task 2: Extract AnimatedCounter

**Files:**
- Create: `components/shared/AnimatedCounter.tsx`
- Modify: `app/coming-soon-client.tsx`

- [ ] **Step 1: Create AnimatedCounter component**

Extract from `coming-soon-client.tsx:96-119`:

```tsx
'use client';

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration, hasAnimated]);

  return <>{displayValue.toLocaleString()}</>;
}
```

- [ ] **Step 2: Update coming-soon-client.tsx import**

Replace the inline `AnimatedCounter` function with:
```tsx
import AnimatedCounter from '@/components/shared/AnimatedCounter';
```

- [ ] **Step 3: Verify counters still animate on scroll**

Run dev server, scroll to stats section, verify count-up animations work.

- [ ] **Step 4: Commit**

```bash
git add components/shared/AnimatedCounter.tsx app/coming-soon-client.tsx
git commit -m "refactor: extract AnimatedCounter to shared component"
```

---

### Task 3: Extract FloatingParticles

**Files:**
- Create: `components/shared/FloatingParticles.tsx`
- Modify: `app/coming-soon-client.tsx`

- [ ] **Step 1: Create FloatingParticles component**

Extract from `coming-soon-client.tsx:19-54`:

```tsx
'use client';

import { useEffect, useState } from 'react';

interface FloatingParticlesProps {
  themeColor: string;
  count?: number;
}

export default function FloatingParticles({ themeColor, count = 30 }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; left: string; delay: string; duration: string; size: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full blur-[1px] animate-float-particle"
          style={{
            backgroundColor: themeColor,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0.4,
            // @ts-expect-error custom css vars for animation
            '--delay': p.delay,
            '--duration': p.duration,
            '--particle-opacity': 0.3 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Update coming-soon-client.tsx import**

Replace inline `FloatingParticles` with:
```tsx
import FloatingParticles from '@/components/shared/FloatingParticles';
```

Update usage: the existing call `<FloatingParticles themeColor={themeColor} />` stays the same since the prop interface matches.

- [ ] **Step 3: Verify particles render**

Dev server — confirm orange particles drift upward on the coming-soon page.

- [ ] **Step 4: Commit**

```bash
git add components/shared/FloatingParticles.tsx app/coming-soon-client.tsx
git commit -m "refactor: extract FloatingParticles to shared component"
```

---

### Task 4: Extract BiometricCard

**Files:**
- Create: `components/shared/BiometricCard.tsx`
- Modify: `app/coming-soon-client.tsx`

- [ ] **Step 1: Create BiometricCard component**

Extract from `coming-soon-client.tsx:121-262`. This is the largest extraction — includes the tooltip overlay logic, the `BiometricCardProps` interface, and all animation. Copy the full component including the `AnimatePresence` tooltip overlay, the `useEffect` for tooltip management, and the custom event dispatch for single-tooltip behavior.

The file should export both the component and its props interface:
```tsx
export interface BiometricCardProps { ... }
export default function BiometricCard({ ... }: BiometricCardProps) { ... }
```

- [ ] **Step 2: Update coming-soon-client.tsx import**

Replace inline `BiometricCard` and `BiometricCardProps` with:
```tsx
import BiometricCard from '@/components/shared/BiometricCard';
```

- [ ] **Step 3: Verify biometric cards render with tooltips**

Dev server — scroll to biometrics section. Click on info icons. Verify tooltip overlays appear/dismiss correctly. Verify only one tooltip open at a time.

- [ ] **Step 4: Commit**

```bash
git add components/shared/BiometricCard.tsx app/coming-soon-client.tsx
git commit -m "refactor: extract BiometricCard to shared component"
```

---

### Task 5: Extract EmailCapture

**Files:**
- Create: `components/shared/EmailCapture.tsx`
- Modify: `app/coming-soon-client.tsx`

- [ ] **Step 1: Create EmailCapture component**

Extract the email form logic from `coming-soon-client.tsx`. The component encapsulates: email state, submit handler (`handleSubmit`), loading/success/error states, the form UI with glow effect, and the success confirmation.

```tsx
'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface EmailCaptureProps {
  themeColor: string;
  onHoverChange?: (hovering: boolean) => void;
}

export default function EmailCapture({ themeColor, onHoverChange }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || submitState === 'loading') return;

    setSubmitState('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitState('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setSubmitState('error');
        setMessage(data.error);
      }
    } catch {
      setSubmitState('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  // ... rest of the form JSX from coming-soon-client.tsx lines 1169-1222
  // Include the success state, form with glow, and error message
}
```

Extract the full form JSX from lines 1169-1222 of `coming-soon-client.tsx`. Pass `onHoverChange` to button/input hover handlers (calls back to parent for cursor scaling).

- [ ] **Step 2: Update coming-soon-client.tsx**

Replace the inline form section with:
```tsx
import EmailCapture from '@/components/shared/EmailCapture';
```

In the JSX, replace the form block with:
```tsx
<EmailCapture themeColor={themeColor} onHoverChange={setIsHovering} />
```

- [ ] **Step 3: Verify email form works**

Dev server — test email submission (enter email, submit, verify success/error states).

- [ ] **Step 4: Commit**

```bash
git add components/shared/EmailCapture.tsx app/coming-soon-client.tsx
git commit -m "refactor: extract EmailCapture to shared component"
```

---

### Task 6: Extract SocialLinks and CustomCursor

**Files:**
- Create: `components/shared/SocialLinks.tsx`
- Create: `components/shared/CustomCursor.tsx`
- Modify: `app/coming-soon-client.tsx`

- [ ] **Step 1: Create SocialLinks component**

Extract the `socialLinks` array and rendering from `coming-soon-client.tsx:541-583` and the map rendering at lines 1232-1246.

```tsx
'use client';

interface SocialLinksProps {
  onHoverChange?: (hovering: boolean) => void;
}

export default function SocialLinks({ onHoverChange }: SocialLinksProps) {
  const socialLinks = [ /* ... full array from coming-soon-client.tsx:541-583 */ ];

  return (
    <div className="flex justify-center gap-8">
      {socialLinks.map((link) => (
        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
           title={link.name}
           className="relative text-white transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110 flex items-center justify-center outline-none"
           onMouseEnter={() => onHoverChange?.(true)}
           onMouseLeave={() => onHoverChange?.(false)}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create CustomCursor component**

Extract cursor logic from `coming-soon-client.tsx:304-308` (state), `399-411` (RAF loop), and `619-636` (JSX).

```tsx
'use client';

import { useEffect, useState, useRef } from 'react';

interface CustomCursorProps {
  themeColor: string;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
}

export default function CustomCursor({ themeColor, isHovering, mousePosition }: CustomCursorProps) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef(mousePosition);
  mousePositionRef.current = mousePosition;

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setCursorPosition((prev) => ({
        x: prev.x + (mousePositionRef.current.x - prev.x) * 0.15,
        y: prev.y + (mousePositionRef.current.y - prev.y) * 0.15,
      }));
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <>
      <div
        className="fixed w-5 h-5 border rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 hidden md:block"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: `translate(-50%, -50%) scale(${isHovering ? 2 : 1})`,
          borderColor: themeColor,
        }}
      />
      <div
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] hidden md:block"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          backgroundColor: themeColor,
        }}
      />
    </>
  );
}
```

- [ ] **Step 3: Update coming-soon-client.tsx imports**

Import both new components. Remove inline definitions and update JSX usage.

- [ ] **Step 4: Verify cursor and social links work**

Dev server — verify custom cursor tracks mouse, scales on hover. Verify social links open in new tabs.

- [ ] **Step 5: Commit**

```bash
git add components/shared/SocialLinks.tsx components/shared/CustomCursor.tsx app/coming-soon-client.tsx
git commit -m "refactor: extract SocialLinks and CustomCursor to shared components"
```

---

### Task 7: Verify coming-soon page is unchanged

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: No build errors. This validates all imports are correct.

- [ ] **Step 2: Visual verification**

Run `npm run dev`, navigate to localhost:3000. Walk through the entire coming-soon page:
- Boot sequence plays
- Hero animates in
- Stats count up
- Biometrics render with tooltips
- Email form works
- Social links clickable
- Custom cursor works
- Particles float

- [ ] **Step 3: Commit any fixes if needed**

---

## Chunk 2: Build Persistent Layer Components

Create the page-level components that run across all sections: ECG heartbeat, journey line, and atmospheric overlays.

### Task 8: Create AtmosphericOverlays

**Files:**
- Create: `components/persistent/AtmosphericOverlays.tsx`

- [ ] **Step 1: Create the component**

This combines the fixed overlays from `coming-soon-client.tsx`: noise texture, scanlines, running scan line, vignette, and floating background text. These are purely visual — no data dependencies.

```tsx
'use client';

import { useTransform, useScroll, motion } from 'framer-motion';
import FloatingParticles from '@/components/shared/FloatingParticles';

interface AtmosphericOverlaysProps {
  themeColor: string;
  particleCount?: number;
}

export default function AtmosphericOverlays({ themeColor, particleCount = 30 }: AtmosphericOverlaysProps) {
  const { scrollYProgress } = useScroll();
  const floatX = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const floatXReverse = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <>
      {/* Noise Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-[999] opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* Running Scan Line */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
        <div
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ animation: 'scan-line 8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
        />
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 vignette pointer-events-none z-10" />

      {/* Floating Background Text */}
      <motion.div
        className="fixed top-[15%] left-[1%] font-display text-[12vw] text-white/[0.02] pointer-events-none z-[1] whitespace-nowrap font-bold tracking-tight"
        style={{ x: floatX }}
      >
        • UNSTOPPABLE • RELENTLESS • UNBROKEN • UNDEFEATED •
      </motion.div>
      <motion.div
        className="fixed bottom-[15%] right-[-10%] font-display text-[12vw] text-white/[0.02] pointer-events-none z-[1] whitespace-nowrap font-bold tracking-tight"
        style={{ x: floatXReverse }}
      >
        • RECORD BREAKER • DARE2TRI • ADAPTIVE ATHLETE • ELITE •
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingParticles themeColor={themeColor} count={particleCount} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/persistent/AtmosphericOverlays.tsx
git commit -m "feat: add AtmosphericOverlays persistent component"
```

---

### Task 9: Create PersistentECG

**Files:**
- Create: `components/persistent/PersistentECG.tsx`

- [ ] **Step 1: Create the ECG component**

This is a NEW component (not extracted). It renders an ECG heartbeat line that:
- Lives in the left margin (desktop) or bottom edge (mobile)
- Syncs animation speed to resting heart rate from WhoopContext
- Accepts a `sectionState` prop that controls behavior (normal / dimming / flatline / expanding)

```tsx
'use client';

import { motion, useSpring } from 'framer-motion';
import { useWhoop, useHeartbeatDuration } from '@/contexts/WhoopContext';

type ECGState = 'normal' | 'dimming' | 'flatline' | 'recovering' | 'expanding' | 'calm';

interface PersistentECGProps {
  state: ECGState;
}

export default function PersistentECG({ state }: PersistentECGProps) {
  const heartbeatDuration = useHeartbeatDuration();

  const opacity = useSpring(state === 'dimming' || state === 'flatline' ? 0.05 : state === 'expanding' ? 0.4 : 0.15, {
    stiffness: 30,
    damping: 20,
  });

  const isFlat = state === 'flatline';
  const isExpanding = state === 'expanding';

  // ECG path: normal heartbeat vs flatline
  const ecgPath = isFlat
    ? 'M0,75 L1200,75' // straight line
    : 'M0,75 L100,75 L120,75 L140,20 L160,130 L180,40 L200,110 L220,75 L300,75 L320,75 L340,20 L360,130 L380,40 L400,110 L420,75 L500,75 L520,75 L540,20 L560,130 L580,40 L600,110 L620,75 L700,75 L720,75 L740,20 L760,130 L780,40 L800,110 L820,75 L900,75 L920,75 L940,20 L960,130 L980,40 L1000,110 L1020,75 L1100,75 L1120,75 L1140,20 L1160,130 L1180,40 L1200,110';

  const strokeColor = isFlat ? 'rgba(255, 50, 50, 0.4)' : state === 'recovering' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.6)';

  return (
    <motion.div
      className={`fixed left-0 w-full pointer-events-none z-20 ${isExpanding ? 'h-[200px]' : 'h-[100px]'}`}
      style={{
        opacity,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <svg
        className="absolute top-1/2 left-0 w-[200%] h-full -translate-y-1/2"
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        style={{
          animation: isFlat ? 'none' : `heartbeat-ecg ${heartbeatDuration * 2}s linear infinite`,
        }}
      >
        <path
          d={ecgPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isExpanding ? 3 : 2}
          style={{ filter: `drop-shadow(0 0 ${isExpanding ? 15 : 10}px ${strokeColor})` }}
        />
      </svg>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/persistent/PersistentECG.tsx
git commit -m "feat: add PersistentECG component with section-aware state"
```

---

### Task 10: Create JourneyLine

**Files:**
- Create: `components/persistent/JourneyLine.tsx`

- [ ] **Step 1: Create the component**

Enhanced version of the existing journey line from `page.full-site.tsx:42-84`, now with section-aware dimming.

```tsx
'use client';

import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';

interface JourneyLineProps {
  scrollProgress: MotionValue<number>;
  isDimmed: boolean;
}

export default function JourneyLine({ scrollProgress, isDimmed }: JourneyLineProps) {
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.0001,
  });

  const journeyLineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const glowIntensity = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [0.3, 0.6, 0.8, 0.6, 0.4]);

  return (
    <>
      {/* Journey line */}
      <motion.div
        className="fixed left-0 top-0 w-1.5 z-50 hidden lg:block"
        style={{
          height: journeyLineHeight,
          background: isDimmed
            ? 'rgba(255,255,255,0.1)'
            : 'linear-gradient(to bottom, rgba(249, 115, 22, 0.8), rgba(249, 115, 22, 1), rgba(234, 88, 12, 0.9))',
          boxShadow: useTransform(
            glowIntensity,
            (v) =>
              isDimmed
                ? 'none'
                : `0 0 ${20 * v}px rgba(249, 115, 22, ${v}), 0 0 ${40 * v}px rgba(249, 115, 22, ${v * 0.5})`,
          ),
          transition: 'background 1.5s ease',
        }}
      >
        {/* Pulsing orb */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: isDimmed ? [0.2, 0.3, 0.2] : [0.8, 1, 0.8],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            backgroundColor: isDimmed ? 'rgba(255,255,255,0.2)' : 'rgb(249, 115, 22)',
            boxShadow: isDimmed ? 'none' : '0 0 20px rgba(249, 115, 22, 0.8)',
          }}
        />
      </motion.div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/persistent/JourneyLine.tsx
git commit -m "feat: add JourneyLine persistent component with section-aware dimming"
```

---

### Task 11: Build check

- [ ] **Step 1: Run build to verify all new components compile**

```bash
npm run build
```

Expected: Clean build. No type errors.

- [ ] **Step 2: Commit any fixes**

---

## Chunk 3: Build Sections 1-3 (The Emotional Arc)

The first three sections form a tight narrative arc: cold open → fall → rebuild. They share the most complex biometric thread behavior (boot → dim → flatline → return).

### Task 12: Create ColdOpen (Section 1)

**Files:**
- Create: `components/sections/ColdOpen.tsx`

- [ ] **Step 1: Create the ColdOpen component**

Full-bleed hero with compressed boot sequence. Key elements:
- Full-viewport hero image with gradient scrim
- Boot HUD text (top-left, flickers in, fades to 10%)
- "LIFE IS HARD. BE HARDER." with GlitchText
- Bottom stats bar (Recovery, Strain, HRV, Resting HR)
- Scroll indicator after 5s idle

Uses `useWhoop()` for stats, `useVitality()` for theme. The boot sequence is timeline-based using `useEffect` with sequential `setTimeout` calls (0ms, 300ms, 500ms, 700ms, 800ms, 1200ms, 1500ms per spec timing).

See spec Section 01 for full detail. Reference `coming-soon-client.tsx` hero section (lines 869-1015) for parallax and stats bar patterns.

The component should NOT include the intro/boot overlay from the coming-soon page — the compressed boot is a visual enhancement ON the hero, not a blocking gate.

- [ ] **Step 2: Verify renders in isolation**

Temporarily import into `page.full-site.tsx` and verify it renders.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ColdOpen.tsx
git commit -m "feat: add ColdOpen section — full-bleed hero with HUD boot sequence"
```

---

### Task 13: Create TheFall (Section 2)

**Files:**
- Create: `components/sections/TheFall.tsx`

- [ ] **Step 1: Create the component**

Text-driven dark section. Key elements:
- Three date blocks that fade in via `whileInView` with generous spacing between them
- Dates in massive Bebas Neue, supporting copy in tracked mono
- No orange — all whites/grays
- Negative space block after the accident date
- "SIGNAL RECOVERED" / "HEARTBEAT DETECTED..." transition text at bottom

No WHOOP data used. No images. This is the simplest section structurally but the most impactful emotionally.

Copy directly from spec Section 02 content sequence.

- [ ] **Step 2: Commit**

```bash
git add components/sections/TheFall.tsx
git commit -m "feat: add TheFall section — date stamps in darkness"
```

---

### Task 14: Create TheRebuild (Section 3)

**Files:**
- Create: `components/sections/TheRebuild.tsx`

- [ ] **Step 1: Create the component**

Orange returns. Key elements:
- Opening headline: "THEY SAID IT WAS IMPOSSIBLE. THEY WERE WRONG."
- Alternating split-screen blocks (image/text, text/image)
- Prosthetic reveal: full-width, scroll-driven grayscale→color with 3D rotateY, tech overlay cards
- Dare2Tri discovery block
- AnimatedCounter section (Days Since Accident / Sober / Until Next Race)

Uses `useVitality()` for theme. Date constants same as coming-soon: `ACCIDENT_DATE`, `SOBRIETY_DATE`, `NEXT_RACE_DATE`.

The prosthetic reveal uses Framer Motion `useScroll` with a `target` ref for scroll-driven transforms:
- `rotateY`: `useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, 0])`
- `filter` (grayscale): `useTransform(scrollYProgress, [0, 0.5], ['grayscale(100%)', 'grayscale(0%)'])`
- Pulsing border glow: `animate={{ boxShadow: [...] }}` with 3s infinite cycle

- [ ] **Step 2: Commit**

```bash
git add components/sections/TheRebuild.tsx
git commit -m "feat: add TheRebuild section — prosthetic reveal and counters"
```

---

### Task 15: Create race-data.ts

**Files:**
- Create: `lib/race-data.ts`

- [ ] **Step 1: Create the data file**

```tsx
export interface Race {
  date: string;       // ISO date string
  name: string;
  location: string;
  type: 'triathlon' | 'running';
  isTarget?: boolean; // USA Nationals
  result?: string;    // e.g., "3rd Place" — added after race completes
}

export const RACES_2026: Race[] = [
  { date: '2026-04-11', name: 'AlphaWin Napa Valley Triathlon', location: 'CA State Championship', type: 'triathlon' },
  { date: '2026-06-07', name: "Leon's Triathlon", location: 'Hammond, IN', type: 'triathlon' },
  { date: '2026-06-19', name: 'SuperTri Long Beach Legacy Triathlon', location: 'Long Beach, CA', type: 'triathlon' },
  { date: '2026-06-28', name: 'Pleasant Prairie Triathlon', location: 'Pleasant Prairie, WI', type: 'triathlon' },
  { date: '2026-07-26', name: 'San Francisco Marathon', location: 'San Francisco, CA', type: 'running' },
  { date: '2026-08-09', name: 'USA Para Triathlon National Championships', location: 'Milwaukee, WI', type: 'triathlon', isTarget: true },
  { date: '2026-08-23', name: 'SuperTri Chicago Triathlon', location: 'IL State Championship', type: 'triathlon' },
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/race-data.ts
git commit -m "feat: add race calendar data and date utility functions"
```

---

## Chunk 4: Build Sections 4-5 (The Technical Showcase)

### Task 16: Create TheProof (Section 4 — Bhutan)

**Files:**
- Create: `components/sections/TheProof.tsx`

- [ ] **Step 1: Create the component**

The most technically complex section. Two parts:

**Part 1 — Vertical intro:**
- "OCTOBER 2022. BHUTAN." in massive Bebas Neue
- Stats appear one line at a time via `whileInView` stagger

**Part 2 — Horizontal scroll:**
- Container height: `300vh`
- `useScroll` with `target` ref on the container
- `useTransform` maps `scrollYProgress` to horizontal `x` translation
- 6 journey panels (content from spec Bhutan Panel Content table)
- Fixed telemetry overlay: altitude, temperature, day — all driven by `useTransform` on scroll progress
- Mountain profile SVG: inline `<svg>` with `<path>` representing elevation. Orange dot position driven by `useTransform`
- Progress bar: width driven by `useTransform`

Telemetry values mapped to scroll progress:
```tsx
const altitude = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1], [8200, 9800, 12500, 14000, 9500, 8000, 8000]);
const temperature = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1], [62, 55, 42, 32, 50, 60, 60]);
const day = useTransform(scrollYProgress, [0, 1], [1, 29]);
```

**Data bursts:** At panels 4 and 6 (scroll progress ~0.55 and ~0.9), additional data cards animate in.

**Mobile:** On screens ≤768px, skip horizontal scroll — render panels as a vertical card stack with telemetry inline between cards.

- [ ] **Step 2: Commit**

```bash
git add components/sections/TheProof.tsx
git commit -m "feat: add TheProof section — Bhutan horizontal scroll with telemetry"
```

---

### Task 17: Create TheMachine (Section 5 — Biometrics)

**Files:**
- Create: `components/sections/TheMachine.tsx`

- [ ] **Step 1: Create the component**

WHOOP biometric dashboard. Key elements:
- Section header with live/demo dot and date
- Recovery hero metric (large, centered, color-coded)
- BiometricCard grid (reuse shared component): Strain, Resting HR, HRV, Calories, Avg HR
- Last workout card
- "POWERED BY WHOOP" footer

Uses `useWhoop()` for all data. Uses `useVitality()` for theme color on non-recovery cards.

Recovery color logic:
```tsx
const recoveryColor = recovery >= 67 ? '#00e676' : recovery >= 34 ? '#ffab00' : '#ff5252';
```

Loading state: Recovery hero shows "—" with shimmer animation until data loads. Cards show skeleton state (pulse animation on gray backgrounds). If demo mode, data populates immediately.

Reference the biometrics section of `coming-soon-client.tsx:1253-1428` for the card configuration array pattern.

- [ ] **Step 2: Commit**

```bash
git add components/sections/TheMachine.tsx
git commit -m "feat: add TheMachine section — WHOOP biometric dashboard"
```

---

## Chunk 5: Build Sections 6-8 (The Conversion Funnel)

### Task 18: Create TheMission (Section 6)

**Files:**
- Create: `components/sections/TheMission.tsx` (rewrite of existing)

- [ ] **Step 1: Create the component**

Two-part section:
- Part 1: Dare2Tri context — split layout, team photo placeholder + narrative
- Part 2: Race calendar grid — uses `RACES_2026` from `lib/race-data.ts`

Race card rendering:
- `getNextRace()` determines which card gets "NEXT — XX DAYS" badge
- Nationals card (`.isTarget`) spans 2 columns with "THE TARGET" badge
- Separate sub-grids for triathlon and running
- Past races (date < today) show result badge if `race.result` exists, otherwise "COMPLETED"

- [ ] **Step 2: Commit**

```bash
git add components/sections/TheMission.tsx
git commit -m "feat: rewrite TheMission section — Dare2Tri context and race calendar"
```

---

### Task 19: Create TheAsk (Section 7)

**Files:**
- Create: `components/sections/TheAsk.tsx`

- [ ] **Step 1: Create the component**

Two-path CTA + email + sponsors. Key elements:
- "FUEL THE MISSION." headline with "YOU'VE SEEN THE STORY" subhead
- Two CTA cards side by side (stack on mobile):
  - Dare2Tri: filled orange button → links to `https://give.dare2tri.org/fundraiser/6928347`
  - Sponsor Patrick: outlined white button → `mailto:` or contact link
- Sponsor logos: ATF, CAF, David Rotter (images from `/public/sponsors/`)
- EmailCapture component (reuse shared)
- SocialLinks component (reuse shared)

- [ ] **Step 2: Commit**

```bash
git add components/sections/TheAsk.tsx
git commit -m "feat: add TheAsk section — two-path CTA with email capture"
```

---

### Task 20: Create SiteFooter (Section 8)

**Files:**
- Create: `components/sections/SiteFooter.tsx`

- [ ] **Step 1: Create the component**

Minimal footer:
- ECG heartbeat line across top (thin, 0.3 opacity, using the `heartbeat-ecg` CSS animation)
- "PATRICK WINGERT" left, Dare2Tri logo right
- "BUILT WITH WHOOP DATA" centered in 9px mono

Uses `useHeartbeatDuration()` for ECG animation speed.

```tsx
'use client';

import Image from 'next/image';
import { useHeartbeatDuration } from '@/contexts/WhoopContext';

export default function SiteFooter() {
  const heartbeatDuration = useHeartbeatDuration();

  return (
    <footer className="relative z-20 py-8 px-6 border-t border-white/5 bg-black">
      {/* ECG farewell line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden opacity-30">
        <svg className="absolute top-0 left-0 w-[200%] h-[2px]" viewBox="0 0 1200 4" preserveAspectRatio="none"
          style={{ animation: `heartbeat-ecg ${heartbeatDuration * 2}s linear infinite` }}>
          <path d="M0,2 L100,2 L140,0 L160,4 L180,1 L200,3 L220,2 L300,2 L340,0 L360,4 L380,1 L400,3 L420,2 L500,2 L540,0 L560,4 L580,1 L600,3 L620,2 L700,2 L740,0 L760,4 L780,1 L800,3 L820,2 L900,2 L940,0 L960,4 L980,1 L1000,3 L1020,2 L1100,2 L1140,0 L1160,4 L1180,1 L1200,3"
            fill="none" stroke="rgba(249,115,22,0.6)" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto flex flex-row justify-between items-center gap-4">
        <span className="font-display text-base tracking-[0.2em] text-white/60">PATRICK WINGERT</span>
        <span className="font-mono text-[9px] tracking-[0.2em] text-white/20">BUILT WITH WHOOP DATA</span>
        <a href="https://dare2tri.org/" target="_blank" rel="noopener noreferrer"
           className="flex items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <Image src="/sponsors/D2T_logo_short.webp" alt="Dare2Tri" width={120} height={40} className="object-contain" />
        </a>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/SiteFooter.tsx
git commit -m "feat: add SiteFooter with ECG farewell line"
```

---

## Chunk 6: Page Orchestration and Cleanup

### Task 21: Rewrite page.full-site.tsx

**Files:**
- Modify: `app/page.full-site.tsx`

- [ ] **Step 1: Rewrite the page orchestrator**

This is the main composition file. It:
1. Creates a container ref and `useScroll` for overall scroll progress
2. Tracks which section is active (for ECG and journey line state)
3. Renders persistent layers (AtmosphericOverlays, PersistentECG, JourneyLine, CustomCursor)
4. Renders all 8 sections in order
5. Injects the glitch keyframes CSS

Section tracking: use `useScroll` with section refs and `useTransform` to determine active section index. Map section index to ECG state:
- S1 (Cold Open): `'normal'`
- S2 (The Fall): `'dimming'` → `'flatline'` at midpoint
- S3 (The Rebuild): `'recovering'` → `'normal'`
- S4 (The Proof): `'normal'`
- S5 (The Machine): `'expanding'`
- S6-S8: `'calm'`

Journey line: `isDimmed` when section index is 1 (S2).

Mouse tracking for cursor: single `onMouseMove` handler on container.

Parallax springs: same `mouseX`/`mouseY` springs from coming-soon page for 3D parallax layers.

- [ ] **Step 2: Verify full page renders**

```bash
npm run dev
```

Navigate to localhost:3000. Verify all 8 sections render in order. Scroll through entire page. Check:
- Boot HUD animates on load
- ECG dims/flatlines in S2
- Orange returns in S3
- Horizontal scroll works in S4
- Biometrics load in S5
- Race calendar renders in S6
- CTAs clickable in S7
- Footer renders with ECG line

- [ ] **Step 3: Commit**

```bash
git add app/page.full-site.tsx
git commit -m "feat: rewrite page orchestrator with all 8 sections and persistent layers"
```

---

### Task 22: Delete old section components

**Files:**
- Delete: `components/sections/HeroSection.tsx`
- Delete: `components/sections/TheShift.tsx`
- Delete: `components/sections/ProstheticReveal.tsx`
- Delete: `components/sections/ByTheNumbers.tsx`
- Delete: `components/sections/BhutanJourney.tsx`
- Delete: `components/sections/LiveStats.tsx`
- Delete: `components/sections/InstagramFeed.tsx`
- Delete: `components/sections/SupportCTA.tsx`

- [ ] **Step 1: Delete old files**

```bash
git rm components/sections/HeroSection.tsx components/sections/TheShift.tsx components/sections/ProstheticReveal.tsx components/sections/ByTheNumbers.tsx components/sections/BhutanJourney.tsx components/sections/LiveStats.tsx components/sections/InstagramFeed.tsx components/sections/SupportCTA.tsx
```

- [ ] **Step 2: Verify no broken imports**

```bash
npm run build
```

Expected: Clean build. No references to deleted files remain.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove old placeholder section components"
```

---

### Task 23: Final build and lint

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Fix any lint errors.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Clean build with no errors or warnings.

- [ ] **Step 3: Visual QA walkthrough**

Run `npm run dev` and do a full scroll-through. Checklist:
- [ ] S1: Hero loads, boot HUD flickers, stats populate
- [ ] S1: "LIFE IS HARD. BE HARDER." renders with glitch effect
- [ ] S1→S2: Stats bar fades out, ECG slows
- [ ] S2: Date stamps appear on scroll, clinical tone
- [ ] S2: ECG flatlines at accident date
- [ ] S2: Negative space feels heavy
- [ ] S2→S3: "SIGNAL RECOVERED" text, orange glow returns
- [ ] S3: "THEY SAID IT WAS IMPOSSIBLE" headline
- [ ] S3: Prosthetic reveal animates (grayscale → color, 3D rotation)
- [ ] S3: Counters animate on scroll
- [ ] S4: Bhutan intro renders, stats appear one by one
- [ ] S4: Horizontal scroll works, panels slide
- [ ] S4: Telemetry overlay updates (altitude, temp, day)
- [ ] S4: Mountain profile tracks position
- [ ] S5: Recovery hero renders with correct color
- [ ] S5: Biometric cards populate
- [ ] S5: Tooltips work on cards
- [ ] S6: Dare2Tri context renders
- [ ] S6: Race calendar shows, next race highlighted
- [ ] S6: Nationals card is prominent
- [ ] S7: Two CTA paths render
- [ ] S7: Email form submits correctly
- [ ] S7: Sponsor logos visible
- [ ] S8: Footer with ECG line renders
- [ ] Persistent: Journey line tracks scroll
- [ ] Persistent: Custom cursor works (desktop)
- [ ] Persistent: Atmospheric overlays visible
- [ ] Mobile: Check 375px viewport for all sections

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete full site implementation — 8-section cinematic documentary"
```
