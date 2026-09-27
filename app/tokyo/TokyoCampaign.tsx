"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Instagram } from "lucide-react";
import SunriseScene, { HINOMARU, HINOMARU_TEXT } from "@/components/tokyo/SunriseScene";
import SixStars from "@/components/tokyo/SixStars";
import RaceClock from "@/components/tokyo/RaceClock";
import BoardingPass from "@/components/tokyo/BoardingPass";
import TrailMap from "@/components/tokyo/TrailMap";
import ShareButton from "@/components/tokyo/ShareButton";
import {
  CHICAGO_FINISH_SECONDS,
  DARE2TRI_URL,
  GOFUNDME_DONATE_URL,
  GOFUNDME_URL,
  HASHTAG,
  INSTAGRAM_URL,
  TOKYO_RACE_DATE_ISO,
  TOKYO_RACE_DATE_LABEL,
  daysToTokyo,
} from "@/lib/tokyo-campaign";

/*
 * Every first-person sentence on this page is Patrick's, verbatim from his
 * GoFundMe story. Headlines are his phrases ("One Leg. Two Stars.",
 * "Tokyo is up next.", "The receipts"). Labels and captions are factual.
 */

const THEME = "var(--theme-color, #f97316)";
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Small motion helpers                                                */
/* ------------------------------------------------------------------ */

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Photos arrive in black and white and develop into colour as they settle. */
function Develop({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { filter: "grayscale(1) brightness(0.7)" }}
      whileInView={{ filter: "grayscale(0) brightness(1)" }}
      viewport={{ once: true, margin: "-25%" }}
      transition={{ duration: 2.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Days are counted in the visitor's browser; a prerendered number would go stale. */
function useDaysToTokyo() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysToTokyo()), []);
  return days;
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const HERO_HORIZON = 60;

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const days = useDaysToTokyo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sunY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const runnerY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 120]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden" aria-labelledby="tokyo-title">
      <SunriseScene
        horizon={HERO_HORIZON}
        sunSize="min(66svh, 86vw)"
        runnerHeight={78}
        sunY={sunY}
        runnerY={runnerY}
        priority
      />

      <p
        lang="ja"
        aria-hidden="true"
        className="absolute right-3 md:right-10 top-[30%] -translate-y-1/2 [writing-mode:vertical-rl] text-[11px] md:text-sm tracking-[0.7em] text-white/30"
      >
        東京マラソン
      </p>

      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center px-5 pb-10 text-center"
        style={{ top: `${HERO_HORIZON}%`, opacity: copyOpacity, y: copyY }}
      >
        <p className="font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/60">
          Tokyo Marathon · <time dateTime={TOKYO_RACE_DATE_ISO}>{TOKYO_RACE_DATE_LABEL}</time>
        </p>
        <h1 id="tokyo-title" className="font-display leading-[0.84] mt-3 text-[clamp(4rem,22vw,7.5rem)] md:text-[clamp(6rem,10.5vw,12.5rem)]">
          <span className="block md:inline">ONE LEG.</span>{" "}
          <span className="block md:inline" style={{ color: THEME }}>TWO STARS.</span>
        </h1>
        <p className="mt-4 text-base md:text-xl text-white/80">Tokyo World Major Marathon is next.</p>
        <p className="mt-3 font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/45" aria-live="off">
          {days === null ? " " : `${days} days to the start line`}
        </p>
      </motion.div>

      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 w-px h-10 bg-gradient-to-b from-transparent to-white/50"
          animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chapters: four years, one sticky numeral                            */
/* ------------------------------------------------------------------ */

const YEARS = [
  { year: "2020", place: "Chicago" },
  { year: "2022", place: "Trans Bhutan Trail" },
  { year: "2025", place: "Chicago Marathon" },
  { year: "2027", place: "Tokyo Marathon" },
] as const;

function Chapter({
  index,
  onActive,
  children,
}: {
  index: number;
  onActive: (index: number) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  const { year, place } = YEARS[index];
  return (
    <div ref={ref} className="min-h-[70svh] md:min-h-[100svh] flex flex-col justify-center py-14 md:py-24">
      <div className="md:hidden mb-6">
        <div
          className="font-display text-[34vw] leading-[0.8]"
          style={{ color: index === 3 ? HINOMARU : "rgb(255 255 255 / 14%)" }}
          aria-hidden="true"
        >
          {year}
        </div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/45 mt-3">{place}</div>
      </div>
      {children}
    </div>
  );
}

const LEAD = "text-[1.45rem] leading-[1.3] md:text-[2.15rem] md:leading-[1.22] tracking-[-0.01em] text-white/90 max-w-[34ch]";

function Chapters() {
  const [active, setActive] = useState(0);
  const { year, place } = YEARS[active];

  return (
    <section className="relative px-5 md:px-10" aria-label="The road to Tokyo">
      <div className="max-w-7xl mx-auto md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="hidden md:block">
          <div className="sticky top-0 h-[100svh] flex flex-col justify-center" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <div
                  className="font-display leading-[0.8] text-[clamp(9rem,17vw,19rem)]"
                  style={{ color: active === 3 ? HINOMARU : "rgb(255 255 255 / 92%)" }}
                >
                  {year}
                </div>
                <div className="font-mono text-xs tracking-[0.35em] uppercase text-white/45 mt-5">{place}</div>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 mt-10">
              {YEARS.map((y, i) => (
                <span
                  key={y.year}
                  className="h-[2px] w-10 transition-colors duration-500"
                  style={{ background: i === active ? THEME : "rgb(255 255 255 / 15%)" }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <Chapter index={0} onActive={setActive}>
            <Reveal>
              <p className={LEAD}>
                In November 2020, I lost my right leg below the knee after being hit by a car. At 35, I had to learn
                to walk again.
              </p>
            </Reveal>
            <Develop className="mt-12 max-w-md">
              <Image
                src="/tokyo/floor.jpg"
                alt="My crutches, my prosthetic liner and the Chicago medal on the floor at home"
                width={1100}
                height={1375}
                sizes="(max-width: 768px) 90vw, 448px"
                className="w-full h-auto"
              />
            </Develop>
          </Chapter>

          <Chapter index={1} onActive={setActive}>
            <Reveal>
              <p className={LEAD}>
                Two years later, I flew to Bhutan and hiked 250 miles across the Trans Bhutan Trail and twelve
                mountain passes. I became the first American and the first below-knee amputee to complete the trail.
              </p>
            </Reveal>
            <TrailMap />
          </Chapter>

          <Chapter index={2} onActive={setActive}>
            <Reveal>
              <p className={LEAD}>
                Three years after that, I finished the Chicago Marathon in 4 hours, 17 minutes and 17 seconds. It
                wasn&rsquo;t a perfect race.
              </p>
            </Reveal>
            <Develop className="mt-12">
              <Image
                src="/tokyo/chicago-street.jpg"
                alt="Running through downtown Chicago during the 2025 Chicago Marathon"
                width={2400}
                height={1600}
                sizes="(max-width: 768px) 90vw, 700px"
                className="w-full h-auto"
              />
            </Develop>
          </Chapter>

          <Chapter index={3} onActive={setActive}>
            <Reveal>
              <p className={LEAD}>
                Now I&rsquo;m working toward the Tokyo Marathon on March 7, 2027, and I&rsquo;m asking for your help
                getting to the starting line.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-display text-[2.6rem] md:text-[4.2rem] leading-[0.95] mt-10 max-w-[18ch]" style={{ color: THEME }}>
                I&rsquo;m raising $5,500 to help cover the travel and race expenses for my second Abbott World
                Marathon Major.
              </p>
            </Reveal>
          </Chapter>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chicago: the race in three beats                                    */
/* ------------------------------------------------------------------ */

/** A photo that opens like a film gate as it scrolls into frame. */
function FilmGate() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const inset = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 22, 0]);
  const clipPath = useTransform(inset, (v) => `inset(${v}% 0% ${v}% 0%)`);
  const scale = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 1.12, 1]);

  return (
    <div ref={ref} className="relative max-w-[1320px] mx-auto">
      <motion.div className="relative aspect-[1206/797] overflow-hidden bg-neutral-900" style={{ clipPath }}>
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Image
            src="/tokyo/road-stop.jpg"
            alt="Sitting on the road mid-race in Chicago, fixing my prosthetic"
            fill
            sizes="(max-width: 1320px) 100vw, 1320px"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <p className="absolute left-4 top-4 md:left-6 md:top-6 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/80 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: HINOMARU_TEXT }} aria-hidden="true" />
          Chicago Marathon · 2025
        </p>
      </motion.div>
    </div>
  );
}

const AFTERMATH = [
  {
    src: "/email/chicago/chi-finish-cine.jpg",
    width: 640,
    height: 853,
    alt: "Arms up at the finish line of the 2025 Chicago Marathon",
  },
  {
    src: "/tokyo/wheelchair.jpg",
    width: 1000,
    height: 1250,
    alt: "After the finish, in a wheelchair with the medal between my teeth and my running blade across my lap",
  },
  {
    src: "/tokyo/medal.jpg",
    width: 1000,
    height: 1250,
    alt: "Holding up my 2025 Chicago Marathon medal",
  },
];

function Chicago() {
  return (
    <section className="relative py-24 md:py-40" aria-labelledby="chicago-title">
      <h2 id="chicago-title" className="sr-only">Chicago Marathon 2025</h2>
      <FilmGate />

      <Reveal className="max-w-3xl mx-auto px-6 mt-12 md:mt-16">
        <p className="text-xl md:text-[1.9rem] leading-[1.35] text-white/85">
          Chicago wasn&rsquo;t a smooth race. I had to stop several times to deal with my prosthetic. Those stops cost
          me time, but each time I got moving again.
        </p>
      </Reveal>

      <div className="mt-28 md:mt-40 px-5 text-center">
        <p className="font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/45">
          Official finish · Chicago Marathon 2025
        </p>
        <RaceClock
          seconds={CHICAGO_FINISH_SECONDS}
          className="font-display leading-[0.85] mt-4 text-[clamp(5.5rem,24vw,18rem)] tabular-nums"
        />
        <Reveal className="max-w-xl mx-auto mt-8">
          <p className="text-lg md:text-2xl leading-snug text-white/80">
            Crossing that finish line earned me my first star toward the Six Star Medal.
          </p>
        </Reveal>
        <div className="max-w-3xl mx-auto mt-14 md:mt-20">
          <SixStars />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 mt-28 md:mt-40 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {AFTERMATH.map((photo, i) => (
          <Develop key={photo.src} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 50vw, 380px" className="object-cover" />
            </div>
          </Develop>
        ))}
      </div>

      <Reveal className="mt-24 md:mt-36 px-5 text-center">
        <p className="font-display leading-[0.84] text-[clamp(4.2rem,17vw,15rem)]">
          <span style={{ color: HINOMARU }}>TOKYO</span> IS
          <br />
          UP NEXT<span style={{ color: THEME }}>.</span>
        </p>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The work                                                            */
/* ------------------------------------------------------------------ */

function TheWork() {
  return (
    <section className="px-5 md:px-10 py-24 md:py-40" aria-label="The work">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[5fr_6fr] gap-10 md:gap-20 items-center">
        <Develop>
          <Image
            src="/tokyo/portrait.jpg"
            alt="Mid-race at the 2025 Chicago Marathon, sunglasses on, hand up for the camera"
            width={1152}
            height={1153}
            sizes="(max-width: 768px) 90vw, 520px"
            className="w-full h-auto"
          />
        </Develop>
        <div>
          <Reveal>
            <p className="font-display text-[2.8rem] md:text-[4.4rem] leading-[0.92]">
              I&rsquo;ve put in the work to get this far<span style={{ color: THEME }}>.</span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/75">
              Since my amputation, I&rsquo;ve raced paratriathlons across the country, reached state championship
              podiums, and competed at nationals. Through Dare2tri, I&rsquo;ve learned from teammates, coaches, and
              mentors who keep challenging me to see what I can do next.
            </p>
            <p className="mt-5 text-lg md:text-xl leading-relaxed text-white/75">
              I&rsquo;ve put in the work to get this far, with people beside me along the way. Getting to Japan is
              another step where support can make a real difference.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The receipts                                                        */
/* ------------------------------------------------------------------ */

function Receipts() {
  return (
    <section className="px-5 md:px-10 py-24 md:py-36" aria-labelledby="receipts-title">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <h2 id="receipts-title" className="font-display text-[clamp(4rem,12vw,9rem)] leading-[0.85]">
            THE RECEIPTS<span style={{ color: THEME }}>.</span>
          </h2>
          <p className="mt-6 mb-14 md:mb-20 text-lg md:text-xl text-white/75 max-w-xl">
            Here&rsquo;s the planned budget for getting from the Bay Area to Tokyo and through race week:
          </p>
        </Reveal>
        <BoardingPass />
        <Reveal className="mt-14 md:mt-20 max-w-xl">
          <p className="text-lg leading-relaxed text-white/70">
            Traveling internationally with a prosthetic leg and racing equipment takes planning. Your donation will
            help cover the practical costs of making this race possible.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The ask: the page's one climax                                      */
/* ------------------------------------------------------------------ */

function Ask() {
  return (
    <section className="relative overflow-hidden px-5 py-28 md:py-44 text-center" aria-labelledby="ask-title">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vmin] aspect-square rounded-full blur-[110px] opacity-30"
        style={{ background: HINOMARU }}
      />
      <div className="relative max-w-3xl mx-auto">
        <h2 id="ask-title" className="font-display leading-[0.9] text-[clamp(3.6rem,15vw,11rem)] whitespace-nowrap" style={{ color: THEME }}>
          $20. $50. $100.
        </h2>
        <p className="mt-8 text-lg md:text-2xl leading-snug text-white/85">
          If you can give $20, $50, $100, or any amount that works for you, I&rsquo;d be grateful. If you can&rsquo;t
          donate, sharing this campaign with someone who might connect with my story is another way to help.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={GOFUNDME_DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 px-9 py-5 rounded-md font-mono text-sm font-bold tracking-[0.2em] uppercase text-black transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{ background: THEME, boxShadow: "0 0 50px color-mix(in srgb, var(--theme-color, #f97316) 45%, transparent)" }}
          >
            Donate to Tokyo
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            <span className="sr-only"> on GoFundMe (opens in a new tab)</span>
          </a>
          <ShareButton
            url={GOFUNDME_URL}
            title="One Leg. Two Stars. Patrick Wingert's road to the Tokyo Marathon"
            className="inline-flex items-center gap-3 px-7 py-5 rounded-md border border-white/25 font-mono text-xs tracking-[0.2em] uppercase text-white/85 hover:border-white/60 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          />
        </div>
        <p className="mt-5 font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">Donations are made on GoFundMe</p>
        <div className="h-px bg-white/10 my-14" />
        <p className="text-base md:text-lg leading-relaxed text-white/60 max-w-xl mx-auto">
          I&rsquo;ll share updates as travel is booked, along with training progress and a race recap, so you can
          follow the journey you&rsquo;re helping support.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Close, Dare2Tri, finale                                             */
/* ------------------------------------------------------------------ */

function Close() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-32" aria-label="Thank you">
      <Reveal className="max-w-3xl mx-auto">
        <p className="text-2xl md:text-[2.1rem] leading-[1.3] text-white/90">
          I&rsquo;ll bring the training, the determination, and everything Bhutan, Chicago and ParaTriathlon have
          taught me. Your support will help me bring that work to Tokyo.
        </p>
        <p className="mt-6 text-xl md:text-2xl text-white/65">Thank you for being part of the journey.</p>
        <p className="font-display text-6xl mt-8" style={{ color: THEME }}>Patrick</p>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
        >
          <Instagram className="w-4 h-4" aria-hidden="true" />
          Follow along @patwingit · {HASHTAG}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Reveal>
    </section>
  );
}

function Dare2Tri() {
  return (
    <section className="px-5 md:px-10 pb-24 md:pb-36" aria-labelledby="d2t-title">
      <div className="relative max-w-6xl mx-auto overflow-hidden rounded-2xl">
        <Image
          src="/email/long-beach/dare2tri-group.jpg"
          alt="Dare2Tri athletes and supporters celebrating together under a swim-finish arch"
          width={1120}
          height={676}
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="w-full h-[420px] md:h-auto object-cover grayscale opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 max-w-2xl">
          <h2 id="d2t-title" className="font-display text-4xl md:text-6xl leading-none">
            A SEPARATE WAY TO GIVE<span style={{ color: THEME }}>.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-white/80">
            This GoFundMe supports my personal travel and race expenses. You can also support adaptive sport programs
            through a separate gift directly to Dare2tri. Gifts through that link go to the organization.
          </p>
          <a
            href={DARE2TRI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 px-6 py-4 rounded-md border border-white/30 font-mono text-xs tracking-[0.2em] uppercase hover:border-white hover:bg-white/5 transition-colors"
          >
            Give to Dare2Tri <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Finale() {
  return (
    <footer className="px-5 md:px-10 pt-16 pb-10 border-t border-white/10">
      <p className="font-display text-center leading-[0.85] text-[clamp(3.5rem,13vw,11rem)]">
        LIFE IS HARD.
        <br />
        <span style={{ color: THEME }}>BE HARDER.</span>
      </p>
      <div className="max-w-7xl mx-auto mt-16 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-[0.2em] uppercase text-white/45">
        <Link href="/" className="hover:text-white transition-colors">Patrick Wingert</Link>
        <a href="mailto:patrick@patrickwingert.com" className="hover:text-white transition-colors">Get in touch</a>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

export default function TokyoCampaign() {
  return (
    <div className="relative bg-[#050505] text-white overflow-x-clip selection:bg-[#bc002d]/40">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] bg-noise opacity-[0.07] mix-blend-overlay" />
      <main>
        <Hero />
        <Chapters />
        <Chicago />
        <TheWork />
        <Receipts />
        <Ask />
        <Close />
        <Dare2Tri />
      </main>
      <Finale />
    </div>
  );
}
