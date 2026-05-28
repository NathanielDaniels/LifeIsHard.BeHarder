import React from "react";
import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface LeonsTriathlonInviteEmailProps {
  email?: string;
}

const SITE = "https://patrickwingert.com";

const SUBJECT = "Race Day Is Coming: Leon's Triathlon, June 7";
const PREVIEW =
  "Patrick races America's Race, Leon's Triathlon, on Sunday, June 7 in Hammond, Indiana.";

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
  pageBg: "#000000",
  containerBg: "#050505",
  cardBg: "#0a0a0a",
  headline: "#e8e8e8",
  bodyText: "#b3b3b3",
  mutedText: "#696969",
  lightMuted: "#5c5c5c",
  border: "#141414",
  borderCard: "#181818",
  footerName: "#828282",
  footerTag: "#434343",
  footerMuted: "#373737",
  mottoWhite: "#9a9a9a",
};

const darkModeCSS = [
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
  `  .h-body-text { color: ${dark.bodyText} !important; }`,
  `  .h-muted-text { color: ${dark.mutedText} !important; }`,
  `  .h-light-muted { color: ${dark.lightMuted} !important; }`,
  `  .h-footer-name { color: ${dark.footerName} !important; }`,
  `  .h-footer-tag { color: ${dark.footerTag} !important; }`,
  `  .h-footer-muted { color: ${dark.footerMuted} !important; }`,
  `  .h-motto-white { color: ${dark.mottoWhite} !important; }`,
  `  .h-divider { background-color: ${dark.border} !important; }`,
  "}",
].join("\n");

const socialLinks = [
  {
    href: "https://www.instagram.com/patwingit",
    label: "INSTAGRAM",
    iconSrc: `${SITE}/icons/instagram.png`,
  },
  {
    href: "https://give.dare2tri.org/fundraiser/6928347",
    label: "DARE2TRI",
    iconSrc: `${SITE}/icons/dare2tri.png`,
  },
  {
    href: "https://linktr.ee/patrickwingert",
    label: "LINKTREE",
    iconSrc: `${SITE}/icons/linktree.png`,
  },
];

const sponsorTiers = [
  {
    label: "TITLE SPONSOR",
    columns: [
      {
        src: `${SITE}/sponsors/performance-wealth-partners-email.png`,
        alt: "Performance Wealth Partners",
        width: "260",
        height: "82",
      },
    ],
  },
  {
    label: "FOUNDATION PARTNERS",
    columns: [
      {
        src: `${SITE}/sponsors/CAF_logo.png`,
        alt: "Challenged Athletes Foundation",
        width: "150",
        height: "62",
      },
      {
        src: `${SITE}/sponsors/ATF_logo_email.png`,
        alt: "Adaptive Training Foundation",
        width: "150",
        height: "72",
      },
    ],
  },
  {
    label: "TEAM SUPPORT",
    columns: [
      {
        src: `${SITE}/sponsors/D2T_logo_short.png`,
        alt: "Dare2Tri",
        width: "116",
        height: "44",
      },
      {
        src: `${SITE}/sponsors/SEBCM_color.png`,
        alt: "So Every Body Can Move",
        width: "116",
        height: "44",
      },
      {
        src: `${SITE}/sponsors/david-rotter-logo_orig.png`,
        alt: "David Rotter Prosthetics",
        width: "116",
        height: "44",
      },
    ],
  },
];

export const leonsTriathlonInviteSubject = SUBJECT;

export default function LeonsTriathlonInviteEmail({
  email,
}: LeonsTriathlonInviteEmailProps) {
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
        <style>{darkModeCSS}</style>
      </Head>

      <Preview>{PREVIEW}</Preview>

      <Body className="h-body" style={styles.body}>
        <Container className="h-wrapper" style={styles.wrapper}>
          <Section style={styles.topAccent} />

          <Section style={styles.leonsLogoWrap}>
            <Img
              src={`${SITE}/race-weekend/leons-americas-race-logo-clean.png`}
              width="280"
              alt="America's Race, Leon's Triathlon"
              style={styles.leonsLogo}
            />
          </Section>

          <Section style={styles.headerZone}>
            <Text className="h-light-muted" style={styles.systemTag}>
              {">"} RACE WEEK NOTICE
            </Text>
            <Text className="h-light-muted" style={styles.systemTag}>
              {">"} AMERICA'S RACE // LEON'S TRIATHLON // HAMMOND, IN
            </Text>
            <Text style={styles.ecgLine}>{"-------/\\___/\\-------"}</Text>
            <Text className="h-headline" style={styles.headline}>
              SEE YOU
            </Text>
            <Text style={styles.headlineAccent}>AT THE RACE.</Text>
            <Section style={styles.thinDivider} />
            <Text className="h-muted-text" style={styles.subtitle}>
              SUNDAY, JUNE 7, 2026
            </Text>
          </Section>

          <Section className="h-card" style={styles.sponsorCard}>
            <Text className="h-light-muted" style={styles.microHeader}>
              THANK YOU TO THE TEAM BEHIND THE WORK
            </Text>
            {sponsorTiers.map((tier) => (
              <Section key={tier.label} style={styles.sponsorTier}>
                <Text className="h-light-muted" style={styles.tierLabel}>
                  {tier.label}
                </Text>
                <Row style={styles.logoRow}>
                  {tier.columns.map((logo) => (
                    <Column
                      key={logo.alt}
                      style={{
                        ...styles.logoCol,
                        width: `${100 / tier.columns.length}%`,
                      }}
                    >
                      <Img
                        src={logo.src}
                        width={logo.width}
                        height={logo.height}
                        alt={logo.alt}
                        style={{
                          ...styles.sponsorLogo,
                          width: `${logo.width}px`,
                          maxWidth: `${logo.width}px`,
                          height: `${logo.height}px`,
                        }}
                      />
                    </Column>
                  ))}
                </Row>
              </Section>
            ))}
          </Section>

          <Section style={styles.content}>
            <Text className="h-body-text" style={styles.bodyText}>
              Dear friends, supporters, sponsors, and community,
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              On Sunday, June 7, I will be racing at America's Race, Leon's
              Triathlon in Hammond, Indiana as part of the USA Triathlon Para
              Development Series.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              This race is more than a start line.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              It is another opportunity to represent the adaptive athlete
              community, keep pushing the limits of what is possible in
              endurance sport, and show what resilience looks like in real time.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              Every mile, every transition, and every hard-earned finish is
              built on the support of people like you. The messages,
              encouragement, partnerships, and belief from this community matter
              more than most people realize.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              If you are local to the area, I would love for you to come out
              and cheer alongside the Dare2Tri Elite Team as we take on one of
              the most meaningful races on the calendar.
            </Text>
          </Section>

          <Section style={styles.contentTight}>
            <Text className="h-body-text" style={styles.bodyText}>
              Supporters attending race weekend will also get an up-close look
              at my new Quintana Roo XPR race bike, generously granted to me
              courtesy of the Challenged Athletes Foundation.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              You will also get a behind-the-scenes preview of this year's race
              kit setup before we hit the start line.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              Free high fives and photo ops after the race for everyone who
              comes out to show support.
            </Text>
          </Section>

          <Section className="h-card" style={styles.featureImageCard}>
            <Img
              src={`${SITE}/pat_new_bike.jpg`}
              width="500"
              alt="CAF congratulates Patrick with a custom Quintana Roo triathlon bike"
              style={styles.featureImage}
            />
          </Section>

          <Section className="h-card" style={styles.featureImageCard}>
            <Img
              src={`${SITE}/pat_race_suite.png`}
              width="500"
              alt="Patrick's Dare2Tri race kit setup for Leon's Triathlon"
              style={styles.featureImage}
            />
          </Section>

          <Section style={styles.sectionAccent} />

          <Section className="h-card" style={styles.detailsCard}>
            <Text style={styles.cardLabel}>RACE DETAILS</Text>
            <Text className="h-headline" style={styles.dateLine}>
              SUNDAY, JUNE 7
            </Text>
            <Text className="h-body-text" style={styles.detailText}>
              Paratriathlon start time:{" "}
              <span style={styles.detailStrong}>8:30 AM CDT</span>
            </Text>
            <Text className="h-muted-text" style={styles.detailNote}>
              Official schedule currently lists the Paratriathlon wave at 8:30
              AM and notes that race start waves are subject to change.
            </Text>
            <Section style={styles.detailDivider} />
            <Text style={styles.detailHeading}>LOCATION</Text>
            <Text className="h-body-text" style={styles.detailText}>
              Wolf Lake Park
              <br />
              2324 Calumet Avenue
              <br />
              Hammond, Indiana 46320
            </Text>
            <Section style={styles.detailDivider} />
            <Text style={styles.detailHeading}>PARKING</Text>
            <Text className="h-body-text" style={styles.detailText}>
              Parking is available at the race venue. Vehicles will not be
              permitted to exit until the course reopens at 11:30 AM.
            </Text>
            <Text className="h-body-text" style={styles.detailText}>
              If you need to leave earlier, please park at:
              <br />
              Calumet College
              <br />
              2400 New York Avenue
              <br />
              Hammond, Indiana
            </Text>
            <Text className="h-muted-text" style={styles.detailNote}>
              From there, it is a short walk to the venue.
            </Text>
          </Section>

          <Section style={styles.content}>
            <Text className="h-body-text" style={styles.bodyText}>
              This season is about more than race results.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              It is about showing up consistently. Choosing discipline over
              excuses. Continuing to build visibility for adaptive athletes.
              Proving that hard things are still worth doing.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              If you are able to make it out, your energy on course genuinely
              makes a difference.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              Thank you for being part of this journey.
            </Text>
            <Text className="h-body-text" style={styles.bodyText}>
              See you at the race.
            </Text>
            <Text className="h-body-text" style={styles.signature}>
              Patrick Wingert
              <br />
              Adaptive Para Triathlete
              <br />
              Dare2Tri Elite Team
            </Text>
          </Section>

          <Section style={styles.ctaWrap}>
            <Link href="https://leonstriathlon.com/" style={styles.ctaButton}>
              RACE INFORMATION
            </Link>
          </Section>

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
              {socialLinks.map((link) => (
                <Column key={link.label} style={styles.socialCol}>
                  <Link href={link.href} style={{ textDecoration: "none" }}>
                    <Section style={styles.socialIconWrap}>
                      <Img
                        src={link.iconSrc}
                        width="32"
                        height="32"
                        alt={link.label}
                        style={styles.socialIcon}
                      />
                    </Section>
                    <Text className="h-light-muted" style={styles.socialLabel}>
                      {link.label}
                    </Text>
                  </Link>
                </Column>
              ))}
            </Row>

            <Text className="h-footer-muted" style={styles.footerMuted}>
              You are receiving this because {email || "you"} signed up at{" "}
              <Link href={SITE} style={styles.footerLink}>
                patrickwingert.com
              </Link>
              .
            </Text>
            <Text className="h-footer-muted" style={styles.footerMuted}>
              <Link
                href={`${SITE}/api/unsubscribe${
                  email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
                style={styles.unsubLink}
              >
                Unsubscribe
              </Link>
            </Text>
            <Text className="h-footer-muted" style={styles.footerMuted}>
              One inspires many.
            </Text>
          </Section>

          <Section style={styles.bottomAccent} />
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
  topAccent: {
    backgroundColor: light.orange,
    height: "3px",
    width: "100%",
  },
  leonsLogoWrap: {
    padding: "34px 40px 0",
    textAlign: "center" as const,
  },
  leonsLogo: {
    display: "inline-block",
    margin: "0 auto",
    width: "280px",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },
  bottomAccent: {
    backgroundColor: light.orange,
    height: "2px",
    width: "100%",
  },
  headerZone: {
    padding: "28px 40px 28px",
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
    margin: "18px 0 22px",
    lineHeight: "1",
    textAlign: "center" as const,
    opacity: 0.6,
  },
  headline: {
    fontFamily: bebas,
    fontSize: "50px",
    lineHeight: "0.9",
    color: light.darkText,
    margin: "0",
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "50px",
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
    letterSpacing: "4px",
    color: light.mutedText,
    margin: "0",
    textAlign: "center" as const,
  },
  sponsorCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "20px 18px 16px",
    textAlign: "center" as const,
  },
  microHeader: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "2px",
    color: light.lightMuted,
    margin: "0 0 18px",
    textAlign: "center" as const,
  },
  sponsorTier: {
    margin: "0 0 18px",
  },
  tierLabel: {
    fontFamily: mono,
    fontSize: "8px",
    letterSpacing: "2px",
    color: light.orangeDark,
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  logoRow: {
    width: "100%",
    margin: "0",
  },
  logoCol: {
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
    padding: "0 6px",
  },
  sponsorLogo: {
    display: "inline-block",
    margin: "0 auto",
    width: "116px",
    maxWidth: "116px",
    height: "44px",
    objectFit: "contain",
  },
  content: {
    padding: "0 40px 28px",
  },
  contentTight: {
    padding: "0 40px 18px",
  },
  featureImageCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "0",
    overflow: "hidden",
    textAlign: "center" as const,
  },
  featureImage: {
    display: "block",
    width: "500px",
    maxWidth: "100%",
    height: "auto",
    border: "none",
    margin: "0 auto",
  },
  bodyText: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.7",
    color: light.bodyText,
    margin: "0 0 16px",
  },
  signature: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.7",
    color: light.bodyText,
    margin: "24px 0 0",
    fontWeight: 700,
  },
  sectionAccent: {
    width: "40px",
    height: "2px",
    backgroundColor: light.orange,
    margin: "8px auto 24px",
    opacity: 0.6,
  },
  detailsCard: {
    margin: "0 auto 32px",
    width: "86%",
    maxWidth: "500px",
    backgroundColor: light.cardBg,
    border: `1px solid ${light.border}`,
    borderRadius: "8px",
    padding: "28px 28px 24px",
  },
  cardLabel: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "3px",
    color: light.orange,
    margin: "0 0 10px",
    textAlign: "center" as const,
  },
  dateLine: {
    fontFamily: bebas,
    fontSize: "34px",
    lineHeight: "1",
    color: light.darkText,
    margin: "0 0 18px",
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  detailHeading: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: light.orangeDark,
    margin: "0 0 8px",
  },
  detailText: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.7",
    color: light.bodyText,
    margin: "0 0 12px",
  },
  detailStrong: {
    color: light.orangeDark,
    fontWeight: 700,
  },
  detailNote: {
    fontFamily: system,
    fontSize: "12px",
    lineHeight: "1.6",
    color: light.mutedText,
    margin: "0",
  },
  detailDivider: {
    height: "1px",
    backgroundColor: light.borderLight,
    margin: "18px 0",
  },
  ctaWrap: {
    textAlign: "center" as const,
    padding: "0 40px 40px",
  },
  ctaButton: {
    display: "inline-block",
    backgroundColor: light.orange,
    color: "#ffffff",
    fontFamily: mono,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "2px",
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: "4px",
  },
  footerDivider: {
    height: "1px",
    backgroundColor: light.border,
    margin: "0",
  },
  footer: {
    padding: "36px 40px",
    textAlign: "center" as const,
  },
  mottoLight: {
    fontFamily: bebas,
    fontSize: "32px",
    lineHeight: "0.9",
    color: light.mutedText,
    margin: "0",
    letterSpacing: "2px",
  },
  mottoOrange: {
    fontFamily: bebas,
    fontSize: "32px",
    lineHeight: "0.9",
    color: light.orange,
    margin: "0 0 24px",
    letterSpacing: "2px",
  },
  footerName: {
    fontFamily: bebas,
    fontSize: "20px",
    letterSpacing: "3px",
    color: light.mutedText,
    margin: "0 0 4px",
  },
  footerTag: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: light.lightMuted,
    margin: "0 0 24px",
  },
  socialRow: {
    width: "100%",
    margin: "0 auto 24px",
  },
  socialCol: {
    textAlign: "center" as const,
    width: "33.33%",
  },
  socialIconWrap: {
    textAlign: "center" as const,
    margin: "0 auto 6px",
  },
  socialIcon: {
    display: "inline-block",
    margin: "0 auto",
  },
  socialLabel: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "1.5px",
    color: light.lightMuted,
    margin: "0",
  },
  footerMuted: {
    fontSize: "12px",
    lineHeight: "1.6",
    color: light.lightMuted,
    margin: "0 0 8px",
  },
  footerLink: {
    color: light.orangeDark,
    textDecoration: "none",
  },
  unsubLink: {
    color: light.lightMuted,
    textDecoration: "underline",
  },
};
