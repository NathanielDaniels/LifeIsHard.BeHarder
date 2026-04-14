import { Resend } from "resend";
import { render } from "@react-email/components";
import React from "react";
import RaceReportEmail from "./race-report-email";

/**
 * Send the race report email to ALL active subscribers via Resend.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npx tsx emails/send-race-report-broadcast.ts
 *
 * Options:
 *   --dry-run     Preview recipients without actually sending
 */

function injectBgcolor(html: string): string {
  return html.replace(
    /<(table|td|body)(\s[^>]*?)style="([^"]*?)background-color:\s*(#[0-9a-fA-F]{3,8})(;[^"]*?|)"([^>]*?)>/gi,
    (match, tag, before, styleBefore, color, styleAfter, after) => {
      if (match.toLowerCase().includes("bgcolor")) return match;
      const hex =
        color.length === 4
          ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
          : color;
      return `<${tag}${before}bgcolor="${hex}" style="${styleBefore}background-color:${color}${styleAfter}"${after}>`;
    },
  );
}

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

  const resend = new Resend(apiKey);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com";

  const SUBJECT = "First Race of the 2026 Season. First Place.";

  // Fetch all audience contacts (paginated)
  console.log("Fetching audience contacts...");
  const allContacts: { email: string; unsubscribed: boolean }[] = [];

  const { data: contacts, error: contactsError } =
    await resend.contacts.list({ audienceId });

  if (contactsError) {
    console.error("Failed to fetch contacts:", contactsError);
    process.exit(1);
  }

  allContacts.push(...(contacts?.data || []));

  const activeContacts = allContacts.filter((c) => !c.unsubscribed);
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
    console.log(`Subject: ${SUBJECT}`);
    console.log(`Recipients: ${activeContacts.length}`);
    console.log("\nFirst 5 recipients:");
    activeContacts.slice(0, 5).forEach((c) => console.log(`  - ${c.email}`));
    if (activeContacts.length > 5)
      console.log(`  ... and ${activeContacts.length - 5} more`);
    console.log("\nRun without --dry-run to send.");
    return;
  }

  // Send individually so each email is personalised with the recipient's address
  console.log("\nSending emails...");
  let sent = 0;
  let failed = 0;

  for (const contact of activeContacts) {
    const rawHtml = await render(
      React.createElement(RaceReportEmail, { email: contact.email }),
    );
    const html = injectBgcolor(rawHtml);

    const { error } = await resend.emails.send({
      from: `Patrick Wingert <${fromEmail}>`,
      to: contact.email,
      subject: SUBJECT,
      html,
    });

    if (error) {
      console.error(`  ✗ Failed to send to ${contact.email}:`, error);
      failed++;
    } else {
      console.log(`  ✓ Sent to ${contact.email}`);
      sent++;
    }

    // Stay within Resend rate limits
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\nDone! ${sent} sent, ${failed} failed.`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
