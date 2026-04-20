'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function TheShift() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const leftX = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1]);

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black" />

      <motion.div style={{ opacity }} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20 px-6"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            THE <span className="text-orange-500">SHIFT</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-light">
            One moment changed everything. What came next defined everything.
          </p>
        </motion.div>

        <div className="relative h-[600px] max-w-7xl mx-auto px-6">
          <div className="relative h-full flex gap-4">
            <motion.div
              style={{ x: leftX, scale }}
              className="flex-1 relative rounded-2xl overflow-hidden group"
            >
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                alt="Hospital/Recovery"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-4">
                    THE SETBACK
                  </h3>
                  <p className="text-white/80 text-lg md:text-xl font-light max-w-md">
                    Life had other plans. An injury that could have ended everything became the starting line.
                  </p>
                </motion.div>
              </div>

              <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-orange-500/20 to-transparent pointer-events-none" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-20 h-20 rounded-full border-2 border-orange-500"
                  style={{
                    boxShadow: '0 0 40px rgba(249, 115, 22, 0.6), inset 0 0 20px rgba(249, 115, 22, 0.3)'
                  }}
                />
                
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-orange-500" aria-hidden="true">
                    <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              style={{ x: rightX, scale }}
              className="flex-1 relative rounded-2xl overflow-hidden group"
            >
              <Image
                src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80"
                alt="Athletic transformation"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-4">
                    THE COMEBACK
                  </h3>
                  <p className="text-white/80 text-lg md:text-xl font-light max-w-md">
                    Breaking records. Crushing mountains. Proving what's possible when you refuse to quit.
                  </p>
                </motion.div>
              </div>

              <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-orange-500/20 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center px-6"
        >
          <p className="text-2xl md:text-4xl font-light text-white/80 max-w-4xl mx-auto leading-relaxed">
            The injury took my leg.
            <br />
            It couldn't take my <span className="text-orange-500 font-bold">fire</span>.
            <br />
            A setback became a <span className="text-orange-500 font-bold">setup</span> for something greater.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
