import { render } from "@react-email/components";
import { readFileSync } from "fs";
import React from "react";
import { Resend } from "resend";
import PleasantPrairieEmail, {
  pleasantPrairieEmailSubject,
} from "./pleasant-prairie-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a demo of the Pleasant Prairie race-week email with images embedded as
 * inline CID attachments, so it renders correctly before public/email/ is
 * deployed.
 *
 * Usage: npx tsx emails/send-pleasant-prairie-demo.ts <email>
 */

const to = process.argv[2];

if (!to) {
  console.error("Usage: npx tsx emails/send-pleasant-prairie-demo.ts <email>");
  process.exit(1);
}

const images = [
  { url: "email/performance-wealth.png", file: "public/email/performance-wealth.png", cid: "pw" },
  { url: "email/caf.png", file: "public/email/caf.png", cid: "caf" },
  { url: "email/atf.png", file: "public/email/atf.png", cid: "atf" },
  { url: "email/dare2tri.png", file: "public/email/dare2tri.png", cid: "d2t" },
  { url: "email/sebcm.png", file: "public/email/sebcm.png", cid: "sebcm" },
  { url: "email/david-rotter.png", file: "public/email/david-rotter.png", cid: "rotter" },
  { url: "email/header.jpeg", file: "public/email/header.jpeg", cid: "header" },
  {
    url: "email/triathlon_pleasant_prairie.png",
    file: "public/email/triathlon_pleasant_prairie.png",
    cid: "pleasant-prairie-logo",
  },
  {
    url: "email/raceProof_leonsResults.jpeg",
    file: "public/email/raceProof_leonsResults.jpeg",
    cid: "race-proof",
  },
  { url: "email/training.jpeg", file: "public/email/training.jpeg", cid: "training" },
  {
    url: "email/bike_bag_damage.jpeg",
    file: "public/email/bike_bag_damage.jpeg",
    cid: "bike-bag",
  },
  { url: "email/grit.jpeg", file: "public/email/grit.jpeg", cid: "grit" },
];

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set.");
    process.exit(1);
  }

  let html = injectBgcolor(
    await render(React.createElement(PleasantPrairieEmail, { email: to })),
  );

  const placeholders = html.match(/TODO|INSERT|TODO_/g);
  if (placeholders) {
    console.error(
      `Refusing to send demo: ${placeholders.length} placeholder value(s) still in the template.`,
    );
    process.exit(1);
  }

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
    subject: `[DEMO] ${pleasantPrairieEmailSubject}`,
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
