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
  SponsorsCard,
  SITE,
  bebas,
  cardBase,
  colors as c,
  mono,
  system,
} from "./components/brand";

interface PleasantPrairieRaceReportEmailProps {
  email?: string;
}

const NBSP = " ";
const DOT = `${NBSP}${NBSP}·${NBSP}${NBSP}`;

export const pleasantPrairieRaceReportSubject =
  "Pleasant Prairie Recap: The Finish Line Becomes the Next Start Line";

const PREVIEW =
  "A fight in Wisconsin, a 2nd-place PTS4 podium, and another reminder that the work always shows up when you need it.";

// Splits from the official RunSignup result (Para Sprint, Ambulatory, PTS4).
const splits = [
  { leg: "SWIM", time: "17:49", note: "2:23/100M" },
  { leg: "BIKE", time: "41:12", note: "20.8 MPH" },
  { leg: "RUN", time: "23:28", note: "7:33/MI" },
];

export default function PleasantPrairieRaceReportEmail({
  email,
}: PleasantPrairieRaceReportEmailProps) {
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

          <Masthead tag="RACE REPORT" sub="JUNE 28, 2026" />

          {/* Headline poster card */}
          <Section style={styles.posterCard}>
            <Section style={styles.posterTop}>
              <Text style={styles.ecgLine}>{"---------/\\__/\\---------"}</Text>
              <Text style={styles.headline}>THE FINISH LINE</Text>
              <Text style={styles.headlineAccent}>BECOMES THE START LINE.</Text>
            </Section>
            <Section style={styles.posterBand}>
              <Text style={styles.bandTitle}>PLEASANT PRAIRIE TRIATHLON</Text>
              <Text style={styles.bandSub}>
                PARATRIATHLON NATIONALS QUALIFIER SERIES{DOT}PLEASANT PRAIRIE, WI
              </Text>
            </Section>
          </Section>

          {/* Hero photo — finish */}
          <Section style={styles.photoCard}>
            <Img
              src={`${SITE}/email/pp-finish.jpg`}
              width="528"
              alt="Patrick Wingert crossing the finish line at the Pleasant Prairie Triathlon"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                THE FINISH{DOT}PLEASANT PRAIRIE TRIATHLON{DOT}WI
              </Text>
            </Section>
          </Section>

          {/* Letter — the fight */}
          <Section style={styles.card}>
            <CardLabel>A NOTE FROM PATRICK</CardLabel>
            <Text style={styles.bodyText}>
              The finish line is never really the finish line.
            </Text>
            <Text style={styles.bodyText}>
              Pleasant Prairie Triathlon is officially in the books.
            </Text>
            <Text style={styles.bodyTextLast}>
              This one was a fight. The swim didn&rsquo;t go the way I wanted,
              and there were moments where I had to dig deeper than expected.
              But that&rsquo;s why we race. You don&rsquo;t get to choose the
              conditions. You don&rsquo;t get to choose the hard moments. You
              only get to decide how you respond.
            </Text>
            <Text style={styles.pullLine}>So I kept moving.</Text>
          </Section>

          {/* Two-up photos: bike + run */}
          <Section style={styles.photoPairWrap}>
            <Row>
              <Column style={styles.photoPairColLeft}>
                <Img
                  src={`${SITE}/email/pp-bike.jpg`}
                  width="252"
                  alt="Patrick Wingert on the bike leg at Pleasant Prairie"
                  style={styles.photoPair}
                />
              </Column>
              <Column style={styles.photoPairColRight}>
                <Img
                  src={`${SITE}/email/pp-run.jpg`}
                  width="252"
                  alt="Patrick Wingert on the run course at Pleasant Prairie"
                  style={styles.photoPair}
                />
              </Column>
            </Row>
            <Section style={styles.pairCaptionBar}>
              <Text style={styles.captionText}>
                THE BIKE{DOT}41:12{DOT}THE RUN{DOT}23:28
              </Text>
            </Section>
          </Section>

          {/* The result */}
          <Section style={styles.card}>
            <CardLabel>THE RESULT</CardLabel>
            <Text style={styles.bodyText}>
              I crossed the finish line with a 2nd place finish in the PTS4
              division.
            </Text>
            <Text style={styles.bodyTextLast}>
              Not the performance I wanted. But a result I&rsquo;ll take, the
              lessons I&rsquo;ll carry forward, and another reminder that the
              work always shows up when you need it.
            </Text>
          </Section>

          {/* Result ticket */}
          <Section style={styles.ticketCard}>
            <Section style={styles.ticketHead}>
              <Text style={styles.ticketHeadLabel}>
                OFFICIAL RESULT{DOT}PTS4
              </Text>
              <Text style={styles.resultPlace}>2ND PLACE</Text>
              <Text style={styles.resultTime}>
                CHIP TIME{NBSP}{NBSP}1:26:16
              </Text>
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
                      <Text style={styles.splitTimeTotal}>1:26:16</Text>
                    </td>
                    <td style={styles.splitPaceCell} />
                  </tr>
                </tbody>
              </table>
              <Text style={styles.ticketNote}>
                This podium also earned another 15 points in the USA Triathlon
                Paratriathlon Nationals Qualifier Series, moving me into 2nd
                place in the current PTS4 rankings.
              </Text>
            </Section>
          </Section>

          {/* The bigger win — friends */}
          <Section style={styles.card}>
            <CardLabel>THE BIGGER WIN</CardLabel>
            <Text style={styles.bodyText}>
              But the biggest win of the weekend wasn&rsquo;t just the result.
            </Text>
            <Text style={styles.bodyTextLast}>
              It was sharing the course with my friend and teammate{" "}
              <Link
                href="https://www.instagram.com/nubbinaround"
                style={styles.inlineLink}
              >
                James Hessen @nubbinaround
              </Link>{" "}
              and my Dare2Tri Train to Race Camp roommate in his second ever
              triathlon, coming in third!{" "}
              <Link
                href="https://www.instagram.com/operativeofchaos"
                style={styles.inlineLink}
              >
                Spencer Kopp @operativeofchaos
              </Link>
            </Text>
          </Section>

          {/* Podium photo */}
          <Section style={styles.photoCard}>
            <Img
              src={`${SITE}/email/pp-podium.jpg`}
              width="528"
              alt="Patrick Wingert on the podium with fellow athletes at Pleasant Prairie"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                ON THE PODIUM{DOT}PLEASANT PRAIRIE TRIATHLON
              </Text>
            </Section>
          </Section>

          {/* Community */}
          <Section style={styles.card}>
            <CardLabel>ONE INSPIRES MANY</CardLabel>
            <Text style={styles.bodyText}>
              The people you surround yourself with matter. The athletes beside
              you, the coaches pushing you, and the community behind you are
              what make this journey special.
            </Text>
            <Text style={styles.bodyTextLast}>
              A massive thank you to Keri, Dan, Ryan, Kyle, MJ, the coaches,
              volunteers, and the entire Dare2Tri team who make these
              opportunities possible.
            </Text>
            <Text style={styles.pullLine}>One inspires many.</Text>
            <Text style={styles.bodyText}>
              That&rsquo;s what Dare2Tri represents. One athlete showing up can
              create a ripple effect far beyond themselves. Creating access.
              Creating opportunity. Changing what people believe is possible.
            </Text>
            <Text style={styles.bodyTextLast}>
              I also want to recognize the sponsors and supporters who continue
              to stand behind this mission and make this journey possible.
            </Text>
          </Section>

          {/* Sponsors */}
          <SponsorsCard />

          {/* Forward — next up */}
          <Section style={styles.card}>
            <CardLabel>NEXT START LINE</CardLabel>
            <Text style={styles.pullLine}>
              Today&rsquo;s finish line is tomorrow&rsquo;s start line.
            </Text>
            <Text style={styles.bodyText}>
              Next up: Long Beach Legacy Triathlon.
            </Text>
            <Text style={styles.bodyTextLast}>
              Another opportunity to chase points, sharpen the details, and
              continue building. I&rsquo;ll be heading into another Dare2Tri
              Train to Race Camp leading into the race, putting in the work and
              preparing for the next challenge.
            </Text>
          </Section>

          {/* Next race countdown — orange card */}
          <Section style={styles.nextCard}>
            <Text style={styles.nextLabel}>NEXT UP</Text>
            <Text style={styles.nextDays}>21 DAYS</Text>
            <Text style={styles.nextName}>LONG BEACH LEGACY TRIATHLON</Text>
            <Text style={styles.nextSub}>
              LONG BEACH, CA{DOT}JULY 19, 2026
            </Text>
          </Section>

          {/* Coming home */}
          <Section style={styles.card}>
            <CardLabel>COMING HOME</CardLabel>
            <Text style={styles.bodyText}>
              Then it&rsquo;s time to come home.
            </Text>
            <Text style={styles.bodyTextLast}>
              On August 23rd I&rsquo;ll be racing the Chicago Triathlon on my
              home turf. I&rsquo;m hoping to have a big group of supporters out
              there bringing the energy and reminding me that I&rsquo;m not
              racing alone.
            </Text>
          </Section>

          {/* Dark close — donation */}
          <Section style={styles.missionCard}>
            <Text style={styles.missionText}>
              If you believe in the Dare2Tri mission and want to help create
              more opportunities for adaptive athletes, please consider
              supporting their work here:
            </Text>
            <CtaButton href="https://give.dare2tri.org/fundraiser/6928347">
              SUPPORT DARE2TRI{NBSP}{NBSP}→
            </CtaButton>
            <Section style={styles.missionDivider} />
            <Text style={styles.donationText}>
              Dare2Tri is a 501(c)(3) charitable organization. Every gift is
              tax-deductible and creates access for adaptive athletes.
            </Text>
          </Section>

          {/* Signoff */}
          <Section style={styles.card}>
            <Text style={styles.bodyText}>Thank you for following along.</Text>
            <Text style={styles.bodyTextLast}>The work continues.</Text>
            <Text style={styles.pullLine}>Life is hard. Be harder.</Text>
            <Section style={styles.signatureBlock}>
              <Text style={styles.signature}>Patrick Wingert</Text>
              <Text style={styles.signatureRole}>
                ADAPTIVE PARA TRIATHLETE{DOT}DARE2TRI ELITE TEAM
              </Text>
            </Section>
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
    fontSize: "52px",
    lineHeight: "0.92",
    color: c.ink,
    margin: 0,
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "52px",
    lineHeight: "0.92",
    color: c.orange,
    margin: 0,
    letterSpacing: "2px",
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
    margin: "0 0 22px",
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
    margin: 0,
  },

  /* Signature */
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
