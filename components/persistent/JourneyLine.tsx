'use client';

import { useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, MotionValue } from 'framer-motion';

interface JourneyLineProps {
  scrollProgress: MotionValue<number>;
  isDimmed: boolean;
}

export default function JourneyLine({ scrollProgress, isDimmed }: JourneyLineProps) {
  // Critically-damped spring: tracks scroll without oscillation
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 120,
    damping: 40,
    restDelta: 0.001,
  });

  const journeyLineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const glowIntensity = useTransform(smoothProgress, [0, 0.2, 0.5, 0.8, 1], [0.3, 0.6, 0.8, 0.6, 0.4]);

  const dimTarget = useMotionValue(isDimmed ? 1 : 0);
  const dimAmount = useSpring(dimTarget, { stiffness: 40, damping: 20 });

  useEffect(() => {
    dimTarget.set(isDimmed ? 1 : 0);
  }, [isDimmed, dimTarget]);

  const orangeOpacity = useTransform(dimAmount, [0, 1], [1, 0]);
  const grayOpacity = useTransform(dimAmount, [0, 1], [0, 1]);

  const glowShadow = useTransform([glowIntensity, dimAmount] as MotionValue[], ([v, d]: number[]) => {
    const fade = 1 - d;
    return fade < 0.01
      ? 'none'
      : `0 0 ${20 * v * fade}px rgba(249, 115, 22, ${v * fade}), 0 0 ${40 * v * fade}px rgba(249, 115, 22, ${v * 0.5 * fade})`;
  });

  const orbShadow = useTransform(dimAmount, (d) =>
    d > 0.95 ? 'none' : `0 0 ${20 * (1 - d)}px rgba(249, 115, 22, ${0.8 * (1 - d)})`
  );

  const orbColor = useTransform(dimAmount, [0, 1], ['rgb(249, 115, 22)', 'rgba(255,255,255,0.2)']);
  const orbOpacity = useTransform(dimAmount, (d) => 0.8 - d * 0.5);

  return (
    <>
      <div
        className="fixed left-0 top-0 w-1.5 z-50 hidden lg:block"
        style={{ height: '100%', pointerEvents: 'none' }}
      >
        <motion.div
          className="absolute left-0 top-0 w-full rounded-b-full"
          style={{
            height: journeyLineHeight,
            background: 'linear-gradient(to bottom, rgba(249, 115, 22, 0.8), rgba(249, 115, 22, 1), rgba(234, 88, 12, 0.9))',
            boxShadow: glowShadow,
            opacity: orangeOpacity,
          }}
        />

        <motion.div
          className="absolute left-0 top-0 w-full rounded-b-full"
          style={{
            height: journeyLineHeight,
            background: 'rgba(255,255,255,0.1)',
            opacity: grayOpacity,
          }}
        />

        <motion.div
          className="absolute left-0 w-full"
          style={{ top: journeyLineHeight }}
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full -ml-[2px] -mt-[5px]"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              backgroundColor: orbColor,
              boxShadow: orbShadow,
              opacity: orbOpacity,
            }}
          />
        </motion.div>
      </div>
    </>
  );
}
