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
