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
  Section,
  Text,
} from "@react-email/components";
import {
  BrandFooter,
  CardLabel,
  CtaButton,
  Masthead,
  SITE,
  SponsorsCard,
  bebas,
  cardBase,
  colors as c,
  mono,
  system,
} from "./components/brand";

interface LeonsTriathlonInviteEmailProps {
  email?: string;
}

const SUBJECT = "Race Day Is Coming: Leon's Triathlon, June 7";
const PREVIEW =
  "Patrick races America's Race, Leon's Triathlon, on Sunday, June 7 in Hammond, Indiana.";

const raceWeekendItems = [
  {
    n: "01",
    title: "THE NEW BIKE, UP CLOSE",
    text: "Get an in-person look at my new Quintana Roo XPR race bike, generously granted to me courtesy of the Challenged Athletes Foundation.",
  },
  {
    n: "02",
    title: "2026 RACE KIT REVEAL",
    text: "A behind-the-scenes preview of this year's Dare2Tri Elite Team race kit setup before we hit the start line.",
  },
  {
    n: "03",
    title: "HIGH FIVES & PHOTO OPS",
    text: "Free high fives and photo ops after the race for everyone who comes out to show support.",
  },
];

export const leonsTriathlonInviteSubject = SUBJECT;

export default function LeonsTriathlonInviteEmail({
  email,
}: LeonsTriathlonInviteEmailProps) {
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

          <Masthead tag="RACE WEEK BULLETIN" sub="JUNE 2026" />

          {/* Race poster card: logo + headline + orange date band */}
          <Section style={styles.posterCard}>
            <Section style={styles.posterTop}>
              <Img
                src={`${SITE}/email/leons-race-logo.png`}
                width="420"
                height="171"
                alt="America's Race, Leon's Triathlon"
                style={styles.raceLogo}
              />
              <Text style={styles.ecgLine}>{"——————/\\__/\\——————"}</Text>
              <Text style={styles.headline}>SEE YOU</Text>
              <Text style={styles.headlineAccent}>AT THE RACE.</Text>
            </Section>
            <Section style={styles.posterBand}>
              <Text style={styles.bandDate}>SUNDAY, JUNE 7 — 8:45 AM CDT</Text>
              <Text style={styles.bandPlace}>
                WOLF LAKE PARK&nbsp;&nbsp;·&nbsp;&nbsp;HAMMOND, INDIANA
              </Text>
            </Section>
          </Section>

          {/* Letter card */}
          <Section style={styles.card}>
            <CardLabel>A NOTE FROM PATRICK</CardLabel>
            <Text style={styles.bodyText}>
              Dear friends, supporters, sponsors, and community,
            </Text>
            <Text style={styles.bodyText}>
              On Sunday, June 7, I will be racing at America's Race, Leon's
              Triathlon in Hammond, Indiana as part of the USA Triathlon Para
              Development Series.
            </Text>
            <Text style={styles.pullLine}>
              This race is more than a start line.
            </Text>
            <Text style={styles.bodyText}>
              It is another opportunity to represent the adaptive athlete
              community, keep pushing the limits of what is possible in
              endurance sport, and show what resilience looks like in real
              time.
            </Text>
            <Text style={styles.bodyText}>
              Every mile, every transition, and every hard-earned finish is
              built on the support of people like you. The messages,
              encouragement, partnerships, and belief from this community
              matter more than most people realize.
            </Text>
            <Text style={styles.bodyTextLast}>
              If you are local to the area, I would love for you to come out
              and cheer alongside the Dare2Tri Elite Team as we take on one of
              the most meaningful races on the calendar.
            </Text>
            <Section style={styles.signatureBlock}>
              <Text style={styles.signature}>Patrick Wingert</Text>
              <Text style={styles.signatureRole}>
                ADAPTIVE PARA TRIATHLETE&nbsp;&nbsp;·&nbsp;&nbsp;DARE2TRI ELITE
                TEAM
              </Text>
            </Section>
          </Section>

          {/* Race weekend highlights card */}
          <Section style={styles.card}>
            <CardLabel>IF YOU COME OUT RACE WEEKEND</CardLabel>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
            >
              <tbody>
                {raceWeekendItems.map((item, i) => (
                  <tr key={item.n}>
                    <td style={styles.itemNumCell}>
                      <Text style={styles.itemNum}>{item.n}</Text>
                    </td>
                    <td
                      style={
                        i < raceWeekendItems.length - 1
                          ? styles.itemBodyCell
                          : styles.itemBodyCellLast
                      }
                    >
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemText}>{item.text}</Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Photo cards with built-in caption bars */}
          <Section style={styles.photoCard}>
            <Img
              src={`${SITE}/pat_new_bike.jpg`}
              width="528"
              alt="CAF congratulates Patrick with a custom Quintana Roo triathlon bike"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                THE NEW QUINTANA ROO XPR&nbsp;&nbsp;·&nbsp;&nbsp;COURTESY OF
                CAF
              </Text>
            </Section>
          </Section>

          <Section style={styles.photoCard}>
            <Img
              src={`${SITE}/pat_race_suite.png`}
              width="528"
              alt="Patrick's Dare2Tri race kit setup for Leon's Triathlon"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                2026 DARE2TRI ELITE TEAM RACE KIT
              </Text>
            </Section>
          </Section>

          {/* Race details — ticket card */}
          <Section style={styles.ticketCard}>
            <Section style={styles.ticketHead}>
              <Text style={styles.ticketHeadLabel}>RACE DETAILS</Text>
              <Text style={styles.ticketHeadDate}>SUNDAY, JUNE 7</Text>
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
                  <tr>
                    <td style={styles.ticketLabelCell}>
                      <Text style={styles.ticketLabel}>START TIME</Text>
                    </td>
                    <td style={styles.ticketValueCell}>
                      <Text style={styles.ticketValueStrong}>8:45 AM CDT</Text>
                      <Text style={styles.ticketValueSub}>
                        Paratriathlon wave
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Section style={styles.ticketDivider} />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.ticketLabelCell}>
                      <Text style={styles.ticketLabel}>LOCATION</Text>
                    </td>
                    <td style={styles.ticketValueCell}>
                      <Text style={styles.ticketValue}>
                        Wolf Lake Park
                        <br />
                        2324 Calumet Avenue
                        <br />
                        Hammond, Indiana 46320
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Section style={styles.ticketDivider} />
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.ticketLabelCell}>
                      <Text style={styles.ticketLabel}>PARKING</Text>
                    </td>
                    <td style={styles.ticketValueCell}>
                      <Text style={styles.ticketValue}>
                        Available at the race venue. Vehicles cannot exit until
                        the course reopens at 11:30 AM.
                      </Text>
                      <Text style={styles.ticketValueSub}>
                        Leaving earlier? Park at Calumet College, 2400 New York
                        Avenue — a short walk to the venue.
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          </Section>

          {/* Mission card — the one dark moment */}
          <Section style={styles.missionCard}>
            <Text style={styles.missionLabel}>THE SEASON</Text>
            <Text style={styles.missionLine}>MORE THAN RACE RESULTS.</Text>
            <Text style={styles.missionText}>
              Showing up consistently. Choosing discipline over excuses.
              Building visibility for adaptive athletes. Proving that hard
              things are still worth doing.
            </Text>
            <Text style={styles.missionText}>
              If you are able to make it out, your energy on course genuinely
              makes a difference. Thank you for being part of this journey.
            </Text>
            <Text style={styles.missionSignoff}>SEE YOU AT THE RACE.</Text>
            <CtaButton href="https://leonstriathlon.com/">
              RACE INFORMATION&nbsp;&nbsp;→
            </CtaButton>
          </Section>

          <SponsorsCard />

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

  /* Poster card */
  posterCard: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  posterTop: {
    padding: "32px 34px 26px",
    textAlign: "center" as const,
  },
  raceLogo: {
    display: "inline-block",
    margin: "0 auto 24px",
    width: "420px",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },
  ecgLine: {
    fontFamily: mono,
    fontSize: "13px",
    color: c.orange,
    margin: "0 0 18px",
    lineHeight: "1",
    textAlign: "center" as const,
  },
  headline: {
    fontFamily: bebas,
    fontSize: "60px",
    lineHeight: "0.92",
    color: c.ink,
    margin: 0,
    letterSpacing: "3px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "60px",
    lineHeight: "0.92",
    color: c.orange,
    margin: 0,
    letterSpacing: "3px",
    textAlign: "center" as const,
  },
  posterBand: {
    backgroundColor: c.orange,
    padding: "20px 34px 22px",
    textAlign: "center" as const,
  },
  bandDate: {
    fontFamily: bebas,
    fontSize: "28px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 7px",
  },
  bandPlace: {
    fontFamily: mono,
    fontSize: "11px",
    letterSpacing: "2px",
    color: c.orangePale,
    margin: 0,
  },

  /* Cards */
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
  signatureBlock: {
    borderTop: `1px solid ${c.borderSoft}`,
    marginTop: "26px",
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

  /* Numbered highlights */
  itemNumCell: {
    width: "52px",
    verticalAlign: "top" as const,
    paddingTop: "2px",
  },
  itemNum: {
    fontFamily: bebas,
    fontSize: "30px",
    lineHeight: "1",
    color: c.orange,
    margin: 0,
  },
  itemBodyCell: {
    verticalAlign: "top" as const,
    paddingBottom: "20px",
    borderBottom: `1px solid ${c.borderSoft}`,
  },
  itemBodyCellLast: {
    verticalAlign: "top" as const,
  },
  itemTitle: {
    fontFamily: bebas,
    fontSize: "19px",
    letterSpacing: "1.5px",
    lineHeight: "1",
    color: c.ink,
    margin: "4px 0 6px",
  },
  itemText: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.65",
    color: c.body,
    margin: "0 0 16px",
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

  /* Ticket card */
  ticketCard: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  ticketHead: {
    backgroundColor: c.orange,
    padding: "18px 34px 20px",
    textAlign: "center" as const,
  },
  ticketHeadLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "4px",
    color: c.orangeBurnt,
    margin: "0 0 6px",
  },
  ticketHeadDate: {
    fontFamily: bebas,
    fontSize: "34px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: 0,
  },
  ticketBody: {
    padding: "26px 34px 26px",
  },
  ticketLabelCell: {
    width: "108px",
    verticalAlign: "top" as const,
    paddingTop: "2px",
  },
  ticketLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.orangeDeep,
    margin: 0,
  },
  ticketValueCell: {
    verticalAlign: "top" as const,
  },
  ticketValueStrong: {
    fontFamily: bebas,
    fontSize: "22px",
    letterSpacing: "1px",
    lineHeight: "1",
    color: c.ink,
    margin: "0 0 4px",
  },
  ticketValue: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.65",
    color: c.body,
    margin: 0,
  },
  ticketValueSub: {
    fontFamily: system,
    fontSize: "12px",
    lineHeight: "1.6",
    color: c.muted,
    margin: "6px 0 0",
  },
  ticketDivider: {
    height: "1px",
    backgroundColor: c.borderSoft,
    margin: "18px 0",
  },

  /* Mission card */
  missionCard: {
    ...cardBase,
    backgroundColor: c.ink,
    border: "none",
    padding: "36px 38px 38px",
    textAlign: "center" as const,
  },
  missionLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "4px",
    color: c.orange,
    margin: "0 0 14px",
  },
  missionLine: {
    fontFamily: bebas,
    fontSize: "38px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 18px",
  },
  missionText: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.75",
    color: c.inkMutedText,
    margin: "0 0 16px",
  },
  missionSignoff: {
    fontFamily: bebas,
    fontSize: "22px",
    letterSpacing: "2px",
    lineHeight: "1",
    color: c.orange,
    margin: "8px 0 24px",
  },
};
