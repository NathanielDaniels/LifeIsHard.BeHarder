'use client';

import { useEffect, useState, useRef } from 'react';

interface CustomCursorProps {
  themeColor: string;
  isDimmed?: boolean;
  // Legacy props - kept for coming-soon page compat, cursor now self-tracks
  isHovering?: boolean;
  mousePosition?: { x: number; y: number };
}

export default function CustomCursor({ themeColor, isDimmed = false }: CustomCursorProps) {
  const cursorColor = isDimmed ? 'rgba(255,255,255,0.2)' : themeColor;
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animationId: number;
    const animate = () => {
      setCursorPosition((prev) => ({
        x: prev.x + (mouseRef.current.x - prev.x) * 0.15,
        y: prev.y + (mouseRef.current.y - prev.y) * 0.15,
      }));
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
        className="fixed w-5 h-5 border rounded-full pointer-events-none z-[9999] transition-colors duration-700 hidden md:block"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          borderColor: cursorColor,
        }}
      />
      <div
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] transition-colors duration-700 hidden md:block"
        style={{
          left: mouseRef.current.x,
          top: mouseRef.current.y,
          transform: 'translate(-50%, -50%)',
          backgroundColor: cursorColor,
        }}
      />
    </>
  );
}
