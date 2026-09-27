import { mkdirSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

/**
 * Generate the graphic assets for the Tokyo fundraiser email.
 *
 * Everything is drawn at 2x its rendered size so it stays sharp on retina.
 * No text is baked into any image (PRODUCT.md: live HTML for all facts).
 *
 * Usage: npx tsx emails/utils/generate-tokyo-assets.ts
 */

const OUT = resolve("public/email/tokyo");

const INK = "#16130e";
const ORANGE = "#f97316";
// The red of the Hinomaru, Japan's national flag. The one Japanese motif we
// use, and it is the real thing, not an invented one.
const HINOMARU = "#bc002d";

/* The website hero as a still: Patrick running out of the rising sun, the
   heartbeat as the horizon, all of it mirrored below the line. Rendered
   620x320, drawn at 1240x640. `runner` is a greyscale PNG cutout. */
async function sunriseRunnerSvg() {
  const w = 1240;
  const h = 640;
  const horizon = 470;
  const cx = w / 2;
  const r = 330;
  const sunCy = horizon + r * 0.3; // 70% of the sun above the line
  const runnerH = 360;

  // Same cutout as the site hero, trimmed, greyscaled and lifted.
  const cutout = await sharp(resolve("public/tokyo/runner.webp"))
    .resize({ height: runnerH })
    .grayscale()
    .linear(1.15, -10)
    .png()
    .toBuffer();
  const { width: runnerW = 0 } = await sharp(cutout).metadata();
  const runner = `data:image/png;base64,${cutout.toString("base64")}`;
  const runnerX = cx - runnerW / 2;
  const runnerY = horizon - runnerH;

  // The site's beat, doubled: P wave, QRS spike, T wave on a flat line.
  // Phased so the spikes land either side of Patrick, never through him.
  const beatW = 240;
  const beat = "l72 0 l10 -7 l10 7 l14 0 l7 10 l7 -120 l7 150 l7 -40 l22 0 l14 -12 l17 12 l53 0";
  const phase = cx - beatW / 2 - 108;
  const beats = Math.ceil((w - phase) / beatW) + 2;
  const trace = `M${phase - beatW * 2} ${horizon} ${Array.from({ length: beats + 2 }, () => beat).join(" ")}`;

  const upper = `
    <circle cx="${cx}" cy="${sunCy}" r="${r}" fill="url(#sun)"/>
    <image href="${runner}" x="${runnerX}" y="${runnerY}" width="${runnerW}" height="${runnerH}"/>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="sun" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="#d4163f"/>
      <stop offset="0.6" stop-color="${HINOMARU}"/>
      <stop offset="1" stop-color="#8f0022"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${HINOMARU}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${HINOMARU}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edges" x1="0" x2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.18" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.82" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="fade-edges"><rect width="${w}" height="${h}" fill="url(#edges)"/></mask>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="reflection"><rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#water)"/></mask>
    <clipPath id="sky"><rect width="${w}" height="${horizon}"/></clipPath>
    <linearGradient id="seam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${INK}" stop-opacity="1"/>
      <stop offset="0.22" stop-color="${INK}" stop-opacity="0"/>
      <stop offset="0.78" stop-color="${INK}" stop-opacity="0"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="1"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="trace-glow" x="-5%" y="-50%" width="110%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>

  <rect width="${w}" height="${h}" fill="${INK}"/>
  <ellipse cx="${cx}" cy="${horizon - 60}" rx="${r * 1.7}" ry="${r * 1.25}" fill="url(#glow)"/>

  <g clip-path="url(#sky)">${upper}</g>

  <g mask="url(#reflection)">
    <g transform="translate(0 ${horizon * 2}) scale(1 -1)" clip-path="url(#sky)" filter="url(#soft)">${upper}</g>
  </g>

  <!-- Melt the top and bottom edges into the email's ink so there is no seam. -->
  <rect width="${w}" height="${h}" fill="url(#seam)"/>

  <g mask="url(#fade-edges)">
    <path d="${trace}" fill="none" stroke="${ORANGE}" stroke-width="10" stroke-opacity="0.35" filter="url(#trace-glow)"/>
    <path d="${trace}" fill="none" stroke="${ORANGE}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
  </g>
</svg>`;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const hero = await sharp(Buffer.from(await sunriseRunnerSvg()))
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(resolve(OUT, "sunrise-runner.jpg"));
  console.log(`  public/email/tokyo/sunrise-runner.jpg  ${Math.round(hero.size / 1024)}K`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
