'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type EnergyState = 'HIGH' | 'MEDIUM' | 'LOW';

interface VitalityContextType {
  recovery: number;
  strain: number;
  energyState: EnergyState;
  setStats: (recovery: number, strain: number) => void;
  // Dynamic theme values derived from energy state
  theme: {
    primaryColor: string;
    glowIntensity: number;
    animationSpeed: number;
    blurAmount: string;
    saturation: number;
  };
}

const VitalityContext = createContext<VitalityContextType | undefined>(undefined);

export function useVitality() {
  const context = useContext(VitalityContext);
  if (!context) {
    throw new Error('useVitality must be used within a VitalityProvider');
  }
  return context;
}

export function VitalityProvider({ children }: { children: ReactNode }) {
  // Default to High Energy state
  const [stats, setStatsState] = useState({ recovery: 85, strain: 14.5 });

  const setStats = (recovery: number, strain: number) => {
    setStatsState({ recovery, strain });
  };

  // Determine energy state
  let energyState: EnergyState = 'HIGH';
  if (stats.recovery < 34) energyState = 'LOW';
  else if (stats.recovery < 67) energyState = 'MEDIUM';

  // Derive theme values based on energy state
  const getThemeValues = () => {
    switch (energyState) {
      case 'HIGH': // Peak performance - Electric, Red-Orange heat
        return {
          primaryColor: '#ff5722', // Deep Orange / Red-Orange
          glowIntensity: 1.2, // More intense glow
          animationSpeed: 1.1, // Slightly faster than normal
          blurAmount: '0px',
          saturation: 1.2, // Vibrant
        };
      case 'MEDIUM': // Adapting - Cautious Amber
        return {
          primaryColor: '#fbbf24', // Amber-400 (Golden)
          glowIntensity: 0.6,
          animationSpeed: 0.8,
          blurAmount: '0px',
          saturation: 1.0,
        };
      case 'LOW': // Recovery - Dark, Gritty Red
        return {
          primaryColor: '#991b1b', // Red-800 (Dark Red)
          glowIntensity: 0.3,
          animationSpeed: 0.4,
          blurAmount: '2px', // More blur for fatigue feel
          saturation: 0.6, // Desaturated
        };
    }
  };

  const theme = getThemeValues();

  return (
    <VitalityContext.Provider 
      value={{ 
        recovery: stats.recovery, 
        strain: stats.strain, 
        energyState, 
        setStats, 
        theme 
      }}
    >
      <div 
        style={{
          // Inject CSS variables for global use
          '--vitality-speed': `${theme.animationSpeed}s`,
          '--vitality-glow': `${theme.glowIntensity}`,
          '--theme-color': theme.primaryColor,
          transition: 'all 1.5s ease-in-out' // Smooth transitions between states
        } as React.CSSProperties}
      >
        {children}
      </div>
    </VitalityContext.Provider>
  );
}
