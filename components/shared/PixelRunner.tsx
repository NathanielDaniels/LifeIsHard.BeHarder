'use client';

import { useEffect, useRef } from 'react';

interface PixelRunnerProps {
  themeColor: string;
}

// Patrick's silhouette from the boot screen — body + prosthetic leg
const BODY_PATH = 'M 30,52 Q 50,48 70,52 Q 86,52 86,68 L 86,138 A 5,5 0 0,1 76,138 L 76,80 Q 76,72 70,72 L 70,160 A 8,8 0 0,1 54,160 L 54,140 A 4,4 0 0,0 46,140 L 46,238 A 8,8 0 0,1 30,238 L 30,72 Q 24,72 24,80 L 24,138 A 5,5 0 0,1 14,138 L 14,68 Q 14,52 30,52 Z';
const PROSTHETIC_PATH = 'M 60,166 L 60,185 L 58,188 L 58,196 L 60,199 L 60,220 L 58,222 L 58,228 L 60,230 L 60,240 L 55,242 L 55,246 L 69,246 L 69,242 L 64,240 L 64,230 L 66,228 L 66,222 L 64,220 L 64,199 L 66,196 L 66,188 L 64,185 L 64,166 Z';

const FIGURE_HEIGHT = 32; // rendered height in px

export default function PixelRunner({ themeColor }: PixelRunnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(-80);
  const animRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const figure = container.querySelector('.runner-figure') as HTMLElement;
    if (!figure) return;

    const speed = 1.2;

    const loop = () => {
      const w = container.offsetWidth;
      timeRef.current += 0.08;

      // Move across screen
      posRef.current += speed;
      if (posRef.current > w + 80) {
        posRef.current = -80;
      }

      // Running bob: vertical oscillation (2 bounces per stride cycle)
      const bob = Math.abs(Math.sin(timeRef.current * 2.5)) * 4;

      // Slight forward/back tilt to simulate stride
      const tilt = Math.sin(timeRef.current * 2.5) * 3;

      figure.style.transform = `translateX(${posRef.current}px) translateY(${-bob}px) rotate(${12 + tilt}deg)`;

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-hidden"
      style={{ height: `${FIGURE_HEIGHT + 12}px` }}
      aria-hidden="true"
    >
      <div
        className="runner-figure absolute bottom-0"
        style={{
          width: `${FIGURE_HEIGHT * 0.4}px`,
          height: `${FIGURE_HEIGHT}px`,
          transformOrigin: 'center bottom',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 100 250"
          className="w-full h-full"
          style={{
            fill: themeColor,
            opacity: 0.6,
            filter: `drop-shadow(0 0 4px ${themeColor}66)`,
          }}
        >
          <circle cx="50" cy="24" r="14" />
          <path d={BODY_PATH} />
          <path d={PROSTHETIC_PATH} />
        </svg>
      </div>
    </div>
  );
}
