'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ZONE_COLORS } from '@/lib/dashboard-data';

interface HRZoneData {
  zone1: number;
  zone2: number;
  zone3: number;
  zone4: number;
  zone5: number;
}

interface HRZoneChartProps {
  data: HRZoneData;
}

const ZONE_LABELS = ['Z1 – Easy', 'Z2 – Moderate', 'Z3 – Hard', 'Z4 – Threshold', 'Z5 – Max'];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
      <p className="font-mono text-xs text-white/80 mb-1">{d.label}</p>
      <p className="font-mono text-xs text-white/50">{d.minutes} min</p>
    </div>
  );
}

export default function HRZoneChart({ data }: HRZoneChartProps) {
  const chartData = [
    { zone: 'Z1', label: ZONE_LABELS[0], minutes: data.zone1 },
    { zone: 'Z2', label: ZONE_LABELS[1], minutes: data.zone2 },
    { zone: 'Z3', label: ZONE_LABELS[2], minutes: data.zone3 },
    { zone: 'Z4', label: ZONE_LABELS[3], minutes: data.zone4 },
    { zone: 'Z5', label: ZONE_LABELS[4], minutes: data.zone5 },
  ];

  const total = chartData.reduce((sum, z) => sum + z.minutes, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 10, bottom: 0, left: 10 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="zone"
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="minutes" radius={[0, 4, 4, 0]} barSize={24}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={ZONE_COLORS[i]} fillOpacity={0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Zone percentages */}
      {total > 0 && (
        <div className="flex gap-2 mt-3 justify-center">
          {chartData.map((z, i) => (
            <div key={z.zone} className="text-center">
              <div
                className="w-8 h-1.5 rounded-full mx-auto mb-1"
                style={{ backgroundColor: ZONE_COLORS[i], opacity: 0.7 }}
              />
              <p className="font-mono text-[9px] text-white/40">
                {Math.round((z.minutes / total) * 100)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
