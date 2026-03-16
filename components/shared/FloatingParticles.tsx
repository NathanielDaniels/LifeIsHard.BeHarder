'use client';

import { useEffect, useState } from 'react';

interface FloatingParticlesProps {
  themeColor: string;
  count?: number;
}

export default function FloatingParticles({ themeColor, count = 30 }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; left: string; delay: string; duration: string; size: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full animate-float-particle"
          style={{
            backgroundColor: themeColor,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0.3,
            // @ts-expect-error custom css vars for animation
            '--delay': p.delay,
            '--duration': p.duration,
            '--particle-opacity': 0.3 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}
