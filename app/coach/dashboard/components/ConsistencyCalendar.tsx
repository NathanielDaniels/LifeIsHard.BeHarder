'use client';

import { useState } from 'react';
import { SPORT_COLORS } from '@/lib/dashboard-data';
import type { WorkoutRecord } from '@/types/whoop';

interface CalendarDay {
  date: string;
  strain: number | null;
  recovery: number | null;
  workouts: WorkoutRecord[];
  sport: string | null;
}

interface ConsistencyCalendarProps {
  data: CalendarDay[];
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function cellColor(day: CalendarDay): string {
  if (day.workouts.length === 0 && !day.sport) return 'rgba(255,255,255,0.03)';

  // Use the primary sport color if available
  const sport = day.workouts[0]?.sport_name || day.sport;
  if (sport && SPORT_COLORS[sport]) {
    const intensity = day.strain != null ? Math.min(1, 0.3 + (day.strain / 21) * 0.7) : 0.4;
    return SPORT_COLORS[sport] + Math.round(intensity * 255).toString(16).padStart(2, '0');
  }

  // Fallback: strain-based orange
  if (day.strain != null && day.strain > 2) {
    const intensity = Math.min(1, 0.3 + (day.strain / 21) * 0.7);
    return `rgba(249, 115, 22, ${intensity})`;
  }

  return 'rgba(255,255,255,0.03)';
}

export default function ConsistencyCalendar({ data }: ConsistencyCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);

  // Pad to start on Monday
  const firstDate = data[0]?.date;
  const firstDayOfWeek = firstDate ? new Date(firstDate + 'T00:00:00').getDay() : 1;
  const mondayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const padded = [...Array(mondayOffset).fill(null), ...data];

  // Split into weeks
  const weeks: (CalendarDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return (
    <div>
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((d, i) => (
          <p key={i} className="text-center font-mono text-[9px] text-white/25">{d}</p>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                className="aspect-square rounded-sm cursor-default transition-transform hover:scale-110"
                style={{ backgroundColor: day ? cellColor(day) : 'transparent' }}
                onMouseEnter={() => day && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Hover detail */}
      <div className="h-12 mt-3">
        {hoveredDay ? (
          <div className="text-xs font-mono">
            <p className="text-white/60">{hoveredDay.date}</p>
            <p className="text-white/40">
              {hoveredDay.workouts.length > 0
                ? hoveredDay.workouts.map(w => w.sport_name).filter(Boolean).join(', ')
                : hoveredDay.sport || 'Rest day'}
              {hoveredDay.strain != null && ` · Strain ${hoveredDay.strain.toFixed(1)}`}
              {hoveredDay.recovery != null && ` · Recovery ${hoveredDay.recovery}%`}
            </p>
          </div>
        ) : (
          <p className="text-xs font-mono text-white/20">Hover a day for details</p>
        )}
      </div>
    </div>
  );
}
