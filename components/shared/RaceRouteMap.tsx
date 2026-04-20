'use client';

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';

interface RaceRouteMapProps {
  themeColor: string;
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const SF_HOME: [number, number] = [-122.44, 37.76];

const RACE_POINTS = [
  { id: 'napa',             coords: [-122.29, 38.30] as [number, number], label: 'NAPA VALLEY',      date: 'APR 11', order: 1,  type: 'tri' },
  { id: 'hammond',          coords: [-87.50, 41.58]  as [number, number], label: 'HAMMOND',           date: 'JUN 7',  order: 2,  type: 'tri' },
  { id: 'long-beach',       coords: [-118.19, 33.77] as [number, number], label: 'LONG BEACH',       date: 'JUN 19', order: 3,  type: 'tri' },
  { id: 'pleasant-prairie', coords: [-87.93, 42.55]  as [number, number], label: 'PLEASANT PRAIRIE', date: 'JUN 28', order: 4,  type: 'tri' },
  { id: 'sf',               coords: SF_HOME,                              label: 'SAN FRANCISCO',    date: 'JUL 26', order: 5,  type: 'run', isHome: true },
  { id: 'milwaukee',        coords: [-87.91, 43.04]  as [number, number], label: 'MILWAUKEE',        date: 'AUG 9',  order: 6,  type: 'tri', isTarget: true },
  { id: 'chicago',          coords: [-87.63, 41.88]  as [number, number], label: 'CHICAGO',          date: 'AUG 23', order: 7,  type: 'tri' },
  { id: 'la-jolla',         coords: [-117.27, 32.85] as [number, number], label: 'LA JOLLA',         date: 'OCT 25', order: 8,  type: 'tri' },
  { id: 'berkeley',         coords: [-122.27, 37.87] as [number, number], label: 'BERKELEY',         date: 'NOV 15', order: 9,  type: 'run' },
  { id: 'sacramento',       coords: [-121.49, 38.58] as [number, number], label: 'SACRAMENTO',       date: 'DEC 6',  order: 10, type: 'run' },
];

// Hub-and-spoke: every race originates from SF home base
const RACE_ARCS = RACE_POINTS
  .filter((p) => p.id !== 'sf')
  .map((point) => ({
    from: SF_HOME,
    to: point.coords as [number, number],
  }));

function RaceRouteMap({ themeColor }: RaceRouteMapProps) {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 md:mt-24">
      <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 md:p-8 overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1200 }}
          width={960}
          height={600}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(255,255,255,0.04)"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: 'rgba(255,255,255,0.07)' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Route lines */}
          {RACE_ARCS.map((arc, i) => (
            <Line
              key={`arc-${i}`}
              from={arc.from}
              to={arc.to}
              stroke={themeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeOpacity={0.5}
            />
          ))}

          {/* Route line glow */}
          {RACE_ARCS.map((arc, i) => (
            <Line
              key={`glow-${i}`}
              from={arc.from}
              to={arc.to}
              stroke={themeColor}
              strokeWidth={5}
              strokeLinecap="round"
              strokeOpacity={0.12}
              style={{ filter: 'blur(3px)' }}
            />
          ))}

          {/* SF home base marker */}
          <Marker coordinates={SF_HOME}>
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Pulse ring */}
              {!prefersReduced && (
                <circle r={10} fill="none" stroke="white" strokeWidth={0.8} opacity={0.3}>
                  <animate attributeName="r" values="10;20;10" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={8} fill="white" opacity={0.15} style={{ filter: 'blur(4px)' }} />
              <circle r={6} fill="white" opacity={0.9} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                fontSize={5}
                fontFamily="monospace"
                fontWeight="bold"
              >
                HQ
              </text>
              <text
                y={-14}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize={6}
                fontFamily="monospace"
                letterSpacing="0.1em"
              >
                SAN FRANCISCO
              </text>
            </motion.g>
          </Marker>

          {/* Race markers */}
          {RACE_POINTS.filter((p) => p.id !== 'sf').map((point, i) => (
            <Marker key={point.id} coordinates={point.coords as [number, number]}>
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              >
                {/* Pulse ring for target */}
                {point.isTarget && !prefersReduced && (
                  <circle r={18} fill="none" stroke={themeColor} strokeWidth={1} opacity={0.3}>
                    <animate attributeName="r" values="10;22;10" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Outer glow */}
                <circle
                  r={point.isTarget ? 10 : 6}
                  fill={themeColor}
                  opacity={0.2}
                  style={{ filter: 'blur(4px)' }}
                />

                {/* Dot */}
                <circle
                  r={point.isTarget ? 7 : 4.5}
                  fill={point.isTarget ? themeColor : 'white'}
                  opacity={point.isTarget ? 1 : 0.8}
                />

                {/* Order number */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={point.isTarget ? 'black' : 'rgba(0,0,0,0.9)'}
                  fontSize={point.isTarget ? 7 : 5.5}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {point.order}
                </text>

                {/* Label */}
                <text
                  y={point.isTarget ? -16 : -12}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontSize={6}
                  fontFamily="monospace"
                  letterSpacing="0.1em"
                >
                  {point.label}
                </text>
              </motion.g>
            </Marker>
          ))}
        </ComposableMap>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-3">
          {RACE_POINTS.map((point) => (
            <div key={point.id} className="flex items-start gap-2">
              <span
                className="font-mono text-[10px] mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: point.isTarget ? themeColor : 'rgba(255,255,255,0.1)',
                  color: point.isTarget ? 'black' : 'rgba(255,255,255,0.5)',
                  fontWeight: point.isTarget ? 700 : 500,
                }}
              >
                {point.order}
              </span>
              <div className="min-w-0">
                <div
                  className="font-mono text-[9px] tracking-[0.15em] truncate"
                  style={{ color: point.isTarget ? themeColor : 'rgba(255,255,255,0.5)' }}
                >
                  {point.label}
                </div>
                <div className="font-mono text-[8px] tracking-[0.1em] text-white/30">
                  {point.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(RaceRouteMap);
