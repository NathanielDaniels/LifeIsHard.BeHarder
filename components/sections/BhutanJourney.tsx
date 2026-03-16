'use client';

import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

export default function BhutanJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const index = Math.round(latest * (journeyPoints.length - 1));
      setActiveIndex(index);
    });
  }, [scrollYProgress, journeyPoints.length]);

  const x = useTransform(
    scrollYProgress, 
    [0, 1], 
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "-66.666%"]
  );
  
  const altitudeValue = useTransform(scrollYProgress, [0, 1], [8000, 14000]);
  const temperatureValue = useTransform(scrollYProgress, [0, 1], [65, 32]);

  const [altitude, setAltitude] = useState(8000);
  const [temperature, setTemperature] = useState(65);

  useMotionValueEvent(altitudeValue, "change", (latest) => {
    setAltitude(Math.round(latest));
  });

  useMotionValueEvent(temperatureValue, "change", (latest) => {
    setTemperature(Math.round(latest));
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      if (activeIndex < journeyPoints.length - 1) {
        scrollToPanel(activeIndex + 1);
      }
    } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      if (activeIndex > 0) {
        scrollToPanel(activeIndex - 1);
      }
    }
  };

  const scrollToPanel = (index: number) => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.offsetTop;
    const sectionHeight = sectionRef.current.offsetHeight;
    const targetScrollY = sectionTop + (index / (journeyPoints.length - 1)) * (sectionHeight - window.innerHeight);
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  };

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden bg-black"
        role="region"
        aria-roledescription="carousel"
        aria-label="Bhutan Trek Journey"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
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
                {altitude}'
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            className="px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60 uppercase tracking-wider">Temp</span>
              <motion.span className="text-2xl font-black text-white font-mono">
                {temperature}°F
              </motion.span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute top-20 right-8 z-30 text-right"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-2">
            THE <span className="text-orange-500">BHUTAN</span> TREK
          </h2>
          <p className="text-white/60 text-lg">7 Days. 14,000 Feet. One Record.</p>
        </motion.div>

        <motion.div
          ref={containerRef}
          style={{ x }}
          className="hidden md:flex h-full"
        >
          {journeyPoints.map((point, index) => (
            <div
              key={index}
              className="relative min-w-full h-full flex items-center justify-center px-6"
              role="group"
              aria-roledescription="slide"
              aria-label={`${point.title} - ${point.day}`}
            >
              <div className="absolute inset-0">
                <Image
                  src={point.image}
                  alt=""
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
              </div>

              <div className="relative z-10 max-w-4xl text-center">
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
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
                  
                  <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-orange-500/20 backdrop-blur-md border border-orange-500/50">
                    <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-3xl font-black text-white">
                      {point.altitude.toLocaleString()}'
                    </span>
                  </div>
                </motion.div>
              </div>

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

        <div className="md:hidden h-full overflow-y-auto pt-24 px-6 space-y-12 pb-24">
          {journeyPoints.map((point, index) => (
            <div key={index} className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={point.image}
                  alt={point.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20" />
                <div className="absolute bottom-4 left-4 text-orange-500 font-mono text-sm">
                  {point.day}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white leading-tight">
                  {point.title}
                </h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  {point.description}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30">
                  <span className="text-xl font-black text-white">
                    {point.altitude.toLocaleString()}'
                  </span>
                  <span className="text-xs text-white/40 uppercase tracking-widest">Altitude</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:block"
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
