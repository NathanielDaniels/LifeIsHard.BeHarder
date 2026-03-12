'use client';

import { useEffect, useState, useRef } from 'react';

interface CustomCursorProps {
  themeColor: string;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
}

export default function CustomCursor({ themeColor, isHovering, mousePosition }: CustomCursorProps) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef(mousePosition);
  mousePositionRef.current = mousePosition;

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setCursorPosition((prev) => ({
        x: prev.x + (mousePositionRef.current.x - prev.x) * 0.15,
        y: prev.y + (mousePositionRef.current.y - prev.y) * 0.15,
      }));
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <>
      <div
        className="fixed w-5 h-5 border rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 hidden md:block"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: `translate(-50%, -50%) scale(${isHovering ? 2 : 1})`,
          borderColor: themeColor,
        }}
      />
      <div
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] hidden md:block"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          backgroundColor: themeColor,
        }}
      />
    </>
  );
}
