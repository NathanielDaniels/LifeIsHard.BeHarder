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
