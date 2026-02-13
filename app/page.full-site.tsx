'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import HeroSection from '@/components/sections/HeroSection';
import TheShift from '@/components/sections/TheShift';
import ProstheticReveal from '@/components/sections/ProstheticReveal';
import ByTheNumbers from '@/components/sections/ByTheNumbers';
import BhutanJourney from '@/components/sections/BhutanJourney';
import LiveStats from '@/components/sections/LiveStats';
import TheMission from '@/components/sections/TheMission';
import SupportCTA from '@/components/sections/SupportCTA';
import InstagramFeed from '@/components/sections/InstagramFeed';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Enhanced spring physics for weighted momentum feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50, // Lower = more weighted feel
    damping: 20,   // Higher = less bouncy
    restDelta: 0.0001
  });

  // Orange journey line height
  const journeyLineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  
  // Journey line glow intensity based on scroll position
  const glowIntensity = useTransform(
    smoothProgress, 
    [0, 0.2, 0.5, 0.8, 1], 
    [0.3, 0.6, 0.8, 0.6, 0.4]
  );

  return (
    <div ref={containerRef} className="relative bg-black">
      {/* Orange energy line that traces the journey */}
      <motion.div 
        className="fixed left-0 top-0 w-1.5 z-50 hidden lg:block"
        style={{
          height: journeyLineHeight,
          background: 'linear-gradient(to bottom, rgba(249, 115, 22, 0.8), rgba(249, 115, 22, 1), rgba(234, 88, 12, 0.9))',
          boxShadow: useTransform(
            glowIntensity,
            (v) => `0 0 ${20 * v}px rgba(249, 115, 22, ${v}), 0 0 ${40 * v}px rgba(249, 115, 22, ${v * 0.5})`
          )
        }}
      >
        {/* Pulsing tip */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-500"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.8)'
          }}
        />
      </motion.div>

      {/* Section markers on journey line */}
      <div className="fixed left-0 top-0 h-full w-6 z-40 hidden lg:flex flex-col justify-between py-[10vh] pointer-events-none">
        {['HERO', 'SHIFT', 'REALITY', 'STATS', 'NUMBERS', 'BHUTAN', 'MISSION', 'FEED', 'SUPPORT'].map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.3, x: 0 }}
            transition={{ delay: 3 + i * 0.1 }}
            className="text-[8px] text-white/30 font-mono tracking-widest transform -rotate-90 origin-left ml-4"
          >
            {label}
          </motion.div>
        ))}
      </div>

      {/* Sections - Story Flow */}
      <HeroSection />
      <TheShift />
      <ProstheticReveal />
      <LiveStats />
      <ByTheNumbers />
      <BhutanJourney />
      <TheMission />
      <InstagramFeed />
      <SupportCTA />
    </div>
  );
}
