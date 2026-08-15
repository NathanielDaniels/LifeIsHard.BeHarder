/**
 * Optimize the Nationals race-report photos for email delivery.
 *
 * Patrick's originals live in assets/source/nationals-recap/ under these names:
 *
 *   pre-race.jpg    — wetsuit portrait on the dock before the start (poster)
 *   swim.jpg        — the open-water shot from the pier (mid-email gut punch)
 *   water-exit.jpg  — helped out of the water at pre-transition (community)
 *   bike.jpg        — aero bars on the bike course (ONE MORE poster)
 *
 * (.jpeg / .png / .heic / .webp also accepted — the script tries each.)
 *
 * Same sizing rule as the Long Beach recap and the Nationals pre-race send:
 * ship 2x the CSS width the template renders at, capped in height so these
 * tall 3:4 portraits don't eat the whole email.
 *
 * Run:  node scripts/optimize-nationals-recap-assets.mjs
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// Camera originals live outside public/ on purpose: anything under public/ is
// publicly served and ships in every Vercel build. Only optimized output
// belongs there.
const SRC = resolve("assets/source/nationals-recap");
const OUT = resolve("public/email/nationals-recap");

// Poster photos render edge-to-edge in a 560px card; inline photo cards render
// at 528px. Height caps keep a 3:4 portrait from running past ~750 CSS px tall.
const POSTER = { width: 1120, height: 1400 };
const FULL = { width: 1056, height: 1400 };

const jobs = [
  { from: "pre-race", to: "nr-pre-race.jpg", ...POSTER },
  // The swim frame is squared up before resizing. Full-frame it renders 528x704
  // of mostly open water with Patrick tiny in it, which reads as a broken image
  // at email size. A 1:1 crop around him keeps the water on all four sides (the
  // isolation is the whole point of the shot) while making the subject legible,
  // and the square shape sets it apart from the three portraits.
  {
    from: "swim",
    to: "nr-swim.jpg",
    ...FULL,
    crop: { aspect: 1, focusX: 0.46, focusY: 0.48 },
  },
  { from: "water-exit", to: "nr-water-exit.jpg", ...FULL },
  { from: "bike", to: "nr-bike.jpg", ...POSTER },
];

/**
 * Crop to `aspect` (width / height) around a fractional focus point, clamped so
 * the window always stays inside the frame. Runs on an already-rotated buffer
 * so EXIF orientation can't flip the coordinates out from under it.
 */
function cropRect({ width: W, height: H }, { aspect, focusX = 0.5, focusY = 0.5 }) {
  let w = W;
  let h = Math.round(W / aspect);
  if (h > H) {
    h = H;
    w = Math.round(H * aspect);
  }
  return {
    left: Math.round(Math.max(0, Math.min(W - w, W * focusX - w / 2))),
    top: Math.round(Math.max(0, Math.min(H - h, H * focusY - h / 2))),
    width: w,
    height: h,
  };
}

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
    console.log(
      `SKIP  ${job.to}  (no ${job.from}.* in assets/source/nationals-recap/)`,
    );
    missing += 1;
    continue;
  }

  const before = (await stat(src)).size;
  const out = `${OUT}/${job.to}`;

  // Bake EXIF orientation in first so any crop below works in display space.
  const upright = sharp(await sharp(src).rotate().toBuffer());

  if (job.crop) {
    upright.extract(cropRect(await upright.metadata(), job.crop));
  }

  await upright
    .resize({
      width: job.width,
      height: job.height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);

  const after = (await stat(out)).size;
  const note = job.crop ? `  (cropped ${job.crop.aspect}:1)` : "";
  console.log(`OK    ${job.to}  ${kb(before)} -> ${kb(after)}${note}`);
}

if (missing) {
  console.log(`\n${missing} photo(s) still missing — drop them in and re-run.`);
}
