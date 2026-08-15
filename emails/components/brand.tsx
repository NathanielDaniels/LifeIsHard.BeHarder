import React from "react";
import { Column, Img, Link, Row, Section, Text } from "@react-email/components";

/**
 * Shared design system for Patrick Wingert subscriber emails.
 *
 * Light-first by design: templates declare `color-scheme: light` so Apple
 * Mail never inverts them, and clients that force-darken anyway (Gmail,
 * Outlook.com) degrade safely because every logo ships with a white plate
 * baked into its pixels (scripts/generate-email-assets.mjs).
 */

export const SITE = "https://patrickwingert.com";

export const colors = {
  orange: "#f97316",
  orangeDeep: "#c2410c",
  orangeBurnt: "#7c2d12",
  orangePale: "#ffedd5",
  green: "#15803d",
  canvas: "#f1f1ee",
  card: "#ffffff",
  ink: "#16130e",
  body: "#3d3a35",
  muted: "#857f74",
  faint: "#a39e93",
  border: "#e4e3dc",
  borderSoft: "#eeede7",
  inkMutedText: "#b9b3a6",
  inkFaintText: "#6f6a60",
};

export const mono =
  '"SF Mono", "Fira Code", "Roboto Mono", Menlo, monospace';
export const bebas = '"Bebas Neue", Arial, Helvetica, sans-serif';
export const system =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const cardBase: React.CSSProperties = {
  backgroundColor: colors.card,
  width: "92%",
  maxWidth: "560px",
  margin: "0 auto 18px",
  border: `1px solid ${colors.border}`,
  borderRadius: "14px",
  padding: "30px 34px 28px",
};

// URLs match the site's SponsorsShowcase section.
export const sponsorUrls = {
  performanceWealth: "https://performancewealthpartners.com",
  caf: "https://www.challengedathletes.org/",
  atf: "https://www.adaptivetrainingfoundation.org/",
  dare2tri: "https://www.dare2tri.org",
  sebcm: "https://soeverybodycanmove.org",
  davidRotter: "https://www.rotterprosthetics.com/",
};

export const sponsorTiers = [
  {
    label: "TITLE SPONSOR",
    logos: [
      {
        src: `${SITE}/email/performance-wealth.png`,
        alt: "Performance Wealth Partners",
        href: sponsorUrls.performanceWealth,
        width: 240,
        height: 108,
      },
    ],
  },
  {
    label: "FOUNDATION PARTNERS",
    logos: [
      {
        src: `${SITE}/email/caf.png`,
        alt: "Challenged Athletes Foundation",
        href: sponsorUrls.caf,
        width: 146,
        height: 119,
      },
      {
        src: `${SITE}/email/atf.png`,
        alt: "Adaptive Training Foundation",
        href: sponsorUrls.atf,
        width: 122,
        height: 119,
      },
    ],
  },
  {
    label: "TEAM SUPPORT",
    logos: [
      {
        src: `${SITE}/email/dare2tri.png`,
        alt: "Dare2Tri",
        href: sponsorUrls.dare2tri,
        width: 156,
        height: 47,
      },
      {
        src: `${SITE}/email/sebcm.png`,
        alt: "So Every Body Can Move",
        href: sponsorUrls.sebcm,
        width: 148,
        height: 54,
      },
      {
        src: `${SITE}/email/david-rotter.png`,
        alt: "David Rotter Prosthetics",
        href: sponsorUrls.davidRotter,
        width: 120,
        height: 91,
      },
    ],
  },
];

export const socialLinks = [
  { href: "https://www.instagram.com/patwingit", label: "INSTAGRAM" },
  { href: "https://www.dare2tri.org", label: "DARE2TRI" },
  { href: "https://linktr.ee/patrickwingert", label: "LINKTREE" },
];

/* ── Components ──────────────────────────────────────────────── */

export function Masthead({ tag, sub }: { tag: string; sub: string }) {
  return (
    <Section style={s.masthead}>
      <Row>
        <Column style={s.mastheadLeft}>
          <Text style={s.mastheadName}>PATRICK WINGERT</Text>
        </Column>
        <Column style={s.mastheadRight}>
          <Text style={s.mastheadTag}>
            {tag}
            <br />
            <span style={s.mastheadTagSub}>{sub}</span>
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

/**
 * Standard Patrick Wingert header banner. Include this at the top of every
 * email (right after <Masthead />) so all sends share the same branded header.
 */
export function HeaderBanner() {
  return (
    <Section style={s.headerImageCard}>
      <Img
        src={`${SITE}/email/header.jpeg`}
        width="620"
        alt="Patrick Wingert — Dare2Tri Elite"
        style={s.headerImage}
      />
    </Section>
  );
}

export function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <table
      role="presentation"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      width="100%"
    >
      <tbody>
        <tr>
          <td style={s.cardLabelText}>{children}</td>
          <td style={s.cardLabelRule} />
        </tr>
      </tbody>
    </table>
  );
}

export function CtaButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <table
      role="presentation"
      cellPadding="0"
      cellSpacing="0"
      border={0}
      align="center"
      style={{ margin: "0 auto" }}
    >
      <tbody>
        <tr>
          <td style={s.ctaCell}>
            <Link href={href} style={s.ctaButton}>
              {children}
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function SponsorsCard() {
  return (
    <Section style={s.sponsorCard}>
      <Text style={s.sponsorHeader}>THANK YOU TO THE TEAM BEHIND THE WORK</Text>
      {sponsorTiers.map((tier, t) => (
        <Section
          key={tier.label}
          style={t < sponsorTiers.length - 1 ? s.sponsorTier : s.sponsorTierLast}
        >
          <Text style={s.tierLabel}>{tier.label}</Text>
          <Row style={s.logoRow}>
            {tier.logos.map((logo) => (
              <Column
                key={logo.alt}
                style={{ ...s.logoCol, width: `${100 / tier.logos.length}%` }}
              >
                <Link href={logo.href} style={{ textDecoration: "none" }}>
                  <Img
                    src={logo.src}
                    width={logo.width}
                    height={logo.height}
                    alt={logo.alt}
                    style={{
                      ...s.sponsorLogo,
                      width: `${logo.width}px`,
                      height: `${logo.height}px`,
                    }}
                  />
                </Link>
              </Column>
            ))}
          </Row>
        </Section>
      ))}
    </Section>
  );
}

export function BrandFooter({ email }: { email?: string }) {
  return (
    <>
      <Section style={s.footer}>
        <Text style={s.mottoWhite}>LIFE IS HARD.</Text>
        <Text style={s.mottoOrange}>BE HARDER.</Text>
        <Text style={s.footerName}>PATRICK WINGERT</Text>
        <Text style={s.footerTag}>DARE2TRI ELITE TEAM 2026</Text>

        <Text style={s.socialLine}>
          {socialLinks.map((link, i) => (
            <React.Fragment key={link.label}>
              {i > 0 && (
                <span style={s.socialDot}>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              )}
              <Link href={link.href} style={s.socialLink}>
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </Text>

        <Text style={s.footerMuted}>
          You are receiving this because {email || "you"} signed up at{" "}
          <Link href={SITE} style={s.footerLink}>
            patrickwingert.com
          </Link>
          .
        </Text>
        <Text style={s.footerMuted}>
          <Link
            href={`${SITE}/api/unsubscribe${
              email ? `?email=${encodeURIComponent(email)}` : ""
            }`}
            style={s.unsubLink}
          >
            Unsubscribe
          </Link>
        </Text>
        <Text style={s.footerMotto}>One inspires many.</Text>
      </Section>
      <Section style={s.bottomAccent} />
    </>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */

const s: Record<string, React.CSSProperties> = {
  masthead: {
    padding: "22px 24px 18px",
  },
  headerImageCard: {
    backgroundColor: colors.ink,
    width: "100%",
    margin: "0 auto 18px",
    overflow: "hidden",
  },
  headerImage: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },
  mastheadLeft: {
    width: "55%",
    verticalAlign: "middle" as const,
  },
  mastheadRight: {
    width: "45%",
    verticalAlign: "middle" as const,
  },
  mastheadName: {
    fontFamily: bebas,
    fontSize: "21px",
    letterSpacing: "3px",
    color: colors.ink,
    margin: 0,
  },
  mastheadTag: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: colors.orangeDeep,
    margin: 0,
    textAlign: "right" as const,
    lineHeight: "1.7",
  },
  mastheadTagSub: {
    color: colors.faint,
    fontWeight: 400,
  },
  cardLabelText: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: colors.orangeDeep,
    whiteSpace: "nowrap" as const,
    paddingRight: "14px",
    paddingBottom: "22px",
  },
  cardLabelRule: {
    borderTop: `1px solid ${colors.borderSoft}`,
    width: "100%",
    paddingBottom: "22px",
  },
  ctaCell: {
    backgroundColor: colors.orange,
    borderRadius: "6px",
  },
  ctaButton: {
    display: "inline-block",
    color: "#ffffff",
    fontFamily: mono,
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "2px",
    textDecoration: "none",
    padding: "16px 32px",
  },
  sponsorCard: {
    ...cardBase,
    textAlign: "center" as const,
    padding: "28px 30px 26px",
  },
  sponsorHeader: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: colors.muted,
    margin: "0 0 24px",
    textAlign: "center" as const,
  },
  sponsorTier: {
    margin: "0 0 22px",
    paddingBottom: "22px",
    borderBottom: `1px solid ${colors.borderSoft}`,
  },
  sponsorTierLast: {
    margin: 0,
  },
  tierLabel: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "2px",
    color: colors.orangeDeep,
    margin: "0 0 12px",
    textAlign: "center" as const,
  },
  logoRow: {
    width: "100%",
    margin: 0,
  },
  logoCol: {
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
    padding: "0 6px",
  },
  // No CSS border: logos are flattened onto baked-white plates, so on the
  // white card they read as borderless; in forced dark mode the plates
  // still guarantee legibility. Radius keeps plate corners soft there.
  sponsorLogo: {
    display: "inline-block",
    margin: "0 auto",
    maxWidth: "100%",
    borderRadius: "10px",
  },
  footer: {
    backgroundColor: colors.ink,
    padding: "38px 40px 32px",
    textAlign: "center" as const,
    borderRadius: "14px 14px 0 0",
    width: "100%",
    marginTop: "10px",
  },
  mottoWhite: {
    fontFamily: bebas,
    fontSize: "36px",
    lineHeight: "0.95",
    color: "#ffffff",
    margin: 0,
    letterSpacing: "2px",
  },
  mottoOrange: {
    fontFamily: bebas,
    fontSize: "36px",
    lineHeight: "0.95",
    color: colors.orange,
    margin: "0 0 22px",
    letterSpacing: "2px",
  },
  footerName: {
    fontFamily: bebas,
    fontSize: "17px",
    letterSpacing: "3px",
    color: colors.inkMutedText,
    margin: "0 0 4px",
  },
  footerTag: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: colors.inkFaintText,
    margin: "0 0 22px",
  },
  socialLine: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    margin: "0 0 26px",
    textAlign: "center" as const,
  },
  socialLink: {
    color: colors.orange,
    textDecoration: "none",
  },
  socialDot: {
    color: colors.inkFaintText,
  },
  footerMuted: {
    fontFamily: system,
    fontSize: "12px",
    lineHeight: "1.6",
    color: colors.inkFaintText,
    margin: "0 0 8px",
  },
  footerLink: {
    color: colors.orange,
    textDecoration: "none",
  },
  unsubLink: {
    color: colors.inkFaintText,
    textDecoration: "underline",
  },
  footerMotto: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: colors.inkFaintText,
    margin: "14px 0 0",
  },
  bottomAccent: {
    backgroundColor: colors.orange,
    height: "4px",
    width: "100%",
    borderRadius: "0 0 3px 3px",
  },
};
