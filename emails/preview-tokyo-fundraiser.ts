import { render } from "@react-email/components";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import TokyoFundraiserEmail from "./tokyo-fundraiser-email";

/**
 * Render the Tokyo fundraiser email to standalone HTML with fonts and images
 * inlined, so it can be judged from disk before any asset is deployed.
 *
 * Usage: npx tsx emails/preview-tokyo-fundraiser.ts
 */
const imagePaths = [
  "email/header.jpeg",
  "email/dare2tri.png",
  "email/tokyo/sunrise-ecg.jpg",
  "email/tokyo/star-earned.png",
  "email/tokyo/star-next.png",
  "email/tokyo/star-open.png",
  "email/chicago/chi-finish-cine.jpg",
  "email/tokyo/floor-crutches.jpg",
  "email/tokyo/road-stop.jpg",
  "email/tokyo/after-wheelchair.jpg",
  "email/tokyo/after-medal.jpg",
  "email/tokyo/tokyo-marathon-2027-logo.jpg",
];

const FONT_PATH = "public/fonts/BebasNeue-Regular.woff2";
const OUT = "emails/tokyo-fundraiser-preview.html";

const mimeFor = (path: string) =>
  path.endsWith(".png") ? "image/png" : "image/jpeg";

function inlineAssets(html: string) {
  // A missing asset must fail loudly: a preview that quietly falls back to the
  // remote URL looks fine locally while the send would show a broken image.
  const missing = [...imagePaths.map((path) => `public/${path}`), FONT_PATH].filter(
    (path) => !existsSync(resolve(path))
  );
  if (missing.length > 0) {
    throw new Error(`Missing preview assets:\n  ${missing.join("\n  ")}`);
  }

  let out = html;
  for (const path of imagePaths) {
    out = out.replaceAll(
      `https://patrickwingert.com/${path}`,
      `data:${mimeFor(path)};base64,${readFileSync(resolve("public", path)).toString("base64")}`
    );
  }
  return out.replaceAll(
    "https://patrickwingert.com/fonts/BebasNeue-Regular.woff2",
    `data:font/woff2;base64,${readFileSync(resolve(FONT_PATH)).toString("base64")}`
  );
}

async function main() {
  const html = inlineAssets(
    await render(
      React.createElement(TokyoFundraiserEmail, { email: "patrick@example.com" })
    )
  );
  writeFileSync(OUT, html);
  console.log(`${OUT}  (${(html.length / 1024).toFixed(0)} KB)`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
