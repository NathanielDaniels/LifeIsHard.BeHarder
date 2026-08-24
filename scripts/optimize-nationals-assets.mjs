/**
 * Optimize the Nationals pre-race photos for email delivery.
 *
 * Drop Patrick's originals into assets/source/nationals/ with these names:
 *
 *   hero-start.jpg    — Pleasant Prairie start-gate profile shot (hero #1)
 *   caf-jersey.jpg    — orange CAF jersey photo, sitting on the fence
 *   keri-melissa.jpg  — Patrick with Keri and Melissa on the balcony
 *   closing-run.jpg   — Long Beach marina run shot (hero #2)
 *
 * (.jpeg / .png also accepted — the script tries each extension.)
 *
 * Same sizing rule as the Long Beach recap: ship 2x the CSS width the template
 * renders at, capped in height so tall portraits don't eat the email.
 *
 * Run:  node scripts/optimize-nationals-assets.mjs
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Camera originals live outside public/ on purpose: anything under public/ is
// publicly served and ships in every Vercel build. Only optimized output
// belongs there.
const SRC = resolve("assets/source/nationals");
const OUT = resolve("public/email/nationals");

const FULL = { width: 1056, height: 1400 };

const jobs = [
  // hero-start (Pleasant Prairie profile) was cut from the email at Patrick's
  // request; the Long Beach closing-run shot is the poster image instead.
  { from: "caf-jersey", to: "nat-caf-jersey.jpg", ...FULL },
  { from: "keri-melissa", to: "nat-keri-melissa.jpg", ...FULL },
  { from: "closing-run", to: "nat-closing.jpg", ...FULL },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}K`;

function findSource(base) {
  for (const ext of ["jpg", "jpeg", "png", "heic", "webp"]) {
    const p = `${SRC}/${base}.${ext}`;
    if (existsSync(p)) return p;
  }
  return null;
}

await mkdir(OUT, { recursive: true });

let missing = 0;
for (const job of jobs) {
  const src = findSource(job.from);
  if (!src) {
    console.log(`SKIP  ${job.to}  (no ${job.from}.* in assets/source/nationals/)`);
    missing += 1;
    continue;
  }

  const before = (await stat(src)).size;
  const out = `${OUT}/${job.to}`;

  await sharp(src)
    .rotate()
    .resize({
      width: job.width,
      height: job.height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);

  const after = (await stat(out)).size;
  console.log(`OK    ${job.to}  ${kb(before)} -> ${kb(after)}`);
}

if (missing) {
  console.log(`\n${missing} photo(s) still missing — drop them in and re-run.`);
}
