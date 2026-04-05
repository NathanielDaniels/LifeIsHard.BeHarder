'use client';

import { ReactNode, useEffect, useState } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);
    (window as unknown as { lenis?: Lenis }).lenis = lenisInstance;

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenisInstance.destroy();
    };
  }, []);

  return <>{children}</>;
}
