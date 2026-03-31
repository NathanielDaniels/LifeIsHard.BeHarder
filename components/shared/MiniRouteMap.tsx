'use client';

import { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';
import { SF_HOME } from '@/lib/race-data';
import { haversineDistance, formatMiles } from '@/lib/geo-utils';

interface MiniRouteMapProps {
  destination: [number, number];
  themeColor: string;
  isTarget?: boolean;
  cityCode: string;
  stateFips: string;
}

const STATES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const COUNTIES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

// Great Lakes approximate centers and radii for SVG rendering [lng, lat]
const GREAT_LAKES: Array<{ center: [number, number]; rx: number; ry: number }> = [
  { center: [-87.5, 44.5], rx: 1.2, ry: 2.0 },  // Lake Michigan
  { center: [-82.5, 44.0], rx: 1.5, ry: 1.8 },  // Lake Huron
  { center: [-86.5, 47.0], rx: 2.0, ry: 0.8 },  // Lake Superior
  { center: [-81.0, 42.2], rx: 1.5, ry: 0.5 },  // Lake Erie
  { center: [-77.5, 43.5], rx: 1.0, ry: 0.3 },  // Lake Ontario
];

const MIN_DISTANCE_LABEL = 50; // Don't show distance for < 50 miles

interface DistanceLabelProps {
  from: [number, number];
  to: [number, number];
  distance: number;
  isCA: boolean;
}

function DistanceLabel({ from, to, distance, isCA }: DistanceLabelProps) {
  const midLng = (from[0] + to[0]) / 2;
  const midLat = (from[1] + to[1]) / 2;
  // Offset label to the right of the route line to avoid overlapping markers
  const offsetLng = isCA ? 1.8 : 4;
  const label = `${formatMiles(distance)} MI`;
  const fontSize = isCA ? 14 : 11;
  const padX = isCA ? 8 : 6;
  const padY = isCA ? 5 : 4;
  const textWidth = label.length * fontSize * 0.6;

  return (
    <Marker coordinates={[midLng + offsetLng, midLat]}>
      <rect
        x={-textWidth / 2 - padX}
        y={-fontSize / 2 - padY}
        width={textWidth + padX * 2}
        height={fontSize + padY * 2}
        rx={2}
        fill="rgba(5,5,5,0.85)"
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgba(255,255,255,0.65)"
        fontFamily="monospace"
        fontSize={fontSize}
        letterSpacing={0.8}
      >
        {label}
      </text>
    </Marker>
  );
}

interface RouteArcProps {
  from: [number, number];
  to: [number, number];
  themeColor: string;
  cityCode: string;
  isCA: boolean;
}

function RouteArc({ from, to, themeColor, cityCode, isCA }: RouteArcProps) {
  return (
    <>
      {/* Glow line */}
      <Line
        from={from}
        to={to}
        stroke={themeColor}
        strokeWidth={isCA ? 7 : 5}
        strokeLinecap="round"
        strokeOpacity={0.08}
        style={{ filter: `url(#routeGlow-${cityCode})` }}
      />
      {/* Main line */}
      <Line
        from={from}
        to={to}
        stroke={themeColor}
        strokeWidth={isCA ? 2 : 1.5}
        strokeLinecap="round"
        strokeOpacity={0.85}
      />
      {/* Animated dash overlay */}
      <Line
        from={from}
        to={to}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeDasharray="4,12"
      />
    </>
  );
}

function MiniRouteMap({ destination, themeColor, isTarget, cityCode, stateFips }: MiniRouteMapProps) {
  const [expanded, setExpanded] = useState(false);

  const isLocal = Math.abs(destination[0] - SF_HOME[0]) < 0.5 &&
                  Math.abs(destination[1] - SF_HOME[1]) < 0.5;

  const isCA = destination[0] < -114;

  const projection = isCA ? 'geoMercator' as const : 'geoAlbersUsa' as const;
  const projectionConfig = isCA
    ? { scale: 2200, center: [-119.5, 36.0] as [number, number] }
    : { scale: 1000 };

  const distance = useMemo(
    () => haversineDistance(SF_HOME, destination),
    [destination]
  );
  const showDistance = distance >= MIN_DISTANCE_LABEL;

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(true);
  }, []);
  const handleClose = useCallback(() => setExpanded(false), []);

  // Defer county mesh rendering until after expand animation
  const [showCounties, setShowCounties] = useState(false);

  useEffect(() => {
    if (!expanded) { setShowCounties(false); return; }
    const close = () => setExpanded(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', close);
    const timer = setTimeout(() => setShowCounties(true), 300);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('click', close); clearTimeout(timer); };
  }, [expanded]);

  const mapContent = (
    <ComposableMap
      projection={projection}
      projectionConfig={projectionConfig}
      width={800}
      height={480}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <filter id={`glow-${cityCode}${expanded ? '-exp' : ''}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`routeGlow-${cityCode}${expanded ? '-exp' : ''}`}>
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`routeGrad-${cityCode}${expanded ? '-exp' : ''}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={themeColor} stopOpacity={0.3} />
          <stop offset="50%" stopColor={themeColor} stopOpacity={0.8} />
          <stop offset="100%" stopColor={themeColor} stopOpacity={0.3} />
        </linearGradient>
      </defs>

      {/* Layer 1: County mesh (faint background texture) — deferred after expand animation */}
      {showCounties && !isCA && (
        <Geographies geography={COUNTIES_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="none"
                stroke={
                  String(geo.id).startsWith(stateFips)
                    ? `${themeColor}14`
                    : 'rgba(255,255,255,0.02)'
                }
                strokeWidth={0.3}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
      )}

      {/* Layer 2: State outlines + destination state highlight */}
      <Geographies geography={STATES_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isHighlighted = String(geo.id).padStart(2, '0') === stateFips;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isHighlighted ? `${themeColor}18` : 'rgba(255,255,255,0.05)'}
                stroke={isHighlighted ? `${themeColor}44` : 'rgba(255,255,255,0.10)'}
                strokeWidth={isHighlighted ? 0.8 : (isCA ? 0.8 : 0.4)}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>

      {/* Layer 3: Great Lakes (only on US-wide view) */}
      {!isCA && GREAT_LAKES.map((lake, i) => (
        <Marker key={`lake-${i}`} coordinates={lake.center}>
          <ellipse
            rx={lake.rx * 15}
            ry={lake.ry * 15}
            fill="rgba(100,160,255,0.04)"
            stroke="rgba(100,160,255,0.06)"
            strokeWidth={0.3}
          />
        </Marker>
      ))}

      {/* Layer 4: Route */}
      {!isLocal && (
        <RouteArc
          from={SF_HOME}
          to={destination}
          themeColor={themeColor}
          cityCode={`${cityCode}${expanded ? '-exp' : ''}`}
          isCA={isCA}
        />
      )}

      {/* Layer 5: SF home dot + label */}
      <Marker coordinates={SF_HOME}>
        <circle r={isCA ? 4 : 2.5} fill="white" opacity={0.8} />
        <text
          y={isCA ? 16 : 12}
          textAnchor="middle"
          fill="rgba(255,255,255,0.55)"
          fontFamily="monospace"
          fontSize={isCA ? 10 : 7}
          letterSpacing={0.5}
        >
          SF
        </text>
      </Marker>

      {/* Layer 6: Destination dot + label + pulse */}
      <Marker coordinates={destination}>
        <circle
          r={isTarget ? 5 : (isCA ? 4 : 3)}
          fill={themeColor}
          opacity={0.15}
          filter={`url(#glow-${cityCode}${expanded ? '-exp' : ''})`}
        />
        <circle
          r={isTarget ? 3.5 : (isCA ? 3 : 2.5)}
          fill={isTarget ? themeColor : 'white'}
          opacity={isTarget ? 1 : 0.8}
        />
        {isTarget && (
          <circle r={5} fill="none" stroke={themeColor} strokeWidth={0.6} opacity={0.4}>
            <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
        )}
        <text
          y={isCA ? -10 : -8}
          textAnchor="middle"
          fill={isTarget ? `${themeColor}BB` : 'rgba(255,255,255,0.65)'}
          fontFamily="monospace"
          fontSize={isCA ? 10 : 7}
          fontWeight={isTarget ? 'bold' : 'normal'}
          letterSpacing={0.5}
        >
          {cityCode}
        </text>
      </Marker>

      {/* Layer 7: Distance label */}
      {showDistance && !isLocal && (
        <DistanceLabel
          from={SF_HOME}
          to={destination}
          distance={distance}
          isCA={isCA}
        />
      )}
    </ComposableMap>
  );

  return (
    <>
      {/* Mini map thumbnail */}
      <div
        className="w-full max-w-[280px] aspect-[5/3] rounded-lg overflow-hidden bg-white/[0.05] border border-white/[0.08] cursor-pointer transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-orange-500/50 outline-none"
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(e as unknown as React.MouseEvent); } }}
        title="Click to expand map"
        aria-label="Expand route map"
      >
        {mapContent}
      </div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Map container */}
            <motion.div
              className="relative w-[90vw] max-w-[720px] aspect-[5/3] rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/[0.1] shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {mapContent}

              {/* Close hint */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 text-white/30 text-xs font-mono">
                ESC
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(MiniRouteMap);
