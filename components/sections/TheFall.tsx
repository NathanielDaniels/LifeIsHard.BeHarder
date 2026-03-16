'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useVitality } from '@/contexts/VitalityContext';

export default function TheFall() {
  const { theme } = useVitality();
  const themeColor = theme.primaryColor;
  const [heartbeatTriggered, setHeartbeatTriggered] = useState(false);

  return (
    <section className="relative z-20 bg-black">
      <div className="h-[30vh]" />

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
        <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/50 leading-relaxed max-w-lg">
          THE DAY HE GOT SOBER.
        </p>
        <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/40 leading-relaxed max-w-lg mt-3">
          Nine months before the accident. The first thing he lost wasn't his leg.
        </p>
      </motion.div>

      <div className="h-[25vh]" />

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
        <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/50 leading-relaxed max-w-lg">
          THE YEAR EVERYTHING COLLAPSED.
        </p>
        <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/35 leading-relaxed max-w-lg mt-3">
          Marriage ended. The restaurant group he'd spent years building fell apart during COVID.
        </p>
        <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/40 leading-relaxed max-w-lg mt-3">
          Rock bottom has a basement.
        </p>
      </motion.div>

      <div className="h-[30vh]" />

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
        <p className="font-mono text-sm tracking-[0.3em] text-white/40 mb-8">
          CHICAGO, ILLINOIS
        </p>
        <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/50 leading-relaxed max-w-lg">
          A car hit his motorcycle.
        </p>
        <p className="font-mono text-base md:text-lg tracking-[0.15em] text-white/40 leading-relaxed max-w-lg mt-4">
          He lost his right leg below the knee.
        </p>
      </motion.div>

      <div className="h-[60vh]" />

      <motion.div
        className="flex flex-col items-center justify-center min-h-[50vh] py-32 relative"
        onViewportEnter={() => setHeartbeatTriggered(true)}
        viewport={{ once: true, margin: "-20%" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 2 }}
          className="font-mono text-sm md:text-base tracking-[0.5em] text-white/40 mb-8"
        >
          SIGNAL RECOVERED
        </motion.p>

        <div className="w-full max-w-2xl mx-auto mb-8 h-28 md:h-32 relative">
          <div className="w-full h-full overflow-hidden">
          <svg viewBox="0 0 800 120" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <filter id="ecg-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <line x1="0" y1="60" x2="800" y2="60" stroke="rgba(255,50,50,0.3)" strokeWidth="1.5" />

            {heartbeatTriggered && (
              <>
                <path
                  d={[
                    'M0,60 L200,60',
                    'L218,60 L222,54 L226,66 L230,60',
                    'L330,60',
                    'L348,60 L352,64 L358,60 L362,70 L365,30 L370,90 L374,48 L378,63 L382,57 L388,60',
                    'L488,60',
                    'L506,60 L510,66 L516,60 L520,72 L523,14 L528,106 L532,38 L536,64 L542,55 L548,60',
                    'L620,60',
                    'L636,60 L640,68 L646,60 L650,72 L652,2 L658,118 L663,24 L668,68 L674,52 L680,60',
                    'L800,60',
                  ].join(' ')}
                  fill="none"
                  stroke={themeColor}
                  strokeWidth="2.5"
                  strokeDasharray="2000"
                  strokeDashoffset="2000"
                  style={{
                    animation: 'ecg-draw 3s linear 0.5s forwards',
                  }}
                />
                <path
                  d={[
                    'M0,60 L200,60',
                    'L218,60 L222,54 L226,66 L230,60',
                    'L330,60',
                    'L348,60 L352,64 L358,60 L362,70 L365,30 L370,90 L374,48 L378,63 L382,57 L388,60',
                    'L488,60',
                    'L506,60 L510,66 L516,60 L520,72 L523,14 L528,106 L532,38 L536,64 L542,55 L548,60',
                    'L620,60',
                    'L636,60 L640,68 L646,60 L650,72 L652,2 L658,118 L663,24 L668,68 L674,52 L680,60',
                    'L800,60',
                  ].join(' ')}
                  fill="none"
                  stroke={themeColor}
                  strokeWidth="6"
                  opacity="0.3"
                  strokeDasharray="2000"
                  strokeDashoffset="2000"
                  style={{
                    animation: 'ecg-draw 3s linear 0.5s forwards',
                  }}
                />
                <path
                  d={[
                    'M0,60 L200,60',
                    'L218,60 L222,54 L226,66 L230,60',
                    'L330,60',
                    'L348,60 L352,64 L358,60 L362,70 L365,30 L370,90 L374,48 L378,63 L382,57 L388,60',
                    'L488,60',
                    'L506,60 L510,66 L516,60 L520,72 L523,14 L528,106 L532,38 L536,64 L542,55 L548,60',
                    'L620,60',
                    'L636,60 L640,68 L646,60 L650,72 L652,2 L658,118 L663,24 L668,68 L674,52 L680,60',
                    'L800,60',
                  ].join(' ')}
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="3 2000"
                  strokeDashoffset="2000"
                  filter="url(#ecg-glow)"
                  style={{
                    animation: 'ecg-draw 3s linear 0.5s forwards, sweep-dot-fade 0.5s ease-out 3s forwards',
                  }}
                />
              </>
            )}
          </svg>
          </div>

          {heartbeatTriggered && (
            <div
              className="absolute pointer-events-none"
              style={{
                width: 160,
                height: 160,
                left: '81.5%',
                top: '50%',
                opacity: 0,
                animation: 'square-heart-pulse 2.5s ease-out 2.9s forwards',
              }}
            >
              <svg viewBox="0 0 160 160" className="w-full h-full">
                <defs>
                  <mask id="heart-cutout">
                    <rect width="160" height="160" rx="8" fill="white" />
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="black"
                      transform="translate(8, 7) scale(6)"
                    />
                  </mask>
                </defs>
                <rect width="160" height="160" rx="8" fill={themeColor} mask="url(#heart-cutout)" />
              </svg>
            </div>
          )}
        </div>

        {heartbeatTriggered && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 2.0 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight text-white"
          >
            HEARTBEAT DETECTED.
          </motion.p>
        )}

        <style>{`
          @keyframes ecg-draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes sweep-dot-fade {
            to { opacity: 0; }
          }
          @keyframes square-heart-pulse {
            0% { opacity: 0.8; left: 81.5%; top: 50%; transform: translate(-50%, -50%) scale(0.3); }
            100% { opacity: 0; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(5); }
          }
        `}</style>
      </motion.div>

      <div className="h-[10vh]" />
    </section>
  );
}
