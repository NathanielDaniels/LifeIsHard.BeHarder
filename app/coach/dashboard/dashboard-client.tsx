'use client';

import { useState, useEffect } from 'react';

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

// Placeholder tabs — each will be replaced with real components in later tasks
function OverviewTab({ data }: { data: DashboardData }) {
  return <p className="text-white/40 font-mono text-sm">Overview — {data.snapshots.length} days of data</p>;
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
