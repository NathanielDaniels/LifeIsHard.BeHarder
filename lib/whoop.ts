// WHOOP API Integration Helper
// This file provides utility functions for connecting to WHOOP's Developer API
// Documentation: https://developer.whoop.com/

interface WhoopCycle {
  strain: number;
  recovery_score: number;
  sleep_performance_percentage: number;
  hrv_rmssd_milli: number;
}

interface WhoopResponse {
  data: WhoopCycle[];
}

/**
 * Fetch the latest cycle data from WHOOP API
 * Requires WHOOP_ACCESS_TOKEN in environment variables
 */
export async function getLatestWhoopData(): Promise<WhoopCycle | null> {
  try {
    const response = await fetch('https://api.whoop.com/developer/v1/cycle', {
      headers: {
        'Authorization': `Bearer ${process.env.WHOOP_ACCESS_TOKEN}`,
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`WHOOP API error: ${response.status}`);
    }

    const data: WhoopResponse = await response.json();
    
    // Return the most recent cycle
    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching WHOOP data:', error);
    return null;
  }
}

/**
 * Transform WHOOP data into displayable format
 */
export function formatWhoopData(cycle: WhoopCycle | null) {
  if (!cycle) {
    // Return mock data if no connection
    return {
      strain: 16.8,
      recovery: 87,
      sleep: 8.2,
      hrv: 72
    };
  }

  return {
    strain: cycle.strain,
    recovery: cycle.recovery_score,
    sleep: cycle.sleep_performance_percentage / 100 * 12, // Convert percentage to hours estimate
    hrv: cycle.hrv_rmssd_milli
  };
}

/**
 * Get page energy level based on recovery score
 * This affects animation speeds, color intensity, etc.
 */
export function getEnergyLevel(recovery: number): {
  animationSpeed: number;
  glowIntensity: number;
  colorSaturation: number;
} {
  if (recovery >= 67) {
    return {
      animationSpeed: 1.2,
      glowIntensity: 1.0,
      colorSaturation: 1.0
    };
  } else if (recovery >= 34) {
    return {
      animationSpeed: 1.0,
      glowIntensity: 0.7,
      colorSaturation: 0.85
    };
  } else {
    return {
      animationSpeed: 0.8,
      glowIntensity: 0.5,
      colorSaturation: 0.7
    };
  }
}

// Example API route implementation:
// Create /app/api/whoop/route.ts with this content:
/*
import { getLatestWhoopData, formatWhoopData } from '@/lib/whoop';

export async function GET() {
  const cycleData = await getLatestWhoopData();
  const formattedData = formatWhoopData(cycleData);
  
  return Response.json(formattedData);
}
*/
