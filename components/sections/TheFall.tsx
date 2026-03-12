'use client';

import { motion } from 'framer-motion';

export default function TheFall() {
  return (
    <section className="relative z-20 bg-black">
      {/* Leading negative space */}
      <div className="h-[30vh]" />

      {/* Date Block 1: Sobriety */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5 }}
        className="max-w-3xl mx-auto px-6 py-20"
      >
        <h2 className="font-display text-[clamp(3rem,8vw,6rem)] font-bold text-white/90 leading-none mb-6">
          JANUARY 20, 2020
        </h2>
        <p className="font-mono text-sm tracking-[0.15em] text-white/40 leading-relaxed max-w-lg">
          THE DAY HE GOT SOBER.
        </p>
        <p className="font-mono text-sm tracking-[0.15em] text-white/30 leading-relaxed max-w-lg mt-3">
          Nine months before the accident. The first thing he lost wasn't his leg.
        </p>
      </motion.div>

      {/* Generous spacing */}
      <div className="h-[25vh]" />

      {/* Date Block 2: Collapse */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5 }}
        className="max-w-3xl mx-auto px-6 py-20"
      >
        <h2 className="font-display text-[clamp(3rem,10vw,8rem)] font-bold text-white/90 leading-none mb-6">
          2020
        </h2>
        <p className="font-mono text-sm tracking-[0.15em] text-white/40 leading-relaxed max-w-lg">
          THE YEAR EVERYTHING COLLAPSED.
        </p>
        <p className="font-mono text-sm tracking-[0.15em] text-white/25 leading-relaxed max-w-lg mt-3">
          Marriage ended. The restaurant group he'd spent years building fell apart during COVID.
        </p>
        <p className="font-mono text-sm tracking-[0.15em] text-white/20 leading-relaxed max-w-lg mt-3">
          Rock bottom has a basement.
        </p>
      </motion.div>

      {/* Generous spacing */}
      <div className="h-[30vh]" />

      {/* Date Block 3: The Accident - THIS IS THE HEAVIEST MOMENT */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 2 }}
        className="max-w-3xl mx-auto px-6 py-20"
      >
        <h2 className="font-display text-[clamp(3rem,8vw,6rem)] font-bold text-white/90 leading-none mb-2">
          NOVEMBER 1, 2020
        </h2>
        <p className="font-mono text-xs tracking-[0.3em] text-white/30 mb-8">
          CHICAGO, ILLINOIS
        </p>
        <p className="font-mono text-sm tracking-[0.15em] text-white/40 leading-relaxed max-w-lg">
          A car hit his motorcycle.
        </p>
        <p className="font-mono text-sm tracking-[0.15em] text-white/30 leading-relaxed max-w-lg mt-4">
          He lost his right leg below the knee.
        </p>
      </motion.div>

      {/* THE VOID — deliberate darkness after the accident */}
      <div className="h-[60vh]" />

      {/* Transition: Signal Recovery — marks the boundary between S2 and S3 */}
      <div className="flex flex-col items-center justify-center py-32">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5 }}
          className="font-mono text-xs tracking-[0.4em] text-white/30 mb-4"
        >
          SIGNAL RECOVERED
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="font-mono text-sm tracking-[0.3em] text-white/40"
        >
          HEARTBEAT DETECTED...
        </motion.p>
      </div>

      {/* Trailing space before S3 */}
      <div className="h-[10vh]" />
    </section>
  );
}
