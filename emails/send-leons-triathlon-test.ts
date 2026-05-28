import { render } from "@react-email/components";
import React from "react";
import { Resend } from "resend";
import LeonsTriathlonInviteEmail, {
  leonsTriathlonInviteSubject,
} from "./leons-triathlon-invite-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

const to = process.argv[2];

if (!to) {
  console.error("Usage: npx tsx emails/send-leons-triathlon-test.ts <email>");
  process.exit(1);
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "RESEND_API_KEY not set. Run with: RESEND_API_KEY=... npx tsx emails/send-leons-triathlon-test.ts <email>",
    );
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const rawHtml = await render(
    React.createElement(LeonsTriathlonInviteEmail, { email: to }),
  );
  const html = injectBgcolor(rawHtml);

  const { data, error } = await resend.emails.send({
    from: `Patrick Wingert <${
      process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com"
    }>`,
    to,
    subject: leonsTriathlonInviteSubject,
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
