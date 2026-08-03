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

interface NationalsPreRaceEmailProps {
  email?: string;
}

const NBSP = " ";
const DOT = `${NBSP}${NBSP}·${NBSP}${NBSP}`;

// Patrick's own opening line, used verbatim as the subject. Do not rewrite it.
export const nationalsPreRaceSubject = "One year of preparing for a single day.";

const PREVIEW =
  "Next Sunday the horn sounds at the USA Triathlon Paratriathlon National Championships. Everything before it was preparation.";

const DONATE_URL = "https://give.dare2tri.org/fundraiser/6928347";
// Matches the Nationals entry in lib/race-data.ts.
const NATIONALS_URL = "https://www.usatriathlon.org/2026-usa-triathlon-nationals";
const INSTAGRAM_URL = "https://www.instagram.com/patwingit";
const YOUTUBE_URL = "https://www.youtube.com/@PatWingIt";

// Midnight in Milwaukee (US Central, CDT = UTC-5) on race day. The countdown is
// computed at render time so a send that slips a day never ships a stale number.
const NATIONALS_START = Date.parse("2026-08-09T05:00:00Z");

function countdownLabel() {
  const days = Math.ceil((NATIONALS_START - Date.now()) / 86_400_000);
  if (days <= 0) return "RACE DAY";
  return days === 1 ? "1 DAY" : `${days} DAYS`;
}

/**
 * New photos live under /public/email/nationals/. Filenames are fixed here so
 * the photos can be dropped in without touching the template. The Nationals
 * badge is reused from the Long Beach recap send.
 */
const img = {
  hero: `${SITE}/email/nationals/nat-hero.jpg`,
  cafJersey: `${SITE}/email/nationals/nat-caf-jersey.jpg`,
  keriMelissa: `${SITE}/email/nationals/nat-keri-melissa.jpg`,
  nationals: `${SITE}/email/long-beach-recap/lb-nationals.png`,
  closing: `${SITE}/email/nationals/nat-closing.jpg`,
};

export default function NationalsPreRaceEmail({
  email,
}: NationalsPreRaceEmailProps) {
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

          <Masthead tag="RACE WEEK" sub="AUGUST 9, 2026" />
          <HeaderBanner />

          {/* Headline poster card — Patrick's opening lines, verbatim */}
          <Section style={styles.posterCard}>
            <Section style={styles.posterTop}>
              <Text style={styles.ecgLine}>{"---------/\\__/\\---------"}</Text>
              <Text style={styles.headlineKicker}>ONE YEAR.</Text>
              <Text style={styles.headlineAccent}>
                ONE YEAR OF PREPARING FOR A SINGLE DAY.
              </Text>
            </Section>
            <Img
              src={img.hero}
              width="560"
              alt="Patrick Wingert at the start line, Pleasant Prairie Triathlon"
              style={styles.posterPhoto}
            />
            <Section style={styles.posterBand}>
              <Text style={styles.bandTitle}>
                USA TRIATHLON PARATRIATHLON NATIONAL CHAMPIONSHIPS
              </Text>
              <Text style={styles.bandSub}>
                MILWAUKEE, WI{DOT}AUGUST 9, 2026
              </Text>
            </Section>
          </Section>

          {/* Opening letter */}
          <Section style={styles.card}>
            <CardLabel>A NOTE FROM PATRICK</CardLabel>
            <Text style={styles.bodyTextLast}>
              Next Sunday morning, I&rsquo;ll enter the water, the horn will
              sound, and everything I&rsquo;ve sacrificed over the past year
              will be put to the test at the USA Triathlon Paratriathlon
              National Championships.
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

          {/* Countdown — the clock is the point of a pre-race email */}
          <Section style={styles.nextCard}>
            <Text style={styles.nextLabel}>RACE DAY IN</Text>
            <Text style={styles.nextDays}>{countdownLabel()}</Text>
            <Text style={styles.nextName}>
              USA TRIATHLON PARATRIATHLON NATIONAL CHAMPIONSHIPS
            </Text>
            <Text style={styles.nextSub}>
              MILWAUKEE, WI{DOT}AUGUST 9, 2026
            </Text>
          </Section>

          {/* The arena */}
          <Section style={styles.card}>
            <CardLabel>THE ARENA</CardLabel>
            <Text style={styles.pullLine}>This is the arena.</Text>
            <Text style={styles.bodyText}>
              Everything before it has simply been preparation.
            </Text>
            <Text style={styles.bodyText}>
              The mornings when the alarm rang long before the sun. The swims
              when no one was watching. The endless miles on the bike. The runs
              when my body begged me to stop. The strength sessions. The
              travel. The setbacks. The failures. The sacrifice.
            </Text>
            <Text style={styles.bodyText}>
              Every decision has been made with one finish line in mind.
            </Text>
            <Text style={styles.bodyText}>
              When I lost my leg, I wasn&rsquo;t thinking about national
              championships. I was thinking about learning to stand. Learning
              to take a step. Learning to believe there could still be another
              chapter.
            </Text>
            <Text style={styles.bodyText}>
              I never imagined that chapter would lead here.
            </Text>
            <Text style={styles.bodyText}>
              At 40 years old, I have the opportunity to compete for a USA
              Triathlon National Championship.
            </Text>
            <Text style={styles.bodyText}>Maybe this is the first of many.</Text>
            <Text style={styles.bodyText}>
              Maybe it&rsquo;s the only one I&rsquo;ll ever get.
            </Text>
            <Text style={styles.bodyText}>
              That&rsquo;s the thing about opportunities like this.
            </Text>
            <Text style={styles.bodyTextLast}>
              They&rsquo;re never promised.
            </Text>
          </Section>

          {/* No hesitation */}
          <Section style={styles.card}>
            <CardLabel>NO HESITATION</CardLabel>
            <Text style={styles.bodyText}>
              So when the horn sounds, there will be no hesitation.
            </Text>
            <Section style={styles.manifestoBlock}>
              <Text style={styles.manifestoLineSm}>No fear.</Text>
              <Text style={styles.manifestoLineSm}>
                No saving anything for tomorrow.
              </Text>
            </Section>
            <Text style={styles.bodyTextLast}>
              Every ounce of preparation. Every sacrifice. Every lesson learned
              over the past year will be spent on that course.
            </Text>
          </Section>

          {/* Pain don't hurt */}
          <Section style={styles.card}>
            <CardLabel>PAIN DON&rsquo;T HURT</CardLabel>
            <Text style={styles.bodyTextLast}>
              There&rsquo;s a line from Patrick Swayze&rsquo;s character Dalton
              in one of my favorite movies, Road House, that has always stuck
              with me.
            </Text>
          </Section>

          {/* The quote — a title card, not a pull line */}
          <Section style={styles.quoteCard}>
            <Text style={styles.quoteMark}>&ldquo;</Text>
            <Text style={styles.quoteText}>PAIN DON&rsquo;T HURT.</Text>
            <Text style={styles.quoteAttr}>DALTON{DOT}ROAD HOUSE</Text>
          </Section>

          <Section style={styles.card}>
            <Text style={styles.bodyText}>
              On the surface, it&rsquo;s a great one-liner.
            </Text>
            <Text style={styles.bodyText}>
              But the older I get, the more shit I&rsquo;ve been through, the
              more truth I find in it.
            </Text>
            <Text style={styles.bodyText}>
              Pain is inevitable. It&rsquo;s part of pursuing anything
              worthwhile. It&rsquo;s in the early mornings, the endless
              training sessions, the failures, the setbacks, and the
              sacrifices.
            </Text>
            <Text style={styles.bodyText}>
              For an amputee, it also means skin breakdown. Pressure sores.
              Blisters. Ingrown hairs. It means days when your heart is ready
              to train, but your body simply won&rsquo;t let you. It means
              spending as much time earning the right to train as you do
              actually training.
            </Text>
            <Text style={styles.bodyText}>
              Those battles don&rsquo;t show up in the results.
            </Text>
            <Text style={styles.bodyText}>But they shape every result.</Text>
            <Text style={styles.bodyText}>Pain isn&rsquo;t your enemy.</Text>
            <Text style={styles.bodyTextLast}>Quitting is.</Text>
          </Section>

          {/* CAF jersey photo */}
          <Section style={styles.photoCard}>
            <Img
              src={img.cafJersey}
              width="528"
              alt="Patrick Wingert in his Challenged Athletes Foundation jersey after a training ride"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                EARNING THE RIGHT TO TRAIN
              </Text>
            </Section>
          </Section>

          {/* What the race demands */}
          <Section style={styles.card}>
            <CardLabel>WHAT THIS RACE DEMANDS</CardLabel>
            <Text style={styles.bodyText}>That&rsquo;s what this race demands.</Text>
            <Text style={styles.bodyText}>Not perfection.</Text>
            <Text style={styles.pullLine}>Only everything.</Text>
            <Text style={styles.bodyText}>
              If I stand on the podium, it won&rsquo;t be because of one great
              race. It will be because thousands of quiet moments, invisible to
              almost everyone, stacked on top of one another until they became
              something extraordinary.
            </Text>
            <Text style={styles.bodyText}>It will be because I worked.</Text>
            <Text style={styles.bodyTextLast}>
              But no one reaches a podium or a championship alone.
            </Text>
          </Section>

          {/* Keri & Melissa photo */}
          <Section style={styles.photoCard}>
            <Img
              src={img.keriMelissa}
              width="528"
              alt="Patrick Wingert with Keri (left) and Melissa Stockwell (right) in Long Beach"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                KERI{DOT}PATRICK{DOT}MELISSA
              </Text>
            </Section>
          </Section>

          {/* Gratitude */}
          <Section style={styles.card}>
            <CardLabel>THE PEOPLE</CardLabel>
            <Text style={styles.bodyTextLast}>
              This season has been built on the shoulders of my incredible
              wife, my family and friends, my coaches and mentors, my teammates
              at Dare2Tri, my friends in the cycling club and every person who
              has believed in this journey. I&rsquo;m equally grateful to the
              organizations that have invested in me and this mission,
              including Tom and the Performance Wealth Partners team, the
              Challenged Athletes Foundation, the crew at the Adaptive Training
              Foundation, Dare2Tri, and David Rotter Prosthetics. Thank you for
              believing in what we&rsquo;re building together.
            </Text>
          </Section>

          {/* Sponsors */}
          <SponsorsCard />

          {/* The ask */}
          <Section style={styles.card}>
            <CardLabel>NOW IT&rsquo;S TIME I ASK SOMETHING OF YOU</CardLabel>
            <Text style={styles.bodyText}>
              Your belief has carried me farther than you know.
            </Text>
            <Text style={styles.bodyText}>
              Now it&rsquo;s time I ask something of you.
            </Text>
            <Text style={styles.bodyText}>
              If you&rsquo;re in Chicago or anywhere in the Midwest, Milwaukee
              is only a short drive.
            </Text>
            <Text style={styles.bodyText}>Make the trip.</Text>
            <Text style={styles.bodyText}>Bring your family or friends.</Text>
            <Text style={styles.bodyText}>Ring a cowbell.</Text>
            <Text style={styles.bodyText}>Lose your voice.</Text>
            <Text style={styles.bodyText}>
              Help carry every adaptive athlete across that finish line.
            </Text>
            <Text style={styles.bodyTextLast}>
              I promise you&rsquo;ll leave inspired.
            </Text>
          </Section>

          {/* Be there another way */}
          <Section style={styles.card}>
            <CardLabel>BE THERE ANOTHER WAY</CardLabel>
            <Text style={styles.bodyText}>
              If you can&rsquo;t be there in person, then be there another way.
            </Text>
            <Text style={styles.bodyText}>
              Follow along on{" "}
              <Link href={INSTAGRAM_URL} style={styles.inlineLink}>
                Instagram
              </Link>
              .
            </Text>
            <Text style={styles.bodyText}>Like, comment, and share.</Text>
            <Text style={styles.bodyText}>
              Subscribe on{" "}
              <Link href={YOUTUBE_URL} style={styles.inlineLink}>
                YouTube
              </Link>
              .
            </Text>
            <Text style={styles.bodyTextLast}>
              Every interaction helps this story reach someone who needs to
              hear it.
            </Text>
          </Section>

          {/* Dark close — donation */}
          <Section style={styles.missionCard}>
            <Text style={styles.missionText}>
              If this journey has inspired you, open your wallet and make a
              donation to my Dare2Tri fundraiser. Every dollar helps create
              opportunities for adaptive athletes who are chasing dreams that
              once felt impossible.
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

          {/* Don't let this be the end */}
          <Section style={styles.card}>
            <CardLabel>THE STORY CONTINUES</CardLabel>
            <Text style={styles.bodyText}>
              And don&rsquo;t let this be the end of the story.
            </Text>
            <Text style={styles.bodyText}>
              Visit{" "}
              <Link href={SITE} style={styles.inlineLink}>
                patrickwingert.com
              </Link>{" "}
              to follow the journey, explore the rest of this year&rsquo;s race
              calendar, and see what&rsquo;s next. This may be the race
              we&rsquo;ve built toward all season, but it isn&rsquo;t the final
              summit. There are more finish lines ahead, bigger goals to chase,
              and more opportunities to prove what&rsquo;s possible.
            </Text>
            <Text style={styles.bodyText}>So choose one.</Text>
            <Section style={styles.manifestoBlock}>
              <Text style={styles.manifestoLine}>Drive up.</Text>
              <Text style={styles.manifestoLine}>Follow.</Text>
              <Text style={styles.manifestoLine}>Share.</Text>
              <Text style={styles.manifestoLine}>Donate.</Text>
              <Text style={styles.manifestoLine}>Show up.</Text>
              <Text style={styles.manifestoLineAccent}>Do something.</Text>
            </Section>
            <Text style={styles.bodyText}>
              Don&rsquo;t just witness this story.
            </Text>
            <Text style={styles.pullLine}>Help me write it.</Text>
          </Section>

          {/* Signoff */}
          <Section style={styles.card}>
            <Text style={styles.bodyText}>
              Whatever happens next weekend, I won&rsquo;t measure success by
              whether I bring home a medal.
            </Text>
            <Text style={styles.bodyText}>
              I&rsquo;ll measure it by whether I had the courage to leave
              absolutely everything on that course.
            </Text>
            <Section style={styles.manifestoBlock}>
              <Text style={styles.manifestoLineSm}>No regrets.</Text>
              <Text style={styles.manifestoLineSm}>No excuses.</Text>
            </Section>
            <Text style={styles.bodyText}>
              Only gratitude for the opportunity to compete.
            </Text>
            <Text style={styles.pullLine}>
              Life is HARD
              <br />
              BE HARDER
            </Text>
            <Section style={styles.signatureBlock}>
              <Text style={styles.signature}>Patrick Wingert</Text>
              <Text style={styles.signatureRole}>
                ADAPTIVE ATHLETE{DOT}DARE2TRI ELITE TEAM 2026
              </Text>
            </Section>
          </Section>

          {/* Closing photo */}
          <Section style={styles.photoCard}>
            <Img
              src={img.closing}
              width="528"
              alt="Patrick Wingert on the run course at Long Beach"
              style={styles.photo}
            />
            <Section style={styles.captionBar}>
              <Text style={styles.captionText}>
                SEE YOU IN MILWAUKEE{DOT}AUGUST 9
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
  // The setup line: smaller and ink so the orange payoff line below carries
  // the poster, matching the short-setup / long-payoff beat of the copy.
  headlineKicker: {
    fontFamily: bebas,
    fontSize: "28px",
    lineHeight: "1",
    color: c.ink,
    margin: "0 0 4px",
    letterSpacing: "3px",
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
  /* Manifesto stacks — Patrick's staccato lines set as display type */
  manifestoBlock: {
    margin: "26px 0",
  },
  manifestoLine: {
    fontFamily: bebas,
    fontSize: "34px",
    lineHeight: "1.15",
    letterSpacing: "2px",
    color: c.ink,
    margin: 0,
  },
  manifestoLineAccent: {
    fontFamily: bebas,
    fontSize: "34px",
    lineHeight: "1.15",
    letterSpacing: "2px",
    color: c.orange,
    margin: 0,
  },
  manifestoLineSm: {
    fontFamily: bebas,
    fontSize: "26px",
    lineHeight: "1.2",
    letterSpacing: "2px",
    color: c.ink,
    margin: 0,
  },

  /* Dark quote title card */
  quoteCard: {
    ...cardBase,
    backgroundColor: c.ink,
    border: "none",
    padding: "44px 38px 40px",
    textAlign: "center" as const,
  },
  quoteMark: {
    fontFamily: bebas,
    fontSize: "40px",
    lineHeight: "0.5",
    color: c.orange,
    margin: "0 0 2px",
    textAlign: "center" as const,
  },
  quoteText: {
    fontFamily: bebas,
    fontSize: "52px",
    lineHeight: "1",
    letterSpacing: "3px",
    color: "#ffffff",
    margin: "0 0 16px",
    textAlign: "center" as const,
  },
  quoteAttr: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.orange,
    margin: 0,
    textAlign: "center" as const,
  },

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

  /* Countdown */
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
