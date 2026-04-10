// ============================================
// AI Daily Briefing Generator
//
// Takes available WHOOP snapshots (starts ~25 days from API,
// grows to 90 days as daily cron collects more) and generates
// an intelligent health analysis using Claude.
//
// The prompt adapts based on data depth:
//   <10 days  — baseline assessment, no trend claims
//   10-30 days — short-term trends, emerging patterns
//   30+ days  — full analysis with personal baselines
//
// Table: daily_briefings
//   date               DATE UNIQUE
//   briefing_markdown   TEXT
//   model_used          TEXT
//   snapshot_count       INTEGER
//   generated_at        TIMESTAMPTZ
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import { supabase } from './supabase';
import type { DailySnapshot, DailyBriefing } from '@/types/whoop';

const TABLE = 'daily_briefings';
const MODEL = 'claude-haiku-4-5-20251001';

// ============================================
// Data depth tiers — controls prompt behavior
// ============================================

type DataTier = 'bootstrap' | 'emerging' | 'established';

function getDataTier(days: number): DataTier {
  if (days < 10) return 'bootstrap';
  if (days < 30) return 'emerging';
  return 'established';
}

function buildDataContext(snapshots: DailySnapshot[]): string {
  const tier = getDataTier(snapshots.length);
  const days = snapshots.length;

  // Compute personal baselines from available data
  const withRecovery = snapshots.filter((s) => s.recovery_score != null);
  const withHRV = snapshots.filter((s) => s.hrv != null);
  const withStrain = snapshots.filter((s) => s.strain != null);
  const withRHR = snapshots.filter((s) => s.resting_heart_rate != null);

  const avg = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : null;

  const avgRecovery = avg(withRecovery.map((s) => s.recovery_score!));
  const avgHRV = avg(withHRV.map((s) => s.hrv!));
  const avgStrain = avg(withStrain.map((s) => s.strain!));
  const avgRHR = avg(withRHR.map((s) => s.resting_heart_rate!));

  const workoutDays = snapshots.filter((s) => s.workout_sport != null).length;
  const workoutFreq = days > 0 ? (workoutDays / days * 7).toFixed(1) : '0';

  let context = `## Data Depth: ${days} days`;

  if (tier === 'bootstrap') {
    context += ` (EARLY — building baseline, avoid strong trend claims)`;
  } else if (tier === 'emerging') {
    context += ` (SHORT-TERM — trends are directional, not yet definitive)`;
  } else {
    context += ` (ESTABLISHED — reliable baselines and trend analysis)`;
  }

  context += `\n\n## Personal Baselines (from ${days} days)`;
  context += `\n- Avg Recovery: ${avgRecovery?.toFixed(0) ?? 'N/A'}`;
  context += `\n- Avg HRV: ${avgHRV?.toFixed(1) ?? 'N/A'} ms`;
  context += `\n- Avg RHR: ${avgRHR?.toFixed(0) ?? 'N/A'} bpm`;
  context += `\n- Avg Strain: ${avgStrain?.toFixed(1) ?? 'N/A'}`;
  context += `\n- Workout Frequency: ${workoutFreq} days/week`;

  return context;
}

function buildTierInstructions(tier: DataTier): string {
  switch (tier) {
    case 'bootstrap':
      return `## Analysis Depth: EARLY DATA (< 10 days)
You have limited history. Focus on:
- Today's metrics and what they mean in isolation
- Any obvious day-over-day changes
- DO NOT claim trends or patterns — you don't have enough data yet
- Instead of "Trends", use "### Recent Days" and describe only what you see
- Note that baselines are preliminary and will stabilize with more data
- Be honest about data limitations. "Too early to identify trends" is a valid insight`;

    case 'emerging':
      return `## Analysis Depth: EMERGING DATA (10-30 days)
You have enough data for short-term analysis. Focus on:
- Compare today to the personal baselines (which are becoming meaningful)
- Look for week-over-week directional changes
- Flag any metrics consistently above or below the emerging baseline
- Use cautious language for trends: "appears to be trending" not "has been trending"
- You can start identifying workout patterns and recovery responses`;

    case 'established':
      return `## Analysis Depth: ESTABLISHED DATA (30+ days)
You have a solid baseline. Full analysis available:
- Compare today to reliable personal baselines
- Identify multi-week trends with confidence
- Flag metrics hitting personal highs or lows
- Analyze strain-recovery balance over time
- Identify training load patterns and periodization
- Look for correlations between high-strain days and recovery responses`;
  }
}

// ============================================
// Generate briefing from snapshots
// ============================================

export async function generateBriefing(
  snapshots: DailySnapshot[],
): Promise<string> {
  if (snapshots.length === 0) {
    return '## No Data Available\n\nNo WHOOP data has been collected yet. Check back after the first day of data collection.';
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const today = snapshots[snapshots.length - 1];
  const tier = getDataTier(snapshots.length);
  const dataContext = buildDataContext(snapshots);
  const tierInstructions = buildTierInstructions(tier);
  const snapshotCSV = formatSnapshotsForPrompt(snapshots);

  const trendSectionHeader = tier === 'bootstrap'
    ? `### Recent Days\nDescribe only what you observe in the last few days. Do not extrapolate trends from limited data.`
    : `### Trends (7-Day)\n- HRV trend (rising/falling/stable) with context\n- Recovery trend with context\n- Strain load assessment`;

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `You are a sports science analyst reviewing WHOOP biometric data for an adaptive-triathlon athlete (below-knee amputee). Generate a daily health intelligence briefing.

## Athlete Context
- Para-triathlete training for USA Para Triathlon National Championships (August 2026)
- Below-knee amputee — prosthetic leg affects strain/recovery differently
- Training across swim, bike, run disciplines

## Today's Date
${today.date}

## Today's Metrics
- Recovery: ${today.recovery_score ?? 'N/A'}
- HRV: ${today.hrv ? today.hrv.toFixed(1) + ' ms' : 'N/A'}
- RHR: ${today.resting_heart_rate ?? 'N/A'} bpm
- SpO2: ${today.spo2 ? today.spo2.toFixed(1) + '%' : 'N/A'}
- Strain: ${today.strain ? today.strain.toFixed(1) : 'N/A'}
- Calories: ${today.calories ?? 'N/A'}
${today.workout_sport ? `- Last Workout: ${today.workout_sport} (${today.workout_duration_minutes}min, strain ${today.workout_strain?.toFixed(1)})` : '- No workout logged today'}

${dataContext}

${tierInstructions}

## Historical Data (${snapshots.length} days, newest last)
${snapshotCSV}

## Output Format
Write a concise daily briefing in markdown with these sections:

### Recovery: [score] — [Green 67+/Yellow 34-66/Red 0-33]
One sentence on what the score means today${tier !== 'bootstrap' ? ', compared to personal baseline' : ''}.

${trendSectionHeader}

### Key Insight
The single most important observation from the data.${tier === 'bootstrap' ? ' With limited data, focus on what today\'s numbers tell you about readiness.' : ' Look for patterns like consecutive high strain without recovery, HRV trending down, or metrics hitting personal highs/lows.'}

### Training Recommendation
Based on recovery color${tier !== 'bootstrap' ? ', recent strain load, and training pattern' : ''}, what type of training is optimal today.

### Watch Out
Any concerning patterns or things to monitor. If nothing concerning, say so briefly.

Keep it under 300 words total. Be specific with numbers. ${tier === 'bootstrap' ? 'Be honest about what you can and cannot conclude from limited data.' : 'Reference actual trends from the historical data, not generic advice.'}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    return textBlock?.text ?? 'Briefing generation failed — no text returned.';
  } catch (error) {
    console.error('[ai-briefing] Claude API error:', error);
    throw new Error(`Briefing generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================
// Format snapshots as compact CSV for the prompt
// ============================================

function formatSnapshotsForPrompt(snapshots: DailySnapshot[]): string {
  const header = 'date,recovery,hrv,rhr,spo2,strain,calories,workout';
  const rows = snapshots.map((s) => {
    const workout = s.workout_sport
      ? `${s.workout_sport}(${s.workout_duration_minutes}m)`
      : '-';
    return [
      s.date,
      s.recovery_score ?? '-',
      s.hrv?.toFixed(1) ?? '-',
      s.resting_heart_rate ?? '-',
      s.spo2?.toFixed(1) ?? '-',
      s.strain?.toFixed(1) ?? '-',
      s.calories ?? '-',
      workout,
    ].join(',');
  });

  return [header, ...rows].join('\n');
}

// ============================================
// Store briefing in Supabase
// ============================================

export async function saveBriefing(
  date: string,
  markdown: string,
  snapshotCount: number,
): Promise<void> {
  const { error } = await supabase.from(TABLE).upsert(
    {
      date,
      briefing_markdown: markdown,
      model_used: MODEL,
      snapshot_count: snapshotCount,
      generated_at: new Date().toISOString(),
    },
    { onConflict: 'date' },
  );

  if (error) {
    console.error('[ai-briefing] saveBriefing error:', error);
    throw error;
  }
}

// ============================================
// Retrieve today's briefing
// ============================================

export async function getTodayBriefing(): Promise<DailyBriefing | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (error || !data) return null;
  return data as DailyBriefing;
}

/**
 * Get the most recent briefing (may not be today's if cron hasn't run yet).
 */
export async function getLatestBriefing(): Promise<DailyBriefing | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as DailyBriefing;
}
