import { render } from "@react-email/components";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import React from "react";
import { Resend } from "resend";
import ChicagoV1FifthStar, {
  chicagoV1Subject,
} from "./chicago-v1-fifth-star";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a test of the SuperTri Chicago "Fifth Star" email with every image
 * embedded as an inline CID attachment, so it renders correctly (including in
 * Gmail) before the optimized assets are deployed to patrickwingert.com.
 *
 * Note: the hero's glow background-image becomes a cid: URL too — Apple Mail
 * renders it, Gmail may not and falls back to the flat #0d0b09 bgcolor. That
 * is the intended graceful degradation.
 *
 * Usage: npx tsx --env-file=.env.local emails/send-chicago-demo.ts <email> [...]
 */
const recipients = process.argv.slice(2);
if (recipients.length === 0) {
  console.error(
    "Usage: npx tsx --env-file=.env.local emails/send-chicago-demo.ts <email> [...]"
  );
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("RESEND_API_KEY is not set.");
  process.exit(1);
}

// Remote URL path -> CID. Every image the template references.
const images = [
  // brand / sponsor block
  { url: "email/performance-wealth.png", cid: "pw" },
  { url: "email/caf.png", cid: "caf" },
  { url: "email/atf.png", cid: "atf" },
  { url: "email/dare2tri.png", cid: "d2t" },
  { url: "email/sebcm.png", cid: "sebcm" },
  { url: "email/david-rotter.png", cid: "rotter" },
  // chicago assets
  { url: "email/chicago/hero-glow.jpg", cid: "glow" },
  { url: "email/chicago/stars-four.png", cid: "stars" },
  { url: "email/chicago/star-orange.png", cid: "star-o" },
  { url: "email/chicago/star-red.png", cid: "star-r" },
  { url: "email/chicago/ecg-strip.png", cid: "ecg" },
  { url: "email/chicago/chi-portrait-cine.jpg", cid: "portrait" },
  { url: "email/chicago/map-venue.jpg", cid: "map-v" },
  { url: "email/chicago/map-transition.jpg", cid: "map-t" },
  { url: "email/chicago/strides-qr.jpg", cid: "qr" },
  { url: "email/chicago/athletic-brewing-white.png", cid: "ab" },
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
      await render(React.createElement(ChicagoV1FifthStar, { email: to }))
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
      subject: `[TEST] ${chicagoV1Subject}`,
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
