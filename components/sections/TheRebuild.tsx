'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useVitality } from '@/contexts/VitalityContext';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { KEY_DATES, getNextRace, getDaysSince, getDaysUntil } from '@/lib/race-data';

export default function TheRebuild() {
  const { theme } = useVitality();
  const prostheticRef = useRef<HTMLDivElement>(null);
  const [countersTriggered, setCountersTriggered] = useState(false);

  // Prosthetic scroll-driven animation
  const { scrollYProgress: prostheticScroll } = useScroll({
    target: prostheticRef,
    offset: ['start end', 'end start'],
  });

  const rotateY = useTransform(prostheticScroll, [0, 0.5, 1], [15, 0, 0]);
  const grayscale = useTransform(prostheticScroll, [0, 0.5], [1, 0]);
  const techOverlayOpacity = useTransform(prostheticScroll, [0.3, 0.6], [0, 1]);

  // Calculate counter values
  const daysSinceAccident = getDaysSince(KEY_DATES.accident);
  const daysSober = getDaysSince(KEY_DATES.sobriety);
  const nextRace = getNextRace();
  const daysUntilNextRace = nextRace ? getDaysUntil(new Date(nextRace.date)) : 0;

  return (
    <section className="relative z-20 bg-black">
      {/* Opening Headline - First orange after the void */}
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

      {/* The Prosthetic - Split Screen (Image Left) */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src="/pat-crop.png"
              alt="Patrick Wingert with prosthetic"
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
            <p className="font-mono text-sm tracking-[0.15em] text-white/60 leading-relaxed mb-4">
              Carbon fiber. Titanium. Engineering that doesn't just restore function — it amplifies it.
            </p>
            <p className="font-mono text-sm tracking-[0.15em] text-white/60 leading-relaxed mb-4">
              This isn't about getting back to who he was. It's about becoming someone better.
            </p>
            <p className="font-mono text-xs tracking-[0.2em] text-white/40 mt-8">
              PROSTHETIST: DAVID ROTTER
            </p>
          </motion.div>
        </div>
      </div>

      {/* The Prosthetic Reveal - Full Width Showpiece */}
      <div ref={prostheticRef} className="relative py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="relative aspect-[3/4] md:aspect-[16/10] overflow-hidden"
            style={{
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            <motion.div
              className="relative w-full h-full"
              style={{
                filter: grayscale.get() ? `grayscale(${grayscale.get() * 100}%)` : 'grayscale(0%)',
              }}
              animate={{
                boxShadow: [
                  `0 0 20px ${theme.primaryColor}40`,
                  `0 0 40px ${theme.primaryColor}80`,
                  `0 0 20px ${theme.primaryColor}40`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image
                src="/pat-crop.png"
                alt="Prosthetic system"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Tech Overlay Cards */}
            <motion.div
              className="absolute top-8 left-8 bg-black/80 backdrop-blur-sm border px-4 py-3"
              style={{
                borderColor: theme.primaryColor,
                opacity: techOverlayOpacity.get() || 0,
              }}
            >
              <p className="font-mono text-xs tracking-[0.3em]" style={{ color: theme.primaryColor }}>
                PROSTHETIC SYSTEM // ACTIVE
              </p>
            </motion.div>

            <motion.div
              className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-sm border px-4 py-3"
              style={{
                borderColor: theme.primaryColor,
                opacity: techOverlayOpacity.get() || 0,
              }}
            >
              <p className="font-mono text-xs tracking-[0.2em] text-white/60 mb-2">
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
          </motion.div>
        </div>
      </div>

      {/* Dare2Tri Discovery - Split Screen Reversed (Text Left, Image Right) */}
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
            <p className="font-mono text-sm tracking-[0.15em] text-white/60 leading-relaxed mb-4">
              Keri introduced him to adaptive sports. First session at Dare2Tri.
            </p>
            <p className="font-mono text-sm tracking-[0.15em] text-white/60 leading-relaxed mb-4">
              The catalyst. The spark. The moment everything changed direction.
            </p>
            <p className="font-mono text-sm tracking-[0.15em] text-white/60 leading-relaxed">
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
              src="/Pat_D2T.png"
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

      {/* The Counters - Centered Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        onViewportEnter={() => setCountersTriggered(true)}
        transition={{ duration: 1.5 }}
        className="max-w-6xl mx-auto px-6 py-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Days Since Accident */}
          <div className="text-center">
            <div
              className="font-display text-[clamp(4rem,12vw,8rem)] font-bold leading-none mb-4"
              style={{ color: theme.primaryColor }}
            >
              {countersTriggered && <AnimatedCounter value={daysSinceAccident} duration={2000} />}
            </div>
            <p className="font-mono text-xs tracking-[0.3em] text-white/60">
              DAYS SINCE ACCIDENT
            </p>
            <p className="font-mono text-xs tracking-[0.15em] text-white/40 mt-2">
              November 1, 2020
            </p>
          </div>

          {/* Days Sober */}
          <div className="text-center">
            <div
              className="font-display text-[clamp(4rem,12vw,8rem)] font-bold leading-none mb-4"
              style={{ color: theme.primaryColor }}
            >
              {countersTriggered && <AnimatedCounter value={daysSober} duration={2000} />}
            </div>
            <p className="font-mono text-xs tracking-[0.3em] text-white/60">
              DAYS SOBER
            </p>
            <p className="font-mono text-xs tracking-[0.15em] text-white/40 mt-2">
              January 20, 2020
            </p>
          </div>

          {/* Days Until Next Race */}
          <div className="text-center">
            <div
              className="font-display text-[clamp(4rem,12vw,8rem)] font-bold leading-none mb-4"
              style={{ color: theme.primaryColor }}
            >
              {countersTriggered && <AnimatedCounter value={daysUntilNextRace} duration={2000} />}
            </div>
            <p className="font-mono text-xs tracking-[0.3em] text-white/60">
              DAYS UNTIL NEXT RACE
            </p>
            {nextRace && (
              <p className="font-mono text-xs tracking-[0.15em] text-white/40 mt-2">
                {nextRace.name}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Trailing space */}
      <div className="h-[20vh]" />
    </section>
  );
}
