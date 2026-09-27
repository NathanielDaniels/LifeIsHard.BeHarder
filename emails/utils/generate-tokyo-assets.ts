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

/* Sunrise over an ECG horizon: the heartbeat that runs through every PW email,
   crossing the rising sun. Rendered 536x170, drawn at 1072x340. */
function sunriseSvg() {
  const w = 1072;
  const h = 340;
  const horizon = 250;
  const cx = w / 2;
  const r = 150;

  // ECG trace: flat, one beat under the sun, flat again.
  const beat = [
    [0, horizon],
    [cx - 150, horizon],
    [cx - 118, horizon - 16],
    [cx - 96, horizon],
    [cx - 70, horizon],
    [cx - 52, horizon + 24],
    [cx - 26, horizon - 170],
    [cx + 4, horizon + 58],
    [cx + 26, horizon],
    [cx + 70, horizon],
    [cx + 104, horizon - 26],
    [cx + 140, horizon],
    [w, horizon],
  ]
    .map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`)
    .join(" ");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="${(horizon / h) * 100}%" r="60%">
      <stop offset="0%" stop-color="${HINOMARU}" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="${HINOMARU}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="above"><rect x="0" y="0" width="${w}" height="${horizon}"/></clipPath>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0"/>
      <stop offset="18%" stop-color="${ORANGE}" stop-opacity="0.9"/>
      <stop offset="82%" stop-color="${ORANGE}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </linearGradient>
    <!-- Fade the glow out at the top and bottom edges so the image meets
         the ink sections above and below with no visible seam. -->
    <linearGradient id="edges" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${INK}" stop-opacity="1"/>
      <stop offset="22%" stop-color="${INK}" stop-opacity="0"/>
      <stop offset="84%" stop-color="${INK}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${INK}"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect width="${w}" height="${h}" fill="url(#edges)"/>
  <circle cx="${cx}" cy="${horizon}" r="${r}" fill="${HINOMARU}" clip-path="url(#above)"/>
  <path d="${beat}" fill="none" stroke="${INK}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${beat}" fill="none" stroke="url(#fade)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`;
}

/* Five-point star path centred in a square of side `s`. */
function starPath(s: number) {
  const cx = s / 2;
  const cy = s / 2 + s * 0.03;
  const outer = s * 0.46;
  const inner = outer * 0.42;
  const pts: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

function starSvg(kind: "earned" | "next" | "open") {
  const s = 88; // renders at 44px
  const d = starPath(s);
  const fill = kind === "earned" ? ORANGE : "none";
  const stroke =
    kind === "earned" ? ORANGE : kind === "next" ? ORANGE : "#4a443a";
  const dash = kind === "next" ? ' stroke-dasharray="7 6"' : "";
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="${INK}"/>
  <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"${dash}/>
</svg>`;
}

async function png(svg: string, file: string) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(resolve(OUT, file));
  console.log(`  public/email/tokyo/${file}`);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  await sharp(Buffer.from(sunriseSvg()))
    .jpeg({ quality: 86 })
    .toFile(resolve(OUT, "sunrise-ecg.jpg"));
  console.log("  public/email/tokyo/sunrise-ecg.jpg");
  await png(starSvg("earned"), "star-earned.png");
  await png(starSvg("next"), "star-next.png");
  await png(starSvg("open"), "star-open.png");
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
