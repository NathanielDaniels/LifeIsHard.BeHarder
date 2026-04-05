'use client';

import { memo, useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from 'react-simple-maps';
import { RACES_2026, SF_HOME, getNextRace, getDaysUntil } from '@/lib/race-data';

interface FullRaceMapProps {
  themeColor: string;
  onClose: () => void;
}

const STATES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const RACE_STATE_FIPS = Array.from(new Set(RACES_2026.map((r) => r.stateFips)));

const STATE_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  '06': { center: [-119.5, 37.5], zoom: 4 },
  '17': { center: [-89.3, 40.0], zoom: 5 },
  '18': { center: [-86.3, 40.0], zoom: 5 },
  '55': { center: [-89.5, 44.5], zoom: 5 },
};

const MIDWEST_CENTER: [number, number] = [-87.8, 42.5];
const MIDWEST_ZOOM = 6;
const MIDWEST_FIPS = ['17', '18', '55'];

const NEXT_RACE_COLOR = '#f97316'; // same orange, differentiated by size/glow

function FullRaceMap({ themeColor, onClose }: FullRaceMapProps) {
  const nextRace = getNextRace();
  const [zoomedState, setZoomedState] = useState<string | null>(null);
  const [hoveredRace, setHoveredRace] = useState<string | null>(null);
  const hoverLockRef = useRef(false);
  const activeRace = hoveredRace;

  const setHoverSafe = useCallback((cityCode: string | null) => {
    if (!hoverLockRef.current) setHoveredRace(cityCode);
  }, []);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { center, zoom } = useMemo(() => {
    if (!zoomedState) return { center: [-96, 38] as [number, number], zoom: 1 };
    if (MIDWEST_FIPS.includes(zoomedState)) return { center: MIDWEST_CENTER, zoom: MIDWEST_ZOOM };
    return STATE_CENTERS[zoomedState] || { center: [-96, 38] as [number, number], zoom: 1 };
  }, [zoomedState]);

  const visibleRaces = useMemo(() => {
    if (!zoomedState) return RACES_2026;
    if (MIDWEST_FIPS.includes(zoomedState)) {
      return RACES_2026.filter((r) => MIDWEST_FIPS.includes(r.stateFips));
    }
    return RACES_2026.filter((r) => r.stateFips === zoomedState);
  }, [zoomedState]);

  const isZoomed = zoomedState !== null;
  const showHomeMarker = !isZoomed || zoomedState === '06';
  const mapRaces = RACES_2026; // always show all dots on map
  const sidebarRaces = isZoomed ? visibleRaces : RACES_2026;

  // Escape key to close, back to US
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setZoomedState(null);
          setHoveredRace(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isZoomed, onClose]);

  // Lock body scroll and stop Lenis while map is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    // Stop Lenis smooth scroll if active
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, []);

  // Scroll card into view when a race is active (hovered or selected)
  useEffect(() => {
    if (activeRace && cardRefs.current[activeRace]) {
      cardRefs.current[activeRace]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeRace]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-10 pt-5 pb-3">
        <div>
          <h3 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-white">
            2026 RACE MAP
          </h3>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 mt-1">
            {isZoomed
              ? `${visibleRaces.length} RACE${visibleRaces.length > 1 ? 'S' : ''} IN VIEW`
              : `${RACES_2026.length} RACES · CLICK A HIGHLIGHTED STATE TO ZOOM`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isZoomed && (
            <button
              onClick={() => { setZoomedState(null); setHoveredRace(null); }}
              className="px-4 py-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 border border-white/20 font-mono text-xs tracking-[0.15em]"
            >
              ← US
            </button>
          )}
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 border border-white/20"
            aria-label="Close map"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Split layout: map + sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map panel */}
        <div className="flex-1 flex items-center justify-center px-2 md:px-4 overflow-hidden">
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 900 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup center={center} zoom={zoom} maxZoom={8} minZoom={1}>
              {/* States */}
              <Geographies geography={STATES_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const fips = geo.id;
                    const hasRaces = RACE_STATE_FIPS.includes(fips);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={hasRaces ? '#1a1a1a' : '#0e0e0e'}
                        stroke={hasRaces ? `${themeColor}33` : 'rgba(255,255,255,0.06)'}
                        strokeWidth={hasRaces ? 0.8 : 0.4}
                        onClick={() => {
                          if (hasRaces) {
                            setZoomedState(fips);
                            setHoveredRace(null);
                          } else if (isZoomed) {
                            setZoomedState(null);
                            setHoveredRace(null);
                          }
                        }}
                        style={{
                          default: { outline: 'none', cursor: hasRaces ? 'pointer' : 'default' },
                          hover: { outline: 'none', fill: hasRaces ? '#222' : '#111', cursor: hasRaces ? 'pointer' : 'default' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* Route lines */}
              {mapRaces.map((race) => {
                const isHighlighted = activeRace === race.cityCode;
                // When a race is hovered, only show that line. Otherwise show all.
                if (activeRace !== null && !isHighlighted) return null;
                return (
                  <Line
                    key={`line-${race.cityCode}`}
                    from={SF_HOME}
                    to={race.coords}
                    stroke={isHighlighted ? themeColor : `${themeColor}22`}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    strokeLinecap="round"
                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                  />
                );
              })}

              {/* SF Home */}
              {showHomeMarker && (
                <Marker coordinates={SF_HOME}>
                  <circle r={isZoomed ? 3 : 4} fill={themeColor} opacity={0.9} />
                  <circle r={isZoomed ? 5 : 7} fill="none" stroke={themeColor} strokeWidth={0.5} opacity={0.4} />
                </Marker>
              )}

              {/* Race markers */}
              {mapRaces.map((race) => {
                const isNext = nextRace?.date === race.date;
                const isPast = new Date(race.date) < new Date();
                const isActive = activeRace === race.cityCode;
                const isDimmed = activeRace !== null && !isActive;
                const dotSize = isNext ? 5 : isActive ? 4 : 3;

                return (
                  <Marker
                    key={race.cityCode}
                    coordinates={race.coords}
                    onClick={() => {
                      if (!isZoomed) {
                        hoverLockRef.current = true;
                        setZoomedState(race.stateFips);
                        setHoveredRace(race.cityCode);
                        setTimeout(() => { hoverLockRef.current = false; }, 500);
                      }
                    }}
                    onMouseEnter={() => setHoverSafe(race.cityCode)}
                    onMouseLeave={() => setHoverSafe(null)}
                  >
                    {/* Glow for next race */}
                    {isNext && !isPast && (
                      <circle r={9} fill={themeColor} opacity={isDimmed ? 0.03 : 0.12} />
                    )}

                    {/* Ring for target (Nationals) */}
                    {race.isTarget && !isPast && (
                      <circle r={7} fill="none" stroke={themeColor} strokeWidth={0.8} opacity={isDimmed ? 0.1 : 0.4} />
                    )}

                    {/* Pulse for next race or active selection */}
                    {(isNext || isActive) && !isPast && (
                      <circle r={dotSize * 2.5} fill="none" stroke={themeColor} strokeWidth={isNext ? 1 : isActive ? 1 : 0.5} opacity={0.3}>
                        <animate attributeName="r" from={dotSize * 1.5} to={dotSize * 3.5} dur={isNext ? '1.5s' : '2s'} repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur={isNext ? '1.5s' : '2s'} repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Dot */}
                    <circle
                      r={dotSize}
                      fill={isPast ? 'rgba(255,255,255,0.3)' : themeColor}
                      opacity={isDimmed ? 0.15 : isPast ? 0.5 : 1}
                    />

                    {/* City code — always visible for next race, on hover for others */}
                    {(isActive || (isNext && !isPast)) && (
                      <text
                        y={-dotSize - 4}
                        textAnchor="middle"
                        style={{
                          fontFamily: 'monospace',
                          fontSize: isZoomed ? 3.5 : 7,
                          fill: themeColor,
                          letterSpacing: '0.1em',
                          fontWeight: 'bold',
                        }}
                      >
                        {race.cityCode}
                      </text>
                    )}
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Sidebar — race list */}
        <div className="hidden md:flex flex-col w-80 lg:w-96 border-l border-white/10 bg-black/50">
          {/* Sidebar header */}
          <div className="px-5 py-4 border-b border-white/10">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40">
              {isZoomed ? 'RACES IN REGION' : 'ALL RACES'}
            </div>
          </div>

          {/* Scrollable race list */}
          <div
            className="flex-1 overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
          >
            {sidebarRaces.map((race, i) => {
              const isPast = new Date(race.date) < new Date();
              const isNext = nextRace?.date === race.date;
              const daysUntil = getDaysUntil(new Date(race.date));
              const isActive = activeRace === race.cityCode;
              const raceDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC',
              }).format(new Date(race.date));

              return (
                <div
                  key={race.cityCode}
                  ref={(el) => { cardRefs.current[race.cityCode] = el; }}
                  className="block px-5 py-4 border-b transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    if (!isZoomed) {
                      hoverLockRef.current = true;
                      setZoomedState(race.stateFips);
                      setHoveredRace(race.cityCode);
                      setTimeout(() => { hoverLockRef.current = false; }, 500);
                    }
                  }}
                  style={{
                    borderColor: 'rgba(255,255,255,0.06)',
                    backgroundColor: isActive
                      ? `${isNext ? NEXT_RACE_COLOR : themeColor}15`
                      : isNext
                        ? `${NEXT_RACE_COLOR}0a`
                        : 'transparent',
                  }}
                  onMouseEnter={() => setHoverSafe(race.cityCode)}
                  onMouseLeave={() => setHoverSafe(null)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {/* Race type icon */}
                        {race.type === 'triathlon' ? (
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke={isPast ? 'rgba(255,255,255,0.3)' : isNext ? NEXT_RACE_COLOR : themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="3" />
                            <path d="M6.5 21L9 12l3 3 3-3 2.5 9" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke={isPast ? 'rgba(255,255,255,0.3)' : isNext ? NEXT_RACE_COLOR : themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 4v4l4 4-4 4v4" />
                            <path d="M7 4v4l-4 4 4 4v4" />
                          </svg>
                        )}
                        <span className="font-mono text-[10px] tracking-[0.15em] text-white/50">
                          {raceDate.toUpperCase()}
                        </span>
                        {isNext && !isPast && (
                          <span
                            className="font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full animate-pulse"
                            style={{ backgroundColor: `${NEXT_RACE_COLOR}22`, color: NEXT_RACE_COLOR }}
                          >
                            NEXT
                          </span>
                        )}
                        {race.isTarget && (
                          <span
                            className="font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                          >
                            TARGET
                          </span>
                        )}
                      </div>
                      <div className="font-display text-base tracking-wide text-white mt-1.5 truncate">
                        {race.name}
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.1em] text-white/40 mt-0.5">
                        {race.location}
                        {race.distance ? ` · ${race.distance}` : ''}
                      </div>
                      {race.championship && (
                        <div
                          className="font-mono text-[9px] tracking-[0.1em] mt-1"
                          style={{ color: `${themeColor}88` }}
                        >
                          {race.championship.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0 pt-1">
                      {!isPast && (
                        <>
                          <div className="font-display text-xl" style={{ color: isNext ? NEXT_RACE_COLOR : themeColor }}>
                            {daysUntil}
                          </div>
                          <div className="font-mono text-[8px] tracking-[0.2em] text-white/30">
                            DAYS
                          </div>
                        </>
                      )}
                      {isPast && (
                        race.result ? (
                          <div className="font-display text-lg" style={{ color: themeColor }}>
                            {race.result}
                          </div>
                        ) : (
                          <div className="font-mono text-[9px] tracking-[0.15em] text-white/30">
                            DONE
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend at bottom of sidebar */}
          <div className="px-5 py-3 border-t border-white/10 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] tracking-[0.15em] text-white/30">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
              Upcoming
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              Completed
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(FullRaceMap);
