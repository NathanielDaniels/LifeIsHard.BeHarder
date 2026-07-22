/**
 * Optimize the Long Beach post-race photos for email delivery.
 *
 * Source photos are straight off a phone/camera (up to 4.5 MB). Email clients
 * download every image on open, so we ship the smallest file that still looks
 * sharp on a retina screen: 2x the CSS width the template renders at.
 *
 *   full-width cards render at 528px  -> 1056px wide
 *   the 2025/2026 diptych renders at 252px -> 504px wide, cropped to a shared 4:5
 *
 * Run:  node scripts/optimize-long-beach-recap-assets.mjs
 */
import sharp from "sharp";
import { copyFile, mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

// Camera originals live outside public/ on purpose: anything under public/ is
// publicly served and ships in every Vercel build. Only the optimized output
// belongs there.
const SRC = resolve("assets/source/long-beach/Post Race");
const REUSE = resolve("assets/source/long-beach");
const OUT = resolve("public/email/long-beach-recap");

// Max height keeps a tall portrait from eating three screens of the email.
const FULL = { width: 1056, height: 1400 };
const PAIR = { width: 504, height: 630 }; // 4:5

const jobs = [
  { from: `${SRC}/IMG_0956.jpeg`, to: "lb-run.jpg", ...FULL },
  { from: `${SRC}/IMG_0954.jpeg`, to: "lb-swim-exit.jpg", ...FULL },
  { from: `${SRC}/IMG_0963.jpeg`, to: "lb-group.jpg", ...FULL },
  { from: `${REUSE}/IMG_0645.jpeg`, to: "lb-closing.jpg", ...FULL },
  // Diptych halves are cropped to a shared ratio so the pair reads as one unit.
  // 2025 is an Instagram story screenshot: trim the burned-in caption band off
  // the bottom before cropping, otherwise it lands mid-sentence in the email.
  {
    from: `${SRC}/IMG_0964.jpeg`,
    to: "lb-melissa-2025.jpg",
    ...PAIR,
    crop: true,
    extract: { left: 0, top: 0, width: 1125, height: 1406 },
  },
  { from: `${SRC}/IMG_9207.jpeg`, to: "lb-melissa-2026.jpg", ...PAIR, crop: true },
  // Flat logo art: PNG keeps the edges crisp and is already tiny.
  { from: `${SRC}/IMG_0951.png`, to: "lb-nationals.png", width: 840, png: true },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}K`;

await mkdir(OUT, { recursive: true });

let totalBefore = 0;
let totalAfter = 0;

for (const job of jobs) {
  const before = (await stat(job.from)).size;

  let pipeline = sharp(job.from).rotate();
  if (job.extract) pipeline = pipeline.extract(job.extract);
  pipeline = pipeline.resize({
    width: job.width,
    height: job.height,
    fit: job.crop ? "cover" : "inside",
    position: "attention",
    withoutEnlargement: true,
  });

  pipeline = job.png
    ? pipeline.png({ compressionLevel: 9, palette: true })
    : pipeline.jpeg({ quality: 78, mozjpeg: true, chromaSubsampling: "4:4:4" });

  let { size: after } = await pipeline.toFile(resolve(OUT, job.to));

  // Already-optimized flat art (logos) can come out bigger than it went in;
  // re-encoding it is a loss, so keep the original bytes. Deliberately limited
  // to the PNG case: photo jobs are resized AND cropped, so falling back for
  // them would ship a multi-megabyte original and undo the caption-band crop.
  if (job.png && after >= before) {
    await copyFile(job.from, resolve(OUT, job.to));
    after = before;
  }

  totalBefore += before;
  totalAfter += after;
  console.log(
    `${job.to.padEnd(22)} ${kb(before).padStart(8)} -> ${kb(after).padStart(8)}`,
  );
}

console.log(
  `\nTOTAL${" ".repeat(18)} ${kb(totalBefore).padStart(8)} -> ${kb(totalAfter).padStart(8)}`,
);
