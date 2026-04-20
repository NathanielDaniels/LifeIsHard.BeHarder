import React from "react";
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
  Img,
} from "@react-email/components";

/**
 * RACE REPORT EMAIL — Napa Valley Spring Triathlon 2026
 * Hybrid light/dark mode (same approach as season-update-email-hybrid.tsx)
 *
 * The dangerouslySetInnerHTML usage below is for injecting static CSS
 * for dark mode support. No user input is involved.
 */

interface RaceReportEmailProps {
  email?: string;
}

import { getNextRace, getDaysUntil, parseLocalDate } from "@/lib/race-data";

const SITE = "https://patrickwingert.com";

const light = {
  orange: "#f97316",
  orangeDark: "#ea580c",
  pageBg: "#f5f5f0",
  containerBg: "#fafaf8",
  cardBg: "#ffffff",
  darkText: "#0a0a0a",
  bodyText: "#2a2a2a",
  mutedText: "#6b6b6b",
  lightMuted: "#9a9a9a",
  border: "#e5e5e0",
  borderLight: "#ebebeb",
};

const dark = {
  orange: "#f97316",
  pageBg: "#000000",
  containerBg: "#050505",
  cardBg: "#0a0a0a",
  headline: "#e8e8e8",
  sectionHeader: "#e8e8e8",
  bodyText: "#b3b3b3",
  mutedText: "#696969",
  lightMuted: "#5c5c5c",
  subtitleText: "#9a9a9a",
  supporterBody: "#8e8e8e",
  footerName: "#828282",
  footerTag: "#434343",
  footerMuted: "#373737",
  mottoWhite: "#9a9a9a",
  supportHeader: "#828282",
  supportBody: "#696969",
  socialLabel: "#505050",
  border: "#141414",
  borderCard: "#181818",
  splitLabel: "#5c5c5c",
  splitTime: "#e8e8e8",
  splitPace: "#505050",
};

const socialLinks = [
  {
    href: "https://www.instagram.com/patwingit",
    label: "INSTAGRAM",
    iconSrc: `${SITE}/icons/instagram.png`,
    size: 32,
  },
  {
    href: "https://give.dare2tri.org/fundraiser/6928347",
    label: "DARE2TRI",
    iconSrc: `${SITE}/icons/dare2tri.png`,
    size: 32,
  },
  {
    href: "https://linktr.ee/patrickwingert",
    label: "LINKTREE",
    iconSrc: `${SITE}/icons/linktree.png`,
    size: 32,
  },
];

const darkModeCSSContent = [
  ":root {",
  "  color-scheme: light dark;",
  "  supported-color-schemes: light dark;",
  "}",
  "@media (prefers-color-scheme: dark) {",
  "  html, body, body > table, body > table > tbody > tr > td,",
  `  .h-body, .h-body > table, .h-body > table > tbody > tr > td { background-color: ${dark.pageBg} !important; }`,
  `  .h-wrapper { background-color: ${dark.containerBg} !important; border-color: ${dark.border} !important; }`,
  `  .h-card { background-color: ${dark.cardBg} !important; border-color: ${dark.borderCard} !important; }`,
  `  .h-headline { color: ${dark.headline} !important; }`,
  `  .h-section-header { color: ${dark.sectionHeader} !important; }`,
  `  .h-body-text { color: ${dark.bodyText} !important; }`,
  `  .h-muted-text { color: ${dark.mutedText} !important; }`,
  `  .h-light-muted { color: ${dark.lightMuted} !important; }`,
  `  .h-subtitle { color: ${dark.subtitleText} !important; }`,
  `  .h-supporter-body { color: ${dark.supporterBody} !important; }`,
  `  .h-footer-name { color: ${dark.footerName} !important; }`,
  `  .h-footer-tag { color: ${dark.footerTag} !important; }`,
  `  .h-footer-muted { color: ${dark.footerMuted} !important; }`,
  `  .h-motto-white { color: ${dark.mottoWhite} !important; }`,
  `  .h-support-header { color: ${dark.supportHeader} !important; }`,
  `  .h-support-body { color: ${dark.supportBody} !important; }`,
  `  .h-social-label { color: ${dark.socialLabel} !important; }`,
  `  .h-divider { background-color: ${dark.border} !important; }`,
  `  .h-split-label { color: ${dark.splitLabel} !important; }`,
  `  .h-split-time { color: ${dark.splitTime} !important; }`,
  `  .h-split-pace { color: ${dark.splitPace} !important; }`,
  "  .h-logo-baked { display: none !important; max-height: 0 !important; overflow: hidden !important; }",
  "  .h-logo-transparent { display: inline-block !important; max-height: none !important; overflow: visible !important; }",
  "}",
].join("\n");

export default function RaceReportEmail({ email }: RaceReportEmailProps) {
  const nextRace = getNextRace();
  const daysUntilNext = nextRace ? getDaysUntil(parseLocalDate(nextRace.date)) : 0;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <Font
          fontFamily="Bebas Neue"
          fallbackFontFamily={["Arial", "Helvetica", "sans-serif"]}
          webFont={{
            url: `${SITE}/fonts/BebasNeue-Regular.woff2`,
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        {/* Static CSS for dark mode — no user input, safe to inject */}
        <style>{darkModeCSSContent}</style>
      </Head>

      <Preview>
        First race of the 2026 season. First place. 1:29:05. patrickwingert.com
      </Preview>

      <Body className="h-body" style={styles.body}>
        <Container className="h-wrapper" style={styles.wrapper}>
          {/* ===== TOP ACCENT ===== */}
          <Section
            style={{
              backgroundColor: light.orange,
              height: "3px",
              width: "100%",
            }}
          />

          {/* ===== HEADER ===== */}
          <Section style={styles.headerZone}>
            <Text className="h-light-muted" style={styles.systemTag}>
              {">"} RACE REPORT
            </Text>
            <Text className="h-light-muted" style={styles.systemTag}>
              {">"} ALPHAWIN NAPA VALLEY SPRING TRIATHLON // APRIL 11, 2026
            </Text>
            <Text style={styles.ecgLine}>{"───────╱╲___╱╲───────"}</Text>
            <Text className="h-headline" style={styles.headline}>
              FIRST RACE.
            </Text>
            <Text style={styles.headlineAccent}>FIRST PLACE.</Text>
            <Section style={styles.thinDivider} />
            <Text className="h-subtitle" style={styles.subtitle}>
              CALIFORNIA STATE CHAMPIONSHIP
            </Text>
          </Section>

          {/* ===== HERO IMAGE ===== */}
          {/* TODO: Replace with Patrick's race day / medal photo */}
          <Section style={{ textAlign: "center" as const, padding: "0 0 32px", lineHeight: 0 }}>
            <Link href="https://www.instagram.com/p/DXCeWfDEaFL/" style={{ textDecoration: "none" }}>
              <Img
                src={`${SITE}/hero.jpg?v=4`}
                width="580"
                height="580"
                alt="Patrick Wingert - 1st Place, AlphaWin Napa Valley Triathlon Video"
                style={{
                  display: "block",
                  margin: "0 auto",
                  border: "none",
                  width: "580px",
                  height: "580px",
                  maxWidth: "100%",
                }}
              />
            </Link>
          </Section>

          {/* ===== RESULT CARD ===== */}
          <Section className="h-card" style={styles.resultCard}>
            <Text style={styles.resultLabel}>FINISH TIME</Text>
            <Text style={styles.resultTime}>1:29:05</Text>
            <Text style={styles.resultPlace}>1ST PLACE - GOLD</Text>
            <Text className="h-muted-text" style={styles.resultEvent}>
              AlphaWin Napa Valley Spring Triathlon
            </Text>
            <Text className="h-muted-text" style={styles.resultEvent}>
              USA Triathlon California State Championship
            </Text>
          </Section>

          {/* ===== SPLITS ===== */}
          <Section className="h-card" style={styles.splitsCard}>
            <Text className="h-light-muted" style={styles.splitsHeader}>SPLITS</Text>
            {[
              { leg: "SWIM", time: "19:07", pace: "2:32/100m" },
              { leg: "T1", time: "3:05", pace: "" },
              { leg: "BIKE", time: "41:37", pace: "17.8 mph" },
              { leg: "T2", time: "1:59", pace: "" },
              { leg: "RUN", time: "23:15", pace: "7:29/mi" },
            ].map((split, i) => (
              <Row key={i} style={{ width: "100%", marginBottom: "6px" }}>
                <Column style={styles.splitLegCol}>
                  <Text className="h-split-label" style={styles.splitLeg}>{split.leg}</Text>
                </Column>
                <Column style={styles.splitTimeCol}>
                  <Text className="h-split-time" style={styles.splitTime}>{split.time}</Text>
                </Column>
                <Column style={styles.splitPaceCol}>
                  <Text className="h-split-pace" style={styles.splitPace}>{split.pace}</Text>
                </Column>
              </Row>
            ))}
            <Section style={styles.splitDivider} />
            <Row style={{ width: "100%" }}>
              <Column style={styles.splitLegCol}>
                <Text className="h-split-label" style={{ ...styles.splitLeg, fontWeight: "bold" }}>TOTAL</Text>
              </Column>
              <Column style={styles.splitTimeCol}>
                <Text style={{ ...styles.splitTime, color: light.orange, fontWeight: "bold" }}>1:29:05</Text>
              </Column>
              <Column style={styles.splitPaceCol}>
                <Text style={styles.splitPace}>{""}</Text>
              </Column>
            </Row>
          </Section>

          {/* ===== WHOOP BIOMETRIC DATA ===== */}
          <Section style={styles.sectionAccent} />
          <Section style={styles.content}>
            <Text style={styles.whoopSectionHeader}>
              BIOMETRIC RACE DATA — POWERED BY WHOOP
            </Text>
          </Section>

          {/* Race stats: Strain / Avg HR / Max HR / Calories */}
          <Section className="h-card" style={styles.whoopStatsCard}>
            <Row style={{ width: "100%" }}>
              {[
                { value: "14.9", label: "RACE STRAIN" },
                { value: "149", label: "AVG HR" },
                { value: "182", label: "MAX HR" },
                { value: "1,031", label: "CALORIES" },
              ].map((stat, i) => (
                <Column key={i} style={styles.whoopStatCol}>
                  <Text className="h-headline" style={styles.whoopStatValue}>{stat.value}</Text>
                  <Text className="h-light-muted" style={styles.whoopStatLabel}>{stat.label}</Text>
                </Column>
              ))}
            </Row>
          </Section>

          <Section style={styles.content}>
            <Text className="h-body-text" style={{ ...styles.whoopBodyText }}>
              Race strain of 14.9 out of 21 — a serious effort sustained across 89 minutes. Avg HR of 149 bpm shows controlled, steady pacing. Max HR of 182 hit on the run — Patrick left everything on the course.
            </Text>
          </Section>

          {/* Race Morning Readiness */}
          <Section style={styles.content}>
            <Text style={styles.whoopSectionHeader}>RACE MORNING READINESS</Text>
          </Section>

          <Section style={styles.whoopReadinessCard}>
            <Row style={{ width: "100%" }}>
              <Column style={styles.whoopReadinessScoreCol}>
                <Text style={styles.whoopReadinessScore}>90</Text>
                <Text style={styles.whoopReadinessZone}>GREEN</Text>
              </Column>
              <Column style={styles.whoopReadinessTextCol}>
                <Text className="h-body-text" style={styles.whoopReadinessText}>
                  Recovery 90 on race morning — 26 points above Patrick&apos;s 91-day baseline of 64. Patrick&apos;s body peaked at the exact right moment.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Baseline comparison */}
          <Section style={styles.content}>
            <Text className="h-body-text" style={styles.whoopBaselineLabel}>
              RACE-MORNING NUMBERS VS PATRICK&apos;S 91-DAY BASELINES:
            </Text>
          </Section>

          <Section className="h-card" style={styles.whoopBaselineCard}>
            <Row style={{ width: "100%" }}>
              {[
                { value: "43.2", unit: "HRV (ms)", vs: "vs 32.7 avg ↑" },
                { value: "54", unit: "RHR (bpm)", vs: "vs 59 avg ↓" },
                { value: "96.9", unit: "SPO2 (%)", vs: "vs 97.6 avg" },
              ].map((stat, i) => (
                <Column key={i} style={styles.whoopBaselineCol}>
                  <Text style={styles.whoopBaselineValue}>{stat.value}</Text>
                  <Text className="h-light-muted" style={styles.whoopBaselineUnit}>{stat.unit}</Text>
                  <Text className="h-muted-text" style={styles.whoopBaselineVs}>{stat.vs}</Text>
                </Column>
              ))}
            </Row>
          </Section>

          {/* ===== BODY CONTENT ===== */}
          <Section style={styles.content}>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              Race 1 of the 2026 season is in the books.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              First place in classification at the AlphaWin Napa Valley Spring Triathlon, and a California State Championship gold to start the year.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              But the real story didn&apos;t happen at the finish line.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              It started months ago. Winter mornings in the dark. Brick workouts when nobody&apos;s watching. Long days of stacking effort, building toward something that only matters if you show up when it counts.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              Yesterday counted.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              Mid-50s, driving rain, high winds, big waves, and rough roads. Not ideal conditions. Good. That&apos;s where the work shows up, and grit takes over.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              I took first in classification and went straight to the competition:
            </Text>
          </Section>

          {/* ===== RESULTS LIST ===== */}
          <Section className="h-card" style={styles.resultsListCard}>
            {[
              "2nd in men\u2019s 40\u201344 \uD83E\uDD48",
              "35th overall men",
              "42nd out of 284 age group athletes",
              "Top 15% on the day",
            ].map((item, i) => (
              <Row key={i} style={{ width: "100%", marginBottom: "8px" }}>
                <Column style={{ width: "20px", verticalAlign: "top" as const }}>
                  <Text style={styles.bulletDot}>›</Text>
                </Column>
                <Column style={{ verticalAlign: "top" as const }}>
                  <Text className="h-body-text" style={styles.bulletText}>{item}</Text>
                </Column>
              </Row>
            ))}
            <Text className="h-muted-text" style={styles.resultsNote}>
              Strong start, wanted more — but this is just the first step in a long season.
            </Text>
          </Section>

          {/* ===== PWP THANK YOU ===== */}
          <Section style={styles.sectionAccent} />
          <Section style={styles.content}>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              To Tom and the entire team at Performance Wealth Partners, thank you for stepping in as Title Sponsor for 2026 and backing this before the results were there. That matters. Race 1 is yours.
            </Text>
          </Section>

          {/* PWP Logo */}
          <Section className="h-card" style={styles.supporterCard}>
            <Section style={styles.logoWrap}>
              <Img
                className="h-logo-baked"
                src={`${SITE}/sponsors/performance-wealth-partners-email.png`}
                width="240"
                alt="Performance Wealth Partners"
                style={{
                  ...styles.sponsorLogo,
                  borderRadius: "6px",
                  paddingBottom: "16px",
                }}
              />
              <Img
                className="h-logo-transparent"
                src={`${SITE}/sponsors/performance-wealth-partners-light.png`}
                width="160"
                alt=""
                style={{
                  ...styles.sponsorLogo,
                  paddingBottom: "32px",
                  display: "none",
                  maxHeight: "0",
                  overflow: "hidden" as const,
                }}
              />
            </Section>
          </Section>

          {/* ===== THANK YOUS ===== */}
          <Section style={styles.content}>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              To my Dare2Tri Elite teammates, Adaptive Training Foundation, Challenged Athletes Foundation, David Rotter Prosthetics, and my crew behind the scenes, you&apos;re part of every mile and every result.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              And to my wife, who lives this grind right alongside me, thank you for giving up your time so that I can do nothing but train, recover, eat, sleep, and for keeping me honest and grounded through all of it.
            </Text>
            <Text className="h-body-text" style={{ ...styles.bodyTextStyle, fontWeight: "bold" }}>
              This is a team effort. Always has been.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              We&apos;re just getting started.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              Next race coming soon.
            </Text>
            <Text className="h-body-text" style={{ ...styles.bodyTextStyle, fontStyle: "italic" as const }}>
              Life Is Hard. Be Harder.
            </Text>
            <Text className="h-body-text" style={styles.bodyTextStyle}>
              Patrick 🤘🏻🖤🦿
            </Text>
          </Section>

          {/* ===== NEXT RACE COUNTDOWN ===== */}
          {nextRace && (
            <>
              <Section style={styles.sectionAccent} />
              <Section className="h-card" style={styles.nextRaceCard}>
                <Text className="h-light-muted" style={styles.nextRaceLabel}>NEXT UP</Text>
                <Text style={styles.nextRaceCount}>{daysUntilNext}</Text>
                <Text className="h-light-muted" style={styles.nextRaceDaysLabel}>DAYS</Text>
                <Text className="h-headline" style={styles.nextRaceName}>{nextRace.name.toUpperCase()}</Text>
                <Text className="h-muted-text" style={styles.nextRaceDetails}>
                  {nextRace.location}{nextRace.distance ? ` \u00B7 ${nextRace.distance}` : ""}
                </Text>
              </Section>
            </>
          )}

          {/* ===== PRIMARY CTA ===== */}
          <Section style={styles.ctaWrap}>
            <Link href={SITE} style={styles.ctaButton}>
              PATRICKWINGERT.COM
            </Link>
          </Section>

          {/* ===== DONATION ===== */}
          <Section style={styles.donationSection}>
            <Text className="h-muted-text" style={styles.donationText}>
              Join the team with a tax-deductible donation, Dare2Tri is a 501(c)(3) charitable organization:
            </Text>
            <Link
              href="https://give.dare2tri.org/fundraiser/6928347"
              style={styles.donationLink}
            >
              SUPPORT DARE2TRI →
            </Link>
          </Section>

          {/* ===== FOOTER ===== */}
          <Section className="h-divider" style={styles.footerDivider} />

          <Section style={styles.footer}>
            <Text className="h-motto-white" style={styles.mottoLight}>
              LIFE IS HARD.
            </Text>
            <Text style={styles.mottoOrange}>BE HARDER.</Text>

            <Text className="h-footer-name" style={styles.footerName}>
              PATRICK WINGERT
            </Text>
            <Text className="h-footer-tag" style={styles.footerTag}>
              DARE2TRI ELITE TEAM 2026
            </Text>

            <Row style={styles.socialRow}>
              {socialLinks.map((link, i) => (
                <Column key={i} style={styles.socialCol}>
                  <Link href={link.href} style={{ textDecoration: "none" }}>
                    <Section style={styles.socialIconWrap}>
                      <Img
                        src={link.iconSrc}
                        width={String(link.size || 32)}
                        height={String(link.size || 32)}
                        alt={link.label}
                        style={styles.socialIcon}
                      />
                    </Section>
                    <Text className="h-social-label" style={styles.socialLabel}>
                      {link.label}
                    </Text>
                  </Link>
                </Column>
              ))}
            </Row>

            <Text className="h-footer-muted" style={styles.footerMuted}>
              {"You\u2019re receiving this because"} {email || "you"} signed up at{" "}
              <Link href={SITE} style={styles.footerLink}>
                patrickwingert.com
              </Link>
              .
            </Text>
            <Text className="h-footer-muted" style={styles.footerMuted}>
              <Link
                href={`${SITE}/api/unsubscribe${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                style={styles.unsubLink}
              >
                Unsubscribe
              </Link>
            </Text>
            <Text className="h-footer-muted" style={styles.footerMuted}>
              One inspires many.
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: light.orange,
              height: "2px",
              width: "100%",
            }}
          />
        </Container>
      </Body>
    </Html>
  );
}

const mono = '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace';
const bebas = '"Bebas Neue", Arial, Helvetica, sans-serif';
const system =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: light.pageBg,
    fontFamily: system,
    margin: 0,
    padding: "40px 0",
  },
  wrapper: {
    backgroundColor: light.containerBg,
    maxWidth: "580px",
    margin: "0 auto",
    overflow: "hidden",
    border: `1px solid ${light.border}`,
  },
  headerZone: {
    padding: "40px 40px 24px",
    textAlign: "center" as const,
  },
  systemTag: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "2px",
    color: light.lightMuted,
    margin: "0 0 2px",
    lineHeight: "1.6",
  },
  ecgLine: {
    fontFamily: mono,
    fontSize: "14px",
    color: light.orange,
    margin: "20px 0 24px",
    lineHeight: "1",
    textAlign: "center" as const,
    opacity: 0.6,
  },
  headline: {
    fontFamily: bebas,
    fontSize: "48px",
    lineHeight: "0.9",
    color: light.darkText,
    margin: "0",
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "48px",
    lineHeight: "0.9",
    color: light.orange,
    margin: "0 0 20px",
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  thinDivider: {
    width: "60px",
    height: "2px",
    backgroundColor: light.orange,
    margin: "0 auto 20px",
  },
  subtitle: {
    fontFamily: bebas,
    fontSize: "18px",
    letterSpacing: "6px",
    color: light.mutedText,
    margin: "0",
    textAlign: "center" as const,
  },
  resultCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "28px 24px",
    textAlign: "center" as const,
  },
  resultLabel: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "3px",
    color: light.lightMuted,
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  resultTime: {
    fontFamily: bebas,
    fontSize: "64px",
    lineHeight: "1",
    color: light.orange,
    margin: "0 0 8px",
    letterSpacing: "3px",
    textAlign: "center" as const,
  },
  resultPlace: {
    fontFamily: bebas,
    fontSize: "26px",
    letterSpacing: "4px",
    color: light.darkText,
    margin: "0 0 12px",
    textAlign: "center" as const,
  },
  resultEvent: {
    fontSize: "15px",
    lineHeight: "1.5",
    color: light.mutedText,
    margin: "0",
    textAlign: "center" as const,
  },
  splitsCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "24px 28px 20px",
  },
  splitsHeader: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "3px",
    color: light.lightMuted,
    margin: "0 0 16px",
  },
  splitLegCol: {
    width: "60px",
    verticalAlign: "middle" as const,
  },
  splitTimeCol: {
    width: "80px",
    verticalAlign: "middle" as const,
  },
  splitPaceCol: {
    verticalAlign: "middle" as const,
  },
  splitLeg: {
    fontFamily: mono,
    fontSize: "12px",
    letterSpacing: "2px",
    color: light.lightMuted,
    margin: "0",
    lineHeight: "1.8",
  },
  splitTime: {
    fontFamily: bebas,
    fontSize: "24px",
    color: light.darkText,
    margin: "0",
    lineHeight: "1.4",
    letterSpacing: "1px",
  },
  splitPace: {
    fontFamily: mono,
    fontSize: "12px",
    color: light.lightMuted,
    margin: "0",
    lineHeight: "1.8",
  },
  splitDivider: {
    height: "1px",
    backgroundColor: light.borderLight,
    margin: "8px 0 10px",
  },
  sectionAccent: {
    width: "40px",
    height: "2px",
    backgroundColor: light.orange,
    margin: "8px auto 24px",
    opacity: 0.6,
  },
  content: { padding: "0 40px 32px" },
  bodyTextStyle: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: light.bodyText,
    margin: "0 0 16px",
  },
  logoWrap: {
    textAlign: "center" as const,
    margin: "0 0 12px",
  },
  sponsorLogo: {
    display: "inline-block",
    margin: "0 auto",
  },
  inlineLink: {
    fontFamily: mono,
    fontSize: "12px",
    letterSpacing: "1px",
    color: light.orangeDark,
    textDecoration: "none",
  },

  // --- WHOOP Biometric Section ---
  whoopSectionHeader: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: light.orange,
    margin: "0 0 4px",
    lineHeight: "1.6",
  },
  whoopStatsCard: {
    margin: "0 auto 8px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "20px 8px",
  },
  whoopStatCol: {
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
    borderRight: `1px solid ${light.borderLight}`,
    padding: "0 4px",
    width: "25%",
  },
  whoopStatValue: {
    fontFamily: bebas,
    fontSize: "28px",
    lineHeight: "1",
    color: light.darkText,
    margin: "0 0 4px",
    letterSpacing: "1px",
    textAlign: "center" as const,
  },
  whoopStatLabel: {
    fontFamily: mono,
    fontSize: "8px",
    letterSpacing: "1.5px",
    color: light.lightMuted,
    margin: "0",
    textAlign: "center" as const,
    lineHeight: "1.4",
  },
  whoopBodyText: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: light.bodyText,
    margin: "0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
  },
  whoopReadinessCard: {
    margin: "0 auto 8px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: "rgba(34,197,94,0.06)",
    border: `1px solid rgba(34,197,94,0.2)`,
    borderRadius: "8px",
    padding: "20px 24px",
  },
  whoopReadinessScoreCol: {
    width: "90px",
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
  },
  whoopReadinessScore: {
    fontFamily: bebas,
    fontSize: "56px",
    lineHeight: "1",
    color: "#16a34a",
    margin: "0",
    textAlign: "center" as const,
  },
  whoopReadinessZone: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "2px",
    color: "#16a34a",
    margin: "4px 0 0",
    textAlign: "center" as const,
  },
  whoopReadinessTextCol: {
    verticalAlign: "middle" as const,
    paddingLeft: "16px",
  },
  whoopReadinessText: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: light.bodyText,
    margin: "0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
  },
  whoopBaselineLabel: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "1px",
    color: light.bodyText,
    margin: "0",
    textTransform: "uppercase" as const,
  },
  whoopBaselineCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "20px 8px",
  },
  whoopBaselineCol: {
    textAlign: "center" as const,
    verticalAlign: "top" as const,
    width: "33.33%",
    padding: "0 4px",
  },
  whoopBaselineValue: {
    fontFamily: bebas,
    fontSize: "32px",
    lineHeight: "1",
    color: "#16a34a",
    margin: "0 0 4px",
    textAlign: "center" as const,
  },
  whoopBaselineUnit: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "1.5px",
    color: light.lightMuted,
    margin: "0 0 6px",
    textAlign: "center" as const,
    lineHeight: "1.4",
  },
  whoopBaselineVs: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "0.5px",
    color: light.mutedText,
    margin: "0",
    textAlign: "center" as const,
  },

  supporterCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "20px 24px 16px",
    textAlign: "center" as const,
  },
  resultsListCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "20px 24px 16px",
  },
  bulletDot: {
    color: light.orange,
    fontSize: "18px",
    fontFamily: mono,
    margin: "0",
    lineHeight: "1.7",
  },
  bulletText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: light.bodyText,
    margin: "0",
  },
  resultsNote: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: light.mutedText,
    margin: "16px 0 0",
    fontStyle: "italic" as const,
  },
  supporterTier: {
    fontFamily: bebas,
    fontSize: "20px",
    letterSpacing: "4px",
    color: light.orange,
    margin: "0 0 14px",
    textAlign: "center" as const,
  },
  ctaWrap: {
    padding: "0 40px 16px",
    textAlign: "center" as const,
  },
  ctaButton: {
    display: "inline-block",
    backgroundColor: light.orange,
    color: "#ffffff",
    fontFamily: bebas,
    fontSize: "18px",
    letterSpacing: "3px",
    padding: "16px 40px",
    borderRadius: "6px",
    textDecoration: "none",
    textAlign: "center" as const,
  },
  footerDivider: {
    height: "1px",
    backgroundColor: light.border,
    margin: "0 40px",
  },
  donationSection: {
    padding: "16px 40px 40px",
    textAlign: "center" as const,
  },
  donationText: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: light.mutedText,
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  donationLink: {
    fontFamily: mono,
    fontSize: "12px",
    color: light.orange,
    textDecoration: "underline",
    fontWeight: "bold" as const,
    letterSpacing: "0.5px",
  },
  footer: {
    padding: "32px 40px",
    textAlign: "center" as const,
  },
  mottoLight: {
    fontFamily: bebas,
    fontSize: "24px",
    letterSpacing: "3px",
    color: light.mutedText,
    margin: "0",
    lineHeight: "0.9",
    textAlign: "center" as const,
  },
  mottoOrange: {
    fontFamily: bebas,
    fontSize: "24px",
    letterSpacing: "3px",
    color: light.orange,
    margin: "0 0 24px",
    lineHeight: "0.9",
    textAlign: "center" as const,
  },
  footerName: {
    fontFamily: bebas,
    fontSize: "18px",
    letterSpacing: "6px",
    color: light.bodyText,
    margin: "0 0 4px",
    textAlign: "center" as const,
  },
  footerTag: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "3px",
    color: light.lightMuted,
    margin: "0 0 28px",
    textAlign: "center" as const,
  },
  socialRow: {
    width: "220px",
    margin: "0 auto 28px",
  },
  socialCol: {
    textAlign: "center" as const,
    verticalAlign: "top" as const,
    width: "33.33%",
  },
  socialIconWrap: {
    height: "40px",
    textAlign: "center" as const,
    verticalAlign: "bottom" as const,
  },
  socialIcon: {
    display: "block",
    margin: "0 auto",
  },
  socialLabel: {
    fontFamily: mono,
    fontSize: "7px",
    letterSpacing: "1.5px",
    color: light.lightMuted,
    margin: "0",
    textAlign: "center" as const,
    lineHeight: "1",
  },
  footerMuted: {
    fontSize: "11px",
    lineHeight: "1.6",
    color: light.lightMuted,
    margin: "0 0 4px",
    textAlign: "center" as const,
  },
  footerLink: {
    color: light.orangeDark,
    textDecoration: "none",
    fontSize: "11px",
  },
  unsubLink: {
    color: light.orangeDark,
    textDecoration: "underline",
    fontSize: "11px",
  },

  // Next race countdown
  nextRaceCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "28px 24px",
    textAlign: "center" as const,
  },
  nextRaceLabel: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "3px",
    color: light.lightMuted,
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  nextRaceCount: {
    fontFamily: bebas,
    fontSize: "72px",
    lineHeight: "1",
    color: light.orange,
    margin: "0",
    letterSpacing: "3px",
    textAlign: "center" as const,
  },
  nextRaceDaysLabel: {
    fontFamily: mono,
    fontSize: "12px",
    letterSpacing: "4px",
    color: light.lightMuted,
    margin: "0 0 16px",
    textAlign: "center" as const,
  },
  nextRaceName: {
    fontFamily: bebas,
    fontSize: "26px",
    letterSpacing: "2px",
    color: light.darkText,
    margin: "0 0 4px",
    textAlign: "center" as const,
  },
  nextRaceDetails: {
    fontSize: "15px",
    lineHeight: "1.5",
    color: light.mutedText,
    margin: "0",
    textAlign: "center" as const,
  },
};
