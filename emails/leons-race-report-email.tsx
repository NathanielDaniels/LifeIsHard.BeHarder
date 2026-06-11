import React from "react";
import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import {
  BrandFooter,
  CardLabel,
  CtaButton,
  Masthead,
  SITE,
  bebas,
  cardBase,
  colors as c,
  mono,
  sponsorUrls,
  system,
} from "./components/brand";

interface LeonsRaceReportEmailProps {
  email?: string;
}

const NBSP = " ";
const DOT = `${NBSP}${NBSP}·${NBSP}${NBSP}`;

export const leonsRaceReportSubject =
  "Race Report: 2nd Place at Leon's Triathlon";

const PREVIEW =
  "Second place in PTS4, a race-swim PB, and a weekend that was about much more than a finish line.";

const splits = [
  { leg: "SWIM", time: "17:07", note: "NEW RACE PB" },
  { leg: "BIKE", time: "35:43", note: "19.5 MPH" },
  { leg: "RUN", time: "23:25", note: "7:32/MI" },
];

// Logos render from the baked-white email assets; sizes keep each logo
// visually balanced inside the 100px column.
const thankYous = [
  {
    name: "PERFORMANCE WEALTH PARTNERS",
    href: sponsorUrls.performanceWealth,
    logo: { src: `${SITE}/email/performance-wealth.png`, width: 84, height: 38 },
    text: "The entire team, for investing in this mission.",
  },
  {
    name: "ADAPTIVE TRAINING FOUNDATION",
    href: sponsorUrls.atf,
    logo: { src: `${SITE}/email/atf.png`, width: 68, height: 66 },
    text: "For helping me become a stronger athlete and person through their life-changing work.",
  },
  {
    name: "DARE2TRI & THE ELITE TEAM",
    href: sponsorUrls.dare2tri,
    logo: { src: `${SITE}/email/dare2tri.png`, width: 84, height: 25 },
    text: "For building a community that changes lives and creates opportunities for adaptive athletes.",
  },
  {
    name: "CHALLENGED ATHLETES FOUNDATION & QUINTANA ROO",
    href: sponsorUrls.caf,
    logo: { src: `${SITE}/email/caf.png`, width: 80, height: 65 },
    text: "For believing in my journey and supporting my ability to compete at this level with the incredible race bike that helps me chase these goals.",
  },
  {
    name: "DAVID ROTTER PROSTHETICS",
    href: sponsorUrls.davidRotter,
    logo: { src: `${SITE}/email/david-rotter.png`, width: 84, height: 64 },
    text: "For getting my running blade dialed in before race day and making sure I was ready to perform.",
  },
  {
    name: "SO EVERY BODY CAN MOVE",
    href: sponsorUrls.sebcm,
    logo: { src: `${SITE}/email/sebcm.png`, width: 84, height: 31 },
    text: "Removing barriers to movement and fitness for people of all abilities.",
  },
];

export default function LeonsRaceReportEmail({
  email,
}: LeonsRaceReportEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
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
        <style>{":root { color-scheme: light; }"}</style>
      </Head>

      <Preview>{PREVIEW}</Preview>

      <Body style={styles.bodyEl}>
        <Container style={styles.wrapper}>
          <Section style={styles.topAccent} />

          <Masthead tag="RACE REPORT" sub="JUNE 7, 2026" />

          {/* Headline poster card */}
          <Section style={styles.posterCard}>
            <Section style={styles.posterTop}>
              <Text style={styles.ecgLine}>{"---------/\\__/\\---------"}</Text>
              <Text style={styles.headline}>MORE THAN</Text>
              <Text style={styles.headlineAccent}>A FINISH LINE.</Text>
            </Section>
            <Section style={styles.posterBand}>
              <Text style={styles.bandTitle}>
                AMERICA'S RACE{DOT}LEON'S TRIATHLON
              </Text>
              <Text style={styles.bandSub}>
                PARATRIATHLON NATIONALS QUALIFIER SERIES{DOT}HAMMOND, INDIANA
              </Text>
            </Section>
          </Section>

          {/* Hero photo */}
          <Section style={styles.photoCard}>
            <Img
              src={`${SITE}/email/race-finish-chute.jpg`}
              width="528"
              alt="Patrick Wingert running the finish chute at America's Race, Leon's Triathlon"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                THE FINISH CHUTE{DOT}AMERICA'S RACE{DOT}HAMMOND, IN
              </Text>
            </Section>
          </Section>

          {/* Letter — part one */}
          <Section style={styles.card}>
            <CardLabel>A NOTE FROM PATRICK</CardLabel>
            <Text style={styles.bodyText}>Team,</Text>
            <Text style={styles.bodyText}>
              Another race is in the books, but Leon's Triathlon was about so
              much more than a finish line.
            </Text>
            <Text style={styles.bodyText}>
              This past week I traveled to Hammond, Indiana for America's Race
              at Leon's Triathlon, part of the Paratriathlon Nationals
              Qualifier Series, and I left with a reminder that this journey is
              about far more than medals and results.
            </Text>
            <Text style={styles.bodyText}>
              The day before the race, I had the incredible honor of being
              alongside the Dare2Tri community during the Injured Veterans
              Camp and Veterans to Victory program. I want to be clear: I am
              not a veteran, and I was not a participant in their camp. I was
              there as an adaptive athlete, teammate, and supporter with the
              privilege of witnessing their journey.
            </Text>
            <Text style={styles.bodyTextLast}>
              Watching these incredible veterans and athletes push themselves,
              share their stories, and experience moments like their first
              triathlon was something I will never forget. Being able to
              witness that transformation and be part of the energy and
              encouragement surrounding them was humbling.
            </Text>
            <Text style={styles.pullLine}>
              That is the power of adaptive sport.
            </Text>
            <Text style={styles.bodyTextLast}>
              It creates opportunities, builds community, and reminds us that
              we are capable of more than we sometimes believe.
            </Text>
          </Section>

          {/* Race weekend card */}
          <Section style={styles.card}>
            <CardLabel>RACE WEEKEND</CardLabel>
            <Text style={styles.bodyText}>
              The race weekend itself was unforgettable. From the military,
              police, and motorcycle club escort parade from the hotel to the
              venue, to watching a Blackhawk helicopter circle overhead and
              land, Leon's Triathlon delivered an atmosphere unlike anything I
              have experienced.
            </Text>
            <Text style={styles.bodyTextLast}>
              Race day brought together an incredible field of athletes. I had
              the honor of sharing the course with Paralympians Kelly
              Elmlinger and Dare2Tri co-founder Melissa Stockwell; both
              athletes who have helped pave the way and continue to inspire
              the adaptive sports community.
            </Text>
          </Section>

          {/* Melissa photo */}
          <Section style={styles.photoCard}>
            <Img
              src={`${SITE}/email/race-melissa.jpg`}
              width="528"
              alt="Patrick with Paralympian and Dare2Tri co-founder Melissa Stockwell"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                WITH PARALYMPIAN & DARE2TRI CO-FOUNDER MELISSA STOCKWELL
              </Text>
            </Section>
          </Section>

          {/* The result — lead-in + photos + ticket */}
          <Section style={styles.card}>
            <CardLabel>THE RACE</CardLabel>
            <Text style={styles.bodyTextLast}>
              I lined up in the PTS4 category against some incredible athletes
              and finished second behind my friend and Dare2Tri teammate{" "}
              <Link
                href="https://www.instagram.com/nubbinaround"
                style={styles.inlineLink}
              >
                James Hessen
              </Link>
              .
            </Text>
          </Section>

          {/* Two-up photos: James + podium */}
          <Section style={styles.photoPairWrap}>
            <Row>
              <Column style={styles.photoPairColLeft}>
                <Img
                  src={`${SITE}/email/race-james.jpg`}
                  width="252"
                  alt="Patrick with Dare2Tri teammate James Hessen"
                  style={styles.photoPair}
                />
              </Column>
              <Column style={styles.photoPairColRight}>
                <Img
                  src={`${SITE}/email/race-podium.jpg`}
                  width="252"
                  alt="The PTS4 podium finishers at Leon's Triathlon"
                  style={styles.photoPair}
                />
              </Column>
            </Row>
            <Section style={styles.pairCaptionBar}>
              <Text style={styles.captionText}>
                WITH JAMES HESSEN (@NUBBINAROUND){DOT}THE PTS4 PODIUM
              </Text>
            </Section>
          </Section>

          {/* Result ticket */}
          <Section style={styles.ticketCard}>
            <Section style={styles.ticketHead}>
              <Text style={styles.ticketHeadLabel}>
                OFFICIAL RESULT{DOT}PTS4
              </Text>
              <Text style={styles.resultPlace}>2ND PLACE</Text>
              <Text style={styles.resultTime}>CHIP TIME{NBSP}{NBSP}1:20:57</Text>
            </Section>
            <Section style={styles.ticketBody}>
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
              >
                <tbody>
                  {splits.map((split) => (
                    <tr key={split.leg}>
                      <td style={styles.splitLegCell}>
                        <Text style={styles.splitLeg}>{split.leg}</Text>
                      </td>
                      <td style={styles.splitTimeCell}>
                        <Text style={styles.splitTime}>{split.time}</Text>
                      </td>
                      <td style={styles.splitPaceCell}>
                        <Text style={styles.splitPace}>{split.note}</Text>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3}>
                      <Section style={styles.splitDivider} />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.splitLegCell}>
                      <Text style={styles.splitLegTotal}>TOTAL</Text>
                    </td>
                    <td style={styles.splitTimeCell}>
                      <Text style={styles.splitTimeTotal}>1:20:57</Text>
                    </td>
                    <td style={styles.splitPaceCell} />
                  </tr>
                </tbody>
              </table>
              <Text style={styles.ticketNote}>
                Another step forward from the California State Championship
                race in Napa Valley, improving my overall performance and
                showing the progress happening behind the scenes.
              </Text>
            </Section>
          </Section>

          {/* Thank yous */}
          <Section style={styles.card}>
            <CardLabel>NEVER ACCOMPLISHED ALONE</CardLabel>
            <Text style={styles.bodyText}>
              A race like this is never accomplished alone. I am incredibly
              grateful for the people and organizations who continue to invest
              in this journey:
            </Text>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
            >
              <tbody>
                {thankYous.map((item, i) => (
                  <tr key={item.name}>
                    <td
                      style={
                        i < thankYous.length - 1
                          ? styles.thanksLogoCell
                          : styles.thanksLogoCellLast
                      }
                    >
                      <Link href={item.href} style={{ textDecoration: "none" }}>
                        <Img
                          src={item.logo.src}
                          width={item.logo.width}
                          height={item.logo.height}
                          alt={item.name}
                          style={{
                            ...styles.thanksLogo,
                            width: `${item.logo.width}px`,
                            height: `${item.logo.height}px`,
                          }}
                        />
                      </Link>
                    </td>
                    <td
                      style={
                        i < thankYous.length - 1
                          ? styles.thanksCell
                          : styles.thanksCellLast
                      }
                    >
                      <Text style={styles.thanksName}>
                        <Link href={item.href} style={styles.thanksNameLink}>
                          {item.name}
                        </Link>
                      </Text>
                      <Text style={styles.thanksText}>{item.text}</Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Text style={styles.thanksClose}>
              Every adjustment, every training session, every person who
              contributes to this journey, it all matters.
            </Text>
            <Section style={styles.signatureBlock}>
              <Text style={styles.signature}>Patrick Wingert</Text>
              <Text style={styles.signatureRole}>
                ADAPTIVE PARA TRIATHLETE{DOT}DARE2TRI ELITE TEAM
              </Text>
            </Section>
          </Section>

          {/* Medal photo */}
          <Section style={styles.photoCard}>
            <Img
              src={`${SITE}/email/race-medal.jpg`}
              width="528"
              alt="Patrick holding the Leon's Heroes finisher medal"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                LEON'S HEROES{DOT}FROM THE SHORES OF LAKE MICHIGAN TO THE
                FINISH LINE
              </Text>
            </Section>
          </Section>

          {/* Dark close */}
          <Section style={styles.missionCard}>
            <Text style={styles.missionText}>
              The medal is meaningful. The result matters. But the biggest win
              is being part of a movement proving that
            </Text>
            <Text style={styles.missionLine}>
              SPORT BELONGS TO EVERYONE.
            </Text>
            <Text style={styles.missionSignoff}>ONE RACE AT A TIME.</Text>
            <CtaButton href={SITE}>PATRICKWINGERT.COM{NBSP}{NBSP}→</CtaButton>
            <Section style={styles.missionDivider} />
            <Text style={styles.donationText}>
              Join the team with a tax-deductible donation. Dare2Tri is a
              501(c)(3) charitable organization.
            </Text>
            <Link
              href="https://give.dare2tri.org/fundraiser/6928347"
              style={styles.donationLink}
            >
              SUPPORT DARE2TRI{NBSP}{NBSP}→
            </Link>
          </Section>

          {/* Next race countdown — orange card */}
          <Section style={styles.nextCard}>
            <Text style={styles.nextLabel}>NEXT UP</Text>
            <Text style={styles.nextDays}>17 DAYS</Text>
            <Text style={styles.nextName}>PLEASANT PRAIRIE TRIATHLON</Text>
            <Text style={styles.nextSub}>
              PLEASANT PRAIRIE, WI{DOT}JUNE 28, 2026
            </Text>
          </Section>

          <BrandFooter email={email} />
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bodyEl: {
    backgroundColor: c.canvas,
    fontFamily: system,
    margin: 0,
    padding: "28px 0",
  },
  wrapper: {
    backgroundColor: c.canvas,
    maxWidth: "620px",
    margin: "0 auto",
  },
  topAccent: {
    backgroundColor: c.orange,
    height: "5px",
    width: "100%",
    borderRadius: "3px",
  },

  /* Poster */
  posterCard: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  posterTop: {
    padding: "34px 34px 28px",
    textAlign: "center" as const,
  },
  ecgLine: {
    fontFamily: mono,
    fontSize: "13px",
    color: c.orange,
    margin: "0 0 20px",
    lineHeight: "1",
    textAlign: "center" as const,
  },
  headline: {
    fontFamily: bebas,
    fontSize: "58px",
    lineHeight: "0.92",
    color: c.ink,
    margin: 0,
    letterSpacing: "3px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "58px",
    lineHeight: "0.92",
    color: c.orange,
    margin: 0,
    letterSpacing: "3px",
    textAlign: "center" as const,
  },
  posterBand: {
    backgroundColor: c.orange,
    padding: "18px 34px 20px",
    textAlign: "center" as const,
  },
  bandTitle: {
    fontFamily: bebas,
    fontSize: "22px",
    lineHeight: "1.1",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 6px",
  },
  bandSub: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: c.orangePale,
    margin: 0,
  },

  /* Cards & text */
  card: cardBase,
  bodyText: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.75",
    color: c.body,
    margin: "0 0 18px",
  },
  bodyTextLast: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.75",
    color: c.body,
    margin: 0,
  },
  pullLine: {
    fontFamily: bebas,
    fontSize: "26px",
    lineHeight: "1.1",
    letterSpacing: "1.5px",
    color: c.ink,
    borderLeft: `3px solid ${c.orange}`,
    paddingLeft: "16px",
    margin: "26px 0",
  },
  inlineLink: {
    color: c.orangeDeep,
    textDecoration: "none",
    fontWeight: 600,
  },

  /* Photo cards */
  photoCard: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  photo: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },
  captionBar: {
    backgroundColor: "#faf9f6",
    borderTop: `1px solid ${c.borderSoft}`,
    padding: "12px 24px",
    textAlign: "center" as const,
  },
  captionText: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: c.muted,
    margin: 0,
  },

  /* Two-up photo pair */
  photoPairWrap: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  photoPairColLeft: {
    width: "50%",
    verticalAlign: "top" as const,
    borderRight: `2px solid ${c.card}`,
  },
  photoPairColRight: {
    width: "50%",
    verticalAlign: "top" as const,
    borderLeft: `2px solid ${c.card}`,
  },
  photoPair: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },
  pairCaptionBar: {
    backgroundColor: "#faf9f6",
    borderTop: `1px solid ${c.borderSoft}`,
    padding: "12px 24px",
    textAlign: "center" as const,
  },

  /* Result ticket */
  ticketCard: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  ticketHead: {
    backgroundColor: c.ink,
    padding: "26px 34px 28px",
    textAlign: "center" as const,
  },
  ticketHeadLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "4px",
    color: c.orange,
    margin: "0 0 12px",
  },
  resultPlace: {
    fontFamily: bebas,
    fontSize: "58px",
    lineHeight: "1",
    letterSpacing: "3px",
    color: "#ffffff",
    margin: "0 0 10px",
  },
  resultTime: {
    fontFamily: mono,
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.orange,
    margin: 0,
  },
  ticketBody: {
    padding: "24px 34px 26px",
  },
  splitLegCell: {
    width: "90px",
    verticalAlign: "middle" as const,
    padding: "7px 0",
  },
  splitLeg: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.orangeDeep,
    margin: 0,
  },
  splitLegTotal: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.ink,
    margin: 0,
  },
  splitTimeCell: {
    verticalAlign: "middle" as const,
    padding: "7px 0",
  },
  splitTime: {
    fontFamily: bebas,
    fontSize: "24px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: c.ink,
    margin: 0,
  },
  splitTimeTotal: {
    fontFamily: bebas,
    fontSize: "26px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: c.orange,
    margin: 0,
  },
  splitPaceCell: {
    verticalAlign: "middle" as const,
    textAlign: "right" as const,
    padding: "7px 0",
  },
  splitPace: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "1px",
    color: c.muted,
    margin: 0,
  },
  splitDivider: {
    height: "1px",
    backgroundColor: c.borderSoft,
    margin: "12px 0",
  },
  ticketNote: {
    fontFamily: system,
    fontSize: "13px",
    lineHeight: "1.65",
    color: c.muted,
    margin: "18px 0 0",
  },

  /* Thank yous */
  thanksLogoCell: {
    width: "100px",
    verticalAlign: "middle" as const,
    padding: "10px 16px 14px 0",
    borderBottom: `1px solid ${c.borderSoft}`,
  },
  thanksLogoCellLast: {
    width: "100px",
    verticalAlign: "middle" as const,
    padding: "10px 16px 0 0",
  },
  thanksLogo: {
    display: "block",
    maxWidth: "100%",
    borderRadius: "8px",
  },
  thanksCell: {
    verticalAlign: "top" as const,
    padding: "6px 0 14px",
    borderBottom: `1px solid ${c.borderSoft}`,
  },
  thanksCellLast: {
    verticalAlign: "top" as const,
    padding: "6px 0 0",
  },
  thanksName: {
    fontFamily: bebas,
    fontSize: "17px",
    letterSpacing: "1.5px",
    lineHeight: "1.1",
    color: c.ink,
    margin: "0 0 4px",
  },
  thanksNameLink: {
    color: c.ink,
    textDecoration: "none",
  },
  thanksText: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.6",
    color: c.body,
    margin: 0,
  },
  thanksClose: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.65",
    color: c.body,
    fontStyle: "italic" as const,
    margin: "20px 0 0",
  },
  signatureBlock: {
    borderTop: `1px solid ${c.borderSoft}`,
    marginTop: "24px",
    paddingTop: "20px",
  },
  signature: {
    fontFamily: bebas,
    fontSize: "24px",
    letterSpacing: "1.5px",
    lineHeight: "1",
    color: c.ink,
    margin: "0 0 6px",
  },
  signatureRole: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "2px",
    color: c.muted,
    margin: 0,
  },

  /* Dark close */
  missionCard: {
    ...cardBase,
    backgroundColor: c.ink,
    border: "none",
    padding: "36px 38px 36px",
    textAlign: "center" as const,
  },
  missionText: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.75",
    color: c.inkMutedText,
    margin: "0 0 14px",
  },
  missionLine: {
    fontFamily: bebas,
    fontSize: "40px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 14px",
  },
  missionSignoff: {
    fontFamily: bebas,
    fontSize: "20px",
    letterSpacing: "2px",
    lineHeight: "1",
    color: c.orange,
    margin: "0 0 26px",
  },
  missionDivider: {
    height: "1px",
    backgroundColor: "#2e2a22",
    margin: "28px auto 22px",
    width: "60%",
  },
  donationText: {
    fontFamily: system,
    fontSize: "13px",
    lineHeight: "1.65",
    color: c.inkMutedText,
    margin: "0 0 12px",
  },
  donationLink: {
    fontFamily: mono,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.orange,
    textDecoration: "none",
  },

  /* Next race */
  nextCard: {
    ...cardBase,
    backgroundColor: c.orange,
    border: "none",
    padding: "32px 34px 34px",
    textAlign: "center" as const,
  },
  nextLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "4px",
    color: c.orangeBurnt,
    margin: "0 0 12px",
  },
  nextDays: {
    fontFamily: bebas,
    fontSize: "62px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 10px",
  },
  nextName: {
    fontFamily: bebas,
    fontSize: "26px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 8px",
  },
  nextSub: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: c.orangePale,
    margin: 0,
  },
};
