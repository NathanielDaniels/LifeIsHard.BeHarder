import { Resend } from "resend";
import { render } from "@react-email/components";
import React from "react";
import SeasonUpdateEmailHybrid from "./season-update-email-hybrid";

const to = process.argv[2];
if (!to) {
  console.error("Usage: npx tsx emails/send-test-hybrid.ts <email>");
  process.exit(1);
}

/**
 * Gmail iOS strips <body> and ignores inline background-color on some elements.
 * The bgcolor HTML attribute is the only reliable dark-background method.
 * This injects bgcolor on every <table>, <td>, and <body> that has a solid
 * hex background-color in its inline style.
 */
function injectBgcolor(html: string): string {
  return html.replace(
    /<(table|td|body)(\s[^>]*?)style="([^"]*?)background-color:\s*(#[0-9a-fA-F]{3,8})(;[^"]*?|)"([^>]*?)>/gi,
    (match, tag, before, styleBefore, color, styleAfter, after) => {
      if (match.toLowerCase().includes("bgcolor")) return match;
      const hex = color.length === 4
        ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
        : color.length === 9
        ? color.slice(0, 7)
        : color;
      return `<${tag}${before}bgcolor="${hex}" style="${styleBefore}background-color:${color}${styleAfter}"${after}>`;
    },
  );
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set. Run with: RESEND_API_KEY=... npx tsx emails/send-test-hybrid.ts <email>");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const rawHtml = await render(
    React.createElement(SeasonUpdateEmailHybrid, { email: to }),
  );
  const html = injectBgcolor(rawHtml);
  console.log(`Injected bgcolor attributes for Gmail iOS compatibility`);

  const { data, error } = await resend.emails.send({
    from: `Patrick Wingert <${process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com"}>`,
    to,
    subject: "The Site Is Updated. The Season Is Loaded. Let's Go.",
    html,
  });

  if (error) {
    console.error("Send failed:", error);
    process.exit(1);
  }

  console.log(`Sent to ${to}. ID: ${data?.id}`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
