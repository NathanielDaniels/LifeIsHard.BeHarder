'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function ProstheticReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const rotateY = useTransform(scrollYProgress, [0.1, 0.4, 0.6], [25, 0, -15]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.4, 0.7], [0.85, 1, 1.05]);
  
  const prostheticOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.75], [0, 1, 1, 0]);
  const triumphOpacity = useTransform(scrollYProgress, [0.5, 0.7, 0.9], [0, 1, 1]);

  const glowIntensity = useTransform(scrollYProgress, [0.2, 0.5, 0.7], [0.3, 0.8, 0.4]);

  return (
    <section ref={sectionRef} className="relative min-h-[200vh] py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity }} 
          className="relative w-full max-w-7xl mx-auto px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute top-8 left-0 right-0 text-center z-20"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              MY <span className="text-orange-500">REALITY</span>
            </h2>
            <p className="text-xl text-white/80 font-light">
              This is what I carry. This is what carries me.
            </p>
          </motion.div>

          <div className="relative h-[70vh] flex items-center justify-center">
            <motion.div
              style={{
                opacity: prostheticOpacity,
                rotateY,
                scale,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div 
                className="relative w-full max-w-2xl aspect-[3/4] rounded-3xl overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <motion.div
                  style={{ opacity: glowIntensity }}
                  className="absolute -inset-1 rounded-3xl z-0"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(249, 115, 22, 0.3), inset 0 0 30px rgba(249, 115, 22, 0.1)',
                      '0 0 60px rgba(249, 115, 22, 0.5), inset 0 0 40px rgba(249, 115, 22, 0.2)',
                      '0 0 30px rgba(249, 115, 22, 0.3), inset 0 0 30px rgba(249, 115, 22, 0.1)',
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border border-orange-500/30">
                  <Image
                    src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80"
                    alt="Carbon fiber running blade - Engineering meets determination"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      viewport={{ once: true }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2 text-orange-500 text-sm font-mono">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        PROSTHETIC LIMB SYSTEM
                      </div>
                      <p className="text-white/80 text-lg font-light">
                        Carbon fiber. Titanium core. <span className="text-orange-500 font-bold">Infinite determination.</span>
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: triumphOpacity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 50px rgba(249, 115, 22, 0.4)',
                      '0 0 100px rgba(249, 115, 22, 0.6)',
                      '0 0 50px rgba(249, 115, 22, 0.4)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-2 rounded-3xl z-0"
                />
                
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-orange-500">
                  <Image
                    src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80"
                    alt="Marathon triumph"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-12 text-center">
                    <motion.h3
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-6xl font-black text-white mb-4"
                      style={{
                        textShadow: '0 0 40px rgba(249, 115, 22, 0.6)'
                      }}
                    >
                      THIS IS MY <span className="text-orange-500">ADVANTAGE</span>
                    </motion.h3>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute bottom-8 left-0 right-0 text-center px-6"
          >
            <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto">
              Some see a limitation. I see <span className="text-orange-500 font-bold">liberation</span>.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div
        className="fixed right-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-orange-500/30 rounded-full overflow-hidden hidden lg:block z-50"
      >
        <motion.div
          className="absolute top-0 left-0 right-0 bg-orange-500 rounded-full"
          style={{
            height: '100%',
            scaleY: scrollYProgress,
            transformOrigin: 'top',
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)'
          }}
        />
      </div>
    </section>
  );
}
