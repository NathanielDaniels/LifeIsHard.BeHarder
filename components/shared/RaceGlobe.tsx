'use client';

import { useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import CobeGlobe from '@/components/shared/CobeGlobe';
import FullRaceMap from '@/components/shared/FullRaceMap';

interface RaceGlobeProps {
  themeColor: string;
}

const SF: [number, number] = [37.76, -122.44];

const RACE_MARKERS = [
  { id: 'sf',               location: SF,                                        size: 0.05 },
  { id: 'napa',             location: [38.30, -122.29] as [number, number] },
  { id: 'hammond',          location: [41.58, -87.50]  as [number, number] },
  { id: 'long-beach',       location: [33.77, -118.19] as [number, number] },
  { id: 'pleasant-prairie', location: [42.55, -87.93]  as [number, number] },
  { id: 'milwaukee',        location: [43.04, -87.91]  as [number, number], size: 0.07 },
  { id: 'chicago',          location: [41.88, -87.63]  as [number, number] },
  { id: 'la-jolla',         location: [32.85, -117.27] as [number, number] },
  { id: 'berkeley',         location: [37.87, -122.27] as [number, number] },
  { id: 'sacramento',       location: [38.58, -121.49] as [number, number] },
];

// Hub-and-spoke from SF — only long-distance arcs visible on globe
const RACE_ARCS = [
  { id: 'sf-hammond',          from: SF, to: [41.58, -87.50]  as [number, number] },
  { id: 'sf-long-beach',       from: SF, to: [33.77, -118.19] as [number, number] },
  { id: 'sf-pleasant-prairie', from: SF, to: [42.55, -87.93]  as [number, number] },
  { id: 'sf-milwaukee',        from: SF, to: [43.04, -87.91]  as [number, number] },
  { id: 'sf-chicago',          from: SF, to: [41.88, -87.63]  as [number, number] },
  { id: 'sf-la-jolla',         from: SF, to: [32.85, -117.27] as [number, number] },
];

export default function RaceGlobe({ themeColor }: RaceGlobeProps) {
  const [showMap, setShowMap] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const handleCloseMap = useCallback(() => setShowMap(false), []);

  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-mono text-xs tracking-[0.3em] text-white/40 mb-2 uppercase">
        Race Map
      </p>
      <h3 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-white mb-8">
        2026 SEASON
      </h3>

      <div
        className="w-[320px] h-[320px] md:w-[520px] md:h-[520px] lg:w-[600px] lg:h-[600px] cursor-pointer group"
        onPointerDown={(e) => { pointerStart.current = { x: e.clientX, y: e.clientY }; }}
        onPointerUp={(e) => {
          if (pointerStart.current) {
            const dx = Math.abs(e.clientX - pointerStart.current.x);
            const dy = Math.abs(e.clientY - pointerStart.current.y);
            if (dx < 5 && dy < 5) setShowMap(true);
          }
          pointerStart.current = null;
        }}
      >
        <CobeGlobe
          markers={RACE_MARKERS}
          arcs={RACE_ARCS}
          themeColor={themeColor}
          speed={0.002}
          initialPhi={4.85}
          theta={0.25}
          paused={showMap}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
        <span>10 Races</span>
        <span className="hidden sm:inline">·</span>
        <span>4 States</span>
        <span className="hidden sm:inline">·</span>
        <span style={{ color: themeColor }}>Nationals: Milwaukee</span>
      </div>

      <button
        onClick={() => setShowMap(true)}
        className="mt-4 font-mono text-[10px] md:text-xs tracking-[0.2em] px-5 py-2 rounded-full border transition-all duration-300 hover:scale-105"
        style={{
          borderColor: `${themeColor}44`,
          color: `${themeColor}aa`,
          backgroundColor: 'transparent',
        }}
      >
        EXPLORE RACE MAP →
      </button>

      <AnimatePresence>
        {showMap && (
          <FullRaceMap themeColor={themeColor} onClose={handleCloseMap} />
        )}
      </AnimatePresence>
    </div>
  );
}
