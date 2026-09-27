import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { BrandFooter, HeaderBanner, SITE } from "./components/brand";

/**
 * TOKYO — "ONE LEG. TWO STARS."
 *
 * The GoFundMe launch email for the Tokyo Marathon, March 7, 2027.
 *
 * All body copy is Patrick's GoFundMe story, verbatim (PRODUCT.md: his copy
 * ships as written). Headlines are lifted from his own phrases on that page:
 * "One Leg. Two Stars.", "Tokyo is up next.", and "THE RECEIPTS", his label
 * for the budget.
 *
 * Design system, one device per job:
 *   - The website hero as a still: Patrick running out of the Hinomaru (the
 *     real red disc of Japan's flag, not an invented symbol), the heartbeat
 *     line as the horizon.
 *   - The Six Star tracker: all six original Majors in race-calendar order,
 *     Chicago earned, Tokyo next. The story's spine in one row.
 *   - The receipts as a boarding pass: the ask presented as a ticket to the
 *     start line, every dollar itemised.
 *   - One climax: the dark donate block.
 */

const SUBJECT = "One Leg. Two Stars. Tokyo Is Up Next.";
const PREVIEW =
  "I'm raising $5,500 to help cover the travel and race expenses for my second Abbott World Marathon Major.";

const GOFUNDME_URL = "https://www.gofundme.com/f/Patwingit2Tokyo";
const DONATE_URL = `${GOFUNDME_URL}/donate`;
// Patrick's personal Dare2Tri fundraiser (his choice, confirmed 2026-09-27).
const DARE2TRI_URL = "https://give.dare2tri.org/fundraiser/6928347";
const CAMPAIGN_PAGE_URL = `${SITE}/tokyo`;

const RACE_DAY = new Date(2027, 2, 7); // March 7, 2027, local time

const c = {
  ink: "#16130e", // matches brand.tsx colors.ink, no seam at the footer
  canvas: "#f1f1ee",
  white: "#ffffff",
  orange: "#f97316",
  orangeDeep: "#c2410c",
  hinomaru: "#bc002d",
  body: "#262119",
  muted: "#5f594f",
  onDark: "#ddd7cb",
  onDarkMuted: "#8f887b",
  ruleDark: "#2e2820",
  rule: "#d8d6cd",
};

// Gmail strips web fonts, so the fallbacks must be condensed too or the wide
// default (Roboto/Arial) overflows fixed cells: "TOKYO" off the pass, city
// names breaking mid-word. sans-serif-condensed is Roboto Condensed on Android.
const bebas =
  '"Bebas Neue", "Arial Narrow", "Roboto Condensed", sans-serif-condensed, "HelveticaNeue-CondensedBold", "AvenirNextCondensed-DemiBold", Impact, Arial, sans-serif';
const mono =
  'ui-monospace, "SF Mono", Menlo, Consolas, "Courier New", monospace';
const system =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

/* The six original Abbott World Marathon Majors, in race-calendar order.
   Sydney and Cape Town are excluded on purpose: the Six Star Medal Patrick
   names on his page covers only these six. */
const majors: { city: string; state: "earned" | "next" | "open"; note?: string }[] = [
  { city: "TOKYO", state: "next", note: "NEXT" },
  { city: "BOSTON", state: "open" },
  { city: "LONDON", state: "open" },
  { city: "BERLIN", state: "open" },
  { city: "CHICAGO", state: "earned", note: "4:17:17" },
  { city: "NYC", state: "open" },
];

/* Patrick's budget, verbatim labels. Confirmed against the live GoFundMe on
   2026-09-27: Insurance is $150 and the lines total the $5,500 goal. */
const receipts = [
  { label: "Airfare", amount: 1500 },
  { label: "Lodging", amount: 1200 },
  { label: "Transportation", amount: 400 },
  { label: "Food/Nutrition", amount: 500 },
  { label: "Equipment and baggage", amount: 500 },
  { label: "Insurance", amount: 150 },
  { label: "Race-week expenses", amount: 250 },
  { label: "Contingency for unexpected costs", amount: 1000 },
];
const GOAL = 5500;

/** Star colour by state: earned solid orange, next outlined orange, open muted. */
const STAR_COLOUR: Record<"earned" | "next" | "open", string> = {
  earned: c.orange,
  next: c.orange,
  open: "#5c5549",
};

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** Whole days from the render (= send) date to race day. */
function daysToRace(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((RACE_DAY.getTime() - today.getTime()) / 86_400_000));
}

export const tokyoFundraiserSubject = SUBJECT;

export default function TokyoFundraiserEmail({ email }: { email?: string }) {
  const total = receipts.reduce((sum, r) => sum + r.amount, 0);
  if (total !== GOAL) {
    // Never let a budget that doesn't add up reach a subscriber.
    throw new Error(`Receipts total ${usd(total)} but the goal is ${usd(GOAL)}`);
  }
  const days = daysToRace();

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <meta
          name="format-detection"
          content="telephone=no,date=no,address=no,email=no,url=no"
        />
        <style>{`
          :root { color-scheme: light; }
          @font-face {
            font-family: Bebas Neue;
            font-style: normal;
            font-weight: 400;
            mso-font-alt: Arial;
            src: url(${SITE}/fonts/BebasNeue-Regular.woff2) format(woff2);
          }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
          .detect-off a {
            color: inherit !important;
            text-decoration: none !important;
            font-family: inherit !important;
            font-size: inherit !important;
          }
          @media only screen and (max-width: 480px) {
            .sec { padding-left: 22px !important; padding-right: 22px !important; }
            .fs-hero { font-size: 60px !important; }
            .fs-days { font-size: 64px !important; }
            .fs-city { font-size: 12px !important; letter-spacing: 0 !important; }
            .fs-route { font-size: 26px !important; letter-spacing: 0 !important; }
            .fs-total { font-size: 40px !important; }
            .fs-amounts { font-size: 34px !important; letter-spacing: 1px !important; }
          }
          @media (prefers-color-scheme: dark) {
            .bg-canvas { background-color: #f1f1ee !important; }
            .bg-ink { background-color: #16130e !important; }
            .bg-white { background-color: #ffffff !important; }
            .t-ink { color: #16130e !important; }
            .t-body { color: #262119 !important; }
          }
          [data-ogsc] .bg-canvas, [data-ogsb] .bg-canvas { background-color: #f1f1ee !important; }
          [data-ogsc] .bg-ink,    [data-ogsb] .bg-ink    { background-color: #16130e !important; }
          [data-ogsc] .bg-white,  [data-ogsb] .bg-white  { background-color: #ffffff !important; }
          [data-ogsc] .t-ink,     [data-ogsb] .t-ink     { color: #16130e !important; }
          [data-ogsc] .t-body,    [data-ogsb] .t-body    { color: #262119 !important; }
        `}</style>
      </Head>

      <Preview>{PREVIEW}</Preview>

      <Body className="bg-canvas" style={s.bodyEl}>
        <Container className="bg-canvas" style={s.wrapper}>
          <HeaderBanner />

          {/* ══ HERO + SUNRISE + SIX STAR TRACKER ══
                One outer ink section: separate sibling sections leave
                sub-pixel gaps where the light canvas shows through as lines. */}
          <Section className="bg-ink" style={s.heroOuter}>
          <Section className="sec" style={s.hero}>
            <Text className="detect-off" style={s.heroKicker}>
              TOKYO MARATHON&nbsp;&nbsp;·&nbsp;&nbsp;MARCH 7, 2027
            </Text>
            <Text className="fs-hero" style={s.heroLine1}>ONE LEG.</Text>
            <Text className="fs-hero" style={s.heroLine2}>TWO STARS.</Text>
            <Text style={s.heroSub}>Tokyo World Major Marathon is next.</Text>
          </Section>
          <Img
            src={`${SITE}/email/tokyo/sunrise-runner.jpg`}
            width="620"
            height="320"
            alt="Running out of a rising red sun, a heartbeat line across the horizon"
            style={s.photo}
          />
          <Section className="sec" style={s.tracker}>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{ tableLayout: "fixed" }}
            >
              <tbody>
                <tr>
                  {majors.map((m) => (
                    <td key={m.city} width="16.66%" style={s.starCell}>
                      {/* Text, not images: forced dark mode (Samsung Email, Gmail) turned the
                          near-black star PNGs into white squares. Text recolours cleanly. */}
                      <Text
                        role="img"
                        aria-label={
                          m.state === "earned" ? `${m.city}: star earned` : m.state === "next" ? `${m.city}: next` : m.city
                        }
                        style={{ ...s.star, color: STAR_COLOUR[m.state] }}
                      >
                        {m.state === "earned" ? "\u2605\uFE0E" : "\u2606\uFE0E"}
                      </Text>
                      <Text
                        className="fs-city"
                        style={m.state === "open" ? s.cityOpen : s.cityLit}
                      >
                        {m.city}
                      </Text>
                      <Text className="detect-off" style={s.cityNote}>
                        {m.note ?? " "}
                      </Text>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <Section style={s.trackerRule} />
            <Text className="detect-off" style={s.days}>
              <span className="fs-days" style={s.daysNum}>{days}</span>
              <br />
              <span style={s.daysLabel}>DAYS TO THE START LINE</span>
            </Text>
            <Text style={s.hashtag}>#PatWingIt2Tokyo</Text>
          </Section>
          </Section>

          {/* ══ STORY ══ */}
          <Section className="sec bg-canvas" style={s.story}>
            <Text className="t-body" style={s.lede}>
              In November 2020, I lost my right leg below the knee after being
              hit by a car. At 35, I had to learn to walk again.
            </Text>
            <Img
              src={`${SITE}/email/tokyo/floor-crutches.jpg`}
              width="536"
              alt="My crutches, my prosthetic liner and the Chicago medal on the floor at home"
              style={s.inset}
            />
            <Text className="t-body" style={s.bodyText}>
              Two years later, I flew to Bhutan and hiked 250 miles across the
              Trans Bhutan Trail and twelve mountain passes. I became the first
              American and the first below-knee amputee to complete the trail.
            </Text>
            <Text className="t-body" style={s.bodyText}>
              Three years after that, I finished the Chicago Marathon in 4
              hours, 17 minutes and 17 seconds. It wasn&rsquo;t a perfect race.
            </Text>
            <Text className="t-body" style={s.bodyText}>
              Now I&rsquo;m working toward the Tokyo Marathon on March 7, 2027,
              and I&rsquo;m asking for your help getting to the starting line.
            </Text>
            <Text style={s.standout}>
              I&rsquo;m raising $5,500 to help cover the travel and race
              expenses for my second Abbott World Marathon Major.
            </Text>
          </Section>

          {/* ══ CHICAGO — photo + the one hard number ══ */}
          {/* The race in three beats: the stop, the finish, the aftermath.
              Patrick's paragraph is split across the photos, words unchanged. */}
          <Section className="bg-ink" style={s.heroOuter}>
          <Img
            src={`${SITE}/email/tokyo/road-stop.jpg`}
            width="620"
            alt="Sitting on the road mid-race in Chicago, fixing my prosthetic"
            style={s.photo}
          />
          <Section className="sec" style={s.chicagoTop}>
            <Text style={s.chicagoLabel}>CHICAGO MARATHON&nbsp;&nbsp;·&nbsp;&nbsp;2025</Text>
            <Text style={s.chicagoBody}>
              Chicago wasn&rsquo;t a smooth race. I had to stop several times to
              deal with my prosthetic. Those stops cost me time, but each time I
              got moving again.
            </Text>
          </Section>
          <Img
            src={`${SITE}/email/chicago/chi-finish-cine.jpg`}
            width="620"
            alt="Arms up at the finish line of the 2025 Chicago Marathon"
            style={s.photo}
          />
          <Section className="sec" style={s.chicago}>
            <Text className="detect-off" style={s.chicagoTime}>4:17:17</Text>
            <Text style={s.chicagoBodyCenter}>
              Crossing that finish line earned me my first star toward the Six
              Star Medal.
            </Text>
            {/* 2-up. Real width attributes: Gmail iOS strips CSS widths off
                <td> in forced dark mode and the columns collapse. */}
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{ tableLayout: "fixed", margin: "0 0 34px" }}
            >
              <tbody>
                <tr>
                  <td width="50%" style={s.pairCellL}>
                    <Img
                      src={`${SITE}/email/tokyo/after-wheelchair.jpg`}
                      width="280"
                      alt="After the finish, in a wheelchair with the medal between my teeth and my running blade across my lap"
                      style={s.pairImg}
                    />
                  </td>
                  <td width="50%" style={s.pairCellR}>
                    <Img
                      src={`${SITE}/email/tokyo/after-medal.jpg`}
                      width="280"
                      alt="Holding up my 2025 Chicago Marathon medal"
                      style={s.pairImg}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <Text style={s.chicagoPunch}>TOKYO IS UP NEXT.</Text>
          </Section>
          </Section>

          {/* ══ THE WORK ══ */}
          <Section className="sec bg-canvas" style={s.story}>
            <Text className="t-body" style={s.bodyText}>
              Since my amputation, I&rsquo;ve raced paratriathlons across the
              country, reached state championship podiums, and competed at
              nationals. Through Dare2tri, I&rsquo;ve learned from teammates,
              coaches, and mentors who keep challenging me to see what I can do
              next.
            </Text>
            <Text className="t-body" style={s.bodyTextLast}>
              I&rsquo;ve put in the work to get this far, with people beside me
              along the way. Getting to Japan is another step where support can
              make a real difference.
            </Text>
          </Section>

          {/* ══ THE RECEIPTS — boarding pass ══ */}
          <Section className="sec bg-canvas" style={s.passOuter}>
            <Section className="bg-white" style={s.pass}>
              <Section className="bg-ink" style={s.passStrip}>
                <Text style={s.passStripText}>THE RECEIPTS</Text>
              </Section>

              {/* The destination's own mark, like the airline block on a real pass */}
              {/* Centred with a td align attribute: some desktop clients ignore
                  margin: auto on images, which left the logo hugging the left edge. */}
              <table role="presentation" cellPadding="0" cellSpacing="0" border={0} width="100%">
                <tbody>
                  <tr>
                    <td align="center" style={s.passLogoRow}>
                      <Img
                        src={`${SITE}/email/tokyo/tokyo-marathon-2027-logo.jpg`}
                        width="220"
                        height="98"
                        alt="Tokyo Marathon 2027"
                        style={s.passLogo}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
                className="detect-off"
                style={s.route}
              >
                <tbody>
                  <tr>
                    <td width="42%" style={s.routeCellL}>
                      <Text style={s.routeLabel}>FROM</Text>
                      <Text className="fs-route" style={s.routeCity}>BAY AREA</Text>
                    </td>
                    <td width="16%" style={s.routeMid}>
                      <Text style={s.routeArrow}>→</Text>
                    </td>
                    <td width="42%" style={s.routeCellR}>
                      <Text style={s.routeLabelR}>TO</Text>
                      <Text className="fs-route" style={s.routeCityR}>TOKYO</Text>
                    </td>
                  </tr>
                </tbody>
              </table>

              <Text className="t-body" style={s.passIntro}>
                Here&rsquo;s the planned budget for getting from the Bay Area to
                Tokyo and through race week:
              </Text>

              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
                className="detect-off"
                style={s.lines}
              >
                <tbody>
                  {receipts.map((r) => (
                    <tr key={r.label}>
                      <td width="68%" style={s.lineLabelCell}>
                        <Text className="t-body" style={s.lineLabel}>{r.label}</Text>
                      </td>
                      <td width="32%" style={s.lineAmtCell}>
                        <Text className="t-ink" style={s.lineAmt}>{usd(r.amount)}</Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Perforation: the tear line between the list and the total */}
              <Section style={s.perf} />

              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
                className="detect-off"
                style={s.totalTable}
              >
                <tbody>
                  <tr>
                    <td width="50%" style={s.totalLabelCell}>
                      <Text style={s.totalLabel}>FUNDRAISING GOAL</Text>
                    </td>
                    <td width="50%" style={s.totalAmtCell}>
                      <Text className="fs-total" style={s.totalAmt}>{usd(GOAL)}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
            <Text className="t-body" style={s.passAfter}>
              Traveling internationally with a prosthetic leg and racing
              equipment takes planning. Your donation will help cover the
              practical costs of making this race possible.
            </Text>
          </Section>

          {/* ══ CLIMAX — the ask ══ */}
          <Section className="sec bg-ink" style={s.ask}>
            <Text className="fs-amounts detect-off" style={s.askAmounts}>
              $20.&nbsp;&nbsp;$50.&nbsp;&nbsp;$100.
            </Text>
            <Text style={s.askBody}>
              If you can give $20, $50, $100, or any amount that works for you,
              I&rsquo;d be grateful. If you can&rsquo;t donate, sharing this
              campaign with someone who might connect with my story is another
              way to help.
            </Text>
            <Section style={s.gap12} />
            <Link href={DONATE_URL} style={s.askBtn}>
              DONATE TO TOKYO&nbsp;&nbsp;→
            </Link>
            <Section style={s.gap18} />
            <Link href={GOFUNDME_URL} style={s.askShare}>
              OR SHARE THE CAMPAIGN
            </Link>
            <Section style={s.askRule} />
            <Text style={s.askUpdates}>
              I&rsquo;ll share updates as travel is booked, along with training
              progress and a race recap, so you can follow the journey
              you&rsquo;re helping support.
            </Text>
            <Section style={s.gap18} />
            <Link href={CAMPAIGN_PAGE_URL} style={s.askJourney}>
              THE ROAD TO TOKYO&nbsp;&nbsp;→
              <br />
              <span className="detect-off" style={s.askJourneyUrl}>patrickwingert.com/tokyo</span>
            </Link>
          </Section>

          {/* ══ CLOSE — Patrick's sign-off ══ */}
          <Section className="sec bg-canvas" style={s.close}>
            <Text className="t-body" style={s.bodyText}>
              I&rsquo;ll bring the training, the determination, and everything
              Bhutan, Chicago and ParaTriathlon have taught me. Your support will
              help me bring that work to Tokyo.
            </Text>
            <Text className="t-body" style={s.bodyText}>
              Thank you for being part of the journey.
            </Text>
            <Text style={s.sig}>Patrick</Text>
          </Section>

          {/* ══ DARE2TRI — the separate, tax-deductible path ══ */}
          <Section className="sec bg-canvas" style={s.d2tOuter}>
            <Section className="bg-white" style={s.d2t}>
              <Img
                src={`${SITE}/email/dare2tri.png`}
                width="128"
                alt="Dare2Tri"
                style={s.d2tLogo}
              />
              <Text className="t-body" style={s.d2tText}>
                This GoFundMe supports my personal travel and race expenses. You
                can also support adaptive sport programs through a separate gift
                directly to Dare2tri. Gifts through that link go to the
                organization.
              </Text>
              <Link href={DARE2TRI_URL} style={s.d2tLink}>
                GIVE TO DARE2TRI&nbsp;&nbsp;→
              </Link>
            </Section>
          </Section>

          {/* ══ FINALE ══ */}
          <Section className="sec bg-ink" style={s.finale}>
            <Text style={s.finaleLine}>LIFE IS HARD.</Text>
            <Text style={s.finaleAccent}>BE HARDER.</Text>
          </Section>

          <BrandFooter email={email} hideMotto flush />
        </Container>
      </Body>
    </Html>
  );
}

const gap = (h: number) => ({ height: `${h}px`, lineHeight: `${h}px`, fontSize: "1px" });

const s = {
  bodyEl: { backgroundColor: c.canvas, fontFamily: system, margin: 0, padding: 0 },
  wrapper: {
    backgroundColor: c.canvas,
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
    padding: 0,
    tableLayout: "fixed" as const,
  },
  gap12: gap(12),
  gap18: gap(18),

  /* ── Hero ── */
  heroOuter: {
    backgroundColor: c.ink,
    padding: 0,
    tableLayout: "fixed" as const,
  },
  hero: {
    padding: "52px 30px 18px",
    textAlign: "center" as const,
  },
  heroKicker: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.orange,
    margin: "0 0 26px",
  },
  heroLine1: {
    fontFamily: bebas,
    fontSize: "76px",
    lineHeight: "0.88",
    letterSpacing: "2px",
    color: c.white,
    margin: 0,
  },
  heroLine2: {
    fontFamily: bebas,
    fontSize: "76px",
    lineHeight: "0.88",
    letterSpacing: "2px",
    color: c.orange,
    margin: 0,
  },
  heroSub: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.6",
    color: c.onDark,
    margin: "22px 0 0",
  },

  photo: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },

  /* ── Six Star tracker ── */
  tracker: {
    padding: "8px 24px 44px",
    textAlign: "center" as const,
  },
  starCell: {
    textAlign: "center" as const,
    verticalAlign: "top" as const,
    padding: "0 2px",
  },
  star: {
    // System symbol font, not Bebas: the glyph must exist on every client.
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "34px",
    lineHeight: "40px",
    height: "40px",
    margin: "0 0 8px",
    textAlign: "center" as const,
  },
  cityLit: {
    fontFamily: bebas,
    fontSize: "15px",
    letterSpacing: "1px",
    lineHeight: "1",
    color: c.white,
    margin: 0,
    whiteSpace: "nowrap" as const,
  },
  cityOpen: {
    fontFamily: bebas,
    fontSize: "15px",
    letterSpacing: "1px",
    lineHeight: "1",
    color: "#6f685c",
    margin: 0,
    whiteSpace: "nowrap" as const,
  },
  cityNote: {
    fontFamily: mono,
    fontSize: "9px",
    fontWeight: 700,
    // Tight enough that "4:17:17" fits a phone-width column on one line.
    letterSpacing: "0.3px",
    color: c.orange,
    margin: "6px 0 0",
    lineHeight: "1.2",
    whiteSpace: "nowrap" as const,
  },
  trackerRule: {
    height: "1px",
    lineHeight: "1px",
    fontSize: "1px",
    backgroundColor: c.ruleDark,
    margin: "30px 0 28px",
  },
  days: { margin: 0, lineHeight: "1" },
  daysNum: {
    fontFamily: bebas,
    fontSize: "72px",
    letterSpacing: "2px",
    lineHeight: "0.9",
    color: c.white,
  },
  daysLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.onDarkMuted,
  },
  hashtag: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    color: c.orange,
    margin: "22px 0 0",
  },

  /* ── Story ── */
  story: { padding: "46px 30px 30px" },
  lede: {
    fontFamily: system,
    fontSize: "19px",
    lineHeight: "1.65",
    fontWeight: 600,
    color: c.ink,
    margin: "0 0 20px",
  },
  bodyText: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.8",
    color: c.body,
    margin: "0 0 18px",
  },
  bodyTextLast: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.8",
    color: c.body,
    margin: 0,
  },
  standout: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "30px",
    lineHeight: "1.1",
    letterSpacing: "1px",
    color: c.orangeDeep,
    margin: "10px 0 16px",
  },

  /* ── Chicago ── */
  chicagoTop: { padding: "30px 30px 30px" },
  chicago: {
    padding: "30px 30px 46px",
    textAlign: "center" as const,
  },
  chicagoBodyCenter: {
    textWrap: "balance" as const,
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.7",
    color: c.onDark,
    margin: "0 0 28px",
  },
  pairCellL: { paddingRight: "5px", verticalAlign: "top" as const },
  pairCellR: { paddingLeft: "5px", verticalAlign: "top" as const },
  pairImg: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
    borderRadius: "8px",
  },
  inset: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
    borderRadius: "12px",
    margin: "6px 0 26px",
  },
  chicagoLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.onDarkMuted,
    margin: "0 0 6px",
  },
  chicagoTime: {
    fontFamily: bebas,
    fontSize: "84px",
    lineHeight: "0.95",
    letterSpacing: "3px",
    color: c.white,
    margin: "0 0 18px",
  },
  chicagoBody: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.8",
    color: c.onDark,
    margin: 0,
    textAlign: "left" as const,
  },
  chicagoPunch: {
    fontFamily: bebas,
    fontSize: "34px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: c.orange,
    margin: 0,
  },

  /* ── Boarding pass ── */
  passOuter: { padding: "16px 30px 46px" },
  pass: {
    tableLayout: "fixed" as const,
    backgroundColor: c.white,
    border: `2px solid ${c.ink}`,
    borderRadius: "12px",
    overflow: "hidden",
  },
  passStrip: { backgroundColor: c.ink, padding: "12px 22px 13px", textAlign: "center" as const },
  passStripText: {
    fontFamily: bebas,
    fontSize: "22px",
    letterSpacing: "4px",
    lineHeight: "1",
    color: c.white,
    margin: 0,
  },
  passLogoRow: { padding: "22px 22px 2px", textAlign: "center" as const },
  // Inline, not block: a block image ignores the cell's align="center" once a client strips margin: auto.
  passLogo: { display: "inline-block", verticalAlign: "middle", width: "220px", maxWidth: "100%", height: "auto", border: "none" },
  route: { borderBottom: `2px solid ${c.ink}` },
  routeCellL: { padding: "20px 0 18px 22px", verticalAlign: "bottom" as const, textAlign: "left" as const },
  routeCellR: { padding: "20px 22px 18px 0", verticalAlign: "bottom" as const, textAlign: "right" as const },
  routeMid: { padding: "20px 0 22px", verticalAlign: "bottom" as const, textAlign: "center" as const },
  routeArrow: {
    fontFamily: system,
    fontSize: "26px",
    fontWeight: 700,
    lineHeight: "1",
    color: c.orange,
    margin: 0,
    textAlign: "center" as const,
  },
  routeLabel: {
    fontFamily: mono,
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.muted,
    margin: "0 0 4px",
    textAlign: "left" as const,
  },
  routeLabelR: {
    fontFamily: mono,
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.muted,
    margin: "0 0 4px",
    textAlign: "right" as const,
  },
  routeCity: {
    fontFamily: bebas,
    fontSize: "34px",
    lineHeight: "0.95",
    letterSpacing: "1px",
    color: c.ink,
    margin: 0,
    whiteSpace: "nowrap" as const,
    textAlign: "left" as const,
  },
  routeCityR: {
    fontFamily: bebas,
    fontSize: "34px",
    lineHeight: "0.95",
    letterSpacing: "1px",
    color: c.hinomaru,
    margin: 0,
    whiteSpace: "nowrap" as const,
    textAlign: "right" as const,
  },
  passIntro: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.65",
    color: c.body,
    margin: 0,
    padding: "18px 22px 6px",
  },
  lines: { tableLayout: "fixed" as const },
  lineLabelCell: { padding: "11px 0 11px 22px", borderBottom: `1px dotted ${c.rule}`, verticalAlign: "middle" as const },
  lineAmtCell: {
    padding: "11px 22px 11px 0",
    borderBottom: `1px dotted ${c.rule}`,
    verticalAlign: "middle" as const,
    textAlign: "right" as const,
  },
  lineLabel: { fontFamily: system, fontSize: "15px", lineHeight: "1.4", color: c.body, margin: 0 },
  lineAmt: {
    fontFamily: bebas,
    fontSize: "22px",
    letterSpacing: "1px",
    lineHeight: "1",
    color: c.ink,
    margin: 0,
    textAlign: "right" as const,
  },
  perf: {
    borderTop: `2px dashed ${c.ink}`,
    margin: "18px 0 0",
    height: "1px",
    lineHeight: "1px",
    fontSize: "1px",
  },
  totalTable: { tableLayout: "fixed" as const, backgroundColor: c.white },
  totalLabelCell: { padding: "20px 0 22px 22px", verticalAlign: "middle" as const },
  totalAmtCell: { padding: "20px 22px 22px 0", verticalAlign: "middle" as const, textAlign: "right" as const },
  totalLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.muted,
    margin: 0,
  },
  totalAmt: {
    fontFamily: bebas,
    fontSize: "48px",
    letterSpacing: "1px",
    lineHeight: "0.9",
    color: c.orangeDeep,
    margin: 0,
    textAlign: "right" as const,
  },
  passAfter: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.75",
    color: c.body,
    margin: "22px 0 0",
  },

  /* ── Ask (climax) ── */
  ask: {
    backgroundColor: c.ink,
    padding: "54px 30px 46px",
    textAlign: "center" as const,
  },
  askAmounts: {
    fontFamily: bebas,
    fontSize: "52px",
    letterSpacing: "2px",
    lineHeight: "1",
    color: c.orange,
    margin: "0 0 20px",
    whiteSpace: "nowrap" as const,
  },
  askBody: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.75",
    color: c.onDark,
    margin: "0 0 18px",
  },
  askBtn: {
    display: "inline-block",
    backgroundColor: c.orange,
    color: c.white,
    fontFamily: mono,
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "2px",
    textDecoration: "none",
    padding: "18px 34px",
    borderRadius: "8px",
  },
  askShare: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.onDark,
    textDecoration: "underline",
  },
  askRule: {
    height: "1px",
    lineHeight: "1px",
    fontSize: "1px",
    backgroundColor: c.ruleDark,
    margin: "36px 0 24px",
  },
  askUpdates: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.7",
    color: c.onDarkMuted,
    margin: 0,
  },
  askJourney: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    lineHeight: "1.8",
    color: c.orange,
    textDecoration: "none",
  },
  askJourneyUrl: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 400,
    letterSpacing: "1px",
    color: c.onDarkMuted,
  },

  /* ── Close ── */
  close: { padding: "46px 30px 10px" },
  sig: {
    fontFamily: bebas,
    fontSize: "30px",
    letterSpacing: "2px",
    lineHeight: "1",
    color: c.ink,
    margin: "6px 0 0",
  },

  /* ── Dare2Tri ── */
  d2tOuter: { padding: "30px 30px 46px" },
  d2t: {
    tableLayout: "fixed" as const,
    backgroundColor: c.white,
    border: `1px solid ${c.rule}`,
    borderRadius: "12px",
    padding: "26px 24px 24px",
  },
  d2tLogo: { display: "block", width: "128px", height: "auto", border: "none", margin: "0 0 16px" },
  d2tText: { fontFamily: system, fontSize: "14px", lineHeight: "1.7", color: c.body, margin: "0 0 16px" },
  d2tLink: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.orangeDeep,
    textDecoration: "none",
  },

  /* ── Finale ── */
  finale: { backgroundColor: c.ink, padding: "46px 30px 30px", textAlign: "center" as const },
  finaleLine: {
    fontFamily: bebas,
    fontSize: "44px",
    lineHeight: "0.95",
    letterSpacing: "2px",
    color: c.white,
    margin: 0,
  },
  finaleAccent: {
    fontFamily: bebas,
    fontSize: "44px",
    lineHeight: "0.95",
    letterSpacing: "2px",
    color: c.orange,
    margin: 0,
  },
} satisfies Record<string, React.CSSProperties>;
