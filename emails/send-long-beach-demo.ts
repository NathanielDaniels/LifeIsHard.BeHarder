import { render } from "@react-email/components";
import { existsSync, readFileSync } from "fs";
import React from "react";
import { Resend } from "resend";
import sharp from "sharp";
import LongBeachEmail, { longBeachSubject } from "./long-beach-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a demo of the Long Beach race-week email with images embedded as inline
 * CID attachments, so it renders correctly before public/ is deployed.
 *
 * Sponsor logos are real files from public/email/. Patrick's 5 race photos
 * aren't in the repo yet, so each renders as a rasterized labeled placeholder
 * (Gmail strips SVG, so placeholders must be PNG). Drop the real files into
 * public/email/long-beach/ and they replace the placeholders here.
 *
 * Usage: npx tsx emails/send-long-beach-demo.ts <email>
 * Reads RESEND_API_KEY from the environment (.env.local).
 */

const to = process.argv[2];

if (!to) {
  console.error("Usage: npx tsx emails/send-long-beach-demo.ts <email>");
  process.exit(1);
}

const images: { url: string; cid: string; label?: string }[] = [
  // Sponsor logos (real files in the repo)
  { url: "email/performance-wealth.png", cid: "pw" },
  { url: "email/caf.png", cid: "caf" },
  { url: "email/atf.png", cid: "atf" },
  { url: "email/dare2tri.png", cid: "d2t" },
  { url: "email/sebcm.png", cid: "sebcm" },
  { url: "email/david-rotter.png", cid: "rotter" },
  // PW header banner
  { url: "email/header.jpeg", cid: "lb-header", label: "PW HEADER BANNER" },
  // Patrick's Long Beach photos (placeholder until dropped into public/)
  { url: "email/long-beach/long-beach-hero.jpg", cid: "lb-hero", label: "HERO — PATRICK AT LONG BEACH" },
  { url: "email/long-beach/caf-cycling-badge.png", cid: "lb-badge", label: "BADGE — CAF NORCAL CYCLING CLUB" },
  { url: "email/long-beach/dare2tri-group.jpg", cid: "lb-group", label: "PHOTO — DARE2TRI GROUP AT SWIM FINISH" },
  { url: "email/long-beach/funding-forward-motion.png", cid: "lb-ffm", label: "BANNER — FUNDING FORWARD MOTION" },
  { url: "email/long-beach/dare2tri-closing.jpg", cid: "lb-close", label: "PHOTO — PATRICK (ZOOT PROFILE)" },
];

function placeholderSvg(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="700" viewBox="0 0 1120 700">
    <rect width="1120" height="700" fill="#16130e"/>
    <rect x="16" y="16" width="1088" height="668" fill="none" stroke="#f97316" stroke-width="4" stroke-dasharray="16 12"/>
    <text x="560" y="330" fill="#f97316" font-family="sans-serif" font-size="34" font-weight="700" text-anchor="middle">${label}</text>
    <text x="560" y="392" fill="#857f74" font-family="sans-serif" font-size="22" text-anchor="middle">PLACEHOLDER — real photo goes here</text>
  </svg>`;
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set.");
    process.exit(1);
  }

  let html = injectBgcolor(
    await render(React.createElement(LongBeachEmail, { email: to })),
  );

  const attachments = [];
  for (const img of images) {
    const localPath = `public/${img.url}`;
    let content: Buffer;
    let filename: string;

    if (existsSync(localPath)) {
      content = readFileSync(localPath);
      filename = img.url.replace(/\//g, "-");
    } else {
      // No real file yet — rasterize a labeled placeholder to PNG.
      content = await sharp(Buffer.from(placeholderSvg(img.label ?? "PHOTO")))
        .png()
        .toBuffer();
      filename = img.url.replace(/\//g, "-").replace(/\.jpe?g$/, ".png");
    }

    html = html.replaceAll(
      `https://patrickwingert.com/${img.url}`,
      `cid:${img.cid}`,
    );
    attachments.push({ filename, content, contentId: img.cid });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: `Patrick Wingert <${
      process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com"
    }>`,
    to,
    subject: `[DEMO] ${longBeachSubject}`,
    html,
    attachments,
  });

  if (error) {
    console.error("Send failed:", error);
    process.exit(1);
  }

  console.log(`Demo sent to ${to}. ID: ${data?.id}`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
