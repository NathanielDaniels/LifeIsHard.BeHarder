'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useVitality } from '@/contexts/VitalityContext';

interface WhoopData {
  strain: number;
  recovery: number;
  // sleep: number;
  hrv: number;
}

export default function LiveStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { setStats, theme, energyState } = useVitality();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Mock WHOOP data - In real app, this would fetch from API
  // We're using local state here to simulate "Live" updates that drive the context
  const whoopData: WhoopData = {
    strain: 16.8,
    recovery: 87, // Change this to test different states (e.g. 25 for Low)
    // sleep: 8.2,
    hrv: 72
  };

  // Sync data with global context on mount
  useEffect(() => {
    setStats(whoopData.recovery, whoopData.strain);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

  // Color logic is now driven by context energyState
  const getIntensityColor = () => {
    switch (energyState) {
      case 'HIGH': return { from: 'from-orange-500', to: 'to-red-500', glow: 'rgba(255, 87, 34, 0.9)' };
      case 'MEDIUM': return { from: 'from-amber-400', to: 'to-yellow-500', glow: 'rgba(251, 191, 36, 0.7)' };
      case 'LOW': return { from: 'from-red-900', to: 'to-red-950', glow: 'rgba(153, 27, 27, 0.6)' };
    }
  };

  const intensityColors = getIntensityColor();

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, y }}
      className="relative min-h-screen flex items-center justify-center py-32 px-6"
    >
      <div className="max-w-7xl w-full">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 * theme.animationSpeed }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} />
            <span className="text-xs font-mono text-white/60">SYSTEM STATUS: {energyState} ENERGY</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
            LIVE <span style={{ color: theme.primaryColor, transition: 'color 1s' }}>RIGHT NOW</span>
          </h2>
          <p className="text-white/60 text-lg">
            Site physics synced to Patrick's recovery.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Strain */}
          <StatCard
            label="Strain"
            value={whoopData.strain}
            unit=""
            max={21}
            color={intensityColors}
            description="Today's exertion"
            delay={0.1}
            speed={theme.animationSpeed}
          />

          {/* Recovery */}
          <StatCard
            label="Recovery"
            value={whoopData.recovery}
            unit="%"
            max={100}
            color={intensityColors}
            description="Body readiness"
            delay={0.2}
            isPrimary
            speed={theme.animationSpeed}
          />

          {/* Sleep */}
          {/* <StatCard
            label="Sleep"
            value={whoopData.sleep}
            unit="hrs"
            max={12}
            color={intensityColors}
            description="Last night"
            delay={0.3}
            speed={theme.animationSpeed}
          /> */}

          {/* HRV */}
          <StatCard
            label="HRV"
            value={whoopData.hrv}
            unit="ms"
            max={100}
            color={intensityColors}
            description="Heart rate variability"
            delay={0.4}
            speed={theme.animationSpeed}
          />
        </div>

        {/* Controls for User Demo - allowing them to feel the difference */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 p-8 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto text-center"
        >
          <p className="text-white/60 text-sm mb-6 uppercase tracking-widest">
            Simulation Control (Dev Only)
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setStats(25, 12.0)}
              className="px-6 py-3 rounded-full border border-red-500/50 hover:bg-red-500/20 text-white transition-all text-sm font-bold"
            >
              Simulate: HARD DAY (25%)
            </button>
            <button 
              onClick={() => setStats(50, 15.0)}
              className="px-6 py-3 rounded-full border border-yellow-500/50 hover:bg-yellow-500/20 text-white transition-all text-sm font-bold"
            >
              Simulate: ADAPTING (50%)
            </button>
            <button 
              onClick={() => setStats(95, 18.0)}
              className="px-6 py-3 rounded-full border border-green-500/50 hover:bg-green-500/20 text-white transition-all text-sm font-bold"
            >
              Simulate: PEAK (95%)
            </button>
          </div>
          <p className="mt-4 text-xs text-white/40">
            Click to see how the entire site's atmosphere shifts based on data.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  max: number;
  color: { from: string; to: string; glow: string };
  description: string;
  delay: number;
  isPrimary?: boolean;
  speed: number;
}

function StatCard({ label, value, unit, max, color, description, delay, isPrimary, speed }: StatCardProps) {
  const percentage = (value / max) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 * speed }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-2xl border ${
        isPrimary ? 'border-orange-500/50' : 'border-white/10'
      } bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-orange-500/50 transition-all duration-500`}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3 * speed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        <div className="text-white/60 text-sm uppercase tracking-widest mb-4">
          {label}
        </div>

        <motion.div
          className="text-6xl md:text-7xl font-black mb-4"
          style={{
            textShadow: `0 0 30px ${color.glow}`
          }}
        >
          <span className="text-white">{value.toFixed(1)}</span>
          <span className="text-orange-500 text-3xl ml-1">{unit}</span>
        </motion.div>

        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.3, duration: 1.5 * speed, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color.from} ${color.to} rounded-full`}
            style={{
              boxShadow: `0 0 15px ${color.glow}`
            }}
          />
        </div>

        <div className="text-white/40 text-xs">
          {description}
        </div>
      </div>
    </motion.div>
  );
}
