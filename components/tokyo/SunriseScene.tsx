"use client";

import Image from "next/image";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import HeartbeatTrace from "./HeartbeatTrace";

/** The real red of Japan's flag. Used only for the sun and the Tokyo mark. */
export const HINOMARU = "#bc002d";
/** The flag red lifted for small text on near-black (4.5:1 contrast). */
export const HINOMARU_TEXT = "#ff5470";

const RISE_DURATION_S = 2.4;
const RISE_EASE = [0.16, 1, 0.3, 1] as const;

interface SunriseSceneProps {
  /** Horizon height as a percentage of the scene, measured from the top. */
  horizon?: number;
  /** Sun diameter as a CSS length. */
  sunSize: string;
  /** Runner height as a percentage of the space above the horizon. */
  runnerHeight?: number;
  /** Optional scroll-driven offsets from the parent (full-page hero only). */
  sunY?: MotionValue<number>;
  runnerY?: MotionValue<number>;
  priority?: boolean;
}

/**
 * The campaign's poster image, built live: the Hinomaru rising over a
 * heartbeat horizon, Patrick running out of it, and all of it reflected
 * below the line like water at dawn.
 */
export default function SunriseScene({
  horizon = 64,
  sunSize,
  runnerHeight = 84,
  sunY,
  runnerY,
  priority = false,
}: SunriseSceneProps) {
  const reduceMotion = useReducedMotion();
  const rise = reduceMotion
    ? { initial: false as const }
    : {
        initial: { y: "38%", opacity: 0.4 },
        whileInView: { y: "0%", opacity: 1 },
        viewport: { once: true },
        transition: { duration: RISE_DURATION_S, ease: RISE_EASE },
      };

  const sun = (
    <div
      className="absolute left-1/2 bottom-0 aspect-square rounded-full -translate-x-1/2 translate-y-[30%]"
      style={{
        width: sunSize,
        background: `radial-gradient(circle at 50% 45%, #d4163f 0%, ${HINOMARU} 55%, #8f0022 100%)`,
        boxShadow: `0 0 120px 10px ${HINOMARU}66, 0 0 300px 40px ${HINOMARU}22`,
      }}
    />
  );

  const runner = (
    <Image
      src="/tokyo/runner.webp"
      alt=""
      width={321}
      height={1090}
      priority={priority}
      sizes="(max-width: 700px) 40vw, 260px"
      className="h-full w-auto grayscale contrast-[1.15] brightness-[0.95]"
    />
  );

  const upper = (
    <>
      <motion.div className="absolute inset-0" style={{ y: sunY }}>
        <motion.div className="absolute inset-0" {...rise}>
          {sun}
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 flex items-end"
        // On narrow screens the sun shrinks with the viewport width; keep Patrick in scale with it.
        style={{ height: `min(${runnerHeight}%, calc(${sunSize} * 0.95))`, y: runnerY }}
      >
        {runner}
      </motion.div>
    </>
  );

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Above the horizon */}
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: `${horizon}%` }}>
        {upper}
      </div>

      {/* The reflection: the same scene mirrored about the horizon, fading into the water */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{
          top: `${horizon}%`,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 65%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 65%)",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 overflow-hidden -scale-y-100 blur-[5px] opacity-70"
          // Same height as the upper half; flipping about its centre puts its bottom edge on the horizon.
          style={{ height: `${(horizon / (100 - horizon)) * 100}%` }}
        >
          {upper}
        </div>
      </div>

      {/* The horizon line is a heartbeat */}
      <div className="absolute inset-x-0 h-20 -translate-y-1/2" style={{ top: `${horizon}%` }}>
        <HeartbeatTrace className="h-full w-full" />
      </div>
    </div>
  );
}
