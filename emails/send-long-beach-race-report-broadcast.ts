import { render } from "@react-email/components";
import React from "react";
import { Resend } from "resend";
import LongBeachRaceReportEmail, {
  longBeachRaceReportSubject,
} from "./long-beach-race-report-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send the Long Beach race report to all active subscribers.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npx tsx emails/send-long-beach-race-report-broadcast.ts
 *
 * Options:
 *   --dry-run     Preview recipients and run preflight without sending
 *
 * Safety:
 *   1. Refuses to send while placeholder data ("TODO", "—:—", lone "—") remains.
 *   2. Refuses to send unless every image URL in the email is live on
 *      patrickwingert.com. This template ships seven photos under
 *      /email/long-beach-recap/ that must be deployed first — the demo script
 *      hides that by inlining them as CID attachments, so it is not proof.
 */

const ASSET_HOST = "patrickwingert.com";
const PREFLIGHT_TIMEOUT_MS = 10_000;

async function preflightImages(html: string) {
  const urls = Array.from(
    new Set(
      Array.from(html.matchAll(/src="(https:\/\/[^"]+)"/g)).map((m) => m[1]),
    ),
  );

  console.log(`Preflight: checking ${urls.length} image URL(s)...`);

  const results = await Promise.all(
    urls.map(async (url) => {
      // Reachability alone is not enough: a typo'd CDN host would happily 200.
      // Every image must come from our own origin.
      const host = new URL(url).hostname;
      if (host !== ASSET_HOST && host !== `www.${ASSET_HOST}`) {
        return { url, ok: false, status: `off-host (${host})` };
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), PREFLIGHT_TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          method: "HEAD",
          redirect: "error", // a redirect could land off-host
          signal: controller.signal,
        });
        return { url, ok: res.ok, status: res.status };
      } catch (error) {
        return { url, ok: false, status: String(error) };
      } finally {
        clearTimeout(timer);
      }
    }),
  );

  const broken = results.filter((r) => !r.ok);
  if (broken.length > 0) {
    console.error(`\nRefusing to send: ${broken.length} image(s) unreachable.`);
    broken.forEach((b) => console.error(`  x ${b.status}  ${b.url}`));
    console.error(
      "\nDeploy public/email/ to patrickwingert.com before broadcasting.",
    );
    process.exit(1);
  }

  console.log("Preflight: all images reachable.");
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

  // Placeholder guard — render once and refuse to broadcast unfinished data.
  const sampleHtml = await render(
    React.createElement(LongBeachRaceReportEmail, {
      email: "sample@example.com",
    }),
  );
  const placeholders = sampleHtml.match(/TODO|—:—|>—</g);
  if (placeholders) {
    console.error(
      `Refusing to send: ${placeholders.length} placeholder value(s) still in the template (${Array.from(new Set(placeholders)).join(", ")}).`,
    );
    process.exit(1);
  }

  await preflightImages(sampleHtml);

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
    console.log(`Subject: ${longBeachRaceReportSubject}`);
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
      React.createElement(LongBeachRaceReportEmail, {
        email: contact.email,
      }),
    );
    const html = injectBgcolor(rawHtml);

    const { error } = await resend.emails.send({
      from: `Patrick Wingert <${fromEmail}>`,
      to: contact.email,
      subject: longBeachRaceReportSubject,
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
