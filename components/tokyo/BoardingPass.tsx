"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plane } from "lucide-react";
import {
  FUNDRAISING_GOAL,
  HASHTAG,
  RECEIPTS,
  usd,
} from "@/lib/tokyo-campaign";
import { HINOMARU } from "./SunriseScene";

const PAPER = "#f1efe8";
const INK = "#16130e";
const MUTED = "#6b6458";

/** Deterministic bar widths so the decorative barcode is stable across renders. */
const BARCODE = Array.from({ length: 46 }, (_, i) => ((i * 7919) % 5) + 1);

function Field({ label, value, align = "left" }: { label: string; value: string; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <div className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>{label}</div>
      <div className="font-display text-xl md:text-2xl leading-none mt-1 tracking-wide">{value}</div>
    </div>
  );
}

/** Notches punched where the stub tears off. */
function Notch({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute w-7 h-7 rounded-full bg-[#050505] ${className}`} />;
}

/**
 * Patrick's budget, printed as a boarding pass to the start line.
 * Lines print in one by one; the pass straightens as it lands.
 */
export default function BoardingPass() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className="relative mx-auto max-w-5xl shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
      style={{ color: INK }}
      initial={reduceMotion ? false : { rotate: -2.5, y: 60, opacity: 0 }}
      whileInView={{ rotate: -0.6, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`Tokyo budget: ${RECEIPTS.map((r) => `${r.label} ${usd(r.amount)}`).join(", ")}. Fundraising goal ${usd(FUNDRAISING_GOAL)}.`}
    >
      <div className="relative grid md:grid-cols-[1fr_300px] rounded-xl overflow-hidden" style={{ background: PAPER }}>
        {/* Main body */}
        <div className="relative">
          <div className="flex items-center justify-between px-6 md:px-8 py-3" style={{ background: INK, color: PAPER }}>
            <span className="font-display text-lg tracking-[0.25em] whitespace-nowrap">BOARDING PASS</span>
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.3em] uppercase opacity-70">Tokyo Marathon 2027</span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-4 px-6 md:px-8 pt-6 pb-5 border-b-2" style={{ borderColor: INK }}>
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>From</div>
              <div className="font-display text-4xl md:text-6xl leading-[0.9] mt-1">BAY AREA</div>
            </div>
            <Plane className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 rotate-45" style={{ color: "var(--theme-color, #f97316)" }} aria-hidden="true" />
            <div className="text-right">
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>To</div>
              <div className="font-display text-4xl md:text-6xl leading-[0.9] mt-1" style={{ color: HINOMARU }}>TOKYO</div>
            </div>
          </div>

          <ul className="px-6 md:px-8 py-4">
            {RECEIPTS.map((line, i) => (
              <motion.li
                key={line.label}
                className="flex items-baseline gap-3 py-2.5"
                initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.09, duration: 0.4 }}
              >
                <span className="text-[15px] md:text-base">{line.label}</span>
                <span aria-hidden="true" className="flex-1 border-b border-dotted translate-y-[-4px]" style={{ borderColor: `${INK}40` }} />
                <span className="font-display text-2xl leading-none tracking-wide">{usd(line.amount)}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Stub */}
        <div className="relative border-t-2 border-dashed md:border-t-0 md:border-l-2 px-6 md:px-7 py-6 flex flex-col gap-5" style={{ borderColor: `${INK}55` }}>
          <Notch className="hidden md:block -top-3.5 -left-3.5" />
          <Notch className="hidden md:block -bottom-3.5 -left-3.5" />
          <Notch className="md:hidden -top-3.5 -left-3.5" />
          <Notch className="md:hidden -top-3.5 -right-3.5" />

          <Field label="Passenger" value="PATRICK WINGERT" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Race day" value="07 MAR 2027" />
            <Field label="Distance" value="42.195 KM" align="right" />
          </div>

          <div className="mt-auto">
            <div className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>Fundraising goal</div>
            <div className="font-display text-6xl md:text-7xl leading-[0.85] mt-2" style={{ color: "#c2410c" }}>
              {usd(FUNDRAISING_GOAL)}
            </div>
          </div>

          <div aria-hidden="true">
            <div className="flex items-stretch h-12 gap-[2px]">
              {BARCODE.map((w, i) => (
                <span key={i} style={{ width: w, background: i % 3 === 1 ? "transparent" : INK }} />
              ))}
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] mt-2" style={{ color: MUTED }}>
              {HASHTAG.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </motion.figure>
  );
}
