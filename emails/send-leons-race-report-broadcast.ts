import { render } from "@react-email/components";
import React from "react";
import { Resend } from "resend";
import LeonsRaceReportEmail, {
  leonsRaceReportSubject,
} from "./leons-race-report-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send the Leon's Triathlon race report to all active subscribers.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npx tsx emails/send-leons-race-report-broadcast.ts
 *
 * Options:
 *   --dry-run     Preview recipients without sending
 *
 * Safety: refuses to send while placeholder data ("TODO", "—:—", lone "—")
 * remains in the rendered email. Images must be deployed to
 * patrickwingert.com (public/email/) before sending.
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

  // Placeholder guard — render once and refuse to broadcast unfinished data.
  const sampleHtml = await render(
    React.createElement(LeonsRaceReportEmail, { email: "sample@example.com" }),
  );
  const placeholders = sampleHtml.match(/TODO|—:—|>—</g);
  if (placeholders) {
    console.error(
      `Refusing to send: ${placeholders.length} placeholder value(s) still in the template (${Array.from(new Set(placeholders)).join(", ")}).`,
    );
    console.error(
      "Fill in the `race` config in emails/leons-race-report-email.tsx first.",
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
    console.log(`Subject: ${leonsRaceReportSubject}`);
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
      React.createElement(LeonsRaceReportEmail, { email: contact.email }),
    );
    const html = injectBgcolor(rawHtml);

    const { error } = await resend.emails.send({
      from: `Patrick Wingert <${fromEmail}>`,
      to: contact.email,
      subject: leonsRaceReportSubject,
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
