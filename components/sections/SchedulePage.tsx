'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CustomCursor from '@/components/shared/CustomCursor';
import RaceCalendar from '@/components/shared/RaceCalendar';

const themeColor = '#f97316';

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-[#050505] cursor-crosshair relative">
      <CustomCursor themeColor={themeColor} />

      <div className="max-w-[1200px] mx-auto px-6 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 lg:mb-28"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase block mb-4">
            Dare2Tri Elite Development Team
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,5rem)] leading-[0.9] uppercase tracking-tight text-white">
            Race
            <br />
            <span className="text-orange-500">Schedule.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <RaceCalendar themeColor={themeColor} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-24 lg:mt-32"
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
              aria-hidden="true"
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
