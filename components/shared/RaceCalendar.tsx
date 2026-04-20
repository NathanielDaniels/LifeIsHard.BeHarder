"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  RACES_2026,
  Race,
  getNextRace,
  getDaysUntil,
  parseLocalDate,
} from "@/lib/race-data";
import MiniRouteMap from "@/components/shared/MiniRouteMap";

interface RaceCalendarProps {
  themeColor: string;
}

export default function RaceCalendar({ themeColor }: RaceCalendarProps) {
  const nextRace = getNextRace();
  const triathlonRaces = RACES_2026.filter((r) => r.type === "triathlon");
  const runningRaces = RACES_2026.filter((r) => r.type === "running");
  const nationals = RACES_2026.find((r) => r.isTarget);
  const daysUntilNationals = nationals
    ? getDaysUntil(parseLocalDate(nationals.date))
    : 0;
  const daysUntilNext = nextRace
    ? getDaysUntil(parseLocalDate(nextRace.date))
    : 0;
  const [showNationals, setShowNationals] = useState(true);

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h3 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-[0.1em] text-white">
          2026 RACE CALENDAR
        </h3>
        <p className="font-mono text-sm tracking-[0.2em] text-white/60">
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
            boxShadow: `0 0 60px ${themeColor}33`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={showNationals ? "nationals" : "next-race"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="font-mono text-xs tracking-[0.3em] text-white/70 mb-3">
                {!showNationals && daysUntilNext === 0
                  ? "RIGHT NOW"
                  : showNationals
                    ? "DAYS UNTIL NATIONALS"
                    : "DAYS UNTIL NEXT RACE"}
              </div>
              <div
                className={`font-display tracking-wider mb-2 ${!showNationals && daysUntilNext === 0 ? "text-5xl md:text-6xl lg:text-7xl" : "text-7xl md:text-8xl lg:text-9xl"}`}
                style={{ color: themeColor }}
              >
                {!showNationals && daysUntilNext === 0
                  ? "RACE DAY!"
                  : showNationals
                    ? daysUntilNationals
                    : daysUntilNext}
              </div>
              <div className="font-mono text-sm tracking-[0.2em] text-white/60">
                {showNationals
                  ? nationals.name.toUpperCase()
                  : nextRace
                    ? nextRace.name.toUpperCase()
                    : "NO UPCOMING RACES"}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Toggle */}
          <button
            onClick={() => setShowNationals((prev) => !prev)}
            className="mt-6 font-mono text-[10px] md:text-xs tracking-[0.2em] px-5 py-2 rounded-full border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: `${themeColor}44`,
              color: `${themeColor}aa`,
              backgroundColor: "transparent",
            }}
          >
            {showNationals ? "SHOW NEXT RACE →" : "← SHOW NATIONALS"}
          </button>
        </motion.div>
      )}

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div
            className="h-[2px] flex-1"
            style={{ backgroundColor: `${themeColor}33` }}
          />
          <h4 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-white">
            TRIATHLON
          </h4>
          <div
            className="h-[2px] flex-1"
            style={{ backgroundColor: `${themeColor}33` }}
          />
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
          <div
            className="h-[2px] flex-1"
            style={{ backgroundColor: `${themeColor}33` }}
          />
          <h4 className="font-display text-3xl md:text-4xl tracking-[0.15em] text-white">
            RUNNING
          </h4>
          <div
            className="h-[2px] flex-1"
            style={{ backgroundColor: `${themeColor}33` }}
          />
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
  const [expanded, setExpanded] = useState(false);
  const [hasStamped, setHasStamped] = useState(false);
  const stampTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (stampTimerRef.current) clearTimeout(stampTimerRef.current);
    };
  }, []);

  const raceDate = parseLocalDate(race.date);
  const now = new Date();
  const isSameDay =
    raceDate.getFullYear() === now.getFullYear() &&
    raceDate.getMonth() === now.getMonth() &&
    raceDate.getDate() === now.getDate();
  const isToday = isSameDay && !race.result;
  const isPast = (raceDate < now && !isSameDay) || (isSameDay && !!race.result);
  const daysUntil = getDaysUntil(raceDate);
  const hasDetails =
    race.distance ||
    race.course ||
    race.description ||
    race.championship ||
    race.website ||
    race.splits;

  const handleClick = useCallback(() => {
    if (!hasDetails) return;

    if (expanded) {
      setExpanded(false);
      return;
    }

    if (race.result && !hasStamped) {
      setHasStamped(true);
      stampTimerRef.current = setTimeout(() => setExpanded(true), 500);
    } else {
      setExpanded(true);
    }
  }, [expanded, race.result, hasStamped, hasDetails]);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(raceDate);

  const expandedContent = hasDetails ? (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-6 mt-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:gap-8">
              {/* Details (left) */}
              <div className="flex-1 space-y-3">
                {race.distance && (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase w-20 shrink-0">
                      Distance
                    </span>
                    <span className="font-mono text-sm text-white/70">
                      {race.distance}
                    </span>
                  </div>
                )}
                {race.course && (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase w-20 shrink-0">
                      Course
                    </span>
                    <span className="font-mono text-sm text-white/70">
                      {race.course}
                    </span>
                  </div>
                )}
                {race.championship && (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase w-20 shrink-0">
                      Stakes
                    </span>
                    <span
                      className="font-mono text-sm tracking-[0.1em]"
                      style={{ color: themeColor }}
                    >
                      {race.championship}
                    </span>
                  </div>
                )}
                {race.description && (
                  <p className="font-mono text-sm text-white/70 italic pt-2">
                    &ldquo;{race.description}&rdquo;
                  </p>
                )}
                {race.splits && (
                  <div className="pt-3 space-y-1.5">
                    <div className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">
                      Splits
                    </div>
                    {race.splits.map((split) => (
                      <div key={split.leg} className="flex items-center gap-3">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase w-12 shrink-0">
                          {split.leg}
                        </span>
                        <span
                          className="font-mono text-sm font-medium"
                          style={{ color: themeColor }}
                        >
                          {split.time}
                        </span>
                        {split.pace && (
                          <span className="font-mono text-xs text-white/60">
                            {split.pace}
                          </span>
                        )}
                      </div>
                    ))}
                    {race.result && (
                      <div className="flex items-center gap-3 pt-1.5 mt-1.5 border-t border-white/10">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase w-12 shrink-0">
                          Total
                        </span>
                        <span
                          className="font-mono text-sm font-bold"
                          style={{ color: themeColor }}
                        >
                          {race.result}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {race.website && (
                  <a
                    href={race.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] pt-2 transition-colors duration-200 hover:opacity-80"
                    style={{ color: themeColor }}
                  >
                    RACE WEBSITE
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Mini map (right on desktop, below on mobile) */}
              <div className="mt-4 md:mt-0 md:shrink-0 md:self-center">
                <MiniRouteMap
                  destination={race.coords}
                  themeColor={themeColor}
                  isTarget={race.isTarget}
                  cityCode={race.cityCode}
                  stateFips={race.stateFips}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ) : null;

  // Chevron indicator for expandable cards
  const chevron = hasDetails ? (
    <motion.svg
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="w-4 h-4 text-white/30 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </motion.svg>
  ) : null;

  if (race.isTarget) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        role={hasDetails ? "button" : undefined}
        tabIndex={hasDetails ? 0 : undefined}
        aria-expanded={hasDetails ? expanded : undefined}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (hasDetails && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`relative p-8 md:p-10 rounded-2xl border-2 backdrop-blur-sm ${hasDetails ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black" : ""}`}
        style={{
          backgroundColor: `${themeColor}18`,
          borderColor: themeColor,
          boxShadow: `0 0 40px ${themeColor}44`,
        }}
      >
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono tracking-[0.2em]"
                  style={{
                    backgroundColor: `${themeColor}22`,
                    borderColor: `${themeColor}88`,
                    color: themeColor,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: themeColor }}
                  />
                  THE TARGET
                </div>
                {chevron}
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

          {/* Stamp overlay — stays on header area */}
          <AnimatePresence>
            {hasStamped && race.result && (
              <motion.div
                initial={{ scale: 2.5, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: -12 }}
                transition={{
                  scale: { type: "spring", stiffness: 600, damping: 20 },
                  opacity: { duration: 0.1 },
                }}
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-black/60 rounded-xl blur-md" />
                  <Image
                    src="/icons/Mission_Accomplished_Volt.webp"
                    alt="Mission Accomplished"
                    width={320}
                    height={140}
                    className="relative select-none"
                    style={{
                      filter: "drop-shadow(0 4px 16px rgba(249, 115, 22, 0.4))",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {expandedContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      role={hasDetails ? "button" : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      aria-expanded={hasDetails ? expanded : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (hasDetails && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`relative p-6 md:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${hasDetails ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black" : ""}`}
      style={{
        backgroundColor: isNext ? `${themeColor}11` : "rgba(255,255,255,0.03)",
        borderColor: isNext ? `${themeColor}66` : "rgba(255,255,255,0.1)",
        boxShadow: isNext ? `0 0 30px ${themeColor}33` : "none",
      }}
    >
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-mono text-sm tracking-[0.15em] text-white/80">
                {formattedDate.toUpperCase()}
              </div>

              {isNext && !isPast && !isToday && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-[0.15em]"
                  style={{
                    backgroundColor: `${themeColor}22`,
                    color: themeColor,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: themeColor }}
                  />
                  NEXT // {daysUntil} DAYS
                </div>
              )}

              {isToday && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-[0.15em]"
                  style={{
                    backgroundColor: `${themeColor}22`,
                    color: themeColor,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: themeColor }}
                  />
                  RACE DAY!
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

          <div className="flex items-center gap-4">
            {isPast && race.result && (
              <div
                className="font-display text-2xl md:text-3xl tracking-wide"
                style={{ color: themeColor }}
              >
                {race.result}
              </div>
            )}

            {!isPast && !isNext && (
              <div className="text-right">
                <div className="font-display text-3xl md:text-4xl tracking-wide text-white/60">
                  {daysUntil}
                </div>
                <div className="font-mono text-xs tracking-[0.2em] text-white/50">
                  DAYS
                </div>
              </div>
            )}

            {chevron}
          </div>
        </div>

        {/* Stamp overlay — stays on header area */}
        <AnimatePresence>
          {hasStamped && race.result && (
            <motion.div
              initial={{ scale: 2.5, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              transition={{
                scale: { type: "spring", stiffness: 600, damping: 20 },
                opacity: { duration: 0.1 },
              }}
              className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-black/60 rounded-xl blur-md" />
                <Image
                  src="/icons/Mission_Accomplished_Volt.webp"
                  alt="Mission Accomplished"
                  width={280}
                  height={120}
                  className="relative select-none"
                  style={{
                    filter: "drop-shadow(0 4px 16px rgba(249, 115, 22, 0.4))",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {expandedContent}
    </motion.div>
  );
}
