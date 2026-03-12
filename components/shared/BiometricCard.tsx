'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BiometricCardProps {
  label: string;
  value: string | number | null;
  unit: string;
  color: string;
  delay: number;
  subtext?: string;
  tooltip?: React.ReactNode;
  tooltipTitle?: string;
  animateValue?: { animate: Record<string, unknown>; transition: Record<string, unknown> };
  index?: number;
}

export default function BiometricCard({ label, value, unit, color, delay, subtext, tooltip, tooltipTitle, animateValue, index }: BiometricCardProps) {
  const ValueTag = animateValue ? motion.span : 'span';
  const valueProps = animateValue ? animateValue : {};
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Close tooltip if tapping anywhere outside
  useEffect(() => {
    if (!tooltipOpen) return;
    const handleOutsideClick = () => setTooltipOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [tooltipOpen]);

  // Only one tooltip open at a time
  useEffect(() => {
    const handleClose = (e: CustomEvent) => {
      if (e.detail !== label) setTooltipOpen(false);
    };
    window.addEventListener('single-tooltip', handleClose as EventListener);
    return () => window.removeEventListener('single-tooltip', handleClose as EventListener);
  }, [label]);

  const toggleTooltip = (e: React.MouseEvent) => {
    if (tooltip) {
      e.stopPropagation();
      const nextState = !tooltipOpen;
      setTooltipOpen(nextState);
      if (nextState) {
        window.dispatchEvent(new CustomEvent('single-tooltip', { detail: label }));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white/[0.03] border border-white/10 rounded-lg p-5 backdrop-blur-sm relative transition-colors duration-300 cursor-pointer active:bg-white/[0.06] hover:bg-white/[0.05] ${
        tooltipOpen ? 'z-50' : 'z-10'
      }`}
      onClick={toggleTooltip}
    >
      {tooltip && (
        <div
          className="absolute top-3 right-3 z-50 flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 cursor-pointer group border border-white/10 backdrop-blur-md"
          onClick={toggleTooltip}
          style={{
            boxShadow: tooltipOpen ? `0 0 12px ${color}30` : 'none',
            borderColor: tooltipOpen ? `${color}80` : undefined,
          }}
          aria-label={`Info: ${label}`}
        >
          <span
            className="font-mono text-[9px] font-bold transition-colors duration-300"
            style={{ color: tooltipOpen ? color : 'rgba(255,255,255,0.4)' }}
          >
            i
          </span>
        </div>
      )}

      {/* Full Card Tooltip Overlay */}
      <AnimatePresence>
        {tooltip && tooltipOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[60] rounded-lg overflow-hidden flex flex-col p-3.5 md:p-4 cursor-pointer bg-black/95 text-left"
            onClick={toggleTooltip}
            style={{
              boxShadow: `inset 0 0 40px ${color}15`,
              border: `1px solid ${color}40`,
            }}
          >
            {/* Glowing Effects */}
            <div
              className="absolute top-0 left-0 w-full h-[1px] opacity-70"
              style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            />
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` }}
            />

            {/* Overlay Content */}
            <div className="relative z-10 w-full flex flex-col h-full items-start overflow-hidden pt-1">
              <div className="flex w-full justify-between items-start mb-2 shrink-0">
                <span className="font-mono text-[0.60rem] tracking-[0.2em] uppercase opacity-90" style={{ color }}>
                  {tooltipTitle || `${label} Details`}
                </span>
                <span className="text-white/40 group-hover:text-white/70 transition-colors ml-2 cursor-pointer mt-0.5" onClick={toggleTooltip}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </span>
              </div>
              <div className="w-full flex-1 overflow-y-auto pr-1 pb-1">
                <span className="font-sans text-[11px] md:text-xs leading-[1.6] text-white/90 block break-words">
                  {tooltip}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
