'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DisciplineEntry {
  sport: string;
  minutes: number;
  color: string;
}

interface DisciplineBalanceProps {
  data: DisciplineEntry[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as DisciplineEntry;
  const hours = Math.floor(d.minutes / 60);
  const mins = d.minutes % 60;

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
      <p className="font-mono text-xs text-white/80 capitalize mb-1">{d.sport.replace('-', ' ')}</p>
      <p className="font-mono text-xs text-white/50">
        {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
      </p>
    </div>
  );
}

export default function DisciplineBalance({ data }: DisciplineBalanceProps) {
  const total = data.reduce((sum, d) => sum + d.minutes, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="font-mono text-xs text-white/30">No training data available</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      {/* Doughnut */}
      <div className="shrink-0">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              dataKey="minutes"
              stroke="none"
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2 flex-1">
        {data.slice(0, 6).map(d => (
          <div key={d.sport} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span className="font-mono text-xs text-white/50 capitalize flex-1">
              {d.sport.replace('-', ' ')}
            </span>
            <span className="font-mono text-xs text-white/70">
              {Math.round((d.minutes / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
