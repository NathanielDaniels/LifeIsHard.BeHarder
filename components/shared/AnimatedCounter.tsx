'use client';

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration, hasAnimated]);

  return <>{displayValue.toLocaleString()}</>;
}
