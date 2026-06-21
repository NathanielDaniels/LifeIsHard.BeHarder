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
  sponsorUrls,
  system,
} from "./components/brand";

interface PleasantPrairieEmailProps {
  email?: string;
}

const NBSP = " ";
const DOT = `${NBSP}${NBSP}.${NBSP}${NBSP}`;

export const pleasantPrairieEmailSubject =
  "Race Week: Pleasant Prairie Triathlon";

const PREVIEW =
  "Patrick heads to Wisconsin ranked #3 nationally and chasing the next step of the season.";

const links = {
  raceInfo:
    "https://www.pleasantprairietri.com/Race/WI/PleasantPrairie/PleasantPrairieTriathlon",
  leaderboard:
    "https://usatriathlon.app.box.com/s/f6lab1jdx5qhn34laz2btsfj7s0m1w6z",
  donation: "https://give.dare2tri.org/fundraiser/6928347",
  orucase: "https://www.orucase.com/",
  strava: "https://www.strava.com/athletes/69060081",
  instagram: "https://www.instagram.com/patwingit",
  youtube: "https://www.youtube.com/@PatWingIt",
};

const images = {
  header: `${SITE}/email/header.jpeg`,
  raceLogo: `${SITE}/email/triathlon_pleasant_prairie.png`,
  raceProof: `${SITE}/email/raceProof_leonsResults.jpeg`,
  training: `${SITE}/email/training.jpeg`,
  bikeBag: `${SITE}/email/bike_bag_damage.jpeg`,
  grit: `${SITE}/email/grit.jpeg`,
};

const followLinks = [
  { label: "STRAVA", href: links.strava },
  { label: "INSTAGRAM", href: links.instagram },
  { label: "YOUTUBE", href: links.youtube },
];

export default function PleasantPrairieEmail({
  email,
}: PleasantPrairieEmailProps) {
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

          <Section style={styles.headerImageCard}>
            <Img
              src={images.header}
              width="620"
              alt="Patrick Wingert Dare2Tri Elite race banner"
              style={styles.headerImage}
            />
          </Section>

          <Section style={styles.posterCard}>
            <Section style={styles.posterTop}>
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                align="center"
                style={styles.raceLogoTable}
              >
                <tbody>
                  <tr>
                    <td align="center">
                      <Img
                        src={images.raceLogo}
                        width="210"
                        height="150"
                        alt="Pleasant Prairie Triathlon"
                        style={styles.raceLogo}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <Text style={styles.ecgLine}>{"---------/\\__/\\---------"}</Text>
              <Text style={styles.headline}>THE NEXT CHAPTER</Text>
              <Text style={styles.headlineAccent}>IS HERE.</Text>
            </Section>
            <Section style={styles.posterBand}>
              <Text style={styles.bandTitle}>PLEASANT PRAIRIE TRIATHLON</Text>
              <Text style={styles.bandSub}>
                USA TRIATHLON PARATRIATHLON NATIONAL SERIES
                <br />
                JUNE 28, 2026
              </Text>
            </Section>
          </Section>

          <Section style={styles.card}>
            <CardLabel>A NOTE FROM PATRICK</CardLabel>
            <Text style={styles.bodyText}>Hey everyone,</Text>
            <Text style={styles.bodyText}>
              The next chapter of the race season is here.
            </Text>
            <Text style={styles.bodyText}>
              Next Sunday, June 28th, I'll be racing the Pleasant Prairie
              Triathlon in Wisconsin as part of the USA Triathlon Paratriathlon
              National Series.
            </Text>
            <Text style={styles.bodyText}>
              A few weeks ago, I lined up at America's Race in Leon's Triathlon,
              finished 2nd in the PTS4 category and earned my spot at the 2026
              USAT Paratriathlon National Championships.
            </Text>
            <Text style={styles.pullLine}>That was the goal.</Text>
            <Text style={styles.bodyText}>
              But making Nationals was never the finish line.
            </Text>
            <Text style={styles.bodyTextLast}>
              Now it's about showing up, racing hard, and seeing how far I can
              push it.
            </Text>
          </Section>

          <PhotoCard
            src={images.raceProof}
            alt="Patrick's Leon's Triathlon 2nd Place PTS4 Male race proof"
            caption="LEON'S TRIATHLON RESULT - 2ND PLACE PTS4 MALE"
          />

          <Section style={styles.card}>
            <CardLabel>THE WORK</CardLabel>
            <Text style={styles.bodyText}>
              Heading into Pleasant Prairie, I am currently sitting{" "}
              <Link href={links.leaderboard} style={styles.inlineLink}>
                #3 on the national leaderboard
              </Link>{" "}
              and looking to move up against some of the best adaptive athletes
              in the country.
            </Text>
            <Text style={styles.bodyText}>
              The work is not glamorous.
            </Text>
            <Text style={styles.bodyText}>
              It's late nights.
              <br />
              It's workouts that suck.
              <br />
              It's pushing through sessions when everything hurts and I would
              rather do almost anything else.
            </Text>
            <Text style={styles.bodyTextLast}>
              If you want to see the real stats, follow along on Strava. You
              can see exactly how much fun the training is. No social filters or
              reels. Just the work.
            </Text>
          </Section>

          <PhotoCard
            src={images.training}
            alt="Patrick training by the pool during race season"
            caption="TRAINING BLOCK - NO FILTERS, JUST THE WORK"
          />

          <Section style={styles.card}>
            <CardLabel>RACE UPDATE</CardLabel>
            <Text style={styles.bodyText}>
              After Leon's, my return flight home came with an unexpected bonus
              nobody asked for. My new Quintana Roo XPR race bike and my travel
              bag were damaged by the airline.
            </Text>
            <Text style={styles.bodyText}>
              The good news is the team at{" "}
              <Link href={links.orucase} style={styles.inlineLink}>
                Orucase
              </Link>{" "}
              stepped up and replaced the outer shell of my travel bag. Huge
              thank you to them for standing behind their product and supporting
              athletes.
            </Text>
            <Text style={styles.bodyText}>
              The bike is still at the shop getting repaired. We are waiting to
              see if it will be ready for Pleasant Prairie.
            </Text>
            <Text style={styles.pullLine}>If it is not, no problem.</Text>
            <Text style={styles.bodyText}>
              We go back to the old race bike and get the job done.
            </Text>
            <Text style={styles.bodyTextLast}>
              That's racing. That's life. Things break. Plans change. You adapt
              and overcome.
            </Text>
            <Section style={styles.buttonWrap}>
              <CtaButton href={links.raceInfo}>
                RACE INFORMATION{NBSP}
                {NBSP}
                {"->"}
              </CtaButton>
            </Section>
          </Section>

          <PhotoCard
            src={images.bikeBag}
            alt="Damaged Orucase bike travel bag after Patrick's return flight"
            caption="TRAVEL DAMAGE - PLANS CHANGE, YOU ADAPT"
          />

          <Section style={styles.card}>
            <CardLabel>RACE WEEKEND</CardLabel>
            <Text style={styles.bodyText}>
              Pleasant Prairie, also known as PP, is race #2 of 3 in the
              Chicagoland Triathlon Series. I'm excited to keep chasing the
              trifecta and continue building momentum through the season.
            </Text>
            <Text style={styles.bodyTextLast}>
              If you are anywhere in the Midwest, come out and make some noise.
              The Dare2Tri Elite Team will be there racing, and hearing people
              cheer from the sidelines matters. Those moments hit differently
              when the legs are tired and the race gets hard.
            </Text>
          </Section>

          <Section style={styles.ticketCard}>
            <Section style={styles.ticketHead}>
              <Text style={styles.ticketHeadLabel}>RACE DETAILS</Text>
              <Text style={styles.ticketHeadDate}>SUNDAY, JUNE 28</Text>
            </Section>
            <Section style={styles.ticketBody}>
              <DetailRow label="EVENT" value="Pleasant Prairie Triathlon" />
              <TicketDivider />
              <DetailRow label="LOCATION" value="Pleasant Prairie, Wisconsin" />
              <TicketDivider />
              <DetailRow
                label="PARA START"
                value="6:30 AM"
                sub="Paratriathlon wave"
              />
              <TicketDivider />
              <DetailRow
                label="VENUE"
                value="Pleasant Prairie RecPlex / Lake Andrea"
              />
            </Section>
          </Section>

          <PhotoCard
            src={images.grit}
            alt="Patrick holding his hat beside his prosthetic"
            caption="HARD THINGS ARE WORTH CHASING"
          />

          <Section style={styles.card}>
            <CardLabel>WHY THIS MATTERS</CardLabel>
            <Text style={styles.bodyText}>
              This journey has never been about pretending things are easy.
            </Text>
            <Text style={styles.bodyText}>
              Losing my leg changed my life. It forced me to rebuild, rethink,
              and redefine what was possible.
            </Text>
            <Text style={styles.bodyText}>
              Sport gave me a place to do that.
            </Text>
            <Text style={styles.bodyText}>It gave me a challenge.</Text>
            <Text style={styles.bodyText}>It gave me a community.</Text>
            <Text style={styles.bodyTextLast}>
              And it gave me a way to prove that the hard things are often the
              things worth chasing.
            </Text>
          </Section>

          <Section style={styles.missionCard}>
            <Text style={styles.missionText}>
              If you want to help support this race season and create more
              opportunities for adaptive athletes, you can make a tax deductible
              donation here:
            </Text>
            <Text style={styles.missionLine}>THIS IS BIGGER THAN ONE RACE.</Text>
            <Text style={styles.missionSignoff}>ONE RACE AT A TIME.</Text>
            <CtaButton href={links.donation}>
              SUPPORT DARE2TRI{NBSP}
              {NBSP}
              {"->"}
            </CtaButton>
            <Section style={styles.missionDivider} />
            <Text style={styles.donationText}>
              Your belief, support, and investment make this possible. This is
              bigger than one athlete and one race. It is about building a
              future where adaptive athletes have more opportunities to compete,
              grow, and chase big goals.
            </Text>
          </Section>

          <SponsorsCard />

          <Section style={styles.followCard}>
            <Text style={styles.followLabel}>FOLLOW THE JOURNEY</Text>
            <Text style={styles.centerBodyText}>You can follow along:</Text>
            <Row style={styles.followRow}>
              {followLinks.map((link) => (
                <Column key={link.label} style={styles.followCol}>
                  <Link href={link.href} style={styles.followButton}>
                    {link.label}
                  </Link>
                </Column>
              ))}
            </Row>
            <Text style={styles.centerBodyText}>
              Like, subscribe, and follow the journey. The good, the bad, the
              ugly, and everything in between.
            </Text>
            <Text style={styles.centerBodyText}>
              Thanks for being part of this.
            </Text>
            <Text style={styles.centerBodyTextLast}>
              See you at the finish line.
            </Text>
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

function PhotoCard({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <Section style={styles.photoCard}>
      <Img src={src} width="528" alt={alt} style={styles.photo} />
      <Section style={styles.captionBar}>
        <Text style={styles.captionText}>{caption}</Text>
      </Section>
    </Section>
  );
}

function TicketDivider() {
  return <Section style={styles.ticketDivider} />;
}

function DetailRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Row>
      <Column style={styles.ticketLabelCell}>
        <Text style={styles.ticketLabel}>{label}</Text>
      </Column>
      <Column style={styles.ticketValueCell}>
        <Text style={styles.ticketValueStrong}>{value}</Text>
        {sub && <Text style={styles.ticketValueSub}>{sub}</Text>}
      </Column>
    </Row>
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
  headerImageCard: {
    backgroundColor: c.ink,
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
  posterCard: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  posterTop: {
    padding: "30px 34px 28px",
    textAlign: "center" as const,
  },
  raceLogo: {
    display: "block",
    width: "210px",
    height: "150px",
    margin: 0,
    border: "none",
    borderRadius: "10px",
  },
  raceLogoTable: {
    margin: "0 auto 14px",
    width: "210px",
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
    fontSize: "54px",
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
    fontSize: "23px",
    lineHeight: "1.1",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: "0 0 6px",
  },
  bandSub: {
    fontFamily: mono,
    fontSize: "10px",
    lineHeight: "1.8",
    letterSpacing: "2px",
    color: c.orangePale,
    margin: 0,
  },
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
  centerBodyText: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.75",
    color: c.body,
    margin: "0 0 18px",
    textAlign: "center" as const,
  },
  centerBodyTextLast: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.75",
    color: c.body,
    margin: 0,
    textAlign: "center" as const,
  },
  pullLine: {
    fontFamily: bebas,
    fontSize: "28px",
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
    fontWeight: 700,
  },
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
  buttonWrap: {
    marginTop: "24px",
  },
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
  ticketHeadDate: {
    fontFamily: bebas,
    fontSize: "50px",
    lineHeight: "1",
    letterSpacing: "3px",
    color: "#ffffff",
    margin: 0,
  },
  ticketBody: {
    padding: "24px 34px 26px",
  },
  ticketLabelCell: {
    width: "110px",
    verticalAlign: "middle" as const,
    padding: "7px 0",
  },
  ticketValueCell: {
    verticalAlign: "middle" as const,
    padding: "7px 0",
  },
  ticketLabel: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.orangeDeep,
    margin: 0,
  },
  ticketValueStrong: {
    fontFamily: bebas,
    fontSize: "25px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: c.ink,
    margin: "0 0 4px",
  },
  ticketValueSub: {
    fontFamily: system,
    fontSize: "13px",
    lineHeight: "1.45",
    color: c.muted,
    margin: 0,
  },
  ticketDivider: {
    height: "1px",
    backgroundColor: c.borderSoft,
    margin: "10px 0",
  },
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
    lineHeight: "1",
    letterSpacing: "2px",
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
    margin: 0,
  },
  followCard: {
    ...cardBase,
    textAlign: "center" as const,
  },
  followLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "4px",
    color: c.orangeDeep,
    margin: "0 0 26px",
    textAlign: "center" as const,
  },
  followRow: {
    width: "100%",
    margin: "8px 0 24px",
  },
  followCol: {
    width: "33.333%",
    textAlign: "center" as const,
    padding: "0 4px",
  },
  followButton: {
    display: "block",
    backgroundColor: c.orange,
    borderRadius: "6px",
    color: "#ffffff",
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textDecoration: "none",
    padding: "13px 8px",
  },
  signatureBlock: {
    borderTop: `1px solid ${c.borderSoft}`,
    paddingTop: "20px",
    marginTop: "4px",
    textAlign: "center" as const,
  },
  signature: {
    fontFamily: bebas,
    fontSize: "25px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: c.ink,
    margin: "0 0 6px",
    textAlign: "center" as const,
  },
  signatureRole: {
    fontFamily: mono,
    fontSize: "10px",
    letterSpacing: "2px",
    color: c.muted,
    margin: 0,
    textAlign: "center" as const,
  },
};
