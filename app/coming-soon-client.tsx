'use client';

import { useEffect, useState, useRef, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useScroll } from 'framer-motion';
import { useVitality } from '@/contexts/VitalityContext';
import { useWhoop } from '@/contexts/WhoopContext';

// ============================================
// UPDATE THESE DATES WITH ACTUAL VALUES
// ============================================
const ACCIDENT_DATE = new Date('2020-11-01');
const SOBRIETY_DATE = new Date('2020-1-20');
const NEXT_RACE_DATE = new Date('2026-4-11');
// ============================================

// --- Sub-components ---

function FloatingParticles({ themeColor }: { themeColor: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full blur-[1px] animate-float-particle"
          style={{
            backgroundColor: themeColor,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0.4,
            // @ts-expect-error custom css vars
            '--delay': p.delay,
            '--duration': p.duration,
            '--particle-opacity': 0.3 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}

// Glitch text effect for "BE HARDER."
function GlitchText({ text, themeColor }: { text: string; themeColor: string }) {
  return (
    <span className="relative inline-block">
      <span 
        className="relative z-10"
        style={{ 
          color: themeColor,
          textShadow: `0 0 30px ${themeColor}66, 3px 3px 0 rgba(0,0,0,0.4)`
        }}
      >
        {text}
      </span>
      {/* Cyan ghost */}
      <span 
        className="absolute top-0 left-0 z-0 opacity-80"
        style={{ 
          color: '#0ff',
          animation: 'glitch-1 3s infinite'
        }}
        aria-hidden="true"
      >
        {text}
      </span>
      {/* Magenta ghost */}
      <span 
        className="absolute top-0 left-0 z-0 opacity-80"
        style={{ 
          color: '#f0f',
          animation: 'glitch-2 3s infinite'
        }}
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}

// Animated counter that counts up
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayValue(Math.floor(eased * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration, hasAnimated]);

  return <>{displayValue.toLocaleString()}</>;
}

interface BiometricCardProps {
  label: string;
  value: string | number | null;
  unit: string;
  color: string;
  delay: number;
  subtext?: string;
  animateValue?: { animate: Record<string, unknown>; transition: Record<string, unknown> };
}

function BiometricCard({ label, value, unit, color, delay, subtext, animateValue }: BiometricCardProps) {
  const ValueTag = animateValue ? motion.span : 'span';
  const valueProps = animateValue ? animateValue : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/[0.03] border border-white/10 rounded-lg p-5 backdrop-blur-sm"
    >
      <span className="font-mono text-[0.75rem] tracking-[0.3em] text-white/60 block mb-3">{label}</span>
      <div className="flex items-end gap-1">
        <ValueTag
          className="font-display text-5xl md:text-6xl font-bold leading-none"
          style={{ color }}
          {...valueProps}
        >
          {value !== null ? value : '—'}
        </ValueTag>
        <span className="font-mono text-sm text-white/50 mb-1">{unit}</span>
      </div>
      {subtext && (
        <span className="font-mono text-[0.65rem] text-white/40 mt-2 block">
          {subtext}
        </span>
      )}
    </motion.div>
  );
}

// --- Main Component ---

export default function ComingSoonClient() {
  const [phase, setPhase] = useState(0);
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Date counters
  const [daysSinceAccident, setDaysSinceAccident] = useState(0);
  const [daysSober, setDaysSober] = useState(0);
  const [daysUntilRace, setDaysUntilRace] = useState(0);
  
  // Scroll indicator (delayed appearance, hides on scroll)
  const [showScrollHint, setShowScrollHint] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
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

  // Custom cursor
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Vitality Integration
  const { energyState, theme } = useVitality();

    // ============================================
  // WHOOP Integration
  // ============================================
  const { 
    stats: whoopStats, 
    connectionStatus, 
    isConnected,
    currentHeartRate,
    heartRateSource,
    mode: whoopMode,
  } = useWhoop();
  
  // const getHeartRate = () => {
  //   switch (energyState) {
  //     case 'HIGH': return 160;
  //     case 'MEDIUM': return 120;
  //     case 'LOW': return 65;
  //     default: return 72;
  //   }
  // };
  // const heartbeat = getHeartRate();
  // const heartbeatDuration = 60 / heartbeat;
  const heartbeat = currentHeartRate;
  const heartbeatDuration = 60 / heartbeat;

    // Dynamic status messages based on real connection
  const statusMessages = useMemo(() => {
    const messages = [
      { text: '> INIT Vitality Engine v2.1', delay: 0 },
      { text: '> Locating WINGERT_VITALITY_FEED...', delay: 0.5 },
    ];

    if (connectionStatus === 'connecting') {
      messages.push({ text: '> Establishing secure connection...', delay: 1.2 });
    } else if (connectionStatus === 'syncing' || connectionStatus === 'connected') {
      messages.push({ text: '> Handshake OK — Biometric stream detected', delay: 1.2 });
      messages.push({ text: `> Syncing heart rate... ${heartbeat} BPM`, delay: 1.8 });
      if (whoopStats.recovery !== null) {
        messages.push({ text: `> Recovery score: ${whoopStats.recovery}%`, delay: 2.3 });
      }
      if (whoopStats.strain !== null) {
        messages.push({ text: `> Daily strain: ${whoopStats.strain.toFixed(1)}`, delay: 2.6 });
      }
    } else {
      messages.push({ text: '> Connection failed — using cached data', delay: 1.2 });
      messages.push({ text: `> Fallback heart rate: ${heartbeat} BPM`, delay: 1.8 });
    }

    return messages;
  }, [connectionStatus, heartbeat, whoopStats.recovery, whoopStats.strain, whoopMode, isConnected]);

  // 3D Parallax Logic
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

  // Layer transforms
  const xLayer1 = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const yLayer1 = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);
  const xLayer2 = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const yLayer2 = useTransform(mouseY, [-0.5, 0.5], [-40, 40]);

  // Scroll for parallax text
  const { scrollYProgress } = useScroll();
  const floatX = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const floatXReverse = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const themeColor = theme.primaryColor;

  // Calculate date counters
  useEffect(() => {
    const today = new Date();
    setDaysSinceAccident(Math.floor((today.getTime() - ACCIDENT_DATE.getTime()) / (1000 * 60 * 60 * 24)));
    setDaysSober(Math.floor((today.getTime() - SOBRIETY_DATE.getTime()) / (1000 * 60 * 60 * 24)));
    setDaysUntilRace(Math.max(0, Math.floor((NEXT_RACE_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))));
  }, []);

  // Smooth cursor follow
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setCursorPosition(prev => ({
        x: prev.x + (mousePositionRef.current.x - prev.x) * 0.15,
        y: prev.y + (mousePositionRef.current.y - prev.y) * 0.15,
      }));
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

    // ============================================
  // CONNECTION-SYNCED PROGRESS BAR
  // ============================================
  const [loadingProgress, setLoadingProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Map connectionStatus → target progress milestone
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

  // Smoothly animate loadingProgress toward target
  useEffect(() => {
    const animate = () => {
      setLoadingProgress(prev => {
        const target = targetProgressRef.current;
        if (prev >= target) return prev;
        const diff = target - prev;
        // Snap when very close so we actually reach 100
        if (diff < 2) return target;
        // Fast when far away, slow when close (ease-out feel)
        const step = Math.max(0.5, diff * 0.08);
        return Math.min(target, prev + step);
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Minimum cinematic time (don't rush the boot even if API is instant)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Transition to phase 1 when bar is at 100% AND min time passed
  const dataReady = connectionStatus === 'connected' || connectionStatus === 'error' || connectionStatus === 'unauthorized';
  useEffect(() => {
    if (loadingProgress >= 99 && minTimeElapsed && phase === 0) {
      // Brief pause at 100% so user sees it complete
      const timer = setTimeout(() => setPhase(1), 600);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress, minTimeElapsed, phase]);

  // Fallback: if API hangs, force transition after 8s
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (phase === 0) {
        targetProgressRef.current = 100;
        setMinTimeElapsed(true);
      }
    }, 8000);
    return () => clearTimeout(fallback);
  }, [phase]);

  // Subsequent phases (cascade after boot completes)
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

  // Lock scroll during boot sequence
  // useEffect(() => {
  //   if (phase < 1) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = '';
  //   }
  // }, [phase]);
    // Lock scroll during intro
  useEffect(() => {
    document.body.style.overflow = phase < 1 ? 'hidden' : '';
  }, [phase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || submitState === 'loading') return;

    setSubmitState('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitState('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setSubmitState('error');
        setMessage(data.error);
      }
    } catch {
      setSubmitState('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/patwingzzz' },
    { name: 'Strava', href: 'https://www.strava.com' },
    { name: 'Dare2tri', href: 'https://give.dare2tri.org/fundraiser/6928347' },
  ];

  return (
    <div 
      className="relative bg-[#050505] text-white overflow-x-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      {/* Glitch keyframes */}
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

      {/* Custom Cursor */}
      <div
        className="fixed w-5 h-5 border rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100"
        style={{ 
          left: cursorPosition.x, 
          top: cursorPosition.y, 
          transform: `translate(-50%, -50%) scale(${isHovering ? 2 : 1})`,
          borderColor: themeColor 
        }}
      />
      <div
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[10000]"
        style={{ 
          left: mousePosition.x, 
          top: mousePosition.y, 
          transform: 'translate(-50%, -50%)',
          backgroundColor: themeColor 
        }}
      />

      {/* Noise Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-[999] opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* Floating Background Text */}
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

      {/* --- LAYER 1: ATMOSPHERE (Parallax Depth 1) --- */}
      <motion.div 
        style={{ x: xLayer1, y: yLayer1 }}
        className="fixed inset-0 pointer-events-none"
      >
        {/* Grid Texture */}
        <div className="absolute inset-0 bg-grid opacity-[0.1]" />
        
        {/* Film Grain Noise */}
        <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
        
        {/* Vignette */}
        <div className="absolute inset-0 vignette z-10" />

        {/* Primary Ambient Glow */}
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px]"
          style={{ backgroundColor: themeColor, opacity: 0.15 }}
        />
        
        {/* Secondary glow bottom right */}
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px]"
          style={{ backgroundColor: themeColor, opacity: 0.1 }}
        />

        <FloatingParticles themeColor={themeColor} />
      </motion.div>

      {/* Running Scan Line */}
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
            {/* Top-left: scrolling status log */}
            {/* <div className="absolute top-10 left-10 font-mono text-xs md:text-sm text-white/60 tracking-widest flex flex-col gap-2 overflow-hidden">
              {[
                { text: '> INIT Vitality Engine v2.1', delay: 0 },
                { text: '> Locating WINGERT_VITALITY_FEED...', delay: 0.5 },
                { text: '> Handshake OK — Biometric stream detected', delay: 1.2 },
                { text: `> Syncing heart rate... ${heartbeat} BPM`, delay: 1.8 },
                { text: `> Energy state: ${energyState}`, delay: 2.3 },
              ].map((line, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: line.delay, duration: 0.3 }}
                >
                  {line.text}
                </motion.span>
              ))}
            </div> */}
            {/* Status Log - DYNAMIC */}
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

            {/* Center Loader */}
            <div className="w-full max-w-xs relative">
               {/* Label above bar */}
               <motion.p
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.8 }}
                 className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/70 mb-3 text-center font-medium"
               >
                 CONNECTING TO PATRICK&apos;S BIOMETRICS
               </motion.p>

               {/* Progress Line */}
               <div className="h-[2px] w-full bg-white/10 overflow-hidden">
                 <div 
                   className="h-full transition-all duration-300 ease-out"
                   style={{ 
                     width: `${loadingProgress}%`,
                     backgroundColor: themeColor 
                   }}
                 />
               </div>
               
               {/* Status Text */}
               <div className="flex justify-between items-end mt-3 font-mono text-sm tracking-widest text-white/80">
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

               {/* Decorative brackets */}
               <div className="absolute -left-4 -top-4 w-2 h-2 border-t border-l border-white/30" />
               <div className="absolute -right-4 -bottom-4 w-2 h-2 border-b border-r border-white/30" />
            </div>
            
            {/* Bottom Status */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.7 }}
              className="absolute bottom-10 font-mono text-xs text-white/50 tracking-[0.2em]"
            >
              {/* VITALITY_STREAM // LIVE */}
              {isConnected ? 'VITALITY_STREAM // LIVE' : 'VITALITY_STREAM // DEMO'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          SECTION 1: HERO
          ========================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Heartbeat ECG Line */}
        <div className="absolute top-1/2 left-0 w-full h-[200px] -translate-y-1/2 overflow-hidden opacity-10 pointer-events-none">
          <svg
            className="absolute top-1/2 left-0 w-[200%] h-[150px]"
            viewBox="0 0 1200 150"
            preserveAspectRatio="none"
            // style={{ animation: 'heartbeat-ecg 2s linear infinite' }}
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

        {/* Hero Content */}
        <motion.div 
          style={{ x: xLayer2, y: yLayer2 }}
          className="relative z-30 text-center px-6"
        >
          {/* Name */}
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

          {/* Main Title */}
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

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-8 font-mono text-[clamp(0.7rem,1.5vw,1rem)] tracking-[0.4em] text-white/40"
          >
            ADAPTIVE ATHLETE
          </motion.p>
        </motion.div>

        {/* Scroll Indicator — appears after 3s idle, vanishes on scroll */}
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

        {/* Live Stats Bar */}
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
           {/* WHOOP stats */}
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

      {/* ==========================================
          SECTION 2: THE STORY / STATS
          ========================================== */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="max-w-4xl text-center"
        >
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mb-16"
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

          {/* Stats Grid */}
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

      {/* ==========================================
          SECTION 2.5: LIVE BIOMETRICS
          ========================================== */}
      <section className="relative py-24 px-6">
        {/* Section Header */}
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
              {isConnected ? 'Live Biometrics' : 'Biometric Data'} — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </h2>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                label: 'RECOVERY',
                value: whoopStats.recovery,
                unit: '%',
                color: whoopStats.recovery !== null ? (whoopStats.recovery >= 67 ? '#00e676' : whoopStats.recovery >= 34 ? '#ffab00' : '#ff5252') : themeColor,
                delay: 0,
                condition: true,
              },
              {
                label: 'DAILY STRAIN',
                value: whoopStats.strain !== null ? whoopStats.strain.toFixed(1) : null,
                unit: '/21',
                color: themeColor,
                delay: 0.1,
                condition: true,
              },
              {
                label: 'HEART RATE',
                value: heartbeat,
                unit: 'BPM',
                color: themeColor,
                delay: 0.2,
                condition: true,
                animateValue: { animate: { opacity: [1, 0.7, 1] }, transition: { duration: heartbeatDuration, repeat: Infinity } },
                subtext: whoopStats.restingHeartRate !== null ? `RESTING: ${whoopStats.restingHeartRate} • MAX: ${whoopStats.maxHeartRate || '—'}` : undefined,
              },
              {
                label: 'HRV',
                value: whoopStats.hrv !== null ? Math.round(whoopStats.hrv) : null,
                unit: 'ms',
                color: themeColor,
                delay: 0.3,
                condition: true,
              },
              {
                label: 'BLOOD OXYGEN',
                value: whoopStats.spo2 !== null ? Math.round(whoopStats.spo2) : null,
                unit: '%',
                color: themeColor,
                delay: 0.4,
                condition: whoopStats.spo2 !== null,
              },
              {
                label: 'SKIN TEMP',
                value: whoopStats.skinTemp !== null ? whoopStats.skinTemp.toFixed(1) : null,
                unit: '°C',
                color: themeColor,
                delay: 0.5,
                condition: whoopStats.skinTemp !== null,
              },
              {
                label: 'CALORIES',
                value: whoopStats.calories !== null ? whoopStats.calories.toLocaleString() : null,
                unit: 'kcal',
                color: themeColor,
                delay: 0.6,
                condition: whoopStats.calories !== null,
              },
              {
                label: 'AVG HEART RATE',
                value: whoopStats.averageHeartRate,
                unit: 'BPM',
                color: themeColor,
                delay: 0.7,
                condition: whoopStats.averageHeartRate !== null,
              },
            ].filter(card => card.condition).map((card) => (
              <BiometricCard
                key={card.label}
                label={card.label}
                value={card.value}
                unit={card.unit}
                color={card.color}
                delay={card.delay}
                subtext={card.subtext}
                animateValue={card.animateValue}
              />
            ))}
          </div>

          {/* Last Workout Card */}
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
                  {new Date(whoopStats.lastWorkout.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {whoopStats.lastWorkout.duration} min
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

          {/* Data source footer */}
          <div className="flex items-center justify-center gap-2 mt-8 font-mono text-[0.75rem] tracking-[0.2em] text-white/50">
            <span>POWERED BY WHOOP</span>
            <span>•</span>
            <span>{isConnected ? 'LIVE DATA' : 'DEMO DATA'}</span>
            {whoopStats.lastUpdated && (
              <>
                <span>•</span>
                <span>UPDATED {new Date(whoopStats.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          SECTION 3: EMAIL CAPTURE
          ========================================== */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-6 bg-gradient-to-b from-transparent via-black/50 to-black">
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
          
          {/* <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(2rem,6vw,4rem)] font-bold mb-4"
          >
            DON'T MISS <span style={{ color: themeColor }}>THE MOMENT.</span>
          </motion.h2> */}

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

          {/* Email Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            {submitState === 'success' ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 rounded-xl border text-center"
                style={{ 
                  backgroundColor: `${themeColor}1A`, 
                  borderColor: `${themeColor}4D`,
                  color: themeColor
                }}
              >
                <span className="text-2xl mb-2 block">✓</span>
                {message}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative group">
                <div 
                  className="relative flex bg-white/[0.03] border border-white/10 rounded-xl p-1.5 backdrop-blur-sm transition-shadow duration-500"
                  style={{
                    boxShadow: isFocused 
                      ? `0 0 25px ${themeColor}99, 0 0 60px ${themeColor}33` 
                      : `0 0 0px ${themeColor}00`
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => { setIsFocused(true); setIsHovering(true); }}
                    onBlur={() => { setIsFocused(false); setIsHovering(false); }}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent px-5 py-4 text-white placeholder:text-white/30 focus:outline-none font-mono text-base"
                  />
                  <button
                    type="submit"
                    disabled={submitState === 'loading'}
                    className="px-10 py-4 font-display font-bold uppercase tracking-wider text-base rounded-lg transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: themeColor,
                      color: 'white',
                      boxShadow: `0 0 30px ${themeColor}4D`
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {submitState === 'loading' ? '...' : 'NOTIFY ME'}
                  </button>
                </div>
              </form>
            )}
            {submitState === 'error' && (
              <p className="text-red-500 text-sm mt-3">{message}</p>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-8"
          >
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative font-mono text-[0.75rem] md:text-[0.85rem] tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 group font-medium"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {link.name}
                <span 
                  className="absolute -bottom-1 left-0 w-full h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ backgroundColor: themeColor }}
                />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className="relative py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-display text-base tracking-[0.2em] text-white/60">
            PATRICK WINGERT
          </span>
          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-white/50 font-medium">
            DARE2TRI ELITE TEAM ATHLETE
          </span>
        </div>
      </footer>
    </div>
  );
}