import { render } from "@react-email/components";
import { readFileSync } from "fs";
import React from "react";
import { Resend } from "resend";
import sharp from "sharp";
import LeonsTriathlonInviteEmail, {
  leonsTriathlonInviteSubject,
} from "./leons-triathlon-invite-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a demo of the rebuilt invite with images embedded as inline CID
 * attachments, so it renders correctly before public/email/ is deployed.
 * The real broadcast (send-leons-triathlon-broadcast.ts) uses hosted URLs.
 *
 * Usage: npx tsx emails/send-leons-triathlon-demo.ts <email>
 * Reads RESEND_API_KEY from the environment (.env.local).
 */

const to = process.argv[2];

if (!to) {
  console.error("Usage: npx tsx emails/send-leons-triathlon-demo.ts <email>");
  process.exit(1);
}

// Remote path -> local file. The race-suite PNG is 1.1MB, so it gets
// recompressed to JPEG before attaching.
const images: { url: string; file: string; cid: string; compress?: boolean }[] =
  [
    { url: "email/leons-race-logo.png", file: "public/email/leons-race-logo.png", cid: "leons-logo" },
    { url: "email/performance-wealth.png", file: "public/email/performance-wealth.png", cid: "pw" },
    { url: "email/caf.png", file: "public/email/caf.png", cid: "caf" },
    { url: "email/atf.png", file: "public/email/atf.png", cid: "atf" },
    { url: "email/dare2tri.png", file: "public/email/dare2tri.png", cid: "d2t" },
    { url: "email/sebcm.png", file: "public/email/sebcm.png", cid: "sebcm" },
    { url: "email/david-rotter.png", file: "public/email/david-rotter.png", cid: "rotter" },
    { url: "pat_new_bike.jpg", file: "public/pat_new_bike.jpg", cid: "bike" },
    { url: "pat_race_suite.png", file: "public/pat_race_suite.png", cid: "kit", compress: true },
  ];

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set.");
    process.exit(1);
  }

  let html = injectBgcolor(
    await render(React.createElement(LeonsTriathlonInviteEmail, { email: to })),
  );

  const attachments = [];
  for (const img of images) {
    const content = img.compress
      ? await sharp(img.file)
          .resize({ width: 1040, withoutEnlargement: true })
          .flatten({ background: "#000000" })
          .jpeg({ quality: 80 })
          .toBuffer()
      : readFileSync(img.file);
    const filename = img.compress
      ? img.url.replace(/\.png$/, ".jpg").replace(/\//g, "-")
      : img.url.replace(/\//g, "-");

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
    subject: `[DEMO] ${leonsTriathlonInviteSubject}`,
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
