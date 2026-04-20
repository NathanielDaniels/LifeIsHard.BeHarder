'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function ByTheNumbers() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { label: "Miles Trained", value: 2847, unit: "mi", color: "from-orange-400 to-orange-600" },
    { label: "Elevation Climbed", value: 127500, unit: "ft", color: "from-orange-500 to-red-600" },
    { label: "Records Set", value: 3, unit: "", color: "from-orange-400 to-yellow-500" },
    { label: "Days Since Accident", value: 892, unit: "", color: "from-orange-500 to-orange-700" }
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(249, 115, 22, 0.05) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            BY THE <span className="text-orange-500">NUMBERS</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-light">
            Every number tells a story of resilience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCounter
              key={stat.label}
              {...stat}
              delay={index * 0.15}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="inline-block p-12 rounded-3xl border-2 border-orange-500/30 bg-orange-500/5 backdrop-blur-sm">
            <p className="text-3xl md:text-5xl font-black text-white mb-4">
              AND WE'RE JUST
              <br />
              <span className="text-orange-500">GETTING STARTED</span>
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-6" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface StatCounterProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  delay: number;
  isInView: boolean;
}

function StatCounter({ label, value, unit, color, delay, isInView }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView) return;

    const delayMs = delay * 1000;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(intervalId);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isInView, value, delay]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative p-10 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden group hover:border-orange-500/50 transition-all duration-500"
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-white/70 text-sm md:text-base uppercase tracking-widest mb-6 font-mono"
        >
          {label}
        </motion.div>

        <div ref={countRef} className="flex items-baseline gap-2 mb-6">
          <motion.span
            className={`text-6xl md:text-8xl font-black bg-gradient-to-br ${color} bg-clip-text text-transparent`}
            style={{
              filter: 'drop-shadow(0 0 30px rgba(249, 115, 22, 0.4))'
            }}
          >
            {formatNumber(count)}
          </motion.span>
          {unit && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.5, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl text-orange-500 font-bold"
            >
              {unit}
            </motion.span>
          )}
        </div>

        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ delay: delay + 0.3, duration: 2, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color} rounded-full`}
            style={{
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)'
            }}
          />
        </div>
      </div>

      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-orange-500/20 rounded-tr-2xl" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-orange-500/20 rounded-bl-2xl" />
    </motion.div>
  );
}
