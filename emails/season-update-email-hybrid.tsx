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
 * HYBRID EMAIL — Light default + Dark via @media (prefers-color-scheme: dark)
 *
 * How it works:
 * - Inline styles = LIGHT theme (what Gmail renders — Gmail ignores <style> blocks)
 * - <style> block = @media (prefers-color-scheme: dark) overrides with !important
 *   → Apple Mail, iOS Mail, Outlook (dark mode) pick these up
 *
 * Gmail sees light email → no inversion triggered → renders clean
 * Apple Mail sees dark mode preference → applies dark overrides → renders dark
 * Same HTML file, two appearances.
 *
 * Logo swap: both light and dark logo variants are included. CSS hides/shows
 * the appropriate one per color scheme. Gmail shows the dark (light-bg) logos
 * by default; Apple Mail dark mode swaps to the light (dark-bg) logos.
 */

interface SeasonUpdateEmailProps {
  email?: string;
}

const ACCIDENT_DATE = new Date("2020-11-01");
const SOBRIETY_DATE = new Date("2020-01-20");
const NEXT_RACE_DATE = new Date("2026-04-11");

function getDaysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}
function getDaysUntil(date: Date): number {
  return Math.max(
    0,
    Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );
}

const SITE = "https://patrickwingert.com";

// ============================================
// LIGHT PALETTE (inline default — what Gmail sees)
// ============================================
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

// ============================================
// DARK PALETTE (applied via media query — what Apple Mail sees)
// ============================================
// These map to the original dark email values
const dark = {
  orange: "#f97316",
  pageBg: "#000000",
  containerBg: "#050505",
  cardBg: "#0a0a0a",
  headline: "#e8e8e8",    // white90
  sectionHeader: "#e8e8e8",
  bodyText: "#b3b3b3",    // white70
  mutedText: "#696969",   // white40
  lightMuted: "#5c5c5c",  // white35
  subtitleText: "#9a9a9a", // white60
  supporterBody: "#8e8e8e", // white55
  statNum: "#e8e8e8",
  statLabel: "#5c5c5c",   // white35
  statsHeader: "#696969",
  footerName: "#828282",   // white50
  footerTag: "#434343",    // white25
  footerMuted: "#373737",  // white20
  mottoWhite: "#9a9a9a",  // white60
  supportHeader: "#828282", // white50
  supportBody: "#696969",  // white40
  calRace: "#b3b3b3",
  calNote: "#505050",     // white30
  socialLabel: "#505050",
  border: "#141414",       // white06
  borderCard: "#181818",   // white08
  statDiv: "#1e1e1e",     // white10
  ecgLine: "#f97316",
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

/**
 * Dark mode CSS overrides.
 * Every class prefixed with `h-` (hybrid) gets overridden in dark mode.
 * Apple Mail respects !important overrides on inline styles.
 * Gmail never sees this block.
 */
const darkModeCSS = `
  :root {
    color-scheme: light dark;
    supported-color-schemes: light dark;
  }

  @media (prefers-color-scheme: dark) {
    /* Override all layout layers */
    html,
    body,
    body > table,
    body > table > tbody > tr > td,
    .h-body,
    .h-body > table,
    .h-body > table > tbody > tr > td {
      background-color: ${dark.pageBg} !important;
    }
    .h-wrapper { background-color: ${dark.containerBg} !important; border-color: ${dark.border} !important; }

    /* Cards */
    .h-card { background-color: ${dark.cardBg} !important; border-color: ${dark.borderCard} !important; }

    /* Typography */
    .h-headline { color: ${dark.headline} !important; }
    .h-section-header { color: ${dark.sectionHeader} !important; }
    .h-body-text { color: ${dark.bodyText} !important; }
    .h-muted-text { color: ${dark.mutedText} !important; }
    .h-light-muted { color: ${dark.lightMuted} !important; }
    .h-subtitle { color: ${dark.subtitleText} !important; }
    .h-supporter-body { color: ${dark.supporterBody} !important; }
    .h-stat-num { color: ${dark.statNum} !important; }
    .h-stat-label { color: ${dark.statLabel} !important; }
    .h-stats-header { color: ${dark.statsHeader} !important; }
    .h-stat-div { color: ${dark.statDiv} !important; }
    .h-footer-name { color: ${dark.footerName} !important; }
    .h-footer-tag { color: ${dark.footerTag} !important; }
    .h-footer-muted { color: ${dark.footerMuted} !important; }
    .h-motto-white { color: ${dark.mottoWhite} !important; }
    .h-support-header { color: ${dark.supportHeader} !important; }
    .h-support-body { color: ${dark.supportBody} !important; }
    .h-cal-race { color: ${dark.calRace} !important; }
    .h-cal-note { color: ${dark.calNote} !important; }
    .h-social-label { color: ${dark.socialLabel} !important; }

    /* Dividers */
    .h-divider { background-color: ${dark.border} !important; }
    .h-cal-divider { background-color: ${dark.border} !important; }
    .h-stat-div-col { border-color: ${dark.statDiv} !important; }

    /* Logo swap: hide baked-bg logos, show transparent dark-bg logos */
    .h-logo-baked { display: none !important; max-height: 0 !important; overflow: hidden !important; }
    .h-logo-transparent { display: inline-block !important; max-height: none !important; overflow: visible !important; }

  }
`;

export default function SeasonUpdateEmailHybrid({
  email,
}: SeasonUpdateEmailProps) {
  const daysSinceAccident = getDaysSince(ACCIDENT_DATE);
  const daysSober = getDaysSince(SOBRIETY_DATE);
  const daysUntilRace = getDaysUntil(NEXT_RACE_DATE);

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
        <style dangerouslySetInnerHTML={{ __html: darkModeCSS }} />
      </Head>

      <Preview>
        {`${daysUntilRace} days until race day. Season 2026 is loaded. patrickwingert.com`}
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
              {">"} SEASON UPDATE
            </Text>
            <Text className="h-light-muted" style={styles.systemTag}>
              {">"} 2026 RACE CALENDAR LOADED // ALL SYSTEMS GO
            </Text>
            <Text style={styles.ecgLine}>───────╱╲___╱╲───────</Text>
            <Text className="h-headline" style={styles.headline}>
              LET'S
            </Text>
            <Text style={styles.headlineAccent}>GO!</Text>
            <Section style={styles.thinDivider} />
            <Text className="h-subtitle" style={styles.subtitle}>
              SEASON 2026
            </Text>
          </Section>

          {/* ===== INTRO ===== */}
          <Section style={styles.content}>
            <Text
              className="h-body-text"
              style={{ ...styles.bodyTextStyle, textAlign: "center" as const }}
            >
              Big updates dropping all at once. Race calendar with live
              countdowns, real-time biometrics, team page, and sponsorship info.
              It's all on the site.
            </Text>
          </Section>

          {/* ===== SUPPORTERS ===== */}
          <Section style={styles.sectionAccent} />
          <Section style={styles.content}>
            <Text
              className="h-section-header"
              style={{
                ...styles.sectionHeader,
                textAlign: "center" as const,
              }}
            >
              2026 SUPPORTERS
            </Text>
          </Section>

          {/* PWP — Title Sponsor
               Baked-bg logo (opaque white bg) = visible on ANY background.
               Gmail can't modify pixels inside an image.
               Apple Mail dark mode: CSS hides baked logo, shows transparent light version. */}
          <Section className="h-card" style={styles.supporterCard}>
            <Text style={styles.supporterTier}>TITLE SPONSOR</Text>
            <Section style={styles.logoWrap}>
              {/* Opaque logo with white bg baked in (Gmail default — always visible) */}
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
              {/* Transparent light logo for dark bg (Apple Mail dark mode only) */}
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
            <Text className="h-supporter-body" style={styles.supporterBody}>
              Performance Wealth Partners, led by Thomas Salvino, is officially
              on board for 2026. Built on shared values: discipline,
              transparency, long-term performance. Performance Wealth and I work
              hard to Deliver Above Expectations. We focus on Results because
              Results matter.
            </Text>
            <Section style={styles.linkWrap}>
              <Link
                href="https://performancewealthpartners.com"
                style={styles.inlineLink}
              >
                performancewealthpartners.com
              </Link>
            </Section>
            <Section
              style={{ textAlign: "center" as const, marginTop: "16px" }}
            >
              <Img
                src={`${SITE}/sponsors/pwp_1.jpg`}
                width="500"
                alt="Performance Wealth Partners"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "4px",
                }}
              />
            </Section>
          </Section>

          {/* ATF — Race Partner */}
          <Section className="h-card" style={styles.supporterCard}>
            <Text style={styles.supporterTier}>RACE PARTNER</Text>
            <Section style={styles.logoWrap}>
              {/* Opaque logo with white bg baked in (Gmail default — always visible) */}
              <Img
                className="h-logo-baked"
                src={`${SITE}/sponsors/ATF_logo_email.png`}
                width="180"
                alt="Adaptive Training Foundation"
                style={{ ...styles.sponsorLogo, borderRadius: "6px" }}
              />
              {/* Transparent light logo for dark bg (Apple Mail dark mode only) */}
              <Img
                className="h-logo-transparent"
                src={`${SITE}/sponsors/ATF_logo_light.png`}
                width="180"
                alt=""
                style={{
                  ...styles.sponsorLogo,
                  display: "none",
                  maxHeight: "0",
                  overflow: "hidden" as const,
                }}
              />
            </Section>
            <Text className="h-supporter-body" style={styles.supporterBody}>
              Adaptive Training Foundation builds adaptive athletes through
              world-class coaching and community. Strength has no limitations.
            </Text>
            <Section style={styles.linkWrap}>
              <Link
                href="https://www.adaptivetrainingfoundation.org/"
                style={styles.inlineLink}
              >
                adaptivetrainingfoundation.org
              </Link>
            </Section>
          </Section>

          {/* ===== RACE CALENDAR ===== */}
          <Section style={styles.sectionAccent} />
          <Section style={styles.content}>
            <Text
              className="h-section-header"
              style={{
                ...styles.sectionHeader,
                textAlign: "center" as const,
              }}
            >
              2026 RACE CALENDAR
            </Text>
            <Text
              className="h-muted-text"
              style={{
                ...styles.bodyMuted,
                textAlign: "center" as const,
                margin: "0 0 16px",
              }}
            >
              10 races. 2 sports. 1 goal: Nationals.
            </Text>
          </Section>

          <Section className="h-card" style={styles.calendarCard}>
            <Text style={styles.calendarGroupLabel}>TRIATHLON</Text>
            {[
              ["APR 11", "Napa Valley Tri", "CA State Championship"],
              ["JUN 7", "Leon's Triathlon", "Hammond, IN"],
              ["JUN 28", "Pleasant Prairie Tri", "WI"],
              ["JUL 19", "SuperTri Long Beach Legacy", "CA"],
              ["AUG 9", "USA Para Tri Nationals", "Milwaukee"],
              ["AUG 23", "SuperTri Chicago", "IL State Championship"],
              ["OCT 25", "San Diego Tri Challenge", "CA"],
            ].map(([date, race, note], i) => (
              <Row key={i} style={{ width: "100%", marginBottom: "8px" }}>
                <Column style={styles.calDateCol}>
                  <Text style={styles.calDate}>{date}</Text>
                </Column>
                <Column style={styles.calRaceCol}>
                  <Text className="h-cal-race" style={styles.calRace}>
                    {race}
                  </Text>
                  <Text className="h-cal-note" style={styles.calNote}>
                    {note}
                  </Text>
                </Column>
              </Row>
            ))}

            <Section className="h-cal-divider" style={styles.calDivider} />

            <Text style={styles.calendarGroupLabel}>RUNNING</Text>
            {[
              ["JUL 26", "San Francisco Marathon", ""],
              ["NOV 15", "Berkeley Half Marathon", ""],
              ["DEC 6", "California International Marathon", ""],
            ].map(([date, race, note], i) => (
              <Row key={i} style={{ width: "100%", marginBottom: "8px" }}>
                <Column style={styles.calDateCol}>
                  <Text style={styles.calDate}>{date}</Text>
                </Column>
                <Column style={styles.calRaceCol}>
                  <Text className="h-cal-race" style={styles.calRace}>
                    {race}
                  </Text>
                  {note && (
                    <Text className="h-cal-note" style={styles.calNote}>
                      {note}
                    </Text>
                  )}
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={styles.content}>
            <Text
              className="h-muted-text"
              style={{
                ...styles.bodyMuted,
                textAlign: "center" as const,
              }}
            >
              The goal: podium at a state championship{"\n"}and qualify for
              Nationals in Milwaukee.
            </Text>
          </Section>

          {/* ===== STATS ===== */}
          <Section style={styles.sectionAccent} />
          <Section className="h-card" style={styles.statsCard}>
            <Text className="h-stats-header" style={styles.statsHeader}>
              CURRENT READINGS
            </Text>
            <Row style={{ width: "100%" }}>
              <Column style={styles.statCell}>
                <Text className="h-stat-num" style={styles.statNum}>
                  {daysSinceAccident.toLocaleString()}
                </Text>
                <Text className="h-stat-label" style={styles.statLabel}>
                  DAYS SINCE{"\n"}ACCIDENT
                </Text>
              </Column>
              <Column style={styles.statDivCol}>
                <Text className="h-stat-div" style={styles.statDivText}>
                  |
                </Text>
              </Column>
              <Column style={styles.statCell}>
                <Text className="h-stat-num" style={styles.statNum}>
                  {daysSober.toLocaleString()}
                </Text>
                <Text className="h-stat-label" style={styles.statLabel}>
                  DAYS{"\n"}SOBER
                </Text>
              </Column>
              <Column style={styles.statDivCol}>
                <Text className="h-stat-div" style={styles.statDivText}>
                  |
                </Text>
              </Column>
              <Column style={styles.statCell}>
                <Text className="h-stat-num" style={styles.statNum}>
                  {daysUntilRace.toLocaleString()}
                </Text>
                <Text className="h-stat-label" style={styles.statLabel}>
                  DAYS UNTIL{"\n"}NEXT RACE
                </Text>
              </Column>
            </Row>
            <Text style={styles.statsNote}>
              LIVE DATA ON SITE • UPDATED IN REAL-TIME
            </Text>
          </Section>

          {/* ===== PRIMARY CTA ===== */}
          <Section style={styles.ctaWrap}>
            <Link href={SITE} style={styles.ctaButton}>
              PATRICKWINGERT.COM
            </Link>
          </Section>

          {/* ===== SPONSOR THE SEASON ===== */}
          <Section style={styles.supportWrap}>
            <Text className="h-support-header" style={styles.supportHeader}>
              SPONSOR THE SEASON
            </Text>
            <Text className="h-support-body" style={styles.supportBodyText}>
              Want to be part of this? Sponsorship tiers are live on the site,
              from Community Partner ($500) to Title Sponsor ($5,000). Every
              tier gets visibility on{" "}
              <Link href={SITE} style={styles.inlineLink}>
                patrickwingert.com
              </Link>
              , social channels, and race-day content. Title and Race Partners
              get logo placement on the race kit.
            </Text>
            <Text className="h-support-body" style={styles.supportBodyText}>
              Prefer a tax-deductible route? Dare2Tri is a 501(c)(3) charitable
              organization:
            </Text>
            <Link
              href="https://give.dare2tri.org/fundraiser/6928347"
              style={styles.supportLink}
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

            {/* Social icon row */}
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
              You're receiving this because {email || "you"} signed up at{" "}
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

          {/* Bottom accent */}
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

// ============================================
// STYLES — Light inline defaults (Gmail sees these)
// ============================================

const mono = '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace';
const bebas = '"Bebas Neue", Arial, Helvetica, sans-serif';
const system =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const styles: Record<string, React.CSSProperties> = {
  // --- Layout ---
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

  // --- Header ---
  headerZone: {
    padding: "40px 40px 24px",
    textAlign: "center" as const,
  },
  systemTag: {
    fontFamily: mono,
    fontSize: "10px",
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
    fontSize: "52px",
    lineHeight: "0.9",
    color: light.darkText,
    margin: "0",
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "52px",
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
    letterSpacing: "8px",
    color: light.mutedText,
    margin: "0",
    textAlign: "center" as const,
  },

  // --- Content ---
  sectionAccent: {
    width: "40px",
    height: "2px",
    backgroundColor: light.orange,
    margin: "8px auto 24px",
    opacity: 0.6,
  },
  content: { padding: "0 40px 32px" },
  sectionHeader: {
    fontFamily: bebas,
    fontSize: "22px",
    letterSpacing: "2px",
    color: light.darkText,
    margin: "0 0 8px",
  },
  bodyTextStyle: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: light.bodyText,
    margin: "0 0 16px",
  },
  bodyMuted: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: light.mutedText,
    margin: "0",
    fontStyle: "italic" as const,
  },
  linkWrap: {
    textAlign: "center" as const,
    marginBottom: "8px",
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

  // --- Supporter Cards ---
  supporterCard: {
    margin: "0 auto 40px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "20px 24px 16px",
    textAlign: "center" as const,
  },
  // Dark card — always dark inline so light logos are always visible.
  // Gmail can do whatever it wants to the page; these cards carry their own contrast.
  darkCard: {
    margin: "0 auto 40px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: "#0a0a0a",
    border: "1px solid #181818",
    borderRadius: "8px",
    padding: "20px 24px 16px",
    textAlign: "center" as const,
  },
  darkCardBody: {
    fontSize: "13px",
    lineHeight: "1.7",
    color: "#8e8e8e",
    margin: "0 0 12px",
    textAlign: "center" as const,
  },
  supporterTier: {
    fontFamily: bebas,
    fontSize: "18px",
    letterSpacing: "4px",
    color: light.orange,
    margin: "0 0 14px",
    textAlign: "center" as const,
  },
  supporterBody: {
    fontSize: "13px",
    lineHeight: "1.7",
    color: light.mutedText,
    margin: "0 0 12px",
    textAlign: "center" as const,
  },

  // --- Calendar ---
  calendarCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "24px 20px 16px",
  },
  calendarGroupLabel: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "3px",
    color: light.orangeDark,
    margin: "0 0 14px",
    opacity: 0.7,
  },
  calDateCol: {
    width: "85px",
    verticalAlign: "top" as const,
    paddingRight: "12px",
  },
  calDate: {
    fontFamily: bebas,
    fontSize: "14px",
    letterSpacing: "1px",
    color: light.orangeDark,
    margin: "0",
    lineHeight: "1.3",
    whiteSpace: "nowrap" as const,
  },
  calRaceCol: { verticalAlign: "top" as const },
  calRace: {
    fontSize: "13px",
    lineHeight: "1.3",
    color: light.bodyText,
    margin: "0",
  },
  calNote: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "1px",
    color: light.lightMuted,
    margin: "2px 0 0",
    lineHeight: "1.3",
  },
  calDivider: {
    height: "1px",
    backgroundColor: light.borderLight,
    margin: "12px 0 16px",
  },

  // --- Stats ---
  statsCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "24px 8px 20px",
    textAlign: "center" as const,
  },
  statsHeader: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "3px",
    color: light.lightMuted,
    margin: "0 0 20px",
    textAlign: "center" as const,
  },
  statCell: {
    textAlign: "center" as const,
    verticalAlign: "top" as const,
    padding: "0 4px",
  },
  statDivCol: {
    width: "1px",
    verticalAlign: "middle" as const,
    textAlign: "center" as const,
  },
  statDivText: {
    color: light.borderLight,
    fontSize: "24px",
    margin: "0",
    lineHeight: "1",
  },
  statNum: {
    fontFamily: bebas,
    fontSize: "28px",
    color: light.darkText,
    margin: "0 0 6px",
    lineHeight: "1",
  },
  statLabel: {
    fontFamily: mono,
    fontSize: "8px",
    letterSpacing: "1.5px",
    color: light.lightMuted,
    margin: "0",
    lineHeight: "1.4",
    whiteSpace: "pre-line" as const,
  },
  statsNote: {
    fontFamily: mono,
    fontSize: "8px",
    letterSpacing: "2px",
    color: light.orange,
    margin: "16px 0 0",
    opacity: 0.6,
    textAlign: "center" as const,
  },

  // --- CTA ---
  ctaWrap: {
    padding: "0 40px 48px",
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

  // --- Support ---
  supportWrap: {
    padding: "0 40px 36px",
    textAlign: "center" as const,
  },
  supportHeader: {
    fontFamily: bebas,
    fontSize: "22px",
    letterSpacing: "4px",
    color: light.bodyText,
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  supportBodyText: {
    fontSize: "13px",
    lineHeight: "1.7",
    color: light.mutedText,
    margin: "0 0 16px",
    textAlign: "center" as const,
  },
  supportLink: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "2px",
    color: light.orangeDark,
    textDecoration: "none",
  },

  // --- Footer ---
  footerDivider: {
    height: "1px",
    backgroundColor: light.border,
    margin: "0 40px",
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

  // --- Social Icons ---
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
};
