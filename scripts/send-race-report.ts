import React from 'react';
import { render } from '@react-email/render';
import { Html, Head, Body, Container, Section, Text, Font, Preview, Row, Column, Img, Hr } from '@react-email/components';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { recoverySparkline, hrvSparkline, strainSparkline } from '../lib/quickchart';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY not set. Run with: RESEND_API_KEY=... npx tsx scripts/send-race-report.ts');
  process.exit(1);
}

const ORANGE = '#f97316';
const DARK = '#050505';
const CARD = '#0a0a0a';
const GREEN = '#22c55e';
const YELLOW = '#eab308';
const RED = '#ef4444';
const WHITE = '#ffffff';
const MUTED = 'rgba(255,255,255,0.4)';
const SUBTLE = 'rgba(255,255,255,0.08)';

function E(type: any, props: any, ...children: any[]) {
  return React.createElement(type, props, ...children);
}

// Use Patrick's cached history from the briefing script
const dataPath = process.env.WHOOP_DATA_PATH || resolve(__dirname, '../data/patrick-data.json');
const rawData = JSON.parse(readFileSync(dataPath, 'utf-8'));
if (!rawData.snapshots || !Array.isArray(rawData.snapshots)) {
  console.error(`Invalid data file: missing snapshots array in ${dataPath}`);
  process.exit(1);
}
const historyData = rawData.snapshots;

const recoveryChart = recoverySparkline(historyData, 7);
const hrvChart = hrvSparkline(historyData, 7);

// Styles
const sysFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const mono = '"SF Mono", "Fira Code", monospace';
const bebas = '"Bebas Neue", Arial, sans-serif';

const s = {
  body: { backgroundColor: '#000', fontFamily: sysFont, margin: 0, padding: '40px 0' } as React.CSSProperties,
  wrap: { backgroundColor: DARK, maxWidth: '600px', margin: '0 auto', border: `1px solid ${SUBTLE}` } as React.CSSProperties,
  accent: { backgroundColor: ORANGE, height: '3px', width: '100%' } as React.CSSProperties,
  accent2: { backgroundColor: ORANGE, height: '2px', width: '100%' } as React.CSSProperties,
  header: { padding: '40px 40px 8px', textAlign: 'center' as const } as React.CSSProperties,
  tag: { fontFamily: mono, fontSize: '10px', letterSpacing: '2px', color: MUTED, margin: '0 0 2px', lineHeight: '1.6' } as React.CSSProperties,
  ecg: { fontFamily: mono, fontSize: '14px', color: ORANGE, margin: '20px 0', opacity: 0.6, textAlign: 'center' as const } as React.CSSProperties,
  title: { fontFamily: bebas, fontSize: '42px', letterSpacing: '4px', color: WHITE, margin: '0', lineHeight: '1', textAlign: 'center' as const } as React.CSSProperties,
  subtitle: { fontFamily: bebas, fontSize: '22px', letterSpacing: '6px', color: ORANGE, margin: '8px 0 0', textAlign: 'center' as const, textShadow: '0 0 40px rgba(249,115,22,0.4)' } as React.CSSProperties,
  subSmall: { fontFamily: mono, fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', margin: '8px 0 0', textAlign: 'center' as const } as React.CSSProperties,
  divider: { width: '60px', height: '2px', backgroundColor: ORANGE, margin: '0 auto 32px' } as React.CSSProperties,
  pad: { padding: '0 32px 24px' } as React.CSSProperties,
  secHead: { fontFamily: mono, fontSize: '9px', letterSpacing: '3px', color: ORANGE, margin: '0 0 16px', opacity: 0.7 } as React.CSSProperties,
  card: { backgroundColor: CARD, border: `1px solid ${SUBTLE}`, borderRadius: '8px', padding: '20px', marginBottom: '12px' } as React.CSSProperties,
  cardAccent: { backgroundColor: CARD, border: `1px solid ${SUBTLE}`, borderLeft: `3px solid ${ORANGE}`, borderRadius: '0 8px 8px 0', padding: '20px', marginBottom: '12px' } as React.CSSProperties,
  bigNum: { fontFamily: bebas, fontSize: '48px', color: ORANGE, margin: '0', lineHeight: '1', textAlign: 'center' as const } as React.CSSProperties,
  bigLabel: { fontFamily: mono, fontSize: '9px', letterSpacing: '2px', color: MUTED, margin: '4px 0 0', textAlign: 'center' as const } as React.CSSProperties,
  statVal: { fontFamily: bebas, fontSize: '24px', color: WHITE, margin: '0', lineHeight: '1' } as React.CSSProperties,
  statLabel: { fontFamily: mono, fontSize: '8px', letterSpacing: '1.5px', color: MUTED, margin: '4px 0 0' } as React.CSSProperties,
  body15: { fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.75)', margin: '0 0 16px' } as React.CSSProperties,
  body13: { fontSize: '13px', lineHeight: '1.8', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px' } as React.CSSProperties,
  bold: { color: WHITE, fontWeight: 600 } as React.CSSProperties,
  orangeText: { color: ORANGE, fontWeight: 600 } as React.CSSProperties,
  splitRow: { width: '100%', marginBottom: '8px' } as React.CSSProperties,
  splitName: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '0', fontFamily: mono, letterSpacing: '1px' } as React.CSSProperties,
  splitTime: { fontFamily: bebas, fontSize: '22px', color: WHITE, margin: '0', lineHeight: '1', textAlign: 'right' as const } as React.CSSProperties,
  splitPace: { fontFamily: mono, fontSize: '10px', color: MUTED, margin: '2px 0 0', textAlign: 'right' as const } as React.CSSProperties,
  splitPlace: { fontFamily: bebas, fontSize: '18px', color: GREEN, margin: '0', textAlign: 'center' as const } as React.CSSProperties,
  hr: { borderColor: SUBTLE, borderTop: `1px solid ${SUBTLE}`, margin: '8px 0' } as React.CSSProperties,
  chartImg: { width: '100%', maxWidth: '480px', height: 'auto', borderRadius: '6px', border: `1px solid ${SUBTLE}` } as React.CSSProperties,
  chartLabel: { fontFamily: mono, fontSize: '9px', letterSpacing: '2px', color: MUTED, margin: '0 0 6px' } as React.CSSProperties,
  footer: { padding: '24px 40px', textAlign: 'center' as const } as React.CSSProperties,
  footerName: { fontFamily: bebas, fontSize: '18px', letterSpacing: '6px', color: 'rgba(255,255,255,0.5)', margin: '0 0 4px', textAlign: 'center' as const } as React.CSSProperties,
  footerTag: { fontFamily: mono, fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', margin: '0', textAlign: 'center' as const } as React.CSSProperties,
  cell: { textAlign: 'center' as const, verticalAlign: 'top' as const, padding: '12px 4px' } as React.CSSProperties,
};

const email = E(Html, { lang: 'en' },
  E(Head, null,
    E(Font, { fontFamily: 'Bebas Neue', fallbackFontFamily: ['Arial', 'Helvetica', 'sans-serif'], webFont: { url: 'https://patrickwingert.com/fonts/BebasNeue-Regular.woff2', format: 'woff2' }, fontWeight: 400, fontStyle: 'normal' }),
    E('meta', { name: 'color-scheme', content: 'dark' }),
  ),
  E(Preview, null, 'Race Report: AlphaWin Napa Valley Triathlon — 1st Place, 1:29:05'),
  E(Body, { style: s.body },
    E(Container, { style: s.wrap },

      E(Section, { style: s.accent }),

      // ═══ HEADER ═══
      E(Section, { style: s.header },
        E(Text, { style: s.tag }, '> POST-RACE REPORT // APRIL 11, 2026'),
        E(Text, { style: s.tag }, '> WHOOP + RACE DATA ANALYSIS'),
        E(Text, { style: s.ecg }, '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2571\u2572___\u2571\u2572\u2500\u2500\u2500\u2500\u2500\u2500\u2500'),
      ),

      E(Section, { style: { padding: '0 40px 32px', textAlign: 'center' as const } },
        E(Text, { style: s.title }, 'RACE REPORT'),
        E(Text, { style: s.subtitle }, 'ALPHAWIN NAPA VALLEY TRIATHLON'),
        E(Text, { style: s.subSmall }, 'CA STATE CHAMPIONSHIP // SPRINT DISTANCE // APRIL 11, 2026'),
      ),

      E(Section, { style: s.divider }),

      // ═══ RESULT BANNER ═══
      E(Section, { style: { ...s.pad } },
        E(Section, { style: { backgroundColor: 'rgba(34,197,94,0.1)', border: `1px solid rgba(34,197,94,0.2)`, borderRadius: '8px', padding: '24px', textAlign: 'center' as const } },
          E(Text, { style: { fontFamily: mono, fontSize: '9px', letterSpacing: '3px', color: GREEN, margin: '0 0 8px' } }, 'FINAL RESULT'),
          E(Text, { style: { fontFamily: bebas, fontSize: '56px', color: WHITE, margin: '0', lineHeight: '1' } }, '1:29:05'),
          E(Text, { style: { fontFamily: bebas, fontSize: '28px', color: GREEN, margin: '8px 0 4px', letterSpacing: '4px' } }, '1ST PLACE OVERALL'),
          E(Text, { style: { fontFamily: mono, fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '0' } }, 'WON EVERY SPLIT // SWIM \u2022 BIKE \u2022 RUN'),
        ),
      ),

      // ═══ RACE CONDITIONS ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'RACE CONDITIONS'),
        E(Text, { style: s.body13 }, 'Mid-50s\u00B0F, rain throughout, choppy open water swim. Wet roads on a hilly bike course. Challenging conditions that tested equipment, technique, and mental toughness.'),
      ),

      // ═══ SPLIT BREAKDOWN ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'SPLIT BREAKDOWN'),

        // Swim
        E(Section, { style: s.card },
          E(Row, { style: s.splitRow },
            E(Column, { style: { width: '15%', verticalAlign: 'middle' as const } },
              E(Text, { style: { fontSize: '20px', margin: '0' } }, '\uD83C\uDFCA'),
            ),
            E(Column, { style: { width: '45%', verticalAlign: 'middle' as const } },
              E(Text, { style: { ...s.splitName, fontSize: '11px' } }, 'SWIM — 750M'),
              E(Text, { style: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' } }, 'Open water, choppy, cold'),
            ),
            E(Column, { style: { width: '25%', verticalAlign: 'middle' as const } },
              E(Text, { style: s.splitTime }, '19:07'),
              E(Text, { style: s.splitPace }, '2:32/100m'),
            ),
            E(Column, { style: { width: '15%', verticalAlign: 'middle' as const } },
              E(Text, { style: s.splitPlace }, '1ST'),
            ),
          ),
        ),

        // T1
        E(Section, { style: { ...s.card, padding: '12px 20px' } },
          E(Row, { style: { width: '100%' } },
            E(Column, { style: { width: '60%' } },
              E(Text, { style: { ...s.splitName, fontSize: '10px' } }, 'TRANSITION 1'),
            ),
            E(Column, { style: { width: '25%' } },
              E(Text, { style: { ...s.splitTime, fontSize: '18px' } }, '3:05'),
            ),
            E(Column, { style: { width: '15%' } },
              E(Text, { style: { ...s.splitPlace, fontSize: '14px' } }, '1ST'),
            ),
          ),
        ),

        // Bike
        E(Section, { style: s.card },
          E(Row, { style: s.splitRow },
            E(Column, { style: { width: '15%', verticalAlign: 'middle' as const } },
              E(Text, { style: { fontSize: '20px', margin: '0' } }, '\uD83D\uDEB4'),
            ),
            E(Column, { style: { width: '45%', verticalAlign: 'middle' as const } },
              E(Text, { style: { ...s.splitName, fontSize: '11px' } }, 'BIKE — 20KM'),
              E(Text, { style: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' } }, 'Wet roads, hilly course, rain'),
            ),
            E(Column, { style: { width: '25%', verticalAlign: 'middle' as const } },
              E(Text, { style: s.splitTime }, '41:37'),
              E(Text, { style: s.splitPace }, '17.8 mph'),
            ),
            E(Column, { style: { width: '15%', verticalAlign: 'middle' as const } },
              E(Text, { style: s.splitPlace }, '1ST'),
            ),
          ),
        ),

        // T2
        E(Section, { style: { ...s.card, padding: '12px 20px' } },
          E(Row, { style: { width: '100%' } },
            E(Column, { style: { width: '60%' } },
              E(Text, { style: { ...s.splitName, fontSize: '10px' } }, 'TRANSITION 2'),
            ),
            E(Column, { style: { width: '25%' } },
              E(Text, { style: { ...s.splitTime, fontSize: '18px' } }, '1:59'),
            ),
            E(Column, { style: { width: '15%' } },
              E(Text, { style: { ...s.splitPlace, fontSize: '14px' } }, '1ST'),
            ),
          ),
        ),

        // Run
        E(Section, { style: s.card },
          E(Row, { style: s.splitRow },
            E(Column, { style: { width: '15%', verticalAlign: 'middle' as const } },
              E(Text, { style: { fontSize: '20px', margin: '0' } }, '\uD83C\uDFC3'),
            ),
            E(Column, { style: { width: '45%', verticalAlign: 'middle' as const } },
              E(Text, { style: { ...s.splitName, fontSize: '11px' } }, 'RUN — 5KM'),
              E(Text, { style: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' } }, 'Strong finish, closed it out'),
            ),
            E(Column, { style: { width: '25%', verticalAlign: 'middle' as const } },
              E(Text, { style: s.splitTime }, '23:15'),
              E(Text, { style: s.splitPace }, '7:29/mile'),
            ),
            E(Column, { style: { width: '15%', verticalAlign: 'middle' as const } },
              E(Text, { style: s.splitPlace }, '1ST'),
            ),
          ),
        ),
      ),

      // ═══ BIOMETRIC RACE DATA ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'BIOMETRIC RACE DATA — POWERED BY WHOOP'),

        E(Row, { style: { width: '100%' } },
          E(Column, { style: { ...s.cell, backgroundColor: CARD, border: `1px solid ${SUBTLE}`, borderRadius: '8px 0 0 8px' } },
            E(Text, { style: s.statVal }, '14.9'),
            E(Text, { style: s.statLabel }, 'RACE STRAIN'),
          ),
          E(Column, { style: { ...s.cell, backgroundColor: CARD, border: `1px solid ${SUBTLE}` } },
            E(Text, { style: s.statVal }, '149'),
            E(Text, { style: s.statLabel }, 'AVG HR'),
          ),
          E(Column, { style: { ...s.cell, backgroundColor: CARD, border: `1px solid ${SUBTLE}` } },
            E(Text, { style: s.statVal }, '182'),
            E(Text, { style: s.statLabel }, 'MAX HR'),
          ),
          E(Column, { style: { ...s.cell, backgroundColor: CARD, border: `1px solid ${SUBTLE}`, borderRadius: '0 8px 8px 0' } },
            E(Text, { style: s.statVal }, '1,031'),
            E(Text, { style: s.statLabel }, 'CALORIES'),
          ),
        ),

        E(Text, { style: { ...s.body13, marginTop: '16px' } },
          'Race strain of 14.9 out of 21 — a serious effort sustained across 89 minutes. Avg HR of 149 bpm shows controlled, steady pacing. Max HR of 182 hit on the run — you left everything on the course.'
        ),
      ),

      // ═══ RACE MORNING READINESS ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'RACE MORNING READINESS'),

        E(Section, { style: { ...s.card, backgroundColor: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.15)' } },
          E(Row, { style: { width: '100%' } },
            E(Column, { style: { width: '25%', textAlign: 'center' as const, verticalAlign: 'middle' as const } },
              E(Text, { style: { fontFamily: bebas, fontSize: '48px', color: GREEN, margin: '0', lineHeight: '1' } }, '90'),
              E(Text, { style: { fontFamily: mono, fontSize: '9px', letterSpacing: '2px', color: GREEN, margin: '4px 0 0' } }, 'GREEN'),
            ),
            E(Column, { style: { width: '75%', paddingLeft: '16px', verticalAlign: 'middle' as const } },
              E(Text, { style: { ...s.body13, margin: '0' } },
                'Recovery 90 on race morning — 26 points above your 91-day baseline of 64. Your body peaked at the exact right moment.'
              ),
            ),
          ),
        ),

        E(Text, { style: s.body13 },
          'Race-morning numbers vs your 91-day baselines:'
        ),
        E(Row, { style: { width: '100%' } },
          E(Column, { style: { ...s.cell, backgroundColor: CARD, border: `1px solid ${SUBTLE}`, borderRadius: '8px 0 0 8px' } },
            E(Text, { style: { ...s.statVal, color: GREEN } }, '43.2'),
            E(Text, { style: s.statLabel }, 'HRV (ms)'),
            E(Text, { style: { ...s.statLabel, color: GREEN } }, 'vs 32.7 avg \u2191'),
          ),
          E(Column, { style: { ...s.cell, backgroundColor: CARD, border: `1px solid ${SUBTLE}` } },
            E(Text, { style: { ...s.statVal, color: GREEN } }, '54'),
            E(Text, { style: s.statLabel }, 'RHR (bpm)'),
            E(Text, { style: { ...s.statLabel, color: GREEN } }, 'vs 59 avg \u2193'),
          ),
          E(Column, { style: { ...s.cell, backgroundColor: CARD, border: `1px solid ${SUBTLE}`, borderRadius: '0 8px 8px 0' } },
            E(Text, { style: { ...s.statVal, color: GREEN } }, '96.9'),
            E(Text, { style: s.statLabel }, 'SPO2 (%)'),
            E(Text, { style: { ...s.statLabel, color: GREEN } }, 'vs 97.6 avg'),
          ),
        ),
      ),

      // ═══ THE COMEBACK STORY ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'THE 24-HOUR COMEBACK'),
        E(Section, { style: s.cardAccent },
          E(Text, { style: s.body15 },
            'Yesterday you were at recovery 29 — red zone, HRV at a season-low 19.9ms, SpO2 dipped to 92.8%. Twenty-four hours later you posted a 90 recovery and won every split of a state championship triathlon in the rain.'
          ),
          E(Text, { style: s.body15 },
            'This is your recovery signature: your body has an elite-level rebound response. When you give it what it needs — hydration, sleep, rest — it bounces back harder than baseline. That\'s not common. That\'s an advantage you can train around all season.'
          ),
        ),
      ),

      // ═══ 7-DAY TREND CHARTS ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'RACE WEEK TRENDS'),
        E(Section, { style: { marginBottom: '12px' } },
          E(Text, { style: s.chartLabel }, 'RECOVERY'),
          E(Img, { src: recoveryChart, width: '480', height: '130', alt: 'Recovery trend', style: s.chartImg }),
        ),
        E(Section, { style: { marginBottom: '12px' } },
          E(Text, { style: s.chartLabel }, 'HRV (ms)'),
          E(Img, { src: hrvChart, width: '480', height: '130', alt: 'HRV trend', style: s.chartImg }),
        ),
      ),

      // ═══ 90-DAY JOURNEY ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, '90-DAY TRAINING JOURNEY'),
        E(Section, { style: s.card },
          E(Row, { style: { width: '100%', marginBottom: '12px' } },
            E(Column, { style: { ...s.cell } },
              E(Text, { style: s.statVal }, '80'),
              E(Text, { style: s.statLabel }, 'WORKOUTS'),
            ),
            E(Column, { style: { ...s.cell } },
              E(Text, { style: s.statVal }, '6.2'),
              E(Text, { style: s.statLabel }, 'PER WEEK'),
            ),
            E(Column, { style: { ...s.cell } },
              E(Text, { style: s.statVal }, '91'),
              E(Text, { style: s.statLabel }, 'DAYS TRACKED'),
            ),
          ),
          E(Text, { style: s.body13 },
            '80 sessions across 91 days — that\'s 6.2 workouts per week. 41 spins, 22 runs, 2 swims, plus yoga, weightlifting, and recovery work. You built this result one session at a time.'
          ),

          E(Text, { style: { ...s.secHead, margin: '16px 0 8px' } }, 'MONTHLY PROGRESSION'),
          E(Text, { style: { ...s.body13, fontFamily: mono, fontSize: '11px' } },
            'JAN \u2014 Recovery 62, HRV 29.5, 18 workouts (building base)\nFEB \u2014 Recovery 69, HRV 32.8, 25 workouts (volume up, body adapting)\nMAR \u2014 Recovery 64, HRV 34.9, 27 workouts (peak volume, HRV climbing)\nAPR \u2014 Recovery 90 on race day (taper + peak)'
          ),
        ),
      ),

      // ═══ DISCIPLINE BREAKDOWN ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'TRAINING MIX'),
        E(Section, { style: s.card },
          E(Row, { style: { width: '100%' } },
            E(Column, { style: s.cell },
              E(Text, { style: { ...s.statVal, color: ORANGE } }, '41'),
              E(Text, { style: s.statLabel }, 'SPIN/BIKE'),
              E(Text, { style: { ...s.statLabel, fontSize: '7px' } }, '43min avg \u2022 134 HR'),
            ),
            E(Column, { style: s.cell },
              E(Text, { style: { ...s.statVal, color: ORANGE } }, '22'),
              E(Text, { style: s.statLabel }, 'RUNNING'),
              E(Text, { style: { ...s.statLabel, fontSize: '7px' } }, '48min avg \u2022 145 HR'),
            ),
            E(Column, { style: s.cell },
              E(Text, { style: { ...s.statVal, color: ORANGE } }, '2'),
              E(Text, { style: s.statLabel }, 'SWIMMING'),
              E(Text, { style: { ...s.statLabel, fontSize: '7px' } }, '42min avg \u2022 128 HR'),
            ),
          ),
        ),
      ),

      // ═══ RECOVERY PLAN ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'POST-RACE RECOVERY PLAN'),
        E(Section, { style: s.cardAccent },
          E(Text, { style: { ...s.body13, whiteSpace: 'pre-line' as const } },
            '\u25B8 TONIGHT: Hydrate aggressively (3L+), protein-rich meal within 2 hours of finish, gentle stretching, elevate legs for 20 min\n\n\u25B8 TOMORROW (Day +1): Full rest day. Easy walk only if you feel like moving. Focus on sleep — aim for 8+ hours. Anti-inflammatory foods (salmon, berries, leafy greens)\n\n\u25B8 DAY +2: Light 20-min easy spin or swim if recovery is yellow+. No running — let the legs recover from race impact, especially with prosthetic loading\n\n\u25B8 DAY +3: If recovery is green, resume easy training. If yellow, one more easy day. Listen to the numbers\n\n\u25B8 RESIDUAL LIMB: Check for any hot spots or irritation from race-day effort. The 5K run in rain with prosthetic demands attention. If anything looks off, rest an extra day before running again'
          ),
        ),
      ),

      // ═══ NEXT RACE ═══
      E(Section, { style: s.pad },
        E(Text, { style: s.secHead }, 'EYES FORWARD'),
        E(Section, { style: { ...s.card, backgroundColor: 'rgba(249,115,22,0.04)', borderColor: 'rgba(249,115,22,0.15)' } },
          E(Text, { style: { ...s.body15, margin: '0 0 12px' } },
            'Next race: Leon\'s Triathlon in Hammond, IN — June 7 (57 days). That gives you a full 8-week training block to build on what you just proved today.'
          ),
          E(Text, { style: { ...s.body15, margin: '0 0 12px' } },
            'A-Race: USA Para Triathlon National Championships — August 9, Milwaukee (120 days). Today was the opening statement. Nationals is the headline.'
          ),
          E(Text, { style: { fontFamily: bebas, fontSize: '20px', color: ORANGE, margin: '8px 0 0', textAlign: 'center' as const } }, 'THE SEASON STARTS NOW.'),
        ),
      ),

      // ═══ MOTTO ═══
      E(Section, { style: { padding: '8px 40px 32px', textAlign: 'center' as const } },
        E(Text, { style: { fontFamily: bebas, fontSize: '36px', lineHeight: '0.9', color: WHITE, margin: '0', letterSpacing: '2px' } }, 'LIFE IS HARD.'),
        E(Text, { style: { fontFamily: bebas, fontSize: '36px', lineHeight: '0.9', color: ORANGE, margin: '0', letterSpacing: '2px', textShadow: '0 0 40px rgba(249,115,22,0.4)' } }, 'BE HARDER.'),
      ),

      // ═══ FOOTER ═══
      E(Section, { style: { height: '1px', backgroundColor: SUBTLE, margin: '0 40px' } }),
      E(Section, { style: s.footer },
        E(Text, { style: s.footerName }, 'PATRICK WINGERT'),
        E(Text, { style: s.footerTag }, 'DARE2TRI ELITE TEAM ATHLETE'),
      ),

      E(Section, { style: s.accent2 }),
    )
  )
);

async function main() {
  const html = await render(email);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Coach AI <patrick@patrickwingert.com>',
      to: ['patrick@patrickwingert.com', 'nathanieldaniels.dev@gmail.com'],
      subject: 'Race Report: Napa Valley Triathlon — 1st Place Overall, 1:29:05',
      html,
      text: 'AlphaWin Napa Valley Triathlon — 1st Place Overall. 1:29:05. Won every split. Full race report with biometric data analysis inside.',
    }),
  });

  let result;
  try {
    result = await res.json();
  } catch {
    console.error(`ERROR: Non-JSON response (status ${res.status})`);
    process.exit(1);
  }

  if (res.ok) {
    console.log(`SENT: ${result.id || 'success'}`);
  } else {
    console.error(`ERROR (${res.status}): ${JSON.stringify(result)}`);
    process.exit(1);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
