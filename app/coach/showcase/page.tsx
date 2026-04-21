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
  { label: 'Week 1', strain: 62.4 },
  { label: 'Week 2', strain: 71.8 },
  { label: 'Week 3', strain: 78.2 },
  { label: 'Week 4', strain: 55.1 },
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
          <p className="text-white/65 text-lg max-w-2xl leading-relaxed mb-4">
            Not an app. Not a dashboard. A coaching relationship.
          </p>
          <p className="text-white/70 text-sm max-w-2xl leading-relaxed mb-8">
            An AI that reads your biometrics overnight, remembers every conversation you&apos;ve had,
            knows your race calendar, understands your medical conditions, and delivers a
            personalized briefing waiting for you when you wake up. Then listens to your response
            and adapts tomorrow.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="font-mono text-[10px] tracking-wider text-white/65 border border-white/20 rounded-full px-3 py-1">WHOOP INTEGRATION</span>
            <span className="font-mono text-[10px] tracking-wider text-white/65 border border-white/20 rounded-full px-3 py-1">CONDITION-AWARE</span>
            <span className="font-mono text-[10px] tracking-wider text-white/65 border border-white/20 rounded-full px-3 py-1">CONTINUOUS MEMORY</span>
            <span className="font-mono text-[10px] tracking-wider text-white/65 border border-white/20 rounded-full px-3 py-1">RACE CALENDAR SYNCED</span>
          </div>
        </div>
      </section>

      {/* ═══ THE LOOP — How it actually works ═══ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            THE DAILY LOOP
          </h2>
          <p className="text-white/70 text-sm text-center mb-16 max-w-lg mx-auto">
            This isn&apos;t a one-way broadcast. It&apos;s a continuous coaching conversation
            that gets smarter every day.
          </p>

          <div className="space-y-0 relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-px bg-gradient-to-b from-orange-500/30 via-orange-500/15 to-orange-500/30" />

            {LOOP_STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-6 relative">
                {/* Number circle */}
                <div className="shrink-0 w-10 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-orange-500/30 bg-orange-500/5 flex items-center justify-center z-10">
                    <span className="font-display text-sm text-orange-500/70">{step.num}</span>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 pb-10 ${i === LOOP_STEPS.length - 1 ? 'pb-0' : ''}`}>
                  <p className="font-mono text-[9px] tracking-[3px] text-orange-500/70 mb-1">{step.time}</p>
                  <h3 className="font-display text-xl tracking-wider mb-2">{step.title}</h3>
                  <p className="text-sm text-white/75 leading-relaxed mb-3">{step.desc}</p>
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3">
                    <p className="text-xs text-white/65 leading-relaxed italic">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT THE COACH SEES — Charts ═══ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            9 CHARTS. EVERY EMAIL.
          </h2>
          <p className="text-white/70 text-sm text-center mb-12 max-w-lg mx-auto">
            Your morning briefing includes visual analysis — not just numbers, but patterns,
            trends, and context that turn raw biometrics into actionable intelligence.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recovery Trend */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/70 mb-1">RECOVERY TREND</h3>
              <p className="text-[10px] text-white/75 mb-4">Zone-coded recovery scores with daily strain overlay</p>
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
              <h3 className="font-mono text-xs tracking-[3px] text-white/70 mb-1">RECOVERY-TO-LOAD RATIO</h3>
              <p className="text-[10px] text-white/75 mb-4">Are you recovering as hard as you&apos;re training?</p>
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
              <h3 className="font-mono text-xs tracking-[3px] text-white/70 mb-1">TRAINING LOAD</h3>
              <p className="text-[10px] text-white/75 mb-4">Weekly strain periodization</p>
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
              <h3 className="font-mono text-xs tracking-[3px] text-white/70 mb-1">HR ZONES</h3>
              <p className="text-[10px] text-white/75 mb-4">Time in each training zone</p>
              <div className="space-y-2 mt-2">
                {DEMO_ZONES.map((z, i) => {
                  const total = DEMO_ZONES.reduce((s, d) => s + d.minutes, 0);
                  const pct = Math.round((z.minutes / total) * 100);
                  return (
                    <div key={z.zone} className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-white/70 w-5">{z.zone}</span>
                      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ZONE_COLORS[i], opacity: 0.7 }} />
                      </div>
                      <span className="font-mono text-[9px] text-white/70 w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Discipline Balance */}
            <div className="bg-[#0a0a0a] border border-white/8 rounded-lg p-6">
              <h3 className="font-mono text-xs tracking-[3px] text-white/70 mb-1">SPORT BALANCE</h3>
              <p className="text-[10px] text-white/75 mb-4">Time across disciplines</p>
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
                      <span className="font-mono text-[9px] text-white/75 capitalize">{d.sport.replace('-', ' ')}</span>
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

      {/* ═══ WHY THIS IS DIFFERENT — side-by-side ═══ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            YOUR APP VS. YOUR COACH
          </h2>
          <p className="text-white/70 text-sm text-center mb-12 max-w-lg mx-auto">
            Your biometric app gives you data. This gives you a coaching relationship that
            learns, remembers, and adapts — every single day.
          </p>

          <div className="space-y-3">
            {GENERIC_VS.map((row, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-0">
                <div className="bg-white/[0.02] border border-white/5 sm:rounded-l-lg sm:rounded-r-none rounded-t-lg sm:rounded-t-none sm:rounded-tl-lg px-5 py-4 flex items-start gap-3">
                  <span className="font-mono text-[9px] text-red-400/80 mt-0.5 shrink-0">GENERIC</span>
                  <p className="text-xs text-white/65 leading-relaxed">{row.generic}</p>
                </div>
                <div className="bg-orange-500/[0.03] border border-orange-500/10 sm:rounded-r-lg sm:rounded-l-none rounded-b-lg sm:rounded-b-none sm:rounded-br-lg px-5 py-4 flex items-start gap-3">
                  <span className="font-mono text-[9px] text-orange-500/80 mt-0.5 shrink-0">COACH</span>
                  <p className="text-xs text-white/65 leading-relaxed">{row.coach}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WEEKLY INTELLIGENCE — focus rotation ═══ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            EVERY ANGLE. EVERY WEEK.
          </h2>
          <p className="text-white/70 text-sm text-center mb-12 max-w-lg mx-auto">
            The coach rotates its focus daily — strategy, response, balance, intelligence, prep,
            execution, review. Nothing falls through the cracks.
          </p>

          <div className="grid grid-cols-7 gap-2">
            {WEEKLY_FOCUS.map(d => (
              <div key={d.day} className="bg-white/[0.02] border border-white/5 rounded-lg px-3 py-4 text-center">
                <p className="font-display text-sm text-orange-500/80 mb-2">{d.day}</p>
                <p className="font-mono text-[9px] tracking-wider text-white/75 mb-1 leading-tight">{d.focus}</p>
                <p className="text-[9px] text-white/75 leading-tight hidden sm:block">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONDITION-AWARE ═══ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            YOUR CONDITION. UNDERSTOOD.
          </h2>
          <p className="text-white/70 text-sm text-center mb-12 max-w-lg mx-auto">
            Generic apps ignore what makes your body different. This one starts there.
            Whatever affects your training — the coach knows, adapts, and never forgets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONDITIONS.map(c => (
              <div key={c.label} className="flex gap-3 items-start bg-white/[0.02] rounded-lg px-4 py-4">
                <span className="text-xl shrink-0">{c.icon}</span>
                <div>
                  <p className="font-mono text-xs tracking-wider text-white/75 mb-1">{c.label}</p>
                  <p className="text-[11px] text-white/65 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COACHING VOICE ═══ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl tracking-widest mb-3 text-center">
            YOUR COACHING VOICE
          </h2>
          <p className="text-white/70 text-sm text-center mb-12 max-w-lg mx-auto">
            The same data, delivered in the voice that actually moves you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COACHING_STYLES.map(s => (
              <div key={s.name} className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-lg p-5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono text-xs tracking-wider text-white/70">{s.name}</h3>
                  <span className="font-mono text-[9px] tracking-wider text-orange-500/70 border border-orange-500/15 rounded-full px-2 py-0.5">
                    {s.tag}
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed mb-3">{s.desc}</p>
                <div className="bg-black/40 border border-white/5 rounded px-3 py-2">
                  <p className="text-[11px] text-orange-500/70 italic leading-relaxed">{s.sample}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE ONE SURPRISING THING ═══ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl tracking-widest mb-6">
            ONE SURPRISING THING
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xl mx-auto mb-10">
            Every briefing surfaces one non-obvious pattern — a correlation your app will never
            show you. A confirmed prediction. A trend break. Something that makes you say
            &ldquo;I didn&apos;t know that about my body.&rdquo;
          </p>

          <div className="space-y-3 text-left max-w-lg mx-auto">
            {[
              '"Your HRV has been 15% above baseline every Monday for the last month. Your weekend recovery protocol is working — don\'t change it."',
              '"Three of your last four red recovery days came after evening strength sessions. Morning lifts recover faster for your body."',
              '"You\'ve averaged 6.2 days between swims for 3 weeks. At race pace, that gap costs you 30-45 seconds in transition confidence."',
            ].map((insight, i) => (
              <div key={i} className="bg-orange-500/[0.03] border border-orange-500/8 rounded-lg px-5 py-4">
                <p className="text-xs text-white/40 italic leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RACE DAY MODE ═══ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl tracking-widest mb-6">
            RACE DAY MODE
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xl mx-auto mb-8">
            On race morning, the coaching voice shifts. No analysis. No suggestions.
            A pre-scripted execution command built around your training, your race plan,
            and the conditions on the ground.
          </p>

          <div className="bg-[#0a0a0a] border border-orange-500/15 rounded-lg p-8 text-left max-w-lg mx-auto">
            <p className="font-mono text-[9px] tracking-[3px] text-orange-500/70 mb-4">RACE DAY BRIEFING</p>
            <div className="space-y-3 text-sm text-white/65 leading-relaxed font-mono">
              <p className="text-white/70">This is not a discussion. This is what we do.</p>
              <p>You trained for this. You suffered for this. This is the payoff.</p>
              <p>You do not control conditions. You control effort.</p>
              <p>You do not negotiate with pain. Pain is expected.</p>
              <p className="text-orange-500/80">You finish what you start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl tracking-widest mb-6">
            COACHING THAT<br />
            <span className="text-orange-500">KNOWS YOU.</span>
          </h2>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            Whether you manage a medical condition, train for competition, or just want
            a coach that actually understands your body — this is built for you.
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

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/40">
            Built by{' '}
            <a href="https://patrickwingert.com" className="text-white/40 hover:text-white/75 transition-colors">
              patrickwingert.com
            </a>
          </p>
          <a
            href="https://www.dare2tri.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-white/40 hover:text-white/40 transition-colors"
          >
            Dare2Tri Foundation
          </a>
        </div>
      </footer>
    </div>
  );
}
