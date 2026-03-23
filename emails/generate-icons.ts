import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";

const icons = ["instagram", "dare2tri", "linktree", "strava"];
const size = 72; // 2x for retina (displays at 36px)

async function main() {
  for (const name of icons) {
    const svg = readFileSync(`public/icons/${name}.svg`);
    const png = await sharp(svg)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    writeFileSync(`public/icons/${name}.png`, png);
    console.log(`Generated: public/icons/${name}.png`);
  }
}

main().catch((error) => {
  console.error("Icon generation failed:", error);
  process.exit(1);
});
