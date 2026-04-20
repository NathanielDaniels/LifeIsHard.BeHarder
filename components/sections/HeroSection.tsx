'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  const [heartbeat, setHeartbeat] = useState(72); // TODO: connect to WHOOP
  const [showContent, setShowContent] = useState(false);
  const [showMotto, setShowMotto] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1500));
      if (!isMounted) return;
      setShowContent(true);
      await new Promise(r => setTimeout(r, 800));
      if (!isMounted) return;
      setShowMotto(true);
      await new Promise(r => setTimeout(r, 1200));
      if (!isMounted) return;
      setShowDetails(true);
    };

    sequence();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const pulse = setInterval(() => {
      controls.start({
        scale: [1, 1.03, 1],
        transition: { duration: 0.6, ease: "easeInOut" }
      });
    }, 60000 / heartbeat);

    return () => clearInterval(pulse);
  }, [heartbeat, controls]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence>
        {!showContent && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 60 / heartbeat,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
                filter: 'blur(40px)'
              }}
            />
            
            <motion.span
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 60 / heartbeat,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-orange-500/30 text-sm font-mono tracking-widest"
            >
              ...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={controls}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.15) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.95) 100%)'
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.3, opacity: 0 }}
        animate={showContent ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80"
          alt="Patrick Wingert"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-4xl font-light text-white/80 tracking-[0.3em] mb-2">
            PATRICK WINGERT
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={showContent ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto" 
          />
        </motion.div>

        <AnimatePresence>
          {showMotto && (
            <motion.div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 blur-2xl"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.4) 0%, transparent 70%)'
                }}
              />
              
              <motion.h1
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  filter: 'blur(0px)',
                }}
                transition={{ 
                  duration: 1.5, 
                  ease: [0.16, 1, 0.3, 1] // Custom easing for dramatic effect
                }}
                className="relative text-5xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tight"
                style={{
                  textShadow: '0 0 60px rgba(249, 115, 22, 0.6), 0 0 120px rgba(249, 115, 22, 0.3), 0 4px 30px rgba(0,0,0,0.5)'
                }}
              >
                LIFE IS HARD.
                <br />
                <motion.span 
                  className="text-orange-500 inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  style={{
                    textShadow: '0 0 80px rgba(249, 115, 22, 0.8), 0 0 160px rgba(249, 115, 22, 0.4)'
                  }}
                >
                  BE HARDER.
                </motion.span>
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={showDetails ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-lg md:text-2xl text-white/70 font-light max-w-3xl"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={showDetails ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block"
          >
            Dare2tri Elite Team Athlete
          </motion.span>
          <span className="mx-4 text-orange-500">•</span>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={showDetails ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="inline-block"
          >
            Record-Setting Trekker
          </motion.span>
          <span className="mx-4 text-orange-500">•</span>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={showDetails ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="inline-block"
          >
            Unstoppable
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={showDetails ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-16 flex items-center gap-3"
        >
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 60 / heartbeat,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-3 h-3 rounded-full bg-orange-500"
            style={{
              boxShadow: '0 0 25px rgba(249, 115, 22, 0.9)'
            }}
          />
          <span className="text-sm text-white/80 font-mono tracking-wider">
            LIVE • {heartbeat} BPM
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={showDetails ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/60 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-orange-500/60 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
