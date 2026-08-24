import { render } from "@react-email/components";
import { readFileSync } from "fs";
import React from "react";
import { Resend } from "resend";
import LongBeachRaceReportEmail, {
  longBeachRaceReportSubject,
} from "./long-beach-race-report-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a demo of the Long Beach race report with images embedded as inline CID
 * attachments, so it renders correctly before public/email/long-beach-recap/ is
 * deployed. Use this for the pre-broadcast test review.
 *
 * Usage: npx tsx emails/send-long-beach-race-report-demo.ts <email>
 */

const to = process.argv[2];

if (!to) {
  console.error(
    "Usage: npx tsx emails/send-long-beach-race-report-demo.ts <email>",
  );
  process.exit(1);
}

const images = [
  { url: "email/header.jpeg", cid: "header" },
  { url: "email/performance-wealth.png", cid: "pw" },
  { url: "email/caf.png", cid: "caf" },
  { url: "email/atf.png", cid: "atf" },
  { url: "email/dare2tri.png", cid: "d2t" },
  { url: "email/sebcm.png", cid: "sebcm" },
  { url: "email/david-rotter.png", cid: "rotter" },
  { url: "email/long-beach/funding-forward-motion.png", cid: "ffm" },
  { url: "email/long-beach-recap/lb-run.jpg", cid: "lbrun" },
  { url: "email/long-beach-recap/lb-swim-exit.jpg", cid: "lbswim" },
  { url: "email/long-beach-recap/lb-group.jpg", cid: "lbgroup" },
  { url: "email/long-beach-recap/lb-melissa-2025.jpg", cid: "lbmel25" },
  { url: "email/long-beach-recap/lb-melissa-2026.jpg", cid: "lbmel26" },
  { url: "email/long-beach-recap/lb-nationals.png", cid: "lbnats" },
  { url: "email/long-beach-recap/lb-closing.jpg", cid: "lbclose" },
];

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set.");
    process.exit(1);
  }

  let html = injectBgcolor(
    await render(React.createElement(LongBeachRaceReportEmail, { email: to })),
  );

  const attachments = images.map((img) => {
    html = html.replaceAll(
      `https://patrickwingert.com/${img.url}`,
      `cid:${img.cid}`,
    );
    return {
      filename: img.url.replace(/\//g, "-"),
      content: readFileSync(`public/${img.url}`),
      contentId: img.cid,
    };
  });

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: `Patrick Wingert <${
      process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com"
    }>`,
    to,
    subject: `[TEST] ${longBeachRaceReportSubject}`,
    html,
    attachments,
  });

  if (error) {
    console.error("Send failed:", error);
    process.exit(1);
  }

  console.log(`Test sent to ${to}. ID: ${data?.id}`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
