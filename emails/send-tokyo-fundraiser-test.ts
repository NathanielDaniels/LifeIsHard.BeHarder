import { render } from "@react-email/components";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import { Resend } from "resend";
import TokyoFundraiserEmail, { tokyoFundraiserSubject } from "./tokyo-fundraiser-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a test of the Tokyo fundraiser email.
 *
 * Default: exactly as subscribers will get it, with hosted image URLs on
 * patrickwingert.com. Every URL is checked first, so run it only after the
 * assets are deployed.
 *
 * --inline: embed the local public/ images as CID attachments instead, to
 * check layout changes on real phones before anything is deployed.
 *
 * Usage: npx tsx emails/send-tokyo-fundraiser-test.ts [--inline] <email> [...]
 */
const args = process.argv.slice(2);
const inline = args.includes("--inline");
const recipients = args.filter((arg) => arg !== "--inline");
if (recipients.length === 0) {
  console.error("Usage: npx tsx emails/send-tokyo-fundraiser-test.ts [--inline] <email> [...]");
  process.exit(1);
}

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("RESEND_API_KEY is not set.");
  process.exit(1);
}

const HOSTED = /https:\/\/patrickwingert\.com\/((?:email|fonts)\/[^"')\s]+)/g;

function hostedPaths(html: string) {
  return Array.from(new Set(Array.from(html.matchAll(HOSTED), (m) => m[1])));
}

/** Same budget as the broadcast preflight, so a stalled request aborts instead of hanging. */
const PREFLIGHT_TIMEOUT_MS = 10_000;

async function assertAssetsLive(paths: string[]) {
  const broken: string[] = [];
  for (const path of paths) {
    try {
      const res = await fetch(`https://patrickwingert.com/${path}`, {
        method: "HEAD",
        signal: AbortSignal.timeout(PREFLIGHT_TIMEOUT_MS),
      });
      if (!res.ok) broken.push(`${res.status}  ${path}`);
    } catch (error) {
      broken.push(`${String(error)}  ${path}`);
    }
  }
  if (broken.length) throw new Error(`Assets not live:\n  ${broken.join("\n  ")}`);
  console.log(`All ${paths.length} hosted assets return 200.`);
}

/** Swap hosted image URLs for CID references and build the attachments. */
function embedLocalImages(html: string, paths: string[]) {
  const images = paths.filter((path) => path.startsWith("email/"));
  const missing = images.filter((path) => !existsSync(resolve("public", path)));
  if (missing.length) throw new Error(`Missing local images:\n  ${missing.join("\n  ")}`);

  let out = html;
  const attachments = images.map((path, i) => {
    const contentId = `img${i}`;
    out = out.replaceAll(`https://patrickwingert.com/${path}`, `cid:${contentId}`);
    return { filename: path.replace(/\//g, "-"), content: readFileSync(resolve("public", path)), contentId };
  });
  return { html: out, attachments };
}

async function main() {
  const resend = new Resend(apiKey);
  let checked = false;

  for (const to of recipients) {
    let html = injectBgcolor(await render(React.createElement(TokyoFundraiserEmail, { email: to })));
    const paths = hostedPaths(html);
    let attachments: { filename: string; content: Buffer; contentId: string }[] | undefined;

    if (inline) {
      ({ html, attachments } = embedLocalImages(html, paths));
    } else if (!checked) {
      await assertAssetsLive(paths);
      checked = true;
    }

    const { data, error } = await resend.emails.send({
      from: `Patrick Wingert <${process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com"}>`,
      to,
      subject: `[TEST${inline ? " inline" : ""}] ${tokyoFundraiserSubject}`,
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
