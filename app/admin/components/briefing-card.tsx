'use client';

import { useState, useEffect } from 'react';

interface BriefingData {
  available: boolean;
  date?: string;
  briefing_markdown?: string;
  model_used?: string;
  snapshot_count?: number;
  generated_at?: string;
  message?: string;
}

export default function BriefingCard() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [backfillLoading, setBackfillLoading] = useState(false);
  const [backfillResult, setBackfillResult] = useState<string | null>(null);

  useEffect(() => {
    fetchBriefing();
  }, []);

  async function fetchBriefing() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/briefing');
      if (res.ok) {
        const data = await res.json();
        setBriefing(data);
      }
    } catch (err) {
      console.error('Failed to fetch briefing:', err);
    } finally {
      setLoading(false);
    }
  }

  async function runBackfill() {
    setBackfillLoading(true);
    setBackfillResult(null);
    try {
      const res = await fetch('/api/admin/backfill', { method: 'POST' });
      if (!res.ok) {
        setBackfillResult(`Error: Server returned ${res.status}`);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setBackfillResult(`Imported ${data.inserted} days of data`);
        await fetchBriefing();
      } else {
        setBackfillResult(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Backfill failed:', err);
      setBackfillResult('Network error');
    } finally {
      setBackfillLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-white/5 rounded w-48" />
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${
            briefing?.available ? 'bg-blue-500 animate-pulse' : 'bg-white/30'
          }`} />
          <h2 className="font-display text-xl tracking-wider text-white/90">
            AI INTELLIGENCE
          </h2>
        </div>
        {briefing?.available && briefing.date && (
          <span className="font-mono text-[10px] tracking-widest text-white/25 uppercase">
            {briefing.date}
          </span>
        )}
      </div>

      {/* Briefing Content */}
      {briefing?.available && briefing.briefing_markdown ? (
        <>
          <div className="space-y-3 font-mono text-xs leading-relaxed text-white/60">
            {renderMarkdown(briefing.briefing_markdown)}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-white/20">
                {briefing.snapshot_count ?? 0} days analyzed
              </span>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                (briefing.snapshot_count ?? 0) >= 30
                  ? 'bg-green-500/10 text-green-400/50'
                  : (briefing.snapshot_count ?? 0) >= 10
                    ? 'bg-yellow-500/10 text-yellow-400/50'
                    : 'bg-white/5 text-white/30'
              }`}>
                {(briefing.snapshot_count ?? 0) >= 30
                  ? 'FULL ANALYSIS'
                  : (briefing.snapshot_count ?? 0) >= 10
                    ? 'EMERGING'
                    : 'BUILDING BASELINE'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/20">
              {briefing.generated_at
                ? timeAgo(briefing.generated_at)
                : ''}
            </span>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="font-mono text-xs text-white/40">
            {briefing?.message || 'No briefing available yet.'}
          </p>
          <button
            onClick={runBackfill}
            disabled={backfillLoading}
            className="px-4 py-2 bg-blue-500/15 border border-blue-500/25 rounded-lg font-mono text-xs tracking-wider text-blue-400 hover:bg-blue-500/25 transition-colors disabled:opacity-40"
          >
            {backfillLoading ? 'Importing...' : 'Import 90 Days & Generate Briefing'}
          </button>
          {backfillResult && (
            <p className="font-mono text-xs text-white/40">{backfillResult}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// Render markdown as React elements (no innerHTML)
// ============================================

function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1">
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={key++} className="font-display text-base tracking-wider text-white/90 mt-4 mb-1">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={key++} className="font-display text-lg tracking-wider text-white/90 mt-4 mb-1">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    }
    // List items
    else if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.slice(2));
    }
    // Regular paragraph
    else {
      flushList();
      elements.push(
        <p key={key++}>{renderInline(trimmed)}</p>
      );
    }
  }

  flushList();
  return elements;
}

function renderInline(text: string): React.ReactNode {
  // Split on **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white/80">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
