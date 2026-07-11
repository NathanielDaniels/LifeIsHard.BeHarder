import { render } from "@react-email/components";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import LongBeachEmail from "./long-beach-email";

const SITE = "https://patrickwingert.com";

// Remote URL path -> local file under public/. Real files are inlined as
// data URIs so the preview renders standalone. Any of Patrick's race photos
// that haven't been dropped in yet render as a labeled placeholder instead,
// so the layout + copy are fully reviewable before the images arrive.
const images: { path: string; label: string }[] = [
  // Sponsor logos (already in the repo)
  { path: "email/performance-wealth.png", label: "PERFORMANCE WEALTH" },
  { path: "email/caf.png", label: "CAF" },
  { path: "email/atf.png", label: "ATF" },
  { path: "email/dare2tri.png", label: "DARE2TRI" },
  { path: "email/sebcm.png", label: "SO EVERY BODY CAN MOVE" },
  { path: "email/david-rotter.png", label: "DAVID ROTTER" },
  // Patrick's Long Beach photos (drop into public/email/long-beach/)
  { path: "email/long-beach/long-beach-hero.jpg", label: "HERO · PATRICK AT LONG BEACH" },
  { path: "email/long-beach/caf-cycling-badge.png", label: "BADGE · CAF NORCAL CYCLING CLUB" },
  { path: "email/long-beach/dare2tri-group.jpg", label: "PHOTO · DARE2TRI GROUP AT SWIM FINISH" },
  { path: "email/long-beach/funding-forward-motion.png", label: "BANNER · FUNDING FORWARD MOTION" },
  { path: "email/long-beach/dare2tri-closing.jpg", label: "PHOTO · PATRICK (ZOOT PROFILE)" },
];

function mimeFor(path: string): string {
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".webp")) return "image/webp";
  return "image/png";
}

function placeholder(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
  <rect width="600" height="360" fill="#16130e"/>
  <rect x="8" y="8" width="584" height="344" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="300" y="172" fill="#f97316" font-family="monospace" font-size="15" font-weight="700" letter-spacing="2" text-anchor="middle">${label}</text>
  <text x="300" y="200" fill="#857f74" font-family="monospace" font-size="11" letter-spacing="2" text-anchor="middle">PLACEHOLDER — DROP REAL PHOTO IN public/</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function inlineImages(html: string): string {
  let out = html;
  for (const { path, label } of images) {
    const url = `${SITE}/${path}`;
    const local = resolve("public", path);
    const replacement = existsSync(local)
      ? `data:${mimeFor(path)};base64,${readFileSync(local).toString("base64")}`
      : placeholder(label);
    out = out.replaceAll(url, replacement);
  }
  return out;
}

async function main() {
  const html = inlineImages(
    await render(
      React.createElement(LongBeachEmail, { email: "patrick@example.com" }),
    ),
  );
  writeFileSync("emails/long-beach-preview.html", html);
  console.log("Preview saved to emails/long-beach-preview.html");
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
