'use client';

import { memo, useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from 'react-simple-maps';
import { RACES_2026, SF_HOME, getNextRace, getDaysUntil, parseLocalDate } from '@/lib/race-data';
import { haversineDistance, formatMiles } from '@/lib/geo-utils';
import { Waves, Bike } from 'lucide-react';

function RunShoe({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18h18v-2c0-1-1-2-2-2h-1l-2-4h-3l-1 2H9L7 8H5L3 14v4z" />
      <path d="M3 18c0 1 1 2 2 2h14c1 0 2-1 2-2" />
    </svg>
  );
}

interface FullRaceMapProps {
  themeColor: string;
  onClose: () => void;
}

const STATES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const RACE_STATE_FIPS = Array.from(new Set(RACES_2026.map((r) => r.stateFips)));
const DEFAULT_CENTER: [number, number] = [-96, 38];
const DEFAULT_ZOOM = 1;

function isRaceSameDay(dateStr: string): boolean {
  const d = parseLocalDate(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function FullRaceMap({ themeColor, onClose }: FullRaceMapProps) {
  const nextRace = getNextRace();
  const [hoveredRace, setHoveredRace] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [mobileIndex, setMobileIndex] = useState(-1); // -1 = overview, 0+ = race index
  const activeRace = selectedRace || hoveredRace || (mobileIndex >= 0 ? RACES_2026[mobileIndex]?.cityCode : null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const selectedData = useMemo(() => {
    const code = selectedRace || (mobileIndex >= 0 ? RACES_2026[mobileIndex]?.cityCode : null);
    if (!code) return null;
    const race = RACES_2026.find((r) => r.cityCode === code);
    if (!race) return null;
    const distance = haversineDistance(SF_HOME, race.coords);
    const midpoint: [number, number] = [
      (SF_HOME[0] + race.coords[0]) / 2,
      (SF_HOME[1] + race.coords[1]) / 2,
    ];
    // Zoom level based on distance — closer races need more zoom
    const zoom = distance < 200 ? 6 : distance < 500 ? 3 : distance < 1500 ? 2 : 1.5;
    return { race, distance, midpoint, zoom };
  }, [selectedRace, mobileIndex]);

  // Animated map center and zoom for smooth "fly to" transitions
  const targetCenter = selectedData ? selectedData.midpoint : DEFAULT_CENTER;
  const [targetLng, targetLat] = targetCenter;
  const targetZoom = selectedData ? selectedData.zoom : DEFAULT_ZOOM;

  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const centerRef = useRef(DEFAULT_CENTER);
  const zoomRef = useRef(DEFAULT_ZOOM);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      centerRef.current = [targetLng, targetLat];
      zoomRef.current = targetZoom;
      setMapCenter([targetLng, targetLat]);
      setMapZoom(targetZoom);
      return;
    }

    const DURATION = 0.6;
    const EASE = [0.4, 0, 0.2, 1] as const;

    const ctrlX = animate(centerRef.current[0], targetLng, {
      duration: DURATION, ease: EASE,
      onUpdate: (v) => { centerRef.current[0] = v; setMapCenter([v, centerRef.current[1]]); },
    });
    const ctrlY = animate(centerRef.current[1], targetLat, {
      duration: DURATION, ease: EASE,
      onUpdate: (v) => { centerRef.current[1] = v; setMapCenter([centerRef.current[0], v]); },
    });
    const ctrlZ = animate(zoomRef.current, targetZoom, {
      duration: DURATION, ease: EASE,
      onUpdate: (v) => { zoomRef.current = v; setMapZoom(v); },
    });

    return () => { ctrlX.stop(); ctrlY.stop(); ctrlZ.stop(); };
  }, [targetLng, targetLat, targetZoom]);

  const isTouchRef = useRef(false);

  useEffect(() => {
    const onTouch = () => { isTouchRef.current = true; };
    const onMouse = () => { isTouchRef.current = false; };
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const setHoverSafe = useCallback((cityCode: string | null) => {
    if (isTouchRef.current) return; // Touch devices use tap/click only
    setHoveredRace(cityCode);
  }, []);

  // Keyboard navigation — Escape, Arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isMobileLayout = window.innerWidth < 768;
      if (e.key === 'Escape') {
        if (selectedRace || mobileIndex >= 0) {
          setSelectedRace(null);
          setMobileIndex(-1);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (isMobileLayout) {
          const nextIdx = mobileIndex >= RACES_2026.length - 1 ? 0 : mobileIndex + 1;
          setMobileIndex(nextIdx);
        } else {
          const currentIdx = selectedRace
            ? RACES_2026.findIndex((r) => r.cityCode === selectedRace)
            : -1;
          const nextIdx = currentIdx >= RACES_2026.length - 1 ? 0 : currentIdx + 1;
          setSelectedRace(RACES_2026[nextIdx].cityCode);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (isMobileLayout) {
          const prevIdx = mobileIndex <= 0 ? RACES_2026.length - 1 : mobileIndex - 1;
          setMobileIndex(prevIdx);
        } else {
          const currentIdx = selectedRace
            ? RACES_2026.findIndex((r) => r.cityCode === selectedRace)
            : 0;
          const prevIdx = currentIdx <= 0 ? RACES_2026.length - 1 : currentIdx - 1;
          setSelectedRace(RACES_2026[prevIdx].cityCode);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedRace, mobileIndex, onClose]);

  // Lock body scroll and stop Lenis while map is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, []);

  // Scroll card into view when a race is active
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
      role="dialog"
      aria-label="2026 Race Map"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-10 pt-5 pb-3">
        <div>
          <h3 className="font-display text-2xl md:text-3xl tracking-[0.15em] text-white text-left">
            2026 RACE MAP
          </h3>
          {!selectedData && (
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/60 mt-1">
              <span className="hidden md:inline">{RACES_2026.length} RACES · CLICK A RACE FOR DETAILS</span>
              <span className="md:hidden">{RACES_2026.length} RACES · EXPLORE RACES BELOW</span>
            </p>
          )}
          {selectedData && (() => {
            const { race, distance } = selectedData;
            const isSameDay = isRaceSameDay(race.date);
            const isToday = isSameDay && !race.result;
            const isPast = (parseLocalDate(race.date) < new Date() && !isSameDay) || (isSameDay && !!race.result);
            const daysUntil = getDaysUntil(parseLocalDate(race.date));
            const raceDate = new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'UTC',
            }).format(parseLocalDate(race.date));
            return (
              <div className="hidden md:block mt-2 space-y-1">
                {/* Line 1: Name + countdown */}
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-xl md:text-2xl tracking-wide text-white">
                    {race.name}
                  </span>
                  {isToday && (
                    <span className="font-mono text-xs tracking-[0.15em] font-bold shrink-0 animate-pulse" style={{ color: themeColor }}>
                      RACE DAY
                    </span>
                  )}
                  {!isPast && !isToday && (
                    <span className="font-mono text-xs tracking-[0.15em] font-medium shrink-0" style={{ color: themeColor }}>
                      {daysUntil} DAYS
                    </span>
                  )}
                </div>
                {/* Line 2: Details */}
                <div className="font-mono text-[11px] tracking-[0.1em] text-white/60 flex flex-wrap items-center">
                  <span>{raceDate}</span>
                  <span className="mx-2 text-white/20">·</span>
                  <span>{race.location}</span>
                  {race.distance && (
                    <>
                      <span className="mx-2 text-white/20">·</span>
                      <span>{race.distance}</span>
                    </>
                  )}
                  {race.course && (
                    <>
                      <span className="mx-2 text-white/20">·</span>
                      <span className="text-white/60">{race.course}</span>
                    </>
                  )}
                  {race.championship && (
                    <>
                      <span className="mx-2 text-white/20">·</span>
                      <span style={{ color: themeColor }}>{race.championship.toUpperCase()}</span>
                    </>
                  )}
                  {distance < 20 && (
                    <>
                      <span className="mx-2 text-white/20">·</span>
                      <span style={{ color: themeColor }}>HOME TURF</span>
                    </>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
        <div className="flex items-center gap-3">
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
            <ZoomableGroup
              center={mapCenter}
              zoom={mapZoom}
              maxZoom={8}
              minZoom={1}
              onMoveEnd={({ coordinates, zoom: z }) => {
                centerRef.current = [coordinates[0], coordinates[1]];
                zoomRef.current = z;
              }}
            >
              {/* Background click to deselect (desktop only) */}
              <rect
                x={-500} y={-500} width={2000} height={2000}
                fill="transparent"
                onClick={() => { if (window.innerWidth >= 768) setSelectedRace(null); }}
              />
              {/* States */}
              <Geographies geography={STATES_URL}>
                {({ geographies }) => {
                  const activeRaceData = activeRace ? RACES_2026.find((r) => r.cityCode === activeRace) : null;
                  const activeStateFips = activeRaceData?.stateFips;
                  return geographies.map((geo) => {
                    const hasRaces = RACE_STATE_FIPS.includes(geo.id);
                    const isActiveState = geo.id === activeStateFips;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isActiveState ? `${themeColor}18` : hasRaces ? '#1a1a1a' : '#0e0e0e'}
                        stroke={isActiveState ? `${themeColor}88` : hasRaces ? `${themeColor}33` : 'rgba(255,255,255,0.06)'}
                        strokeWidth={isActiveState ? 1.2 : hasRaces ? 0.8 : 0.4}
                        onClick={() => { if (window.innerWidth >= 768) setSelectedRace(null); }}
                        style={{
                          default: { outline: 'none', transition: 'fill 0.3s ease, stroke 0.3s ease' },
                          hover: { outline: 'none', fill: isActiveState ? `${themeColor}22` : hasRaces ? '#222' : '#111' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    );
                  });
                }}
              </Geographies>

              {/* "LET'S GO!" inside Wisconsin for Nationals */}
              {(() => {
                const target = RACES_2026.find((r) => r.isTarget);
                if (!target || parseLocalDate(target.date) < new Date()) return null;
                const isNationalsActive = activeRace === target.cityCode;
                // Approximate center of Wisconsin
                const wiCenter: [number, number] = [-89.8, 44.6];
                return (
                  <Marker coordinates={wiCenter}>
                    <text
                      textAnchor="middle"
                      style={{
                        fontFamily: 'var(--font-bebas), Bebas Neue, sans-serif',
                        fontSize: isNationalsActive ? 10 : 7,
                        fill: themeColor,
                        letterSpacing: '0.15em',
                        opacity: isNationalsActive ? 0.6 : 0,
                        transition: 'opacity 0.3s ease, font-size 0.3s ease',
                      }}
                    >
                      <tspan x="0" dy="0">LET&apos;S</tspan>
                      <tspan x="0" dy="1.1em">GO!</tspan>
                    </text>
                  </Marker>
                );
              })()}

              {/* Route lines — always rendered, faded via opacity */}
              {RACES_2026.map((race) => {
                const dist = haversineDistance(SF_HOME, race.coords);
                if (dist < 20) return null; // Skip route line for home races
                const isHighlighted = activeRace === race.cityCode;
                const lineHidden = activeRace !== null && !isHighlighted;
                return (
                  <Line
                    key={`line-${race.cityCode}`}
                    from={SF_HOME}
                    to={race.coords}
                    stroke={isHighlighted ? themeColor : `${themeColor}22`}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    strokeLinecap="round"
                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                    style={{
                      opacity: lineHidden ? 0 : 1,
                      transition: 'opacity 0.3s ease, stroke-width 0.3s ease',
                    }}
                  />
                );
              })}

              {/* "Road to Nationals" label along target route line — angled to match */}
              {(() => {
                const target = RACES_2026.find((r) => r.isTarget);
                if (!target || parseLocalDate(target.date) < new Date()) return null;
                const showLabel = activeRace === target.cityCode;
                const mid: [number, number] = [
                  (SF_HOME[0] + target.coords[0]) / 2,
                  (SF_HOME[1] + target.coords[1]) / 2 + 2,
                ];
                // Approximate angle of route line in projected space
                // Longitude difference is roughly horizontal, latitude is vertical (inverted in SVG)
                const dx = target.coords[0] - SF_HOME[0]; // longitude: positive = east
                const dy = -(target.coords[1] - SF_HOME[1]); // latitude: flip for SVG (north = up = negative y)
                const angle = Math.atan2(dy, dx) * (180 / Math.PI) * 0.7;
                return (
                  <Marker coordinates={mid}>
                    <g transform={`rotate(${angle})`}>
                      <text
                        y={-3}
                        textAnchor="middle"
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 5.5,
                          fill: 'rgba(255,255,255,0.7)',
                          letterSpacing: '0.25em',
                          opacity: showLabel ? 0.8 : 0,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        ROAD TO NATIONALS
                      </text>
                    </g>
                  </Marker>
                );
              })()}

              {/* Distance label — on hover or select */}
              {activeRace && (() => {
                const activeRaceData = RACES_2026.find((r) => r.cityCode === activeRace);
                if (!activeRaceData) return null;
                const dist = haversineDistance(SF_HOME, activeRaceData.coords);
                if (dist < 20) return null; // HOME TURF — no label needed
                const midpoint: [number, number] = [
                  (SF_HOME[0] + activeRaceData.coords[0]) / 2,
                  (SF_HOME[1] + activeRaceData.coords[1]) / 2,
                ];
                const isClose = dist < 300;
                const label = `${formatMiles(dist)} MI`;
                const fontSize = isClose ? 4 : 6;
                const labelWidth = label.length * fontSize * 0.65;
                const padX = isClose ? 4 : 6;
                const padY = isClose ? 3 : 5;
                const offsetLng = isClose ? 3 : 0;
                const offsetLat = isClose ? 0.5 : 0;
                const coords: [number, number] = [
                  midpoint[0] + offsetLng,
                  midpoint[1] + offsetLat,
                ];
                return (
                  <Marker coordinates={coords}>
                    <rect
                      x={-labelWidth / 2 - padX}
                      y={-fontSize / 2 - padY}
                      width={labelWidth + padX * 2}
                      height={fontSize + padY * 2}
                      rx={3}
                      fill="rgba(0,0,0,0.8)"
                      stroke={`${themeColor}44`}
                      strokeWidth={0.5}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontFamily: 'monospace',
                        fontSize,
                        fill: themeColor,
                        letterSpacing: '0.1em',
                        fontWeight: 'bold',
                      }}
                    >
                      {label}
                    </text>
                  </Marker>
                );
              })()}

              {/* Race markers */}
              {RACES_2026.map((race) => {
                const isNext = nextRace?.date === race.date;
                const isSameDay = isRaceSameDay(race.date);
                const isToday = isSameDay && !race.result;
                const isPast = (parseLocalDate(race.date) < new Date() && !isSameDay) || (isSameDay && !!race.result);
                const isActive = activeRace === race.cityCode;
                const isDimmed = activeRace !== null && !isActive;
                const isTarget = race.isTarget && !isPast;
                const dotSize = isTarget ? 5 : isToday ? 5 : isNext ? 4 : isActive ? 4 : 3;

                return (
                  <Marker
                    key={race.cityCode}
                    coordinates={race.coords}
                    onMouseEnter={() => setHoverSafe(race.cityCode)}
                    onMouseLeave={() => setHoverSafe(null)}
                    onClick={() => {
                      if (window.innerWidth < 768 || isTouchRef.current) return;
                      setSelectedRace(selectedRace === race.cityCode ? null : race.cityCode);
                    }}
                    style={{ default: { cursor: 'pointer' }, hover: { cursor: 'pointer' }, pressed: { cursor: 'pointer' } }}
                  >
                    {/* Nationals — outer glow ring (pointer-events: none so nearby dots stay clickable) */}
                    {isTarget && (
                      <g style={{ pointerEvents: 'none' }}>
                        <circle r={12} fill={themeColor} opacity={isDimmed ? 0.02 : 0.08} style={{ transition: 'opacity 0.3s ease' }} />
                        <circle r={9} fill="none" stroke={themeColor} strokeWidth={0.6} opacity={isDimmed ? 0.05 : 0.25} style={{ transition: 'opacity 0.3s ease' }} />
                        {/* Slow breathing pulse — always on */}
                        <circle r={8} fill="none" stroke={themeColor} strokeWidth={0.8} opacity={0.15}>
                          <animate attributeName="r" from="8" to="16" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
                        </circle>
                        {/* Diamond crosshairs */}
                        <path
                          d="M0,-8 L0,-5 M0,5 L0,8 M-8,0 L-5,0 M5,0 L8,0"
                          stroke={themeColor}
                          strokeWidth={0.5}
                          opacity={isDimmed ? 0.1 : 0.35}
                          style={{ transition: 'opacity 0.3s ease' }}
                        />
                      </g>
                    )}

                    {/* Race day — double pulse + glow */}
                    {isToday && !isTarget && (
                      <g style={{ pointerEvents: 'none' }}>
                        <circle r={10} fill={themeColor} opacity={isDimmed ? 0.03 : 0.15} style={{ transition: 'opacity 0.3s ease' }} />
                        <circle r={dotSize * 2} fill="none" stroke={themeColor} strokeWidth={1.2} opacity={0.4}>
                          <animate attributeName="r" from={dotSize * 1.5} to={dotSize * 4} dur="1.2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.7" to="0" dur="1.2s" repeatCount="indefinite" />
                        </circle>
                        <circle r={dotSize * 2} fill="none" stroke={themeColor} strokeWidth={0.8} opacity={0.3}>
                          <animate attributeName="r" from={dotSize * 1.5} to={dotSize * 4} dur="1.2s" begin="0.6s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    )}

                    {/* Glow for next race */}
                    {isNext && !isPast && !isToday && !isTarget && (
                      <circle r={7} fill={themeColor} opacity={isDimmed ? 0.03 : 0.12} style={{ transition: 'opacity 0.3s ease' }} />
                    )}

                    {/* Pulse for next race or active selection */}
                    {(isNext || isActive) && !isPast && !isToday && !isTarget && (
                      <circle r={dotSize * 2.5} fill="none" stroke={themeColor} strokeWidth={isNext ? 1 : 0.5} opacity={0.3}>
                        <animate attributeName="r" from={dotSize * 1.5} to={dotSize * 3.5} dur={isNext ? '1.5s' : '2s'} repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur={isNext ? '1.5s' : '2s'} repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Dot */}
                    <circle
                      r={dotSize}
                      fill={isPast ? 'rgba(255,255,255,0.3)' : themeColor}
                      opacity={isDimmed ? 0.15 : isPast ? 0.5 : 1}
                      style={{ transition: 'opacity 0.3s ease, r 0.2s ease' }}
                    />

                    {/* City code — on hover, or next race when nothing else is active */}
                    {(isActive || (isNext && !isPast && activeRace === null && selectedRace === null)) && (() => {
                      // Offset label right for SoCal races where the route line covers the left side
                      const needsOffset = race.cityCode === 'SDG' || race.cityCode === 'LBC';
                      return (
                      <text
                        x={needsOffset ? dotSize + 3 : 0}
                        y={-dotSize - 4}
                        textAnchor={needsOffset ? 'start' : 'middle'}
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 7,
                          fill: themeColor,
                          letterSpacing: '0.1em',
                          fontWeight: 'bold',
                        }}
                      >
                        {race.cityCode}
                      </text>
                      );
                    })()}
                  </Marker>
                );
              })}

              {/* SF Home — house icon, rendered last so it draws on top */}
              {/* SF Home — hollow ring to distinguish from filled race dots */}
              <Marker coordinates={SF_HOME}>
                <circle r={4} fill="#050505" stroke={themeColor} strokeWidth={1.5} />
                <text
                  x={-8}
                  y={1}
                  textAnchor="end"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 6,
                    fill: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.15em',
                  }}
                >
                  HOME
                </text>
              </Marker>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Sidebar — race list */}
        <nav className="hidden md:flex flex-col w-80 lg:w-96 border-l border-white/10 bg-black/50" aria-label="Race list">
          {/* Sidebar header */}
          <div className="px-5 py-4 border-b border-white/10">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/60">
              ALL RACES
            </div>
          </div>

          {/* Scrollable race list */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {RACES_2026.map((race) => {
              const isSameDay = isRaceSameDay(race.date);
              const isToday = isSameDay && !race.result;
              const isPast = (parseLocalDate(race.date) < new Date() && !isSameDay) || (isSameDay && !!race.result);
              const isNext = nextRace?.date === race.date;
              const daysUntil = getDaysUntil(parseLocalDate(race.date));
              const isActive = activeRace === race.cityCode;
              const raceDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC',
              }).format(parseLocalDate(race.date));

              return (
                <div
                  key={race.cityCode}
                  ref={(el) => { cardRefs.current[race.cityCode] = el; }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${race.name}, ${raceDate}${isPast ? ', completed' : `, ${daysUntil} days away`}`}
                  aria-pressed={selectedRace === race.cityCode}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedRace(selectedRace === race.cityCode ? null : race.cityCode); } }}
                  className={`block px-5 py-4 border-b transition-all duration-200 cursor-pointer${isPast ? ' opacity-40 hover:opacity-70' : ''}`}
                  style={{
                    borderColor: selectedRace === race.cityCode ? `${themeColor}44` : 'rgba(255,255,255,0.06)',
                    borderLeftWidth: race.isTarget && !isPast ? 2 : undefined,
                    borderLeftColor: race.isTarget && !isPast ? themeColor : undefined,
                    backgroundColor: selectedRace === race.cityCode
                      ? `${themeColor}20`
                      : isActive
                        ? `${themeColor}15`
                        : race.isTarget && !isPast
                          ? `${themeColor}08`
                          : isNext
                            ? `${themeColor}0a`
                            : 'transparent',
                  }}
                  onClick={() => setSelectedRace(selectedRace === race.cityCode ? null : race.cityCode)}
                  onMouseEnter={() => setHoverSafe(race.cityCode)}
                  onMouseLeave={() => setHoverSafe(null)}
                >
                  <div className="flex items-start gap-3">
                    {/* Left content — clean vertical rail, all left-aligned */}
                    <div className="flex-1 min-w-0 text-left">
                      {/* Date + badges */}
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: isPast ? 'rgba(255,255,255,0.3)' : themeColor }}
                        />
                        <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">
                          {raceDate.toUpperCase()}
                        </span>
                        {isToday && (
                          <span
                            className="font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full animate-pulse font-bold"
                            style={{ backgroundColor: `${themeColor}33`, color: themeColor, border: `1px solid ${themeColor}66` }}
                          >
                            RACE DAY
                          </span>
                        )}
                        {isNext && !isPast && !isToday && (
                          <span
                            className="font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full animate-pulse"
                            style={{ backgroundColor: `${themeColor}22`, color: themeColor }}
                          >
                            NEXT
                          </span>
                        )}
                        {race.isTarget && !isPast && (
                          <span
                            className="font-mono text-[8px] tracking-[0.15em] px-2 py-0.5 rounded-full font-bold"
                            style={{ backgroundColor: `${themeColor}22`, color: themeColor, border: `1px solid ${themeColor}44` }}
                          >
                            ★ NATIONALS
                          </span>
                        )}
                      </div>
                      {/* Race name — dominant scannable element */}
                      <div className="font-display text-base tracking-wide text-white mt-1">
                        {race.name}
                      </div>
                      {/* Location + distance */}
                      <div className="font-mono text-[11px] tracking-[0.1em] text-white/70 mt-0.5">
                        {race.location}
                        {race.distance ? ` · ${race.distance}` : ''}
                      </div>
                      {/* Championship label */}
                      {race.championship && (
                        <div
                          className="font-mono text-[10px] tracking-[0.1em] mt-1"
                          style={{ color: themeColor }}
                        >
                          {race.championship.toUpperCase()}
                        </div>
                      )}
                      {/* Sport icons — inline below content */}
                      <div className="flex items-center gap-1.5 mt-1.5" style={{ color: isPast ? 'rgba(255,255,255,0.3)' : `${themeColor}99` }}>
                        {race.type === 'triathlon' ? (
                          <>
                            <Waves className="w-4 h-4" />
                            <Bike className="w-4 h-4" />
                            <RunShoe className="w-4 h-4" />
                          </>
                        ) : (
                          <RunShoe className="w-4 h-4" />
                        )}
                      </div>
                      {/* Splits — shown when race is selected */}
                      {race.splits && selectedRace === race.cityCode && (
                        <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                          {race.splits.map((split) => (
                            <div key={split.leg} className="flex items-center gap-2">
                              <span className="font-mono text-[9px] tracking-[0.15em] text-white/50 w-8 shrink-0">{split.leg}</span>
                              <span className="font-mono text-[11px] font-medium" style={{ color: themeColor }}>{split.time}</span>
                              {split.pace && (
                                <span className="font-mono text-[10px] text-white/50">{split.pace}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Right — countdown pinned */}
                    <div className="flex flex-col items-end shrink-0 pt-0.5">
                      {isToday && (
                        <div className="text-right">
                          <div className="font-display text-xl leading-none animate-pulse" style={{ color: themeColor }}>
                            TODAY
                          </div>
                        </div>
                      )}
                      {!isPast && !isToday && (
                        <div className="text-right">
                          <div className="font-display text-3xl leading-none" style={{ color: themeColor }}>
                            {daysUntil}
                          </div>
                          <div className="font-mono text-[9px] tracking-[0.2em] text-white/70 mt-0.5">
                            DAYS
                          </div>
                        </div>
                      )}
                      {isPast && (
                        race.result ? (
                          <div className="font-display text-2xl leading-none" style={{ color: themeColor }}>
                            {race.result}
                          </div>
                        ) : (
                          <div className="font-mono text-[10px] tracking-[0.15em] text-white/50">
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
          <div className="px-5 py-3 border-t border-white/10 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] tracking-[0.15em] text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
              Upcoming
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              Completed
            </span>
          </div>
        </nav>
      </div>
      {/* Mobile championship tag — above nav */}
      {mobileIndex >= 0 && RACES_2026[mobileIndex]?.championship && (
        <div className="md:hidden text-center py-1.5" style={{ backgroundColor: `${themeColor}11` }}>
          <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: themeColor }}>
            {RACES_2026[mobileIndex].championship?.toUpperCase()}
          </span>
        </div>
      )}

      {/* Mobile bottom nav — visible only below md */}
      <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-md">
        {mobileIndex < 0 ? (
          <button
            onClick={() => {
              const nextIdx = RACES_2026.findIndex((r) => r.date === nextRace?.date);
              setMobileIndex(nextIdx >= 0 ? nextIdx : 0);
            }}
            className="w-full py-8 font-mono text-base tracking-[0.2em] transition-all duration-200"
            style={{ color: themeColor }}
          >
            EXPLORE RACES →
          </button>
        ) : (
          <div>
            {/* Full-width nav buttons with race counter */}
            <div className="flex items-stretch">
              <button
                onClick={() => setMobileIndex((prev) => prev <= 0 ? RACES_2026.length - 1 : prev - 1)}
                aria-label="Previous race"
                className="w-16 flex items-center justify-center border-r border-white/10 text-white/60 active:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div
                className="flex-1 py-3 text-center cursor-pointer active:bg-white/5 flex flex-col justify-center"
                style={{ minHeight: '105px' }}
                onClick={() => setMobileIndex(-1)}
              >
                {(() => {
                  const race = RACES_2026[mobileIndex];
                  if (!race) return null;
                  const isSameDay = isRaceSameDay(race.date);
                  const isToday = isSameDay && !race.result;
                  const isPast = (parseLocalDate(race.date) < new Date() && !isSameDay) || (isSameDay && !!race.result);
                  const daysUntil = getDaysUntil(parseLocalDate(race.date));
                  const raceDate = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC',
                  }).format(parseLocalDate(race.date));
                  return (
                    <>
                      {/* Discipline icons */}
                      <div className="flex items-center justify-center gap-1.5 mb-1" style={{ color: `${themeColor}88` }}>
                        {race.type === 'triathlon' ? (
                          <>
                            <Waves className="w-4 h-4" />
                            <Bike className="w-4 h-4" />
                            <RunShoe className="w-4 h-4" />
                          </>
                        ) : (
                          <RunShoe className="w-4 h-4" />
                        )}
                      </div>
                      {/* Race name */}
                      <div className="font-display text-lg tracking-wide text-white truncate">
                        {race.name}
                      </div>
                      {/* Date, location, distance */}
                      <div className="font-mono text-[11px] tracking-[0.1em] text-white/70 mt-1">
                        {raceDate.toUpperCase()} · {race.location}
                        {race.distance ? ` · ${race.distance}` : ''}
                      </div>
                      {/* Course */}
                      {race.course && (
                        <div className="font-mono text-[10px] tracking-[0.1em] text-white/60 mt-1.5 text-center">
                          {race.course}
                        </div>
                      )}
                      {/* Days until / Race Day */}
                      {isToday && (
                        <div className="font-mono text-[11px] tracking-[0.1em] font-bold mt-1 text-center animate-pulse" style={{ color: themeColor }}>
                          RACE DAY
                        </div>
                      )}
                      {!isPast && !isToday && (
                        <div className="font-mono text-[11px] tracking-[0.1em] font-medium mt-1 text-center" style={{ color: themeColor }}>
                          {daysUntil} DAYS
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <button
                onClick={() => setMobileIndex((prev) => prev >= RACES_2026.length - 1 ? 0 : prev + 1)}
                aria-label="Next race"
                className="w-16 flex items-center justify-center border-l border-white/10 text-white/60 active:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center gap-2 py-2 border-t border-white/5">
              {RACES_2026.map((race, i) => (
                <button
                  key={race.cityCode}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Go to ${race.name}`}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: i === mobileIndex ? themeColor : 'rgba(255,255,255,0.15)',
                    transform: i === mobileIndex ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default memo(FullRaceMap);
