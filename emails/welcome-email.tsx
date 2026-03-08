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
} from "@react-email/components";

interface WelcomeEmailProps {
  email?: string;
}

// ============================================
// Calculate live counters (same as site)
// ============================================
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

export default function WelcomeEmail({ email }: WelcomeEmailProps) {
  const orange = "#f97316";
  const darkBg = "#050505";
  const cardBg = "#0a0a0a";

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
            url: "https://patrickwingert.com/fonts/BebasNeue-Regular.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>

      <Preview>
        You're on the list. Something unstoppable is coming — patrickwingert.com
      </Preview>

      <Body style={body}>
        <Container style={wrapper}>
          {/* ========== TOP ORANGE ACCENT BAR ========== */}
          <Section
            style={{ backgroundColor: orange, height: "3px", width: "100%" }}
          />

          {/* ========== HEADER ZONE ========== */}
          <Section style={headerZone}>
            {/* Monospace system tag */}
            <Text style={systemTag}>{">"} TRANSMISSION RECEIVED</Text>
            <Text style={systemTag}>
              {">"} SIGNAL LOCKED — SUBSCRIBER VERIFIED
            </Text>

            {/* Decorative ECG line (ASCII art) */}
            <Text style={ecgLine}>───────╱╲___╱╲───────</Text>

            {/* Main headline */}
            <Text style={headline}>LIFE IS HARD.</Text>
            <Text style={headlineAccent}>BE HARDER.</Text>

            {/* Thin divider */}
            <Section style={thinDivider} />

            {/* Subtitle */}
            <Text style={subtitle}>PATRICK WINGERT</Text>
            <Text style={subtitleSmall}>
              DARE2TRI ELITE TEAM ATHLETE • ADAPTIVE TRIATHLETE
            </Text>
          </Section>

          {/* ========== BODY CONTENT ========== */}
          <Section style={contentSection}>
            <Text style={bodyText}>You just locked in your spot.</Text>
            <Text style={bodyText}>
              An immersive digital experience is being built, documenting every
              mile, every heartbeat, every moment of a journey that was never
              supposed to happen. Live biometrics. Real data. No filter.
            </Text>
            <Text style={bodyTextMuted}>
              When the full site drops, you'll be the first to know.
            </Text>
          </Section>

          {/* ========== STATS PREVIEW CARD ========== */}
          <Section style={statsCard}>
            <Text style={statsCardHeader}>CURRENT READINGS</Text>

            <Row style={{ width: "100%" }}>
              <Column style={statCell}>
                <Text style={statNumber}>
                  {daysSinceAccident.toLocaleString()}
                </Text>
                <Text style={statLabel}>DAYS SINCE{"\n"}ACCIDENT</Text>
              </Column>
              <Column style={statDividerCol}>
                <Text style={statDividerText}>│</Text>
              </Column>
              <Column style={statCell}>
                <Text style={statNumber}>{daysSober.toLocaleString()}</Text>
                <Text style={statLabel}>DAYS{"\n"}SOBER</Text>
              </Column>
              <Column style={statDividerCol}>
                <Text style={statDividerText}>│</Text>
              </Column>
              <Column style={statCell}>
                <Text style={statNumber}>{daysUntilRace.toLocaleString()}</Text>
                <Text style={statLabel}>DAYS UNTIL{"\n"}NEXT RACE</Text>
              </Column>
            </Row>

            <Text style={statsFooterNote}>
              LIVE DATA • UPDATED IN REAL-TIME ON SITE
            </Text>
          </Section>

          {/* ========== CTA BUTTON ========== */}
          <Section style={ctaSection}>
            <Link href="https://patrickwingert.com" style={ctaButton}>
              VISIT PATRICKWINGERT.COM
            </Link>
          </Section>

          {/* ========== WHAT'S COMING TEASER ========== */}
          <Section style={teaserSection}>
            <Text style={teaserHeader}>WHAT'S COMING</Text>

            <Row style={{ width: "100%", marginBottom: "12px" }}>
              <Column style={teaserBulletCol}>
                <Text style={teaserBullet}>▸</Text>
              </Column>
              <Column style={teaserTextCol}>
                <Text style={teaserText}>
                  Live heart rate & biometrics powered by WHOOP
                </Text>
              </Column>
            </Row>
            <Row style={{ width: "100%", marginBottom: "12px" }}>
              <Column style={teaserBulletCol}>
                <Text style={teaserBullet}>▸</Text>
              </Column>
              <Column style={teaserTextCol}>
                <Text style={teaserText}>
                  The full story from accident to elite athlete
                </Text>
              </Column>
            </Row>
            <Row style={{ width: "100%", marginBottom: "12px" }}>
              <Column style={teaserBulletCol}>
                <Text style={teaserBullet}>▸</Text>
              </Column>
              <Column style={teaserTextCol}>
                <Text style={teaserText}>
                  250-mile Trans Bhutan Trail documentary content
                </Text>
              </Column>
            </Row>
            <Row style={{ width: "100%", marginBottom: "0" }}>
              <Column style={teaserBulletCol}>
                <Text style={teaserBullet}>▸</Text>
              </Column>
              <Column style={teaserTextCol}>
                <Text style={teaserText}>
                  2026 race calendar & sponsorship opportunities
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ========== FOOTER ========== */}
          <Section style={footerDividerLine} />

          <Section style={footerSection}>
            <Text style={footerName}>PATRICK WINGERT</Text>
            <Text style={footerTagline}>DARE2TRI ELITE TEAM ATHLETE</Text>

            {/* Social links */}
            <Text style={socialRow}>
              <Link
                href="https://www.instagram.com/patwingzzz"
                style={socialLink}
              >
                INSTAGRAM
              </Link>
              {/* <span style={socialDot}> • </span>
              <Link
                href="https://strava.app.link/gVriWQZiL0b"
                style={socialLink}
              >
                STRAVA
              </Link>
              <span style={socialDot}> • </span>
              <Link
                href="https://give.dare2tri.org/fundraiser/6928347"
                style={socialLink}
              >
                DARE2TRI
              </Link> */}
            </Text>

            {/* Muted footer text */}
            <Text style={footerMuted}>
              You're receiving this because {email || "you"} signed up at
              patrickwingert.com.
            </Text>
            <Text style={footerMuted}>One inspires many.</Text>
          </Section>

          {/* Bottom orange accent */}
          <Section
            style={{ backgroundColor: orange, height: "2px", width: "100%" }}
          />
        </Container>
      </Body>
    </Html>
  );
}

// ============================================
// STYLES
// ============================================

const orange = "#f97316";
const darkBg = "#050505";
const cardBg = "#0a0a0a";

const body: React.CSSProperties = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: "40px 0",
};

const wrapper: React.CSSProperties = {
  backgroundColor: darkBg,
  maxWidth: "580px",
  margin: "0 auto",
  borderRadius: "0",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.06)",
};

// --- Header ---
const headerZone: React.CSSProperties = {
  padding: "40px 40px 32px",
  textAlign: "center" as const,
};

const systemTag: React.CSSProperties = {
  fontFamily: '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace',
  fontSize: "10px",
  letterSpacing: "2px",
  color: "rgba(255,255,255,0.35)",
  margin: "0 0 2px",
  lineHeight: "1.6",
};

const ecgLine: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "14px",
  color: orange,
  margin: "20px 0 24px",
  letterSpacing: "0",
  lineHeight: "1",
  textAlign: "center" as const,
  opacity: 0.6,
};

const headline: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, Helvetica, sans-serif',
  fontSize: "52px",
  lineHeight: "0.9",
  color: "#ffffff",
  margin: "0",
  letterSpacing: "2px",
  textAlign: "center" as const,
};

const headlineAccent: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, Helvetica, sans-serif',
  fontSize: "52px",
  lineHeight: "0.9",
  color: orange,
  margin: "0 0 20px",
  letterSpacing: "2px",
  textAlign: "center" as const,
  textShadow: `0 0 40px rgba(249, 115, 22, 0.4)`,
};

const thinDivider: React.CSSProperties = {
  width: "60px",
  height: "2px",
  backgroundColor: orange,
  margin: "0 auto 20px",
};

const subtitle: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, Helvetica, sans-serif',
  fontSize: "18px",
  letterSpacing: "8px",
  color: "rgba(255,255,255,0.6)",
  margin: "0 0 4px",
  textAlign: "center" as const,
};

const subtitleSmall: React.CSSProperties = {
  fontFamily: '"SF Mono", "Fira Code", monospace',
  fontSize: "9px",
  letterSpacing: "2.5px",
  color: "rgba(255,255,255,0.3)",
  margin: "0",
  textAlign: "center" as const,
};

// --- Content ---
const contentSection: React.CSSProperties = {
  padding: "0 40px 32px",
};

const bodyText: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.7",
  color: "rgba(255,255,255,0.7)",
  margin: "0 0 16px",
};

const bodyTextMuted: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: "rgba(255,255,255,0.4)",
  margin: "0",
  fontStyle: "italic" as const,
};

// --- Stats Card ---
const statsCard: React.CSSProperties = {
  margin: "0 auto 32px",
  width: "86%",
  maxWidth: "500px",
  backgroundColor: cardBg,
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "24px 8px 20px",
  textAlign: "center" as const,
};

const statsCardHeader: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "9px",
  letterSpacing: "3px",
  color: "rgba(255,255,255,0.4)",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const statCell: React.CSSProperties = {
  textAlign: "center" as const,
  verticalAlign: "top" as const,
  padding: "0 4px",
};

const statDividerCol: React.CSSProperties = {
  width: "1px",
  verticalAlign: "middle" as const,
  textAlign: "center" as const,
};

const statDividerText: React.CSSProperties = {
  color: "rgba(255,255,255,0.1)",
  fontSize: "24px",
  margin: "0",
  lineHeight: "1",
};

const statNumber: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: "28px",
  color: "#ffffff",
  margin: "0 0 6px",
  lineHeight: "1",
};

const statLabel: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "8px",
  letterSpacing: "1.5px",
  color: "rgba(255,255,255,0.35)",
  margin: "0",
  lineHeight: "1.4",
  whiteSpace: "pre-line" as const,
};

const statsFooterNote: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "8px",
  letterSpacing: "2px",
  color: orange,
  margin: "16px 0 0",
  opacity: 0.5,
  textAlign: "center" as const,
};

// --- CTA ---
const ctaSection: React.CSSProperties = {
  padding: "0 40px 36px",
  textAlign: "center" as const,
};

const ctaButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: orange,
  color: "#ffffff",
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: "18px",
  letterSpacing: "3px",
  padding: "16px 40px",
  borderRadius: "6px",
  textDecoration: "none",
  textAlign: "center" as const,
  boxShadow: "0 0 30px rgba(249, 115, 22, 0.3)",
};

// --- Teaser ---
const teaserSection: React.CSSProperties = {
  padding: "0 40px 36px",
};

const teaserHeader: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "10px",
  letterSpacing: "3px",
  color: "rgba(255,255,255,0.4)",
  margin: "0 0 16px",
};

const teaserBulletCol: React.CSSProperties = {
  width: "20px",
  verticalAlign: "top" as const,
};

const teaserBullet: React.CSSProperties = {
  color: orange,
  fontSize: "12px",
  margin: "0",
  lineHeight: "1.6",
};

const teaserTextCol: React.CSSProperties = {
  verticalAlign: "top" as const,
};

const teaserText: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "1.6",
  color: "rgba(255,255,255,0.55)",
  margin: "0",
};

// --- Footer ---
const footerDividerLine: React.CSSProperties = {
  height: "1px",
  backgroundColor: "rgba(255,255,255,0.06)",
  margin: "0 40px",
};

const footerSection: React.CSSProperties = {
  padding: "32px 40px",
  textAlign: "center" as const,
};

const footerName: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: "18px",
  letterSpacing: "6px",
  color: "rgba(255,255,255,0.5)",
  margin: "0 0 4px",
  textAlign: "center" as const,
};

const footerTagline: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "9px",
  letterSpacing: "3px",
  color: "rgba(255,255,255,0.25)",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const socialRow: React.CSSProperties = {
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const socialLink: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "11px",
  letterSpacing: "2px",
  color: orange,
  textDecoration: "none",
};

const socialDot: React.CSSProperties = {
  color: "rgba(255,255,255,0.15)",
  fontSize: "11px",
};

const footerMuted: React.CSSProperties = {
  fontSize: "11px",
  lineHeight: "1.6",
  color: "rgba(255,255,255,0.2)",
  margin: "0 0 4px",
  textAlign: "center" as const,
};
