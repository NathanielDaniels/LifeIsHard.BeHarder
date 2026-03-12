'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useVitality } from '@/contexts/VitalityContext';
import { RACES_2026, Race, getNextRace, getDaysUntil } from '@/lib/race-data';

export default function TheMission() {
  const { theme } = useVitality();
  const nextRace = getNextRace();
  const today = new Date();

  // Split races into triathlon and running
  const triathlonRaces = RACES_2026.filter(r => r.type === 'triathlon');
  const runningRaces = RACES_2026.filter(r => r.type === 'running');

  // Find nationals for countdown
  const nationals = RACES_2026.find(r => r.isTarget);
  const daysUntilNationals = nationals ? getDaysUntil(new Date(nationals.date)) : 0;

  return (
    <section className="relative min-h-screen py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black" />

      {/* Radial glow effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.primaryColor}33` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Part 1: Dare2Tri Context (Split Layout) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Team photo placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/10"
            >
              {/* Placeholder gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}22 0%, transparent 50%, ${theme.primaryColor}11 100%)`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 px-6">
                  <div className="font-display text-6xl tracking-[0.2em] text-white/10">DARE2TRI</div>
                  <div className="font-display text-2xl tracking-[0.15em] text-white/10">ELITE DEVELOPMENT TEAM</div>
                </div>
              </div>

              {/* Elite badge overlay */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                viewport={{ once: true }}
                className="absolute top-8 right-8 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white/20"
                style={{
                  backgroundColor: theme.primaryColor,
                  boxShadow: `0 0 40px ${theme.primaryColor}99`
                }}
              >
                <span className="text-white font-display text-sm text-center leading-tight tracking-wider">
                  ELITE
                  <br />
                  TEAM
                </span>
              </motion.div>
            </motion.div>

            {/* Narrative */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-[0.05em] text-white mb-6 leading-none">
                  NOT JUST<br />COMPETING.
                  <br />
                  <span style={{ color: theme.primaryColor }}>REPRESENTING.</span>
                </h2>
              </div>

              <div className="space-y-6 text-lg md:text-xl text-white/70 leading-relaxed">
                <p>
                  Acceptance to the <strong className="text-white">Dare2Tri Elite Development Team</strong> isn't given. It's earned through relentless training, podium finishes, and a refusal to accept limitations.
                </p>
                <p>
                  Patrick was selected in 2026 — joining an extraordinary group of para-triathletes who prove that physical differences are starting points, not endpoints.
                </p>
                <p>
                  Every race. Every mile. Every heartbeat is in service of the mission: <strong className="text-white">show the world what's possible.</strong>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Part 2: 2026 Race Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Section header */}
          <div className="text-center space-y-4">
            <h3 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[0.1em] text-white">
              2026 RACE CALENDAR
            </h3>
            <p className="font-mono text-sm tracking-[0.2em] text-white/40">
              THE ROAD TO NATIONALS
            </p>
          </div>

          {/* Days until Nationals countdown card */}
          {nationals && daysUntilNationals > 0 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto p-8 md:p-12 rounded-2xl border-2 text-center"
              style={{
                backgroundColor: `${theme.primaryColor}11`,
                borderColor: `${theme.primaryColor}66`,
                boxShadow: `0 0 60px ${theme.primaryColor}33`
              }}
            >
              <div className="font-mono text-xs tracking-[0.3em] text-white/50 mb-3">
                DAYS UNTIL NATIONALS
              </div>
              <div
                className="font-display text-7xl md:text-8xl lg:text-9xl tracking-wider mb-2"
                style={{ color: theme.primaryColor }}
              >
                {daysUntilNationals}
              </div>
              <div className="font-mono text-sm tracking-[0.2em] text-white/60">
                {nationals.name.toUpperCase()}
              </div>
            </motion.div>
          )}

          {/* TRIATHLON Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div
                className="h-[2px] flex-1"
                style={{ backgroundColor: `${theme.primaryColor}33` }}
              />
              <h4 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-white">
                TRIATHLON
              </h4>
              <div
                className="h-[2px] flex-1"
                style={{ backgroundColor: `${theme.primaryColor}33` }}
              />
            </div>

            <div className="grid gap-6">
              {triathlonRaces.map((race, idx) => (
                <RaceCard
                  key={idx}
                  race={race}
                  isNext={nextRace?.date === race.date}
                  themeColor={theme.primaryColor}
                />
              ))}
            </div>
          </div>

          {/* RUNNING Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div
                className="h-[2px] flex-1"
                style={{ backgroundColor: `${theme.primaryColor}33` }}
              />
              <h4 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-white">
                RUNNING
              </h4>
              <div
                className="h-[2px] flex-1"
                style={{ backgroundColor: `${theme.primaryColor}33` }}
              />
            </div>

            <div className="grid gap-6">
              {runningRaces.map((race, idx) => (
                <RaceCard
                  key={idx}
                  race={race}
                  isNext={nextRace?.date === race.date}
                  themeColor={theme.primaryColor}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface RaceCardProps {
  race: Race;
  isNext: boolean;
  themeColor: string;
}

function RaceCard({ race, isNext, themeColor }: RaceCardProps) {
  const today = new Date();
  const raceDate = new Date(race.date);
  const isPast = raceDate < today;
  const daysUntil = getDaysUntil(raceDate);

  // Format date
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  });
  const formattedDate = dateFormatter.format(raceDate);

  // Nationals gets special 2-column hero treatment
  if (race.isTarget) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="p-8 md:p-10 rounded-2xl border-2 backdrop-blur-sm"
        style={{
          backgroundColor: `${themeColor}18`,
          borderColor: themeColor,
          boxShadow: `0 0 40px ${themeColor}44`
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4 flex-1">
            {/* THE TARGET badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono tracking-[0.2em]"
              style={{
                backgroundColor: `${themeColor}22`,
                borderColor: `${themeColor}88`,
                color: themeColor
              }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
              THE TARGET
            </div>

            <div>
              <h5 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wide text-white mb-2 leading-tight">
                {race.name}
              </h5>
              <p className="font-mono text-sm tracking-[0.15em] text-white/60">
                {formattedDate.toUpperCase()} · {race.location.toUpperCase()}
              </p>
            </div>
          </div>

          {!isPast && (
            <div className="text-center md:text-right">
              <div
                className="font-display text-5xl md:text-6xl tracking-wider mb-1"
                style={{ color: themeColor }}
              >
                {daysUntil}
              </div>
              <div className="font-mono text-xs tracking-[0.2em] text-white/50">
                DAYS
              </div>
            </div>
          )}

          {isPast && race.result && (
            <div className="text-center md:text-right">
              <div
                className="font-display text-3xl md:text-4xl tracking-wider"
                style={{ color: themeColor }}
              >
                {race.result}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Standard race card
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="p-6 md:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
      style={{
        backgroundColor: isNext ? `${themeColor}11` : 'rgba(255,255,255,0.03)',
        borderColor: isNext ? `${themeColor}66` : 'rgba(255,255,255,0.1)',
        boxShadow: isNext ? `0 0 30px ${themeColor}33` : 'none'
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Date */}
            <div className="font-mono text-sm tracking-[0.15em] text-white/80">
              {formattedDate.toUpperCase()}
            </div>

            {/* Next race badge */}
            {isNext && !isPast && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-[0.15em]"
                style={{
                  backgroundColor: `${themeColor}22`,
                  color: themeColor
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                NEXT — {daysUntil} DAYS
              </div>
            )}

            {/* Past race status */}
            {isPast && !race.result && (
              <div className="px-3 py-1 rounded-full text-xs font-mono tracking-[0.15em] bg-white/5 text-white/30">
                COMPLETED
              </div>
            )}
          </div>

          <div>
            <h5 className="font-display text-xl md:text-2xl tracking-wide text-white mb-1">
              {race.name}
            </h5>
            <p className="font-mono text-xs tracking-[0.15em] text-white/50">
              {race.location.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Result for past races */}
        {isPast && race.result && (
          <div
            className="font-display text-2xl md:text-3xl tracking-wide"
            style={{ color: themeColor }}
          >
            {race.result}
          </div>
        )}

        {/* Days until for future races (non-next) */}
        {!isPast && !isNext && (
          <div className="text-right">
            <div className="font-display text-3xl md:text-4xl tracking-wide text-white/40">
              {daysUntil}
            </div>
            <div className="font-mono text-xs tracking-[0.2em] text-white/30">
              DAYS
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
