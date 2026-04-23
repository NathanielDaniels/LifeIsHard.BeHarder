'use client';

interface CoachResponse {
  id?: number;
  date: string;
  type?: string;
  status?: string;
  energy_level?: number;
  notes?: string;
  created_at: string;
}

interface ResponseHistoryProps {
  responses: CoachResponse[];
}

function energyLabel(level: number | undefined): string {
  if (level == null) return '';
  if (level >= 4) return 'High';
  if (level >= 3) return 'Good';
  if (level >= 2) return 'Low';
  return 'Very Low';
}

function energyColor(level: number | undefined): string {
  if (level == null) return 'text-white/30';
  if (level >= 4) return 'text-emerald-400';
  if (level >= 3) return 'text-yellow-400';
  return 'text-red-400';
}

function typeIcon(type: string | undefined): string {
  if (type === 'quick-tap') return '⚡';
  if (type === 'checkin-form') return '📋';
  return '💬';
}

export default function ResponseHistory({ responses }: ResponseHistoryProps) {
  if (responses.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="font-mono text-xs text-white/30">No check-in responses yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {responses.map((r, i) => (
        <div
          key={r.id ?? i}
          className="flex gap-4 py-4 border-b border-white/5 last:border-0"
        >
          {/* Timeline dot + line */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500/60 mt-1" />
            {i < responses.length - 1 && (
              <div className="w-px flex-1 bg-white/8 mt-1" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{typeIcon(r.type)}</span>
              <span className="font-mono text-xs text-white/60">{r.date}</span>
              {r.status && (
                <span className="font-mono text-[10px] tracking-wider text-white/30 uppercase">
                  {r.status}
                </span>
              )}
              {r.energy_level != null && (
                <span className={`font-mono text-[10px] tracking-wider ${energyColor(r.energy_level)}`}>
                  Energy: {energyLabel(r.energy_level)}
                </span>
              )}
            </div>

            {r.notes && (
              <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
                {r.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
