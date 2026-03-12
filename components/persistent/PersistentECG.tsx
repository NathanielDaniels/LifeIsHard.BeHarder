'use client';

import { motion, useSpring } from 'framer-motion';
import { useHeartbeatDuration } from '@/contexts/WhoopContext';

type ECGState = 'normal' | 'dimming' | 'flatline' | 'recovering' | 'expanding' | 'calm';

interface PersistentECGProps {
  state: ECGState;
}

export default function PersistentECG({ state }: PersistentECGProps) {
  const heartbeatDuration = useHeartbeatDuration();

  const opacity = useSpring(
    state === 'dimming' || state === 'flatline' ? 0.05
    : state === 'expanding' ? 0.4
    : state === 'calm' ? 0.08
    : 0.15,
    { stiffness: 30, damping: 20 }
  );

  const isFlat = state === 'flatline';
  const isExpanding = state === 'expanding';

  const ecgPath = isFlat
    ? 'M0,75 L1200,75'
    : 'M0,75 L100,75 L120,75 L140,20 L160,130 L180,40 L200,110 L220,75 L300,75 L320,75 L340,20 L360,130 L380,40 L400,110 L420,75 L500,75 L520,75 L540,20 L560,130 L580,40 L600,110 L620,75 L700,75 L720,75 L740,20 L760,130 L780,40 L800,110 L820,75 L900,75 L920,75 L940,20 L960,130 L980,40 L1000,110 L1020,75 L1100,75 L1120,75 L1140,20 L1160,130 L1180,40 L1200,110';

  const strokeColor = isFlat
    ? 'rgba(255, 50, 50, 0.4)'
    : state === 'recovering'
      ? 'rgba(249, 115, 22, 0.4)'
      : 'rgba(249, 115, 22, 0.6)';

  return (
    <motion.div
      className={`fixed left-0 w-full pointer-events-none z-20 ${isExpanding ? 'h-[200px]' : 'h-[100px]'}`}
      style={{
        opacity,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <svg
        className="absolute top-1/2 left-0 w-[200%] h-full -translate-y-1/2"
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        style={{
          animation: isFlat ? 'none' : `heartbeat-ecg ${heartbeatDuration * 2}s linear infinite`,
        }}
      >
        <path
          d={ecgPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isExpanding ? 3 : 2}
          style={{ filter: `drop-shadow(0 0 ${isExpanding ? 15 : 10}px ${strokeColor})` }}
        />
      </svg>
    </motion.div>
  );
}
