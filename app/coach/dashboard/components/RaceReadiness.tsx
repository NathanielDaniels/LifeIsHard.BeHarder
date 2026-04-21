'use client';

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface RaceReadinessProps {
  score: number;
  recovery: number;
  consistency: number;
  balance: number;
}

function scoreColor(score: number): string {
  if (score >= 70) return '#22c55e';
  if (score >= 45) return '#eab308';
  return '#ef4444';
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] tracking-wider text-white/40 w-24 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-xs text-white/60 w-8 text-right">{value}</span>
    </div>
  );
}

export default function RaceReadiness({ score, recovery, consistency, balance }: RaceReadinessProps) {
  const color = scoreColor(score);
  const data = [{ value: score, fill: color }];

  return (
    <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
      <h3 className="font-mono text-xs tracking-[3px] text-white/55 uppercase mb-4">
        Race Readiness
      </h3>

      <div className="flex items-center gap-6">
        {/* Radial gauge */}
        <div className="relative shrink-0">
          <RadialBarChart
            width={120}
            height={120}
            cx={60}
            cy={60}
            innerRadius={40}
            outerRadius={55}
            startAngle={90}
            endAngle={-270}
            data={data}
            barSize={10}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: 'rgba(255,255,255,0.05)' }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={5}
            />
          </RadialBarChart>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl" style={{ color }}>
              {score}
            </span>
          </div>
        </div>

        {/* Component breakdown */}
        <div className="flex-1 space-y-3">
          <ScoreBar label="RECOVERY" value={recovery} />
          <ScoreBar label="CONSISTENCY" value={consistency} />
          <ScoreBar label="BALANCE" value={balance} />
        </div>
      </div>
    </div>
  );
}
