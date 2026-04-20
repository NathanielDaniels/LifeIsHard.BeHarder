// ============================================
// AI Race Coach — Daily Briefing Generator
//
// Generates a professional race-coach briefing from
// WHOOP biometric data, calibrated to Patrick's race
// calendar and periodization toward Nationals.
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
import { RACES_2026, type Race } from '@/lib/race-data';

const TABLE = 'daily_briefings';
const MODEL = 'claude-sonnet-4-6-20250514';

// ============================================
// Race calendar context
// ============================================

function buildRaceContext(today: string): string {
  const todayDate = new Date(today + 'T00:00:00');
  const msPerDay = 86400000;

  // Find next 3 upcoming races
  const upcoming = RACES_2026
    .filter((r) => new Date(r.date + 'T00:00:00') >= todayDate)
    .slice(0, 3);

  // Find the A-race (Nationals)
  const aRace = RACES_2026.find((r) => r.isTarget);

  // Find most recent past race
  const pastRaces = RACES_2026
    .filter((r) => new Date(r.date + 'T00:00:00') < todayDate);
  const lastRace = pastRaces[pastRaces.length - 1];

  // Is today race day or race week?
  const isRaceDay = RACES_2026.some((r) => r.date === today);
  const raceThisWeek = RACES_2026.find((r) => {
    const raceDate = new Date(r.date + 'T00:00:00');
    const daysUntil = (raceDate.getTime() - todayDate.getTime()) / msPerDay;
    return daysUntil > 0 && daysUntil <= 7;
  });

  let context = `## Race Calendar\n`;

  if (isRaceDay) {
    const race = RACES_2026.find((r) => r.date === today)!;
    context += `\n🔴 **RACE DAY: ${race.name}**\n`;
    context += `${race.distance} — ${race.course}\n`;
    context += `${race.location}\n`;
    if (race.championship) context += `Championship: ${race.championship}\n`;
    context += `\nThis is race day. The briefing should be a pre-race readiness assessment.\n`;
  } else if (raceThisWeek) {
    const daysUntil = Math.round((new Date(raceThisWeek.date + 'T00:00:00').getTime() - todayDate.getTime()) / msPerDay);
    context += `\n⚡ **RACE WEEK: ${raceThisWeek.name} in ${daysUntil} day${daysUntil > 1 ? 's' : ''}**\n`;
    context += `${raceThisWeek.distance} — ${raceThisWeek.course}\n`;
    if (raceThisWeek.championship) context += `Championship: ${raceThisWeek.championship}\n`;
    context += `\nTaper and race prep should dominate recommendations.\n`;
  }

  if (lastRace) {
    const daysSince = Math.round((todayDate.getTime() - new Date(lastRace.date + 'T00:00:00').getTime()) / msPerDay);
    if (daysSince <= 7) {
      context += `\nPost-race: ${lastRace.name} was ${daysSince} day${daysSince > 1 ? 's' : ''} ago. Recovery protocols may still apply.\n`;
    }
  }

  context += `\n### Upcoming Races\n`;
  for (const race of upcoming) {
    const daysUntil = Math.round((new Date(race.date + 'T00:00:00').getTime() - todayDate.getTime()) / msPerDay);
    const tag = race.isTarget ? ' ⭐ A-RACE' : (race.championship ? ` (${race.championship})` : '');
    context += `- **${race.name}** — ${daysUntil} days out (${race.date})${tag}\n`;
    context += `  ${race.distance}: ${race.course} | ${race.location}\n`;
  }

  if (aRace) {
    const daysToNationals = Math.round((new Date(aRace.date + 'T00:00:00').getTime() - todayDate.getTime()) / msPerDay);
    if (daysToNationals > 0) {
      context += `\n### Periodization Anchor\n`;
      context += `**${daysToNationals} days to Nationals** (${aRace.name}, ${aRace.location}, ${aRace.date})\n`;
      context += `Every training decision should build toward peak performance on this date.\n`;

      if (daysToNationals > 120) {
        context += `Phase: BASE BUILDING — aerobic foundation, technique, volume over intensity\n`;
      } else if (daysToNationals > 60) {
        context += `Phase: BUILD — increasing race-specific intensity, maintaining volume\n`;
      } else if (daysToNationals > 21) {
        context += `Phase: PEAK — high-intensity race simulation, managing fatigue\n`;
      } else if (daysToNationals > 7) {
        context += `Phase: TAPER — reducing volume, maintaining intensity, maximizing freshness\n`;
      } else {
        context += `Phase: RACE WEEK — final preparations, trust the training\n`;
      }
    }
  }

  return context;
}

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

  const withRecovery = snapshots.filter((s) => s.recovery_score != null);
  const withHRV = snapshots.filter((s) => s.hrv != null);
  const withStrain = snapshots.filter((s) => s.strain != null);
  const withRHR = snapshots.filter((s) => s.resting_heart_rate != null);
  const withSpo2 = snapshots.filter((s) => s.spo2 != null);

  const avg = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : null;

  const avgRecovery = avg(withRecovery.map((s) => s.recovery_score!));
  const avgHRV = avg(withHRV.map((s) => s.hrv!));
  const avgStrain = avg(withStrain.map((s) => s.strain!));
  const avgRHR = avg(withRHR.map((s) => s.resting_heart_rate!));
  const avgSpo2 = avg(withSpo2.map((s) => s.spo2!));

  const workoutDays = snapshots.filter((s) => s.workout_sport != null).length;
  const workoutFreq = days > 0 ? (workoutDays / days * 7).toFixed(1) : '0';

  // Recent 7-day averages for trend comparison
  const recent7 = snapshots.slice(-7);
  const recent7Recovery = avg(recent7.filter((s) => s.recovery_score != null).map((s) => s.recovery_score!));
  const recent7HRV = avg(recent7.filter((s) => s.hrv != null).map((s) => s.hrv!));
  const recent7Strain = avg(recent7.filter((s) => s.strain != null).map((s) => s.strain!));

  let context = `## Data Depth: ${days} days`;

  if (tier === 'bootstrap') {
    context += ` (EARLY — building baseline, avoid strong trend claims)`;
  } else if (tier === 'emerging') {
    context += ` (SHORT-TERM — trends are directional, not yet definitive)`;
  } else {
    context += ` (ESTABLISHED — reliable baselines and trend analysis)`;
  }

  context += `\n\n## Personal Baselines (${days}-day)`;
  context += `\n- Avg Recovery: ${avgRecovery?.toFixed(0) ?? 'N/A'}`;
  context += `\n- Avg HRV: ${avgHRV?.toFixed(1) ?? 'N/A'} ms`;
  context += `\n- Avg RHR: ${avgRHR?.toFixed(0) ?? 'N/A'} bpm`;
  context += `\n- Avg SpO2: ${avgSpo2?.toFixed(1) ?? 'N/A'}%`;
  context += `\n- Avg Strain: ${avgStrain?.toFixed(1) ?? 'N/A'}`;
  context += `\n- Workout Frequency: ${workoutFreq} days/week`;

  if (snapshots.length >= 7) {
    context += `\n\n## 7-Day Trend`;
    context += `\n- Recent Recovery: ${recent7Recovery?.toFixed(0) ?? 'N/A'} (vs ${avgRecovery?.toFixed(0) ?? 'N/A'} baseline)`;
    context += `\n- Recent HRV: ${recent7HRV?.toFixed(1) ?? 'N/A'} ms (vs ${avgHRV?.toFixed(1) ?? 'N/A'} baseline)`;
    context += `\n- Recent Strain: ${recent7Strain?.toFixed(1) ?? 'N/A'} (vs ${avgStrain?.toFixed(1) ?? 'N/A'} baseline)`;
  }

  return context;
}

function buildTierInstructions(tier: DataTier): string {
  switch (tier) {
    case 'bootstrap':
      return `## Analysis Depth: EARLY DATA (< 10 days)
You have limited history. Focus on:
- Today's metrics and what they mean for training readiness
- Any obvious day-over-day changes
- DO NOT claim trends or patterns — not enough data
- Be honest about data limitations
- Still give a clear training recommendation based on today's recovery`;

    case 'emerging':
      return `## Analysis Depth: EMERGING DATA (10-30 days)
Short-term analysis available:
- Compare today to emerging personal baselines
- Week-over-week directional changes
- Flag metrics consistently above or below baseline
- Cautious trend language: "appears to be trending" not "has been trending"
- Identify workout patterns and recovery responses`;

    case 'established':
      return `## Analysis Depth: ESTABLISHED DATA (30+ days)
Full analysis available:
- Compare today to reliable personal baselines
- Multi-week trends with confidence
- Flag personal highs or lows
- Analyze strain-recovery balance and training load
- Identify periodization patterns
- Correlate high-strain days with recovery responses
- Assess readiness trajectory toward upcoming races`;
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
  const raceContext = buildRaceContext(today.date);
  const snapshotCSV = formatSnapshotsForPrompt(snapshots);

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are Patrick's race coach. You're a sports science expert specializing in para-triathlon, reviewing his WHOOP data and building him toward peak performance at Nationals.

## Athlete Profile
- **Patrick Wingert** — Para-triathlete, below-knee amputee (right leg, Nov 2020)
- **Team:** 2026 Dare2Tri Elite Development Team
- **A-Race:** USA Para Triathlon National Championships (Aug 9, 2026, Milwaukee)
- **Disciplines:** Swim, Bike, Run — all sprint-distance triathlon focused
- **Prosthetic considerations:** Higher energy cost on the run, asymmetric loading affects recovery patterns, skin temp at residual limb can indicate socket fit issues
- **Motto:** "Life is Hard. Be Harder."

${raceContext}

## Today's Date
${today.date}

## Today's Metrics
- Recovery: ${today.recovery_score ?? 'N/A'}
- HRV: ${today.hrv ? today.hrv.toFixed(1) + ' ms' : 'N/A'}
- RHR: ${today.resting_heart_rate ?? 'N/A'} bpm
- SpO2: ${today.spo2 ? today.spo2.toFixed(1) + '%' : 'N/A'}
- Skin Temp: ${today.skin_temp ? today.skin_temp.toFixed(1) + '°C' : 'N/A'}
- Strain: ${today.strain ? today.strain.toFixed(1) : 'N/A'}
- Calories: ${today.calories ?? 'N/A'}
${today.workout_sport ? `- Workout: ${today.workout_sport} (${today.workout_duration_minutes}min, strain ${today.workout_strain?.toFixed(1)}, avg HR ${today.workout_avg_hr}, max HR ${today.workout_max_hr})` : '- No workout logged today'}

${dataContext}

${tierInstructions}

## Historical Data (${snapshots.length} days, newest last)
${snapshotCSV}

## Output Format — Race Coach Briefing

Write a concise, direct daily briefing. Patrick is a competitive athlete — talk to him like his coach, not his doctor. Use his data to make specific calls.

### Recovery: [score] — [Green 67+/Yellow 34-66/Red 0-33]
One line: what this means for today's training. Compare to baseline if available.

### Race Countdown
- Days to next race and what that means for today's training priority
- Where we are in the periodization cycle toward Nationals
- If race week: taper guidance. If race day: pre-race assessment. If post-race: recovery protocol.

### Training Call
The specific training recommendation for today. Not generic — based on:
- Recovery score and color
- Where we are relative to the next race
- Recent training load (strain trend)
- What discipline needs attention based on the race calendar
Be concrete: "45-min Zone 2 ride focusing on cadence" not "moderate exercise"

### Key Numbers
The 2-3 most important data points from today, each with baseline context.
Format: "HRV: 42ms (baseline: 38ms) — ↑ trending in the right direction"

### Coach's Note
One paragraph. The single most important thing Patrick needs to hear today. Could be encouragement, a warning, a strategic insight, or a mindset reminder. Speak to him directly. This is where the coach's voice matters most.

## Rules
- Be specific with numbers. Always include baseline comparisons.
- Recovery colors: Green ≥67, Yellow 34-66, Red <34
- Green recovery ≠ always push hard. Consider race proximity and recent load.
- Red recovery = mandatory easy day or rest. Non-negotiable.
- Race week: prioritize freshness over fitness. The hay is in the barn.
- Race day: readiness assessment only. No training recommendations.
- Post-race (within 3 days): recovery protocols, easy movement only.
- ${tier === 'bootstrap' ? 'Be honest about limited data. Coach with what you have.' : 'Reference actual trends from historical data, not generic advice.'}
- Keep it under 400 words. Coaches are concise.
- Sign off with a one-liner that sounds like a coach, not an AI.`,
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
  const header = 'date,recovery,hrv,rhr,spo2,skin_temp,strain,calories,workout';
  const rows = snapshots.map((s) => {
    const workout = s.workout_sport
      ? `${s.workout_sport}(${s.workout_duration_minutes}m/s${s.workout_strain?.toFixed(1) ?? '-'})`
      : '-';
    return [
      s.date,
      s.recovery_score ?? '-',
      s.hrv?.toFixed(1) ?? '-',
      s.resting_heart_rate ?? '-',
      s.spo2?.toFixed(1) ?? '-',
      s.skin_temp?.toFixed(1) ?? '-',
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

// ============================================
// Structured Briefing — JSON output for email template
// ============================================

export interface BriefingKeyNumber {
  label: string;
  value: string;
  baseline: string;
  trend: 'up' | 'down' | 'stable' | 'warning';
}

export interface BriefingData {
  date: string;
  recoveryScore: number | null;
  recoveryColor: 'green' | 'yellow' | 'red';
  headline: string;
  trainingCall: string;
  keyNumbers: BriefingKeyNumber[];
  coachNote: string;
}

export async function generateStructuredBriefing(
  snapshots: DailySnapshot[],
): Promise<BriefingData> {
  if (snapshots.length === 0) {
    return {
      date: new Date().toISOString().split('T')[0],
      recoveryScore: null,
      recoveryColor: 'yellow',
      headline: 'No WHOOP data available yet',
      trainingCall: 'Check back after the first day of data collection.',
      keyNumbers: [],
      coachNote: 'No data to analyze. Once WHOOP snapshots start flowing, the daily briefing will kick in.',
    };
  }

  const today = snapshots[snapshots.length - 1];
  const tier = getDataTier(snapshots.length);
  const dataContext = buildDataContext(snapshots);
  const snapshotCSV = formatSnapshotsForPrompt(snapshots);

  const recoveryScore = today.recovery_score ?? null;
  const recoveryColor: 'green' | 'yellow' | 'red' =
    recoveryScore === null ? 'yellow' :
    recoveryScore >= 67 ? 'green' :
    recoveryScore >= 34 ? 'yellow' : 'red';

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `You are Patrick Wingert's race coach analyzing his WHOOP data. Return ONLY valid JSON with these exact fields — no markdown, no explanation, just JSON.

## Athlete
- Para-triathlete, below-knee amputee, Dare2Tri Elite Development Team
- A-Race: USA Para Triathlon National Championships (Aug 9, 2026)

## Today: ${today.date}
- Recovery: ${today.recovery_score ?? 'N/A'} (${recoveryColor})
- HRV: ${today.hrv ? today.hrv.toFixed(1) : 'N/A'} ms
- RHR: ${today.resting_heart_rate ?? 'N/A'} bpm
- SpO2: ${today.spo2 ? today.spo2.toFixed(1) : 'N/A'}%
- Strain: ${today.strain ? today.strain.toFixed(1) : 'N/A'}
${today.workout_sport ? `- Workout: ${today.workout_sport} (${today.workout_duration_minutes}min)` : '- No workout'}

${dataContext}

## Historical Data (${snapshots.length} days)
${snapshotCSV}

## Return this JSON structure:
{
  "headline": "One-sentence summary of recovery state and what it means today",
  "trainingCall": "Specific training recommendation for today. Concrete: discipline, duration, intensity zone, focus area. Not generic.",
  "keyNumbers": [
    {"label": "HRV", "value": "42.0 ms", "baseline": "38.0 ms", "trend": "up"},
    {"label": "RHR", "value": "64 bpm", "baseline": "66 bpm", "trend": "up"},
    {"label": "SpO2", "value": "94.6%", "baseline": "95.6%", "trend": "warning"}
  ],
  "coachNote": "One paragraph. Direct, personal message to Patrick. The most important thing he needs to hear today."
}

## Rules for keyNumbers:
- Pick the 3 most important metrics today
- trend: "up" = improving, "down" = declining, "stable" = flat, "warning" = needs attention
- Always include baseline from the historical data
- ${tier === 'bootstrap' ? 'Limited data — be honest about baselines being preliminary' : 'Use full historical baselines'}

Return ONLY the JSON object. No markdown fences, no text before or after.`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    const raw = textBlock?.text ?? '{}';

    // Parse JSON — strip any accidental markdown fences
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      date: today.date,
      recoveryScore,
      recoveryColor,
      headline: parsed.headline ?? 'Briefing generated',
      trainingCall: parsed.trainingCall ?? 'Check your full briefing for details.',
      keyNumbers: (parsed.keyNumbers ?? []).slice(0, 3),
      coachNote: parsed.coachNote ?? '',
    };
  } catch (error) {
    console.error('[ai-briefing] Structured briefing error:', error);
    // Return a minimal fallback so the email still sends
    return {
      date: today.date,
      recoveryScore,
      recoveryColor,
      headline: `Recovery: ${recoveryScore ?? '—'} (${recoveryColor})`,
      trainingCall: 'See full briefing for training recommendation.',
      keyNumbers: [],
      coachNote: 'Structured briefing generation failed — check the full briefing in the dashboard.',
    };
  }
}

// ============================================
// Email briefing via Resend (HTML template)
// ============================================

export async function emailBriefing(
  markdown: string,
  date: string,
  structuredData: BriefingData | null,
  snapshots: DailySnapshot[],
  recipientOverride?: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[ai-briefing] RESEND_API_KEY not set, skipping email');
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);
  const { render } = await import('@react-email/render');

  const to = recipientOverride
    || process.env.BRIEFING_EMAIL
    || 'patrick@patrickwingert.com';

  const recipients = to.split(',').map((e) => e.trim()).filter(Boolean);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'patrick@patrickwingert.com';

  // Find next race for subject line and template
  const todayDate = new Date(date + 'T00:00:00');
  const msPerDay = 86400000;
  const nextRace = RACES_2026.find(
    (r) => new Date(r.date + 'T00:00:00') >= todayDate,
  );
  const aRace = RACES_2026.find((r) => r.isTarget);

  const nextRaceDaysOut = nextRace
    ? Math.round((new Date(nextRace.date + 'T00:00:00').getTime() - todayDate.getTime()) / msPerDay)
    : 0;

  const nationalsDaysOut = aRace
    ? Math.round((new Date(aRace.date + 'T00:00:00').getTime() - todayDate.getTime()) / msPerDay)
    : null;

  // Periodization phase
  let phase = 'TRAINING';
  if (nationalsDaysOut !== null && nationalsDaysOut > 0) {
    if (nationalsDaysOut > 120) phase = 'BASE BUILDING';
    else if (nationalsDaysOut > 60) phase = 'BUILD';
    else if (nationalsDaysOut > 21) phase = 'PEAK';
    else if (nationalsDaysOut > 7) phase = 'TAPER';
    else phase = 'RACE WEEK';
  }

  const raceTag = nextRace
    ? ` | ${nextRaceDaysOut}d to ${nextRace.name}`
    : '';

  // Build chart URLs
  const { recoverySparkline, hrvSparkline, strainSparkline } = await import('./quickchart');
  const recoveryChartUrl = snapshots.length >= 3 ? recoverySparkline(snapshots, 7) : '';
  const hrvChartUrl = snapshots.length >= 3 ? hrvSparkline(snapshots, 7) : '';
  const strainChartUrl = snapshots.length >= 3 ? strainSparkline(snapshots, 7) : '';

  // Render HTML if we have structured data
  let html: string | undefined;
  if (structuredData) {
    const { default: DailyBriefingEmail } = await import('@/emails/daily-briefing-email');
    const element = DailyBriefingEmail({
      date,
      recoveryScore: structuredData.recoveryScore,
      recoveryColor: structuredData.recoveryColor,
      headline: structuredData.headline,
      nextRaceName: nextRace?.name ?? 'No upcoming race',
      nextRaceDaysOut,
      nextRaceDistance: nextRace?.distance ?? '',
      nationalsDaysOut,
      periodizationPhase: phase,
      trainingCall: structuredData.trainingCall,
      keyNumbers: structuredData.keyNumbers,
      coachNote: structuredData.coachNote,
      recoveryChartUrl,
      hrvChartUrl,
      strainChartUrl,
    });
    html = await render(element);
  }

  await resend.emails.send({
    from: `Coach AI <${fromEmail}>`,
    to: recipients,
    subject: `Daily Briefing — ${date}${raceTag}`,
    ...(html ? { html, text: markdown } : { text: markdown }),
  });

  console.log(`[ai-briefing] Briefing emailed to ${recipients.join(', ')}`);
}
