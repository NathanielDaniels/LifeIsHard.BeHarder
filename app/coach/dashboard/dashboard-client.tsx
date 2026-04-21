'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  recoveryTrendData,
  daysSinceDisciplines,
  raceReadinessScore,
} from '@/lib/dashboard-data';
import ChartCard from './components/ChartCard';
import DaysSinceCards from './components/DaysSinceCards';
import RaceReadiness from './components/RaceReadiness';
import RecoveryChart from './components/RecoveryChart';

export interface DashboardData {
  snapshots: any[];
  workouts: any[];
  responses: any[];
  generatedAt: string;
}

type Tab = 'overview' | 'training' | 'recovery' | 'history';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'training', label: 'TRAINING' },
  { id: 'recovery', label: 'RECOVERY' },
  { id: 'history', label: 'COACH LOG' },
];

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    fetch('/api/coach/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-mono text-sm tracking-widest">LOADING DASHBOARD...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 font-mono text-sm">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/8 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl tracking-widest">COACH DASHBOARD</h1>
            <p className="text-white/40 font-mono text-xs tracking-wider mt-1">
              PATRICK WINGERT — DARE2TRI ELITE TEAM
            </p>
          </div>
          <p className="text-white/30 font-mono text-xs">
            {new Date(data.generatedAt).toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-white/8 px-6">
        <div className="max-w-7xl mx-auto flex gap-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-mono text-xs tracking-widest transition-colors ${
                activeTab === tab.id
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'training' && <TrainingTab data={data} />}
        {activeTab === 'recovery' && <RecoveryTab data={data} />}
        {activeTab === 'history' && <HistoryTab data={data} />}
      </main>
    </div>
  );
}

function OverviewTab({ data }: { data: DashboardData }) {
  const today = new Date().toISOString().split('T')[0];
  const daysSince = useMemo(() => daysSinceDisciplines(data.workouts, today), [data.workouts, today]);
  const readiness = useMemo(() => raceReadinessScore(data.snapshots, data.workouts), [data.snapshots, data.workouts]);
  const recoveryData = useMemo(() => recoveryTrendData(data.snapshots), [data.snapshots]);

  // Key numbers from latest snapshot
  const latest = data.snapshots[data.snapshots.length - 1];
  const stats = latest ? [
    { label: 'RECOVERY', value: latest.recovery_score != null ? `${latest.recovery_score}%` : '—', color: latest.recovery_score >= 67 ? 'text-emerald-400' : latest.recovery_score >= 34 ? 'text-yellow-400' : 'text-red-400' },
    { label: 'STRAIN', value: latest.strain != null ? latest.strain.toFixed(1) : '—', color: 'text-orange-400' },
    { label: 'HRV', value: latest.hrv != null ? `${Math.round(latest.hrv)}ms` : '—', color: 'text-violet-400' },
    { label: 'RHR', value: latest.resting_heart_rate != null ? `${latest.resting_heart_rate}bpm` : '—', color: 'text-blue-400' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Top row: Days Since + Race Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DaysSinceCards swim={daysSince.swim} bike={daysSince.bike} run={daysSince.run} />
        <RaceReadiness {...readiness} />
      </div>

      {/* Key numbers */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#0a0a0a] border border-white/8 rounded-lg p-4 text-center">
              <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
              <p className="font-mono text-[10px] tracking-[2px] text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recovery trend chart */}
      <ChartCard title="Recovery Trend" description="90-day recovery, HRV, and strain overlay">
        <RecoveryChart data={recoveryData} />
      </ChartCard>
    </div>
  );
}

function TrainingTab({ data }: { data: DashboardData }) {
  return <p className="text-white/40 font-mono text-sm">Training — {data.workouts.length} workouts</p>;
}

function RecoveryTab({ data }: { data: DashboardData }) {
  return <p className="text-white/40 font-mono text-sm">Recovery tab</p>;
}

function HistoryTab({ data }: { data: DashboardData }) {
  return <p className="text-white/40 font-mono text-sm">Coach log — {data.responses.length} responses</p>;
}
