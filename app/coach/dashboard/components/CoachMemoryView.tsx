'use client';

import { useState, useEffect } from 'react';

interface Briefing {
  date: string;
  briefing_markdown: string;
  model_used: string;
  generated_at: string;
}

export default function CoachMemoryView() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/coach/history')
      .then(res => res.json())
      .then(data => setBriefings(data.briefings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="font-mono text-xs text-white/30 tracking-widest">LOADING HISTORY...</p>
      </div>
    );
  }

  if (briefings.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="font-mono text-xs text-white/30">No coaching briefings recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        <p className="font-mono text-[10px] tracking-[2px] text-white/40">
          {briefings.length} BRIEFINGS IN MEMORY
        </p>
      </div>

      {briefings.map(b => {
        const isExpanded = expandedDate === b.date;
        // Extract first meaningful line as preview
        const preview = b.briefing_markdown
          .split('\n')
          .find(line => line.trim() && !line.startsWith('#') && !line.startsWith('---'))
          ?.slice(0, 120) || 'Briefing generated';

        return (
          <button
            key={b.date}
            onClick={() => setExpandedDate(isExpanded ? null : b.date)}
            className="w-full text-left bg-white/[0.02] hover:bg-white/[0.04] rounded-lg px-4 py-3 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-white/60">{b.date}</span>
              <span className="font-mono text-[9px] text-white/20">{b.model_used}</span>
            </div>

            {isExpanded ? (
              <div className="text-xs text-white/40 leading-relaxed mt-2 whitespace-pre-wrap max-h-96 overflow-y-auto">
                {b.briefing_markdown}
              </div>
            ) : (
              <p className="text-xs text-white/30 truncate">{preview}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
