'use client';

import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, ReferenceLine, PieChart, Pie, Cell,
} from 'recharts';
import { ZONE_COLORS, SPORT_COLORS } from '@/lib/dashboard-data';

// ─── Demo data (anonymized, not Patrick's real numbers) ───

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

const DEMO_BALANCE = [
  { sport: 'running', minutes: 210, color: SPORT_COLORS.running },
  { sport: 'cycling', minutes: 180, color: SPORT_COLORS.cycling },
  { sport: 'swimming', minutes: 120, color: SPORT_COLORS.swimming },
  { sport: 'strength-training', minutes: 90, color: SPORT_COLORS['strength-training'] },
];

const FUNDAMENTALS = [
  { num: '01', title: 'Train the Whole Athlete', desc: 'Swim, bike, run — with prosthetic-specific adaptations' },
  { num: '02', title: 'Recovery as Training', desc: 'WHOOP data guides rest days as seriously as race days' },
  { num: '03', title: 'Progressive Overload', desc: 'Strain targets that grow with your capacity' },
  { num: '04', title: 'Mental Callusing', desc: 'Building tolerance to discomfort through controlled exposure' },
  { num: '05', title: 'Cookie Jar', desc: 'Cataloging victories to fuel breakthrough moments' },
  { num: '06', title: 'Limb Intelligence', desc: 'Monitoring prosthetic fit, skin health, and residual limb recovery' },
  { num: '07', title: 'Race Day Scripting', desc: 'Pre-planned scenarios for every contingency on course' },
];

function DemoDot(props: any) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;
  const color = payload.zone === 'green' ? '#22c55e' : payload.zone === 'yellow' ? '#eab308' : '#ef4444';
  return <circle cx={cx} cy={cy} r={3} fill={color} stroke="none" />;
}

export default function ShowcasePage() {
  const recoveryData = useMemo(generateDemoRecovery, []);
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
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            A personalized AI coaching system that reads your biometric data overnight and
            delivers a tailored briefing before you wake up. Built on WHOOP integration,
            sports science, and the philosophy that data without context is just noise.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-12 text-center">
            WHAT THE COACH SEES
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recovery Trend (demo) */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/55 mb-4">
                RECOVERY TREND
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={recoveryData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={false} />
                  <YAxis
                    yAxisId="left" domain={[0, 100]}
                    tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }}
                    tickLine={false} axisLine={false}
                  />
                  <YAxis
                    yAxisId="right" orientation="right" domain={[0, 21]}
                    tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.15)' }}
                    tickLine={false} axisLine={false}
                  />
                  <ReferenceLine yAxisId="left" y={67} stroke="rgba(34,197,94,0.15)" strokeDasharray="4 4" />
                  <ReferenceLine yAxisId="left" y={34} stroke="rgba(239,68,68,0.15)" strokeDasharray="4 4" />
                  <Bar yAxisId="right" dataKey="strain" fill="rgba(249,115,22,0.12)" barSize={6} radius={[2, 2, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="recovery" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} dot={<DemoDot />} />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="text-[10px] font-mono text-white/20 mt-2 text-center">
                SAMPLE DATA — NOT REAL ATHLETE METRICS
              </p>
            </div>

            {/* Discipline Balance (demo) */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/55 mb-4">
                DISCIPLINE BALANCE
              </h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={DEMO_BALANCE} cx="50%" cy="50%"
                      innerRadius={45} outerRadius={65}
                      dataKey="minutes" stroke="none" paddingAngle={3}
                    >
                      {DEMO_BALANCE.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.7} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {DEMO_BALANCE.map(d => (
                    <div key={d.sport} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="font-mono text-xs text-white/50 capitalize">{d.sport.replace('-', ' ')}</span>
                      <span className="font-mono text-xs text-white/70">{Math.round((d.minutes / totalMinutes) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] font-mono text-white/20 mt-2 text-center">
                SAMPLE DATA — NOT REAL ATHLETE METRICS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 7 Fundamentals */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-4 text-center">
            THE 7 FUNDAMENTALS
          </h2>
          <p className="text-white/40 text-sm text-center mb-12 max-w-xl mx-auto">
            Every coaching decision is grounded in these principles — inspired by David Goggins&apos;
            philosophy of radical accountability, adapted for adaptive athletics.
          </p>

          <div className="space-y-4">
            {FUNDAMENTALS.map(f => (
              <div
                key={f.num}
                className="flex gap-4 items-start bg-white/[0.02] hover:bg-white/[0.04] rounded-lg px-5 py-4 transition-colors"
              >
                <span className="font-display text-2xl text-orange-500/50 shrink-0 w-10">{f.num}</span>
                <div>
                  <p className="font-mono text-xs tracking-wider text-white/70 mb-1">{f.title}</p>
                  <p className="text-xs text-white/35">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Jar */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl tracking-widest mb-6">THE COOKIE JAR</h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xl mx-auto mb-8">
            Goggins&apos; concept brought to life: the AI tracks your hardest efforts, biggest
            breakthroughs, and toughest moments — then surfaces them when you need them most.
            Before a race, during a low-recovery week, or when the plan feels impossible.
          </p>
          <div className="inline-flex gap-3">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2">
              <p className="font-mono text-[10px] text-orange-500/70">FIRST TRIATHLON WIN</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2">
              <p className="font-mono text-[10px] text-orange-500/70">250 MILES IN BHUTAN</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2">
              <p className="font-mono text-[10px] text-orange-500/70">16.8 STRAIN PR</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-6">
            WANT THIS FOR<br />
            <span className="text-orange-500">YOUR TRAINING?</span>
          </h2>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            We&apos;re building personalized AI coaching for adaptive athletes and beyond.
            Interested in early access? Let&apos;s talk.
          </p>
          <a
            href="https://www.instagram.com/patwingit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs tracking-widest px-8 py-3 rounded transition-colors"
          >
            GET IN TOUCH
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
