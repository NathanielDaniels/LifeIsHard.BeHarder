'use client';

import { useRef, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { useVitality } from '@/contexts/VitalityContext';

import ColdOpen from '@/components/sections/ColdOpen';
import TheFall from '@/components/sections/TheFall';
import TheRebuild from '@/components/sections/TheRebuild';
import TheProof from '@/components/sections/TheProof';
import TheMachine from '@/components/sections/TheMachine';
import TheMission from '@/components/sections/TheMission';
import TheAsk from '@/components/sections/TheAsk';
import SiteFooter from '@/components/sections/SiteFooter';
import AtmosphericOverlays from '@/components/persistent/AtmosphericOverlays';
import PersistentECG from '@/components/persistent/PersistentECG';
import JourneyLine from '@/components/persistent/JourneyLine';
import CustomCursor from '@/components/shared/CustomCursor';

type ECGState = 'normal' | 'dimming' | 'flatline' | 'recovering' | 'expanding' | 'calm';

export default function FullSite() {
  const { theme } = useVitality();
  const themeColor = theme.primaryColor;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const s1Ref = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);
  const s4Ref = useRef<HTMLDivElement>(null);
  const s5Ref = useRef<HTMLDivElement>(null);

  const [ecgState, setEcgState] = useState<ECGState>('normal');
  const [journeyDimmed, setJourneyDimmed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const ratio = entry.intersectionRatio;

          if (entry.target === s1Ref.current && ratio > 0.3) {
            setEcgState('normal');
            setJourneyDimmed(false);
          } else if (entry.target === s2Ref.current && ratio > 0.3) {
            if (ratio > 0.6) {
              setEcgState('flatline');
            } else {
              setEcgState('dimming');
            }
            setJourneyDimmed(true);
          } else if (entry.target === s3Ref.current && ratio > 0.2) {
            setEcgState(ratio > 0.5 ? 'normal' : 'recovering');
            setJourneyDimmed(false);
          } else if (entry.target === s4Ref.current && ratio > 0.2) {
            setEcgState('normal');
            setJourneyDimmed(false);
          } else if (entry.target === s5Ref.current && ratio > 0.3) {
            setEcgState('expanding');
            setJourneyDimmed(false);
          }
        });
      },
      {
        threshold: [0, 0.2, 0.3, 0.5, 0.6, 0.8, 1],
      }
    );

    const refs = [s1Ref, s2Ref, s3Ref, s4Ref, s5Ref];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // ::-webkit-scrollbar pseudo-elements don't support CSS transitions,
  // so we interpolate via RAF and inject a <style> each frame.
  const scrollbarProgress = useRef(0);
  const scrollbarRaf = useRef<number>(0);

  useEffect(() => {
    const id = 'dynamic-scrollbar';
    let styleEl = document.getElementById(id) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = id;
      document.head.appendChild(styleEl);
    }

    const target = journeyDimmed ? 1 : 0;
    const duration = 700; // ms, matches cursor transition
    const startTime = performance.now();
    const startVal = scrollbarProgress.current;

    const lerpChannel = (a: number, b: number, t: number) =>
      Math.round(a + (b - a) * t);

    const lerpColor = (hexA: string, hexB: string, t: number) => {
      const a = parseInt(hexA.slice(1), 16);
      const b = parseInt(hexB.slice(1), 16);
      const r = lerpChannel((a >> 16) & 0xff, (b >> 16) & 0xff, t);
      const g = lerpChannel((a >> 8) & 0xff, (b >> 8) & 0xff, t);
      const bl = lerpChannel(a & 0xff, b & 0xff, t);
      return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
    };

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / duration, 1);
      const t = rawT < 0.5 ? 2 * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 2) / 2;
      const p = startVal + (target - startVal) * t;
      scrollbarProgress.current = p;

      const thumbTop = lerpColor('#f97316', '#333333', p);
      const thumbBot = lerpColor('#ea580c', '#222222', p);
      const hoverTop = lerpColor('#fb923c', '#444444', p);
      const hoverBot = lerpColor('#f97316', '#333333', p);

      if (styleEl) {
        styleEl.textContent = `
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${thumbTop} 0%, ${thumbBot} 100%) !important;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, ${hoverTop} 0%, ${hoverBot} 100%) !important;
          }
        `;
      }

      if (rawT < 1) {
        scrollbarRaf.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(scrollbarRaf.current);
    scrollbarRaf.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(scrollbarRaf.current);
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [journeyDimmed]);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#050505] text-white cursor-crosshair"
      style={{ overflowX: 'clip', '--theme-color': themeColor } as React.CSSProperties}
    >
      <style>{`
        @keyframes glitch-1 {
          0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          92% { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 0); }
          94% { clip-path: inset(60% 0 10% 0); transform: translate(4px, 0); }
          96% { clip-path: inset(40% 0 30% 0); transform: translate(-2px, 0); }
          98% { clip-path: inset(10% 0 70% 0); transform: translate(2px, 0); }
        }
        @keyframes glitch-2 {
          0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          92% { clip-path: inset(70% 0 5% 0); transform: translate(4px, 0); }
          94% { clip-path: inset(5% 0 80% 0); transform: translate(-4px, 0); }
          96% { clip-path: inset(50% 0 20% 0); transform: translate(3px, 0); }
          98% { clip-path: inset(30% 0 50% 0); transform: translate(-3px, 0); }
        }
        @keyframes heartbeat-ecg {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        ::selection { background-color: ${themeColor}4D; }
      `}</style>

      <CustomCursor themeColor={themeColor} isDimmed={journeyDimmed} />
      <AtmosphericOverlays themeColor={themeColor} scrollProgress={scrollYProgress} />
      <PersistentECG state={ecgState} />
      <JourneyLine scrollProgress={scrollYProgress} isDimmed={journeyDimmed} />

      <div ref={s1Ref}>
        <ColdOpen />
      </div>

      <div className="h-[20vh]" />

      <div ref={s2Ref}>
        <TheFall />
      </div>

      <div ref={s3Ref}>
        <TheRebuild />
      </div>

      <div className="h-[15vh]" />

      <div ref={s4Ref}>
        <TheProof />
      </div>

      <div className="h-[10vh]" />

      <div ref={s5Ref}>
        <TheMachine />
      </div>

      <div className="h-[15vh]" />

      <TheMission />

      <div className="h-[10vh]" />

      <TheAsk />

      <SiteFooter />
    </div>
  );
}
