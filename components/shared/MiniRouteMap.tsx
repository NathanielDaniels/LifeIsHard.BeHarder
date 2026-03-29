'use client';

import { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';
import { SF_HOME } from '@/lib/race-data';

interface MiniRouteMapProps {
  destination: [number, number];
  themeColor: string;
  isTarget?: boolean;
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// California races: destination longitude west of ~-114 (CA/NV border)
function isCalifornia(coords: [number, number]): boolean {
  return coords[0] < -114;
}

function MiniRouteMap({ destination, themeColor, isTarget }: MiniRouteMapProps) {
  const isLocal = Math.abs(destination[0] - SF_HOME[0]) < 0.5 &&
                  Math.abs(destination[1] - SF_HOME[1]) < 0.5;

  const isCA = isCalifornia(destination);

  // Zoomed CA view vs full US view
  const projection = isCA ? 'geoMercator' as const : 'geoAlbersUsa' as const;
  const projectionConfig = isCA
    ? { scale: 2200, center: [-119.5, 36.0] as [number, number] }
    : { scale: 1000 };

  return (
    <div className="w-full max-w-[280px] aspect-[5/3] rounded-lg overflow-hidden bg-white/[0.02] border border-white/[0.05]">
      <ComposableMap
        projection={projection}
        projectionConfig={projectionConfig}
        width={800}
        height={480}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={isCA ? 0.8 : 0.4}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* Route line */}
        {!isLocal && (
          <>
            <Line
              from={SF_HOME}
              to={destination}
              stroke={themeColor}
              strokeWidth={isCA ? 2 : 1.5}
              strokeLinecap="round"
              strokeOpacity={0.6}
            />
            <Line
              from={SF_HOME}
              to={destination}
              stroke={themeColor}
              strokeWidth={isCA ? 7 : 5}
              strokeLinecap="round"
              strokeOpacity={0.1}
              style={{ filter: 'blur(3px)' }}
            />
          </>
        )}

        {/* SF home dot */}
        <Marker coordinates={SF_HOME}>
          <circle r={isCA ? 4 : 2.5} fill="white" opacity={0.6} />
        </Marker>

        {/* Destination dot */}
        <Marker coordinates={destination}>
          <circle
            r={isTarget ? 5 : (isCA ? 4 : 3)}
            fill={themeColor}
            opacity={0.2}
            style={{ filter: 'blur(2px)' }}
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
        </Marker>
      </ComposableMap>
    </div>
  );
}

export default memo(MiniRouteMap);
