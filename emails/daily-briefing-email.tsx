import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Preview,
  Row,
  Column,
  Img,
} from '@react-email/components';
import type { EmailChartKey, EmailDisplayState } from '@/lib/pipeline/email-display-state';

// ============================================
// Types
// ============================================

export interface BriefingKeyNumber {
  label: string;
  value: string;
  baseline: string;
  trend: 'up' | 'down' | 'stable' | 'warning';
}

export interface BriefingEmailProps {
  // Identity
  athleteName?: string;
  athleteTagline?: string;

  // WHOOP availability
  hasWhoop?: boolean;

  // Chart feature flags
  chartPreferences?: Record<string, boolean>;
  displayState?: EmailDisplayState;

  // Core briefing data
  date: string;
  recoveryScore: number | null;
  recoveryColor: 'green' | 'yellow' | 'red';
  isRestDay?: boolean;
  headline: string;
  nextRaceName: string;
  nextRaceDaysOut: number;
  nextRaceDistance: string;
  nationalsDaysOut?: number | null;
  periodizationPhase: string;
  trainingCall: string;
  keyNumbers: BriefingKeyNumber[];
  coachNote: string;
  tomorrowPreview?: string;

  // Chart URLs (generated externally, passed as props)
  recoveryChartUrl?: string;
  hrvChartUrl?: string;
  strainChartUrl?: string;
  disciplineChartUrl?: string;
  fitnessFormChartUrl?: string;
  trainingLoadChartUrl?: string;
  recoveryLoadChartUrl?: string;
  raceReadinessChartUrl?: string;
  raceReadinessBreakdown?: {
    score: number;
    recovery: number;
    fitness: number | null;
    consistency: number;
    specificity: number;
    consistencyTarget: number;
    disciplineLabel: string;
  };
  consistencyChartUrl?: string;
  hrZoneChartUrl?: string;

  // Cross-source chart URLs (DAVE exclusives — WHOOP + Strava combined)
  recoveryPerformanceChartUrl?: string;
  trainingEfficiencyChartUrl?: string;
  sleepRecoveryChartUrl?: string;
  recoveryCostChartUrl?: string;
  durabilityChartUrl?: string;
  planAdherenceChartUrl?: string;

  // Training gap tracker (sport-aware — items vary by athlete sport profile)
  daysSince?: Array<{ key: string; label: string; icon: string; days: number | null }>;

  // Check-in buttons
  responseButtons?: { label: string; url: string }[];
  q1Label?: string;
  q1Buttons?: { label: string; url: string }[];
  q2Label?: string;
  q2Buttons?: { label: string; url: string }[];
  checkinUrl?: string;
}

// ============================================
// Colors
// ============================================

const VOLT       = '#c8ff00';   // brand accent — replaces orange entirely
const DARK_BG    = '#080808';   // base background
const CARD_BG    = '#111111';   // card surfaces
const HERO_BG    = '#0e1f00';   // hero gradient start (dark green tint)
const GREEN      = '#22c55e';   // semantic: green recovery only
const YELLOW     = '#eab308';   // semantic: yellow recovery only
const RED        = '#ef4444';   // semantic: red recovery only
const WARNING    = '#fbbf24';   // semantic: SPO2 / anomaly warnings
const WHITE      = '#ffffff';
const MUTED      = 'rgba(255,255,255,0.50)';
const SUBTLE     = 'rgba(255,255,255,0.05)';
const LABEL      = 'rgba(255,255,255,0.38)';  // section label color
const DIVIDER    = 'rgba(255,255,255,0.06)';  // inline stat dividers

function recoveryBgColor(color: string): string {
  switch (color) {
    case 'green': return 'rgba(34,197,94,0.12)';
    case 'yellow': return 'rgba(234,179,8,0.12)';
    case 'red': return 'rgba(239,68,68,0.12)';
    default: return 'rgba(255,255,255,0.05)';
  }
}

function recoveryAccent(color: string): string {
  switch (color) {
    case 'green':  return GREEN;
    case 'yellow': return YELLOW;
    case 'red':    return RED;
    default:       return MUTED;
  }
}

const COACH_FOOTER = 'https://meetcoachdave.com/Coach%20DAVE/transparent/thumbsUp_transparent.png';

function fallbackCoachHeroPose(color: string): string {
  const base = 'https://meetcoachdave.com/Coach%20DAVE/transparent';
  switch (color) {
    case 'green':  return `${base}/cheer_transparent.png`;
    case 'yellow': return `${base}/briefing-transparent.png`;
    case 'red':    return `${base}/armcrossed_full_transparent.png`;
    default:       return `${base}/cheer_transparent.png`;
  }
}

function trendArrow(trend: string): string {
  switch (trend) {
    case 'up': return '↑';
    case 'down': return '↓';
    case 'stable': return '→';
    case 'warning': return '⚠';
    default: return '';
  }
}

function trendColor(trend: string): string {
  switch (trend) {
    case 'up': return GREEN;
    case 'down': return RED;
    case 'stable': return MUTED;
    case 'warning': return YELLOW;
    default: return MUTED;
  }
}

function recoveryStatusLabel(color: string, isRestDay: boolean): string {
  if (isRestDay) return 'REST TODAY';
  if (color === 'green') return 'PUSH TODAY';
  if (color === 'yellow') return 'TRAIN SMART';
  return 'REST TODAY';
}

// ============================================
// Component
// ============================================

export function DailyBriefingEmail({
  athleteName = 'ATHLETE',
  athleteTagline,
  hasWhoop = true,
  chartPreferences = {},
  displayState,
  date = '2026-04-10',
  recoveryScore = 81,
  recoveryColor = 'green',
  isRestDay = false,
  headline = 'Green at 81 — strongest recovery in a week',
  nextRaceName = 'Next Race',
  nextRaceDaysOut = 1,
  nextRaceDistance = 'Sprint',
  nationalsDaysOut = null,
  periodizationPhase = 'BUILD',
  trainingCall = 'Strong effort today. Trust the training.',
  keyNumbers = [
    { label: 'HRV', value: '42.0 ms', baseline: '38.0 ms', trend: 'up' as const },
    { label: 'RHR', value: '64 bpm', baseline: '66 bpm', trend: 'up' as const },
    { label: 'SpO2', value: '94.6%', baseline: '95.6%', trend: 'warning' as const },
  ],
  coachNote = "Your body is ready. Execute the plan, race your race, and leave nothing on the course.",
  tomorrowPreview,
  recoveryChartUrl = '',
  hrvChartUrl = '',
  strainChartUrl = '',
  disciplineChartUrl = '',
  fitnessFormChartUrl = '',
  trainingLoadChartUrl = '',
  recoveryLoadChartUrl = '',
  raceReadinessChartUrl = '',
  raceReadinessBreakdown,
  consistencyChartUrl = '',
  hrZoneChartUrl = '',
  recoveryPerformanceChartUrl = '',
  trainingEfficiencyChartUrl = '',
  sleepRecoveryChartUrl = '',
  recoveryCostChartUrl = '',
  durabilityChartUrl = '',
  planAdherenceChartUrl = '',
  daysSince,
  responseButtons = [],
  q1Label = '',
  q1Buttons = [],
  q2Label = '',
  q2Buttons = [],
  checkinUrl = '',
}: BriefingEmailProps) {
  const accent = recoveryAccent(recoveryColor);
  const statusLabel = recoveryStatusLabel(recoveryColor, isRestDay);
  const selectedChart = (key: EmailChartKey, hasUrl: boolean): boolean => {
    if (!hasUrl) return false;
    if (displayState) {
      return displayState.chartDecisions.some((decision) => decision.key === key && decision.selected);
    }
    return chartPreferences[key] !== false;
  };
  const chartDecision = (key: EmailChartKey) =>
    displayState?.chartDecisions.find((decision) => decision.key === key);
  const chartHeading = (key: EmailChartKey, fallback: string): string =>
    chartDecision(key)?.heading ?? fallback;
  const chartCaptionText = (key: EmailChartKey, fallback: string): string =>
    chartDecision(key)?.caption ?? fallback;
  const heroSrc = displayState?.brandImage.heroSrc ?? fallbackCoachHeroPose(recoveryColor);
  const footerSrc = displayState?.brandImage.footerSrc ?? COACH_FOOTER;

  // Determine which WHOOP charts to show (only when hasWhoop=true)
  const showRecoveryChart = hasWhoop && selectedChart('recovery_trend', !!recoveryChartUrl);
  const showHrvChart = hasWhoop && selectedChart('hrv_trend', !!hrvChartUrl);
  const showStrainChart = hasWhoop && selectedChart('strain_trend', !!strainChartUrl);
  const showRecoveryLoadChart = hasWhoop && selectedChart('recovery_load_ratio', !!recoveryLoadChartUrl);
  const showRaceReadiness = hasWhoop && selectedChart('race_readiness', !!raceReadinessChartUrl);

  // Non-WHOOP charts
  const showDisciplineChart = selectedChart('discipline_balance', !!disciplineChartUrl);
  const showFitnessForm = !!fitnessFormChartUrl && chartPreferences.fitness_form !== false;
  const showTrainingLoad = selectedChart('training_load', !!trainingLoadChartUrl);
  const showConsistency = selectedChart('consistency_calendar', !!consistencyChartUrl);
  const showHrZones = selectedChart('hr_zones', !!hrZoneChartUrl);
  const showRecoveryPerformance = selectedChart('recovery_performance', !!recoveryPerformanceChartUrl);
  const showTrainingEfficiency = selectedChart('training_efficiency', !!trainingEfficiencyChartUrl);
  const showSleepRecovery = selectedChart('sleep_recovery', !!sleepRecoveryChartUrl);
  const statItems = [
    ...keyNumbers.slice(0, 3).map((kn) => ({
      key: kn.label,
      value: kn.value,
      label: `${kn.label} · ${kn.baseline}`,
      color: kn.trend === 'warning' ? WARNING : trendColor(kn.trend),
      arrow: trendArrow(kn.trend),
    })),
    ...(nextRaceName && nextRaceName.trim() !== ''
      ? [{
          key: 'race',
          value: nextRaceDaysOut === 0 ? 'TODAY' : `${nextRaceDaysOut}d`,
          label: nextRaceName.split(' ').slice(0, 3).join(' '),
          color: VOLT,
          arrow: '',
        }]
      : []),
  ];
  const statRows: Array<Array<(typeof statItems)[number]>> = [];
  for (let i = 0; i < statItems.length; i += 2) {
    statRows.push(statItems.slice(i, i + 2));
  }

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>

      <Preview>
        {hasWhoop
          ? `Recovery: ${recoveryScore ?? '—'} (${recoveryColor.toUpperCase()}) — ${headline}`
          : headline}
      </Preview>

      <Body style={body}>
        <Container style={wrapper}>
          {/* ══════ TOP ACCENT ══════ */}
          <Section style={{ background: `linear-gradient(90deg, ${VOLT}, #a8e000, ${VOLT})`, height: '3px', width: '100%' }} />

          {/* ══════ HEADER ══════ */}
          <Section style={headerZone}>
            <Row style={{ width: '100%' }}>
              <Column style={{ verticalAlign: 'middle' as const }}>
                <Text style={headerLogo}>D.A.V.E.</Text>
                <Text style={headerSubtitle}>DAILY ADAPTIVE VITALITY ENGINE</Text>
              </Column>
              <Column style={{ textAlign: 'right' as const, verticalAlign: 'middle' as const }}>
                <Text style={headerDate}>{date}</Text>
              </Column>
            </Row>
          </Section>

          {/* ══════ CINEMATIC HERO ══════ */}
          <Section style={heroSection}>
            <Row style={{ width: '100%' }}>
              <Column style={{ width: '60%', verticalAlign: 'bottom' as const, paddingBottom: '48px' }}>
                {/* Greeting */}
                <Text style={heroGreeting}>GOOD MORNING,</Text>
                <Text style={heroName}>{athleteName.split(' ')[0].toUpperCase()}.</Text>

                {/* Recovery — only if WHOOP connected */}
                {hasWhoop && (
                  <>
                    <Text style={{ ...heroRecoveryStatus, color: accent }}>
                      ● {recoveryColor.toUpperCase()} · {statusLabel}
                    </Text>
                    <Text style={{ ...heroRecoveryNumber, color: accent }}>
                      {recoveryScore ?? '—'}
                    </Text>
                    <Text style={heroRecoverySubtitle}>{headline}</Text>
                  </>
                )}
                {!hasWhoop && (
                  <Text style={heroRecoverySubtitle}>{headline}</Text>
                )}
              </Column>

              <Column style={{ width: '40%', verticalAlign: 'bottom' as const, textAlign: 'right' as const, paddingBottom: '0' }}>
                <Img
                  src={heroSrc}
                  width="260"
                  height="290"
                  alt="Coach Dave"
                  style={{ height: '290px', width: 'auto', maxWidth: '260px', display: 'block', marginLeft: 'auto' }}
                />
              </Column>
            </Row>
          </Section>

          {/* ══════ TODAY'S CALL ══════ */}
          {trainingCall && (
            <Section style={{ ...sectionPadding, paddingTop: '36px', paddingBottom: '0' }}>
              <Section style={trainingCallCard}>
                <Text style={trainingCallLabel}>TODAY&apos;S CALL</Text>
                <Text style={trainingCallText}>{trainingCall}</Text>
              </Section>
            </Section>
          )}

          {/* ══════ COACH'S NOTE ══════ */}
          <Section style={{ ...sectionPadding, paddingTop: trainingCall ? '28px' : '36px' }}>
            <Text style={sectionHeader}>COACH&apos;S NOTE</Text>

            {coachNote.split('\n\n').map((para, i) => (
              <Text key={i} style={coachNoteText}>
                {i === 0 ? '\u201C' : ''}{para.split('\n').map((line, j, arr) => (
                  <React.Fragment key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}{i === coachNote.split('\n\n').length - 1 ? '\u201D' : ''}
              </Text>
            ))}

            {tomorrowPreview && (
              <Text style={tomorrowText}>
                Tomorrow: {tomorrowPreview}
              </Text>
            )}

            {/* Volt bar signature */}
            <Row style={{ marginTop: '28px' }}>
              <Column style={{ width: '3px', backgroundColor: VOLT, borderRadius: '2px' }}>&nbsp;</Column>
              <Column style={{ paddingLeft: '12px' }}>
                <Text style={coachSignature}>COACH DAVE · DAILY ADAPTIVE VITALITY ENGINE</Text>
              </Column>
            </Row>
          </Section>

          {/* ══════ STATS BAR ══════ */}
          {statItems.length > 0 && (
            <Section style={statsBar}>
              {statRows.map((row, rowIndex) => (
                <Row
                  key={rowIndex}
                  style={{
                    width: '100%',
                    borderTop: rowIndex > 0 ? `1px solid ${DIVIDER}` : undefined,
                  }}
                >
                  {row.map((item, columnIndex) => (
                    <Column
                      key={item.key}
                      style={{
                        ...statCell,
                        borderRight: columnIndex === 0 ? `1px solid ${DIVIDER}` : undefined,
                      }}
                    >
                      <Text style={{ ...statValue, color: item.color }}>
                        {item.value}
                        {item.arrow && (
                          <>
                            {' '}
                            <span style={statArrow}>{item.arrow}</span>
                          </>
                        )}
                      </Text>
                      <Text style={statLabel}>{item.label}</Text>
                    </Column>
                  ))}
                  {row.length === 1 && (
                    <Column style={{ ...statCell, borderLeft: `1px solid ${DIVIDER}` }}>
                      &nbsp;
                    </Column>
                  )}
                </Row>
              ))}
            </Section>
          )}

          {/* ══════ DAYS SINCE LAST DISCIPLINE ══════ */}
          {daysSince && daysSince.length > 0 && (
            <Section style={{ ...sectionPadding, paddingTop: '0' }}>
              <Text style={sectionHeader}>LAST SESSION</Text>
              <Row style={{ width: '100%' }}>
                {daysSince.map((d, i) => (
                  <React.Fragment key={d.key}>
                    {i > 0 && <Column style={{ width: '12px' }} />}
                    <Column style={daysSinceCell}>
                      <Text style={daysSinceIcon}>{d.icon}</Text>
                      <Text style={daysSinceValue}>{d.days === 0 ? 'TODAY' : d.days != null ? `${d.days}d` : '—'}</Text>
                      <Text style={daysSinceLabel}>{d.label}</Text>
                    </Column>
                  </React.Fragment>
                ))}
              </Row>
            </Section>
          )}

          {/* ══════ CHECK IN ══════ */}
          {(q1Buttons.length > 0 || q2Buttons.length > 0 || responseButtons.length > 0) && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>CHECK IN WITH COACH</Text>
              <Section style={checkinCard}>
                {/* Question group 1 */}
                {q1Buttons.length > 0 && (
                  <>
                    <Text style={responseGroupLabel}>{q1Label}</Text>
                    <Row style={{ width: '100%', marginBottom: '16px' }}>
                      {q1Buttons.map((btn, i) => (
                        <Column key={i} style={{
                          width: `${100 / q1Buttons.length}%`,
                          paddingRight: i < q1Buttons.length - 1 ? '8px' : '0',
                          paddingLeft: i > 0 ? '8px' : '0',
                        }}>
                          <Link href={btn.url} style={checkinBtnGhost}>{btn.label}</Link>
                        </Column>
                      ))}
                    </Row>
                  </>
                )}
                {/* Question group 2 */}
                {q2Buttons.length > 0 && (
                  <>
                    <Text style={responseGroupLabel}>{q2Label}</Text>
                    <Row style={{ width: '100%', marginBottom: '16px' }}>
                      {q2Buttons.map((btn, i) => (
                        <Column key={i} style={{
                          width: `${100 / q2Buttons.length}%`,
                          paddingRight: i < q2Buttons.length - 1 ? '8px' : '0',
                          paddingLeft: i > 0 ? '8px' : '0',
                        }}>
                          <Link href={btn.url} style={checkinBtnGhost}>{btn.label}</Link>
                        </Column>
                      ))}
                    </Row>
                  </>
                )}
                {/* Fallback flat buttons */}
                {q1Buttons.length === 0 && q2Buttons.length === 0 && responseButtons.map((btn, i) => (
                  <Link key={i} href={btn.url} style={checkinBtnGhost}>{btn.label}</Link>
                ))}
                {/* Primary CTA */}
                {checkinUrl && (
                  <Link href={checkinUrl} style={checkinBtnPrimary}>TELL ME MORE →</Link>
                )}
              </Section>
            </Section>
          )}

          {/* ══════ DATA APPENDIX HEADER ══════ */}
          {(showFitnessForm || showDisciplineChart || showTrainingLoad || showHrZones || showRecoveryLoadChart || showConsistency || showRaceReadiness || showRecoveryChart || showHrvChart || showStrainChart || showRecoveryPerformance || showTrainingEfficiency || showSleepRecovery || !!recoveryCostChartUrl || !!durabilityChartUrl || !!planAdherenceChartUrl) && (
            <Section style={{ padding: '28px 24px 0', borderTop: `1px solid ${SUBTLE}` }}>
              <Text style={sectionHeader}>YOUR DATA</Text>
            </Section>
          )}

          {/* ══════ DAVE FORM MODEL ══════ */}
          {showFitnessForm && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>DAVE FORM MODEL</Text>
              <Img src={fitnessFormChartUrl} width="480" height="230" alt="DAVE fitness, fatigue, and form model" style={chartImg} />
              <Text style={chartCaption}>DAVE-derived training model: fitness is long-term load, fatigue is short-term load, and form shows whether you&apos;re carrying freshness or accumulated stress.</Text>
            </Section>
          )}

          {/* ══════ PLAN VS ACTUAL ══════ */}
          {!!planAdherenceChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>PLAN VS ACTUAL</Text>
              <Img src={planAdherenceChartUrl} width="480" height="200" alt="DAVE plan adherence trend" style={chartImg} />
              <Text style={chartCaption}>Compares DAVE&apos;s prescribed day with what was recorded. Green = matched, yellow = partial or extra work, red = missed planned training.</Text>
            </Section>
          )}

          {/* ══════ RECOVERY COST BY DISCIPLINE ══════ */}
          {!!recoveryCostChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>RECOVERY COST BY DISCIPLINE</Text>
              <Img src={recoveryCostChartUrl} width="480" height="210" alt="Next-day recovery cost by discipline" style={chartImg} />
              <Text style={chartCaption}>DAVE compares workout days to next-morning recovery to show which disciplines tend to create the biggest recovery cost for you.</Text>
            </Section>
          )}

          {/* ══════ DURABILITY TREND ══════ */}
          {!!durabilityChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>DURABILITY TREND</Text>
              <Img src={durabilityChartUrl} width="480" height="200" alt="Durability trend" style={chartImg} />
              <Text style={chartCaption}>Rolling view of training days that did not push next-day recovery into red. Higher means you&apos;re absorbing work without accumulating recovery debt.</Text>
            </Section>
          )}

          {/* ══════ DISCIPLINE BALANCE ══════ */}
          {showDisciplineChart && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('discipline_balance', '21-DAY WEIGHTED TRAINING BALANCE')}</Text>
              <Img src={disciplineChartUrl} width="480" height="260" alt="Discipline balance" style={chartImg} />
            </Section>
          )}

          {/* ══════ RECOVERY × PERFORMANCE (DAVE EXCLUSIVE) ══════ */}
          {showRecoveryPerformance && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('recovery_performance', 'RECOVERY × PERFORMANCE')}</Text>
              <Img src={recoveryPerformanceChartUrl} width="480" height="260" alt="Recovery vs performance correlation" style={chartImg} />
              <Text style={chartCaption}>{chartCaptionText('recovery_performance', "Each dot = one workout matched to that day's recovery. Runs show pace, where higher on the chart is faster; rides show average power.")}</Text>
            </Section>
          )}

          {/* ══════ TRAINING EFFICIENCY (DAVE EXCLUSIVE) ══════ */}
          {showTrainingEfficiency && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('training_efficiency', 'TRAINING EFFICIENCY')}</Text>
              <Img src={trainingEfficiencyChartUrl} width="480" height="220" alt="Physiological cost per km trend" style={chartImg} />
              <Text style={chartCaption}>{chartCaptionText('training_efficiency', 'Sport-aware efficiency trend. Runs use strain per kilometer, where lower is better. Rides use watts per strain, where higher is better.')}</Text>
            </Section>
          )}

          {/* ══════ SLEEP → RECOVERY (DAVE EXCLUSIVE) ══════ */}
          {showSleepRecovery && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('sleep_recovery', 'SLEEP → RECOVERY')}</Text>
              <Img src={sleepRecoveryChartUrl} width="480" height="260" alt="Sleep quality vs next-day recovery" style={chartImg} />
              <Text style={chartCaption}>{chartCaptionText('sleep_recovery', "How last night's sleep quality predicts this morning's recovery. Tight cluster = consistent sleep habits. Scattered = variable recovery response.")}</Text>
            </Section>
          )}

          {/* ══════ RACE READINESS (WHOOP only) ══════ */}
          {showRaceReadiness && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('race_readiness', 'RACE READINESS')}</Text>
              <Section style={{ textAlign: 'center' as const }}>
                <Img src={raceReadinessChartUrl} width="200" height="200" alt="Race readiness score" style={{ ...chartImg, maxWidth: '200px', margin: '0 auto' }} />
              </Section>
              {raceReadinessBreakdown && (
                <Section style={readinessBreakdownSection}>
                  <Row style={{ width: '100%' }}>
                    <Column style={readinessMetric}>
                      <Text style={readinessMetricValue}>{raceReadinessBreakdown.recovery}%</Text>
                      <Text style={readinessMetricLabel}>RECOVERY</Text>
                      <Text style={readinessMetricSub}>7-day avg</Text>
                    </Column>
                    {raceReadinessBreakdown.fitness != null && (
                      <Column style={readinessMetric}>
                        <Text style={readinessMetricValue}>{raceReadinessBreakdown.fitness}%</Text>
                        <Text style={readinessMetricLabel}>FITNESS</Text>
                        <Text style={readinessMetricSub}>CTL/ATL form</Text>
                      </Column>
                    )}
                    <Column style={readinessMetric}>
                      <Text style={readinessMetricValue}>{raceReadinessBreakdown.consistency}%</Text>
                      <Text style={readinessMetricLabel}>CONSISTENCY</Text>
                      <Text style={readinessMetricSub}>{raceReadinessBreakdown.consistencyTarget}/week target</Text>
                    </Column>
                    <Column style={readinessMetric}>
                      <Text style={readinessMetricValue}>{raceReadinessBreakdown.specificity}%</Text>
                      <Text style={readinessMetricLabel}>SPECIFICITY</Text>
                      <Text style={readinessMetricSub}>{raceReadinessBreakdown.disciplineLabel}</Text>
                    </Column>
                  </Row>
                </Section>
              )}
            </Section>
          )}

          {/* ══════ TRAINING LOAD ══════ */}
          {showTrainingLoad && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('training_load', '4-WEEK TRAINING LOAD')}</Text>
              <Img src={trainingLoadChartUrl} width="480" height="200" alt="Weekly training load progression" style={chartImg} />
              <Text style={chartCaption}>{chartCaptionText('training_load', 'Total cardiovascular strain per week. Rising weeks = volume building. Strain is HR-based and does not capture power or pace intensity.')}</Text>
            </Section>
          )}

          {/* ══════ HR ZONE DISTRIBUTION ══════ */}
          {showHrZones && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('hr_zones', 'HEART RATE ZONES (14-DAY)')}</Text>
              <Img src={hrZoneChartUrl} width="480" height="200" alt="HR zone distribution" style={chartImg} />
              <Text style={chartCaption}>{chartCaptionText('hr_zones', 'Total training minutes per HR zone. Z1-2 = aerobic base. Z3 = tempo. Z4-5 = threshold/max effort. More Z2 time = better endurance foundation.')}</Text>
            </Section>
          )}

          {/* ══════ RECOVERY-TO-LOAD RATIO (WHOOP only) ══════ */}
          {showRecoveryLoadChart && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('recovery_load_ratio', 'RECOVERY STRAIN INDEX')}</Text>
              <Img src={recoveryLoadChartUrl} width="480" height="220" alt="Recovery to load ratio trend" style={chartImg} />
              <Text style={chartCaption}>{chartCaptionText('recovery_load_ratio', 'Heuristic view of recovery normalized against WHOOP strain. Green = recovered relative to recent load, yellow = normal training stress, red = strained. Orange = 7-day trend.')}</Text>
            </Section>
          )}

          {/* ══════ CONSISTENCY CALENDAR ══════ */}
          {showConsistency && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>{chartHeading('consistency_calendar', '28-DAY ACTIVITY FREQUENCY')}</Text>
              <Img src={consistencyChartUrl} width="480" height="160" alt="Workout consistency calendar" style={chartImg} />
              <Text style={chartCaption}>{chartCaptionText('consistency_calendar', 'Each bar = recorded training sessions for one day. Color = sport type. Blank days mean rest, no recorded workout, or non-training recovery work.')}</Text>
            </Section>
          )}

          {/* ══════ WHOOP SPARKLINE CHARTS ══════ */}
          {(showRecoveryChart || showHrvChart || showStrainChart) && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>7-DAY TRENDS</Text>
              {showRecoveryChart && (
                <>
                  <Text style={chartSubLabel}>{chartHeading('recovery_trend', 'RECOVERY')}</Text>
                  <Img src={recoveryChartUrl} width="480" height="130" alt="Recovery trend" style={{ ...chartImg, marginBottom: '12px' }} />
                </>
              )}
              {showHrvChart && (
                <>
                  <Text style={chartSubLabel}>{chartHeading('hrv_trend', 'HRV')}</Text>
                  <Img src={hrvChartUrl} width="480" height="130" alt="HRV trend" style={{ ...chartImg, marginBottom: '12px' }} />
                </>
              )}
              {showStrainChart && (
                <>
                  <Text style={chartSubLabel}>{chartHeading('strain_trend', 'STRAIN')}</Text>
                  <Img src={strainChartUrl} width="480" height="130" alt="Strain trend" style={chartImg} />
                </>
              )}
            </Section>
          )}

          {/* ══════ FOOTER ══════ */}
          <Section style={footerSection}>
            <Row style={{ width: '100%' }}>
              <Column style={{ verticalAlign: 'bottom' as const, paddingBottom: '24px' }}>
                <Text style={footerName}>{athleteName.toUpperCase()}</Text>
                {athleteTagline && (
                  <Text style={footerTagline}>{athleteTagline.toUpperCase()}</Text>
                )}
                <Text style={footerMuted}>
                  Daily briefing generated by Coach Dave{hasWhoop ? ' from your wearable biometric data.' : '.'}
                </Text>
                <Text style={{ ...footerMuted, marginTop: '4px' }}>meetcoachdave.com</Text>
              </Column>
              <Column style={{ width: '150px', verticalAlign: 'bottom' as const, textAlign: 'right' as const }}>
                <Img
                  src={footerSrc}
                  width="140"
                  height="140"
                  alt="Coach Dave"
                  style={{ height: '140px', width: 'auto', display: 'block', marginLeft: 'auto' }}
                />
              </Column>
            </Row>
          </Section>

          {/* Bottom accent */}
          <Section style={{ background: `linear-gradient(90deg, ${VOLT}, #a8e000, ${VOLT})`, height: '3px', width: '100%' }} />
        </Container>
      </Body>
    </Html>
  );
}

export default DailyBriefingEmail;

// ============================================
// STYLES
// ============================================

const body: React.CSSProperties = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: '40px 0',
};

const wrapper: React.CSSProperties = {
  backgroundColor: DARK_BG,
  maxWidth: '580px',
  margin: '0 auto',
  overflow: 'hidden',
  border: `1px solid ${SUBTLE}`,
};

const headerZone: React.CSSProperties = {
  padding: '24px 24px 18px',
  borderBottom: `1px solid ${SUBTLE}`,
};

const headerLogo: React.CSSProperties = {
  color: VOLT,
  fontSize: '14px',
  fontWeight: 900,
  letterSpacing: '4px',
  margin: '0 0 2px',
  lineHeight: '1',
};

const headerSubtitle: React.CSSProperties = {
  color: LABEL,
  fontSize: '8px',
  letterSpacing: '3px',
  margin: '0',
  lineHeight: '1',
};

const headerDate: React.CSSProperties = {
  color: 'rgba(255,255,255,0.2)',
  fontSize: '9px',
  letterSpacing: '1px',
  margin: '0',
  textAlign: 'right' as const,
};

// --- Hero ---
const heroSection: React.CSSProperties = {
  background: `linear-gradient(140deg, ${HERO_BG} 0%, ${DARK_BG} 55%)`,
  padding: '48px 40px 0',
};

const heroGreeting: React.CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: '11px',
  letterSpacing: '4px',
  fontWeight: 500,
  margin: '0 0 8px',
  lineHeight: '1',
};

const heroName: React.CSSProperties = {
  color: WHITE,
  fontSize: '40px',
  fontWeight: 900,
  letterSpacing: '-1.5px',
  lineHeight: '1',
  margin: '0 0 32px',
};

const heroRecoveryStatus: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '3px',
  fontWeight: 700,
  margin: '0 0 8px',
  lineHeight: '1',
};

const heroRecoveryNumber: React.CSSProperties = {
  fontSize: '104px',
  fontWeight: 900,
  lineHeight: '0.85',
  letterSpacing: '-8px',
  margin: '0 0 16px',
};

const heroRecoverySubtitle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.5px',
  margin: '0',
  lineHeight: '1.4',
};

// --- Sections ---
const sectionPadding: React.CSSProperties = {
  padding: '0 24px 28px',
};

const sectionHeader: React.CSSProperties = {
  color: LABEL,
  fontSize: '9px',
  letterSpacing: '3px',
  fontWeight: 600,
  margin: '0 0 12px',
  lineHeight: '1',
};

// --- Stats Bar ---
const statsBar: React.CSSProperties = {
  padding: '4px 32px',
  borderTop: `1px solid ${SUBTLE}`,
  borderBottom: `1px solid ${SUBTLE}`,
};

const statCell: React.CSSProperties = {
  width: '50%',
  padding: '18px 12px',
  verticalAlign: 'middle' as const,
  textAlign: 'center' as const,
};

const statValue: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 900,
  lineHeight: '1',
  letterSpacing: '-0.4px',
  margin: '0 0 7px',
};

const statArrow: React.CSSProperties = {
  fontSize: '14px',
  verticalAlign: '2px',
};

const statLabel: React.CSSProperties = {
  color: 'rgba(255,255,255,0.45)',
  fontSize: '9px',
  letterSpacing: '1.4px',
  margin: '0',
  lineHeight: '1.25',
};

// --- Charts ---
const chartImg: React.CSSProperties = {
  width: '100%',
  maxWidth: '480px',
  height: 'auto',
  borderRadius: '6px',
  border: `1px solid ${SUBTLE}`,
  display: 'block',
  margin: '0 auto',
};

const chartSubLabel: React.CSSProperties = {
  color: LABEL,
  fontSize: '9px',
  letterSpacing: '2px',
  margin: '0 0 8px',
  lineHeight: '1',
};

const chartCaption: React.CSSProperties = {
  color: 'rgba(255,255,255,0.50)',
  fontSize: '11px',
  lineHeight: '1.5',
  margin: '8px 0 0',
};

// --- Days Since ---
const daysSinceCell: React.CSSProperties = {
  textAlign: 'center' as const,
  verticalAlign: 'top' as const,
  backgroundColor: CARD_BG,
  border: `1px solid #1e1e1e`,
  borderRadius: '10px',
  padding: '20px 8px',
  width: '32%',
};

const daysSinceIcon: React.CSSProperties = {
  fontSize: '22px',
  margin: '0 0 8px',
  lineHeight: '1',
};

const daysSinceValue: React.CSSProperties = {
  color: WHITE,
  fontSize: '24px',
  fontWeight: 900,
  margin: '0',
  lineHeight: '1',
  letterSpacing: '-0.5px',
};

const daysSinceLabel: React.CSSProperties = {
  color: LABEL,
  fontSize: '8px',
  letterSpacing: '2px',
  margin: '6px 0 0',
  lineHeight: '1',
};

// --- Race Readiness Breakdown ---
const readinessBreakdownSection: React.CSSProperties = {
  backgroundColor: CARD_BG,
  border: `1px solid #1e1e1e`,
  borderRadius: '10px',
  padding: '20px 8px',
  marginTop: '12px',
};

const readinessMetric: React.CSSProperties = {
  textAlign: 'center' as const,
  width: '33%',
};

const readinessMetricValue: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 900,
  color: WHITE,
  margin: '0',
  lineHeight: '1',
};

const readinessMetricLabel: React.CSSProperties = {
  fontSize: '9px',
  letterSpacing: '2px',
  color: LABEL,
  margin: '4px 0 2px',
};

const readinessMetricSub: React.CSSProperties = {
  fontSize: '8px',
  color: 'rgba(255,255,255,0.35)',
  margin: '0',
};


// --- Training Call ---
const trainingCallCard: React.CSSProperties = {
  borderLeft: `2px solid ${VOLT}`,
  paddingLeft: '16px',
  paddingTop: '2px',
  paddingBottom: '2px',
};

const trainingCallLabel: React.CSSProperties = {
  color: VOLT,
  fontSize: '9px',
  letterSpacing: '3px',
  fontWeight: 700,
  margin: '0 0 8px',
  lineHeight: '1',
};

const trainingCallText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.80)',
  fontSize: '13px',
  lineHeight: '1.65',
  margin: '0',
};

// --- Coach's Note ---
const coachNoteText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.88)',
  fontSize: '16px',
  lineHeight: '1.85',
  fontStyle: 'italic' as const,
  margin: '0 0 20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
};

const tomorrowText: React.CSSProperties = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: '13px',
  fontStyle: 'italic' as const,
  margin: '0',
  lineHeight: '1.5',
};

const coachSignature: React.CSSProperties = {
  color: 'rgba(255,255,255,0.2)',
  fontSize: '9px',
  letterSpacing: '2px',
  margin: '0',
  lineHeight: '1',
};

// --- Check In ---
const checkinCard: React.CSSProperties = {
  backgroundColor: CARD_BG,
  border: `1px solid rgba(200,255,0,0.12)`,
  borderRadius: '10px',
  padding: '28px',
};

const responseGroupLabel: React.CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: '9px',
  letterSpacing: '3px',
  margin: '0 0 12px',
  lineHeight: '1',
};

const checkinBtnGhost: React.CSSProperties = {
  display: 'block',
  backgroundColor: 'rgba(200,255,0,0.07)',
  border: `1px solid rgba(200,255,0,0.2)`,
  borderRadius: '7px',
  padding: '14px 8px',
  color: VOLT,
  fontSize: '12px',
  fontWeight: 700,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const checkinBtnPrimary: React.CSSProperties = {
  display: 'block',
  backgroundColor: VOLT,
  borderRadius: '8px',
  padding: '16px',
  color: '#000000',
  fontSize: '13px',
  fontWeight: 900,
  letterSpacing: '3px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  textDecoration: 'none',
  textAlign: 'center' as const,
  marginTop: '16px',
};

// --- Footer ---
const footerSection: React.CSSProperties = {
  padding: '0 40px 0',
  borderTop: `1px solid ${SUBTLE}`,
};

const footerName: React.CSSProperties = {
  color: WHITE,
  fontSize: '16px',
  fontWeight: 800,
  letterSpacing: '3px',
  margin: '28px 0 6px',
  lineHeight: '1',
};

const footerTagline: React.CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '11px',
  letterSpacing: '2px',
  margin: '0 0 20px',
  lineHeight: '1',
};

const footerMuted: React.CSSProperties = {
  color: 'rgba(255,255,255,0.45)',
  fontSize: '11px',
  lineHeight: '1.7',
  margin: '0',
};
