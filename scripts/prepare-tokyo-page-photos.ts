import { resolve } from "path";
import sharp from "sharp";

/**
 * Source photos for the /tokyo campaign page, sized to 2x the largest slot
 * each one renders into (see the `sizes` props in app/tokyo/TokyoCampaign.tsx).
 * next/image resizes on request but never upscales, so an oversized source
 * just gets served at a bigger breakpoint than any screen needs.
 *
 * The raw pastes are not committed. Point TOKYO_SRC_DIR at the folder that
 * holds them (public/email/tokyo in the main checkout); the Chicago portrait
 * is read from public/email/chicago.
 *
 * Usage: TOKYO_SRC_DIR=... npx tsx scripts/prepare-tokyo-page-photos.ts
 */

const SRC_DIR = process.env.TOKYO_SRC_DIR ?? "public/email/tokyo";
const OUT_DIR = "public/tokyo";
/** Sources are re-encoded again by the image optimizer, so keep them clean. */
const QUALITY = 76;

type Job = { src: string; out: string; width: number; ratio?: number; position?: string; quality?: number };

const jobs: Job[] = [
  // 2020 chapter, 448px slot. The rug's fine pattern is costly to encode, hence the lower quality.
  { src: "Pasted 2026-09-26 at 5.45.24 PM.png", out: "floor.jpg", width: 800, ratio: 4 / 5, quality: 66 },
  // 2025 chapter, 700px slot.
  { src: "Pasted 2026-09-26 at 5.45.30 PM.png", out: "chicago-street.jpg", width: 1400 },
  // Film gate, up to 1320px wide; the source itself is only 1206 wide.
  { src: "Pasted 2026-09-26 at 5.45.38 PM.png", out: "road-stop.jpg", width: 1206 },
  // Aftermath triptych, 380px slots.
  { src: "Pasted 2026-09-26 at 5.45.44 PM.png", out: "wheelchair.jpg", width: 800, ratio: 4 / 5, position: "north" },
  { src: "Pasted 2026-09-26 at 5.45.51 PM.png", out: "medal.jpg", width: 800, ratio: 4 / 5 },
  // The work, 520px slot.
  { src: "../chicago/672319822_122107835595079494_528642610059233631_n.jpg", out: "portrait.jpg", width: 1040 },
];

async function run(job: Job) {
  const input = sharp(resolve(SRC_DIR, job.src)).rotate();
  const sized = job.ratio
    ? input.resize(job.width, Math.round(job.width / job.ratio), { fit: "cover", position: job.position ?? "centre" })
    : input.resize({ width: job.width, withoutEnlargement: true });
  const info = await sized
    .modulate({ saturation: 0.86 })
    .linear(1.07, -8)
    .jpeg({ quality: job.quality ?? QUALITY, mozjpeg: true, progressive: true })
    .toFile(resolve(OUT_DIR, job.out));
  console.log(`  ${OUT_DIR}/${job.out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}K`);
}

async function main() {
  for (const job of jobs) await run(job);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
