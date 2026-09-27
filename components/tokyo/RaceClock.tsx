"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const RUN_DURATION_MS = 2600;

function formatClock(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * A finish-line clock that runs from 0:00:00 up to `seconds` the first time
 * it scrolls into view. Each digit sits in a fixed-width cell so the numbers
 * never shift sideways while they tick.
 */
export default function RaceClock({ seconds, className = "" }: { seconds: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setShown(seconds);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / RUN_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setShown(Math.round(eased * seconds));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, seconds]);

  const final = formatClock(seconds);
  return (
    <div ref={ref} className={className}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" className="inline-flex">
        {formatClock(shown)
          .split("")
          .map((char, i) =>
            char === ":" ? (
              <span key={i} className="w-[0.28em] text-center opacity-60">:</span>
            ) : (
              <span key={i} className="w-[0.52em] text-center">{char}</span>
            ),
          )}
      </span>
    </div>
  );
}
