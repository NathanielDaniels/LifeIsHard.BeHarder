'use client';

import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, ReferenceLine, PieChart, Pie, Cell,
  BarChart, ReferenceArea,
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
  { zone: 'Z1', minutes: 120 },
  { zone: 'Z2', minutes: 210 },
  { zone: 'Z3', minutes: 85 },
  { zone: 'Z4', minutes: 45 },
  { zone: 'Z5', minutes: 15 },
];

const DEMO_LOAD = [
  { label: '3/25–3/31', strain: 65 },
  { label: '4/1–4/7', strain: 71.8 },
  { label: '4/8–4/14', strain: 46.2 },
  { label: '4/15–4/21', strain: 53.4 },
];

// Stacked activity data — each day can have multiple sport segments
const DEMO_ACTIVITY = (() => {
  const data: Record<string, any>[] = [];
  const base = new Date('2026-03-24');
  // Pre-defined realistic schedule (some days 2 workouts, some rest)
  const schedule: (string[] | null)[] = [
    ['running'], ['cycling', 'strength-training'], null, ['swimming'], ['running'],
    ['cycling'], ['triathlon'], null, ['running', 'strength-training'], ['spin'],
    ['swimming'], null, ['running'], ['cycling'], null, ['running', 'strength-training'],
    ['cycling'], ['swimming'], null, ['running'], ['spin', 'strength-training'],
    ['cycling'], null, ['running'], ['swimming'], ['cycling', 'running'],
    null, ['triathlon'],
  ];
  for (let i = 0; i < 28; i++) {
    const d = new Date(base.getTime() + i * 86400000);
    const sports = schedule[i];
    const entry: Record<string, any> = { date: d.toISOString().split('T')[0].slice(5) };
    if (sports) {
      for (const sport of sports) {
        entry[sport] = 3 + Math.round(Math.random() * 12 * 10) / 10;
      }
    }
    data.push(entry);
  }
  return data;
})();

const ACTIVITY_SPORTS = ['running', 'cycling', 'swimming', 'strength-training', 'spin', 'triathlon'];

const DEMO_KEY_NUMBERS = [
  { label: 'HRV', value: '42.5 MS', trend: '↑', trendColor: 'text-emerald-400', baseline: 'vs 38.2 ms avg' },
  { label: 'RHR', value: '54 BPM', trend: '↓', trendColor: 'text-emerald-400', baseline: 'vs 56.1 bpm avg' },
  { label: 'SPO2', value: '98.2%', trend: '→', trendColor: 'text-white/50', baseline: 'vs 97.8 avg' },
];

// ─── The Loop steps ───

const LOOP_STEPS = [
  {
    num: '01',
    time: 'OVERNIGHT',
    title: 'YOUR BODY TALKS',
    desc: 'While you sleep, your WHOOP tracks recovery, HRV, resting heart rate, respiratory rate, and sleep quality. The system waits until your sleep is fully scored — no stale data, no guessing.',
    detail: 'Recovery score, HRV trends, sleep stages, strain from yesterday — all captured automatically.',
  },
  {
    num: '02',
    time: '5:00 AM',
    title: 'THE AI GOES TO WORK',
    desc: 'Your coach analyzes 90 days of history, computes baselines, identifies trends, cross-references your race calendar, checks your training balance, and reviews what you told it yesterday.',
    detail: '9 charts generated. Periodization phase calculated. One surprising insight surfaced. Training call written in future tense — because nothing has happened yet today.',
  },
  {
    num: '03',
    time: 'YOU WAKE UP',
    title: 'BRIEFING WAITING',
    desc: 'A personalized email with your recovery status, today\'s training recommendation, key biometric numbers with baselines, and charts showing where you are in the arc of your training.',
    detail: 'Not "your recovery is 67%." Instead: "Your HRV is 12% above your 90-day baseline for the third day running. Your body is absorbing last week\'s load. Today is the day to push."',
  },
  {
    num: '04',
    time: '30 SECONDS',
    title: 'YOU RESPOND',
    desc: 'Quick-tap buttons right in the email. "Strong / Good / Sore / Beat Down." One tap saves your status. Want to say more? A check-in form captures energy level, how your body feels, and free-text notes.',
    detail: 'Every response is cryptographically signed — secure, instant, no app to open. The coach reads it before tomorrow\'s briefing.',
  },
  {
    num: '05',
    time: 'TOMORROW',
    title: 'THE COACH REMEMBERS',
    desc: 'Yesterday\'s recommendation, your response, your stated plans, your stress level, your recovery timeline — all threaded into tomorrow\'s briefing. The coach never repeats itself. It never forgets what you said.',
    detail: 'If you said "planning to swim Saturday," the coach follows up Saturday morning. If you reported soreness, it adjusts. If you crushed a hard session on low recovery, that goes in your victory log.',
  },
];

// ─── What generic apps miss ───

const GENERIC_VS = [
  {
    generic: 'Shows you a recovery score.',
    coach: 'Tells you what that score means relative to YOUR 90-day baseline, and what to do about it today.',
  },
  {
    generic: 'Suggests a rest day.',
    coach: 'Knows you have a race in 16 days, you\'re in build phase, and your HRV is trending up — today is the day to push, not rest.',
  },
  {
    generic: 'Tracks your workouts.',
    coach: 'Notices you haven\'t swum in 11 days, your bike-to-run ratio is 3:1, and your discipline balance is drifting before a triathlon.',
  },
  {
    generic: 'Resets every session.',
    coach: 'Remembers that you reported tight legs on Tuesday, tracks your recovery arc, follows up Thursday to see if you\'re cleared.',
  },
  {
    generic: 'Same interface for everyone.',
    coach: 'Knows your asthma flares in cold weather, your prosthetic needs socket recovery time, your blood sugar affects morning sessions.',
  },
  {
    generic: 'Generic motivational quotes.',
    coach: 'Surfaces YOUR hardest training sessions and best race results when you need a push — because you actually did those things.',
  },
];

// ─── Conditions ───

const CONDITIONS = [
  { icon: '🦿', label: 'Prosthetics & Limb Difference', desc: 'Socket fit monitoring, skin health checks, residual limb recovery timelines, dual recovery tracks' },
  { icon: '🫁', label: 'Asthma & Respiratory', desc: 'Environmental trigger awareness, training load ceilings, medication timing, weather-adjusted plans' },
  { icon: '💉', label: 'Diabetes (Type 1 & 2)', desc: 'Glucose-aware training zones, fueling strategy integration, recovery pattern analysis' },
  { icon: '❤️', label: 'Cardiac Conditions', desc: 'HR ceiling enforcement, exertion monitoring, medication interaction awareness' },
  { icon: '🧠', label: 'Chronic Pain & Fatigue', desc: 'Flare-up prediction from biometric patterns, pacing strategy, adaptive load management' },
  { icon: '🦴', label: 'Joint & Mobility Issues', desc: 'Impact budgeting across disciplines, cross-training balance, progressive loading limits' },
];

// ─── Coaching styles ───

const COACHING_STYLES = [
  {
    name: 'THE DRILL SERGEANT',
    tag: 'TOUGH LOVE',
    desc: 'Accountability-first coaching. Your victories become ammunition for hard days. When your mind says quit, the coach reminds you what you\'ve already survived.',
    sample: '"You held pace through a brick workout on 43% recovery last month. Today is 71%. You know what that means. No excuses."',
  },
  {
    name: 'THE SCIENTIST',
    tag: 'DATA-FIRST',
    desc: 'Pure analysis. Trends, baselines, statistical deviations, periodization math. No emotion, just evidence and what it means for your next session.',
    sample: '"HRV 3-day average: 48ms (+14% above baseline). RHR stable at 52. Training load ratio 1.8. Window for high-intensity work is open."',
  },
  {
    name: 'THE MENTOR',
    tag: 'SUPPORTIVE',
    desc: 'Encouraging, empowering, focused on the long game. Celebrates consistency over intensity. Frames setbacks as data, not failure.',
    sample: '"Three consecutive green recovery days — your body is telling you the plan is working. Today\'s an opportunity, not an obligation. What feels right?"',
  },
  {
    name: 'CUSTOM BUILD',
    tag: 'YOU DECIDE',
    desc: 'Your coach, your rules. Define the personality, communication style, what gets emphasized, and how direct it should be. This is your system.',
    sample: '"[Your voice, your framework, your philosophy — built from scratch around how YOU want to be coached.]"',
  },
];

// ─── Weekly focus rotation ───

const WEEKLY_FOCUS = [
  { day: 'MON', focus: 'Week Strategy', desc: 'Last week\'s load vs this week\'s plan' },
  { day: 'TUE', focus: 'Training Response', desc: 'How your body responded to yesterday' },
  { day: 'WED', focus: 'Discipline Balance', desc: 'Swim/bike/run ratio for race demands' },
  { day: 'THU', focus: 'Recovery Intelligence', desc: 'Non-obvious patterns in your data' },
  { day: 'FRI', focus: 'Weekend Prep', desc: 'Smart play for the next two days' },
  { day: 'SAT', focus: 'Active Coaching', desc: 'Race day or long session support' },
  { day: 'SUN', focus: 'Week Review', desc: 'Fitness trajectory and what\'s next' },
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-28 sm:py-36 px-6 sm:px-10">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <p className="font-mono text-sm tracking-[5px] text-orange-500 mb-6">
            AI-POWERED COACHING
          </p>
          <h1 className="font-display text-6xl sm:text-8xl tracking-wider leading-[0.95] mb-8">
            YOUR DATA.<br />
            <span className="text-orange-500">YOUR COACH.</span><br />
            EVERY MORNING.
          </h1>
          <p className="text-white/80 text-xl sm:text-2xl max-w-2xl leading-relaxed mb-4">
            Not an app. Not a dashboard. A coaching relationship.
          </p>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed mb-10">
            An AI that reads your biometrics overnight, remembers every conversation you&apos;ve had,
            knows your race calendar, understands your medical conditions, and delivers a
            personalized briefing waiting for you when you wake up. Then listens to your response
            and adapts tomorrow.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="font-mono text-xs tracking-wider text-white/70 border border-white/25 rounded-full px-4 py-1.5">WHOOP INTEGRATION</span>
            <span className="font-mono text-xs tracking-wider text-white/70 border border-white/25 rounded-full px-4 py-1.5">CONDITION-AWARE</span>
            <span className="font-mono text-xs tracking-wider text-white/70 border border-white/25 rounded-full px-4 py-1.5">CONTINUOUS MEMORY</span>
            <span className="font-mono text-xs tracking-wider text-white/70 border border-white/25 rounded-full px-4 py-1.5">RACE CALENDAR SYNCED</span>
          </div>
        </div>
      </section>

      {/* ═══ THE LOOP — How it actually works ═══ */}
      <section className="py-24 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-4 text-center">
            THE DAILY LOOP
          </h2>
          <p className="text-white/60 text-base sm:text-lg text-center mb-20 max-w-xl mx-auto">
            This isn&apos;t a one-way broadcast. It&apos;s a continuous coaching conversation
            that gets smarter every day.
          </p>

          <div className="space-y-0 relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-orange-500/30 via-orange-500/15 to-orange-500/30" />

            {LOOP_STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-8 relative">
                {/* Number circle */}
                <div className="shrink-0 w-12 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/5 flex items-center justify-center z-10">
                    <span className="font-display text-lg text-orange-500">{step.num}</span>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 pb-14 ${i === LOOP_STEPS.length - 1 ? 'pb-0' : ''}`}>
                  <p className="font-mono text-xs tracking-[4px] text-orange-500/80 mb-2">{step.time}</p>
                  <h3 className="font-display text-2xl sm:text-3xl tracking-wider mb-3">{step.title}</h3>
                  <p className="text-base text-white/70 leading-relaxed mb-4">{step.desc}</p>
                  <div className="bg-white/[0.03] border border-white/8 rounded-lg px-5 py-4">
                    <p className="text-sm text-white/55 leading-relaxed italic">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOU WAKE UP TO — Email Preview ═══ */}
      <section className="py-24 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-4 text-center">
            WHAT YOU WAKE UP TO
          </h2>
          <p className="text-white/60 text-base sm:text-lg text-center mb-16 max-w-xl mx-auto">
            Every morning, a complete coaching briefing — charts, numbers, baselines,
            and a training call — personalized to you and waiting in your inbox.
          </p>

          {/* Email-style preview container */}
          <div className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden max-w-3xl mx-auto">

            {/* Race Countdown */}
            <div className="px-8 pt-8 pb-6">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">RACE COUNTDOWN</p>
              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-5 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl tracking-wider">YOUR NEXT RACE</p>
                    <p className="font-mono text-sm text-white/50 mt-1">Sprint (500m swim / 18.7km bike / 5km run)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-4xl text-orange-500">47</p>
                    <p className="font-mono text-xs text-white/40">DAYS</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0e0e0e] border border-orange-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-orange-500">★</span>
                  <span className="font-mono text-sm text-white/70">NATIONALS — MILWAUKEE</span>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl text-orange-500">110D</span>
                </div>
              </div>
              <p className="font-mono text-xs text-orange-500 mt-2 ml-1">BUILD</p>
            </div>

            {/* Key Numbers */}
            <div className="px-8 pb-6">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">KEY NUMBERS</p>
              <div className="grid grid-cols-3 gap-3">
                {DEMO_KEY_NUMBERS.map(n => (
                  <div key={n.label} className="bg-[#0e0e0e] border border-white/10 rounded-xl p-4 text-center">
                    <p className="font-display text-xl sm:text-2xl">
                      {n.value} <span className={`text-lg ${n.trendColor}`}>{n.trend}</span>
                    </p>
                    <p className="font-mono text-xs text-white/60 mt-1">{n.label}</p>
                    <p className="font-mono text-[11px] text-white/35 mt-0.5">{n.baseline}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Days Since */}
            <div className="px-8 pb-6">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">LAST SESSION</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { sport: 'SWIM', days: 2, icon: '🏊' },
                  { sport: 'BIKE', days: 1, icon: '🚴' },
                  { sport: 'RUN', days: 4, icon: '🏃' },
                ].map(d => (
                  <div key={d.sport} className="bg-[#0e0e0e] border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-lg mb-1">{d.icon}</p>
                    <p className="font-display text-3xl">{d.days}D</p>
                    <p className="font-mono text-xs text-white/50 mt-1">{d.sport}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Balance Doughnut */}
            <div className="px-8 pb-6">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">14-DAY TRAINING BALANCE</p>
              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6 flex items-center justify-center gap-8">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={DEMO_BALANCE} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="minutes" stroke="none" paddingAngle={2} label={({ value }) => `${value}`} >
                      {DEMO_BALANCE.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {DEMO_BALANCE.map(d => (
                    <div key={d.sport} className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="font-mono text-sm text-white/70 capitalize">{d.sport.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Race Readiness Gauge */}
            <div className="px-8 pb-6">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">RACE READINESS</p>
              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6 text-center">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="8"
                      strokeDasharray={`${59 * 2.51} ${100 * 2.51}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-display text-3xl text-orange-500">59%</p>
                    <p className="font-mono text-[10px] text-white/40 mt-0.5">Your Next Race</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {[
                    { label: 'RECOVERY', value: '52%', sub: '7-day avg' },
                    { label: 'CONSISTENCY', value: '80%', sub: 'workouts/week' },
                    { label: 'BALANCE', value: '41%', sub: 'swim/bike/run' },
                  ].map(m => (
                    <div key={m.label}>
                      <p className="font-display text-xl text-orange-500">{m.value}</p>
                      <p className="font-mono text-[10px] tracking-wider text-white/60">{m.label}</p>
                      <p className="font-mono text-[10px] text-white/30">{m.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4-Week Training Load */}
            <div className="px-8 pb-6">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">4-WEEK TRAINING LOAD</p>
              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DEMO_LOAD} margin={{ top: 20, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} tickLine={false} axisLine={false} label={{ value: 'TOTAL STRAIN', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: 'rgba(255,255,255,0.3)' } }} />
                    <Bar dataKey="strain" fill="rgba(249,115,22,0.7)" radius={[4, 4, 0, 0]} barSize={40} label={{ position: 'top', fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-white/40 mt-3">Total cardiovascular strain per week. Rising weeks = volume building. Strain is HR-based — doesn&apos;t capture power/pace intensity.</p>
              </div>
            </div>

            {/* HR Zones */}
            <div className="px-8 pb-6">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">HEART RATE ZONES (14-DAY)</p>
              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={DEMO_ZONES.map((z, i) => ({ ...z, fill: ZONE_COLORS[i] }))} margin={{ top: 20, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="zone" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} tickLine={false} axisLine={false} label={{ value: 'MINUTES', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: 'rgba(255,255,255,0.3)' } }} />
                    <Bar dataKey="minutes" radius={[4, 4, 0, 0]} barSize={40} label={{ position: 'top', fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                      {DEMO_ZONES.map((_, i) => (
                        <Cell key={i} fill={ZONE_COLORS[i]} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-white/40 mt-3">Total training minutes per HR zone. Z1-2 = aerobic base. Z3 = tempo. Z4-5 = threshold/max effort. More Z2 time = better endurance foundation.</p>
              </div>
            </div>

            {/* Recovery + Load Ratio — bars with trend line like the real email */}
            <div className="px-8 pb-6">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">RECOVERY + LOAD RATIO</p>
              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-3 bg-white/20 rounded-sm" />
                    <span className="font-mono text-[10px] text-white/50">Daily Ratio</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-0.5 bg-orange-500 rounded" />
                    <span className="font-mono text-[10px] text-white/50">7-Day Trend</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={ratioData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <ReferenceArea y1={2.5} y2={4} fill="rgba(34,197,94,0.08)" />
                    <ReferenceArea y1={1.0} y2={2.5} fill="rgba(234,179,8,0.04)" />
                    <ReferenceArea y1={0} y2={1.0} fill="rgba(239,68,68,0.08)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(d: string) => d.slice(5)} interval={3} />
                    <YAxis domain={[0, 4.5]} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} tickLine={false} axisLine={false} ticks={[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]} label={{ value: 'RECOVERY / LOAD', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: 'rgba(255,255,255,0.3)' } }} />
                    <ReferenceLine y={2.5} stroke="rgba(34,197,94,0.5)" strokeDasharray="6 3" />
                    <ReferenceLine y={1.0} stroke="rgba(239,68,68,0.5)" strokeDasharray="6 3" />
                    <Bar dataKey="ratio" fill="rgba(255,255,255,0.15)" barSize={10} radius={[2, 2, 0, 0]} />
                    <Line type="monotone" dataKey="movingAvg" stroke="#f97316" strokeWidth={2.5} dot={false} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-xs text-white/40 mt-3">Above green line (2.5) = strong adaptation. Between lines = normal training range. Below red line (1.0) = overreaching, back off. Orange = 7-day trend.</p>
              </div>
            </div>

            {/* 28-Day Activity — stacked bars, multiple sports per day */}
            <div className="px-8 pb-8">
              <p className="font-mono text-xs tracking-[3px] text-white/50 mb-4">28-DAY ACTIVITY</p>
              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-6">
                {/* Sport legend */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {ACTIVITY_SPORTS.map(sport => (
                    <div key={sport} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SPORT_COLORS[sport] || '#6b7280' }} />
                      <span className="font-mono text-[10px] text-white/50 capitalize">{sport.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={DEMO_ACTIVITY} margin={{ top: 5, right: 0, bottom: 0, left: -10 }} stackOffset="none">
                    <XAxis dataKey="date" tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)' }} interval={2} />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} axisLine={false} />
                    {ACTIVITY_SPORTS.map(sport => (
                      <Bar key={sport} dataKey={sport} stackId="a" fill={SPORT_COLORS[sport] || '#6b7280'} fillOpacity={0.85} barSize={14} radius={[1, 1, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-white/40 mt-3">Each bar = one day. Bar height = workout strain. Color = sport type. Stacked segments = multiple workouts. Gaps = rest days.</p>
              </div>
            </div>

            {/* Sample data disclaimer */}
            <div className="border-t border-white/5 px-8 py-4">
              <p className="text-xs font-mono text-white/30 text-center">
                SAMPLE DATA — NOT REAL ATHLETE METRICS • CHARTS CUSTOM PER USER
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY THIS IS DIFFERENT — side-by-side ═══ */}
      <section className="py-24 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-4 text-center">
            YOUR APP VS. YOUR COACH
          </h2>
          <p className="text-white/60 text-base sm:text-lg text-center mb-16 max-w-xl mx-auto">
            Your biometric app gives you data. This gives you a coaching relationship that
            learns, remembers, and adapts — every single day.
          </p>

          <div className="space-y-4">
            {GENERIC_VS.map((row, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                <div className="bg-white/[0.02] border border-white/8 sm:rounded-l-xl sm:rounded-r-none rounded-t-xl sm:rounded-t-none sm:rounded-tl-xl px-6 py-5 flex items-start gap-4">
                  <span className="font-mono text-xs text-red-400/90 mt-0.5 shrink-0">GENERIC</span>
                  <p className="text-sm text-white/60 leading-relaxed">{row.generic}</p>
                </div>
                <div className="bg-orange-500/[0.08] border border-orange-500/30 sm:rounded-r-xl sm:rounded-l-none rounded-b-xl sm:rounded-b-none sm:rounded-br-xl px-6 py-5 flex items-start gap-4">
                  <span className="font-mono text-xs text-orange-500 mt-0.5 shrink-0">COACH</span>
                  <p className="text-sm text-white/75 leading-relaxed">{row.coach}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WEEKLY INTELLIGENCE — focus rotation ═══ */}
      <section className="py-24 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-4 text-center">
            EVERY ANGLE. EVERY WEEK.
          </h2>
          <p className="text-white/60 text-base sm:text-lg text-center mb-16 max-w-xl mx-auto">
            The coach rotates its focus daily — strategy, response, balance, intelligence, prep,
            execution, review. Nothing falls through the cracks.
          </p>

          <div className="grid grid-cols-7 gap-3">
            {WEEKLY_FOCUS.map(d => (
              <div key={d.day} className="bg-white/[0.03] border border-white/8 rounded-xl px-3 py-5 text-center">
                <p className="font-display text-lg text-orange-500 mb-2">{d.day}</p>
                <p className="font-mono text-xs tracking-wider text-white/80 mb-1.5 leading-tight">{d.focus}</p>
                <p className="text-xs text-white/50 leading-tight hidden sm:block">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONDITION-AWARE ═══ */}
      <section className="py-24 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-4 text-center">
            YOUR CONDITION. UNDERSTOOD.
          </h2>
          <p className="text-white/60 text-base sm:text-lg text-center mb-16 max-w-xl mx-auto">
            Generic apps ignore what makes your body different. This one starts there.
            Whatever affects your training — the coach knows, adapts, and never forgets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONDITIONS.map(c => (
              <div key={c.label} className="flex gap-4 items-start bg-white/[0.03] border border-white/8 rounded-xl px-6 py-5">
                <span className="text-2xl shrink-0">{c.icon}</span>
                <div>
                  <p className="font-mono text-sm tracking-wider text-white/80 mb-1.5">{c.label}</p>
                  <p className="text-sm text-white/55 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COACHING VOICE ═══ */}
      <section className="py-24 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-4 text-center">
            YOUR COACHING VOICE
          </h2>
          <p className="text-white/60 text-base sm:text-lg text-center mb-16 max-w-xl mx-auto">
            The same data, delivered in the voice that actually moves you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {COACHING_STYLES.map(s => (
              <div key={s.name} className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/8 rounded-xl p-7 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono text-sm tracking-wider text-white/90">{s.name}</h3>
                  <span className="font-mono text-xs tracking-wider text-orange-500 border border-orange-500/25 rounded-full px-3 py-1">
                    {s.tag}
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-4">{s.desc}</p>
                <div className="bg-black/50 border border-white/8 rounded-lg px-4 py-3">
                  <p className="text-sm text-orange-500/80 italic leading-relaxed">{s.sample}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE ONE SURPRISING THING ═══ */}
      <section className="py-24 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-6">
            ONE SURPRISING THING
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-12">
            Every briefing surfaces one non-obvious pattern — a correlation your app will never
            show you. A confirmed prediction. A trend break. Something that makes you say
            &ldquo;I didn&apos;t know that about my body.&rdquo;
          </p>

          <div className="space-y-4 text-left max-w-2xl mx-auto">
            {[
              '"Your HRV has been 15% above baseline every Monday for the last month. Your weekend recovery protocol is working — don\'t change it."',
              '"Three of your last four red recovery days came after evening strength sessions. Morning lifts recover faster for your body."',
              '"You\'ve averaged 6.2 days between swims for 3 weeks. At race pace, that gap costs you 30-45 seconds in transition confidence."',
            ].map((insight, i) => (
              <div key={i} className="bg-orange-500/[0.08] border border-orange-500/30 rounded-xl px-6 py-5">
                <p className="text-sm text-white/70 italic leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RACE DAY MODE ═══ */}
      <section className="py-24 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-6">
            RACE DAY MODE
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            On race morning, the coaching voice shifts. No analysis. No suggestions.
            A pre-scripted execution command built around your training, your race plan,
            and the conditions on the ground.
          </p>

          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-xl p-10 text-left max-w-2xl mx-auto">
            <p className="font-mono text-xs tracking-[4px] text-orange-500 mb-6">RACE DAY BRIEFING</p>
            <div className="space-y-4 text-lg text-white/60 leading-relaxed font-mono">
              <p className="text-white/90">This is not a discussion. This is what we do.</p>
              <p>You trained for this. You suffered for this. This is the payoff.</p>
              <p>You do not control conditions. You control effort.</p>
              <p>You do not negotiate with pain. Pain is expected.</p>
              <p className="text-orange-500">You finish what you start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-28 px-6 sm:px-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl sm:text-7xl tracking-widest mb-8">
            COACHING THAT<br />
            <span className="text-orange-500">KNOWS YOU.</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-10 max-w-lg mx-auto">
            Whether you manage a medical condition, train for competition, or just want
            a coach that actually understands your body — this is built for you.
          </p>
          <a
            href="https://www.instagram.com/patwingit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-mono text-sm tracking-widest px-10 py-4 rounded-lg transition-colors"
          >
            GET EARLY ACCESS
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/8 py-10 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-sm text-white/50">
            Built by{' '}
            <a href="https://patrickwingert.com" className="text-white/70 hover:text-white transition-colors">
              patrickwingert.com
            </a>
          </p>
          <a
            href="https://www.dare2tri.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-white/50 hover:text-white/70 transition-colors"
          >
            Dare2Tri Foundation
          </a>
        </div>
      </footer>
    </div>
  );
}
