import { render } from "@react-email/components";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import ChicagoRaceWeek from "./chicago-v1-fifth-star";

/**
 * Render the Chicago race-week email to standalone HTML with fonts and images
 * inlined, so it can be opened from disk and judged accurately (Bebas Neue is
 * the personality — a preview that silently falls back to Arial is not a
 * preview of this design).
 *
 * Usage: npx tsx emails/preview-chicago.ts
 */
const imagePaths = [
  "email/performance-wealth.png",
  "email/caf.png",
  "email/atf.png",
  "email/dare2tri.png",
  "email/sebcm.png",
  "email/david-rotter.png",
  "email/chicago/hero-glow.jpg",
  "email/chicago/stars-four.png",
  "email/chicago/star-orange.png",
  "email/chicago/star-red.png",
  "email/chicago/ecg-strip.png",
  "email/chicago/chi-portrait-cine.jpg",
  "email/chicago/map-venue.jpg",
  "email/chicago/map-transition.jpg",
  "email/chicago/strides-qr.jpg",
  "email/chicago/athletic-brewing-white.png",
];

const FONT_PATH = "public/fonts/BebasNeue-Regular.woff2";
const OUT = "emails/chicago-preview.html";

function mimeFor(path: string) {
  return path.endsWith(".png") ? "image/png" : "image/jpeg";
}

function inlineAssets(html: string) {
  let out = html;

  for (const path of imagePaths) {
    const file = resolve("public", path);
    if (!existsSync(file)) {
      console.warn(`  missing image, left remote: public/${path}`);
      continue;
    }
    const base64 = readFileSync(file).toString("base64");
    out = out.replaceAll(
      `https://patrickwingert.com/${path}`,
      `data:${mimeFor(path)};base64,${base64}`
    );
  }

  const fontFile = resolve(FONT_PATH);
  if (existsSync(fontFile)) {
    out = out.replaceAll(
      "https://patrickwingert.com/fonts/BebasNeue-Regular.woff2",
      `data:font/woff2;base64,${readFileSync(fontFile).toString("base64")}`
    );
  } else {
    console.warn(`  missing font: ${FONT_PATH} — preview will fall back`);
  }

  return out;
}

async function main() {
  const html = inlineAssets(
    await render(
      React.createElement(ChicagoRaceWeek, { email: "patrick@example.com" })
    )
  );
  writeFileSync(OUT, html);
  console.log(`${OUT}  (${(html.length / 1024).toFixed(0)} KB)`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
