'use client';

// ============================================
// WHOOP Context & Provider
// Client-side state management for WHOOP data
// ============================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { WhoopStats, DEMO_WHOOP_STATS } from '@/types/whoop';

// ============================================
// Types
// ============================================

type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'syncing'
  | 'connected'
  | 'stale'      // Live data but serving from cache due to transient error
  | 'error'
  | 'unauthorized';

type DataMode = 'demo' | 'live' | 'stale' | 'unauthorized' | 'error';

interface WhoopContextValue {
  stats: WhoopStats;
  mode: DataMode;
  connectionStatus: ConnectionStatus;
  isLoading: boolean;
  isConnected: boolean;
  isStale: boolean;
  error: string | null;
  currentHeartRate: number;
  heartRateSource: 'resting' | 'workout' | 'decay';
  refresh: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// ============================================
// Backoff config
// ============================================

const BACKOFF_SCHEDULE_MS = [
  0,       // Immediate first try
  5_000,   // 5s
  15_000,  // 15s
  30_000,  // 30s
  60_000,  // 1min
  120_000, // 2min - cap
];

function getBackoffDelay(attempt: number): number {
  return BACKOFF_SCHEDULE_MS[Math.min(attempt, BACKOFF_SCHEDULE_MS.length - 1)];
}

// ============================================
// Context
// ============================================

const WhoopContext = createContext<WhoopContextValue | null>(null);

// ============================================
// Provider
// ============================================

interface WhoopProviderProps {
  children: React.ReactNode;
  pollInterval?: number; // ms between background polls (default: 5min)
  forceDemo?: boolean;
}

export function WhoopProvider({
  children,
  pollInterval = 5 * 60 * 1000,
  forceDemo = false,
}: WhoopProviderProps) {
  const [stats, setStats] = useState<WhoopStats>(DEMO_WHOOP_STATS);
  const [mode, setMode] = useState<DataMode>('demo');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Heart rate animation
  const [animatedHeartRate, setAnimatedHeartRate] = useState(
    DEMO_WHOOP_STATS.currentHeartRate
  );
  const heartRateAnimRef = useRef<number | null>(null);

  // Retry state
  const failureCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ============================================
  // Core fetch
  // ============================================

  const fetchStats = useCallback(
    async (showLoading = true) => {
      if (!isMountedRef.current) return;
      if (forceDemo) {
        setMode('demo');
        setConnectionStatus('connected');
        return;
      }

      if (showLoading) {
        setConnectionStatus('connecting');
        setError(null);
      }

      try {
        // Minimum cinematic boot time on first load
        const minLoad = showLoading ? 1500 : 0;
        const start = Date.now();

        const response = await fetch('/api/whoop/stats');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Hold on "syncing" for cinematic effect
        const elapsed = Date.now() - start;
        if (elapsed < minLoad) {
          setConnectionStatus('syncing');
          await new Promise(resolve => setTimeout(resolve, minLoad - elapsed));
        }

        if (!isMountedRef.current) return;

        setStats(data);
        setError(data.warning || data.error || null);

        // Map API mode → connection status
        const apiMode: DataMode = data.mode || 'demo';
        setMode(apiMode);

        switch (apiMode) {
          case 'live':
            setConnectionStatus('connected');
            failureCountRef.current = 0; // Reset backoff on success
            break;
          case 'stale':
            setConnectionStatus('stale');
            failureCountRef.current = 0;
            break;
          case 'unauthorized':
            setConnectionStatus('unauthorized');
            failureCountRef.current = 0; // Not a transient error - stop retrying
            break;
          case 'error':
          case 'demo':
          default:
            setConnectionStatus(apiMode === 'error' ? 'error' : 'idle');
            scheduleRetry();
        }
      } catch (err) {
        if (!isMountedRef.current) return;

        const message = err instanceof Error ? err.message : 'Connection failed';
        console.error('[WhoopContext] fetchStats error:', message);
        setError(message);
        setMode('error');
        setConnectionStatus('error');
        scheduleRetry();
      }
    },
    [forceDemo] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ============================================
  // Exponential backoff retry
  // ============================================

  const scheduleRetry = useCallback(() => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

    failureCountRef.current += 1;
    const delay = getBackoffDelay(failureCountRef.current);

    console.warn(
      `[WhoopContext] Scheduling retry #${failureCountRef.current} in ${delay}ms`
    );

    retryTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        fetchStats(false); // Silent retry - no loading spinner
      }
    }, delay);
  }, [fetchStats]);

  // ============================================
  // Disconnect
  // ============================================

  const disconnect = useCallback(async () => {
    try {
      await fetch('/api/whoop/disconnect', { method: 'POST' });
    } catch (err) {
      console.error('[WhoopContext] disconnect error:', err);
    }
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    failureCountRef.current = 0;
    setStats(DEMO_WHOOP_STATS);
    setMode('demo');
    setConnectionStatus('idle');
    setError(null);
  }, []);

  // ============================================
  // Lifecycle
  // ============================================

  // Initial fetch on mount
  useEffect(() => {
    fetchStats(true);
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [fetchStats]);

  // Background polling (silent, no loading state)
  useEffect(() => {
    if (pollInterval <= 0) return;

    const interval = setInterval(() => {
      // Don't poll if we're in unauthorized state - no point
      if (isMountedRef.current && connectionStatus !== 'unauthorized') {
        fetchStats(false);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval, fetchStats, connectionStatus]);

  // ============================================
  // Heart rate animation (smooth decay)
  // ============================================

  useEffect(() => {
    const targetHR = stats.currentHeartRate;
    const startHR = animatedHeartRate;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(startHR + (targetHR - startHR) * eased);
      setAnimatedHeartRate(current);

      if (progress < 1) {
        heartRateAnimRef.current = requestAnimationFrame(animate);
      }
    };

    heartRateAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (heartRateAnimRef.current) cancelAnimationFrame(heartRateAnimRef.current);
    };
  }, [stats.currentHeartRate]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================
  // Context value
  // ============================================

  const value: WhoopContextValue = {
    stats,
    mode,
    connectionStatus,
    isLoading:
      connectionStatus === 'connecting' || connectionStatus === 'syncing',
    isConnected:
      (connectionStatus === 'connected' || connectionStatus === 'stale') &&
      (mode === 'live' || mode === 'stale'),
    isStale: mode === 'stale',
    error,
    currentHeartRate: animatedHeartRate,
    heartRateSource: stats.heartRateSource,
    refresh: () => fetchStats(true),
    disconnect,
  };

  return (
    <WhoopContext.Provider value={value}>{children}</WhoopContext.Provider>
  );
}

// ============================================
// Hooks
// ============================================

export function useWhoop(): WhoopContextValue {
  const context = useContext(WhoopContext);
  if (!context) {
    throw new Error('useWhoop must be used within a WhoopProvider');
  }
  return context;
}

export function useHeartbeatDuration(): number {
  const { currentHeartRate } = useWhoop();
  return 60 / currentHeartRate;
}


// 'use client';

// // ============================================
// // WHOOP Context & Provider
// // Client-side state management for WHOOP data
// // ============================================

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from 'react';
// import { WhoopStats, DEMO_WHOOP_STATS } from '@/types/whoop';

// // ============================================
// // Types
// // ============================================

// type ConnectionStatus = 
//   | 'idle'
//   | 'connecting'
//   | 'syncing'
//   | 'connected'
//   | 'error'
//   | 'unauthorized';

// type DataMode = 'demo' | 'live' | 'unauthorized' | 'error';

// interface WhoopContextValue {
//   // Data
//   stats: WhoopStats;
//   mode: DataMode;
  
//   // Connection state (for loading animations)
//   connectionStatus: ConnectionStatus;
//   isLoading: boolean;
//   isConnected: boolean;
//   error: string | null;
  
//   // Heart rate (with decay animation)
//   currentHeartRate: number;
//   heartRateSource: 'resting' | 'workout' | 'decay';
  
//   // Actions
//   refresh: () => Promise<void>;
//   disconnect: () => Promise<void>;
// }

// // ============================================
// // Context
// // ============================================

// const WhoopContext = createContext<WhoopContextValue | null>(null);

// // ============================================
// // Provider
// // ============================================

// interface WhoopProviderProps {
//   children: React.ReactNode;
//   /** Polling interval in ms (default: 5 minutes, 0 to disable) */
//   pollInterval?: number;
//   /** Enable demo mode even if API is configured */
//   forceDemo?: boolean;
// }

// export function WhoopProvider({
//   children,
//   pollInterval = 5 * 60 * 1000,
//   forceDemo = false,
// }: WhoopProviderProps) {
//   const [stats, setStats] = useState<WhoopStats>(DEMO_WHOOP_STATS);
//   const [mode, setMode] = useState<DataMode>('demo');
//   const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
//   const [error, setError] = useState<string | null>(null);
  
//   // Heart rate animation state
//   const [animatedHeartRate, setAnimatedHeartRate] = useState(DEMO_WHOOP_STATS.currentHeartRate);
//   const heartRateAnimationRef = useRef<number | null>(null);
  
//   // Fetch stats from API
//   const fetchStats = useCallback(async (showLoading = true) => {
//     if (forceDemo) {
//       setMode('demo');
//       setConnectionStatus('connected');
//       return;
//     }
    
//     if (showLoading) {
//       setConnectionStatus('connecting');
//     }
    
//     try {
//       // Simulate minimum loading time for cinematic effect
//       const minLoadTime = showLoading ? 1500 : 0;
//       const startTime = Date.now();
      
//       const response = await fetch('/api/whoop/stats');
//       const data = await response.json();
      
//       // Wait for minimum time if needed
//       const elapsed = Date.now() - startTime;
//       if (elapsed < minLoadTime) {
//         setConnectionStatus('syncing');
//         await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
//       }
      
//       setStats(data);
//       setMode(data.mode || 'demo');
//       setConnectionStatus(data.mode === 'live' ? 'connected' : 
//                           data.mode === 'unauthorized' ? 'unauthorized' : 'connected');
//       setError(data.error || null);
      
//     } catch (err) {
//       console.error('Failed to fetch WHOOP stats:', err);
//       setError(err instanceof Error ? err.message : 'Failed to connect');
//       setConnectionStatus('error');
//       setMode('error');
//     }
//   }, [forceDemo]);
  
//   // Disconnect from WHOOP
//   const disconnect = useCallback(async () => {
//     try {
//       await fetch('/api/whoop/disconnect', { method: 'POST' });
//       setStats(DEMO_WHOOP_STATS);
//       setMode('demo');
//       setConnectionStatus('idle');
//     } catch (err) {
//       console.error('Failed to disconnect:', err);
//     }
//   }, []);
  
//   // Initial fetch
//   useEffect(() => {
//     fetchStats(true);
//   }, [fetchStats]);
  
//   // Polling
//   useEffect(() => {
//     if (pollInterval <= 0) return;
    
//     const interval = setInterval(() => {
//       fetchStats(false); // Don't show loading on poll
//     }, pollInterval);
    
//     return () => clearInterval(interval);
//   }, [pollInterval, fetchStats]);
  
//   // Heart rate decay animation
//   useEffect(() => {
//     const targetHR = stats.currentHeartRate;
//     const duration = 2000; // 2 second transition
//     const startHR = animatedHeartRate;
//     const startTime = Date.now();
    
//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
//       const current = Math.round(startHR + (targetHR - startHR) * eased);
//       setAnimatedHeartRate(current);
      
//       if (progress < 1) {
//         heartRateAnimationRef.current = requestAnimationFrame(animate);
//       }
//     };
    
//     heartRateAnimationRef.current = requestAnimationFrame(animate);
    
//     return () => {
//       if (heartRateAnimationRef.current) {
//         cancelAnimationFrame(heartRateAnimationRef.current);
//       }
//     };
//   }, [stats.currentHeartRate]); // eslint-disable-line react-hooks/exhaustive-deps
  
//   const value: WhoopContextValue = {
//     stats,
//     mode,
//     connectionStatus,
//     isLoading: connectionStatus === 'connecting' || connectionStatus === 'syncing',
//     isConnected: connectionStatus === 'connected' && mode === 'live',
//     error,
//     currentHeartRate: animatedHeartRate,
//     heartRateSource: stats.heartRateSource,
//     refresh: () => fetchStats(true),
//     disconnect,
//   };
  
//   return (
//     <WhoopContext.Provider value={value}>
//       {children}
//     </WhoopContext.Provider>
//   );
// }

// // ============================================
// // Hook
// // ============================================

// export function useWhoop(): WhoopContextValue {
//   const context = useContext(WhoopContext);
  
//   if (!context) {
//     throw new Error('useWhoop must be used within a WhoopProvider');
//   }
  
//   return context;
// }

// // ============================================
// // Utility Hook: Heart Rate BPM to Duration
// // ============================================

// export function useHeartbeatDuration(): number {
//   const { currentHeartRate } = useWhoop();
//   // Convert BPM to seconds per beat
//   return 60 / currentHeartRate;
// }
