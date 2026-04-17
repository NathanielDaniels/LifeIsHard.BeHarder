'use client';

import { motion } from 'framer-motion';
import { useWhoop, useHeartbeatDuration } from '@/contexts/WhoopContext';
import { useVitality } from '@/contexts/VitalityContext';
import BiometricCard from '@/components/shared/BiometricCard';

const RECOVERY_THRESHOLDS = {
  GREEN: 67,
  YELLOW: 34,
};

const getRecoveryColor = (recovery: number | null): string => {
  if (recovery === null) return '#f97316';
  if (recovery >= RECOVERY_THRESHOLDS.GREEN) return '#00e676';
  if (recovery >= RECOVERY_THRESHOLDS.YELLOW) return '#ffab00';
  return '#ff5252';
};

export default function TheMachine() {
  const { stats, isConnected, mode, currentHeartRate, heartRateSource } = useWhoop();
  const { theme } = useVitality();
  const heartbeatDuration = useHeartbeatDuration();

  const themeColor = theme.primaryColor;
  const recoveryColor = getRecoveryColor(stats.recovery);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex items-center gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: isConnected ? '#00ff00' : themeColor,
              boxShadow: `0 0 10px ${isConnected ? '#00ff00' : themeColor}`
            }}
          />
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono text-xs tracking-[0.5em] text-white/70 uppercase"
          >
            {isConnected ? "Today's Readout" : 'Biometric Data'} // {dateString}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 h-px bg-white/10 origin-left"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center mb-16 py-12"
        >
          <span className="font-mono text-xs tracking-[0.5em] text-white/60 uppercase mb-4">
            Today&apos;s Recovery
          </span>
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.3, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute w-[28rem] h-[28rem] md:w-[36rem] md:h-[36rem] rounded-full"
              style={{ background: `radial-gradient(circle, ${recoveryColor}40 0%, transparent 70%)` }}
            />

            <div className="relative">
              {stats.recovery !== null ? (
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="font-display text-[8rem] md:text-[12rem] font-bold leading-none"
                  style={{ color: recoveryColor, textShadow: `0 0 40px ${recoveryColor}40` }}
                >
                  {Math.round(stats.recovery)}
                  <span className="text-6xl md:text-8xl align-super">%</span>
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-display text-[8rem] md:text-[12rem] font-bold leading-none"
                  style={{ color: themeColor }}
                >
                  --
                </motion.span>
              )}
            </div>
          </div>

          {stats.recovery !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-mono text-sm tracking-wider uppercase mt-6"
              style={{ color: recoveryColor }}
            >
              {stats.recovery >= RECOVERY_THRESHOLDS.GREEN && 'Well Recovered'}
              {stats.recovery >= RECOVERY_THRESHOLDS.YELLOW && stats.recovery < RECOVERY_THRESHOLDS.GREEN && 'Maintaining'}
              {stats.recovery < RECOVERY_THRESHOLDS.YELLOW && 'Rest Needed'}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: 'DAILY STRAIN',
              value: stats.strain !== null ? stats.strain.toFixed(1) : null,
              unit: '/21',
              color: themeColor,
              delay: 0,
              tooltip: 'Cardiovascular load on a 0-21 scale. 14+ is High Strain, which builds fitness gains.',
            },
            {
              label: 'HEART RATE',
              value: currentHeartRate != null ? Math.round(currentHeartRate) : null,
              unit: 'BPM',
              color: themeColor,
              delay: 0.05,
              tooltip: heartRateSource === 'workout'
                ? 'Current heart rate from the latest workout.'
                : heartRateSource === 'decay'
                  ? 'Heart rate recovering after a recent workout.'
                  : 'Resting heart rate. No recent workout activity.',
            },
            {
              label: 'RESTING HR',
              value: stats.restingHeartRate,
              unit: 'BPM',
              color: themeColor,
              delay: 0.1,
              tooltip: 'Resting heart rate measured during sleep. Lower values typically indicate better cardiovascular fitness.',
            },
            {
              label: 'HRV',
              value: stats.hrv !== null ? Math.round(stats.hrv) : null,
              unit: 'ms',
              color: themeColor,
              delay: 0.15,
              tooltip: 'Heart rate variability in milliseconds. A key recovery indicator - higher generally means better recovery.',
            },
            {
              label: 'CALORIES',
              value: stats.calories !== null ? stats.calories.toLocaleString() : null,
              unit: 'kcal',
              color: themeColor,
              delay: 0.2,
              tooltip: 'Total calories burned today based on continuous monitoring.',
              condition: stats.calories !== null,
            },
            {
              label: 'AVG HEART RATE',
              value: stats.averageHeartRate,
              unit: 'BPM',
              color: themeColor,
              delay: 0.25,
              tooltip: 'Average heart rate across all activity today.',
              condition: stats.averageHeartRate !== null,
            },
          ]
            .filter(card => card.condition !== false)
            .map((card, i) => (
              <BiometricCard
                key={card.label}
                label={card.label}
                value={card.value}
                unit={card.unit}
                color={card.color}
                delay={card.delay}
                tooltip={card.tooltip}
                index={i}
              />
            ))}
        </div>

        {stats.lastWorkout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 bg-white/[0.03] border border-white/10 rounded-lg p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: themeColor }} />
              <div>
                <span className="font-mono text-[0.75rem] tracking-[0.3em] text-white/80 block">
                  LAST WORKOUT
                </span>
                <span className="font-display text-2xl font-bold uppercase" style={{ color: themeColor }}>
                  {stats.lastWorkout.sport}
                </span>
              </div>
              <span className="ml-auto font-mono text-[0.75rem] text-white/60">
                {new Date(stats.lastWorkout.completedAt).toLocaleDateString('en-US', {
                  timeZone: 'America/Chicago',
                  month: 'short',
                  day: 'numeric'
                })}{' '}
                • {stats.lastWorkout.duration} min
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/70 block">STRAIN</span>
                <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>
                  {stats.lastWorkout.strain.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/70 block">AVG HR</span>
                <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>
                  {stats.lastWorkout.averageHeartRate}{' '}
                  <span className="text-base font-mono text-white/60">BPM</span>
                </span>
              </div>
              <div>
                <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/70 block">MAX HR</span>
                <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>
                  {stats.lastWorkout.maxHeartRate}{' '}
                  <span className="text-base font-mono text-white/60">BPM</span>
                </span>
              </div>
              <div>
                <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/70 block">CALORIES</span>
                <span className="font-display text-3xl font-bold" style={{ color: themeColor }}>
                  {stats.lastWorkout.calories}{' '}
                  <span className="text-base font-mono text-white/60">kcal</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-8 font-mono text-[0.65rem] md:text-[0.75rem] tracking-[0.2em] text-white/70">
          <span className="whitespace-nowrap">POWERED BY WHOOP</span>
          <span className="hidden sm:inline opacity-50">•</span>
          <span className="whitespace-nowrap">{isConnected ? 'LIVE DATA' : 'DEMO DATA'}</span>
          {stats.lastUpdated && (
            <>
              <span className="hidden sm:inline opacity-50">•</span>
              <span className="whitespace-nowrap">
                UPDATED{' '}
                {new Date(stats.lastUpdated).toLocaleTimeString('en-US', {
                  timeZone: 'America/Chicago',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
