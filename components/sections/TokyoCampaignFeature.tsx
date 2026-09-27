"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SunriseScene from "@/components/tokyo/SunriseScene";
import SixStars from "@/components/tokyo/SixStars";
import {
  GOFUNDME_DONATE_URL,
  TOKYO_RACE_DATE_ISO,
  TOKYO_RACE_DATE_LABEL,
  daysToTokyo,
} from "@/lib/tokyo-campaign";

const THEME = "var(--theme-color, #f97316)";
const SCENE_FADE = "radial-gradient(ellipse 70% 80% at 50% 55%, #000 45%, transparent 100%)";

/** Homepage trailer for the Tokyo campaign: the poster, the tracker, the way in. */
export default function TokyoCampaignFeature() {
  const reduceMotion = useReducedMotion();
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysToTokyo()), []);

  const reveal = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, delay },
        };

  return (
    <section className="relative z-30 px-5 py-24 md:py-40" aria-labelledby="tokyo-feature-title">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative h-[340px] md:h-[500px]"
          style={{ maskImage: SCENE_FADE, WebkitMaskImage: SCENE_FADE }}
        >
          <SunriseScene horizon={68} sunSize="min(400px, 76vw)" runnerHeight={86} />
        </div>

        <div className="relative text-center -mt-10 md:-mt-16">
          <motion.div {...reveal(0)}>
            <p className="font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/60">
              Tokyo Marathon · <time dateTime={TOKYO_RACE_DATE_ISO}>{TOKYO_RACE_DATE_LABEL}</time>
            </p>
            <h2 id="tokyo-feature-title" className="font-display leading-[0.88] mt-4 text-[clamp(3.6rem,15vw,8rem)]">
              ONE LEG. <span className="whitespace-nowrap" style={{ color: THEME }}>TWO STARS.</span>
            </h2>
            <p className="mt-5 text-lg md:text-xl text-white/70">Tokyo World Major Marathon is next.</p>
          </motion.div>

          <motion.div className="max-w-lg mx-auto mt-12" {...reveal(0.15)}>
            <SixStars size="sm" />
          </motion.div>

          <motion.div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5" {...reveal(0.25)}>
            <Link
              href="/tokyo"
              className="group inline-flex items-center gap-4 min-h-[56px] px-7 rounded font-mono text-xs tracking-[0.2em] uppercase text-white border transition-[background-color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-color, #f97316) 55%, transparent)",
                background: "color-mix(in srgb, var(--theme-color, #f97316) 8%, transparent)",
              }}
            >
              The road to Tokyo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={GOFUNDME_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
            >
              Donate <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only"> on GoFundMe (opens in a new tab)</span>
            </a>
          </motion.div>

          <p className="mt-8 font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
            {days === null ? " " : `${days} days to the start line`}
          </p>
        </div>
      </div>
    </section>
  );
}
