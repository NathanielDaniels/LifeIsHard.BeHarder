'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  CartesianGrid,
} from 'recharts';

interface RecoveryDataPoint {
  date: string;
  recovery: number | null;
  hrv: number | null;
  rhr: number | null;
  strain: number | null;
  zone: string | null;
}

interface RecoveryChartProps {
  data: RecoveryDataPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg px-4 py-3 shadow-xl">
      <p className="font-mono text-xs text-white/50 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-white/40 font-mono uppercase">{entry.name}:</span>
          <span className="text-white font-mono">
            {entry.value != null ? entry.value : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

// Color recovery dots by zone
function RecoveryDot(props: any) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null || payload.recovery == null) return null;

  const color =
    payload.zone === 'green' ? '#22c55e' :
    payload.zone === 'yellow' ? '#eab308' : '#ef4444';

  return <circle cx={cx} cy={cy} r={3} fill={color} stroke="none" />;
}

export default function RecoveryChart({ data }: RecoveryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
          tickFormatter={(d: string) => d.slice(5)}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="left"
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 21]}
          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }}
          tickLine={false}
          axisLine={false}
        />

        {/* Green/red threshold lines */}
        <ReferenceLine yAxisId="left" y={67} stroke="rgba(34,197,94,0.2)" strokeDasharray="4 4" />
        <ReferenceLine yAxisId="left" y={34} stroke="rgba(239,68,68,0.2)" strokeDasharray="4 4" />

        {/* Strain bars (background) */}
        <Bar
          yAxisId="right"
          dataKey="strain"
          name="Strain"
          fill="rgba(249,115,22,0.15)"
          radius={[2, 2, 0, 0]}
          barSize={8}
        />

        {/* Recovery line with zone-colored dots */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="recovery"
          name="Recovery"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
          dot={<RecoveryDot />}
          connectNulls
        />

        {/* HRV line */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="hrv"
          name="HRV"
          stroke="#8b5cf6"
          strokeWidth={1}
          strokeDasharray="4 2"
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
