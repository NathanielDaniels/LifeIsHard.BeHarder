"use client";

import { useId, useRef } from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";
import { useWhoop } from "@/contexts/WhoopContext";

/** One heartbeat occupies this many viewBox units horizontally. */
const BEAT_WIDTH = 200;
const VIEW_WIDTH = 1200;
/** Beats drawn: enough to cover the view plus one beat of scroll travel. */
const BEAT_COUNT = VIEW_WIDTH / BEAT_WIDTH + 1;
const FALLBACK_BPM = 60;

/** A P wave, the QRS spike, and a T wave on a flat baseline at y=50. */
const BEAT_PATH =
  "l60 0 l8 -6 l8 6 l12 0 l6 8 l6 -50 l6 70 l6 -28 l18 0 l12 -10 l14 10 l44 0";

const TRACE_PATH = `M0 50 ${Array.from({ length: BEAT_COUNT }, () => BEAT_PATH).join(" ")}`;

/**
 * A horizon-width ECG line that scrolls at Patrick's displayed WHOOP heart rate.
 * Driven by a frame loop rather than a CSS duration so a changing heart rate
 * never makes the trace jump.
 */
export default function HeartbeatTrace({ className = "" }: { className?: string }) {
  const { currentHeartRate } = useWhoop();
  const reduceMotion = useReducedMotion();
  const groupRef = useRef<SVGGElement>(null);
  const offset = useRef(0);
  const maskId = useId();

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !groupRef.current) return;
    const bpm = currentHeartRate > 0 ? currentHeartRate : FALLBACK_BPM;
    // Cap delta so a backgrounded tab doesn't lurch forward on return.
    const seconds = Math.min(delta, 100) / 1000;
    offset.current = (offset.current + seconds * (bpm / 60) * BEAT_WIDTH) % BEAT_WIDTH;
    groupRef.current.setAttribute("transform", `translate(${-offset.current} 0)`);
  });

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} 100`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${maskId}-fade`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${maskId}-mask`}>
          <rect width={VIEW_WIDTH} height="100" fill={`url(#${maskId}-fade)`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId}-mask)`}>
        <g ref={groupRef}>
          <path
            d={TRACE_PATH}
            fill="none"
            stroke="var(--theme-color, #f97316)"
            strokeWidth="6"
            strokeOpacity="0.25"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "blur(4px)" }}
          />
          <path
            d={TRACE_PATH}
            fill="none"
            stroke="var(--theme-color, #f97316)"
            strokeWidth="1.75"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>
    </svg>
  );
}
