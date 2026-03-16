'use client';

import Image from 'next/image';
import { useHeartbeatDuration } from '@/contexts/WhoopContext';

export default function SiteFooter() {
  const heartbeatDuration = useHeartbeatDuration();

  return (
    <footer className="relative z-20 py-8 px-6 border-t border-white/5 bg-black">
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden opacity-30">
        <svg
          className="absolute top-0 left-0 w-[200%] h-[2px]"
          viewBox="0 0 1200 4"
          preserveAspectRatio="none"
          style={{ animation: `heartbeat-ecg ${heartbeatDuration * 2}s linear infinite` }}
        >
          <path
            d="M0,2 L100,2 L140,0 L160,4 L180,1 L200,3 L220,2 L300,2 L340,0 L360,4 L380,1 L400,3 L420,2 L500,2 L540,0 L560,4 L580,1 L600,3 L620,2 L700,2 L740,0 L760,4 L780,1 L800,3 L820,2 L900,2 L940,0 L960,4 L980,1 L1000,3 L1020,2 L1100,2 L1140,0 L1160,4 L1180,1 L1200,3"
            fill="none"
            stroke="rgba(249,115,22,0.6)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-display text-base tracking-[0.2em] text-white/60">
          PATRICK WINGERT
        </span>
        <span className="font-mono text-[9px] tracking-[0.2em] text-white/20">
          BUILT WITH WHOOP DATA
        </span>
        <a
          href="https://dare2tri.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        >
          <Image
            src="/sponsors/D2T_logo_short.webp"
            alt="Dare2Tri"
            width={120}
            height={40}
            className="object-contain"
          />
        </a>
      </div>
    </footer>
  );
}
