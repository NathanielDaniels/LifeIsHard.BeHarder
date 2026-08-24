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
  Font,
} from '@react-email/components';
import type {
  EveningBriefingProps,
  PerformanceContext,
  PatternDetection,
  RecoveryCostForecast,
  TemperatureImpact,
  DisciplineRecoveryCost,
} from '@/types/intelligence';

// ============================================
// Colors (shared with morning email)
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

function zoneColor(zone: string): string {
  switch (zone) {
    case 'green': return GREEN;
    case 'yellow': return YELLOW;
    case 'red': return RED;
    default: return MUTED;
  }
}

// ============================================
// Intelligence Card Components
// ============================================

function PerformanceCard({ data }: { data: PerformanceContext }) {
  return (
    <Section style={intelligenceCard}>
      <Text style={cardTag}>&#x26A1; RECOVERY-ADJUSTED PERFORMANCE</Text>
      <Row style={{ width: '100%' }}>
        <Column style={{ width: '25%', textAlign: 'center' as const, verticalAlign: 'middle' as const }}>
          <Text style={{ ...gradeText, color: data.gradeColor }}>{data.grade}</Text>
        </Column>
        <Column style={{ width: '75%', verticalAlign: 'middle' as const, paddingLeft: '16px' }}>
          <Text style={cardHeadline}>
            {data.todayPace} on {data.todayRecoveryColor} ({data.todayRecovery}%)
          </Text>
          <Text style={cardInsight}>{data.comparisonText}</Text>
        </Column>
      </Row>
      <Text style={cardMeta}>
        EPR: {data.effortPerRecovery} (vs {data.comparisonEPR} comparison)
      </Text>
    </Section>
  );
}

function PatternCard({ data }: { data: PatternDetection }) {
  return (
    <Section style={intelligenceCard}>
      <Text style={cardTag}>&#x1F50D; PATTERN DETECTED</Text>
      <Text style={cardHeadline}>{data.pattern}</Text>
      <Row style={{ width: '100%', marginTop: '8px' }}>
        <Column style={{ width: '50%' }}>
          <Text style={cardInsight}>
            Today: {data.todayMatch ? '✅ conditions match' : '❌ conditions don\'t match'}
          </Text>
        </Column>
        <Column style={{ width: '50%', textAlign: 'right' as const }}>
          <Text style={cardMeta}>
            {data.confidence}% confidence ({data.sampleCount} sessions)
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

function ForecastCard({ data }: { data: RecoveryCostForecast }) {
  const color = zoneColor(data.expectedZone);
  return (
    <Section style={intelligenceCard}>
      <Text style={cardTag}>&#x1F52E; TOMORROW&apos;S RECOVERY FORECAST</Text>
      <Row style={{ width: '100%' }}>
        <Column style={{ width: '30%', textAlign: 'center' as const, verticalAlign: 'middle' as const }}>
          <Text style={{ ...forecastZone, color, backgroundColor: `${color}22` }}>
            {data.expectedRange}
          </Text>
        </Column>
        <Column style={{ width: '70%', verticalAlign: 'middle' as const, paddingLeft: '16px' }}>
          <Text style={{ ...cardHeadline, color }}>
            {data.expectedZone.toUpperCase()}
          </Text>
          <Text style={cardInsight}>{data.explanation}</Text>
        </Column>
      </Row>
    </Section>
  );
}

function TemperatureCard({ data }: { data: TemperatureImpact }) {
  const sign = data.paceDeltaSecPerKm > 0 ? '+' : '';
  const direction = data.paceDeltaSecPerKm > 0 ? 'slower' : 'faster';
  return (
    <Section style={intelligenceCard}>
      <Text style={cardTag}>&#x1F321;&#xFE0F; TEMPERATURE IMPACT</Text>
      <Text style={cardHeadline}>
        {sign}{data.paceDeltaSecPerKm} sec/km {direction}
      </Text>
      <Text style={cardInsight}>{data.explanation}</Text>
      {data.raceImplication && (
        <Text style={{ ...cardMeta, color: ORANGE, marginTop: '8px' }}>
          {data.raceImplication}
        </Text>
      )}
    </Section>
  );
}

function DisciplineCostCard({ data }: { data: DisciplineRecoveryCost }) {
  return (
    <Section style={intelligenceCard}>
      <Text style={cardTag}>&#x1F4CA; DISCIPLINE RECOVERY COST</Text>
      <Row style={{ width: '100%', marginTop: '8px' }}>
        {data.disciplines.map((d, i) => (
          <Column key={i} style={disciplineCell}>
            <Text style={disciplineEmoji}>{d.emoji}</Text>
            <Text style={disciplineSport}>{d.sport}</Text>
            <Text style={{ ...disciplineCost, color: d.color || WHITE }}>{d.costPerStrain}</Text>
            <Text style={{ ...disciplineLabel, color: d.color ? `${d.color}99` : 'rgba(255,255,255,0.45)' }}>{d.label}</Text>
          </Column>
        ))}
      </Row>
      {data.insight && (
        <Text style={{ ...cardInsight, marginTop: '12px' }}>{data.insight}</Text>
      )}
    </Section>
  );
}

// ============================================
// Main Component
// ============================================

export default function EveningBriefingEmail({
  date = '2026-05-09',
  workoutName = 'Evening Run',
  workoutSport = 'Run',
  workoutDistance = '5.0 km',
  workoutDuration = '30:00',
  workoutStrain = null,
  intelligence = {},
  coachAnalysis = '',
  q1Label = '',
  q1Buttons = [],
  q2Label = '',
  q2Buttons = [],
  checkinUrl = '',
}: EveningBriefingProps) {
  const sportEmoji: Record<string, string> = {
    Run: '🏃', Ride: '🚴', Swim: '🏊', Bike: '🚴', Walk: '🚶', Rest: '🧘',
  };
  const isRestDay = workoutSport === 'Rest';
  const emoji = isRestDay ? '🧘' : (sportEmoji[workoutSport] || '💪');
  const hasIntelligence = Object.keys(intelligence).length > 0;

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
        {isRestDay
          ? `Evening Debrief — Recovery Day | ${date}`
          : `Evening Debrief — ${workoutSport} ${workoutDistance} | ${date}`}
      </Preview>

      <Body style={body}>
        <Container style={wrapper}>
          {/* ══════ TOP ACCENT ══════ */}
          <Section style={{ backgroundColor: ORANGE, height: '3px', width: '100%' }} />

          {/* ══════ HEADER ══════ */}
          <Section style={headerZone}>
            <Text style={systemTag}>{'>'} EVENING DEBRIEF // {date}</Text>
            <Text style={systemTag}>{'>'} {isRestDay ? 'RECOVERY INTELLIGENCE' : 'POST-WORKOUT INTELLIGENCE'}</Text>

            <Text style={ecgLine}>───────╱╲___╱╲───────</Text>

            <Text style={headerTitle}>EVENING DEBRIEF</Text>
            <Text style={headerDate}>{date}</Text>
          </Section>

          {/* ══════ WORKOUT RECAP HERO / REST DAY HERO ══════ */}
          <Section style={sectionPadding}>
            <Section style={workoutHero}>
              <Text style={workoutEmojiText}>{emoji}</Text>
              <Text style={workoutNameText}>
                {isRestDay ? 'RECOVERY DAY' : workoutName.toUpperCase()}
              </Text>
              {!isRestDay && (
                <Text style={workoutStats}>
                  {workoutDistance && <>{workoutDistance}{'  '}&#x2022;{'  '}</>}
                  {workoutDuration}
                  {workoutStrain != null && (<>{'  '}&#x2022;{'  '}Strain {workoutStrain}</>)}
                </Text>
              )}
              {isRestDay && (
                <Text style={workoutStats}>
                  Strategic rest{'  '}&#x2022;{'  '}Recovery intelligence below
                </Text>
              )}
            </Section>
          </Section>

          {/* ══════ INTELLIGENCE CARDS ══════ */}
          {hasIntelligence && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>INTELLIGENCE</Text>

              {intelligence.performanceContext && (
                <PerformanceCard data={intelligence.performanceContext} />
              )}

              {intelligence.patternDetection && (
                <PatternCard data={intelligence.patternDetection} />
              )}

              {intelligence.recoveryCostForecast && (
                <ForecastCard data={intelligence.recoveryCostForecast} />
              )}

              {intelligence.temperatureImpact && (
                <TemperatureCard data={intelligence.temperatureImpact} />
              )}

              {intelligence.disciplineRecoveryCost && (
                <DisciplineCostCard data={intelligence.disciplineRecoveryCost} />
              )}
            </Section>
          )}

          {/* ══════ COACH'S EVENING ANALYSIS ══════ */}
          {coachAnalysis && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>COACH&apos;S ANALYSIS</Text>
              <Section style={coachCard}>
                {coachAnalysis.split('\n\n').map((para, i) => (
                  <Text key={i} style={{ ...coachText, marginBottom: '14px' }}>
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
          )}

          {/* ══════ CHECK IN ══════ */}
          {(q1Buttons.length > 0 || q2Buttons.length > 0) && (
            <Section style={sectionPadding}>
              <Text style={sectionHeader}>EVENING CHECK IN</Text>
              <Section style={responseCard}>
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
              Evening debrief generated by Coach AI from WHOOP + Strava data.
            </Text>
            <Text style={footerMuted}>
              <Link href="https://patrickwingert.com" style={footerLink}>patrickwingert.com</Link>
            </Text>
          </Section>

          {/* Bottom accent */}
          <Section style={{ backgroundColor: ORANGE, height: '2px', width: '100%' }} />
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

// --- Workout Hero ---
const workoutHero: React.CSSProperties = {
  backgroundColor: CARD_BG,
  border: `1px solid ${SUBTLE}`,
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
};

const workoutEmojiText: React.CSSProperties = {
  fontSize: '32px',
  margin: '0 0 8px',
  lineHeight: '1',
};

const workoutNameText: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '24px',
  letterSpacing: '3px',
  color: WHITE,
  margin: '0 0 8px',
  lineHeight: '1.2',
};

const workoutStats: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '13px',
  letterSpacing: '1px',
  color: MUTED,
  margin: '0',
  lineHeight: '1.4',
};

// --- Section ---
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

// --- Intelligence Cards ---
const intelligenceCard: React.CSSProperties = {
  backgroundColor: 'rgba(249,115,22,0.04)',
  borderLeft: `3px solid ${ORANGE}`,
  borderRadius: '0 8px 8px 0',
  padding: '20px',
  marginBottom: '12px',
};

const cardTag: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  letterSpacing: '3px',
  color: MUTED,
  margin: '0 0 12px',
};

const gradeText: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '48px',
  lineHeight: '1',
  margin: '0',
};

const cardHeadline: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '15px',
  lineHeight: '1.5',
  color: 'rgba(255,255,255,0.85)',
  margin: '0 0 4px',
};

const cardInsight: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
  lineHeight: '1.5',
  color: 'rgba(255,255,255,0.6)',
  margin: '0',
};

const cardMeta: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '11px',
  color: 'rgba(255,255,255,0.4)',
  margin: '8px 0 0',
};

// --- Forecast Zone ---
const forecastZone: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '18px',
  letterSpacing: '1px',
  padding: '8px 12px',
  borderRadius: '6px',
  margin: '0',
  textAlign: 'center' as const,
  lineHeight: '1.2',
};

// --- Discipline Cost ---
const disciplineCell: React.CSSProperties = {
  textAlign: 'center' as const,
  verticalAlign: 'top' as const,
  width: '33%',
  padding: '4px',
};

const disciplineEmoji: React.CSSProperties = {
  fontSize: '20px',
  margin: '0 0 4px',
  lineHeight: '1',
};

const disciplineSport: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '10px',
  letterSpacing: '2px',
  color: MUTED,
  margin: '0 0 4px',
};

const disciplineCost: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '24px',
  color: WHITE,
  margin: '0',
  lineHeight: '1',
};

const disciplineLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: '9px',
  color: 'rgba(255,255,255,0.45)',
  margin: '4px 0 0',
};

// --- Coach Analysis ---
const coachCard: React.CSSProperties = {
  backgroundColor: 'rgba(249,115,22,0.04)',
  border: '1px solid rgba(249,115,22,0.15)',
  borderLeft: `3px solid ${ORANGE}`,
  borderRadius: '0 8px 8px 0',
  padding: '20px',
};

const coachText: React.CSSProperties = {
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
  border: '1px solid rgba(249,115,22,0.25)',
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
