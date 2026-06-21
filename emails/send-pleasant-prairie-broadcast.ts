import { render } from "@react-email/components";
import React from "react";
import { Resend } from "resend";
import PleasantPrairieEmail, {
  pleasantPrairieEmailSubject,
} from "./pleasant-prairie-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send the Pleasant Prairie race-week email to all active subscribers.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npx tsx emails/send-pleasant-prairie-broadcast.ts --dry-run
 *
 * Options:
 *   --dry-run     Preview recipients without sending
 *
 * Safety: refuses to send while placeholder data remains in the rendered
 * email. Images must be deployed to patrickwingert.com/public/email/ before
 * broadcasting.
 */

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const isDryRun = process.argv.includes("--dry-run");

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    process.exit(1);
  }
  if (!audienceId) {
    console.error("Missing RESEND_AUDIENCE_ID");
    process.exit(1);
  }

  const sampleHtml = await render(
    React.createElement(PleasantPrairieEmail, { email: "sample@example.com" }),
  );
  const placeholders = sampleHtml.match(/TODO|INSERT|TODO_/g);
  if (placeholders) {
    console.error(
      `Refusing to send: ${placeholders.length} placeholder value(s) still in the template.`,
    );
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com";

  console.log("Fetching audience contacts...");
  const { data: contacts, error: contactsError } = await resend.contacts.list({
    audienceId,
  });

  if (contactsError) {
    console.error("Failed to fetch contacts:", contactsError);
    process.exit(1);
  }

  const allContacts = contacts?.data || [];
  const activeContacts = allContacts.filter(
    (contact: { unsubscribed: boolean }) => !contact.unsubscribed,
  );

  console.log(
    `Found ${activeContacts.length} active subscribers (${allContacts.length} total)`,
  );

  if (activeContacts.length === 0) {
    console.error("No active subscribers found. Nothing to send.");
    process.exit(1);
  }

  if (isDryRun) {
    console.log("\n=== DRY RUN ===");
    console.log(`From: Patrick Wingert <${fromEmail}>`);
    console.log(`Subject: ${pleasantPrairieEmailSubject}`);
    console.log(`Recipients: ${activeContacts.length}`);
    console.log("\nFirst 5 recipients:");
    activeContacts
      .slice(0, 5)
      .forEach((contact: { email: string }) =>
        console.log(`  - ${contact.email}`),
      );
    if (activeContacts.length > 5) {
      console.log(`  ... and ${activeContacts.length - 5} more`);
    }
    console.log("\nRun without --dry-run to send.");
    return;
  }

  console.log("\nSending emails...");
  let sent = 0;
  let failed = 0;

  for (const contact of activeContacts) {
    const rawHtml = await render(
      React.createElement(PleasantPrairieEmail, { email: contact.email }),
    );
    const html = injectBgcolor(rawHtml);

    const { error } = await resend.emails.send({
      from: `Patrick Wingert <${fromEmail}>`,
      to: contact.email,
      subject: pleasantPrairieEmailSubject,
      html,
    });

    if (error) {
      console.error(`  x Failed to send to ${contact.email}:`, error);
      failed++;
    } else {
      console.log(`  Sent to ${contact.email}`);
      sent++;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log(`\nDone. ${sent} sent, ${failed} failed.`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
