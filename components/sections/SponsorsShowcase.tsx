'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CustomCursor from '@/components/shared/CustomCursor';

interface Sponsor {
  name: string;
  description: string;
  logo: string;
  url: string;
  logoClass?: string;
}

const SPONSORS: Sponsor[] = [
  {
    name: 'Dare2Tri',
    description: 'Creating opportunities for athletes with physical disabilities and visual impairments to participate in endurance sports.',
    logo: '/sponsors/D2T_logo_short.webp',
    url: 'https://www.dare2tri.org',
    logoClass: 'h-12 md:h-14',
  },
  {
    name: 'Adaptive Training Foundation',
    description: 'Building adaptive athletes through world-class coaching, programming, and community. Strength has no limitations.',
    logo: '/sponsors/ATF_logo.png',
    url: 'https://www.adaptivetrainingfoundation.org/',
    logoClass: 'h-20 md:h-24 invert brightness-200',
  },
  {
    name: 'Challenged Athletes Foundation',
    description: 'Providing opportunities and support to people with physical challenges so they can pursue active lifestyles through sport.',
    logo: '/sponsors/CAF_logo.png',
    url: 'https://www.challengedathletes.org/',
    logoClass: 'h-16 md:h-20',
  },
  {
    name: 'David Rotter Prosthetics',
    description: 'The engineer behind the leg. Custom prosthetics designed for athletic performance, built for the demands of elite competition.',
    logo: '/sponsors/david-rotter-logo_orig.png',
    url: 'https://www.rotterprosthetics.com/',
    logoClass: 'h-12 md:h-16 brightness-200',
  },
  {
    name: 'So Every Body Can Move',
    description: 'Removing barriers to movement and fitness for people of all abilities. Inclusive wellness, no exceptions.',
    logo: '/sponsors/SEBCM_color.png',
    url: 'https://soeverybodycanmove.org',
    logoClass: 'h-12 md:h-16 brightness-200',
  },
];

export default function SponsorsShowcase() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const themeColor = '#f97316';

  // Mobile scroll-center detection: highlight the card nearest viewport center
  const [isMobile, setIsMobile] = useState(false);
  const [activeSponsor, setActiveSponsor] = useState(-1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const lastActiveRef = useRef(-1);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setActiveSponsor(-1);
      lastActiveRef.current = -1;
      return;
    }

    function tick() {
      const viewportCenter = window.innerHeight / 2;
      let closest = -1;
      let minDist = Infinity;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });

      if (closest !== lastActiveRef.current) {
        lastActiveRef.current = closest;
        setActiveSponsor(closest);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isMobile]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('sending');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get('website')) {
      setFormState('sent');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          website: formData.get('website'),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormState('error');
        setErrorMsg(data.error || 'Something went wrong.');
        return;
      }

      setFormState('sent');
      form.reset();
    } catch {
      setFormState('error');
      setErrorMsg('Something went wrong. Please try emailing directly.');
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] cursor-crosshair relative">
      <CustomCursor themeColor={themeColor} />

      <div className="max-w-[1200px] mx-auto px-6 py-24 lg:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 lg:mb-28"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-4">
            Partners in the mission
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,5rem)] leading-[0.9] uppercase tracking-tight text-white">
            Proudly
            <br />
            <span className="text-orange-500">Supported By.</span>
          </h1>
        </motion.div>

        {/* Sponsor Grid */}
        <div className="grid gap-6 md:gap-8 mb-32 lg:mb-40">
          {SPONSORS.map((sponsor, i) => {
            const isActive = isMobile && activeSponsor === i;
            return (
              <div key={sponsor.name} ref={(el) => { cardRefs.current[i] = el; }}>
              <motion.a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`group flex flex-col md:flex-row items-center gap-6 md:gap-10 p-8 md:p-10 rounded-2xl border transition-all duration-500 ${
                  isActive
                    ? 'bg-white/[0.05] border-white/15 scale-[1.02]'
                    : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.05] hover:border-white/15'
                }`}
              >
                <div className="flex-shrink-0 w-full md:w-[200px] flex items-center justify-center md:justify-start">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={200}
                    height={80}
                    className={`object-contain transition-all duration-500 ${
                      isActive
                        ? 'grayscale-0 opacity-100'
                        : 'grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100'
                    } ${sponsor.logoClass || ''}`}
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className={`font-display text-xl md:text-2xl tracking-wide mb-2 transition-colors duration-300 ${
                    isActive ? 'text-orange-500' : 'text-white group-hover:text-orange-500'
                  }`}>
                    {sponsor.name}
                  </h3>
                  <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                    isActive ? 'text-white/60' : 'text-white/40 group-hover:text-white/60'
                  }`}>
                    {sponsor.description}
                  </p>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0 text-white/20 group-hover:text-orange-500 transition-all duration-300 group-hover:translate-x-1 hidden md:block"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
              </div>
            );
          })}
        </div>

        {/* Become a Sponsor */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32 lg:mb-40"
        >
          <div className="text-center mb-16">
            <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-4">
              Join the team
            </span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[0.9] uppercase tracking-tight text-white mb-6">
              Become a <span className="text-orange-500">Sponsor.</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed text-lg">
              Put your brand behind an athlete who doesn't quit. Equipment, travel, race sponsorship, gear.
              Every partnership powers the next mile toward Nationals.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {formState === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-8 rounded-2xl border border-orange-500/30 bg-orange-500/5"
              >
                <div className="font-display text-3xl md:text-4xl text-white mb-3 tracking-wide">
                  MESSAGE SENT.
                </div>
                <p className="text-white/50 font-mono text-sm tracking-wide">
                  Patrick will be in touch.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot */}
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-colors duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-colors duration-300"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-colors duration-300 resize-none"
                    placeholder="Tell Patrick about your brand and how you'd like to get involved..."
                  />
                </div>

                {formState === 'error' && (
                  <p className="text-red-400 text-sm font-mono tracking-wide">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full py-4 rounded-xl font-display text-lg tracking-wider text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    backgroundColor: themeColor,
                    boxShadow: `0 0 30px ${themeColor}44`,
                  }}
                >
                  {formState === 'sending' ? 'SENDING...' : 'SEND INQUIRY'}
                </button>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="font-mono text-xs tracking-[0.2em] text-white/30">OR EMAIL DIRECTLY</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <a
                  href="mailto:patrick@patrickwingert.com?subject=Sponsorship%20Inquiry"
                  className="block w-full py-4 rounded-xl border border-white/15 font-display text-lg tracking-wider text-white text-center transition-all duration-300 hover:border-white/40 hover:scale-[1.02]"
                >
                  PATRICK@PATRICKWINGERT.COM
                </a>
              </form>
            )}
          </div>
        </motion.div>

        {/* Donate to Dare2Tri */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 lg:mb-32"
        >
          <div className="max-w-2xl mx-auto p-10 md:p-14 rounded-2xl border border-orange-500/20 bg-orange-500/[0.03]">
            <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-4">
              Support the organization
            </span>
            <h3 className="font-display text-3xl md:text-4xl tracking-wide text-white mb-4">
              DONATE TO <span className="text-orange-500">DARE2TRI</span>
            </h3>
            <p className="text-white/50 leading-relaxed mb-8">
              Tax-deductible contributions go directly toward equipment, coaching, and opportunities for para-athletes.
              Every dollar powers the next mile.
            </p>
            <a
              href="https://give.dare2tri.org/fundraiser/6928347"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-xl font-display text-lg tracking-wider text-white transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 0 30px ${themeColor}44`,
              }}
            >
              SUPPORT DARE2TRI
            </a>
            <div className="mt-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-orange-500/50">TAX-DEDUCTIBLE</span>
            </div>
          </div>
        </motion.div>

        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-display text-lg tracking-wide text-white/60 hover:text-white transition-colors duration-300 uppercase group"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Main Site
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
