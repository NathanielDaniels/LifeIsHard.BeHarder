'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useWhoop, useHeartbeatDuration } from '@/contexts/WhoopContext';
import { useVitality } from '@/contexts/VitalityContext';
import GlitchText from '@/components/shared/GlitchText';

// ============================================
// COLDOPEN (Section 1)
// Full-bleed cinematic hero with compressed boot sequence
// ============================================

export default function ColdOpen() {
  const { stats: whoopStats, currentHeartRate } = useWhoop();
  const { theme } = useVitality();
  const heartbeatDuration = useHeartbeatDuration();

  // Boot sequence phases:
  // 0: loading
  // 1: image visible (desaturated)
  // 2: HUD typing
  // 3: saturating
  // 4: stats appearing
  // 5: complete
  const [bootPhase, setBootPhase] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);

  // Boot sequence timeline
  useEffect(() => {
    const sequence = [
      { phase: 1, delay: 0 },      // 0.0s - Image appears
      { phase: 2, delay: 0 },      // 0.0s - Boot text starts typing
      { phase: 3, delay: 500 },    // 0.5s - Begin saturating
      { phase: 4, delay: 800 },    // 0.8s - Stats bar slides up
      { phase: 5, delay: 1200 },   // 1.2s - Boot complete
    ];

    const timers = sequence.map(({ phase, delay }) =>
      setTimeout(() => setBootPhase(phase), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Scroll indicator appears after 5s idle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (bootPhase >= 5) setShowScrollHint(true);
    }, 5000);

    const onScroll = () => {
      setShowScrollHint(false);
      window.removeEventListener('scroll', onScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [bootPhase]);

  const themeColor = theme.primaryColor;

  // Recovery color logic
  const getRecoveryColor = (recovery: number | null) => {
    if (recovery === null) return themeColor;
    if (recovery >= 67) return '#00e676'; // green
    if (recovery >= 34) return '#ffab00'; // yellow
    return '#ff5252'; // red
  };

  const recoveryColor = getRecoveryColor(whoopStats.recovery);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Image - Full Bleed */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0, filter: 'brightness(0.7) saturate(0)' }}
          animate={
            bootPhase >= 1
              ? {
                  opacity: 1,
                  filter:
                    bootPhase >= 3
                      ? 'brightness(0.7) saturate(1)'
                      : 'brightness(0.7) saturate(0)',
                }
              : {}
          }
          transition={{ duration: bootPhase >= 3 ? 0.5 : 0, ease: 'easeOut' }}
          className="relative w-full h-full"
        >
          <Image
            src="/pat-run.jpg"
            alt="Patrick Wingert - Mid-Race"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </motion.div>

        {/* Gradient scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
      </div>

      {/* Boot HUD - Top Left - Hidden on mobile */}
      <AnimatePresence>
        {bootPhase >= 2 && bootPhase < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: bootPhase >= 3 ? 0.1 : 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 left-8 font-mono text-xs md:text-sm text-white/60 tracking-widest flex flex-col gap-2 z-20 hidden md:flex"
          >
            {[
              { text: '> INIT VITALITY ENGINE v2.1', delay: 0 },
              { text: '> LOCATING BIOMETRIC FEED...', delay: 0.15 },
              { text: '> SIGNAL ACQUIRED', delay: 0.3 },
            ].map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: line.delay, duration: 0.3 }}
              >
                {line.text}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content - Centered */}
      <div className="relative z-30 text-center px-6 max-w-7xl mx-auto">
        {/* Eyebrow - Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={bootPhase >= 4 ? { opacity: 0.4, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <h2 className="font-mono text-sm md:text-base tracking-[0.5em] text-white uppercase">
            PATRICK WINGERT
          </h2>
        </motion.div>

        {/* Main Title */}
        <AnimatePresence>
          {bootPhase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 100, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display font-bold leading-[0.85] tracking-tight">
                <span className="block text-[clamp(4rem,12vw,11rem)] text-white drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)]">
                  LIFE IS HARD.
                </span>
                <span className="block text-[clamp(4rem,12vw,11rem)]">
                  <GlitchText text="BE HARDER." themeColor={themeColor} />
                </span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={bootPhase >= 4 ? { opacity: 0.35, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-8 font-mono text-[clamp(0.65rem,1.5vw,0.85rem)] tracking-[0.5em] text-white uppercase"
        >
          ADAPTIVE ATHLETE • DARE2TRI ELITE TEAM
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {showScrollHint && bootPhase >= 5 && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 z-30"
          >
            <span className="font-mono text-[0.7rem] tracking-[0.3em] text-white/50">
              SCROLL
            </span>
            <div
              className="w-[1.5px] h-12 bg-gradient-to-b to-transparent"
              style={{
                background: `linear-gradient(to bottom, ${themeColor}, transparent)`,
                animation: 'scroll-pulse 2s ease-in-out infinite',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={bootPhase >= 4 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 px-6 md:px-12 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 border-t border-white/5 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm z-40"
      >
        {/* Heart Rate - Left */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0">
            <motion.svg
              viewBox="0 0 24 24"
              className="w-full h-full"
              style={{ fill: themeColor }}
              animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
              transition={{
                duration: heartbeatDuration,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.65rem] md:text-[0.7rem] font-mono tracking-[0.3em] text-white/60">
              LIVE HEART RATE
            </span>
            <span
              className="font-display text-3xl md:text-4xl font-bold"
              style={{ color: themeColor }}
            >
              {currentHeartRate}{' '}
              <span className="text-sm font-mono text-white/50">BPM</span>
            </span>
          </div>
        </div>

        {/* Stats - Right - Desktop: All 4, Mobile: Recovery + Strain */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Recovery */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={bootPhase >= 4 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <span className="text-[0.6rem] md:text-[0.65rem] font-mono tracking-[0.25em] text-white/50">
              RECOVERY
            </span>
            <span
              className="font-display text-2xl md:text-3xl font-bold"
              style={{ color: recoveryColor }}
            >
              {whoopStats.recovery !== null ? `${whoopStats.recovery}%` : '—'}
            </span>
          </motion.div>

          {/* Strain */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={bootPhase >= 4 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-[0.6rem] md:text-[0.65rem] font-mono tracking-[0.25em] text-white/50">
              STRAIN
            </span>
            <span
              className="font-display text-2xl md:text-3xl font-bold"
              style={{ color: themeColor }}
            >
              {whoopStats.strain !== null
                ? whoopStats.strain.toFixed(1)
                : '—'}
            </span>
          </motion.div>

          {/* HRV - Desktop Only */}
          {whoopStats.hrv !== null && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={bootPhase >= 4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:flex flex-col items-center"
            >
              <span className="text-[0.6rem] md:text-[0.65rem] font-mono tracking-[0.25em] text-white/50">
                HRV
              </span>
              <span
                className="font-display text-2xl md:text-3xl font-bold"
                style={{ color: themeColor }}
              >
                {Math.round(whoopStats.hrv)}
                <span className="text-sm font-mono text-white/40">ms</span>
              </span>
            </motion.div>
          )}

          {/* Resting HR - Desktop Only */}
          {whoopStats.restingHeartRate !== null && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={bootPhase >= 4 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden md:flex flex-col items-center"
            >
              <span className="text-[0.6rem] md:text-[0.65rem] font-mono tracking-[0.25em] text-white/50">
                RESTING HR
              </span>
              <span
                className="font-display text-2xl md:text-3xl font-bold"
                style={{ color: themeColor }}
              >
                {whoopStats.restingHeartRate}
                <span className="text-sm font-mono text-white/40">BPM</span>
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Inline keyframe for scroll pulse */}
      <style jsx>{`
        @keyframes scroll-pulse {
          0%,
          100% {
            opacity: 0.3;
            height: 48px;
          }
          50% {
            opacity: 1;
            height: 60px;
          }
        }
      `}</style>
    </section>
  );
}
