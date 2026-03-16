'use client';

import { useTransform, motion, MotionValue } from 'framer-motion';
import FloatingParticles from '@/components/shared/FloatingParticles';

interface AtmosphericOverlaysProps {
  themeColor: string;
  particleCount?: number;
  scrollProgress: MotionValue<number>;
}

export default function AtmosphericOverlays({ themeColor, particleCount = 15, scrollProgress }: AtmosphericOverlaysProps) {
  const floatX = useTransform(scrollProgress, [0, 1], [0, -300]);
  const floatXReverse = useTransform(scrollProgress, [0, 1], [0, 300]);
  // Fade in only after ~55% scroll (biometrics section)
  const textOpacity = useTransform(scrollProgress, [0.5, 0.6], [0, 1]);

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMFBQUFBQVMIbMhAAAASUlEQVQ4y2MYBaNgGAMWOxgYGJYyMDAwHGBgANIsDAzLGBiANCsDwyIGBiANEmZhYFjEwACkWRgYFjMwMDBsZgDSLAwMi4Y+BQBR1xaLT6NSZAAAAABJRU5ErkJggg==")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-[999] opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
        <div
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ animation: 'scan-line 8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
        />
      </div>

      <div className="fixed inset-0 vignette pointer-events-none z-10" />

      <motion.div
        className="fixed top-[15%] left-[1%] font-display text-[min(12vw,280px)] text-white/[0.02] pointer-events-none z-[1] whitespace-nowrap font-bold tracking-tight will-change-transform"
        style={{ x: floatX, opacity: textOpacity }}
      >
        • RELENTLESS • UNSTOPPABLE • UNBROKEN • UNDEFEATED •
      </motion.div>
      <motion.div
        className="fixed bottom-[15%] right-[-10%] font-display text-[min(12vw,280px)] text-white/[0.02] pointer-events-none z-[1] whitespace-nowrap font-bold tracking-tight will-change-transform"
        style={{ x: floatXReverse, opacity: textOpacity }}
      >
        • RECORD BREAKER • DARE2TRI • ADAPTIVE ATHLETE • ELITE •
      </motion.div>

      <div className="fixed inset-0 pointer-events-none">
        <FloatingParticles themeColor={themeColor} count={particleCount} />
      </div>
    </>
  );
}
