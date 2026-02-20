'use client';

// ============================================
// WHOOP Stats Display Component
// Reusable component for showing WHOOP metrics
// ============================================

import { motion } from 'framer-motion';
import { useWhoop, useHeartbeatDuration } from '@/contexts/WhoopContext';

// ============================================
// Types
// ============================================

interface WhoopStatsProps {
  /** Display variant */
  variant?: 'minimal' | 'compact' | 'full';
  /** Theme color (defaults to orange) */
  themeColor?: string;
  /** Show connection status indicator */
  showStatus?: boolean;
  /** Custom class name */
  className?: string;
}

// ============================================
// Main Component
// ============================================

export function WhoopStatsDisplay({
  variant = 'compact',
  themeColor = '#FF6B00',
  showStatus = true,
  className = '',
}: WhoopStatsProps) {
  const { stats, mode, isConnected } = useWhoop();
  
  if (variant === 'minimal') {
    return <MinimalStats themeColor={themeColor} className={className} />;
  }
  
  if (variant === 'compact') {
    return (
      <CompactStats 
        themeColor={themeColor} 
        showStatus={showStatus}
        className={className}
      />
    );
  }
  
  return (
    <FullStats 
      themeColor={themeColor}
      showStatus={showStatus}
      className={className}
    />
  );
}

// ============================================
// Minimal Variant (Just HR + Recovery)
// ============================================

function MinimalStats({ 
  themeColor, 
  className 
}: { 
  themeColor: string; 
  className: string;
}) {
  const { stats, currentHeartRate } = useWhoop();
  const heartbeatDuration = useHeartbeatDuration();
  
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {/* Heart Rate */}
      <div className="flex items-center gap-3">
        <HeartIcon 
          themeColor={themeColor} 
          duration={heartbeatDuration}
          size={24}
        />
        <div>
          <span className="font-display text-2xl font-bold" style={{ color: themeColor }}>
            {currentHeartRate}
          </span>
          <span className="text-sm text-white/40 ml-1">BPM</span>
        </div>
      </div>
      
      {/* Recovery */}
      {stats.recovery !== null && (
        <div>
          <span className="font-display text-2xl font-bold" style={{ color: themeColor }}>
            {stats.recovery}%
          </span>
          <span className="text-sm text-white/40 ml-1">Recovery</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Compact Variant (Stats Bar)
// ============================================

function CompactStats({ 
  themeColor, 
  showStatus,
  className,
}: { 
  themeColor: string;
  showStatus: boolean;
  className: string;
}) {
  const { stats, currentHeartRate, isConnected, mode } = useWhoop();
  const heartbeatDuration = useHeartbeatDuration();
  
  return (
    <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${className}`}>
      {/* Heart Rate Section */}
      <div className="flex items-center gap-4">
        <HeartIcon 
          themeColor={themeColor} 
          duration={heartbeatDuration}
          size={40}
        />
        <div className="flex flex-col">
          <span className="text-[0.55rem] font-mono tracking-[0.3em] text-white/40">
            {stats.heartRateSource === 'workout' ? 'POST-WORKOUT HR' : 
             stats.heartRateSource === 'decay' ? 'RECOVERING' : 'RESTING HR'}
          </span>
          <span className="font-display text-2xl font-bold" style={{ color: themeColor }}>
            {currentHeartRate} <span className="text-sm font-mono text-white/40">BPM</span>
          </span>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="flex items-center gap-6">
        {stats.recovery !== null && (
          <StatPill 
            label="RECOVERY" 
            value={`${stats.recovery}%`} 
            themeColor={themeColor}
          />
        )}
        {stats.strain !== null && (
          <StatPill 
            label="STRAIN" 
            value={stats.strain.toFixed(1)} 
            themeColor={themeColor}
          />
        )}
        {stats.hrv !== null && (
          <StatPill 
            label="HRV" 
            value={`${Math.round(stats.hrv)}ms`} 
            themeColor={themeColor}
          />
        )}
      </div>
      
      {/* Connection Status */}
      {showStatus && (
        <div className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.2em] text-white/40">
          <span 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: isConnected ? '#00ff00' : mode === 'demo' ? '#ffaa00' : '#ff0000',
              boxShadow: `0 0 10px ${isConnected ? '#00ff00' : mode === 'demo' ? '#ffaa00' : '#ff0000'}`,
              animation: 'pulse 2s infinite',
            }}
          />
          <span>
            {isConnected ? 'WHOOP CONNECTED' : 
             mode === 'demo' ? 'DEMO MODE' : 'OFFLINE'}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Full Variant (Dashboard Card)
// ============================================

function FullStats({ 
  themeColor,
  showStatus,
  className,
}: { 
  themeColor: string;
  showStatus: boolean;
  className: string;
}) {
  const { stats, currentHeartRate, isConnected, mode } = useWhoop();
  const heartbeatDuration = useHeartbeatDuration();
  
  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <HeartIcon 
            themeColor={themeColor} 
            duration={heartbeatDuration}
            size={32}
          />
          <div>
            <h3 className="font-display text-lg font-bold">Live Biometrics</h3>
            <p className="text-xs text-white/40 font-mono tracking-wider">
              POWERED BY WHOOP
            </p>
          </div>
        </div>
        
        {showStatus && (
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: isConnected ? '#00ff00' : '#ffaa00',
                boxShadow: `0 0 8px ${isConnected ? '#00ff00' : '#ffaa00'}`,
              }}
            />
            <span className="text-xs font-mono text-white/50">
              {isConnected ? 'LIVE' : 'DEMO'}
            </span>
          </div>
        )}
      </div>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="Heart Rate"
          value={currentHeartRate}
          unit="BPM"
          sublabel={stats.heartRateSource === 'resting' ? 'Resting' : 'Active'}
          themeColor={themeColor}
          highlight
        />
        <StatCard 
          label="Recovery"
          value={stats.recovery}
          unit="%"
          themeColor={themeColor}
          colorScale
        />
        <StatCard 
          label="Strain"
          value={stats.strain?.toFixed(1) ?? null}
          unit="/21"
          themeColor={themeColor}
        />
        <StatCard 
          label="HRV"
          value={stats.hrv ? Math.round(stats.hrv) : null}
          unit="ms"
          themeColor={themeColor}
        />
      </div>
      
      {/* Sleep Stats */}
      {/* <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-white/10">
        <MiniStat label="Sleep" value={stats.sleepPerformance} unit="%" />
        <MiniStat 
          label="Duration" 
          value={stats.sleepDuration ? formatDuration(stats.sleepDuration) : null} 
        />
        <MiniStat label="Consistency" value={stats.sleepConsistency} unit="%" />
      </div> */}
      
      {/* Last Workout */}
      {stats.lastWorkout && (
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs font-mono text-white/40 tracking-wider mb-2">
            LAST WORKOUT
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-display font-bold" style={{ color: themeColor }}>
                {stats.lastWorkout.sport}
              </p>
              <p className="text-sm text-white/60">
                {formatDuration(stats.lastWorkout.duration)} · Strain {stats.lastWorkout.strain.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/40">
                Avg HR: {stats.lastWorkout.averageHeartRate ?? '--'}
              </p>
              <p className="text-sm text-white/40">
                Max HR: {stats.lastWorkout.maxHeartRate ?? '--'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

function HeartIcon({ 
  themeColor, 
  duration, 
  size = 24 
}: { 
  themeColor: string; 
  duration: number;
  size?: number;
}) {
  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      style={{ 
        fill: themeColor,
        width: size,
        height: size,
      }}
      animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeOut" 
      }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </motion.svg>
  );
}

function StatPill({ 
  label, 
  value, 
  themeColor 
}: { 
  label: string; 
  value: string;
  themeColor: string;
}) {
  return (
    <div className="hidden md:flex flex-col items-center">
      <span className="text-[0.5rem] font-mono tracking-[0.2em] text-white/40 mb-1">
        {label}
      </span>
      <span className="font-display font-bold" style={{ color: themeColor }}>
        {value}
      </span>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  unit = '',
  sublabel,
  themeColor,
  highlight = false,
  colorScale = false,
}: { 
  label: string;
  value: number | string | null;
  unit?: string;
  sublabel?: string;
  themeColor: string;
  highlight?: boolean;
  colorScale?: boolean;
}) {
  // Color scale for recovery (green = good, red = bad)
  let displayColor = themeColor;
  if (colorScale && typeof value === 'number') {
    if (value >= 67) displayColor = '#00D26A';      // Green
    else if (value >= 34) displayColor = '#FFBB00'; // Yellow
    else displayColor = '#FF4444';                   // Red
  }
  
  return (
    <div className={`p-3 rounded-xl ${highlight ? 'bg-white/5' : ''}`}>
      <p className="text-[0.6rem] font-mono tracking-wider text-white/40 mb-1">
        {label}
      </p>
      <p className="font-display text-2xl font-bold" style={{ color: displayColor }}>
        {value ?? '--'}
        {unit && <span className="text-sm text-white/40 ml-1">{unit}</span>}
      </p>
      {sublabel && (
        <p className="text-[0.55rem] font-mono text-white/30 mt-1">{sublabel}</p>
      )}
    </div>
  );
}

function MiniStat({ 
  label, 
  value, 
  unit = '' 
}: { 
  label: string;
  value: number | string | null;
  unit?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-[0.55rem] font-mono tracking-wider text-white/40">
        {label}
      </p>
      <p className="font-display font-bold text-white/80">
        {value ?? '--'}{unit}
      </p>
    </div>
  );
}

// ============================================
// Utility Functions
// ============================================

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// ============================================
// Export Individual Components
// ============================================

export { HeartIcon, StatCard, StatPill };
