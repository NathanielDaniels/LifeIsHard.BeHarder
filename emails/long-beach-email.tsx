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

interface LongBeachEmailProps {
  email?: string;
}

const SUBJECT = "The Course Hasn't Changed. I Have.";
const PREVIEW =
  "Last year I came to Long Beach hoping I belonged. Next weekend, I return to find out how far I've come.";

// Fundraiser + race links, all pulled directly from Patrick's draft.
const SUPERTRI_URL = "https://supertri.com/long-beach/paratriathlon/";
const CAF_NORCAL_URL =
  "https://give.challengedathletes.org/participants/8598/donate";
const DARE2TRI_URL = "https://give.dare2tri.org/fundraiser/6928347";

// Image slots. Files live in public/email/long-beach/.
// Until they exist, preview-long-beach.ts renders a labeled placeholder.
const IMG = {
  hero: `${SITE}/email/long-beach/long-beach-hero.jpg`,
  cafBadge: `${SITE}/email/long-beach/caf-cycling-badge.png`,
  group: `${SITE}/email/long-beach/dare2tri-group.jpg`,
  fundingForward: `${SITE}/email/long-beach/funding-forward-motion.png`,
  closing: `${SITE}/email/long-beach/dare2tri-closing.jpg`,
};

export const longBeachSubject = SUBJECT;

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionHeader}>{children}</Text>;
}

export default function LongBeachEmail({ email }: LongBeachEmailProps) {
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

          <Masthead tag="RACE WEEK DISPATCH" sub="JULY 2026" />

          {/* Poster card: hero shot + headline + italic quote + date band */}
          <Section style={styles.posterCard}>
            <Img
              src={IMG.hero}
              width="560"
              alt="Patrick on the beach in Long Beach, California"
              style={styles.heroPhoto}
            />
            <Section style={styles.posterTop}>
              <Text style={styles.ecgLine}>{"——————/\\__/\\——————"}</Text>
              <Text style={styles.headline}>THE COURSE HASN'T CHANGED.</Text>
              <Text style={styles.headlineAccent}>I HAVE.</Text>
              <Text style={styles.posterQuote}>
                Last year I came to Long Beach hoping I belonged. Next weekend, I
                return to find out how far I've come.
              </Text>
            </Section>
            <Section style={styles.posterBand}>
              <Text style={styles.bandDate}>NEXT SATURDAY — SUPERTRI LONG BEACH</Text>
              <Text style={styles.bandPlace}>
                LONG BEACH, CALIFORNIA&nbsp;&nbsp;·&nbsp;&nbsp;PARATRIATHLON
              </Text>
            </Section>
          </Section>

          {/* Letter card */}
          <Section style={styles.card}>
            <CardLabel>A NOTE FROM PATRICK</CardLabel>

            <Text style={styles.bodyText}>Hey team,</Text>
            <Text style={styles.bodyText}>
              In one week, I'll be standing on the beach in Long Beach,
              California at SuperTri Long Beach.
            </Text>

            <CtaButton href={SUPERTRI_URL}>
              SUPERTRI LONG BEACH · PARATRIATHLON&nbsp;&nbsp;→
            </CtaButton>

            <Text style={styles.bodyTextTop}>
              Last year, I sat on this same shoreline wondering if I belonged.
            </Text>
            <Text style={styles.bodyText}>
              I was still brand new to paratriathlon. Learning. Nervous. Trying
              to absorb everything I could. Sitting next to a Paralympian on the
              sand wet and cold. I wasn't thinking about national rankings or
              championship races.
            </Text>
            <Text style={styles.bodyText}>
              I was simply trying to prove to myself that after losing my leg,
              there was still another chapter waiting to be written.
            </Text>
            <Text style={styles.bodyText}>Fast forward one year.</Text>
            <Text style={styles.bodyText}>
              I'm heading back to Long Beach as the #2 ranked PTS4
              paratriathlete in the country.
            </Text>
            <Text style={styles.bodyText}>
              This race is my final tune-up before the USA Paratriathlon
              National Championships in Milwaukee and another opportunity to
              earn the ranking points needed to stay there.
            </Text>

            <Text style={styles.pullLine}>The course hasn't changed. I have.</Text>

            <Text style={styles.bodyText}>
              And honestly, that's what I'm most excited to measure.
            </Text>
            <Text style={styles.bodyText}>Not against the competition.</Text>
            <Text style={styles.bodyTextLast}>
              Against the athlete I was 365 days ago.
            </Text>
          </Section>

          {/* The Work Nobody Sees */}
          <Section style={styles.card}>
            <SectionHeader>THE WORK NOBODY SEES</SectionHeader>
            <Section style={styles.badgeWrap}>
              <Img
                src={IMG.cafBadge}
                width="220"
                alt="CAF NorCal Cycling Club"
                style={styles.badgeImg}
              />
            </Section>
            <Text style={styles.bodyText}>
              Last Saturday I joined the CAF NorCal Cycling Club for a 55-mile
              ride through Marin County with more than 3,000 feet of climbing.
            </Text>

            <CtaButton href={CAF_NORCAL_URL}>
              RIDE WITH CAF NORCAL&nbsp;&nbsp;→
            </CtaButton>

            <Text style={styles.bodyTextTop}>
              Somewhere around mile 50, legs screaming and lungs reminding me
              they still had opinions, I caught myself smiling.
            </Text>
            <Text style={styles.bodyText}>Not because it was easy..</Text>
            <Text style={styles.bodyText}>
              Because a year ago, rides like that would've intimidated me.
            </Text>
            <Text style={styles.bodyText}>Now they're just another Saturday.</Text>
            <Text style={styles.bodyText}>Progress is funny like that.</Text>
            <Text style={styles.bodyText}>
              It rarely arrives with fireworks, although this ride was on the
              4th of July.
            </Text>
            <Text style={styles.bodyText}>
              It quietly shows up one workout at a time until one day you look
              back and realize what used to feel impossible has become your new
              normal.
            </Text>
            <Text style={styles.bodyText}>That's what this season has taught me.</Text>
            <Text style={styles.bodyText}>No shortcuts.</Text>
            <Text style={styles.bodyText}>No hacks.</Text>
            <Text style={styles.bodyTextLast}>
              Just showing up and stacking another brick.
            </Text>
          </Section>

          {/* Dare2Tri Train2Race group photo — linked to the fundraiser */}
          <Section style={styles.bannerCard}>
            <Link href={DARE2TRI_URL}>
              <Img
                src={IMG.group}
                width="560"
                alt="Dare2Tri athletes together at the swim finish"
                style={styles.bannerPhoto}
              />
            </Link>
          </Section>

          {/* Iron Sharpens Iron */}
          <Section style={styles.card}>
            <SectionHeader>IRON SHARPENS IRON</SectionHeader>
            <Text style={styles.bodyText}>
              Before race day, I'll spend a few days at the Dare2Tri Train2Race
              Camp alongside some of the best adaptive athletes in the country.
              People I call friends, teammates, competition and mentors.
            </Text>
            <Text style={styles.bodyText}>Nobody cares about excuses.</Text>
            <Text style={styles.bodyText}>Everybody shows up ready to work.</Text>
            <Text style={styles.bodyText}>You leave tired.</Text>
            <Text style={styles.bodyText}>You leave humbled.</Text>
            <Text style={styles.bodyText}>You leave grateful.</Text>
            <Text style={styles.bodyText}>And if you've done it right…</Text>
            <Text style={styles.bodyTextLast}>You leave better than you arrived.</Text>
          </Section>

          {/* Gratitude Is Earned */}
          <Section style={styles.card}>
            <SectionHeader>GRATITUDE IS EARNED</SectionHeader>
            <Text style={styles.bodyText}>
              My friend Lotte has unknowingly challenged me this season to think
              differently about grit &amp; gratitude.
            </Text>
            <Text style={styles.bodyText}>Not as something you say.</Text>
            <Text style={styles.bodyText}>As something you live.</Text>

            <Text style={styles.quoteLine}>
              Grit isn't about being fearless. It's about showing up long after
              the excitement has worn off.
            </Text>
            <Text style={styles.quoteLine}>
              Real gratitude isn't measured by what you say. It's measured by how
              you honor the opportunities you've been given.
            </Text>

            <Text style={styles.bodyText}>
              It's trusting the process when your results haven't caught up yet.
            </Text>
            <Text style={styles.bodyText}>
              It's recognizing that none of us gets where we're going alone.
            </Text>
            <Text style={styles.bodyText}>
              I wouldn't be here without an incredible team behind me.
            </Text>
            <Text style={styles.bodyText}>
              Thank you to the entire team at Performance Wealth Partners, the
              crew at the Adaptive Training Foundation, the Challenged Athletes
              Foundation, the Jedi Master responsible for my legs at David Rotter
              Prosthetics, literally everyone at Dare2Tri, and every one of you
              who's donated, shared a post, left a comment, sent an encouraging
              text, or simply followed this journey.
            </Text>
            <Text style={styles.bodyTextLast}>
              I carry every bit of that support with me on race day.
            </Text>
          </Section>

          {/* If You Want to Be Part of This Race */}
          <Section style={styles.card}>
            <SectionHeader>IF YOU WANT TO BE PART OF THIS RACE…</SectionHeader>
            <Text style={styles.bodyText}>
              Most of you won't be standing on the beach in Long Beach next
              Saturday.
            </Text>
            <Text style={styles.bodyText}>I wish you could.</Text>
            <Text style={styles.bodyText}>
              But there is a way to be on this journey with me.
            </Text>
            <Text style={styles.bodyText}>
              Everything I've accomplished over the last six years has been
              possible because organizations like Dare2Tri believe adaptive
              athletes deserve the same opportunities as everyone else.
            </Text>

            <Text style={styles.listStack}>
              Community
              <br />
              Coaching.
              <br />
              Equipment.
              <br />
              Training camps.
              <br />
              Mentorship.
            </Text>

            <Text style={styles.bodyText}>
              A community that refuses to let disability define potential.
            </Text>
            <Text style={styles.bodyText}>
              The Train2Race Camp I'll attend this week exists because people
              choose to invest in athletes they may never meet.
            </Text>
            <Text style={styles.bodyText}>
              I know the impact because I've lived it.
            </Text>
            <Text style={styles.bodyText}>That's why I'm asking for your support.</Text>
            <Text style={styles.bodyText}>
              If my journey has inspired you, I hope you'll consider making a
              donation to my Dare2Tri Elite Team fundraiser. Every dollar helps
              create opportunities for the next athlete who's standing where I
              stood a year ago, wondering if they belong. Where I lay six years
              ago, in a hospital bed wondering what happens now..
            </Text>
            <Text style={styles.bodyText}>
              Maybe your gift helps buy adaptive equipment.
            </Text>
            <Text style={styles.bodyText}>
              Maybe it helps fund a training camp.
            </Text>
            <Text style={styles.bodyText}>
              Maybe it gives someone the confidence to sign up for their very
              first race.
            </Text>
            <Text style={styles.bodyText}>
              Whatever the outcome, you're helping someone discover what's
              possible.
            </Text>
            <Text style={styles.bodyTextLast}>
              If you'd like to cheer me on from home while I'm racing in Long
              Beach, this is the most meaningful way to do it.
            </Text>
          </Section>

          {/* Funding Forward Motion block (from Patrick's draft) */}
          <Section style={styles.card}>
            <Link href={DARE2TRI_URL}>
              <Img
                src={IMG.fundingForward}
                width="440"
                alt="Dare2Tri Funding Forward Motion campaign"
                style={styles.campaignBanner}
              />
            </Link>
            <Text style={styles.campaignHeader}>
              Why We're Moving—And What It Means
            </Text>
            <Text style={styles.campaignText}>
              July marks both Disability Pride Month and the anniversary of the
              Americans with Disabilities Act (ADA), a landmark moment in the
              fight for disability rights and access. In honor of this month,
              we've launched <em>Funding Forward Motion</em>, a campaign to
              celebrate progress, expand access, and remove financial barriers
              for athletes of all levels.
            </Text>
            <CtaButton href={DARE2TRI_URL}>
              SUPPORT MY DARE2TRI FUNDRAISER&nbsp;&nbsp;→
            </CtaButton>
            <Text style={styles.bodyTextTop}>
              And if you're not in a position to donate, sharing the fundraiser
              is every bit as valuable.
            </Text>
            <Text style={styles.bodyTextLast}>
              You never know whose life it might change.
            </Text>
          </Section>

          {/* Next Stop: Long Beach — dark mission card */}
          <Section style={styles.missionCard}>
            <Text style={styles.missionLabel}>NEXT STOP: LONG BEACH</Text>
            <Text style={styles.missionText}>
              Next Saturday I'll be on the same start line I began this journey
              on a year ago.
            </Text>
            <Text style={styles.missionText}>
              Only this time, I'm carrying a year's worth of lessons, thousands
              of training miles, and an army of people who helped make this
              journey possible. I also now own a wetsuit. Lessons have been
              learned.
            </Text>
            <Text style={styles.missionText}>I'm racing for points.</Text>
            <Text style={styles.missionText}>I'm racing for momentum.</Text>
            <Text style={styles.missionText}>
              I'm racing to carry confidence into Nationals.
            </Text>
            <Text style={styles.missionText}>But more than anything…</Text>
            <Text style={styles.missionText}>I'm racing to honor the work.</Text>
            <Text style={styles.missionText}>Thank you for believing in me.</Text>
            <Text style={styles.missionTextLast}>
              I'll see you on the other side of the finish line.
            </Text>
            <Text style={styles.missionMottoWhite}>LIFE IS HARD.</Text>
            <Text style={styles.missionMottoOrange}>BE HARDER.</Text>
          </Section>

          {/* Closing banner */}
          <Section style={styles.bannerCard}>
            <Img
              src={IMG.closing}
              width="560"
              alt="Patrick Wingert — Dare2Tri Elite Team 2026"
              style={styles.bannerPhoto}
            />
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
  heroPhoto: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },
  posterTop: {
    padding: "30px 34px 26px",
    textAlign: "center" as const,
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
    fontSize: "46px",
    lineHeight: "0.94",
    color: c.ink,
    margin: 0,
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  headlineAccent: {
    fontFamily: bebas,
    fontSize: "46px",
    lineHeight: "0.94",
    color: c.orange,
    margin: "2px 0 0",
    letterSpacing: "2px",
    textAlign: "center" as const,
  },
  posterQuote: {
    fontFamily: system,
    fontStyle: "italic",
    fontSize: "15px",
    lineHeight: "1.6",
    color: c.body,
    margin: "20px auto 0",
    maxWidth: "420px",
    textAlign: "center" as const,
  },
  posterBand: {
    backgroundColor: c.orange,
    padding: "18px 34px 20px",
    textAlign: "center" as const,
  },
  bandDate: {
    fontFamily: bebas,
    fontSize: "26px",
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

  /* Cards + body copy */
  card: cardBase,
  bodyText: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.75",
    color: c.body,
    margin: "0 0 14px",
  },
  bodyTextTop: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.75",
    color: c.body,
    margin: "24px 0 14px",
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
    fontSize: "30px",
    lineHeight: "1.05",
    letterSpacing: "1.5px",
    color: c.ink,
    borderLeft: `3px solid ${c.orange}`,
    paddingLeft: "16px",
    margin: "24px 0",
  },
  quoteLine: {
    fontFamily: system,
    fontStyle: "italic",
    fontSize: "16px",
    lineHeight: "1.65",
    color: c.ink,
    backgroundColor: "#faf9f6",
    borderLeft: `3px solid ${c.orange}`,
    padding: "14px 18px",
    margin: "0 0 14px",
  },
  listStack: {
    fontFamily: bebas,
    fontSize: "22px",
    lineHeight: "1.35",
    letterSpacing: "1.5px",
    color: c.ink,
    margin: "20px 0",
  },

  /* Section headers */
  sectionHeader: {
    fontFamily: bebas,
    fontSize: "30px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: c.ink,
    margin: "0 0 20px",
    paddingBottom: "16px",
    borderBottom: `1px solid ${c.borderSoft}`,
  },

  /* CAF cycling club badge — centered, constrained */
  badgeWrap: {
    margin: "0 0 22px",
    textAlign: "center" as const,
  },
  badgeImg: {
    display: "inline-block",
    width: "220px",
    maxWidth: "60%",
    height: "auto",
    border: "none",
  },

  /* Full-bleed banner cards */
  bannerCard: {
    ...cardBase,
    padding: 0,
    overflow: "hidden",
  },
  bannerPhoto: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },

  /* Funding Forward Motion campaign block */
  campaignBanner: {
    display: "block",
    width: "100%",
    maxWidth: "440px",
    height: "auto",
    // Match the card's 30px top padding so the image has equal space above
    // and below before the "Why We're Moving" heading.
    margin: "0 auto 30px",
    border: "none",
    // The PNG ships with a baked-in white plate so the black artwork stays
    // legible in forced dark mode; round its corners to read as a panel.
    borderRadius: "10px",
  },
  campaignHeader: {
    fontFamily: bebas,
    fontSize: "26px",
    lineHeight: "1.05",
    letterSpacing: "1.5px",
    color: c.ink,
    margin: "0 0 16px",
    textAlign: "center" as const,
  },
  campaignText: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.7",
    color: c.body,
    margin: "0 0 22px",
    textAlign: "center" as const,
  },

  /* Mission card */
  missionCard: {
    ...cardBase,
    backgroundColor: c.ink,
    border: "none",
    padding: "34px 38px 36px",
    textAlign: "center" as const,
  },
  missionLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "4px",
    color: c.orange,
    margin: "0 0 18px",
  },
  missionText: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.7",
    color: c.inkMutedText,
    margin: "0 0 12px",
  },
  missionTextLast: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.7",
    color: c.inkMutedText,
    margin: "0 0 24px",
  },
  missionMottoWhite: {
    fontFamily: bebas,
    fontSize: "40px",
    lineHeight: "0.95",
    letterSpacing: "2px",
    color: "#ffffff",
    margin: 0,
  },
  missionMottoOrange: {
    fontFamily: bebas,
    fontSize: "40px",
    lineHeight: "0.95",
    letterSpacing: "2px",
    color: c.orange,
    margin: "2px 0 0",
  },
};
