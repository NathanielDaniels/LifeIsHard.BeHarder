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
import {
  BrandFooter,
  SITE,
  sponsorTiers,
  sponsorUrls,
} from "./components/brand";

/**
 * CHICAGO V1 — "THE FIFTH STAR"
 *
 * Patrick-first, Chicago-accented. The Chicago flag's four red Municipal
 * Device stars bookend the email, and the single orange star marks each
 * section head. All body copy is Patrick's, verbatim.
 *
 * Anti-reference contract (from PRODUCT.md — all four confirmed failures of
 * the previous demos):
 *   - NO tracked-mono eyebrow above every section. The star glyph + Bebas
 *     headline is the one, named section device.
 *   - NOT cold: radial-glow hero (bgcolor fallback for Outlook), cinema-graded
 *     photography, a light-blue flag band, gold and orange moments.
 *   - NOT flat: every section has a different treatment; the climax is the
 *     finish photo melting into the ONE LAST PUSH band.
 *   - Feels like patrickwingert.com: near-black, Bebas, orange, ECG.
 */

const SUBJECT = "Chicago. Home Field Advantage.";
const PREVIEW =
  "One last paratriathlon sprint. Sunday, 8:00 AM, Monroe Harbor — and this time, we're racing at home.";

const FUNDRAISER_URL = "https://give.dare2tri.org/fundraiser/6928347";
const COURSE_MAP_URL = "https://supertri.com/chicago-triathlon/sprint/";
const NE_GATE_URL = "https://maps.app.goo.gl/ZMcgr3v2onYCmfm78";
const SHAKEOUT_URL =
  "https://www.eventbrite.com/e/supertri-strides-powered-by-athletic-brewing-supertri-chicago-tickets-1996051309198?aff=oddtdtcreator";

const c = {
  ink: "#16130e", // matches brand.tsx colors.ink — no seam at the footer
  canvas: "#f1f1ee",
  white: "#ffffff",
  orange: "#f97316",
  orangeDeep: "#c2410c",
  flagBlue: "#b3ddf2",
  flagBlueInk: "#081923", // text on flag blue
  flagRed: "#e03c31",
  gold: "#c9a227",
  body: "#262119",
  muted: "#5f594f",
  onDark: "#ddd7cb",
  ruleDark: "#2a251d",
  rule: "#d8d6cd",
};

const bebas = '"Bebas Neue", Arial Narrow, Arial, Helvetica, sans-serif';
const mono =
  'ui-monospace, "SF Mono", Menlo, Consolas, "Courier New", monospace';
const system =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

/* Star + headline: the one section device. The star rides inline in the
   headline text (baseline-aligned) — table-cell centering drifted per client. */
function StarHead({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <Text
      style={{
        fontFamily: bebas,
        fontSize: "30px",
        letterSpacing: "1.5px",
        lineHeight: "1",
        color: dark ? c.white : c.ink,
        margin: "0 0 22px",
      }}
    >
      <Img
        src={`${SITE}/email/chicago/star-orange.png`}
        width="20"
        height="20"
        alt=""
        style={{
          display: "inline-block",
          width: "20px",
          height: "20px",
          verticalAlign: "-1px",
        }}
      />
      &nbsp;&nbsp;
      {children}
    </Text>
  );
}

const bibRows = [
  { label: "START", value: "8:00 AM" },
  { label: "SWIM CAP", value: "GOLD", dot: true },
  { label: "SWIM START", value: "MONROE HARBOR" },
  { label: "DISTANCE", value: "750M · 20K · 5K", small: true },
];

const strideRows = [
  { time: "5:30", what: "Event start" },
  { time: "6:00", what: "Run — 2 or 3 miles" },
  { time: "6:45", what: "Brews and raffle" },
];

const watchSpots = [
  {
    title: "SWIM START — MONROE HARBOR",
    place: "700 S. Lake Shore Drive",
    note: "Be there by 7:45. Wave 11 goes off at 8:00 sharp — gold caps.",
    href: "https://www.google.com/maps/search/?api=1&query=Monroe+Harbor+700+S+Lake+Shore+Drive+Chicago",
    hrefLabel: "MONROE HARBOR →",
  },
  {
    title: "TRANSITION — DUSABLE HARBOR",
    place: "600 E. Randolph · enter at the Northeast Gate",
    note: "The one spot where you see him twice: bike out and bike in.",
    href: NE_GATE_URL,
    hrefLabel: "NORTHEAST GATE →",
  },
  {
    title: "FINISH — GRANT PARK",
    place: "Columbus Drive",
    note: "Where the noise matters most. Finish Festival runs 7:30–2:00.",
    href: "https://www.google.com/maps/search/?api=1&query=Grant+Park+Columbus+Drive+and+Balbo+Chicago",
    hrefLabel: "FINISH FESTIVAL →",
  },
];

/* Patrick's words, verbatim. Only edit: "Dave Rotter" -> "David Rotter",
   which Nathaniel confirmed. Each sponsor is paired with its own logo so the
   copy and the logos are one section, not two (Patrick's note). */
const sponsorBlocks = [
  {
    name: "PERFORMANCE WEALTH",
    href: sponsorUrls.performanceWealth,
    logo: `${SITE}/email/performance-wealth.png`,
    logoW: 150,
    alt: "Performance Wealth Partners",
    text: "Performance Wealth has been the title sponsor of this entire season. From even before the first race to this final start line, Tom and PWP has backed the mission and believed in what we're building. His texts always hit at the right time too! Thank you, Tom",
  },
  {
    name: "ADAPTIVE TRAINING FOUNDATION",
    href: sponsorUrls.atf,
    logo: `${SITE}/email/atf.png`,
    logoW: 82,
    alt: "Adaptive Training Foundation",
    text: "Adaptive Training Foundation has been instrumental in helping me become the athlete I am today. The training, the community and the relentless expectation to be a better man not just a better athlete have made a difference. Thank you for continuing to push me.",
  },
  {
    name: "CHALLENGED ATHLETES FOUNDATION",
    href: sponsorUrls.caf,
    logo: `${SITE}/email/caf.png`,
    logoW: 92,
    alt: "Challenged Athletes Foundation",
    text: "Challenged Athletes Foundation put me on the right bike for this fight, awarding me the Quintana Roo X-PR that carried me through this season. Thank you to everyone in the CAF community for helping make this possible.",
  },
  {
    name: "DAVID ROTTER PROSTHETICS",
    href: sponsorUrls.davidRotter,
    logo: `${SITE}/email/david-rotter.png`,
    logoW: 104,
    alt: "David Rotter Prosthetics",
    text: "David Rotter Prosthetics has kept me moving when the equipment that makes all of this possible gets complicated. The prosthetic support, problem-solving and willingness to keep working until we get it right have been invaluable. Thank you, David.",
  },
];

/* Logos with no copy of their own still belong on the page. */
const teamSupport = sponsorTiers
  .flatMap((t) => t.logos)
  .filter((l) => /dare2tri|sebcm/.test(l.src));

export const chicagoV1Subject = SUBJECT;

export default function ChicagoV1FifthStar({ email }: { email?: string }) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        {/* Stop Samsung/iOS auto-linking dates, times and addresses */}
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
          /* Apple Mail data detectors: keep auto-created links invisible */
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
          /* Samsung/Gmail linkified numbers inside data blocks */
          .detect-off a {
            color: inherit !important;
            text-decoration: none !important;
            font-family: inherit !important;
            font-size: inherit !important;
          }
          /* Phone widths: scale display type, relax side padding */
          @media only screen and (max-width: 480px) {
            .sec { padding-left: 22px !important; padding-right: 22px !important; }
            .fs-hero1 { font-size: 54px !important; }
            .fs-hero2 { font-size: 34px !important; }
            .fs-bibnum { font-size: 80px !important; }
            .fs-bibval { font-size: 17px !important; }
          }
          /* Dark mode. Three separate mechanisms, because no single one
             covers every client:
               1. prefers-color-scheme  -> Apple Mail, Samsung Email, Outlook app
               2. [data-ogsc]/[data-ogsb] -> Outlook.com's rewriter
             Gmail's mobile apps honour NEITHER; they run their own inversion
             filter. bgcolor attributes (injected at send time) are the only
             partial defence there. */
          @media (prefers-color-scheme: dark) {
            .bg-canvas { background-color: #f1f1ee !important; }
            .bg-ink { background-color: #16130e !important; }
            .bg-blue { background-color: #b3ddf2 !important; }
            .bg-white { background-color: #ffffff !important; }
            .bg-orange { background-color: #f97316 !important; }
            .t-ink { color: #16130e !important; }
            .t-body { color: #3d3a35 !important; }
          }
          [data-ogsc] .bg-canvas, [data-ogsb] .bg-canvas { background-color: #f1f1ee !important; }
          [data-ogsc] .bg-ink,    [data-ogsb] .bg-ink    { background-color: #16130e !important; }
          [data-ogsc] .bg-blue,   [data-ogsb] .bg-blue   { background-color: #b3ddf2 !important; }
          [data-ogsc] .bg-white,  [data-ogsb] .bg-white  { background-color: #ffffff !important; }
          [data-ogsc] .bg-orange, [data-ogsb] .bg-orange { background-color: #f97316 !important; }
          [data-ogsc] .t-ink,     [data-ogsb] .t-ink     { color: #16130e !important; }
          [data-ogsc] .t-body,    [data-ogsb] .t-body    { color: #3d3a35 !important; }
        `}</style>
      </Head>

      <Preview>{PREVIEW}</Preview>

      <Body className="bg-canvas" style={s.bodyEl}>
        <Container className="bg-canvas" style={s.wrapper}>
          {/* Flag stripe: blue / white / blue — the flag's structure as the opening gesture */}
          <Section style={s.stripeBlue} />
          <Section style={s.stripeWhite} />
          <Section style={s.stripeBlue} />

          {/* ══ HERO — glow + stars ══ */}
          <Section className="sec bg-ink" style={s.hero}>
            <Text className="detect-off" style={s.heroKicker}>
              SUPERTRI CHICAGO&nbsp;&nbsp;·&nbsp;&nbsp;SUNDAY, AUGUST 23
            </Text>
            <Img
              src={`${SITE}/email/chicago/stars-four.png`}
              width="240"
              height="60"
              alt="The four red six-pointed stars of the Chicago flag"
              style={s.heroStars}
            />
            <Section style={s.gap32} />
            <Text className="fs-hero1" style={s.heroLine1}>CHICAGO.</Text>
            <Text className="fs-hero2" style={s.heroLine2}>
              HOME FIELD ADVANTAGE.
            </Text>
            <Text style={s.heroStandfirst}>
              One last paratriathlon sprint.
            </Text>
            <Text style={s.heroStandLine}>
              SUNDAY. 8:00 AM. MONROE HARBOR.
            </Text>
            <Text style={s.heroStandfirstLast}>
              And this time, we&rsquo;re racing at home.
            </Text>
            <Section style={s.gap44} />
            <Img
              src={`${SITE}/email/chicago/ecg-strip.png`}
              width="536"
              height="39"
              alt=""
              style={s.heroEcg}
            />
          </Section>

          {/* ══ PORTRAIT — full bleed, melts up into hero ══ */}
          <Section style={s.photoBlock}>
            <Img
              src={`${SITE}/email/chicago/chi-portrait-cine.jpg`}
              width="620"
              alt="Patrick mid-race through the streets of Chicago, Dare2Tri kit, throwing a hand sign"
              style={s.photo}
            />
          </Section>
          <Section style={s.captionBand}>
            <Text style={s.captionBandText}>
              <span style={s.nowrap}>THESE STREETS KNOW ME</span>{" "}
              ·{" "}
              <span style={s.nowrap}>CHICAGO MARATHON &rsquo;25</span>
            </Text>
          </Section>

          {/* ══ THE PITCH ══ */}
          <Section className="sec bg-canvas" style={s.pitch}>
            <Text className="t-body" style={s.bodyText}>
              SuperTri Chicago is the largest triathlon in North America. If
              you&rsquo;ve never seen triathlon live, this is the one to see.
              The swim starts at Monroe Harbor. Then it&rsquo;s onto the bike
              and iconic Lake Shore Drive, before the final 5K through Grant
              Park.
            </Text>
            <Text style={s.pitchPunch}>
              It&rsquo;s fast. It&rsquo;s loud. It&rsquo;s Chicago.
            </Text>
            <Text style={s.pitchWant}>AND I WANT YOU THERE.</Text>
          </Section>

          {/* ══ RACE BIB — the spectator payload ══ */}
          <Section className="sec" style={s.bibOuter}>
            <Section className="bg-white" style={s.bib}>
              <Section style={s.bibStrip}>
                <Text style={s.bibStripText}>
                  SPRINT&nbsp;&nbsp;·&nbsp;&nbsp;PARATRI
                </Text>
              </Section>
              <Section style={s.bibWaveBlock}>
                <Text style={s.bibWaveLabel}>WAVE</Text>
                <Text className="fs-bibnum detect-off" style={s.bibNumber}>
                  11
                </Text>
              </Section>
              {/* Label/value rows, not columns: three abbreviations side by
                  side could not survive a 320px screen. This always fits. */}
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
                className="detect-off"
                style={s.bibGrid}
              >
                <tbody>
                  {bibRows.map((row, i) => {
                    const last = i === bibRows.length - 1;
                    return (
                      <tr key={row.label}>
                        <td style={last ? s.bibLabelCellLast : s.bibLabelCell}>
                          <Text style={s.bibCellLabel}>{row.label}</Text>
                        </td>
                        <td style={last ? s.bibValueCellLast : s.bibValueCell}>
                          <Text
                            className="fs-bibval"
                            style={row.small ? s.bibCellValueSm : s.bibCellValue}
                          >
                            {row.dot ? <span style={s.capDot}>&nbsp;</span> : null}
                            {row.value}
                          </Text>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Section style={s.bibFoot}>
                <Text style={s.bibFootText}>
                  SCREENSHOT THIS — IT&rsquo;S HOW YOU FIND ME SUNDAY
                </Text>
              </Section>
            </Section>
          </Section>

          {/* ══ WHERE TO STAND — flag-blue band ══ */}
          <Section className="sec bg-blue" style={s.blueBand}>
            <StarHead>COME WATCH</StarHead>
            <Text style={s.comeWatchDate}>Sunday, August 23 | 8:00 AM</Text>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
            >
              <tbody>
                {watchSpots.map((spot, i) => (
                  <tr key={spot.title}>
                    <td
                      style={
                        i < watchSpots.length - 1 ? s.spotCell : s.spotCellLast
                      }
                    >
                      <Text style={s.spotTitle}>
                        <Img
                          src={`${SITE}/email/chicago/star-red.png`}
                          width="15"
                          height="15"
                          alt=""
                          style={{
                            display: "inline-block",
                            width: "15px",
                            height: "15px",
                            verticalAlign: "0px",
                          }}
                        />
                        &nbsp;&nbsp;
                        {spot.title}
                      </Text>
                      <Text style={s.spotPlace}>{spot.place}</Text>
                      <Text className="t-body" style={s.spotNote}>{spot.note}</Text>
                      {spot.href ? (
                        <Link href={spot.href} style={s.spotLink}>
                          {spot.hrefLabel}
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* ══ RACE MAPS — panels lifted from the official graphics ══ */}
          <Section className="sec bg-canvas" style={s.mapSection}>
            <Link href={COURSE_MAP_URL}>
              <Img
                src={`${SITE}/email/chicago/map-venue.jpg`}
                width="536"
                alt="SuperTri Chicago venue map — swim start, transition and finish along the lakefront"
                style={s.mapImg}
              />
            </Link>
            <Section style={s.mapGap} />
            <Link href={COURSE_MAP_URL}>
              <Img
                src={`${SITE}/email/chicago/map-transition.jpg`}
                width="536"
                alt="SuperTri Chicago transition map — DuSable Harbor at 600 E. Randolph"
                style={s.mapImgLast}
              />
            </Link>
            <Text style={s.mapCaptionText}>
              TAP EITHER MAP FOR THE FULL-SIZE VERSION&nbsp;&nbsp;→
            </Text>
          </Section>

          {/* ══ GET THERE WITHOUT THE HEADACHE ══ */}
          <Section className="sec bg-canvas" style={s.cream}>
            <StarHead>GET THERE WITHOUT THE HEADACHE</StarHead>
            <Text className="t-body" style={s.bodyText}>
              Take public transit or Metra. Downtown race-day traffic and road
              closures will make driving a pain.
            </Text>
            <Text style={s.standoutLine}>Using Divvy?</Text>
            <Section style={s.codeBox}>
              <Text style={s.codeLabel}>CODE</Text>
              <Text className="detect-off" style={s.codeValue}>
                CHITRIATHLETES26
              </Text>
              <Text className="t-body" style={s.codeNote}>
                Get three free rides, up to $15 each. Redeem in the Rewards tab
                of the Divvy app beginning August 21. Available to new or
                first-time Divvy riders.
              </Text>
            </Section>
          </Section>

          {/* ══ SUPERTRI STRIDES — Friday shakeout with Athletic Brewing ══ */}
          <Section className="sec bg-orange" style={s.orangeBand}>
            <Text style={s.orangeKicker}>
              WANT TO GET THE WEEKEND STARTED EARLY?
            </Text>
            <Text style={s.orangeBig}>
              SHAKEOUT RUN — FRIDAY
            </Text>
            <Text style={s.orangeBody}>
              Join me for a shakeout run and an NA Beer from Athletic Brewing.
              Raffle prizes from Athletic Brewing, Varlo and The Feed. Easy
              miles. Good people. Race-week energy.
            </Text>
            <Section style={s.gap8} />
            <Img
              src={`${SITE}/email/chicago/athletic-brewing-white.png`}
              width="196"
              height="43"
              alt="Powered by Athletic Brewing Co."
              style={s.abLogo}
            />
            <Section style={s.gap28} />
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              className="detect-off"
              style={s.strideTable}
            >
              <tbody>
                {strideRows.map((row, i) => (
                  <tr key={row.time}>
                    <td style={s.strideTimeCell}>
                      <Text style={s.strideTime}>{row.time}</Text>
                    </td>
                    <td
                      style={
                        i === strideRows.length - 1
                          ? s.strideEventCellLast
                          : s.strideEventCell
                      }
                    >
                      <Text style={s.strideWhat}>{row.what}</Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Text style={s.orangePlace}>
              Whole Foods Edgewater ·{" "}
              <Link
                href="https://www.google.com/maps/search/?api=1&query=6009+N+Broadway+Chicago+IL+60660"
                style={s.orangePlaceLink}
              >
                6009 N Broadway
              </Link>
            </Text>
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
                  <td style={{ verticalAlign: "middle", paddingRight: "18px" }}>
                    <Link href={SHAKEOUT_URL} style={s.orangeCta}>
                      JOIN THE SHAKEOUT&nbsp;&nbsp;→
                    </Link>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <Img
                      src={`${SITE}/email/chicago/strides-qr.jpg`}
                      width="84"
                      height="84"
                      alt="QR code — SuperTri Strides sign-up on Eventbrite"
                      style={s.qr}
                    />
                    <Text style={s.qrLabel}>OR SCAN</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* ══ CLIMAX ══ */}
          <Section className="sec bg-ink" style={s.climax}>
            <Text style={s.climaxLabel}>ONE LAST PUSH</Text>
            <Text style={s.climaxLine}>
              MILWAUKEE DIDN&rsquo;T GO THE WAY I WANTED.
            </Text>
            <Text style={s.climaxBody}>
              That&rsquo;s racing. Now I get one more shot.
            </Text>
            <Text style={s.climaxSub}>CHICAGO. HOME FIELD.</Text>
            <Text style={s.climaxBody}>
              After seven races this season, this is the final sprint triathlon
              of the year. And I want the biggest crowd of the season lining
              the course.
            </Text>
            <Text style={s.climaxBody}>So if you&rsquo;re in Chicago:</Text>
            <Text style={s.climaxPunch}>NO EXCUSES. GET DOWNTOWN.</Text>
            <Text style={s.climaxBody}>
              Bring your people. Bring your voice. Make some noise.
            </Text>
            <Text style={s.climaxPunch}>I&rsquo;LL DO THE REST.</Text>
          </Section>

          {/* ══ SUPPORT THE MISSION — its own distinct block, moved up out
                 of the sponsor section (Patrick's note) ══ */}
          <Section className="sec bg-canvas" style={s.fundOuter}>
            <Section className="bg-ink detect-off" style={s.fundCard}>
              <Text style={s.fundText}>
                Please consider supporting Dare2Tri and the incredible work
                they do to create opportunities for adaptive athletes across
                the country.
              </Text>
              <Link href={FUNDRAISER_URL} style={s.fundBtn}>
                SUPPORT MY FUNDRAISER&nbsp;&nbsp;→
              </Link>
              <Section style={s.fundRule} />
              <Text style={s.fundFine}>
                Dare2Tri is a 501(c)(3) charitable organization. Every gift is
                tax-deductible and creates access for adaptive athletes.
              </Text>
            </Section>
          </Section>

          {/* ══ SPONSORS — copy and logos together, one section ══ */}
          <Section className="sec bg-white" style={s.sponsorSection}>
            <StarHead>THE PEOPLE WHO POWERED THIS SEASON</StarHead>
            <Text style={s.standoutLine}>None of this happens alone.</Text>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
            >
              <tbody>
                {sponsorBlocks.map((sp, i) => (
                  <tr key={sp.name}>
                    <td
                      style={
                        i < sponsorBlocks.length - 1
                          ? s.thanksCell
                          : s.thanksCellLast
                      }
                    >
                      <Section style={s.gapLg} />
                      <Link href={sp.href}>
                        <Img
                          src={sp.logo}
                          width={String(sp.logoW)}
                          alt={sp.alt}
                          style={{ ...s.sponsorLogo, width: `${sp.logoW}px` }}
                        />
                      </Link>
                      <Section style={s.gapSm} />
                      <Text className="t-body" style={s.thanksText}>{sp.text}</Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Text style={s.teamLabel}>TEAM SUPPORT</Text>
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={s.teamTable}
            >
              <tbody>
                <tr>
                  {teamSupport.map((l) => (
                    <td key={l.src} style={s.teamCell}>
                      <Link href={l.href}>
                        <Img
                          src={l.src}
                          width="96"
                          alt={l.alt}
                          style={s.teamLogo}
                        />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <Text style={s.thanksPunch}>
              These aren&rsquo;t logos on a race kit.
              <br />
              They&rsquo;re people and organizations
              <br />
              who invested in the work.
            </Text>
            <Text className="t-body" style={s.bodyTextLast}>
              You helped get an adaptive athlete to starting lines across the
              country. That means more than I can put into an email.
            </Text>
          </Section>

          {/* Flag stripes: the transition into the finale, mirroring the open */}
          <Section style={s.stripeBlue} />
          <Section style={s.stripeWhite} />
          <Section style={s.stripeBlue} />

          {/* ══ CLOSE + FOOTER — one continuous dark finale ══ */}
          <Section className="sec bg-ink detect-off" style={s.close}>
            <Img
              src={`${SITE}/email/chicago/stars-four.png`}
              width="200"
              height="50"
              alt=""
              style={s.closeStars}
            />
            <Section style={s.gap28} />
            <Text style={s.closeLead}>One last race.</Text>
            <Text style={s.closeBig}>8:00 AM.</Text>
            <Text style={s.closeBigAccent}>MONROE HARBOR.</Text>
            <Text style={s.closeShout}>
              LET&rsquo;S MAKE IT FUCKING LOUD.
            </Text>
            <Text style={s.closeSig}>
              LIFE IS HARD.{" "}
              <span style={s.closeSigAccent}>BE HARDER.</span>
            </Text>
          </Section>

          <BrandFooter email={email} hideMotto flush />
        </Container>
      </Body>
    </Html>
  );
}

const s = {
  bodyEl: {
    backgroundColor: c.canvas,
    fontFamily: system,
    margin: 0,
    padding: 0,
  },
  wrapper: {
    backgroundColor: c.canvas,
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
    padding: 0,
    tableLayout: "fixed" as const,
  },

  stripeBlue: { backgroundColor: c.flagBlue, height: "7px" },
  stripeWhite: { backgroundColor: c.white, height: "5px" },

  /* ── Hero ── */
  hero: {
    backgroundColor: c.ink,
    backgroundImage: `url(${SITE}/email/chicago/hero-glow.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    padding: "54px 30px 6px",
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
  heroStars: {
    display: "inline-block",
    margin: "0 auto",
    width: "240px",
    maxWidth: "72%",
    height: "auto",
  },
  heroLine1: {
    fontFamily: bebas,
    fontSize: "62px",
    lineHeight: "0.9",
    letterSpacing: "2px",
    color: c.white,
    margin: 0,
  },
  heroLine2: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "40px",
    lineHeight: "1.05",
    letterSpacing: "1.5px",
    color: c.orange,
    margin: "6px 0 0",
  },
  heroStandfirst: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.6",
    color: c.onDark,
    margin: "30px 0 0",
  },
  heroStandLine: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "27px",
    lineHeight: "1.12",
    letterSpacing: "1.5px",
    color: c.white,
    margin: "8px 0 0",
  },
  heroEcg: {
    display: "inline-block",
    margin: "0 auto",
    width: "536px",
    maxWidth: "100%",
    height: "auto",
  },

  /* ── Photo blocks ── */
  photoBlock: { padding: 0, backgroundColor: c.ink, tableLayout: "fixed" as const },
  photoBlockDark: { padding: 0, backgroundColor: c.ink, fontSize: 0, lineHeight: 0, tableLayout: "fixed" as const },
  photo: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },
  captionBand: {
    backgroundColor: c.ink,
    padding: "14px 30px 16px",
    textAlign: "center" as const,
  },
  captionBandText: {
    fontFamily: mono,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: "#ffffff",
    margin: 0,
  },

  /* ── Pitch ── */
  pitch: { padding: "46px 30px 24px" },
  pitchBig: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "29px",
    lineHeight: "1.08",
    letterSpacing: "1px",
    color: c.ink,
    margin: "0 0 22px",
  },
  bodyText: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.8",
    color: c.body,
    margin: "0 0 18px",
  },
  pitchPunch: {
    fontFamily: system,
    fontSize: "17px",
    fontWeight: 700,
    lineHeight: "1.6",
    color: c.ink,
    margin: "0 0 10px",
  },
  pitchWant: {
    fontFamily: bebas,
    fontSize: "30px",
    lineHeight: "1.1",
    letterSpacing: "1.5px",
    color: c.orangeDeep,
    margin: 0,
  },

  /* ── Race bib ── */
  bibOuter: { padding: "0 30px 46px" },
  bib: {
    tableLayout: "fixed" as const,
    backgroundColor: c.white,
    border: `2px solid ${c.ink}`,
    borderRadius: "10px",
    overflow: "hidden",
    textAlign: "center" as const,
  },
  bibStrip: {
    backgroundColor: c.ink,
    padding: "10px 20px 11px",
  },
  bibStripText: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.white,
    margin: 0,
  },
  bibWaveBlock: {
    padding: "26px 22px 10px",
    textAlign: "center" as const,
  },
  bibWaveLabel: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "5px",
    color: c.muted,
    margin: "0 0 2px",
    textAlign: "center" as const,
  },
  bibNumber: {
    fontFamily: bebas,
    fontSize: "88px",
    lineHeight: "0.86",
    letterSpacing: "1px",
    color: c.ink,
    margin: 0,
    textAlign: "center" as const,
  },
  bibGrid: {
    borderTop: `2px solid ${c.ink}`,
  },
  bibLabelCell: {
    textAlign: "left" as const,
    padding: "14px 0 14px 22px",
    verticalAlign: "middle" as const,
    borderBottom: `1px solid ${c.rule}`,
    whiteSpace: "nowrap" as const,
  },
  bibValueCell: {
    padding: "14px 22px 14px 14px",
    verticalAlign: "middle" as const,
    borderBottom: `1px solid ${c.rule}`,
    textAlign: "right" as const,
  },
  bibLabelCellLast: {
    textAlign: "left" as const,
    padding: "14px 0 18px 22px",
    verticalAlign: "middle" as const,
    whiteSpace: "nowrap" as const,
  },
  bibValueCellLast: {
    padding: "14px 22px 18px 14px",
    verticalAlign: "middle" as const,
    textAlign: "right" as const,
  },
  bibCellLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.muted,
    margin: 0,
    textAlign: "left" as const,
  },
  bibCellValue: {
    textAlign: "right" as const,
    fontFamily: bebas,
    fontSize: "23px",
    letterSpacing: "1px",
    lineHeight: "1",
    color: c.ink,
    margin: 0,
  },
  bibCellValueSm: {
    textAlign: "right" as const,
    fontFamily: bebas,
    fontSize: "19px",
    letterSpacing: "0.5px",
    lineHeight: "1",
    color: c.ink,
    margin: 0,
    whiteSpace: "nowrap" as const,
  },
  capDot: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    backgroundColor: c.gold,
    borderRadius: "999px",
    marginRight: "7px",
  },
  bibFoot: {
    backgroundColor: c.orange,
    padding: "10px 20px 11px",
  },
  bibFootText: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.white,
    margin: 0,
  },

  /* ── Flag-blue band ── */
  blueBand: {
    backgroundColor: c.flagBlue,
    padding: "46px 30px 46px",
  },
  spotCell: {
    verticalAlign: "top" as const,
    paddingBottom: "26px",
  },
  spotCellLast: { verticalAlign: "top" as const },
  spotTitle: {
    fontFamily: bebas,
    fontSize: "24px",
    letterSpacing: "1.5px",
    lineHeight: "1.15",
    color: c.flagBlueInk,
    margin: "0 0 7px",
    paddingLeft: "26px",
    textIndent: "-26px",
  },
  spotPlace: {
    fontFamily: system,
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "1.5",
    color: "#2c4e63",
    margin: "0 0 8px",
    paddingLeft: "26px",
  },
  spotNote: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.7",
    color: c.flagBlueInk,
    margin: "0 0 10px",
    paddingLeft: "26px",
  },
  spotLink: {
    display: "inline-block",
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: c.flagBlue,
    backgroundColor: c.flagBlueInk,
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    marginLeft: "26px",
  },
  blueCta: {
    display: "inline-block",
    backgroundColor: c.flagBlueInk,
    color: c.flagBlue,
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    textDecoration: "none",
    padding: "15px 24px",
    borderRadius: "6px",
  },

  heroStandfirstLast: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.6",
    color: c.onDark,
    margin: "10px 0 0",
  },
  comeWatchDate: {
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: "#2c4e63",
    margin: "-12px 0 22px",
    paddingLeft: "26px",
  },
  climaxLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "4px",
    color: c.orange,
    margin: "0 0 16px",
  },
  climaxSub: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "30px",
    lineHeight: "1.1",
    letterSpacing: "1.5px",
    color: c.white,
    margin: "0 0 18px",
  },
  closeLead: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.6",
    color: c.onDark,
    margin: "0 0 14px",
  },

  codeBox: {
    backgroundColor: c.white,
    border: `2px dashed ${c.orange}`,
    borderRadius: "10px",
    padding: "22px 24px 24px",
    margin: "4px 0 0",
  },
  codeLabel: {
    fontFamily: mono,
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.muted,
    margin: "0 0 8px",
  },
  codeValue: {
    fontFamily: bebas,
    fontSize: "38px",
    lineHeight: "1",
    letterSpacing: "2px",
    color: c.orangeDeep,
    margin: "0 0 14px",
  },
  codeNote: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.65",
    color: c.body,
    margin: 0,
  },

  /* ── Fundraiser card ── */
  fundOuter: { padding: "46px 30px 46px" },
  fundCard: {
    backgroundColor: c.ink,
    borderRadius: "14px",
    padding: "40px 30px 36px",
    textAlign: "center" as const,
    tableLayout: "fixed" as const,
  },
  fundText: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#ede8dd",
    margin: "0 0 28px",
  },
  fundBtn: {
    display: "inline-block",
    backgroundColor: c.orange,
    color: "#ffffff",
    fontFamily: mono,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "2px",
    textDecoration: "none",
    padding: "17px 30px",
    borderRadius: "8px",
  },
  fundRule: {
    height: "1px",
    backgroundColor: "#2e2820",
    margin: "32px 0 22px",
  },
  fundFine: {
    fontFamily: system,
    fontSize: "13px",
    lineHeight: "1.65",
    color: "#a49c8d",
    margin: 0,
  },

  standoutLine: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "27px",
    lineHeight: "1.15",
    letterSpacing: "1px",
    color: c.ink,
    margin: "0 0 10px",
  },

  /* ── Sponsors: white ground so logo PNGs sit flush ── */
  sponsorSection: {
    backgroundColor: c.white,
    padding: "46px 30px 46px",
  },

  /* ── Cream sections ── */
  cream: { padding: "46px 30px 46px" },

  /* ── Timeline ── */

  /* ── Race maps: panels flattened onto the cream canvas ── */
  // Bottom 0: the timeline section below is also cream, so its 46px top
  // padding IS the gap — 46+46 on one background read as a hole.
  mapSection: {
    tableLayout: "fixed" as const,
    padding: "46px 30px 0",
    textAlign: "center" as const,
  },
  mapImg: {
    display: "block",
    width: "100%",
    maxWidth: "536px",
    height: "auto",
    border: "none",
    borderRadius: "14px",
    margin: "0 auto",
  },
  mapGap: {
    height: "26px",
    lineHeight: "26px",
    fontSize: "1px",
  },
  mapImgLast: {
    display: "block",
    width: "100%",
    maxWidth: "536px",
    height: "auto",
    border: "none",
    borderRadius: "14px",
    margin: "0 auto 14px",
  },
  mapCaptionText: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: c.muted,
    margin: 0,
    lineHeight: "1.4",
  },

  nowrap: { whiteSpace: "nowrap" as const },
  abLogo: {
    display: "block",
    width: "196px",
    maxWidth: "60%",
    height: "auto",
    border: "none",
    margin: 0,
  },

  /* ── Strides schedule strip ── */
  strideTable: {
    borderTop: "1px solid #fdba74",
    margin: "0 0 18px",
  },
  strideTimeCell: {
    width: "74px",
    padding: "11px 0",
    verticalAlign: "middle" as const,
  },
  strideEventCell: {
    padding: "11px 0",
    verticalAlign: "middle" as const,
    borderBottom: "1px solid #fdba74",
  },
  strideEventCellLast: {
    padding: "11px 0",
    verticalAlign: "middle" as const,
  },
  strideTime: {
    fontFamily: bebas,
    fontSize: "26px",
    lineHeight: "1",
    letterSpacing: "1px",
    color: "#ffffff",
    margin: 0,
  },
  // White labels: the burnt-brown #7c2d12 was illegible on the orange field.
  strideWhat: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.5",
    color: "#fff3e8",
    margin: 0,
  },
  orangePlace: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#fff3e8",
    margin: "0 0 26px",
  },
  orangePlaceLink: {
    color: "#ffffff",
    fontWeight: 700,
    textDecoration: "underline",
  },
  qr: {
    display: "block",
    borderRadius: "10px",
    margin: "0 auto 6px",
  },
  qrLabel: {
    fontFamily: mono,
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: "#ffffff",
    margin: 0,
    textAlign: "center" as const,
  },

  /* ── Orange shakeout band ── */
  orangeBand: {
    backgroundColor: c.orange,
    padding: "46px 30px 46px",
  },
  orangeKicker: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "4px",
    color: "#ffedd5",
    margin: "0 0 12px",
  },
  orangeBig: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "29px",
    lineHeight: "1.05",
    letterSpacing: "1.5px",
    color: c.white,
    margin: "0 0 16px",
  },
  orangeBody: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#fff7ed",
    margin: "0 0 24px",
  },
  orangeCta: {
    display: "inline-block",
    backgroundColor: c.ink,
    color: c.white,
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    textDecoration: "none",
    padding: "15px 26px",
    borderRadius: "6px",
  },

  /* ── Climax ── */
  climax: {
    backgroundColor: c.ink,
    padding: "46px 30px 46px",
    textAlign: "center" as const,
  },
  climaxLine: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "33px",
    lineHeight: "1.05",
    letterSpacing: "1.5px",
    color: c.white,
    margin: "0 0 20px",
  },
  climaxBody: {
    fontFamily: system,
    fontSize: "15px",
    lineHeight: "1.8",
    color: c.onDark,
    margin: "0 0 14px",
  },
  climaxPunch: {
    fontFamily: bebas,
    fontSize: "30px",
    letterSpacing: "2px",
    lineHeight: "1.1",
    color: c.orange,
    margin: "4px 0 18px",
  },

  /* ── Thanks ── */
  thanksCell: {
    verticalAlign: "top" as const,
    paddingBottom: "30px",
    borderBottom: `1px solid ${c.rule}`,
  },
  thanksCellLast: { verticalAlign: "top" as const },
  thanksName: {
    fontFamily: bebas,
    fontSize: "21px",
    letterSpacing: "1.5px",
    lineHeight: "1.1",
    color: c.orangeDeep,
    margin: "0 0 8px",
  },
  thanksText: {
    fontFamily: system,
    fontSize: "14px",
    lineHeight: "1.7",
    color: c.body,
    margin: 0,
  },
  sponsorLogo: {
    display: "block",
    maxWidth: "100%",
    height: "auto",
    border: "none",
    margin: 0,
  },
  gapLg: { height: "40px", lineHeight: "40px", fontSize: "1px" },
  gap8: { height: "8px", lineHeight: "8px", fontSize: "1px" },
  gap28: { height: "28px", lineHeight: "28px", fontSize: "1px" },
  gap32: { height: "32px", lineHeight: "32px", fontSize: "1px" },
  gap44: { height: "44px", lineHeight: "44px", fontSize: "1px" },
  gapSm: { height: "18px", lineHeight: "18px", fontSize: "1px" },
  teamLabel: {
    fontFamily: mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: c.muted,
    margin: "38px 0 6px",
  },
  teamTable: {
    borderTop: `1px solid ${c.rule}`,
    margin: "0 0 8px",
  },
  teamCell: {
    width: "50%",
    padding: "20px 14px 18px 0",
    verticalAlign: "middle" as const,
  },
  teamLogo: {
    display: "block",
    width: "96px",
    maxWidth: "100%",
    height: "auto",
    border: "none",
  },
  bodyTextLast: {
    fontFamily: system,
    fontSize: "16px",
    lineHeight: "1.8",
    color: c.body,
    margin: 0,
  },
  thanksPunch: {
    textWrap: "balance" as const,
    fontFamily: bebas,
    fontSize: "26px",
    lineHeight: "1.15",
    letterSpacing: "1px",
    color: c.ink,
    margin: "30px 0 18px",
  },
  darkCta: {
    display: "inline-block",
    backgroundColor: c.orangeDeep,
    color: c.white,
    fontFamily: mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    textDecoration: "none",
    padding: "15px 26px",
    borderRadius: "6px",
  },

  /* ── Close ── */
  close: {
    backgroundColor: c.ink,
    padding: "46px 30px 30px",
    textAlign: "center" as const,
  },
  closeStars: {
    display: "inline-block",
    margin: "0 auto",
    width: "200px",
    maxWidth: "64%",
    height: "auto",
  },
  closeBig: {
    fontFamily: bebas,
    fontSize: "47px",
    lineHeight: "0.94",
    letterSpacing: "1px",
    color: c.white,
    margin: 0,
  },
  closeBigAccent: {
    fontFamily: bebas,
    fontSize: "47px",
    lineHeight: "0.94",
    letterSpacing: "1px",
    color: c.orange,
    margin: "0 0 22px",
  },
  closeShout: {
    fontFamily: bebas,
    fontSize: "24px",
    letterSpacing: "2px",
    lineHeight: "1.15",
    color: c.white,
    margin: "0 0 30px",
  },
  closeSig: {
    fontFamily: bebas,
    fontSize: "24px",
    letterSpacing: "2px",
    lineHeight: "1.1",
    color: c.white,
    margin: "0",
  },
  closeSigAccent: { color: c.orange },
  closeMotto: {
    fontFamily: mono,
    fontSize: "9px",
    letterSpacing: "3px",
    color: c.orange,
    margin: 0,
  },
} satisfies Record<string, React.CSSProperties>;
