import { resolve } from "path";
import sharp from "sharp";

/**
 * Crop, grade and compress the Tokyo email photos from the raw pastes in
 * public/email/tokyo/, and slim the official Tokyo Marathon 2027 logo.
 * Photos are about 1.5 to 2x the slot they render into: sharp on phones,
 * light enough to load fast on cellular.
 *
 * Grade: slightly lifted contrast and pulled-back saturation so phone shots
 * sit with the cinematic -cine images already used in the Chicago emails.
 *
 * The raw pastes are not committed (1 to 8 MB each). Set TOKYO_SRC_DIR to
 * read them from another checkout; output always lands in public/email/tokyo.
 *
 * Usage: npx tsx emails/utils/prepare-tokyo-photos.ts
 */

const OUT_DIR = "public/email/tokyo";
const SRC_DIR = process.env.TOKYO_SRC_DIR ?? OUT_DIR;

/** mozjpeg quality for photos. Measured: about 20% lighter than 80 with no visible loss. */
const PHOTO_QUALITY = 70;

type Job = {
  src: string;
  out: string;
  width: number;
  /** width / height of the final crop; omit to keep the source ratio */
  ratio?: number;
  /** JPEG quality; busy textures need less */
  quality?: number;
  /** sharp gravity for the crop */
  position?: string;
};

const jobs: Job[] = [
  // Crutches, liner and the Chicago medal on the floor. Story inset, 536 slot.
  // The rug's fine pattern is expensive to encode, so 1.5x and a lower quality.
  { src: "Pasted 2026-09-26 at 5.45.24 PM.png", out: "floor-crutches.jpg", width: 800, quality: 62, ratio: 1, position: "centre" },
  // On the road, blade off, mid-race. Full bleed, 620 slot (source is 1206 wide).
  { src: "Pasted 2026-09-26 at 5.45.38 PM.png", out: "road-stop.jpg", width: 1206 },
  // Wheelchair after the finish, medal in his teeth. Half of a 2-up, 3:4.
  { src: "Pasted 2026-09-26 at 5.45.44 PM.png", out: "after-wheelchair.jpg", width: 560, ratio: 3 / 4, position: "north" },
  // The medal, held up. Other half of the 2-up.
  { src: "Pasted 2026-09-26 at 5.45.51 PM.png", out: "after-medal.jpg", width: 560, ratio: 3 / 4, position: "centre" },
];

/** Official logo, shown 220 wide on the white boarding pass. */
const LOGO = { src: "Pasted 2026-09-27 at 3.08.46 PM.png", out: "tokyo-marathon-2027-logo.jpg", width: 440 };

async function photo(job: Job) {
  const input = sharp(resolve(SRC_DIR, job.src)).rotate();
  const pipeline = job.ratio
    ? input.resize(job.width, Math.round(job.width / job.ratio), {
        fit: "cover",
        position: job.position ?? "centre",
      })
    : input.resize({ width: job.width, withoutEnlargement: true });

  const info = await pipeline
    .modulate({ saturation: 0.88 })
    .linear(1.06, -6)
    .jpeg({ quality: job.quality ?? PHOTO_QUALITY, mozjpeg: true, progressive: true })
    .toFile(resolve(OUT_DIR, job.out));
  console.log(`  ${OUT_DIR}/${job.out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}K`);
}

async function logo() {
  // Trim the screenshot's white margin and keep a thin even border so the mark
  // doesn't touch the edge of its slot. It sits on the white boarding pass, so
  // no transparency is needed: a 4:4:4 JPEG keeps every line colour at half
  // the weight of a 256-colour PNG (measured 21K vs 40K).
  const trimmed = await sharp(resolve(SRC_DIR, LOGO.src)).trim({ background: "#ffffff", threshold: 12 }).toBuffer();
  const info = await sharp(trimmed)
    .resize({ width: LOGO.width - 16, withoutEnlargement: false })
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(resolve(OUT_DIR, LOGO.out));
  console.log(`  ${OUT_DIR}/${LOGO.out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}K`);
}

async function main() {
  for (const job of jobs) await photo(job);
  await logo();
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
