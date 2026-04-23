'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

interface WeekBucket {
  label: string;
  strain: number;
  workouts: number;
}

interface TrainingLoadChartProps {
  data: WeekBucket[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as WeekBucket;

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
      <p className="font-mono text-xs text-white/50 mb-2">{d.label}</p>
      <div className="space-y-1 text-xs font-mono">
        <p className="text-orange-400">Strain: {d.strain}</p>
        <p className="text-white/60">Workouts: {d.workouts}</p>
      </div>
    </div>
  );
}

export default function TrainingLoadChart({ data }: TrainingLoadChartProps) {
  // Color intensity by strain level
  const maxStrain = Math.max(...data.map(d => d.strain), 1);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="strain" radius={[4, 4, 0, 0]} barSize={40}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={`rgba(249, 115, 22, ${0.3 + (entry.strain / maxStrain) * 0.7})`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
