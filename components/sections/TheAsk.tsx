'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useVitality } from '@/contexts/VitalityContext';
import EmailCapture from '@/components/shared/EmailCapture';
import SocialLinks from '@/components/shared/SocialLinks';

export default function TheAsk() {
  const { theme } = useVitality();

  const sponsors = [
    {
      src: '/sponsors/ATF_logo.png',
      link: 'https://www.adaptivetrainingfoundation.org/',
      alt: 'Adaptive Training Foundation',
      className: 'h-28 md:h-36 lg:h-44 invert brightness-200'
    },
    {
      src: '/sponsors/CAF_logo.png',
      link: 'https://www.challengedathletes.org/',
      alt: 'Challenged Athletes Foundation',
      className: 'h-24 md:h-32 mix-blend-screen invert grayscale hover:grayscale-0 hover:invert-0 opacity-100 rounded-[50%] object-cover'
    },
    {
      src: '/sponsors/david-rotter-logo_orig.png',
      link: 'https://www.rotterprosthetics.com/',
      alt: 'David Rotter Prosthetics',
      className: 'h-16 md:h-20 grayscale hover:grayscale-0 brightness-200 hover:brightness-100'
    },
  ];

  return (
    <section className="relative min-h-screen py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/30 to-black" />

      {/* Radial glow effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.primaryColor}33` }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <div className="font-mono text-sm tracking-[0.3em] text-white/40">
            YOU'VE SEEN THE STORY
          </div>
          <h2 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-[0.05em] text-white leading-none">
            FUEL THE
            <br />
            <span style={{ color: theme.primaryColor }}>MISSION.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Patrick trains full-time toward Nationals. Equipment, travel, coaching, race fees. Every contribution powers the next mile.
          </p>
        </motion.div>

        {/* Two Paths */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Support Dare2Tri */}
          <div className="p-8 md:p-10 rounded-2xl border backdrop-blur-sm space-y-6"
            style={{
              backgroundColor: `${theme.primaryColor}11`,
              borderColor: `${theme.primaryColor}44`
            }}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-display text-2xl md:text-3xl tracking-wide text-white">
                  Support Dare2Tri
                </h3>
                <div
                  className="px-3 py-1 rounded-full text-xs font-mono tracking-[0.15em]"
                  style={{
                    backgroundColor: `${theme.primaryColor}33`,
                    color: theme.primaryColor
                  }}
                >
                  TAX-DEDUCTIBLE
                </div>
              </div>
              <p className="text-white/70 leading-relaxed">
                Support the organization that makes adaptive athletics possible. Every dollar goes toward equipment, coaching, and opportunities for para-athletes.
              </p>
            </div>

            <a
              href="https://give.dare2tri.org/fundraiser/6928347"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 rounded-xl font-display text-lg tracking-wider text-center transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: theme.primaryColor,
                color: 'white',
                boxShadow: `0 0 30px ${theme.primaryColor}66`
              }}
            >
              SUPPORT DARE2TRI
            </a>
          </div>

          {/* Sponsor Patrick */}
          <div className="p-8 md:p-10 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm space-y-6 hover:border-white/40 transition-all duration-300">
            <div className="space-y-4">
              <h3 className="font-display text-2xl md:text-3xl tracking-wide text-white">
                Sponsor Patrick
              </h3>
              <p className="text-white/70 leading-relaxed">
                Put your brand behind the mission. Equipment, travel, race sponsorship. Direct athlete support that makes podium finishes possible.
              </p>
            </div>

            <a
              href="mailto:patrick@patrickwingert.com"
              className="block w-full px-8 py-4 rounded-xl border-2 font-display text-lg tracking-wider text-center text-white transition-all duration-300 hover:scale-[1.02]"
              style={{
                borderColor: 'white',
                backgroundColor: 'transparent'
              }}
            >
              GET IN TOUCH
            </a>
          </div>
        </motion.div>

        {/* Sponsor Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center">
            <div className="font-mono text-xs tracking-[0.3em] text-white/30 mb-8">
              PROUDLY SUPPORTED BY
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-20">
            {sponsors.map((sponsor, idx) => (
              <motion.a
                key={idx}
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 0.4, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="transition-all duration-300"
              >
                <Image
                  src={sponsor.src}
                  alt={sponsor.alt}
                  width={200}
                  height={100}
                  className={`object-contain ${sponsor.className}`}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Email Capture */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="text-center">
            <div className="font-display text-3xl md:text-4xl tracking-[0.1em] text-white mb-2">
              FOLLOW THE JOURNEY
            </div>
            <p className="font-mono text-sm tracking-[0.2em] text-white/40">
              RACE RESULTS · TRAINING UPDATES · THE ROAD TO NATIONALS
            </p>
          </div>

          <EmailCapture themeColor={theme.primaryColor} />
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="pt-8"
        >
          <SocialLinks />
        </motion.div>
      </div>
    </section>
  );
}
