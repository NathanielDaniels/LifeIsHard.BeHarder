'use client';

import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Brush,
  CartesianGrid,
} from 'recharts';

interface RatioDataPoint {
  date: string;
  ratio: number | null;
  movingAvg: number | null;
  zone: string | null;
}

interface RecoveryLoadRatioProps {
  data: RatioDataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload as RatioDataPoint;
  if (!point) return null;

  const zoneLabel =
    point.zone === 'green' ? 'Optimal' :
    point.zone === 'yellow' ? 'Moderate' : 'Strained';

  const zoneColor =
    point.zone === 'green' ? '#22c55e' :
    point.zone === 'yellow' ? '#eab308' : '#ef4444';

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
      <p className="font-mono text-xs text-white/50 mb-2">{label}</p>
      {point.ratio != null && (
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zoneColor }} />
          <span className="text-white/40 font-mono">Ratio:</span>
          <span className="text-white font-mono">{point.ratio.toFixed(2)}</span>
          <span className="text-white/30 font-mono">({zoneLabel})</span>
        </div>
      )}
      {point.movingAvg != null && (
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-white/40 font-mono">7d Avg:</span>
          <span className="text-white font-mono">{point.movingAvg.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

// Color dots by zone
function RatioDot(props: any) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null || payload.ratio == null) return null;

  const color =
    payload.zone === 'green' ? '#22c55e' :
    payload.zone === 'yellow' ? '#eab308' : '#ef4444';

  return <circle cx={cx} cy={cy} r={3.5} fill={color} stroke="none" />;
}

export default function RecoveryLoadRatio({ data }: RecoveryLoadRatioProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />

        {/* Zone background areas */}
        <ReferenceArea y1={2.5} y2={4} fill="rgba(34,197,94,0.05)" />
        <ReferenceArea y1={1.0} y2={2.5} fill="rgba(234,179,8,0.03)" />
        <ReferenceArea y1={0} y2={1.0} fill="rgba(239,68,68,0.05)" />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
          tickFormatter={(d: string) => d.slice(5)}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 4]}
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
          tickLine={false}
          axisLine={false}
          ticks={[0, 1, 2.5, 4]}
        />

        {/* Daily ratio dots colored by zone */}
        <Scatter
          dataKey="ratio"
          name="Ratio"
          shape={<RatioDot />}
        />

        {/* 7-day moving average trend */}
        <Line
          type="monotone"
          dataKey="movingAvg"
          name="7d Average"
          stroke="#f97316"
          strokeWidth={2}
          dot={false}
          connectNulls
        />

        <Tooltip content={<CustomTooltip />} />
        <Brush
          dataKey="date"
          height={20}
          stroke="rgba(255,255,255,0.1)"
          fill="#0a0a0a"
          tickFormatter={(d: string) => d.slice(5)}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
