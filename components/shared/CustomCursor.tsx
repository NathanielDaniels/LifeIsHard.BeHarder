'use client';

import { useEffect, useRef } from 'react';

interface CustomCursorProps {
  themeColor: string;
  isDimmed?: boolean;
}

export default function CustomCursor({ themeColor, isDimmed = false }: CustomCursorProps) {
  const cursorColor = isDimmed ? 'rgba(255,255,255,0.2)' : themeColor;
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animationId: number;
    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.15;

      // Direct DOM updates — no React re-renders
      if (outerRef.current) {
        outerRef.current.style.transform =
          `translate(${posRef.current.x - 10}px, ${posRef.current.y - 10}px)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate(${mouseRef.current.x - 3}px, ${mouseRef.current.y - 3}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-5 h-5 border rounded-full pointer-events-none z-[9999] transition-colors duration-700 hidden md:block will-change-transform"
        style={{ borderColor: cursorColor }}
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] transition-colors duration-700 hidden md:block will-change-transform"
        style={{ backgroundColor: cursorColor }}
      />
    </>
  );
}
