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
  HeaderBanner,
  Masthead,
  SponsorsCard,
  SITE,
  bebas,
  cardBase,
  colors as c,
  mono,
  system,
} from "./components/brand";

interface LongBeachRaceReportEmailProps {
  email?: string;
}

const NBSP = " ";
const DOT = `${NBSP}${NBSP}·${NBSP}${NBSP}`;

export const longBeachRaceReportSubject =
  "Long Beach Recap: 16 Minutes, 32 Seconds Faster Than a Year Ago";

const PREVIEW =
  "A year ago Long Beach was the start. This weekend it was the measuring stick. The stopwatch only tells the truth.";

const DONATE_URL = "https://give.dare2tri.org/fundraiser/6928347";
// Matches the Nationals entry in lib/race-data.ts.
const NATIONALS_URL = "https://www.usatriathlon.org/2026-usa-triathlon-nationals";
const FUNDING_FORWARD_URL =
  "https://give.dare2tri.org/campaign/funding-forward-motion/c697844";

// Midnight in Milwaukee (US Central, CDT = UTC-5) on race day. The countdown is
// computed at render time so a send that slips a day never ships a stale number.
const NATIONALS_START = Date.parse("2026-08-09T05:00:00Z");

function countdownLabel() {
  const days = Math.ceil((NATIONALS_START - Date.now()) / 86_400_000);
  if (days <= 0) return "RACE DAY";
  return days === 1 ? "1 DAY" : `${days} DAYS`;
}

/**
 * Assets live under /public/email/long-beach-recap/. Filenames are fixed here
 * so the photos can be dropped in without touching the template.
 */
const img = {
  run: `${SITE}/email/long-beach-recap/lb-run.jpg`,
  swimExit: `${SITE}/email/long-beach-recap/lb-swim-exit.jpg`,
  group: `${SITE}/email/long-beach-recap/lb-group.jpg`,
  melissa2025: `${SITE}/email/long-beach-recap/lb-melissa-2025.jpg`,
  melissa2026: `${SITE}/email/long-beach-recap/lb-melissa-2026.jpg`,
  nationals: `${SITE}/email/long-beach-recap/lb-nationals.png`,
  fundingForward: `${SITE}/email/long-beach/funding-forward-motion.png`,
  closing: `${SITE}/email/long-beach-recap/lb-closing.jpg`,
};

/**
 * Long Beach Legacy Triathlon, sprint distance. 2025 vs 2026, both from
 * official chip timing.
 *
 * 2025 (bib 421) publishes per-leg splits directly. 2026 (bib 2732) publishes
 * only cumulative "Start to X" marks, so each leg is derived by subtraction:
 *   T1   = 18:39 - 14:48    BIKE = 56:48 - 18:39    T2 = 58:29 - 56:48
 *   RUN  = 1:20:49 - 58:29
 * Derived this way the 2026 column sums exactly to the official 1:20:49.
 *
 * Note: the 2025 legs sum to 1:37:22 against an official finish of 1:37:21.
 * That one second is truncation inside their timing system, not our math, and
 * it is why the DIFF column sums to 16:33 while the headline (built from the
 * two official finish times) is 16:32.
 */
const splits = [
  { leg: "SWIM", prev: "21:11", now: "14:48", delta: "-6:23" },
  { leg: "T1", prev: "5:42", now: "3:51", delta: "-1:51" },
  { leg: "BIKE", prev: "42:34", now: "38:09", delta: "-4:25" },
  { leg: "T2", prev: "2:01", now: "1:41", delta: "-0:20" },
  { leg: "RUN", prev: "25:54", now: "22:20", delta: "-3:34" },
];

export default function LongBeachRaceReportEmail({
  email,
}: LongBeachRaceReportEmailProps) {
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

          <Masthead tag="RACE REPORT" sub="JULY 19, 2026" />
          <HeaderBanner />

          {/* Headline poster card */}
          <Section style={styles.posterCard}>
            <Section style={styles.posterTop}>
              <Text style={styles.ecgLine}>{"---------/\\__/\\---------"}</Text>
              <Text style={styles.headline}>I DIDN&rsquo;T RACE THE FIELD.</Text>
              <Text style={styles.headlineAccent}>
                I RACED THE MAN I USED TO BE.
              </Text>
            </Section>
            <Img
              src={img.run}
              width="560"
              alt="Patrick Wingert on the run course at the Long Beach Legacy Triathlon"
              style={styles.posterPhoto}
            />
            <Section style={styles.posterBand}>
              <Text style={styles.bandTitle}>
                SUPERTRI LONG BEACH LEGACY TRIATHLON
              </Text>
              <Text style={styles.bandSub}>
                NATIONALS QUALIFIER SERIES{DOT}LONG BEACH, CA
              </Text>
            </Section>
          </Section>

          {/* Opening letter */}
          <Section style={styles.card}>
            <CardLabel>A NOTE FROM PATRICK</CardLabel>
            <Text style={styles.bodyText}>
              A year ago, I crossed the finish line in Long Beach wondering what
              was possible.
            </Text>
            <Text style={styles.bodyTextLast}>
              This weekend, I came back to find out.
            </Text>
            <Text style={styles.pullLine}>
              Not to race the field. To race the man I used to be.
            </Text>
          </Section>

          {/* The question */}
          <Section style={styles.card}>
            <CardLabel>THE QUESTION</CardLabel>
            <Text style={styles.bodyText}>
              Long Beach is where this triathlon journey began. Twelve months
              later, I stood on the very same beach with one question:
            </Text>
            <Text style={styles.pullLine}>Did the work matter?</Text>
            <Text style={styles.bodyTextLast}>
              The answer was waiting at the finish line.
            </Text>
          </Section>

          {/* The receipt — 2025 vs 2026 */}
          <Section style={styles.ticketCard}>
            <Section style={styles.ticketHead}>
              <Text style={styles.ticketHeadLabel}>
                THE SAME COURSE{DOT}ONE YEAR APART
              </Text>
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
              >
                <tbody>
                  <tr>
                    <td style={styles.headYearCell}>
                      <Text style={styles.headYearLabel}>2025</Text>
                      <Text style={styles.headYearTimeOld}>1:37:21</Text>
                    </td>
                    <td style={styles.headArrowCell}>
                      <Text style={styles.headArrow}>&rarr;</Text>
                    </td>
                    <td style={styles.headYearCell}>
                      <Text style={styles.headYearLabel}>2026</Text>
                      <Text style={styles.headYearTimeNew}>1:20:49</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Section style={styles.deltaBadgeWrap}>
                <Text style={styles.deltaBadge}>
                  A 16 MINUTE, 32 SECOND IMPROVEMENT IN ONE YEAR
                </Text>
              </Section>
            </Section>
          </Section>

          {/* The stopwatch + the splits it produced */}
          <Section style={styles.card}>
            <CardLabel>WHAT THE CLOCK MEANS</CardLabel>
            <Text style={styles.bodyText}>
              The stopwatch doesn&rsquo;t care about intentions. It doesn&rsquo;t
              care about excuses. It only tells the truth.
            </Text>
            <Text style={styles.bodyTextLast}>
              This year, the truth looked like this:
            </Text>

            <Section style={styles.splitsBlock}>
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
              >
                <tbody>
                  <tr>
                    <td style={styles.colHeadLeg} />
                    <td style={styles.colHeadNum}>
                      <Text style={styles.colHeadText}>2025</Text>
                    </td>
                    <td style={styles.colHeadNum}>
                      <Text style={styles.colHeadText}>2026</Text>
                    </td>
                    <td style={styles.colHeadDelta}>
                      <Text style={styles.colHeadText}>DIFF</Text>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <Section style={styles.splitDivider} />
                    </td>
                  </tr>
                  {splits.map((split) => (
                    <tr key={split.leg}>
                      <td style={styles.splitLegCell}>
                        <Text style={styles.splitLeg}>{split.leg}</Text>
                      </td>
                      <td style={styles.splitNumCell}>
                        <Text style={styles.splitPrev}>{split.prev}</Text>
                      </td>
                      <td style={styles.splitNumCell}>
                        <Text style={styles.splitNow}>{split.now}</Text>
                      </td>
                      <td style={styles.splitDeltaCell}>
                        <Text style={styles.splitDelta}>{split.delta}</Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            <Text style={styles.bodyText}>
              Those aren&rsquo;t just faster splits.
            </Text>
            <Text style={styles.bodyTextLast}>
              They&rsquo;re hundreds of early mornings and late nights.
              They&rsquo;re swims that didn&rsquo;t go well. They&rsquo;re
              strength sessions when I was tired. They&rsquo;re long rides on the
              trainer in the garage or out in Marin hills and into the wind.
              They&rsquo;re choosing discipline over comfort, over and over
              again, until discipline becomes who you are.
            </Text>
          </Section>

          {/* Swim exit photo */}
          <Section style={styles.photoCard}>
            <Img
              src={img.swimExit}
              width="528"
              alt="Patrick Wingert coming out of the water with two Dare2Tri volunteers"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                SWIM EXIT{DOT}14:48
              </Text>
            </Section>
          </Section>

          {/* The bigger full circle */}
          <Section style={styles.card}>
            <CardLabel>THE BIGGER FULL CIRCLE</CardLabel>
            <Text style={styles.bodyText}>
              But the race wasn&rsquo;t the biggest full-circle moment.
            </Text>
            <Text style={styles.bodyText}>
              A year ago, I arrived at Dare2Tri&rsquo;s Train to Race Camp as the
              nervous new guy hoping just to survive. I spent the first 200m of
              last years swim trying to convince myself it was ok to quit.
              Instead I pushed through. Every workout, every transition, every
              question was a reminder that I was still trying to figure this
              sport out.
            </Text>
            <Text style={styles.bodyText}>
              But this year, this race was different.
            </Text>
            <Text style={styles.bodyText}>
              I arrived with a whole season&rsquo;s worth of races behind me,
              more confidence, and a different responsibility.
            </Text>
            <Text style={styles.bodyText}>
              Instead of looking for reassurance, I had the opportunity to
              encourage the athletes standing exactly where I stood a year ago.
              To answer questions. To share lessons. To motivate and inspire. To
              remind them that they belong even if they didn&rsquo;t know it yet.
            </Text>
            <Text style={styles.bodyTextLast}>
              That&rsquo;s what Dare2Tri does so well.
            </Text>
          </Section>

          {/* Group photo */}
          <Section style={styles.photoCard}>
            <Img
              src={img.group}
              width="528"
              alt="The Dare2Tri team gathered under the swim finish arch at Long Beach"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                DARE2TRI{DOT}LONG BEACH{DOT}#ONEINSPIRESMANY
              </Text>
            </Section>
          </Section>

          {/* One inspires many */}
          <Section style={styles.card}>
            <Text style={styles.pullLine}>One inspires many.</Text>
            <Text style={styles.bodyTextLast}>
              It doesn&rsquo;t just develop athletes. It develops leaders who
              come back and help the next person find their confidence. I
              experienced that firsthand last year from guys like{" "}
              <Link
                href="https://www.instagram.com/kylestepp"
                style={styles.inlineLink}
              >
                Kyle Stepp (@kylestepp)
              </Link>
              , and this weekend I had the privilege of paying it forward. I got
              to be a part of numerous adaptive athletes taking on their first
              triathlon and I met each of them at the finish with a hug and the
              question, &ldquo;What did you learn today?&rdquo;
            </Text>
          </Section>

          {/* Melissa — 2025 vs 2026 diptych */}
          <Section style={styles.photoPairWrap}>
            <Row>
              <Column style={styles.photoPairColLeft}>
                <Img
                  src={img.melissa2025}
                  width="252"
                  alt="Patrick Wingert with Melissa Stockwell on the beach in 2025, before his first triathlon"
                  style={styles.photoPair}
                />
              </Column>
              <Column style={styles.photoPairColRight}>
                <Img
                  src={img.melissa2026}
                  width="252"
                  alt="Patrick Wingert with Melissa Stockwell on the beach in 2026, one year later"
                  style={styles.photoPair}
                />
              </Column>
            </Row>
            <Section style={styles.pairCaptionBar}>
              <Text style={styles.captionText}>
                2025{NBSP}{NBSP}|{NBSP}{NBSP}2026
              </Text>
            </Section>
          </Section>

          {/* Thank you */}
          <Section style={styles.card}>
            <CardLabel>THE PEOPLE</CardLabel>
            <Text style={styles.bodyText}>
              Standing next to my friend{" "}
              <Link
                href="https://www.instagram.com/mstockwell01"
                style={styles.inlineLink}
              >
                Melissa Stockwell (@mstockwell01)
              </Link>{" "}
              on the beach on race morning for the second year in a row drove
              that point home. Melissa helped blaze a trail for athletes like me.
              Dare2Tri gave me the opportunity to walk it. Now it&rsquo;s my
              responsibility to help widen that path for the athletes coming
              next.
            </Text>
            <Text style={styles.bodyText}>
              To Keri, Dan, Melissa, Ryan, Kyle, Chris, Shannon, all the coaches,
              volunteers, teammates, and everyone who pours their heart into
              Dare2Tri: thank you. Truly. This weekend was another reminder that
              none of us stands on the start line alone.
            </Text>
            <Text style={styles.bodyTextLast}>
              The same goes for all of the sponsors who continue to believe in
              this mission and invest in what&rsquo;s possible.
            </Text>
          </Section>

          {/* Sponsors */}
          <SponsorsCard />

          {/* Gratitude / reflection */}
          <Section style={styles.card}>
            <CardLabel>EVERYTHING ELSE IS EXTRA</CardLabel>
            <Text style={styles.bodyText}>
              As I&rsquo;ve reflected on this weekend, one thought keeps coming
              back to me.
            </Text>
            <Text style={styles.bodyText}>
              I never dreamed that at 41 years old I&rsquo;d be sober, with one
              and a half legs, and competing for a national championship, let
              alone in an endurance sport.
            </Text>
            <Text style={styles.bodyText}>
              Years ago, I would&rsquo;ve thought this life was impossible.
            </Text>
            <Text style={styles.bodyText}>
              Now I understand what Tommy Shelby meant when he said,
              &ldquo;Everything else is extra.&rdquo;
            </Text>
            <Text style={styles.bodyText}>
              For me, sobriety and a dance with death gave me a second chance at
              life. Every finish line, every training session, every friendship,
              every race, every opportunity to inspire someone else has been a
              gift I never expected.
            </Text>
            <Text style={styles.bodyTextLast}>
              I&rsquo;m grateful to be here. I&rsquo;m grateful for the
              opportunity to suffer.
            </Text>
          </Section>

          {/* Long Beach was the measuring stick */}
          <Section style={styles.card}>
            <CardLabel>THE MEASURING STICK</CardLabel>
            <Text style={styles.bodyText}>
              But Long Beach was never the goal.
            </Text>
            <Text style={styles.bodyText}>It was the measuring stick.</Text>
            <Text style={styles.bodyText}>
              Everything this season has been building toward one race:
            </Text>
            <Text style={styles.pullLine}>
              USA Triathlon Paratriathlon National Championships.
            </Text>
          </Section>

          {/* Nationals logo */}
          <Section style={styles.logoCard}>
            <Link href={NATIONALS_URL} style={styles.imageLink}>
              <Img
                src={img.nationals}
                width="420"
                alt="USA Triathlon Nationals 2026, Milwaukee, Wisconsin"
                style={styles.logoImage}
              />
            </Link>
          </Section>

          {/* Standings */}
          <Section style={styles.card}>
            <CardLabel>WHERE THINGS STAND</CardLabel>
            <Text style={styles.bodyText}>
              After Pleasant Prairie, I moved into 2nd place in the USA Triathlon
              Paratriathlon National Qualifier Series. Long Beach added to the
              points, held the position and showed me that the work is paying
              off.
            </Text>
            <Text style={styles.bodyText}>
              Now it&rsquo;s time to see what it&rsquo;s all adds up to.
            </Text>
            <Text style={styles.bodyTextLast}>The goal is simple.</Text>
            <Text style={styles.pullLine}>Stand on the podium at Nationals.</Text>
          </Section>

          {/* Next race countdown */}
          <Section style={styles.nextCard}>
            <Text style={styles.nextLabel}>NEXT UP</Text>
            <Text style={styles.nextDays}>{countdownLabel()}</Text>
            <Text style={styles.nextName}>
              USA TRIATHLON PARATRIATHLON NATIONAL CHAMPIONSHIPS
            </Text>
            <Text style={styles.nextSub}>
              MILWAUKEE, WI{DOT}AUGUST 9, 2026
            </Text>
          </Section>

          {/* Come to Milwaukee */}
          <Section style={styles.card}>
            <CardLabel>COME STAND IN OUR CORNER</CardLabel>
            <Text style={styles.bodyText}>
              If you&rsquo;re anywhere near Milwaukee, I&rsquo;d love to have you
              there. Adaptive sport is something you have to see in person to
              fully appreciate. Come cheer, meet the athletes, and experience
              what this community is all about. Having familiar faces on the
              course makes a difference, and we&rsquo;d love to have you in our
              corner.
            </Text>
            <Text style={styles.bodyTextLast}>
              If you can&rsquo;t make it, you can still help change lives.
            </Text>
          </Section>

          {/* Funding Forward Motion */}
          <Section style={styles.photoCard}>
            <Link href={FUNDING_FORWARD_URL} style={styles.imageLink}>
              <Img
                src={img.fundingForward}
                width="528"
                alt="Dare2Tri Funding Forward Motion campaign"
                style={styles.photo}
              />
            </Link>
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                DISABILITY PRIDE MONTH{DOT}ADA ANNIVERSARY{DOT}JULY 2026
              </Text>
            </Section>
          </Section>

          <Section style={styles.card}>
            <CardLabel>WHY WE&rsquo;RE MOVING</CardLabel>
            <Text style={styles.bodyTextLast}>
              July marks both Disability Pride Month and the anniversary of the
              Americans with Disabilities Act (ADA), a landmark moment in the
              fight for disability rights and access. In honor of this month,
              we&rsquo;ve launched <strong>Funding Forward Motion</strong>, a
              campaign to celebrate progress, expand access, and remove financial
              barriers for athletes of all levels.
            </Text>
          </Section>

          {/* Dark close — donation */}
          <Section style={styles.missionCard}>
            <Text style={styles.missionText}>
              Please consider supporting Dare2Tri and the incredible work they do
              to create opportunities for adaptive athletes across the country.
            </Text>
            <CtaButton href={DONATE_URL}>
              SUPPORT MY FUNDRAISER{NBSP}{NBSP}&rarr;
            </CtaButton>
            <Section style={styles.missionDivider} />
            <Text style={styles.donationText}>
              Dare2Tri is a 501(c)(3) charitable organization. Every gift is
              tax-deductible and creates access for adaptive athletes.
            </Text>
          </Section>

          {/* Closing photo */}
          <Section style={styles.photoCard}>
            <Img
              src={img.closing}
              width="528"
              alt="Patrick Wingert looking out over the course after the race"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                TODAY&rsquo;S FINISH LINE IS JUST ANOTHER START LINE
              </Text>
            </Section>
          </Section>

          {/* Signoff */}
          <Section style={styles.card}>
            <Text style={styles.bodyText}>
              Today&rsquo;s finish line is just another start line.
            </Text>
            <Text style={styles.bodyTextLast}>The work continues.</Text>
            <Text style={styles.pullLine}>Life is hard. Be harder.</Text>
            <Section style={styles.signatureBlock}>
              <Text style={styles.signature}>Patrick Wingert</Text>
              <Text style={styles.signatureRole}>
                ADAPTIVE ATHLETE{DOT}DARE2TRI ELITE TEAM 2026
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
    fontSize: "44px",
    lineHeight: "0.94",
    color: c.ink,
    margin: 0,
    letterSpacing: "1.5px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "44px",
    lineHeight: "0.94",
    color: c.orange,
    margin: "6px 0 0",
    letterSpacing: "1.5px",
    textAlign: "center" as const,
  },
  // Sits flush between the headline and the orange band, so the band reads as
  // the photo's caption rather than a separate element.
  posterPhoto: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
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
  // Wrapping an <Img> in a link: kill the underline and the baseline gap that
  // Outlook otherwise leaves under a linked image.
  imageLink: {
    display: "block",
    textDecoration: "none",
    border: "none",
    lineHeight: 0,
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

  /* Logo card (Nationals badge on white) */
  logoCard: {
    ...cardBase,
    padding: "30px 34px",
    textAlign: "center" as const,
  },
  logoImage: {
    display: "block",
    width: "100%",
    maxWidth: "420px",
    height: "auto",
    margin: "0 auto",
    border: "none",
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

  /* Comparison ticket */
  ticketCard: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  ticketHead: {
    backgroundColor: c.ink,
    padding: "26px 30px 28px",
    textAlign: "center" as const,
  },
  ticketHeadLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.orange,
    margin: "0 0 20px",
  },
  headYearCell: {
    width: "42%",
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
  },
  headArrowCell: {
    width: "16%",
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
  },
  headYearLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.inkFaintText,
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  headYearTimeOld: {
    fontFamily: bebas,
    fontSize: "38px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: c.inkMutedText,
    margin: 0,
    textAlign: "center" as const,
  },
  headYearTimeNew: {
    fontFamily: bebas,
    fontSize: "44px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: "#ffffff",
    margin: 0,
    textAlign: "center" as const,
  },
  headArrow: {
    fontFamily: system,
    fontSize: "22px",
    lineHeight: "1",
    color: c.orange,
    margin: "18px 0 0",
    textAlign: "center" as const,
  },
  deltaBadgeWrap: {
    marginTop: "22px",
    textAlign: "center" as const,
  },
  deltaBadge: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    lineHeight: "1.5",
    color: c.orange,
    margin: 0,
    textAlign: "center" as const,
  },

  ticketBody: {
    padding: "22px 30px 26px",
  },
  colHeadLeg: {
    width: "22%",
  },
  colHeadNum: {
    width: "24%",
    textAlign: "right" as const,
  },
  colHeadDelta: {
    width: "30%",
    textAlign: "right" as const,
  },
  colHeadText: {
    fontFamily: mono,
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.faint,
    margin: 0,
  },
  splitLegCell: {
    width: "22%",
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
  splitNumCell: {
    width: "24%",
    verticalAlign: "middle" as const,
    textAlign: "right" as const,
    padding: "7px 0",
  },
  splitPrev: {
    fontFamily: bebas,
    fontSize: "20px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: c.faint,
    margin: 0,
    textAlign: "right" as const,
  },
  splitNow: {
    fontFamily: bebas,
    fontSize: "24px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: c.ink,
    margin: 0,
    textAlign: "right" as const,
  },
  splitPrevTotal: {
    fontFamily: bebas,
    fontSize: "22px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: c.faint,
    margin: 0,
    textAlign: "right" as const,
  },
  splitNowTotal: {
    fontFamily: bebas,
    fontSize: "26px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: c.ink,
    margin: 0,
    textAlign: "right" as const,
  },
  splitDeltaCell: {
    width: "30%",
    verticalAlign: "middle" as const,
    textAlign: "right" as const,
    padding: "7px 0",
  },
  splitDelta: {
    fontFamily: mono,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: c.green,
    margin: 0,
    textAlign: "right" as const,
  },
  splitDeltaTotal: {
    fontFamily: mono,
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: c.orange,
    margin: 0,
    textAlign: "right" as const,
  },
  splitDivider: {
    height: "1px",
    backgroundColor: c.borderSoft,
    margin: "10px 0",
  },
  // Splits rendered inline under "the truth looked like this:" — framed so the
  // stat block reads as evidence, not another card.
  splitsBlock: {
    backgroundColor: "#faf9f6",
    border: `1px solid ${c.borderSoft}`,
    borderRadius: "10px",
    padding: "16px 20px",
    margin: "18px 0 22px",
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
    fontSize: "24px",
    lineHeight: "1.05",
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
