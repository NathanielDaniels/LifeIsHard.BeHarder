import { render } from "@react-email/components";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import React from "react";
import { Resend } from "resend";
import NationalsPreRaceEmail, {
  nationalsPreRaceSubject,
} from "./nationals-pre-race-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a test of the Nationals pre-race email with every image embedded as an
 * inline CID attachment, so it renders correctly (including in Gmail) before
 * the optimized assets are deployed to patrickwingert.com.
 *
 * Usage: npx tsx emails/send-nationals-demo.ts <email> [<email> ...]
 */
const recipients = process.argv.slice(2);
if (recipients.length === 0) {
  console.error("Usage: npx tsx emails/send-nationals-demo.ts <email> [...]");
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("RESEND_API_KEY is not set.");
  process.exit(1);
}

// Remote URL path -> CID. Every image the template references.
const images = [
  { url: "email/header.jpeg", cid: "header" },
  { url: "email/performance-wealth.png", cid: "pw" },
  { url: "email/caf.png", cid: "caf" },
  { url: "email/atf.png", cid: "atf" },
  { url: "email/dare2tri.png", cid: "d2t" },
  { url: "email/sebcm.png", cid: "sebcm" },
  { url: "email/david-rotter.png", cid: "rotter" },
  { url: "email/long-beach-recap/lb-nationals.png", cid: "nat-logo" },
  { url: "email/nationals/nat-hero.jpg", cid: "nat-hero" },
  { url: "email/nationals/nat-caf-jersey.jpg", cid: "nat-caf" },
  { url: "email/nationals/nat-keri-melissa.jpg", cid: "nat-km" },
  { url: "email/nationals/nat-closing.jpg", cid: "nat-close" },
];

async function main() {
  const missing = images.filter(
    (img) => !existsSync(resolve("public", img.url))
  );
  if (missing.length) {
    console.error("Missing image file(s):");
    for (const img of missing) console.error(`  - public/${img.url}`);
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  for (const to of recipients) {
    let html = injectBgcolor(
      await render(React.createElement(NationalsPreRaceEmail, { email: to }))
    );
    for (const img of images) {
      html = html.replaceAll(
        `https://patrickwingert.com/${img.url}`,
        `cid:${img.cid}`
      );
    }

    const attachments = images.map((img) => ({
      filename: img.url.replace(/\//g, "-"),
      content: readFileSync(resolve("public", img.url)),
      contentId: img.cid,
    }));

    const { data, error } = await resend.emails.send({
      from: `Patrick Wingert <${
        process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com"
      }>`,
      to,
      subject: `[TEST] ${nationalsPreRaceSubject}`,
      html,
      attachments,
    });

    if (error) {
      console.error(`FAILED  ${to}:`, error);
      process.exitCode = 1;
    } else {
      console.log(`SENT    ${to}  (${data?.id})`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
