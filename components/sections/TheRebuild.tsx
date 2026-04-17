'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useVitality } from '@/contexts/VitalityContext';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { KEY_DATES, getNextRace, getDaysSince, getDaysUntil } from '@/lib/race-data';

// Three.js cannot run in SSR
const ProstheticScene = dynamic(() => import('@/components/shared/ProstheticScene'), { ssr: false });

export default function TheRebuild() {
  const { theme } = useVitality();
  const prostheticRef = useRef<HTMLDivElement>(null);
  const [countersTriggered, setCountersTriggered] = useState(false);

  const { scrollYProgress: prostheticScroll } = useScroll({
    target: prostheticRef,
    offset: ['start end', 'end start'],
  });

  const techOverlayOpacity = useTransform(prostheticScroll, [0.3, 0.6], [0, 1]);

  const daysSinceAccident = getDaysSince(KEY_DATES.accident);
  const daysSober = getDaysSince(KEY_DATES.sobriety);
  const nextRace = getNextRace();
  const daysUntilNextRace = nextRace ? getDaysUntil(new Date(nextRace.date)) : 0;

  return (
    <section className="relative z-20 bg-black">
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="max-w-5xl"
        >
          <h2
            className="font-display text-[clamp(3rem,10vw,8rem)] font-bold leading-none text-center"
            style={{ color: theme.primaryColor }}
          >
            THEY SAID IT WAS IMPOSSIBLE.
          </h2>
          <h2
            className="font-display text-[clamp(3rem,10vw,8rem)] font-bold leading-none text-center mt-4"
            style={{ color: theme.primaryColor }}
          >
            THEY WERE WRONG.
          </h2>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative aspect-[2/3] overflow-hidden"
          >
            <Image
              src="/pat-crop.webp"
              alt="Patrick Wingert with prosthetic"
              fill
              className="object-cover object-top"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${theme.primaryColor}20 0%, transparent 50%)`,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h3
              className="font-display text-[clamp(2rem,6vw,4rem)] font-bold leading-none mb-6"
              style={{ color: theme.primaryColor }}
            >
              NOT A REPLACEMENT. AN UPGRADE.
            </h3>
            <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/80 leading-relaxed mb-4">
              Carbon fiber. Titanium. Engineering that doesn't just restore function. It amplifies it.
            </p>
            <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/80 leading-relaxed mb-4">
              This isn't about getting back to who he was. It's about becoming someone better.
            </p>
            <p className="font-mono text-xs tracking-[0.2em] text-white/60 mt-8">
              PROSTHETIST: DAVID ROTTER
            </p>
          </motion.div>
        </div>
      </div>

      <div ref={prostheticRef} className="relative py-16 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative aspect-square md:aspect-[16/10]">
            <ProstheticScene
              scrollProgress={prostheticScroll}
              themeColor={theme.primaryColor}
            />

            <motion.div
              className="absolute top-6 left-6 md:top-8 md:left-8 bg-black/90 border px-4 py-3 pointer-events-none"
              style={{
                borderColor: theme.primaryColor,
                opacity: techOverlayOpacity,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <p className="font-mono text-xs tracking-[0.3em]" style={{ color: theme.primaryColor }}>
                  PROSTHETIC SYSTEM // ACTIVE
                </p>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-black/90 border px-4 py-3 pointer-events-none"
              style={{
                borderColor: theme.primaryColor,
                opacity: techOverlayOpacity,
              }}
            >
              <p className="font-mono text-xs tracking-[0.2em] text-white/80 mb-2">
                MATERIAL SPEC
              </p>
              <p className="font-mono text-xs tracking-[0.15em] text-white/80">
                Carbon Fiber Frame
              </p>
              <p className="font-mono text-xs tracking-[0.15em] text-white/80">
                Titanium Components
              </p>
              <p className="font-mono text-xs tracking-[0.15em] text-white/80">
                Dynamic Response System
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="order-2 md:order-1"
          >
            <h3
              className="font-display text-[clamp(2rem,6vw,4rem)] font-bold leading-none mb-6"
              style={{ color: theme.primaryColor }}
            >
              SOMEONE SAID 'TRY THIS.'
            </h3>
            <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/80 leading-relaxed mb-4">
              Keri introduced him to adaptive sports. First session at Dare2Tri.
            </p>
            <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/80 leading-relaxed mb-4">
              The catalyst. The spark. The moment everything changed direction.
            </p>
            <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/80 leading-relaxed">
              Patient became athlete.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative aspect-[4/5] overflow-hidden order-1 md:order-2"
          >
            <Image
              src="/Pat_D2T.webp"
              alt="Patrick at Dare2Tri"
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${theme.primaryColor}20 0%, transparent 50%)`,
              }}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        onViewportEnter={() => setCountersTriggered(true)}
        transition={{ duration: 1.5 }}
        className="max-w-6xl mx-auto px-6 py-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <div
              className="font-display text-[clamp(4rem,12vw,8rem)] font-bold leading-none mb-4"
              style={{ color: theme.primaryColor }}
            >
              {countersTriggered && <AnimatedCounter value={daysSinceAccident} duration={2000} />}
            </div>
            <p className="font-mono text-xs tracking-[0.3em] text-white/80">
              DAYS SINCE ACCIDENT
            </p>
            <p className="font-mono text-xs tracking-[0.15em] text-white/60 mt-2">
              November 1, 2020
            </p>
          </div>

          <div className="text-center">
            <div
              className="font-display text-[clamp(4rem,12vw,8rem)] font-bold leading-none mb-4"
              style={{ color: theme.primaryColor }}
            >
              {countersTriggered && <AnimatedCounter value={daysSober} duration={2000} />}
            </div>
            <p className="font-mono text-xs tracking-[0.3em] text-white/80">
              DAYS SOBER
            </p>
            <p className="font-mono text-xs tracking-[0.15em] text-white/60 mt-2">
              January 20, 2020
            </p>
          </div>

          <div className="text-center">
            <div
              className="font-display text-[clamp(4rem,12vw,8rem)] font-bold leading-none mb-4"
              style={{ color: theme.primaryColor }}
            >
              {countersTriggered && <AnimatedCounter value={daysUntilNextRace} duration={2000} />}
            </div>
            <p className="font-mono text-xs tracking-[0.3em] text-white/80">
              DAYS UNTIL NEXT RACE
            </p>
            {nextRace && (
              <p className="font-mono text-xs tracking-[0.15em] text-white/60 mt-2">
                {nextRace.name}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="h-[20vh]" />
    </section>
  );
}
