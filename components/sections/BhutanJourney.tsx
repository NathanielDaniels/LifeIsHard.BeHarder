'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function BhutanJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Horizontal scroll effect
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);
  
  // Altitude changes as you scroll
  const altitude = useTransform(scrollYProgress, [0, 1], [8000, 14000]);
  
  // Temperature drops
  const temperature = useTransform(scrollYProgress, [0, 1], [65, 32]);

  const journeyPoints = [
    {
      day: "Day 1-2",
      title: "The Beginning",
      description: "Starting the trek. Mind focused. Body ready. The mountain calls.",
      altitude: 8200,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
    },
    {
      day: "Day 3-4",
      title: "The Climb",
      description: "Every step is a choice. Every breath matters. The air thins.",
      altitude: 11000,
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=80"
    },
    {
      day: "Day 5-7",
      title: "The Summit",
      description: "14,000 feet. Record set. Proof that limits are just suggestions.",
      altitude: 14000,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"
    }
  ];

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Live stats overlay */}
        <div className="absolute top-8 left-8 z-30 space-y-4">
          <motion.div
            className="px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-orange-500/30"
            style={{
              boxShadow: '0 0 30px rgba(249, 115, 22, 0.2)'
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60 uppercase tracking-wider">Altitude</span>
              <motion.span className="text-2xl font-black text-orange-500 font-mono">
                {altitude.get().toFixed(0)}'
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            className="px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60 uppercase tracking-wider">Temp</span>
              <motion.span className="text-2xl font-black text-white font-mono">
                {temperature.get().toFixed(0)}°F
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute top-8 right-8 z-30 text-right"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-2">
            THE <span className="text-orange-500">BHUTAN</span> TREK
          </h2>
          <p className="text-white/60 text-lg">7 Days. 14,000 Feet. One Record.</p>
        </motion.div>

        {/* Horizontal scrolling container */}
        <motion.div
          ref={containerRef}
          style={{ x }}
          className="flex h-full"
        >
          {journeyPoints.map((point, index) => (
            <div
              key={index}
              className="relative min-w-full h-full flex items-center justify-center px-6"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={point.image}
                  alt={point.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-4xl text-center">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="text-orange-500 text-xl md:text-2xl font-mono mb-4 tracking-wider">
                    {point.day}
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black text-white mb-8">
                    {point.title}
                  </h3>
                  <p className="text-2xl md:text-3xl text-white/80 font-light leading-relaxed mb-12">
                    {point.description}
                  </p>
                  
                  {/* Altitude badge */}
                  <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/50">
                    <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-3xl font-black text-white">
                      {point.altitude.toLocaleString()}'
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Progress indicator */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                {journeyPoints.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === index ? 'w-16 bg-orange-500' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <span className="text-xs text-white/40 uppercase tracking-widest">Scroll to journey</span>
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
