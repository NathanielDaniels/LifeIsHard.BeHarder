"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { BHUTAN_PATH, NEIGHBOUR_PATH, PLACES, PROFILE, ROUTE, TRAIL_KM } from "@/lib/bhutan-trail-data";

/*
 * The Trans Bhutan Trail on a real map of Bhutan. As the reader scrolls, the
 * route draws itself from Haa to Trashigang, a marker walks it, passes light
 * up as he crosses them, and an elevation strip underneath rises and falls
 * with the real stage data. Numbers come from lib/bhutan-trail-data.ts.
 */

const TRAIL_DAYS = 29; // Patrick's crossing: Oct 24 to Nov 22, 2022
const TRAIL_MILES = 250;
const M_TO_FT = 3.28084;
const SPRING = { stiffness: 90, damping: 26, mass: 0.6 };

/** The part of the generated map worth showing: Bhutan with a little air around it. */
const VB = { x: 130, y: 40, w: 740, h: 440 };
const PROFILE_H = 100;
const MAP_FADE = "radial-gradient(ellipse 75% 80% at 50% 50%, #000 60%, transparent 100%)";
const MAX_M = Math.max(...PROFILE.map(([, m]) => m));
const MIN_M = Math.min(...PROFILE.map(([, m]) => m));
const HIGH_POINT = PROFILE.find(([, m]) => m === MAX_M)![0];

/** Labels shown on phones; the rest appear from md up. */
const PHONE_LABELS = new Set(["Haa", "Thimphu", "Trongsa", "Trashigang"]);

const ft = (m: number) => Math.round(m * M_TO_FT).toLocaleString("en-US");
const pct = (v: number, start: number, size: number) => `${((v - start) / size) * 100}%`;

function interpolate<T extends number[]>(rows: T[], km: number, xIndex: number): T {
  if (km <= rows[0][xIndex]) return rows[0];
  for (let i = 1; i < rows.length; i++) {
    const a = rows[i - 1];
    const b = rows[i];
    if (km <= b[xIndex]) {
      const t = (km - a[xIndex]) / (b[xIndex] - a[xIndex] || 1);
      return a.map((v, k) => v + (b[k] - v) * t) as T;
    }
  }
  return rows[rows.length - 1];
}

const ROUTE_D = `M${ROUTE.map(([x, y]) => `${x} ${y}`).join(" L")}`;
const PROFILE_POINTS = PROFILE.map(([km, m]) => [
  (km / TRAIL_KM) * 1000,
  PROFILE_H - 8 - ((m - MIN_M) / (MAX_M - MIN_M)) * (PROFILE_H - 22),
]);
const PROFILE_D = `M${PROFILE_POINTS.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")}`;
const PROFILE_AREA = `${PROFILE_D} L1000 ${PROFILE_H} L0 ${PROFILE_H} Z`;

function walkedRoute(km: number) {
  const [x, y] = interpolate(ROUTE, km, 2);
  const done = ROUTE.filter((p) => p[2] < km).map(([px, py]) => `${px} ${py}`);
  return { d: `M${[...done, `${x} ${y}`].join(" L")}`, x, y };
}

function Readout({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/40">{label}</div>
      <div className="font-display text-[1.7rem] md:text-5xl leading-none mt-1.5 tabular-nums whitespace-nowrap">
        {value}
        {unit && <span className="text-white/30 text-sm md:text-xl"> {unit}</span>}
      </div>
    </div>
  );
}

export default function TrailMap() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // The map pins for a few screens of scroll; the walk spans exactly that pinned stretch.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, SPRING);
  const progress = reduceMotion ? scrollYProgress : smooth;
  // Start at 0 on both server and client; the effect below applies the real value after hydration.
  const [p, setP] = useState(0);

  const update = (value: number) => setP(reduceMotion ? 1 : Math.min(Math.max(value, 0), 1));
  useMotionValueEvent(progress, "change", update);
  useEffect(() => update(progress.get()), [reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  const km = p * TRAIL_KM;
  const walked = walkedRoute(km);
  const [, elevation] = interpolate(PROFILE, km, 0);
  const passed = PLACES.filter((place) => place.km <= km + 0.01);
  const lastPass = [...passed].reverse().find((place) => place.kind === "pass");
  const finished = p >= 0.995;
  const markerProfile = interpolate(PROFILE_POINTS, (km / TRAIL_KM) * 1000, 0);

  return (
    <div ref={ref} className="relative mt-8 h-[260svh]">
    <figure
      className="sticky top-0 h-[100svh] flex flex-col justify-center py-16"
      aria-label="Map of the Trans Bhutan Trail: 403 kilometres, about 250 miles, from Haa in the west to Trashigang in the east, crossing 12 mountain passes. The high point is Pumola at 3,994 metres, 13,104 feet."
    >
      <div className="grid grid-cols-3 gap-3 max-w-xl" aria-hidden="true">
        <Readout label="Day" value={String(Math.max(1, Math.round(1 + p * (TRAIL_DAYS - 1)))).padStart(2, "0")} unit={`/ ${TRAIL_DAYS}`} />
        <Readout label="Miles" value={String(Math.round(p * TRAIL_MILES)).padStart(3, "0")} unit={`/ ${TRAIL_MILES}`} />
        <Readout label="Elevation" value={ft(elevation)} unit="ft" />
      </div>

      <div
        className="relative mt-6 select-none"
        style={{ maskImage: MAP_FADE, WebkitMaskImage: MAP_FADE }}
        aria-hidden="true"
      >
        <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="w-full h-auto block">
          <defs>
            <radialGradient id="trail-glow">
              <stop offset="0" stopColor="var(--theme-color, #f97316)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--theme-color, #f97316)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <path d={NEIGHBOUR_PATH} fill="none" stroke="rgb(255 255 255 / 7%)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={BHUTAN_PATH} fill="rgb(255 255 255 / 4%)" stroke="rgb(255 255 255 / 28%)" strokeWidth="1" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

          <path d={ROUTE_D} fill="none" stroke="rgb(255 255 255 / 22%)" strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d={walked.d} fill="none" stroke="var(--theme-color, #f97316)" strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ filter: "blur(3px)" }} />
          <path d={walked.d} fill="none" stroke="var(--theme-color, #f97316)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

          {PLACES.map((place) => {
            const lit = place.km <= km + 0.01;
            return place.kind === "pass" ? (
              <path
                key={place.name}
                d={`M${place.x} ${place.y - 12} l5 8 l-10 0 z`}
                fill={lit ? "var(--theme-color, #f97316)" : "#050505"}
                stroke={lit ? "var(--theme-color, #f97316)" : "rgb(255 255 255 / 45%)"}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <circle
                key={place.name}
                cx={place.x}
                cy={place.y}
                r="3.2"
                fill={lit ? "#fff" : "#050505"}
                stroke={lit ? "#fff" : "rgb(255 255 255 / 45%)"}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          <circle cx={walked.x} cy={walked.y} r="34" fill="url(#trail-glow)" />
          {!reduceMotion && !finished && (
            <circle cx={walked.x} cy={walked.y} r="7" fill="none" stroke="var(--theme-color, #f97316)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
              <animate attributeName="r" values="6;16" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={walked.x} cy={walked.y} r="5" fill="#fff" stroke="var(--theme-color, #f97316)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* HTML labels so the type stays readable when the map scales down */}
        {PLACES.filter((place) => place.kind === "town").map((place) => (
          <span
            key={place.name}
            className={`${PHONE_LABELS.has(place.name) ? "" : "hidden md:block"} absolute -translate-x-1/2 mt-2.5 font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-500`}
            style={{
              left: pct(place.x, VB.x, VB.w),
              top: pct(place.y, VB.y, VB.h),
              color: place.km <= km + 0.01 ? "rgb(255 255 255 / 80%)" : "rgb(255 255 255 / 30%)",
            }}
          >
            {place.name}
          </span>
        ))}
        {lastPass && (
          <span
            key={lastPass.name}
            className="absolute -translate-x-1/2 -translate-y-full -mt-4 px-2 py-1 rounded-sm bg-black/70 border font-mono text-[9px] md:text-[10px] tracking-[0.15em] uppercase whitespace-nowrap animate-[fadeIn_0.4s_ease-out]"
            style={{
              left: pct(lastPass.x, VB.x, VB.w),
              top: pct(lastPass.y, VB.y, VB.h),
              borderColor: "color-mix(in srgb, var(--theme-color, #f97316) 50%, transparent)",
            }}
          >
            {lastPass.name} · {ft(lastPass.m ?? 0)} ft
          </span>
        )}
        <span className="absolute left-[3%] top-[6%] font-mono text-[9px] tracking-[0.35em] uppercase text-white/25">Bhutan</span>
      </div>

      {/* Elevation, stage by stage */}
      <div className="relative mt-6" aria-hidden="true">
        <svg viewBox={`0 0 1000 ${PROFILE_H}`} preserveAspectRatio="none" className="w-full h-16 md:h-20 block">
          <defs>
            <linearGradient id="profile-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--theme-color, #f97316)" stopOpacity="0.3" />
              <stop offset="1" stopColor="var(--theme-color, #f97316)" stopOpacity="0" />
            </linearGradient>
            <clipPath id="profile-walked">
              <rect x="0" y="0" width={markerProfile[0]} height={PROFILE_H} />
            </clipPath>
          </defs>
          <path d={PROFILE_AREA} fill="rgb(255 255 255 / 4%)" />
          <path d={PROFILE_D} fill="none" stroke="rgb(255 255 255 / 20%)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={PROFILE_AREA} fill="url(#profile-fill)" clipPath="url(#profile-walked)" />
          <path d={PROFILE_D} fill="none" stroke="var(--theme-color, #f97316)" strokeWidth="1.75" vectorEffect="non-scaling-stroke" clipPath="url(#profile-walked)" />
          <line x1={markerProfile[0]} x2={markerProfile[0]} y1="0" y2={PROFILE_H} stroke="rgb(255 255 255 / 35%)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <span
          className="absolute -top-5 -ml-1 pl-2 border-l border-white/25 font-mono text-[9px] tracking-[0.15em] uppercase text-white/45 whitespace-nowrap"
          style={{ left: `${(HIGH_POINT / TRAIL_KM) * 100}%` }}
        >
          High point · Pumola · {ft(MAX_M)} ft
        </span>
        <div className="flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase mt-2">
          <span className="text-white/50">Haa</span>
          <span className="transition-colors duration-500" style={{ color: finished ? "var(--theme-color, #f97316)" : "rgb(255 255 255 / 30%)" }}>
            Trashigang
          </span>
        </div>
      </div>

      <figcaption className="mt-5 text-[11px] leading-relaxed text-white/35 max-w-md">
        Route, distances and elevations from the Trans Bhutan Trail&rsquo;s official itinerary. The line links the
        towns and passes along the way; it doesn&rsquo;t trace every switchback.
      </figcaption>
    </figure>
    </div>
  );
}
