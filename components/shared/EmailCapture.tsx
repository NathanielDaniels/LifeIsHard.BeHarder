'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface EmailCaptureProps {
  themeColor: string;
  onHoverChange?: (hovering: boolean) => void;
}

export default function EmailCapture({ themeColor, onHoverChange }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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

  return (
    <>
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
        <form onSubmit={handleSubmit} className="relative group w-full max-w-md mx-auto">
          <div
            className="relative flex flex-col sm:flex-row gap-3 sm:gap-0 sm:bg-white/[0.03] sm:border sm:border-white/10 sm:rounded-xl sm:p-1.5 sm:backdrop-blur-sm transition-shadow duration-500"
            style={{
              boxShadow: isFocused && window.innerWidth >= 640
                ? `0 0 25px ${themeColor}99, 0 0 60px ${themeColor}33`
                : `0 0 0px ${themeColor}00`
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => { setIsFocused(true); onHoverChange?.(true); }}
              onBlur={() => { setIsFocused(false); onHoverChange?.(false); }}
              placeholder="Enter your email"
              className="w-full sm:flex-1 bg-white/[0.03] sm:bg-transparent border border-white/10 sm:border-none rounded-xl sm:rounded-none px-5 py-4 text-white placeholder:text-white/30 focus:outline-none font-mono text-base text-center sm:text-left transition-colors"
            />
            <button
              type="submit"
              disabled={submitState === 'loading'}
              className="w-full sm:w-auto px-6 sm:px-10 py-4 font-display font-bold uppercase tracking-wider text-base rounded-xl sm:rounded-lg transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105"
              style={{
                backgroundColor: themeColor,
                color: 'white',
                boxShadow: `0 0 30px ${themeColor}4D`
              }}
              onMouseEnter={() => onHoverChange?.(true)}
              onMouseLeave={() => onHoverChange?.(false)}
            >
              {submitState === 'loading' ? '...' : 'NOTIFY ME'}
            </button>
          </div>
        </form>
      )}
      {submitState === 'error' && (
        <p className="text-red-500 text-sm mt-3">{message}</p>
      )}
    </>
  );
}
