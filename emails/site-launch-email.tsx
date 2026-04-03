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

interface SiteLaunchEmailProps {
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

export default function SiteLaunchEmail({ email }: SiteLaunchEmailProps) {
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
        It's live. The full story of Patrick Wingert. patrickwingert.com
      </Preview>

      <Body style={body}>
        <Container style={wrapper}>
          <Section
            style={{ backgroundColor: orange, height: "3px", width: "100%" }}
          />

          <Section style={headerZone}>
            <Text style={systemTag}>{">"} SYSTEM UPDATE</Text>
            <Text style={systemTag}>
              {">"} FULL SITE DEPLOYED // ALL SYSTEMS ONLINE
            </Text>

            <Text style={ecgLine}>───────╱╲___╱╲───────</Text>

            <Text style={headline}>THE WAIT</Text>
            <Text style={headlineAccent}>IS OVER.</Text>

            <Section style={thinDivider} />

            <Text style={subtitle}>PATRICKWINGERT.COM</Text>
            <Text style={subtitleSmall}>
              THE FULL EXPERIENCE IS NOW LIVE
            </Text>
          </Section>

          <Section style={contentSection}>
            <Text style={bodyText}>
              You signed up early. You believed before you saw it.
            </Text>
            <Text style={bodyText}>
              Now it's here. The complete story of Patrick Wingert, from the
              accident that took his leg to the races that proved everyone wrong.
              Live biometrics. Cinematic storytelling. Every mile documented.
            </Text>
            <Text style={bodyTextMuted}>
              This is what you've been waiting for.
            </Text>
          </Section>

          {/* What's Inside */}
          <Section style={featuresCard}>
            <Text style={featuresHeader}>WHAT'S INSIDE</Text>

            {[
              ["THE FALL", "January 20, 2020. The day everything changed."],
              ["THE REBUILD", "From hospital bed to starting line. The prosthetic that made it possible."],
              ["THE PROOF", "250 miles across Bhutan. First American. First below-knee amputee."],
              ["THE MACHINE", "Live heart rate, recovery, and strain. Powered by WHOOP."],
              ["THE MISSION", "2026 race calendar. The road to Para Triathlon Nationals."],
              ["THE TEAM", "The people behind the athlete. Meet them all."],
            ].map(([title, desc], i) => (
              <Row key={i} style={{ width: "100%", marginBottom: i < 5 ? "14px" : "0" }}>
                <Column style={featureTitleCol}>
                  <Text style={featureTitle}>{title}</Text>
                </Column>
                <Column style={featureDescCol}>
                  <Text style={featureDesc}>{desc}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Stats */}
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
                <Text style={statDividerText}>|</Text>
              </Column>
              <Column style={statCell}>
                <Text style={statNumber}>{daysSober.toLocaleString()}</Text>
                <Text style={statLabel}>DAYS{"\n"}SOBER</Text>
              </Column>
              <Column style={statDividerCol}>
                <Text style={statDividerText}>|</Text>
              </Column>
              <Column style={statCell}>
                <Text style={statNumber}>{daysUntilRace.toLocaleString()}</Text>
                <Text style={statLabel}>DAYS UNTIL{"\n"}NEXT RACE</Text>
              </Column>
            </Row>

            <Text style={statsFooterNote}>
              LIVE DATA ON SITE • UPDATED IN REAL-TIME
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Link href="https://patrickwingert.com" style={ctaButton}>
              EXPERIENCE THE FULL SITE
            </Link>
          </Section>

          {/* Support */}
          <Section style={supportSection}>
            <Text style={supportHeader}>FUEL THE MISSION</Text>
            <Text style={supportText}>
              Patrick trains full-time toward Nationals. Equipment, travel,
              coaching, race fees. Every contribution powers the next mile.
            </Text>
            <Link
              href="https://give.dare2tri.org/fundraiser/6928347"
              style={supportLink}
            >
              SUPPORT DARE2TRI →
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footerDividerLine} />

          <Section style={footerSection}>
            <Text style={footerName}>PATRICK WINGERT</Text>
            <Text style={footerTagline}>DARE2TRI ELITE TEAM ATHLETE</Text>

            <Text style={socialRow}>
              <Link
                href="https://www.instagram.com/patwingit"
                style={socialLink}
              >
                INSTAGRAM
              </Link>
              <span style={socialDot}> · </span>
              <Link
                href="https://give.dare2tri.org/fundraiser/6928347"
                style={socialLink}
              >
                DARE2TRI
              </Link>
            </Text>

            <Text style={footerMuted}>
              You're receiving this because {email || "you"} signed up at
              patrickwingert.com.
            </Text>
            <Text style={footerMuted}>
              <Link
                href={`https://patrickwingert.com/api/unsubscribe${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                style={unsubscribeLink}
              >
                Unsubscribe
              </Link>
            </Text>
            <Text style={footerMuted}>One inspires many.</Text>
          </Section>

          <Section
            style={{ backgroundColor: orange, height: "2px", width: "100%" }}
          />
        </Container>
      </Body>
    </Html>
  );
}

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
  textShadow: "0 0 40px rgba(249, 115, 22, 0.4)",
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

const featuresCard: React.CSSProperties = {
  margin: "0 auto 32px",
  width: "86%",
  maxWidth: "500px",
  backgroundColor: cardBg,
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  padding: "24px 20px",
};

const featuresHeader: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "9px",
  letterSpacing: "3px",
  color: "rgba(255,255,255,0.4)",
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const featureTitleCol: React.CSSProperties = {
  width: "110px",
  verticalAlign: "top" as const,
  paddingRight: "12px",
};

const featureTitle: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: "15px",
  letterSpacing: "1px",
  color: orange,
  margin: "0",
  lineHeight: "1.4",
};

const featureDescCol: React.CSSProperties = {
  verticalAlign: "top" as const,
};

const featureDesc: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: "1.5",
  color: "rgba(255,255,255,0.45)",
  margin: "0",
};

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

const supportSection: React.CSSProperties = {
  padding: "0 40px 36px",
  textAlign: "center" as const,
};

const supportHeader: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: "22px",
  letterSpacing: "4px",
  color: "rgba(255,255,255,0.5)",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const supportText: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "1.7",
  color: "rgba(255,255,255,0.4)",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const supportLink: React.CSSProperties = {
  fontFamily: '"SF Mono", monospace',
  fontSize: "11px",
  letterSpacing: "2px",
  color: orange,
  textDecoration: "none",
};

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

const unsubscribeLink: React.CSSProperties = {
  color: "rgba(255,255,255,0.25)",
  textDecoration: "underline",
  fontSize: "11px",
};
