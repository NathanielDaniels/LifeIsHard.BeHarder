/**
 * Generate dark-mode-proof email image assets.
 *
 * Email clients invert CSS background colors in dark mode but never invert
 * image pixels. Logos with white artwork on transparent backgrounds vanish
 * when a client renders the light theme; logos on CSS-colored cards vanish
 * when the card color flips. The only bulletproof option is to bake a white
 * plate into the image pixels themselves, using dark-artwork logo variants.
 *
 * Usage: node scripts/generate-email-assets.mjs
 * Output: public/email/*.png (referenced by emails/leons-triathlon-invite-email.tsx)
 */
import sharp from "sharp";
import { mkdirSync } from "fs";

const OUT_DIR = "public/email";
const WHITE = "#ffffff";
const PAD = 24;

// 2x retina output widths; the template renders them at half size.
const assets = [
  {
    src: "public/race-weekend/leons-americas-race-logo-original-black.png",
    out: "leons-race-logo.png",
    width: 880,
    trim: true,
  },
  {
    src: "public/sponsors/performance-wealth-partners-dark_transparent.png",
    out: "performance-wealth.png",
    width: 480,
    trim: true,
  },
  {
    src: "public/sponsors/CAF_logo_transparent.png",
    out: "caf.png",
    width: 280,
    trim: true,
  },
  {
    src: "public/sponsors/ATF_logo_email_dark_gray_transparent.png",
    out: "atf.png",
    width: 240,
    trim: true,
  },
  {
    src: "public/sponsors/Logo_Dare2Tri.png",
    out: "dare2tri.png",
    width: 320,
    trim: true,
  },
  {
    src: "public/sponsors/SEBCM_color_transparent.png",
    out: "sebcm.png",
    width: 320,
    trim: true,
  },
  {
    src: "public/sponsors/david-rotter-logo_orig_transparent.png",
    out: "david-rotter.png",
    width: 280,
    trim: true,
  },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const asset of assets) {
  let img = sharp(asset.src).flatten({ background: WHITE });
  if (asset.trim) {
    img = sharp(await img.trim({ threshold: 10 }).toBuffer());
  }
  const buf = await img
    .resize({ width: asset.width, fit: "inside", withoutEnlargement: true })
    .extend({
      top: PAD,
      bottom: PAD,
      left: PAD,
      right: PAD,
      background: WHITE,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const meta = await sharp(buf).metadata();
  await sharp(buf).toFile(`${OUT_DIR}/${asset.out}`);
  console.log(
    `${OUT_DIR}/${asset.out}  ${meta.width}x${meta.height}  (render at ${Math.round(meta.width / 2)}x${Math.round(meta.height / 2)})`,
  );
}
