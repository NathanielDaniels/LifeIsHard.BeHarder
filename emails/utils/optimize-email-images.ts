import { readdirSync, statSync } from "fs";
import { basename, extname, join, resolve } from "path";
import sharp from "sharp";

/**
 * Downscale + recompress images for email delivery.
 *
 * Email images should be served at 2x the widest slot they render into so they
 * stay sharp on retina, and no wider — a 4000px phone photo costs ~2 MB and
 * every recipient downloads it. Our widest card slot is 528px, so 1056px is
 * the target. JPEG (not WebP) because Outlook desktop still cannot decode
 * WebP, and a broken hero image is worse than a larger one.
 *
 * Usage:
 *   npx tsx emails/utils/optimize-email-images.ts <dir-or-file> [...]
 *   npx tsx emails/utils/optimize-email-images.ts public/email/chicago --width 1056
 *
 * Writes `<name>.opt.jpg` next to each source so the original is never lost.
 */

const TARGET_WIDTH = 1056;
const QUALITY = 78;

function parseArgs(argv: string[]) {
  const targets: string[] = [];
  let width = TARGET_WIDTH;
  let quality = QUALITY;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--width") {
      width = Number(argv[(i += 1)]);
    } else if (arg === "--quality") {
      quality = Number(argv[(i += 1)]);
    } else {
      targets.push(arg);
    }
  }

  return { targets, width, quality };
}

function collectImages(target: string): string[] {
  const full = resolve(target);
  const stats = statSync(full);

  if (stats.isFile()) return [full];

  return readdirSync(full)
    .filter((name) => /\.(jpe?g|png)$/i.test(name))
    .filter((name) => !name.includes(".opt."))
    .map((name) => join(full, name));
}

function formatKb(bytes: number) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function main() {
  const { targets, width, quality } = parseArgs(process.argv.slice(2));

  if (targets.length === 0) {
    console.error(
      "Usage: npx tsx emails/utils/optimize-email-images.ts <dir-or-file> [--width 1056] [--quality 78]"
    );
    process.exit(1);
  }

  const files = targets.flatMap(collectImages);
  if (files.length === 0) {
    console.error("No .jpg/.png files found.");
    process.exit(1);
  }

  let before = 0;
  let after = 0;

  for (const file of files) {
    const out = join(
      resolve(file, ".."),
      `${basename(file, extname(file))}.opt.jpg`
    );

    const meta = await sharp(file).metadata();
    const info = await sharp(file)
      .rotate() // honour EXIF orientation before we strip it
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, progressive: true, mozjpeg: true })
      .toFile(out);

    const sourceBytes = statSync(file).size;
    before += sourceBytes;
    after += info.size;

    console.log(
      `${basename(file)}  ${meta.width}x${meta.height} ${formatKb(
        sourceBytes
      )}  ->  ${basename(out)}  ${info.width}x${info.height} ${formatKb(
        info.size
      )}`
    );
  }

  const saved = ((1 - after / before) * 100).toFixed(0);
  console.log(
    `\nTotal: ${formatKb(before)} -> ${formatKb(after)}  (${saved}% smaller)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
