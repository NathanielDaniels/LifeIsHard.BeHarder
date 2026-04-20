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
  Font,
  Hr,
} from '@react-email/components';

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
  date: string;
  recoveryScore: number | null;
  recoveryColor: 'green' | 'yellow' | 'red';
  headline: string;
  nextRaceName: string;
  nextRaceDaysOut: number;
  nextRaceDistance: string;
  nationalsDaysOut: number | null;
  periodizationPhase: string;
  trainingCall: string;
  keyNumbers: BriefingKeyNumber[];
  coachNote: string;
  recoveryChartUrl: string;
  hrvChartUrl: string;
  strainChartUrl: string;
  disciplineChartUrl?: string;
  trainingLoadChartUrl?: string;
  recoveryLoadChartUrl?: string;
  raceReadinessChartUrl?: string;
  raceReadinessBreakdown?: { score: number; recovery: number; consistency: number; balance: number };
  consistencyChartUrl?: string;
  hrZoneChartUrl?: string;
  daysSince?: { swim: number | null; bike: number | null; run: number | null };
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

const ORANGE = '#f97316';
const DARK_BG = '#050505';
const CARD_BG = '#0a0a0a';
const GREEN = '#22c55e';
const YELLOW = '#eab308';
const RED = '#ef4444';
const WHITE = '#ffffff';
const MUTED = 'rgba(255,255,255,0.55)';
const SUBTLE = 'rgba(255,255,255,0.08)';

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
    case 'green': return GREEN;
    case 'yellow': return YELLOW;
    case 'red': return RED;
    default: return MUTED;
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

// ============================================
// Component
// ============================================

export default function DailyBriefingEmail({
  date = '2026-04-10',
  recoveryScore = 81,
  recoveryColor = 'green',
  headline = 'Green at 81 — strongest recovery in a week',
  nextRaceName = 'AlphaWin Napa Valley Triathlon',
  nextRaceDaysOut = 1,
  nextRaceDistance = 'Sprint',
  nationalsDaysOut = 121,
  periodizationPhase = 'BUILD',
  trainingCall = 'Race prep only. 15-min shakeout jog, dynamic stretching, mental visualization. Trust the training.',
  keyNumbers = [
    { label: 'HRV', value: '42.0 ms', baseline: '38.0 ms', trend: 'up' as const },
    { label: 'RHR', value: '64 bpm', baseline: '66 bpm', trend: 'up' as const },
    { label: 'SpO2', value: '94.6%', baseline: '95.6%', trend: 'warning' as const },
  ],
  coachNote = "Tomorrow is race day. Your body is ready — 81 recovery, HRV trending up, three days of green in a row. Don't overthink it. Execute the plan, race your race, and leave nothing on the course. This is what we've been building toward.",
  recoveryChartUrl = '',
  hrvChartUrl = '',
  strainChartUrl = '',
  disciplineChartUrl = '',
  trainingLoadChartUrl = '',
  recoveryLoadChartUrl = '',
  raceReadinessChartUrl = '',
  raceReadinessBreakdown,
  consistencyChartUrl = '',
  hrZoneChartUrl = '',
  daysSince,
  responseButtons = [],
  q1Label = '',
  q1Buttons = [],
  q2Label = '',
  q2Buttons = [],
  checkinUrl = '',
}: BriefingEmailProps) {
  const accent = recoveryAccent(recoveryColor);
  const recoveryBg = recoveryBgColor(recoveryColor);
  const recoveryPct = Math.min(100, Math.max(0, recoveryScore ?? 0));

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Bebas Neue"
          fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']}
          webFont={{
            url: 'https://patrickwingert.com/fonts/BebasNeue-Regular.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>

      <Preview>
        {`Recovery: ${recoveryScore ?? '—'} (${recoveryColor.toUpperCase()}) — ${headline}`}
      </Preview>

      <Body style={body}>
        <Container style={wrapper}>
          {/* ══════ TOP ACCENT ══════ */}
          <Section style={{ backgroundColor: accent, height: '3px', width: '100%' }} />

          {/* ══════ HEADER ══════ */}
          <Section style={headerZone}>
            <Text style={systemTag}>{'>'} DAILY BRIEFING // {date}</Text>
            <Text style={systemTag}>{'>'} COACH AI — POWERED BY WHOOP</Text>

            <Text style={ecgLine}>───────╱╲___╱╲───────</Text>

            <Text style={headerTitle}>DAILY BRIEFING</Text>
            <Text style={headerDate}>{date}</Text>
          </Section>

          {/* ══════ RECOVERY SCORE ══════ */}
          <Section style={sectionPadding}>
          <Section style={{ ...recoveryCard, backgroundColor: recoveryBg, borderColor: `${accent}33` }}>
            <Text style={recoveryLabel}>RECOVERY</Text>

            <Row style={{ width: '100%' }}>
              <Column style={{ width: '30%', textAlign: 'center' as const, verticalAlign: 'middle' as const }}>
                <Text style={{ ...recoveryNumber, color: accent }}>
                  {recoveryScore ?? '—'}
                </Text>
              </Column>
              <Column style={{ width: '70%', verticalAlign: 'middle' as const, paddingLeft: '16px' }}>
                <Text style={{ ...recoveryZoneBadge, backgroundColor: `${accent}22`, color: accent }}>
                  {recoveryColor.toUpperCase()}
                </Text>
                <Text style={recoveryHeadline}>{headline}</Text>
              </Column>
            </Row>

            {/* Progress bar */}
            <Section style={{ padding: '12px 0 0' }}>
              <Section style={progressBarBg}>
                <Section style={{ ...progressBarFill, width: `${recoveryPct}%`, backgroundColor: accent }} />
              </Section>
            </Section>
          </Section>
          </Section>

          {/* ══════ TRAINING CALL ══════ */}
          <Section style={sectionPadding}>
            <Text style={sectionHeader}>TODAY&apos;S TRAINING CALL</Text>
            <Section style={trainingCard}>
              {trainingCall.split('\n\n').map((para, i) => (
                <Text key={i} style={{ ...trainingText, marginBottom: '12px' }}>
                  {para.split('\n').map((line, j, arr) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Text>
              ))}
            </Section>
          </Section>

          {/* ══════ COACH'S NOTE ══════ */}
          <Section style={sectionPadding}>
            <Text style={sectionHeader}>COACH&apos;S NOTE</Text>
            <Section style={coachNoteCard}>
              {coachNote.split('\n\n').map((para, i) => (
                <Text key={i} style={{ ...coachNoteText, marginBottom: '14px' }}>
                  {para.split('\n').map((line, j, arr) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Text>
              ))}
            </Section>
          </Section>

          {/* ══════ RACE COUNTDOWN ══════ */}
          <Section style={sectionPadding}>
            <Text style={sectionHeader}>RACE COUNTDOWN</Text>

            <Section style={raceCountdownCard}>
              <Row style={{ width: '100%' }}>
                <Column style={{ width: '70%' }}>
                  <Text style={raceNameText}>{nextRaceName}</Text>
                  <Text style={raceDistanceText}>{nextRaceDistance}</Text>
                </Column>
                <Column style={{ width: '30%', textAlign: 'right' as const }}>
                  <Text style={raceDaysNumber}>
                    {nextRaceDaysOut === 0 ? 'TODAY' : nextRaceDaysOut}
                  </Text>
                  {nextRaceDaysOut > 0 && (
                    <Text style={raceDaysLabel}>DAYS</Text>
                  )}
                </Column>
              </Row>
            </Section>

            {nationalsDaysOut !== null && nationalsDaysOut > 0 && (
              <Section style={nationalsBar}>
                <Row style={{ width: '100%' }}>
                  <Column style={{ width: '10%' }}>
                    <Text style={nationalsStarText}>⭐</Text>
                  </Column>
                  <Column style={{ width: '60%' }}>
                    <Text style={nationalsText}>NATIONALS — MILWAUKEE</Text>
                  </Column>
                  <Column style={{ width: '30%', textAlign: 'right' as const }}>
                    <Text style={nationalsDaysText}>{nationalsDaysOut}d</Text>
                  </Column>
                </Row>
                <Text style={phaseTag}>{periodizationPhase}</Text>
              </Section>
            )}
          </Section>

          {/* ══════ KEY NUMBERS ══════ */}
          {keyNumbers.length > 0 && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>KEY NUMBERS</Text>

              <Row style={{ width: '100%' }}>
                {keyNumbers.map((kn, i) => (
                  <Column key={i} style={keyNumCell}>
                    <Text style={keyNumValue}>
                      {kn.value}{' '}
                      <span style={{ color: trendColor(kn.trend) }}>{trendArrow(kn.trend)}</span>
                    </Text>
                    <Text style={keyNumLabel}>{kn.label}</Text>
                    <Text style={keyNumBaseline}>vs {kn.baseline}</Text>
                  </Column>
                ))}
              </Row>
            </Section>
          )}

          {/* ══════ DAYS SINCE LAST DISCIPLINE ══════ */}
          {daysSince && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>LAST SESSION</Text>
              <Row style={{ width: '100%' }}>
                <Column style={daysSinceCell}>
                  <Text style={daysSinceIcon}>🏊</Text>
                  <Text style={daysSinceValue}>{daysSince.swim === 0 ? 'TODAY' : daysSince.swim != null ? `${daysSince.swim}d` : '—'}</Text>
                  <Text style={daysSinceLabel}>SWIM</Text>
                </Column>
                <Column style={daysSinceCell}>
                  <Text style={daysSinceIcon}>🚴</Text>
                  <Text style={daysSinceValue}>{daysSince.bike === 0 ? 'TODAY' : daysSince.bike != null ? `${daysSince.bike}d` : '—'}</Text>
                  <Text style={daysSinceLabel}>BIKE</Text>
                </Column>
                <Column style={daysSinceCell}>
                  <Text style={daysSinceIcon}>🏃</Text>
                  <Text style={daysSinceValue}>{daysSince.run === 0 ? 'TODAY' : daysSince.run != null ? `${daysSince.run}d` : '—'}</Text>
                  <Text style={daysSinceLabel}>RUN</Text>
                </Column>
              </Row>
            </Section>
          )}

          {/* ══════ DISCIPLINE BALANCE ══════ */}
          {disciplineChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>14-DAY TRAINING BALANCE</Text>
              <Img src={disciplineChartUrl} width="480" height="260" alt="Discipline balance" style={chartImg} />
            </Section>
          )}

          {/* ══════ RACE READINESS ══════ */}
          {raceReadinessChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>RACE READINESS</Text>
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
                    <Column style={readinessMetric}>
                      <Text style={readinessMetricValue}>{raceReadinessBreakdown.consistency}%</Text>
                      <Text style={readinessMetricLabel}>CONSISTENCY</Text>
                      <Text style={readinessMetricSub}>workouts/week</Text>
                    </Column>
                    <Column style={readinessMetric}>
                      <Text style={readinessMetricValue}>{raceReadinessBreakdown.balance}%</Text>
                      <Text style={readinessMetricLabel}>BALANCE</Text>
                      <Text style={readinessMetricSub}>swim/bike/run</Text>
                    </Column>
                  </Row>
                </Section>
              )}
            </Section>
          )}

          {/* ══════ TRAINING LOAD ══════ */}
          {trainingLoadChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>4-WEEK TRAINING LOAD</Text>
              <Img src={trainingLoadChartUrl} width="480" height="200" alt="Weekly training load progression" style={chartImg} />
              <Text style={chartCaption}>Total cardiovascular strain per week. Rising weeks = volume building. Strain is HR-based — doesn&apos;t capture power/pace intensity.</Text>
            </Section>
          )}

          {/* ══════ HR ZONE DISTRIBUTION ══════ */}
          {hrZoneChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>HEART RATE ZONES (14-DAY)</Text>
              <Img src={hrZoneChartUrl} width="480" height="200" alt="HR zone distribution" style={chartImg} />
              <Text style={chartCaption}>Total training minutes per HR zone. Z1-2 = aerobic base. Z3 = tempo. Z4-5 = threshold/max effort. More Z2 time = better endurance foundation.</Text>
            </Section>
          )}

          {/* ══════ RECOVERY-TO-LOAD RATIO ══════ */}
          {recoveryLoadChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>RECOVERY ÷ LOAD RATIO</Text>
              <Img src={recoveryLoadChartUrl} width="480" height="220" alt="Recovery to load ratio trend" style={chartImg} />
              <Text style={chartCaption}>Above green line (2.5) = strong adaptation. Between lines = normal training range. Below red line (1.0) = overreaching, back off. Orange = 7-day trend.</Text>
            </Section>
          )}

          {/* ══════ CONSISTENCY CALENDAR ══════ */}
          {consistencyChartUrl && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>28-DAY ACTIVITY</Text>
              <Img src={consistencyChartUrl} width="480" height="160" alt="Workout consistency calendar" style={chartImg} />
              <Text style={chartCaption}>Each bar = one day. Bar height = workout strain. Color = sport type. Gray = rest day. Gaps show missed training days.</Text>
            </Section>
          )}

          {/* ══════ CHECK IN ══════ */}
          {(q1Buttons.length > 0 || q2Buttons.length > 0 || responseButtons.length > 0) && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>CHECK IN WITH COACH</Text>
              <Section style={responseCard}>
                {/* Question group 1 */}
                {q1Buttons.length > 0 && (
                  <>
                    <Text style={responseGroupLabel}>{q1Label}</Text>
                    <Row style={{ width: '100%', marginBottom: '16px' }}>
                      {q1Buttons.map((btn, i) => (
                        <Column key={i} style={{ width: `${100 / q1Buttons.length}%`, paddingRight: i < q1Buttons.length - 1 ? '4px' : '0', paddingLeft: i > 0 ? '4px' : '0' }}>
                          <Link href={btn.url} style={responseBtnFull}>
                            {btn.label}
                          </Link>
                        </Column>
                      ))}
                    </Row>
                  </>
                )}
                {/* Question group 2 */}
                {q2Buttons.length > 0 && (
                  <>
                    <Text style={responseGroupLabel}>{q2Label}</Text>
                    <Row style={{ width: '100%' }}>
                      {q2Buttons.map((btn, i) => (
                        <Column key={i} style={{ width: `${100 / q2Buttons.length}%`, paddingRight: i < q2Buttons.length - 1 ? '4px' : '0', paddingLeft: i > 0 ? '4px' : '0' }}>
                          <Link href={btn.url} style={responseBtnFull}>
                            {btn.label}
                          </Link>
                        </Column>
                      ))}
                    </Row>
                  </>
                )}
                {/* Fallback: old-style flat buttons if no structured groups */}
                {q1Buttons.length === 0 && q2Buttons.length === 0 && responseButtons.map((btn, i) => (
                  <Link key={i} href={btn.url} style={responseBtn}>
                    {btn.label}
                  </Link>
                ))}
                {checkinUrl && (
                  <Link href={checkinUrl} style={checkinLink}>
                    Tell me more &rarr;
                  </Link>
                )}
              </Section>
            </Section>
          )}

          {/* ══════ FOOTER ══════ */}
          <Section style={footerDivider} />

          <Section style={footerSection}>
            <Text style={footerName}>PATRICK WINGERT</Text>
            <Text style={footerTagline}>DARE2TRI ELITE TEAM ATHLETE</Text>
            <Text style={footerMuted}>
              Daily briefing generated by Coach AI from WHOOP biometric data.
            </Text>
            <Text style={footerMuted}>
              <Link href="https://patrickwingert.com" style={footerLink}>patrickwingert.com</Link>
            </Text>
          </Section>

          {/* Bottom accent */}
          <Section style={{ backgroundColor: accent, height: '2px', width: '100%' }} />
        </Container>
      </Body>
    </Html>
  );
}

// ============================================
// STYLES
// ============================================

const body: React.CSSProperties = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
  padding: '32px 24px 24px',
  textAlign: 'center' as const,
};

const systemTag: React.CSSProperties = {
  fontFamily: '"SF Mono", "Fira Code", monospace',
  fontSize: '10px',
  letterSpacing: '2px',
  color: MUTED,
  margin: '0 0 2px',
  lineHeight: '1.6',
};

const ecgLine: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '14px',
  color: ORANGE,
  margin: '16px 0',
  letterSpacing: '0',
  lineHeight: '1',
  textAlign: 'center' as const,
  opacity: 0.6,
};

const headerTitle: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '36px',
  letterSpacing: '6px',
  color: WHITE,
  margin: '0',
  lineHeight: '1',
  textAlign: 'center' as const,
};

const headerDate: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '12px',
  letterSpacing: '3px',
  color: MUTED,
  margin: '8px 0 0',
  textAlign: 'center' as const,
};

// --- Recovery Card ---
const recoveryCard: React.CSSProperties = {
  margin: '0',
  padding: '24px',
  border: '1px solid',
  borderRadius: '8px',
};

const recoveryLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '3px',
  color: MUTED,
  margin: '0 0 12px',
};

const recoveryNumber: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '64px',
  lineHeight: '1',
  margin: '0',
};

const recoveryZoneBadge: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: '"SF Mono", monospace',
  fontSize: '10px',
  letterSpacing: '2px',
  padding: '4px 12px',
  borderRadius: '4px',
  margin: '0 0 8px',
};

const recoveryHeadline: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
  lineHeight: '1.5',
  color: 'rgba(255,255,255,0.7)',
  margin: '0',
  textTransform: 'none' as const,
};

const progressBarBg: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderRadius: '4px',
  height: '6px',
  width: '100%',
  overflow: 'hidden',
};

const progressBarFill: React.CSSProperties = {
  height: '6px',
  borderRadius: '4px',
};

// --- Race Countdown ---
const sectionPadding: React.CSSProperties = {
  padding: '0 24px 24px',
};

const sectionHeader: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '3px',
  color: MUTED,
  margin: '0 0 12px',
};

const raceCountdownCard: React.CSSProperties = {
  backgroundColor: CARD_BG,
  border: `1px solid ${SUBTLE}`,
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '8px',
};

const raceNameText: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '20px',
  letterSpacing: '1px',
  color: WHITE,
  margin: '0 0 2px',
  lineHeight: '1.2',
};

const raceDistanceText: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '10px',
  letterSpacing: '1px',
  color: MUTED,
  margin: '0',
};

const raceDaysNumber: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '36px',
  color: ORANGE,
  margin: '0',
  lineHeight: '1',
  textAlign: 'right' as const,
};

const raceDaysLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '2px',
  color: MUTED,
  margin: '0',
  textAlign: 'right' as const,
};

const nationalsBar: React.CSSProperties = {
  backgroundColor: 'rgba(249,115,22,0.06)',
  border: `1px solid rgba(249,115,22,0.15)`,
  borderRadius: '8px',
  padding: '12px 20px',
};

const nationalsStarText: React.CSSProperties = {
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.4',
};

const nationalsText: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '10px',
  letterSpacing: '2px',
  color: 'rgba(255,255,255,0.5)',
  margin: '0',
  lineHeight: '1.4',
};

const nationalsDaysText: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '20px',
  color: ORANGE,
  margin: '0',
  lineHeight: '1',
  textAlign: 'right' as const,
};

const phaseTag: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '2px',
  color: ORANGE,
  margin: '8px 0 0',
  opacity: 0.7,
};

// --- Charts ---
const chartLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '2px',
  color: MUTED,
  margin: '0 0 6px',
};

const chartImg: React.CSSProperties = {
  width: '100%',
  maxWidth: '480px',
  height: 'auto',
  borderRadius: '6px',
  border: `1px solid ${SUBTLE}`,
};

const daysSinceCell: React.CSSProperties = {
  textAlign: 'center' as const,
  verticalAlign: 'top' as const,
  backgroundColor: CARD_BG,
  border: `1px solid ${SUBTLE}`,
  borderRadius: '8px',
  padding: '16px 8px',
  width: '33%',
};

const daysSinceIcon: React.CSSProperties = {
  fontSize: '20px',
  margin: '0 0 6px',
  lineHeight: '1',
};

const daysSinceValue: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '28px',
  color: WHITE,
  margin: '0',
  lineHeight: '1',
};

const daysSinceLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '2px',
  color: MUTED,
  margin: '6px 0 0',
};

const readinessBreakdownSection: React.CSSProperties = {
  backgroundColor: CARD_BG,
  border: `1px solid ${SUBTLE}`,
  borderRadius: '8px',
  padding: '16px 8px',
  marginTop: '12px',
};

const readinessMetric: React.CSSProperties = {
  textAlign: 'center' as const,
  width: '33%',
};

const readinessMetricValue: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '22px',
  color: WHITE,
  margin: '0',
  lineHeight: '1',
};

const readinessMetricLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '2px',
  color: MUTED,
  margin: '4px 0 2px',
};

const readinessMetricSub: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '8px',
  color: 'rgba(255,255,255,0.35)',
  margin: '0',
};

const chartCaption: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '11px',
  lineHeight: '1.5',
  color: 'rgba(255,255,255,0.45)',
  margin: '8px 0 0',
  textTransform: 'none' as const,
};

// --- Key Numbers ---
const keyNumCell: React.CSSProperties = {
  textAlign: 'center' as const,
  verticalAlign: 'top' as const,
  backgroundColor: CARD_BG,
  border: `1px solid ${SUBTLE}`,
  borderRadius: '8px',
  padding: '16px 8px',
  width: '33%',
};

const keyNumValue: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '22px',
  color: WHITE,
  margin: '0 0 4px',
  lineHeight: '1',
};

const keyNumLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '2px',
  color: MUTED,
  margin: '0 0 4px',
};

const keyNumBaseline: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  color: 'rgba(255,255,255,0.4)',
  margin: '0',
};

// --- Training Card ---
const trainingCard: React.CSSProperties = {
  backgroundColor: CARD_BG,
  border: `1px solid ${SUBTLE}`,
  borderLeft: `3px solid ${ORANGE}`,
  borderRadius: '0 8px 8px 0',
  padding: '20px',
};

const trainingText: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '15px',
  lineHeight: '1.7',
  color: 'rgba(255,255,255,0.75)',
  margin: '0',
  textTransform: 'none' as const,
};

// --- Coach's Note ---
const coachNoteCard: React.CSSProperties = {
  backgroundColor: 'rgba(249,115,22,0.04)',
  border: `1px solid rgba(249,115,22,0.15)`,
  borderLeft: `3px solid ${ORANGE}`,
  borderRadius: '0 8px 8px 0',
  padding: '20px',
};

const coachNoteText: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '15px',
  lineHeight: '1.8',
  color: 'rgba(255,255,255,0.7)',
  margin: '0',
  fontStyle: 'italic' as const,
  textTransform: 'none' as const,
};

// --- Check In ---
const responseCard: React.CSSProperties = {
  backgroundColor: CARD_BG,
  border: `1px solid ${SUBTLE}`,
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
};

const responseBtn: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(249,115,22,0.08)',
  border: `1px solid rgba(249,115,22,0.25)`,
  borderRadius: '8px',
  padding: '10px 16px',
  color: ORANGE,
  fontSize: '13px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  textDecoration: 'none',
  textAlign: 'center' as const,
  margin: '4px',
};

const responseGroupLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '2px',
  color: MUTED,
  margin: '0 0 8px',
};

const responseBtnFull: React.CSSProperties = {
  display: 'block',
  backgroundColor: 'rgba(249,115,22,0.08)',
  border: `1px solid rgba(249,115,22,0.25)`,
  borderRadius: '8px',
  padding: '12px 8px',
  color: ORANGE,
  fontSize: '13px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const checkinLink: React.CSSProperties = {
  display: 'block',
  color: ORANGE,
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  textDecoration: 'none',
  textAlign: 'center' as const,
  marginTop: '16px',
  padding: '10px 0',
  borderTop: '1px solid rgba(255,255,255,0.1)',
};

// --- Footer ---
const footerDivider: React.CSSProperties = {
  height: '1px',
  backgroundColor: SUBTLE,
  margin: '8px 24px 0',
};

const footerSection: React.CSSProperties = {
  padding: '24px 24px',
  textAlign: 'center' as const,
};

const footerName: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '18px',
  letterSpacing: '6px',
  color: 'rgba(255,255,255,0.5)',
  margin: '0 0 4px',
  textAlign: 'center' as const,
};

const footerTagline: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '3px',
  color: 'rgba(255,255,255,0.4)',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const footerMuted: React.CSSProperties = {
  fontSize: '11px',
  lineHeight: '1.6',
  color: 'rgba(255,255,255,0.35)',
  margin: '0 0 4px',
  textAlign: 'center' as const,
};

const footerLink: React.CSSProperties = {
  color: ORANGE,
  textDecoration: 'none',
};
