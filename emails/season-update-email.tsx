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
const orange = "#f97316";
const darkBg = "#050505";
const cardBg = "#0a0a0a";

const socialLinks = [
  {
    href: SITE,
    label: "WEBSITE",
    iconSrc: `${SITE}/pat-icon-orange.png`,
    size: 38,
  },
  {
    href: "https://www.instagram.com/patwingzzz",
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

export default function SeasonUpdateEmail({ email }: SeasonUpdateEmailProps) {
  const daysSinceAccident = getDaysSince(ACCIDENT_DATE);
  const daysSober = getDaysSince(SOBRIETY_DATE);
  const daysUntilRace = getDaysUntil(NEXT_RACE_DATE);

  return (
    <Html lang="en" dir="ltr">
      <Head>
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
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>

      <Preview>
        The site is updated. The season is loaded. Let's go. patrickwingert.com
      </Preview>

      <Body style={styles.body}>
        <Container style={styles.wrapper}>
          {/* ===== TOP ACCENT ===== */}
          <Section style={{ backgroundColor: orange, height: "3px", width: "100%" }} />

          {/* ===== HEADER ===== */}
          <Section style={styles.headerZone}>
            <Text style={styles.systemTag}>{">"} SEASON UPDATE</Text>
            <Text style={styles.systemTag}>
              {">"} 2026 RACE CALENDAR LOADED // ALL SYSTEMS GO
            </Text>
            <Text style={styles.ecgLine}>───────╱╲___╱╲───────</Text>
            <Text style={styles.headline}>LET'S</Text>
            <Text style={styles.headlineAccent}>GO.</Text>
            <Section style={styles.thinDivider} />
            <Text style={styles.subtitle}>SEASON 2026</Text>
            <Text style={styles.subtitleSmall}>
              SITE UPDATED • SPONSOR LOCKED • CALENDAR LOADED
            </Text>
          </Section>

          {/* ===== INTRO ===== */}
          <Section style={styles.content}>
            <Text style={styles.bodyText}>
              Big updates dropping all at once. Here's what's new.
            </Text>
          </Section>

          {/* ===== SITE UPDATED ===== */}
          <Section style={styles.divider} />
          <Section style={styles.content}>
            <Text style={styles.sectionHeader}>
              PATRICKWINGERT.COM HAS BEEN UPDATED
            </Text>
            <Text style={styles.bodyText}>
              The site has been updated with a race calendar with live
              countdowns, team page, sponsorship info, and real-time biometric
              data powered by WHOOP. This is the hub for everything happening
              this season.
            </Text>
            <Section style={{ textAlign: "center" as const, marginBottom: "8px" }}>
              <Link href={SITE} style={styles.inlineLink}>
                patrickwingert.com
              </Link>
            </Section>
          </Section>

          {/* ===== NEW SPONSOR ===== */}
          <Section style={styles.divider} />
          <Section style={styles.content}>
            <Text style={styles.sectionHeader}>
              NEW TITLE SPONSOR: PERFORMANCE WEALTH PARTNERS
            </Text>
            <Text style={styles.bodyAccent}>PW meets PW.</Text>
            <Text style={styles.bodyText}>
              Performance Wealth Partners, led by Thomas Salvino, is officially
              on board as a Title Sponsor for the 2026 race season. Their
              tagline is "Committed to Excellence," and if you've been following
              this journey, you know that's not just words here.
            </Text>
            <Text style={styles.bodyText}>
              This partnership is built on shared values: discipline,
              transparency, long-term performance. Having PWP behind Team
              Wingert means this season has the backing it deserves.
            </Text>
          </Section>

          {/* ===== RACE CALENDAR ===== */}
          <Section style={styles.divider} />
          <Section style={styles.content}>
            <Text style={styles.sectionHeader}>2026 RACE CALENDAR</Text>
            <Text style={styles.bodyText}>
              The season is stacked. Here's what's coming:
            </Text>
          </Section>

          <Section style={styles.calendarCard}>
            <Text style={styles.calendarGroupLabel}>TRIATHLON</Text>
            {[
              ["APR 11", "Napa Valley Tri", "CA State Championship"],
              ["JUN 7", "Leon's Triathlon", "Hammond, IN"],
              ["JUN 19", "SuperTri Long Beach Legacy", "CA"],
              ["JUN 28", "Pleasant Prairie Tri", "WI"],
              ["AUG 9", "USA Para Tri Nationals", "Milwaukee"],
              ["AUG 23", "SuperTri Chicago", "IL State Championship"],
            ].map(([date, race, note], i) => (
              <Row key={i} style={{ width: "100%", marginBottom: "8px" }}>
                <Column style={styles.calDateCol}>
                  <Text style={styles.calDate}>{date}</Text>
                </Column>
                <Column style={styles.calRaceCol}>
                  <Text style={styles.calRace}>{race}</Text>
                  <Text style={styles.calNote}>{note}</Text>
                </Column>
              </Row>
            ))}

            <Section style={styles.calDivider} />

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
                  <Text style={styles.calRace}>{race}</Text>
                  {note && <Text style={styles.calNote}>{note}</Text>}
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={styles.content}>
            <Text style={styles.bodyMuted}>
              The goal: podium at a state championship, qualify for Nationals,
              and start building toward international competition.
            </Text>
          </Section>

          {/* ===== STATS ===== */}
          <Section style={styles.statsCard}>
            <Text style={styles.statsHeader}>CURRENT READINGS</Text>
            <Row style={{ width: "100%" }}>
              <Column style={styles.statCell}>
                <Text style={styles.statNum}>
                  {daysSinceAccident.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>DAYS SINCE{"\n"}ACCIDENT</Text>
              </Column>
              <Column style={styles.statDivCol}>
                <Text style={styles.statDivText}>|</Text>
              </Column>
              <Column style={styles.statCell}>
                <Text style={styles.statNum}>
                  {daysSober.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>DAYS{"\n"}SOBER</Text>
              </Column>
              <Column style={styles.statDivCol}>
                <Text style={styles.statDivText}>|</Text>
              </Column>
              <Column style={styles.statCell}>
                <Text style={styles.statNum}>
                  {daysUntilRace.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>DAYS UNTIL{"\n"}NEXT RACE</Text>
              </Column>
            </Row>
            <Text style={styles.statsNote}>
              LIVE DATA ON SITE • UPDATED IN REAL-TIME
            </Text>
          </Section>

          {/* ===== CTA ===== */}
          <Section style={styles.ctaWrap}>
            <Link href={SITE} style={styles.ctaButton}>
              VISIT PATRICKWINGERT.COM
            </Link>
          </Section>

          {/* ===== SPONSOR THE SEASON ===== */}
          <Section style={styles.supportWrap}>
            <Text style={styles.supportHeader}>SPONSOR THE SEASON</Text>
            <Text style={styles.supportBody}>
              Want to be part of this? Sponsorship tiers are live on the site,
              from Community Partner ($500) to Title Sponsor ($5,000). Every
              tier gets visibility on patrickwingert.com, social channels, and
              race-day content. Title and Race Partners get logo placement on
              the race kit.
            </Text>
            <Text style={styles.supportBody}>
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

          {/* ===== CLOSING ===== */}
          <Section style={styles.content}>
            <Text style={styles.bodyText}>
              More updates coming as the season kicks off. First race is April
              11 in Napa. Let's go.
            </Text>
          </Section>

          {/* ===== FOOTER ===== */}
          <Section style={styles.footerDivider} />

          <Section style={styles.footer}>
            <Text style={styles.mottoWhite}>LIFE IS HARD.</Text>
            <Text style={styles.mottoOrange}>BE HARDER.</Text>

            <Text style={styles.footerName}>PATRICK WINGERT</Text>
            <Text style={styles.footerTag}>DARE2TRI ELITE TEAM 2026</Text>

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
                    <Text style={styles.socialLabel}>{link.label}</Text>
                  </Link>
                </Column>
              ))}
            </Row>

            <Text style={styles.footerMuted}>
              You're receiving this because {email || "you"} signed up at
              patrickwingert.com.
            </Text>
            <Text style={styles.footerMuted}>
              <Link
                href={`${SITE}/api/unsubscribe${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                style={styles.unsubLink}
              >
                Unsubscribe
              </Link>
            </Text>
            <Text style={styles.footerMuted}>One inspires many.</Text>
          </Section>

          {/* Bottom accent */}
          <Section style={{ backgroundColor: orange, height: "2px", width: "100%" }} />
        </Container>
      </Body>
    </Html>
  );
}

// ============================================
// STYLES
// ============================================

const mono = '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace';
const bebas = '"Bebas Neue", Arial, Helvetica, sans-serif';
const system =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

const styles: Record<string, React.CSSProperties> = {
  // --- Layout ---
  body: {
    backgroundColor: "#000000",
    fontFamily: system,
    margin: 0,
    padding: "40px 0",
  },
  wrapper: {
    backgroundColor: darkBg,
    maxWidth: "580px",
    margin: "0 auto",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  // --- Header ---
  headerZone: {
    padding: "40px 40px 32px",
    textAlign: "center" as const,
  },
  systemTag: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.35)",
    margin: "0 0 2px",
    lineHeight: "1.6",
  },
  ecgLine: {
    fontFamily: mono,
    fontSize: "14px",
    color: orange,
    margin: "20px 0 24px",
    lineHeight: "1",
    textAlign: "center" as const,
    opacity: 0.6,
  },
  headline: {
    fontFamily: bebas,
    fontSize: "52px",
    lineHeight: "0.9",
    color: "#ffffff",
    margin: "0",
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "52px",
    lineHeight: "0.9",
    color: orange,
    margin: "0 0 20px",
    letterSpacing: "2px",
    textAlign: "center" as const,
    textShadow: "0 0 40px rgba(249,115,22,0.4)",
  },
  thinDivider: {
    width: "60px",
    height: "2px",
    backgroundColor: orange,
    margin: "0 auto 20px",
  },
  subtitle: {
    fontFamily: bebas,
    fontSize: "18px",
    letterSpacing: "8px",
    color: "rgba(255,255,255,0.6)",
    margin: "0 0 4px",
    textAlign: "center" as const,
  },
  subtitleSmall: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "2.5px",
    color: "rgba(255,255,255,0.3)",
    margin: "0",
    textAlign: "center" as const,
  },

  // --- Content ---
  content: { padding: "0 40px 32px" },
  divider: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.06)",
    margin: "0 40px 32px",
  },
  sectionHeader: {
    fontFamily: bebas,
    fontSize: "22px",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 16px",
  },
  bodyText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.7)",
    margin: "0 0 16px",
  },
  bodyAccent: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: orange,
    margin: "0 0 16px",
    fontStyle: "italic" as const,
  },
  bodyMuted: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.4)",
    margin: "0",
    fontStyle: "italic" as const,
  },
  inlineLink: {
    fontFamily: mono,
    fontSize: "13px",
    letterSpacing: "1px",
    color: orange,
    textDecoration: "none",
  },

  // --- Calendar ---
  calendarCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: cardBg,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "24px 20px 16px",
  },
  calendarGroupLabel: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "3px",
    color: orange,
    margin: "0 0 14px",
    opacity: 0.7,
  },
  calDateCol: {
    width: "68px",
    verticalAlign: "top" as const,
    paddingRight: "16px",
  },
  calDate: {
    fontFamily: bebas,
    fontSize: "15px",
    letterSpacing: "1px",
    color: orange,
    margin: "0",
    lineHeight: "1.3",
    opacity: 0.8,
  },
  calRaceCol: { verticalAlign: "top" as const },
  calRace: {
    fontSize: "13px",
    lineHeight: "1.3",
    color: "rgba(255,255,255,0.75)",
    margin: "0",
  },
  calNote: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "1px",
    color: "rgba(255,255,255,0.3)",
    margin: "2px 0 0",
    lineHeight: "1.3",
  },
  calDivider: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.06)",
    margin: "12px 0 16px",
  },

  // --- Stats ---
  statsCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: cardBg,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "24px 8px 20px",
    textAlign: "center" as const,
  },
  statsHeader: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "3px",
    color: "rgba(255,255,255,0.4)",
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
    color: "rgba(255,255,255,0.1)",
    fontSize: "24px",
    margin: "0",
    lineHeight: "1",
  },
  statNum: {
    fontFamily: bebas,
    fontSize: "28px",
    color: "#ffffff",
    margin: "0 0 6px",
    lineHeight: "1",
  },
  statLabel: {
    fontFamily: mono,
    fontSize: "8px",
    letterSpacing: "1.5px",
    color: "rgba(255,255,255,0.35)",
    margin: "0",
    lineHeight: "1.4",
    whiteSpace: "pre-line" as const,
  },
  statsNote: {
    fontFamily: mono,
    fontSize: "8px",
    letterSpacing: "2px",
    color: orange,
    margin: "16px 0 0",
    opacity: 0.5,
    textAlign: "center" as const,
  },

  // --- CTA ---
  ctaWrap: {
    padding: "0 40px 36px",
    textAlign: "center" as const,
  },
  ctaButton: {
    display: "inline-block",
    backgroundColor: orange,
    color: "#ffffff",
    fontFamily: bebas,
    fontSize: "18px",
    letterSpacing: "3px",
    padding: "16px 40px",
    borderRadius: "6px",
    textDecoration: "none",
    textAlign: "center" as const,
    boxShadow: "0 0 30px rgba(249,115,22,0.3)",
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
    color: "rgba(255,255,255,0.5)",
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  supportBody: {
    fontSize: "13px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.4)",
    margin: "0 0 16px",
    textAlign: "center" as const,
  },
  supportLink: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "2px",
    color: orange,
    textDecoration: "none",
  },

  // --- Footer ---
  footerDivider: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.06)",
    margin: "0 40px",
  },
  footer: {
    padding: "32px 40px",
    textAlign: "center" as const,
  },
  mottoWhite: {
    fontFamily: bebas,
    fontSize: "24px",
    letterSpacing: "3px",
    color: "rgba(255,255,255,0.6)",
    margin: "0",
    lineHeight: "0.9",
    textAlign: "center" as const,
  },
  mottoOrange: {
    fontFamily: bebas,
    fontSize: "24px",
    letterSpacing: "3px",
    color: orange,
    margin: "0 0 24px",
    lineHeight: "0.9",
    textAlign: "center" as const,
  },
  footerName: {
    fontFamily: bebas,
    fontSize: "18px",
    letterSpacing: "6px",
    color: "rgba(255,255,255,0.5)",
    margin: "0 0 4px",
    textAlign: "center" as const,
  },
  footerTag: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "3px",
    color: "rgba(255,255,255,0.25)",
    margin: "0 0 28px",
    textAlign: "center" as const,
  },

  // --- Social Icons ---
  socialRow: {
    width: "280px",
    margin: "0 auto 28px",
  },
  socialCol: {
    textAlign: "center" as const,
    verticalAlign: "top" as const,
    width: "25%",
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
    color: "rgba(255,255,255,0.3)",
    margin: "0",
    textAlign: "center" as const,
    lineHeight: "1",
  },
  footerMuted: {
    fontSize: "11px",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.2)",
    margin: "0 0 4px",
    textAlign: "center" as const,
  },
  unsubLink: {
    color: "rgba(255,255,255,0.25)",
    textDecoration: "underline",
    fontSize: "11px",
  },
};
