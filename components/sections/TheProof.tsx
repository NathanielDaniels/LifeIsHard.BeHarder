'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useVitality } from '@/contexts/VitalityContext';

// Panel data for the 6-stage journey
const PANELS = [
  {
    days: 'DAY 1-4',
    location: 'HAA TO PARO',
    altitude: '8,200',
    temp: '62',
    copy: "He flew to Bhutan alone. A country he'd dreamed of since reading about it as a sophomore in 2002. Twenty years later, he was standing at the trailhead.",
  },
  {
    days: 'DAY 5-10',
    location: 'PARO TO THIMPHU',
    altitude: '9,800',
    temp: '55',
    copy: 'The first passes tested the prosthetic on terrain it was never designed for. Mud, rock, switchbacks. He adjusted. The leg adjusted.',
  },
  {
    days: 'DAY 11-16',
    location: 'THIMPHU TO BUMTHANG',
    altitude: '12,500',
    temp: '42',
    copy: 'Above the treeline, the air thinned and the temperature dropped. Every step above 12,000 feet was a negotiation with the mountain.',
  },
  {
    days: 'DAY 17-22',
    location: 'BUMTHANG HIGHLANDS',
    altitude: '14,000',
    temp: '32',
    copy: "The highest pass. 14,000 feet. Below-freezing wind. One leg of carbon fiber and titanium on a path most people wouldn't attempt with two.",
  },
  {
    days: 'DAY 23-26',
    location: 'DESCENT TO TRASHIGANG',
    altitude: '9,500',
    temp: '50',
    copy: "The descent was its own challenge. Downhill punishes a prosthetic differently — every step is a controlled fall.",
  },
  {
    days: 'DAY 27-29',
    location: 'TRASHIGANG TO FINISH',
    altitude: '8,000',
    temp: '60',
    copy: 'November 22, 2022. Trail complete. 250 miles. 12 passes. First American. First below-knee amputee.',
  },
];

export default function TheProof() {
  const { theme } = useVitality();
  const themeColor = theme.primaryColor;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Horizontal translation — 6 panels means -(5 * 100)vw at the end
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', '-500vw']);

  // Telemetry values
  const altitude = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
    [8200, 9800, 12500, 14000, 9500, 8000, 8000]
  );
  const temperature = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
    [62, 55, 42, 32, 50, 60, 60]
  );
  const day = useTransform(scrollYProgress, [0, 1], [1, 29]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Mountain profile orange dot position
  const dotX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Data bursts
  const burst1Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.55, 0.6, 0.65],
    [0, 1, 1, 0]
  );
  const burst2Opacity = useTransform(
    scrollYProgress,
    [0.85, 0.9, 0.95, 1],
    [0, 1, 1, 0]
  );

  return (
    <section className="relative z-20">
      {/* Vertical Intro */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          {/* Title */}
          <h2 className="font-display text-6xl md:text-9xl text-white tracking-tight">
            OCTOBER 2022.
            <br />
            <span style={{ color: themeColor }}>BHUTAN.</span>
          </h2>

          {/* Stats stagger */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="space-y-4 font-display text-3xl md:text-6xl text-white/80"
          >
            {['250 MILES.', '12 PASSES.', '29 DAYS.', 'FIRST AMERICAN.', 'FIRST AMPUTEE.'].map(
              (line, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.8 }}
                >
                  {line}
                </motion.div>
              )
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container — desktop only */}
      <div
        ref={containerRef}
        className="hidden md:block relative bg-black"
        style={{ height: '300vh' }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Telemetry overlay (fixed position within sticky) */}
          <TelemetryOverlay
            altitude={altitude}
            temperature={temperature}
            day={day}
            progressWidth={progressWidth}
            themeColor={themeColor}
          />

          {/* Mountain profile SVG */}
          <MountainProfile dotX={dotX} themeColor={themeColor} />

          {/* Data bursts */}
          <motion.div
            style={{ opacity: burst1Opacity }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-30 text-center font-mono text-sm md:text-base text-white/90 bg-black/80 backdrop-blur-sm px-6 py-3 border border-orange-500/50 rounded-lg"
          >
            ALTITUDE: 14,000ft • ELEVATION GAIN: 6,200ft • ESTIMATED STRAIN: 19+
          </motion.div>

          <motion.div
            style={{ opacity: burst2Opacity }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-30 text-center font-mono text-sm md:text-base text-white/90 bg-black/80 backdrop-blur-sm px-6 py-3 border border-orange-500/50 rounded-lg"
          >
            TOTAL DISTANCE: 250mi • TOTAL PASSES: 12 • DURATION: 29 DAYS
          </motion.div>

          {/* Panels — flex row, translated by x */}
          <motion.div className="flex h-full" style={{ x }}>
            {PANELS.map((panel, i) => (
              <div
                key={i}
                className="w-screen h-full flex-shrink-0 flex items-center justify-center p-8 md:p-16"
              >
                <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
                  {/* Image placeholder */}
                  <div
                    className="aspect-[4/5] rounded-2xl overflow-hidden relative group"
                    style={{
                      background: `linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-xs">
                      BHUTAN TREK IMAGE {i + 1}
                    </div>
                    {/* Decorative corner frame */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/20" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/20" />
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    {/* Days and location */}
                    <div>
                      <div
                        className="font-display text-5xl md:text-6xl mb-2"
                        style={{ color: themeColor }}
                      >
                        {panel.days}
                      </div>
                      <div className="font-mono text-sm text-white/50 tracking-widest">
                        {panel.location}
                      </div>
                    </div>

                    {/* Data */}
                    <div className="flex gap-8">
                      <div>
                        <div className="font-mono text-xs text-white/40 mb-1">ALTITUDE</div>
                        <div className="font-display text-2xl text-white">{panel.altitude}ft</div>
                      </div>
                      <div>
                        <div className="font-mono text-xs text-white/40 mb-1">TEMP</div>
                        <div className="font-display text-2xl text-white">{panel.temp}°F</div>
                      </div>
                    </div>

                    {/* Copy */}
                    <p className="text-lg md:text-xl text-white/80 leading-relaxed">{panel.copy}</p>

                    {/* Decorative line */}
                    <div
                      className="h-px w-24"
                      style={{ background: themeColor, opacity: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile: Vertical card stack */}
      <div className="md:hidden px-6 py-12 space-y-12 bg-black">
        {PANELS.map((panel, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-6"
          >
            {/* Image placeholder */}
            <div
              className="aspect-[4/3] rounded-xl overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono text-xs">
                BHUTAN TREK IMAGE {i + 1}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Days and location */}
              <div>
                <div className="font-display text-4xl mb-1" style={{ color: themeColor }}>
                  {panel.days}
                </div>
                <div className="font-mono text-xs text-white/50 tracking-widest">
                  {panel.location}
                </div>
              </div>

              {/* Data inline */}
              <div className="flex gap-6">
                <div>
                  <div className="font-mono text-xs text-white/40 mb-1">ALTITUDE</div>
                  <div className="font-display text-xl text-white">{panel.altitude}ft</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-white/40 mb-1">TEMP</div>
                  <div className="font-display text-xl text-white">{panel.temp}°F</div>
                </div>
              </div>

              {/* Copy */}
              <p className="text-base text-white/80 leading-relaxed">{panel.copy}</p>
            </div>

            {/* Divider */}
            {i < PANELS.length - 1 && (
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mt-6" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Exit: Trail Complete */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div className="font-display text-5xl md:text-8xl text-white tracking-tight">
            NOVEMBER 22, 2022.
            <br />
            <span style={{ color: themeColor }}>TRAIL COMPLETE.</span>
          </div>

          <div className="font-display text-2xl md:text-4xl text-white/60 space-y-2">
            <div>FIRST AMERICAN.</div>
            <div>FIRST BELOW-KNEE AMPUTEE.</div>
            <div style={{ color: themeColor }}>250 MILES.</div>
          </div>

          {/* Decorative element */}
          <div className="pt-8">
            <div
              className="h-1 w-48 mx-auto rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${themeColor}, transparent)`,
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Telemetry overlay component with reactive motion values
function TelemetryOverlay({
  altitude,
  temperature,
  day,
  progressWidth,
  themeColor,
}: {
  altitude: any;
  temperature: any;
  day: any;
  progressWidth: any;
  themeColor: string;
}) {
  const [altDisplay, setAltDisplay] = useState(8200);
  const [tempDisplay, setTempDisplay] = useState(62);
  const [dayDisplay, setDayDisplay] = useState(1);

  useMotionValueEvent(altitude, 'change', (latest) => {
    setAltDisplay(Math.round(latest as number));
  });

  useMotionValueEvent(temperature, 'change', (latest) => {
    setTempDisplay(Math.round(latest as number));
  });

  useMotionValueEvent(day, 'change', (latest) => {
    setDayDisplay(Math.round(latest as number));
  });

  return (
    <div className="fixed top-8 left-8 z-30 font-mono text-xs md:text-sm text-white/70 space-y-3 bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-white/40 text-xs">DAY</div>
          <div className="text-white text-lg font-bold">{dayDisplay}</div>
        </div>
        <div className="h-8 w-px bg-white/20" />
        <div>
          <div className="text-white/40 text-xs">ALTITUDE</div>
          <div className="text-white text-lg font-bold">{altDisplay.toLocaleString()}ft</div>
        </div>
        <div className="h-8 w-px bg-white/20" />
        <div>
          <div className="text-white/40 text-xs">TEMP</div>
          <div className="text-white text-lg font-bold">{tempDisplay}°F</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden w-64">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: progressWidth,
            background: themeColor,
            boxShadow: `0 0 10px ${themeColor}`,
          }}
        />
      </div>

      <div className="text-white/40 text-xs">TRANS BHUTAN TRAIL • 250 MILES</div>
    </div>
  );
}

// Mountain profile SVG with tracking dot
function MountainProfile({ dotX, themeColor }: { dotX: any; themeColor: string }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-[600px] max-w-[90vw]">
      <svg viewBox="0 0 600 100" className="w-full h-16">
        {/* Mountain path */}
        <path
          d="M0,80 C50,80 80,60 120,45 C160,30 200,15 250,8 C300,15 330,30 350,45 C400,65 450,75 500,80 C550,82 580,85 600,85"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />

        {/* Tracking dot */}
        <motion.circle
          cx={dotX}
          cy="50"
          r="6"
          fill={themeColor}
          style={{
            filter: `drop-shadow(0 0 8px ${themeColor})`,
          }}
        >
          <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
        </motion.circle>
      </svg>

      {/* Altitude markers */}
      <div className="flex justify-between text-white/30 font-mono text-xs mt-2">
        <div>8,200ft</div>
        <div>9,800ft</div>
        <div>12,500ft</div>
        <div>14,000ft</div>
        <div>9,500ft</div>
        <div>8,000ft</div>
      </div>
    </div>
  );
}
