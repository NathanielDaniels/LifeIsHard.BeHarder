'use client';

import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, ReferenceLine, PieChart, Pie, Cell,
  BarChart, LineChart, ReferenceArea,
} from 'recharts';
import { ZONE_COLORS, SPORT_COLORS } from '@/lib/dashboard-data';

// ─── Demo data (anonymized) ───

function generateDemoRecovery() {
  const data = [];
  const base = new Date('2026-03-23');
  for (let i = 0; i < 28; i++) {
    const d = new Date(base.getTime() + i * 86400000);
    const date = d.toISOString().split('T')[0];
    const recovery = 40 + Math.round(Math.random() * 45 + Math.sin(i / 5) * 10);
    const strain = 4 + Math.round((Math.random() * 12 + Math.cos(i / 3) * 4) * 10) / 10;
    data.push({
      date,
      recovery: Math.min(100, Math.max(10, recovery)),
      strain: Math.min(20, Math.max(2, strain)),
      zone: recovery >= 67 ? 'green' : recovery >= 34 ? 'yellow' : 'red',
    });
  }
  return data;
}

function generateDemoRatio() {
  const data = [];
  const base = new Date('2026-03-23');
  for (let i = 0; i < 28; i++) {
    const d = new Date(base.getTime() + i * 86400000);
    const ratio = 0.8 + Math.random() * 2.5 + Math.sin(i / 4) * 0.5;
    const clamped = Math.min(4, Math.max(0.3, ratio));
    data.push({
      date: d.toISOString().split('T')[0],
      ratio: Math.round(clamped * 100) / 100,
      movingAvg: i >= 6 ? Math.round((1.5 + Math.sin(i / 6) * 0.6) * 100) / 100 : null,
      zone: clamped >= 2.5 ? 'green' : clamped >= 1.0 ? 'yellow' : 'red',
    });
  }
  return data;
}

const DEMO_BALANCE = [
  { sport: 'running', minutes: 210, color: SPORT_COLORS.running },
  { sport: 'cycling', minutes: 180, color: SPORT_COLORS.cycling },
  { sport: 'swimming', minutes: 120, color: SPORT_COLORS.swimming },
  { sport: 'strength-training', minutes: 90, color: SPORT_COLORS['strength-training'] },
];

const DEMO_ZONES = [
  { zone: 'Z1', minutes: 120, label: 'Easy' },
  { zone: 'Z2', minutes: 210, label: 'Moderate' },
  { zone: 'Z3', minutes: 85, label: 'Hard' },
  { zone: 'Z4', minutes: 45, label: 'Threshold' },
  { zone: 'Z5', minutes: 15, label: 'Max' },
];

const DEMO_LOAD = [
  { label: 'Week 1', strain: 62.4 },
  { label: 'Week 2', strain: 71.8 },
  { label: 'Week 3', strain: 78.2 },
  { label: 'Week 4', strain: 55.1 },
];

const CONDITIONS = [
  { icon: '🦿', label: 'Prosthetics & Limb Difference', desc: 'Skin health, socket fit, residual limb recovery' },
  { icon: '🫁', label: 'Asthma & Respiratory', desc: 'Training load limits, environmental triggers, inhaler timing' },
  { icon: '💉', label: 'Diabetes (Type 1 & 2)', desc: 'Glucose-aware training zones, fueling strategy, recovery patterns' },
  { icon: '❤️', label: 'Cardiac Conditions', desc: 'HR ceiling awareness, exertion monitoring, medication interactions' },
  { icon: '🧠', label: 'Chronic Pain & Fatigue', desc: 'Pacing strategy, flare-up prediction, adaptive load management' },
  { icon: '🦴', label: 'Joint & Mobility Issues', desc: 'Impact budgeting, cross-training balance, progression limits' },
];

const CUSTOMIZATIONS = [
  {
    title: 'YOUR HEALTH',
    desc: 'The coach understands your specific medical context — prosthetic fit, blood sugar management, respiratory limits, whatever your body needs monitored.',
    mono: 'CONDITION-AWARE COACHING',
  },
  {
    title: 'YOUR SCHEDULE',
    desc: 'Knows your race calendar, travel days, rest weeks, and life commitments. Training recommendations that fit your actual life, not a template.',
    mono: 'CALENDAR INTEGRATION',
  },
  {
    title: 'YOUR SPORT',
    desc: 'Whether you race triathlons, run marathons, or just want to stay active — the system adapts to your disciplines, goals, and intensity preferences.',
    mono: 'SPORT-SPECIFIC INTELLIGENCE',
  },
  {
    title: 'YOUR VOICE',
    desc: 'Choose a coaching personality that motivates you. Tough love, gentle encouragement, pure data — or build something completely custom.',
    mono: 'PERSONALIZED TONE',
  },
];

const COACHING_STYLES = [
  { name: 'THE DRILL SERGEANT', desc: 'Goggins-inspired accountability. No excuses. Mental callusing. Cookie jar victories surfaced when you need them most.', tag: 'TOUGH LOVE' },
  { name: 'THE SCIENTIST', desc: 'Pure data-driven analysis. Trends, baselines, statistical deviations. Just the numbers and what they mean.', tag: 'DATA-FIRST' },
  { name: 'THE MENTOR', desc: 'Encouraging, empowering, focused on long-term growth. Celebrates progress without losing sight of the goal.', tag: 'SUPPORTIVE' },
  { name: 'CUSTOM BUILD', desc: 'Your coach, your rules. Define the personality, priorities, and communication style from scratch.', tag: 'YOU DECIDE' },
];

function DemoDot(props: any) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;
  const color = payload.zone === 'green' ? '#22c55e' : payload.zone === 'yellow' ? '#eab308' : '#ef4444';
  return <circle cx={cx} cy={cy} r={3} fill={color} stroke="none" />;
}

function RatioDot(props: any) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;
  const color = payload.zone === 'green' ? '#22c55e' : payload.zone === 'yellow' ? '#eab308' : '#ef4444';
  return <circle cx={cx} cy={cy} r={3} fill={color} stroke="none" />;
}

export default function ShowcasePage() {
  const recoveryData = useMemo(generateDemoRecovery, []);
  const ratioData = useMemo(generateDemoRatio, []);
  const totalMinutes = DEMO_BALANCE.reduce((s, d) => s + d.minutes, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto relative">
          <p className="font-mono text-xs tracking-[4px] text-orange-500/70 mb-4">
            AI-POWERED COACHING
          </p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider leading-tight mb-6">
            YOUR DATA.<br />
            <span className="text-orange-500">YOUR COACH.</span><br />
            EVERY MORNING.
          </h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed mb-8">
            A personalized AI coaching system that analyzes your biometric data overnight and
            delivers a tailored briefing waiting for you when you wake up. Built around your
            health, your schedule, and your specific needs — not a one-size-fits-all template.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="font-mono text-[10px] tracking-wider text-white/30 border border-white/10 rounded-full px-3 py-1">WHOOP INTEGRATION</span>
            <span className="font-mono text-[10px] tracking-wider text-white/30 border border-white/10 rounded-full px-3 py-1">CONDITION-AWARE</span>
            <span className="font-mono text-[10px] tracking-wider text-white/30 border border-white/10 rounded-full px-3 py-1">SCHEDULE-SYNCED</span>
            <span className="font-mono text-[10px] tracking-wider text-white/30 border border-white/10 rounded-full px-3 py-1">CUSTOM COACHING VOICE</span>
          </div>
        </div>
      </section>

      {/* What The Coach Sees — expanded chart grid */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            WHAT THE COACH SEES
          </h2>
          <p className="text-white/35 text-sm text-center mb-12 max-w-lg mx-auto">
            Every morning, the AI processes your overnight biometrics and builds a complete picture
            of where you are — not just today, but in the arc of your training.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recovery Trend */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/55 mb-1">RECOVERY TREND</h3>
              <p className="text-[10px] text-white/25 mb-4">Zone-coded recovery with strain overlay</p>
              <ResponsiveContainer width="100%" height={180}>
                <ComposedChart data={recoveryData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={false} />
                  <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 21]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.15)' }} tickLine={false} axisLine={false} />
                  <ReferenceLine yAxisId="left" y={67} stroke="rgba(34,197,94,0.15)" strokeDasharray="4 4" />
                  <ReferenceLine yAxisId="left" y={34} stroke="rgba(239,68,68,0.15)" strokeDasharray="4 4" />
                  <Bar yAxisId="right" dataKey="strain" fill="rgba(249,115,22,0.12)" barSize={6} radius={[2, 2, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="recovery" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} dot={<DemoDot />} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Recovery-to-Load Ratio */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/55 mb-1">RECOVERY-TO-LOAD RATIO</h3>
              <p className="text-[10px] text-white/25 mb-4">Are you recovering as hard as you&apos;re training?</p>
              <ResponsiveContainer width="100%" height={180}>
                <ComposedChart data={ratioData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <ReferenceArea y1={2.5} y2={4} fill="rgba(34,197,94,0.04)" />
                  <ReferenceArea y1={1.0} y2={2.5} fill="rgba(234,179,8,0.02)" />
                  <ReferenceArea y1={0} y2={1.0} fill="rgba(239,68,68,0.04)" />
                  <XAxis dataKey="date" tick={false} />
                  <YAxis domain={[0, 4]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }} tickLine={false} axisLine={false} ticks={[0, 1, 2.5, 4]} />
                  <Line type="monotone" dataKey="ratio" stroke="none" dot={<RatioDot />} />
                  <Line type="monotone" dataKey="movingAvg" stroke="#f97316" strokeWidth={2} dot={false} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Weekly Load */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/55 mb-1">TRAINING LOAD</h3>
              <p className="text-[10px] text-white/25 mb-4">Weekly strain periodization</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={DEMO_LOAD} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.25)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.2)' }} tickLine={false} axisLine={false} />
                  <Bar dataKey="strain" fill="rgba(249,115,22,0.5)" radius={[3, 3, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* HR Zones */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/55 mb-1">HR ZONES</h3>
              <p className="text-[10px] text-white/25 mb-4">Time in each training zone</p>
              <div className="space-y-2 mt-2">
                {DEMO_ZONES.map((z, i) => {
                  const total = DEMO_ZONES.reduce((s, d) => s + d.minutes, 0);
                  const pct = Math.round((z.minutes / total) * 100);
                  return (
                    <div key={z.zone} className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-white/35 w-5">{z.zone}</span>
                      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ZONE_COLORS[i], opacity: 0.7 }} />
                      </div>
                      <span className="font-mono text-[9px] text-white/35 w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Discipline Balance */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/55 mb-1">SPORT BALANCE</h3>
              <p className="text-[10px] text-white/25 mb-4">Time across disciplines</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={DEMO_BALANCE} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="minutes" stroke="none" paddingAngle={3}>
                      {DEMO_BALANCE.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5">
                  {DEMO_BALANCE.map(d => (
                    <div key={d.sport} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="font-mono text-[9px] text-white/45 capitalize">{d.sport.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-mono text-white/15 mt-4 text-center">
            SAMPLE DATA — NOT REAL ATHLETE METRICS
          </p>
        </div>
      </section>

      {/* Built Around You — customization pillars */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            BUILT AROUND YOU
          </h2>
          <p className="text-white/35 text-sm text-center mb-12 max-w-lg mx-auto">
            Not a template. Not a generic plan. Every aspect of your coaching system is
            configured to your body, your goals, and your life.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CUSTOMIZATIONS.map(c => (
              <div key={c.title} className="bg-white/[0.02] border border-white/5 rounded-lg p-6 hover:border-white/10 transition-colors">
                <p className="font-mono text-[9px] tracking-[3px] text-orange-500/50 mb-2">{c.mono}</p>
                <h3 className="font-display text-xl tracking-wider mb-2">{c.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Condition-Aware Coaching */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            YOUR CONDITION. UNDERSTOOD.
          </h2>
          <p className="text-white/35 text-sm text-center mb-12 max-w-lg mx-auto">
            Generic coaching apps ignore what makes your body different. This one starts there.
            Whatever affects your training — the coach knows, adapts, and never forgets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONDITIONS.map(c => (
              <div key={c.label} className="flex gap-3 items-start bg-white/[0.02] rounded-lg px-4 py-4">
                <span className="text-xl shrink-0">{c.icon}</span>
                <div>
                  <p className="font-mono text-xs tracking-wider text-white/60 mb-1">{c.label}</p>
                  <p className="text-[11px] text-white/30 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching Styles */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            YOUR COACHING VOICE
          </h2>
          <p className="text-white/35 text-sm text-center mb-12 max-w-lg mx-auto">
            Pick a personality that keeps you moving. Or design one from scratch.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COACHING_STYLES.map(s => (
              <div key={s.name} className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-lg p-5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono text-xs tracking-wider text-white/70">{s.name}</h3>
                  <span className="font-mono text-[9px] tracking-wider text-orange-500/40 border border-orange-500/15 rounded-full px-2 py-0.5">
                    {s.tag}
                  </span>
                </div>
                <p className="text-xs text-white/35 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-6">
            COACHING THAT<br />
            <span className="text-orange-500">KNOWS YOU.</span>
          </h2>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            We&apos;re building personalized AI coaching for athletes who need more than generic
            advice. Whether you manage a medical condition, train for competition, or just want
            smarter recovery — this is built for you.
          </p>
          <a
            href="https://www.instagram.com/patwingit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs tracking-widest px-8 py-3 rounded transition-colors"
          >
            GET EARLY ACCESS
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/20">
            Built by{' '}
            <a href="https://patrickwingert.com" className="text-white/40 hover:text-white/60 transition-colors">
              patrickwingert.com
            </a>
          </p>
          <a
            href="https://www.dare2tri.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            Dare2Tri Foundation
          </a>
        </div>
      </footer>
    </div>
  );
}
