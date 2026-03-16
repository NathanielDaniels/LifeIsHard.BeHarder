'use client';

import { motion } from 'framer-motion';
import { RACES_2026, Race, getNextRace, getDaysUntil } from '@/lib/race-data';

interface RaceCalendarProps {
  themeColor: string;
}

export default function RaceCalendar({ themeColor }: RaceCalendarProps) {
  const nextRace = getNextRace();
  const triathlonRaces = RACES_2026.filter(r => r.type === 'triathlon');
  const runningRaces = RACES_2026.filter(r => r.type === 'running');
  const nationals = RACES_2026.find(r => r.isTarget);
  const daysUntilNationals = nationals ? getDaysUntil(new Date(nationals.date)) : 0;

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h3 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[0.1em] text-white">
          2026 RACE CALENDAR
        </h3>
        <p className="font-mono text-sm tracking-[0.2em] text-white/40">
          THE ROAD TO NATIONALS
        </p>
      </div>

      {nationals && daysUntilNationals > 0 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto p-8 md:p-12 rounded-2xl border-2 text-center"
          style={{
            backgroundColor: `${themeColor}11`,
            borderColor: `${themeColor}66`,
            boxShadow: `0 0 60px ${themeColor}33`
          }}
        >
          <div className="font-mono text-xs tracking-[0.3em] text-white/50 mb-3">
            DAYS UNTIL NATIONALS
          </div>
          <div
            className="font-display text-7xl md:text-8xl lg:text-9xl tracking-wider mb-2"
            style={{ color: themeColor }}
          >
            {daysUntilNationals}
          </div>
          <div className="font-mono text-sm tracking-[0.2em] text-white/60">
            {nationals.name.toUpperCase()}
          </div>
        </motion.div>
      )}

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-[2px] flex-1" style={{ backgroundColor: `${themeColor}33` }} />
          <h4 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-white">
            TRIATHLON
          </h4>
          <div className="h-[2px] flex-1" style={{ backgroundColor: `${themeColor}33` }} />
        </div>

        <div className="grid gap-6">
          {triathlonRaces.map((race, idx) => (
            <RaceCard
              key={idx}
              race={race}
              isNext={nextRace?.date === race.date}
              themeColor={themeColor}
            />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-[2px] flex-1" style={{ backgroundColor: `${themeColor}33` }} />
          <h4 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-white">
            RUNNING
          </h4>
          <div className="h-[2px] flex-1" style={{ backgroundColor: `${themeColor}33` }} />
        </div>

        <div className="grid gap-6">
          {runningRaces.map((race, idx) => (
            <RaceCard
              key={idx}
              race={race}
              isNext={nextRace?.date === race.date}
              themeColor={themeColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface RaceCardProps {
  race: Race;
  isNext: boolean;
  themeColor: string;
}

function RaceCard({ race, isNext, themeColor }: RaceCardProps) {
  const raceDate = new Date(race.date);
  const isPast = raceDate < new Date();
  const daysUntil = getDaysUntil(raceDate);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(raceDate);

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
              <div className="font-display text-5xl md:text-6xl tracking-wider mb-1" style={{ color: themeColor }}>
                {daysUntil}
              </div>
              <div className="font-mono text-xs tracking-[0.2em] text-white/50">DAYS</div>
            </div>
          )}

          {isPast && race.result && (
            <div className="text-center md:text-right">
              <div className="font-display text-3xl md:text-4xl tracking-wider" style={{ color: themeColor }}>
                {race.result}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

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
            <div className="font-mono text-sm tracking-[0.15em] text-white/80">
              {formattedDate.toUpperCase()}
            </div>

            {isNext && !isPast && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-[0.15em]"
                style={{ backgroundColor: `${themeColor}22`, color: themeColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                NEXT // {daysUntil} DAYS
              </div>
            )}

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

        {isPast && race.result && (
          <div className="font-display text-2xl md:text-3xl tracking-wide" style={{ color: themeColor }}>
            {race.result}
          </div>
        )}

        {!isPast && !isNext && (
          <div className="text-right">
            <div className="font-display text-3xl md:text-4xl tracking-wide text-white/40">{daysUntil}</div>
            <div className="font-mono text-xs tracking-[0.2em] text-white/30">DAYS</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
