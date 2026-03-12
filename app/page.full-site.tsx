'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useScroll } from 'framer-motion';
import { useVitality } from '@/contexts/VitalityContext';

// Sections
import ColdOpen from '@/components/sections/ColdOpen';
import TheFall from '@/components/sections/TheFall';
import TheRebuild from '@/components/sections/TheRebuild';
import TheProof from '@/components/sections/TheProof';
import TheMachine from '@/components/sections/TheMachine';
import TheMission from '@/components/sections/TheMission';
import TheAsk from '@/components/sections/TheAsk';
import SiteFooter from '@/components/sections/SiteFooter';

// Persistent layers
import AtmosphericOverlays from '@/components/persistent/AtmosphericOverlays';
import PersistentECG from '@/components/persistent/PersistentECG';
import JourneyLine from '@/components/persistent/JourneyLine';
import CustomCursor from '@/components/shared/CustomCursor';

type ECGState = 'normal' | 'dimming' | 'flatline' | 'recovering' | 'expanding' | 'calm';

export default function FullSite() {
  const { theme } = useVitality();
  const themeColor = theme.primaryColor;

  // Container for scroll tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Section refs for tracking active section
  const s1Ref = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);
  const s4Ref = useRef<HTMLDivElement>(null);
  const s5Ref = useRef<HTMLDivElement>(null);

  // ECG state — driven by scroll position
  const [ecgState, setEcgState] = useState<ECGState>('normal');
  const [journeyDimmed, setJourneyDimmed] = useState(false);

  // Track active section via scroll observation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const ratio = entry.intersectionRatio;

          if (entry.target === s1Ref.current && ratio > 0.3) {
            setEcgState('normal');
            setJourneyDimmed(false);
          } else if (entry.target === s2Ref.current) {
            if (ratio > 0.6) {
              setEcgState('flatline');
            } else if (ratio > 0.2) {
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

  // Mouse tracking for cursor
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#050505] text-white overflow-x-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      {/* Glitch keyframes + selection color */}
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
          0% { transform: translateX(0) translateY(-50%); }
          100% { transform: translateX(-50%) translateY(-50%); }
        }
        ::selection { background-color: ${themeColor}4D; }
      `}</style>

      {/* === PERSISTENT LAYERS === */}
      <CustomCursor themeColor={themeColor} isHovering={isHovering} mousePosition={mousePosition} />
      <AtmosphericOverlays themeColor={themeColor} />
      <PersistentECG state={ecgState} />
      <JourneyLine scrollProgress={scrollYProgress} isDimmed={journeyDimmed} />

      {/* === SECTIONS === */}
      <div ref={s1Ref}>
        <ColdOpen />
      </div>

      {/* Cinematic negative space before The Fall */}
      <div className="h-[20vh]" />

      <div ref={s2Ref}>
        <TheFall />
      </div>

      <div ref={s3Ref}>
        <TheRebuild />
      </div>

      {/* Breathing room before Bhutan */}
      <div className="h-[15vh]" />

      <div ref={s4Ref}>
        <TheProof />
      </div>

      {/* Transition space before biometrics */}
      <div className="h-[10vh]" />

      <div ref={s5Ref}>
        <TheMachine />
      </div>

      {/* Standard spacing */}
      <div className="h-[15vh]" />

      <TheMission />

      {/* Minimal spacing before the ask */}
      <div className="h-[10vh]" />

      <TheAsk />

      <SiteFooter />
    </div>
  );
}
