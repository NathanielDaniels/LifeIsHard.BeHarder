"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MAJORS, type MajorState } from "@/lib/tokyo-campaign";
import { HINOMARU, HINOMARU_TEXT } from "./SunriseScene";

const STAR_PATH =
  "M12 1.5l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.27l-6.18 3.24L7 13.63 2 8.76l6.91-1z";

const STAR_STYLE: Record<MajorState, { fill: string; stroke: string }> = {
  earned: { fill: "var(--theme-color, #f97316)", stroke: "var(--theme-color, #f97316)" },
  next: { fill: "transparent", stroke: HINOMARU },
  open: { fill: "transparent", stroke: "rgb(255 255 255 / 22%)" },
};

/**
 * The Six Star tracker: the six original Majors in race-calendar order.
 * Chicago's star fills when the tracker scrolls into view; Tokyo's pulses.
 */
export default function SixStars({ size = "lg" }: { size?: "sm" | "lg" }) {
  const reduceMotion = useReducedMotion();
  const star = size === "lg" ? "w-10 h-10 md:w-14 md:h-14" : "w-7 h-7 md:w-8 md:h-8";
  const city =
    size === "lg"
      ? "text-[0.95rem] min-[400px]:text-lg md:text-2xl"
      : "text-[0.8rem] md:text-base";

  return (
    <ol className="grid grid-cols-6 gap-1 md:gap-4 w-full" aria-label="Abbott World Marathon Majors: Chicago earned, Tokyo next">
      {MAJORS.map((major, i) => {
        const style = STAR_STYLE[major.state];
        return (
          <li key={major.city} className="flex flex-col items-center text-center">
            <span className="relative">
              {major.state === "next" && !reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: `0 0 0 1px ${HINOMARU}` }}
                  animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <motion.svg
                viewBox="0 0 24 24"
                className={`${star} relative`}
                initial={major.state === "earned" && !reduceMotion ? { scale: 0.4, opacity: 0 } : false}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: 0.25 + i * 0.05, type: "spring", stiffness: 260, damping: 14 }}
                aria-hidden="true"
              >
                <path d={STAR_PATH} fill={style.fill} stroke={style.stroke} strokeWidth="1.2" strokeLinejoin="round" />
              </motion.svg>
            </span>
            <span
              className={`font-display ${city} mt-2 md:mt-3 leading-none tracking-wide uppercase ${
                major.state === "open" ? "text-white/35" : "text-white"
              }`}
            >
              {major.city}
            </span>
            <span
              className="font-mono text-[9px] md:text-[11px] tracking-[0.15em] uppercase mt-1.5 h-3 md:h-4"
              style={{ color: major.state === "next" ? HINOMARU_TEXT : "var(--theme-color, #f97316)" }}
            >
              {major.note ?? ""}
              {major.state === "earned" && <span className="sr-only"> finish, star earned</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
