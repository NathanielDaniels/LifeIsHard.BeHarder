'use client';

interface DaysSinceProps {
  swim: number | null;
  bike: number | null;
  run: number | null;
}

const DISCIPLINES = [
  { key: 'swim' as const, label: 'SWIM', icon: '🏊' },
  { key: 'bike' as const, label: 'BIKE', icon: '🚴' },
  { key: 'run' as const, label: 'RUN', icon: '🏃' },
];

function daysColor(days: number | null): string {
  if (days === null) return 'text-white/20';
  if (days <= 3) return 'text-emerald-400';
  if (days <= 6) return 'text-yellow-400';
  return 'text-red-400';
}

function daysBorder(days: number | null): string {
  if (days === null) return 'border-white/8';
  if (days <= 3) return 'border-emerald-500/30';
  if (days <= 6) return 'border-yellow-500/30';
  return 'border-red-500/30';
}

export default function DaysSinceCards({ swim, bike, run }: DaysSinceProps) {
  const values = { swim, bike, run };

  return (
    <div className="grid grid-cols-3 gap-3">
      {DISCIPLINES.map(d => {
        const days = values[d.key];
        return (
          <div
            key={d.key}
            className={`bg-[#0a0a0a] border ${daysBorder(days)} rounded-lg p-4 text-center`}
          >
            <p className="text-lg mb-1">{d.icon}</p>
            <p className={`font-display text-3xl ${daysColor(days)}`}>
              {days !== null ? days : '—'}
            </p>
            <p className="font-mono text-[10px] tracking-[2px] text-white/40 mt-1">
              DAYS SINCE {d.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
