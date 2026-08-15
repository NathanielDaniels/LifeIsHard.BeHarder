import { render } from "@react-email/components";
import { appendFileSync, existsSync, readFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import { Resend } from "resend";
import NationalsRaceReportEmail, {
  nationalsRaceReportSubject,
} from "./nationals-race-report-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send the Nationals race report to all active subscribers.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npx tsx emails/send-nationals-race-report-broadcast.ts --dry-run
 *   RESEND_API_KEY=re_xxx RESEND_AUDIENCE_ID=xxx npx tsx emails/send-nationals-race-report-broadcast.ts
 *
 * Options:
 *   --dry-run   Resolve recipients and run every preflight, send nothing.
 *   --resume    Skip addresses already recorded in the send log (see below).
 *
 * Safety, in the order the checks run:
 *   1. Refuses to send while placeholder text ("TODO") remains in the render.
 *   2. Refuses to send unless every image is live AND served from our own
 *      origin. A typo'd CDN host would happily return 200, so reachability
 *      alone is not the test.
 *   3. Refuses to send if the HTML would trip Gmail's ~102KB clipping
 *      threshold, which would truncate the letter partway through.
 *   4. Records every successful send to a log file, so a run that dies partway
 *      can be resumed with --resume instead of double-sending to everyone who
 *      already received it.
 */

const ASSET_HOST = "patrickwingert.com";
const PREFLIGHT_TIMEOUT_MS = 10_000;
const GMAIL_CLIP_KB = 102;
const THROTTLE_MS = 250;

// One line per delivered address. Kept out of git; it is a run artifact.
const SEND_LOG = resolve(__dirname, ".nationals-race-report-sent.log");

async function preflightImages(html: string) {
  const seen: string[] = [];
  // Deliberately matches http:// too. Scoping the pattern to https would let a
  // plain-http image slip through unchecked rather than get caught below.
  html.replace(/src="(https?:\/\/[^"]+)"/g, (whole: string, url: string) => {
    if (seen.indexOf(url) === -1) seen.push(url);
    return whole;
  });

  console.log(`Preflight: checking ${seen.length} image URL(s)...`);

  const results = await Promise.all(
    seen.map(async (url) => {
      const parsed = new URL(url);

      // Mixed content: many clients silently drop http images.
      if (parsed.protocol !== "https:") {
        return { url, ok: false, reason: `not https (${parsed.protocol})` };
      }

      // Reachability alone is not enough: a typo'd CDN host would happily 200.
      // Every image must come from our own origin.
      const host = parsed.hostname;
      if (host !== ASSET_HOST && host !== `www.${ASSET_HOST}`) {
        return { url, ok: false, reason: `off-host (${host})` };
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), PREFLIGHT_TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          method: "HEAD",
          redirect: "error", // a redirect could land off-host
          signal: controller.signal,
        });
        return {
          url,
          ok: res.ok,
          reason: res.ok ? "" : `HTTP ${res.status}`,
        };
      } catch (error) {
        return { url, ok: false, reason: String(error) };
      } finally {
        clearTimeout(timer);
      }
    }),
  );

  const rejected = results.filter((r) => !r.ok);
  if (rejected.length > 0) {
    // Separate the two failure modes: an unreachable image means the deploy
    // has not landed, a rejected one means the template points somewhere it
    // should not. They need different fixes.
    const offOrigin = rejected.filter((r) =>
      /^off-host|^not https/.test(r.reason),
    );
    const unreachable = rejected.filter(
      (r) => !/^off-host|^not https/.test(r.reason),
    );

    console.error(`\nRefusing to send: ${rejected.length} image(s) failed preflight.`);
    if (unreachable.length) {
      console.error(`\n  Unreachable (${unreachable.length}):`);
      unreachable.forEach((b) => console.error(`    x ${b.reason}  ${b.url}`));
      console.error(
        "  -> Deploy public/email/ to patrickwingert.com before broadcasting.",
      );
    }
    if (offOrigin.length) {
      console.error(`\n  Not served from our origin (${offOrigin.length}):`);
      offOrigin.forEach((b) => console.error(`    x ${b.reason}  ${b.url}`));
      console.error(
        "  -> Fix the template to reference https://patrickwingert.com assets.",
      );
    }
    process.exit(1);
  }

  console.log("Preflight: all images reachable and on-host.");
}

function preflightSize(html: string) {
  // Bytes, not html.length. That counts UTF-16 code units, and this letter is
  // full of non-ASCII (·, curly quotes, →) that cost more than one byte each.
  // Undercounting is the wrong direction for a guard against a size ceiling.
  const kb = Buffer.byteLength(html, "utf8") / 1024;
  console.log(`Preflight: rendered HTML is ${kb.toFixed(1)}KB (UTF-8 bytes).`);
  if (kb >= GMAIL_CLIP_KB) {
    console.error(
      `\nRefusing to send: ${kb.toFixed(1)}KB is at or over Gmail's ~${GMAIL_CLIP_KB}KB ` +
        `clipping threshold. Gmail would truncate the letter and hide the ` +
        `sponsors, the Dare2Tri ask, and the unsubscribe link behind a ` +
        `"View entire message" link.`,
    );
    process.exit(1);
  }
}

function alreadySent(): string[] {
  if (!existsSync(SEND_LOG)) return [];
  return readFileSync(SEND_LOG, "utf8")
    .split("\n")
    .map((line) => line.split("\t")[0].trim().toLowerCase())
    .filter(Boolean);
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const isDryRun = process.argv.includes("--dry-run");
  const isResume = process.argv.includes("--resume");

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    process.exit(1);
  }
  if (!audienceId) {
    console.error("Missing RESEND_AUDIENCE_ID");
    process.exit(1);
  }

  // Placeholder guard — render once and refuse to broadcast unfinished data.
  const sampleHtml = injectBgcolor(
    await render(
      React.createElement(NationalsRaceReportEmail, {
        email: "sample@example.com",
      }),
    ),
  );
  const placeholders = sampleHtml.match(/TODO/g);
  if (placeholders) {
    console.error(
      `Refusing to send: ${placeholders.length} placeholder value(s) still in the template.`,
    );
    process.exit(1);
  }

  preflightSize(sampleHtml);
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
  let activeContacts = allContacts.filter(
    (contact: { unsubscribed: boolean }) => !contact.unsubscribed,
  );

  console.log(
    `Found ${activeContacts.length} active subscribers (${allContacts.length} total)`,
  );

  const sentAlready = alreadySent();
  if (sentAlready.length > 0) {
    if (isResume || isDryRun) {
      const before = activeContacts.length;
      activeContacts = activeContacts.filter(
        (c: { email: string }) =>
          sentAlready.indexOf(c.email.toLowerCase()) === -1,
      );
      const skipped = before - activeContacts.length;
      console.log(
        `${isResume ? "Resuming" : "Dry run"}: skipping ${skipped} already sent, ${activeContacts.length} remaining.`,
      );
      // A dry run only previews, so it should never be blocked by the log. Say
      // plainly that the real run still needs the flag.
      if (!isResume) {
        console.log("(A real send would refuse here without --resume.)");
      }
    } else {
      console.error(
        `\nRefusing to send: ${sentAlready.length} address(es) are already in\n` +
          `  ${SEND_LOG}\n` +
          `A previous run delivered to them. Re-run with --resume to send only\n` +
          `the remainder, or delete that file if this is a deliberate resend.`,
      );
      process.exit(1);
    }
  }

  if (activeContacts.length === 0) {
    console.error("No recipients left to send to. Nothing to do.");
    process.exit(1);
  }

  if (isDryRun) {
    console.log("\n=== DRY RUN ===");
    console.log(`From: Patrick Wingert <${fromEmail}>`);
    console.log(`Subject: ${nationalsRaceReportSubject}`);
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
    // Re-render per recipient so the footer's unsubscribe link is correct.
    const html = injectBgcolor(
      await render(
        React.createElement(NationalsRaceReportEmail, {
          email: contact.email,
        }),
      ),
    );

    const { data, error } = await resend.emails.send({
      from: `Patrick Wingert <${fromEmail}>`,
      to: contact.email,
      subject: nationalsRaceReportSubject,
      html,
    });

    if (error) {
      console.error(`  x Failed to send to ${contact.email}:`, error);
      failed++;
    } else {
      // The mail is already gone, so a failure to record it must never abort
      // the run: that would strand the remaining subscribers over a disk
      // problem. Warn loudly instead, since --resume would re-send this one.
      try {
        appendFileSync(SEND_LOG, `${contact.email}\t${data?.id ?? ""}\n`);
      } catch (logError) {
        console.error(
          `  ! Sent to ${contact.email} but could not write the send log: ${logError}\n` +
            `    A --resume run would send to this address again. Record it by hand.`,
        );
      }
      console.log(`  Sent to ${contact.email}`);
      sent++;
    }

    await new Promise((resolve) => setTimeout(resolve, THROTTLE_MS));
  }

  console.log(`\nDone. ${sent} sent, ${failed} failed.`);
  if (failed > 0) {
    console.log(
      `Re-run with --resume to retry only the ${failed} that failed.`,
    );
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
