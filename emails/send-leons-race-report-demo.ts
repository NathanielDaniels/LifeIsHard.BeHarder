import { render } from "@react-email/components";
import { readFileSync } from "fs";
import React from "react";
import { Resend } from "resend";
import LeonsRaceReportEmail, {
  leonsRaceReportSubject,
} from "./leons-race-report-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a demo of the race report with images embedded as inline CID
 * attachments, so it renders correctly before public/email/ is deployed.
 * Placeholder data is allowed here — this is for design review only.
 *
 * Usage: npx tsx emails/send-leons-race-report-demo.ts <email>
 */

const to = process.argv[2];

if (!to) {
  console.error("Usage: npx tsx emails/send-leons-race-report-demo.ts <email>");
  process.exit(1);
}

const images = [
  { url: "email/performance-wealth.png", file: "public/email/performance-wealth.png", cid: "pw" },
  { url: "email/caf.png", file: "public/email/caf.png", cid: "caf" },
  { url: "email/atf.png", file: "public/email/atf.png", cid: "atf" },
  { url: "email/dare2tri.png", file: "public/email/dare2tri.png", cid: "d2t" },
  { url: "email/sebcm.png", file: "public/email/sebcm.png", cid: "sebcm" },
  { url: "email/david-rotter.png", file: "public/email/david-rotter.png", cid: "rotter" },
  { url: "email/race-finish-chute.jpg", file: "public/email/race-finish-chute.jpg", cid: "chute" },
  { url: "email/race-melissa.jpg", file: "public/email/race-melissa.jpg", cid: "melissa" },
  { url: "email/race-james.jpg", file: "public/email/race-james.jpg", cid: "james" },
  { url: "email/race-podium.jpg", file: "public/email/race-podium.jpg", cid: "podium" },
  { url: "email/race-medal.jpg", file: "public/email/race-medal.jpg", cid: "medal" },
];

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set.");
    process.exit(1);
  }

  let html = injectBgcolor(
    await render(React.createElement(LeonsRaceReportEmail, { email: to })),
  );

  const attachments = images.map((img) => {
    html = html.replaceAll(
      `https://patrickwingert.com/${img.url}`,
      `cid:${img.cid}`,
    );
    return {
      filename: img.url.replace(/\//g, "-"),
      content: readFileSync(img.file),
      contentId: img.cid,
    };
  });

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: `Patrick Wingert <${
      process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com"
    }>`,
    to,
    subject: `[DEMO] ${leonsRaceReportSubject}`,
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
