'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useSpring, useTransform, useScroll } from 'framer-motion';
import { useVitality } from '@/contexts/VitalityContext';
import { useWhoop } from '@/contexts/WhoopContext';
import GlitchText from '@/components/shared/GlitchText';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import FloatingParticles from '@/components/shared/FloatingParticles';
import BiometricCard from '@/components/shared/BiometricCard';
import EmailCapture from '@/components/shared/EmailCapture';
import SocialLinks from '@/components/shared/SocialLinks';
import RaceCalendar from '@/components/shared/RaceCalendar';
import CustomCursor from '@/components/shared/CustomCursor';

const ACCIDENT_DATE = new Date('2020-11-01');
const SOBRIETY_DATE = new Date('2020-1-20');
const NEXT_RACE_DATE = new Date('2026-4-11');

export default function ComingSoonClient() {
  const [phase, setPhase] = useState(0);

  const [mounted, setMounted] = useState(false);
  const [daysSinceAccident, setDaysSinceAccident] = useState(0);
  const [daysSober, setDaysSober] = useState(0);
  const [daysUntilRace, setDaysUntilRace] = useState(0);
  
  const [showScrollHint, setShowScrollHint] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    const timer = setTimeout(() => {
      if (!hasScrolledRef.current) setShowScrollHint(true);
    }, 8000);

    const onScroll = () => {
      hasScrolledRef.current = true;
      setShowScrollHint(false);
      window.removeEventListener('scroll', onScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { energyState, theme } = useVitality();

  const {
    stats: whoopStats, 
    connectionStatus, 
    isConnected,
    currentHeartRate,
    heartRateSource,
    mode: whoopMode,
  } = useWhoop();
  
  const heartbeat = currentHeartRate;
  const heartbeatDuration = 60 / heartbeat;

  const statusMessages = useMemo(() => {
    const messages = [
      { text: '> INIT Vitality Engine v2.1', delay: 0 },
      { text: '> Locating WINGERT_VITALITY_FEED...', delay: 0.5 },
    ];

    if (connectionStatus === 'connecting') {
      messages.push({ text: '> Establishing secure connection...', delay: 1.2 });
    } else if (connectionStatus === 'syncing' || connectionStatus === 'connected') {
      messages.push({ text: '> Handshake OK - Biometric stream detected', delay: 1.2 });
      messages.push({ text: `> Syncing heart rate... ${heartbeat} BPM`, delay: 1.8 });
      if (whoopStats.recovery !== null) {
        messages.push({ text: `> Recovery score: ${whoopStats.recovery}%`, delay: 2.3 });
      }
      if (whoopStats.strain !== null) {
        messages.push({ text: `> Daily strain: ${whoopStats.strain.toFixed(1)}`, delay: 2.6 });
      }
    } else {
      messages.push({ text: '> Connection failed - using cached data', delay: 1.2 });
      messages.push({ text: `> Fallback heart rate: ${heartbeat} BPM`, delay: 1.8 });
    }

    return messages;
  }, [connectionStatus, heartbeat, whoopStats.recovery, whoopStats.strain, whoopMode, isConnected]);

  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  function handleMouseMove(e: React.MouseEvent) {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPct = (clientX / innerWidth) - 0.5;
    const yPct = (clientY / innerHeight) - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
    mousePositionRef.current = { x: clientX, y: clientY };
    setMousePosition({ x: clientX, y: clientY });
  }

  const xLayer1 = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const yLayer1 = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);
  const xLayer2 = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const yLayer2 = useTransform(mouseY, [-0.5, 0.5], [-40, 40]);

  const { scrollYProgress } = useScroll();
  const floatX = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const floatXReverse = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const themeColor = theme.primaryColor;

  useEffect(() => {
    const today = new Date();
    setDaysSinceAccident(Math.floor((today.getTime() - ACCIDENT_DATE.getTime()) / (1000 * 60 * 60 * 24)));
    setDaysSober(Math.floor((today.getTime() - SOBRIETY_DATE.getTime()) / (1000 * 60 * 60 * 24)));
    setDaysUntilRace(Math.max(0, Math.floor((NEXT_RACE_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))));
  }, []);


  // === CONNECTION-SYNCED PROGRESS BAR ===
  const [loadingProgress, setLoadingProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    switch (connectionStatus) {
      case 'idle':
        targetProgressRef.current = 5;
        break;
      case 'connecting':
        targetProgressRef.current = 30;
        break;
      case 'syncing':
        targetProgressRef.current = 60;
        break;
      case 'connected':
      case 'error':
      case 'unauthorized':
        targetProgressRef.current = 100;
        break;
    }
  }, [connectionStatus]);

  useEffect(() => {
    const animate = () => {
      setLoadingProgress(prev => {
        const target = targetProgressRef.current;
        if (prev >= target) return prev;
        const diff = target - prev;
        if (diff < 2) return target; // Snap when very close so we actually reach 100
        const step = Math.max(0.5, diff * 0.08); // Ease-out feel
        return Math.min(target, prev + step);
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Don't rush the boot even if API is instant
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const dataReady = connectionStatus === 'connected' || connectionStatus === 'error' || connectionStatus === 'unauthorized';
  useEffect(() => {
    if (loadingProgress >= 99 && minTimeElapsed && phase === 0) {
      const timer = setTimeout(() => setPhase(1), 600); // Brief pause at 100% so user sees it complete
      return () => clearTimeout(timer);
    }
  }, [loadingProgress, minTimeElapsed, phase]);

  // Fallback if API hangs
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (phase === 0) {
        targetProgressRef.current = 100;
        setMinTimeElapsed(true);
      }
    }, 8000);
    return () => clearTimeout(fallback);
  }, [phase]);

  const cascadeStarted = useRef(false);
  useEffect(() => {
    if (phase === 1 && !cascadeStarted.current) {
      cascadeStarted.current = true;
      setTimeout(() => setPhase(2), 2000);
      setTimeout(() => setPhase(3), 2700);
      setTimeout(() => setPhase(4), 3400);
      setTimeout(() => setPhase(5), 3800);
      setTimeout(() => setPhase(6), 4200);
    }
  }, [phase]);

  useEffect(() => {
    document.body.style.overflow = phase < 1 ? 'hidden' : '';
  }, [phase]);

  return (
    <div 
      className="relative bg-[#050505] text-white overflow-x-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      <style>{`
        @keyframes glitch-1 {
          0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          92% { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 0); }
          94% { clip-path: inset(60% 0 10% 0); transform: translate(4px, 0); }
          96% { clip-path: inset(40% 0 30% 0); transform: translate(-2px, 0); }
          98% { clip-path: inset(10% 0 70% 0); transform: translate(2px, 0); }
        }
        @keyframes glitch-2 {
          0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          92% { clip-path: inset(70% 0 5% 0); transform: translate(4px, 0); }
          94% { clip-path: inset(5% 0 80% 0); transform: translate(-4px, 0); }
          96% { clip-path: inset(50% 0 20% 0); transform: translate(3px, 0); }
          98% { clip-path: inset(30% 0 50% 0); transform: translate(-3px, 0); }
        }
        @keyframes heartbeat-ecg {
          0% { transform: translateX(0) translateY(-50%); }
          100% { transform: translateX(-50%) translateY(-50%); }
        }
        @keyframes scroll-pulse {
          0%, 100% { opacity: 0.3; height: 60px; }
          50% { opacity: 1; height: 80px; }
        }
        ::selection { background-color: ${themeColor}4D; }
      `}</style>

      <CustomCursor themeColor={themeColor} isHovering={isHovering} mousePosition={mousePosition} />

      <div
        className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-[999] opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />

      <motion.div
        className="fixed top-[15%] left-[1%] font-display text-[12vw] text-white/[0.02] pointer-events-none z-[1] whitespace-nowrap font-bold tracking-tight"
        style={{ x: floatX }}
      >
        • UNSTOPPABLE • RELENTLESS • UNBROKEN • UNDEFEATED •
      </motion.div>
      <motion.div
        className="fixed bottom-[15%] right-[-10%] font-display text-[12vw] text-white/[0.02] pointer-events-none z-[1] whitespace-nowrap font-bold tracking-tight"
        style={{ x: floatXReverse }}
      >
        • RECORD BREAKER • DARE2TRI • ADAPTIVE ATHLETE • ELITE •
      </motion.div>

      <motion.div
        style={{ x: xLayer1, y: yLayer1 }}
        className="fixed inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-grid opacity-[0.1]" />
        <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
        <div className="absolute inset-0 vignette z-10" />

        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px]"
          style={{ backgroundColor: themeColor, opacity: 0.15 }}
        />
        
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px]"
          style={{ backgroundColor: themeColor, opacity: 0.1 }}
        />

        <FloatingParticles themeColor={themeColor} />
      </motion.div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
        <div 
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ animation: 'scan-line 8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
        />
      </div>

      {/* === INTRO SEQUENCE === */}
      <AnimatePresence>
        {phase < 1 && (
          <motion.div
            key="intro-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6"
          >
            <div className="absolute top-10 left-10 font-mono text-xs md:text-sm text-white/60 tracking-widest flex flex-col gap-2 overflow-hidden">
              {statusMessages.map((line, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: line.delay, duration: 0.3 }}
                >
                  {line.text}
                </motion.span>
              ))}
            </div>

            <div className="w-full max-w-xs relative mt-8">
               <motion.p
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.8 }}
                 className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/70 mb-6 text-center font-medium"
               >
                 CONNECTING TO PATRICK&apos;S BIOMETRICS
               </motion.p>
               
               <div className="relative w-24 h-32 mx-auto mb-6 flex flex-col items-center justify-end">
                 <svg
                   className="absolute bottom-0 w-full h-full text-white/10" 
                   viewBox="0 0 100 250" 
                   fill="currentColor"
                   style={{ transform: 'scaleX(-1)' }}
                 >
                   <circle cx="50" cy="24" r="14" />
                   <path d="M 30,52 Q 50,48 70,52 Q 86,52 86,68 L 86,138
                            A 5,5 0 0,1 76,138 L 76,80 Q 76,72 70,72 L 70,160
                            A 8,8 0 0,1 54,160 L 54,140 A 4,4 0 0,0 46,140 L 46,238
                            A 8,8 0 0,1 30,238 L 30,72 Q 24,72 24,80 L 24,138
                            A 5,5 0 0,1 14,138 L 14,68 Q 14,52 30,52 Z" />
                   <path d="M 60,166 L 60,185 L 58,188 L 58,196 L 60,199
                            L 60,220 L 58,222 L 58,228 L 60,230 L 60,240
                            L 55,242 L 55,246 L 69,246 L 69,242 L 64,240
                            L 64,230 L 66,228 L 66,222 L 64,220 L 64,199
                            L 66,196 L 66,188 L 64,185 L 64,166 Z" />
                 </svg>

                 {/* Filled state, clipped by loading progress */}
                 <div
                   className="absolute bottom-0 w-full overflow-hidden transition-all duration-300 ease-out flex justify-center"
                   style={{ height: `${loadingProgress}%` }}
                 >
                   <svg 
                     className="absolute bottom-0 w-full h-32" 
                     viewBox="0 0 100 250" 
                     fill={themeColor}
                     style={{ 
                       filter: `drop-shadow(0 0 6px ${themeColor})`,
                       transform: 'scaleX(-1)' 
                     }}
                   >
                     <circle cx="50" cy="24" r="14" />
                     <path d="M 30,52 Q 50,48 70,52 Q 86,52 86,68 L 86,138
                              A 5,5 0 0,1 76,138 L 76,80 Q 76,72 70,72 L 70,160
                              A 8,8 0 0,1 54,160 L 54,140 A 4,4 0 0,0 46,140 L 46,238
                              A 8,8 0 0,1 30,238 L 30,72 Q 24,72 24,80 L 24,138
                              A 5,5 0 0,1 14,138 L 14,68 Q 14,52 30,52 Z" />
                     <path d="M 60,166 L 60,185 L 58,188 L 58,196 L 60,199
                              L 60,220 L 58,222 L 58,228 L 60,230 L 60,240
                              L 55,242 L 55,246 L 69,246 L 69,242 L 64,240
                              L 64,230 L 66,228 L 66,222 L 64,220 L 64,199
                              L 66,196 L 66,188 L 64,185 L 64,166 Z" />
                   </svg>
                 </div>
               </div>
               
               <div className="flex justify-between items-end mt-3 font-mono text-sm tracking-widest text-white/80 border-t border-white/10 pt-4">
                  {loadingProgress >= 99 ? (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="uppercase"
                    >
                      {isConnected ? 'Link Established' : whoopMode === 'demo' ? 'Demo Mode' : 'Offline Mode'}
                    </motion.span>
                  ) : (
                    <span className="uppercase text-white/40">
                      {connectionStatus === 'connecting' ? 'Connecting...' : 
                       connectionStatus === 'syncing' ? 'Syncing Data...' : 
                       'Initializing...'}
                    </span>
                  )}
                  <span 
                    className="font-bold"
                    style={{ color: themeColor }}
                  >
                    {Math.round(loadingProgress)}%
                  </span>
               </div>

               <div className="absolute -left-4 -top-4 w-2 h-2 border-t border-l border-white/30" />
               <div className="absolute -right-4 -bottom-4 w-2 h-2 border-b border-r border-white/30" />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.7 }}
              className="absolute bottom-10 font-mono text-xs text-white/50 tracking-[0.2em]"
            >
              {isConnected ? 'VITALITY_STREAM // LIVE' : 'VITALITY_STREAM // DEMO'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[200px] -translate-y-1/2 overflow-hidden opacity-10 pointer-events-none">
          <svg
            className="absolute top-1/2 left-0 w-[200%] h-[150px]"
            viewBox="0 0 1200 150"
            preserveAspectRatio="none"
            style={{ animation: `heartbeat-ecg ${heartbeatDuration * 2}s linear infinite` }}
          >
            <path
              d="M0,75 L100,75 L120,75 L140,20 L160,130 L180,40 L200,110 L220,75 L300,75 L320,75 L340,20 L360,130 L380,40 L400,110 L420,75 L500,75 L520,75 L540,20 L560,130 L580,40 L600,110 L620,75 L700,75 L720,75 L740,20 L760,130 L780,40 L800,110 L820,75 L900,75 L920,75 L940,20 L960,130 L980,40 L1000,110 L1020,75 L1100,75 L1120,75 L1140,20 L1160,130 L1180,40 L1200,110"
              fill="none"
              stroke={themeColor}
              strokeWidth="2"
              style={{ filter: `drop-shadow(0 0 10px ${themeColor}99)` }}
            />
          </svg>
        </div>

        <motion.div
          style={{ x: xLayer2, y: yLayer2 }}
          className="relative z-30 text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <h2 className="text-lg md:text-xl font-light tracking-[0.4em] text-white/60 font-display uppercase">
              Patrick Wingert
            </h2>
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={phase >= 2 ? { width: '60px', opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-[2px] mx-auto mt-4"
              style={{ backgroundColor: themeColor }}
            />
          </motion.div>

          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 100, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-display font-bold leading-[0.85] tracking-tight">
                  <span className="block text-[clamp(4rem,15vw,13rem)] text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                    LIFE IS HARD.
                  </span>
                  <span className="block text-[clamp(4rem,15vw,13rem)]">
                    <GlitchText text="BE HARDER." themeColor={themeColor} />
                  </span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-8 font-mono text-[clamp(0.7rem,1.5vw,1rem)] tracking-[0.4em] text-white/40"
          >
            ADAPTIVE ATHLETE
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {showScrollHint && phase >= 3 && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-30"
            >
              <span className="font-mono text-[0.7rem] tracking-[0.3em] text-white/50">SCROLL</span>
              <div 
                className="w-[1.5px] h-8 bg-gradient-to-b to-transparent"
                style={{ 
                  background: `linear-gradient(to bottom, ${themeColor}, transparent)`,
                  animation: 'scroll-pulse 2s ease-in-out infinite'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent z-40"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative">
              <motion.svg 
                viewBox="0 0 24 24" 
                className="w-full h-full"
                style={{ fill: themeColor }}
                animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
                transition={{ duration: heartbeatDuration, repeat: Infinity, ease: "easeOut" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </motion.svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.7rem] font-mono tracking-[0.3em] text-white/60">LIVE HEART RATE</span>
              <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>
                {heartbeat} <span className="text-sm font-mono text-white/50">BPM</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {whoopStats.recovery !== null && (
              <div className="flex flex-col items-center">
                <span className="text-[0.65rem] font-mono tracking-[0.2em] text-white/50">RECOVERY</span>
                <span className="font-display font-bold" style={{ color: themeColor }}>{whoopStats.recovery}%</span>
              </div>
            )}
            {whoopStats.strain !== null && (
              <div className="flex flex-col items-center">
                <span className="text-[0.65rem] font-mono tracking-[0.2em] text-white/50">STRAIN</span>
                <span className="font-display font-bold" style={{ color: themeColor }}>{whoopStats.strain.toFixed(1)}</span>
              </div>
            )}
            {whoopStats.hrv !== null && (
              <div className="flex flex-col items-center">
                <span className="text-[0.65rem] font-mono tracking-[0.2em] text-white/50">HRV</span>
                <span className="font-display font-bold" style={{ color: themeColor }}>{Math.round(whoopStats.hrv)}ms</span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <div className="w-full h-[20vh] pointer-events-none" />

      {/* === THE STORY / STATS === */}
      <section className="relative min-h-screen flex items-center justify-center py-16 md:py-20 px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mb-8 md:mb-12"
          >
            <span 
              className="absolute -top-8 -left-4 text-[8rem] leading-none font-display opacity-20"
              style={{ color: themeColor }}
            >
              "
            </span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight">
              THEY SAID IT WAS{' '}
              <span className="relative inline-block">
                <span style={{ color: themeColor }}>IMPOSSIBLE.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute bottom-0 left-0 w-full h-1 origin-left"
                  style={{ backgroundColor: themeColor }}
                />
              </span>
              <br />
              THEY WERE WRONG.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex justify-center mb-8 md:mb-10 pointer-events-none"
          >
            <div className="relative pointer-events-auto">
              <div
                className="absolute inset-0 blur-[100px] opacity-20 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              <Image
                src="/pat-crop.png"
                alt="Patrick Wingert"
                width={800}
                height={800}
                className="relative z-10 object-contain drop-shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 max-h-[40vh] md:max-h-[45vh] w-auto"
                priority
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { value: daysSinceAccident, label: 'DAYS SINCE ACCIDENT' },
              { value: daysSober, label: 'DAYS SOBER' },
              { value: daysUntilRace, label: 'DAYS UNTIL NEXT RACE' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="text-center"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div 
                  className="font-display text-[clamp(3.5rem,10vw,7rem)] font-bold leading-none"
                  style={{ color: themeColor }}
                >
                  <AnimatedCounter value={stat.value} duration={2000 + i * 300} />
                </div>
                <div className="font-mono text-[0.7rem] md:text-[0.8rem] tracking-[0.3em] text-white/70 mt-2 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* === EMAIL CAPTURE === */}
      <section className="relative flex items-center justify-center py-32 md:py-48 px-6 min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-xl w-full text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[0.7rem] md:text-[0.75rem] tracking-[0.5em] text-white/60 mb-4 font-medium"
          >
            THE FULL STORY DROPS SOON
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-none"
          >
            DON'T MISS <span style={{ color: themeColor }}>THE MOMENT.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 mb-10 max-w-lg mx-auto leading-relaxed"
          >
            An immersive digital experience documenting the journey of breaking every limit. 
            Be the first to witness it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <EmailCapture themeColor={themeColor} onHoverChange={setIsHovering} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <SocialLinks onHoverChange={setIsHovering} />
          </motion.div>
        </motion.div>
      </section>

      {/* === LIVE BIOMETRICS === */}
      <section className="relative py-32 md:py-48 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-12">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isConnected ? '#00ff00' : themeColor, boxShadow: `0 0 10px ${isConnected ? '#00ff00' : themeColor}` }}
            />
            <h2 className="font-mono text-xs tracking-[0.5em] text-white/50 uppercase">
              {isConnected ? 'Live Biometrics' : 'Biometric Data'} - {new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </h2>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                label: 'RECOVERY',
                value: whoopStats.recovery,
                unit: '%',
                color: whoopStats.recovery !== null ? (whoopStats.recovery >= 67 ? '#00e676' : whoopStats.recovery >= 34 ? '#ffab00' : '#ff5252') : themeColor,
                delay: 0,
                condition: true,
                tooltipTitle: 'Body readiness score',
                tooltip: (
                  <>
                    <span style={{ color: '#00e676' }}>Green</span> = well recovered (67-100%).<br/>
                    <span style={{ color: '#ffab00' }}>Yellow</span> = maintaining (34-66%).<br/>
                    <span style={{ color: '#ff5252' }}>Red</span> = rest needed.
                  </>
                ),
              },
              {
                label: 'DAILY STRAIN',
                value: whoopStats.strain !== null ? whoopStats.strain.toFixed(1) : null,
                unit: '/21',
                color: themeColor,
                delay: 0.1,
                condition: true,
                tooltip: 'Cardiovascular load on a 0-21 scale. 14+ is High Strain, which builds fitness gains.',
              },
              {
                label: 'HEART RATE',
                value: heartbeat,
                unit: 'BPM',
                color: themeColor,
                delay: 0.2,
                condition: true,
                animateValue: { animate: { opacity: [1, 0.7, 1] }, transition: { duration: heartbeatDuration, repeat: Infinity } },
                subtext: whoopStats.restingHeartRate !== null ? `RESTING: ${whoopStats.restingHeartRate} • MAX: ${whoopStats.maxHeartRate || '--'}` : undefined,
                tooltip: 'Current heart rate in beats per minute, synced live from Patrick\'s WHOOP device.',
              },
              {
                label: 'HRV',
                value: whoopStats.hrv !== null ? Math.round(whoopStats.hrv) : null,
                unit: 'ms',
                color: themeColor,
                delay: 0.3,
                condition: true,
                tooltip: 'Heart rate variability in milliseconds. A key recovery indicator - higher generally means better recovery.',
              },
              {
                label: 'BLOOD OXYGEN',
                value: whoopStats.spo2 !== null ? Math.round(whoopStats.spo2) : null,
                unit: '%',
                color: themeColor,
                delay: 0.4,
                condition: false, // Hidden per user request
                tooltip: 'Blood oxygen saturation (SpO2). Healthy range is typically 95-100%.',
              },
              {
                label: 'SKIN TEMP',
                value: whoopStats.skinTemp !== null ? whoopStats.skinTemp.toFixed(1) : null,
                unit: '°C',
                color: themeColor,
                delay: 0.5,
                condition: false, // Hidden per user request
                tooltip: 'Skin temperature in Celsius, monitored continuously by WHOOP.',
              },
              {
                label: 'CALORIES',
                value: whoopStats.calories !== null ? whoopStats.calories.toLocaleString() : null,
                unit: 'kcal',
                color: themeColor,
                delay: 0.6,
                condition: whoopStats.calories !== null,
                tooltip: 'Total calories burned today based on continuous monitoring.',
              },
              {
                label: 'AVG HEART RATE',
                value: whoopStats.averageHeartRate,
                unit: 'BPM',
                color: themeColor,
                delay: 0.7,
                condition: whoopStats.averageHeartRate !== null,
                tooltip: 'Average heart rate across all activity today.',
              },
            ].filter(card => card.condition).map((card, i) => (
              <BiometricCard
                key={card.label}
                label={card.label}
                value={card.value}
                unit={card.unit}
                color={card.color}
                delay={card.delay}
                subtext={card.subtext}
                tooltip={card.tooltip}
                tooltipTitle={card.tooltipTitle}
                animateValue={card.animateValue}
                index={i}
              />
            ))}
          </div>

          {whoopStats.lastWorkout && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 bg-white/[0.03] border border-white/10 rounded-lg p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: themeColor }} />
                <div>
                  <span className="font-mono text-[0.75rem] tracking-[0.3em] text-white/60 block">LAST WORKOUT</span>
                  <span className="font-display text-2xl font-bold uppercase" style={{ color: themeColor }}>
                    {whoopStats.lastWorkout.sport}
                  </span>
                </div>
                <span className="ml-auto font-mono text-[0.75rem] text-white/40">
                  {new Date(whoopStats.lastWorkout.completedAt).toLocaleDateString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric' })} • {whoopStats.lastWorkout.duration} min
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/50 block">STRAIN</span>
                  <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>{whoopStats.lastWorkout.strain.toFixed(1)}</span>
                </div>
                <div>
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/50 block">AVG HR</span>
                  <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>{whoopStats.lastWorkout.averageHeartRate} <span className="text-base font-mono text-white/40">BPM</span></span>
                </div>
                <div>
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/50 block">MAX HR</span>
                  <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>{whoopStats.lastWorkout.maxHeartRate} <span className="text-base font-mono text-white/40">BPM</span></span>
                </div>
                <div>
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/50 block">CALORIES</span>
                  <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>{whoopStats.lastWorkout.calories} <span className="text-base font-mono text-white/40">kcal</span></span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-8 font-mono text-[0.65rem] md:text-[0.75rem] tracking-[0.2em] text-white/50">
            <span className="whitespace-nowrap">POWERED BY WHOOP</span>
            <span className="hidden sm:inline opacity-50">•</span>
            <span className="whitespace-nowrap">{isConnected ? 'LIVE DATA' : 'DEMO DATA'}</span>
            {whoopStats.lastUpdated && (
              <>
                <span className="hidden sm:inline opacity-50">•</span>
                <span className="whitespace-nowrap">UPDATED {new Date(whoopStats.lastUpdated).toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit' })}</span>
              </>
            )}
          </div>
        </motion.div>
      </section>

      <section className="relative w-full flex justify-center py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] md:blur-[120px]"
            style={{ backgroundColor: themeColor }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative pointer-events-auto z-10 w-full max-w-5xl px-6"
        >
          <motion.div
            initial={{ scale: 1 }}
            whileInView={{ scale: 1.05 }}
            viewport={{ once: true, margin: "-30% 0px -30% 0px", amount: 0.3 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Image
              src="/pat-run.jpg"
              alt="Patrick Wingert running background"
              width={1200}
              height={1200}
              className="relative z-0 object-contain drop-shadow-2xl grayscale max-h-[85vh] w-full"
              priority
            />
          </motion.div>
          
          {/* Color overlay reveals on scroll */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              whileInView={{ opacity: 1, scale: 1.05 }}
              viewport={{ once: true, margin: "-30% 0px -30% 0px", amount: 0.3 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 top-0 left-0 px-6 z-10"
            >
              <Image
                src="/pat-crop-run.png"
                alt="Patrick Wingert running color overlay"
                width={1200}
                height={1200}
                className="w-full h-full object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* === RACE SCHEDULE === */}
      <section className="relative py-32 md:py-48 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto"
        >
          <RaceCalendar themeColor={themeColor} />
        </motion.div>
      </section>

      {/* === SPONSORS === */}
      <section className="relative z-20 py-32 md:py-40 px-6 backdrop-blur-2xl border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-16 w-full opacity-80">
            <div className="h-px bg-gradient-to-r from-transparent to-white/20 flex-1 max-w-[60px] md:max-w-[150px]" />
            <div className="flex items-center gap-3">
              <div 
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse flex-shrink-0"
                style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}
              />
              <h2 className="font-mono text-[0.65rem] md:text-sm tracking-[0.4em] md:tracking-[0.5em] text-white/70 uppercase text-center mt-0.5">
                SPONSORS
              </h2>
            </div>
            <div className="h-px bg-gradient-to-l from-transparent to-white/20 flex-1 max-w-[60px] md:max-w-[150px]" />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-20 pr-8 md:pr-16">
            {[
              { src: '/sponsors/ATF_logo.png', link: 'https://www.adaptivetrainingfoundation.org/', alt: 'Adaptive Training Foundation', className: 'h-28 md:h-36 lg:h-44 invert brightness-200' },
              // Invert turns the white background black and logo white. Mix-blend-screen then makes the black background invisible
              { src: '/sponsors/CAF_logo.png', link: 'https://www.challengedathletes.org/', alt: 'Sponsor 3', className: 'h-24 md:h-32 mix-blend-screen invert grayscale group-hover:grayscale-0 group-hover:invert-0 opacity-100 rounded-[50%] object-cover' },
              { src: '/sponsors/david-rotter-logo_orig.png', link: 'https://www.rotterprosthetics.com/', alt: 'David Rotter Prosthetics', className: 'h-16 md:h-20 grayscale group-hover:grayscale-0 brightness-200 group-hover:brightness-100' },
            ].map((sponsor, i) => (
              <motion.div
                key={sponsor.alt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative cursor-pointer transition-opacity duration-500 opacity-40 hover:opacity-100 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {sponsor.link ? (
                  <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="block outline-none">
                    <img 
                      src={sponsor.src} 
                      alt={sponsor.alt}
                      className={`object-contain transition-all duration-500 ${sponsor.className}`}
                    />
                  </a>
                ) : (
                  <img 
                    src={sponsor.src} 
                    alt={sponsor.alt}
                    className={`object-contain transition-all duration-500 ${sponsor.className}`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* === FOOTER === */}
      <footer className="relative z-20 py-8 px-6 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto flex flex-row justify-between items-center gap-4">
          <span className="font-display text-base tracking-[0.2em] text-white/60">
            PATRICK WINGERT
          </span>
          <a 
            href="https://dare2tri.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-end opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer outline-none"
          >
            <Image 
              src="/sponsors/D2T_logo_short.webp" 
              alt="Dare2Tri Elite Team Athlete." 
              width={120} 
              height={40} 
              className="object-contain"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}