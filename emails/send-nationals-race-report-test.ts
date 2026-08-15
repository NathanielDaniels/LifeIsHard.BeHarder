import { render } from "@react-email/components";
import React from "react";
import { Resend } from "resend";
import NationalsRaceReportEmail, {
  nationalsRaceReportSubject,
} from "./nationals-race-report-email";
import { injectBgcolor } from "./utils/inject-bgcolor";

/**
 * Send a test of the Nationals race report to specific addresses.
 *
 * Unlike send-*-demo.ts, this does NOT swap images for CID attachments. The
 * assets are already live on patrickwingert.com, and inlining them would test a
 * different rendering path than the real broadcast takes. This sends byte-for-
 * byte what a subscriber receives, with only the subject prefixed [TEST].
 *
 * Every remote URL in the rendered HTML is checked for a 200 before anything
 * sends, because a deploy lag would otherwise produce a test full of broken
 * images and waste the review.
 *
 * Usage:
 *   RESEND_API_KEY=... npx tsx emails/send-nationals-race-report-test.ts --dry-run
 *   RESEND_API_KEY=... npx tsx emails/send-nationals-race-report-test.ts <email> [<email> ...]
 */
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const recipients = args.filter((a) => !a.startsWith("--"));

if (!dryRun && recipients.length === 0) {
  console.error(
    "Usage: npx tsx emails/send-nationals-race-report-test.ts [--dry-run] <email> [...]",
  );
  process.exit(1);
}

/**
 * Every absolute http(s) asset the rendered email points at. Collected via a
 * replace callback rather than spreading matchAll/Set, which would need
 * downlevelIteration under this project's tsconfig target.
 */
function remoteAssets(html: string): string[] {
  const urls: string[] = [];
  html.replace(
    /(?:src|url\()=?["'(]?(https?:\/\/[^"')\s>]+)/g,
    (whole: string, url: string) => {
      if (urls.indexOf(url) === -1) urls.push(url);
      return whole;
    },
  );
  return urls;
}

async function preflight(html: string) {
  const urls = remoteAssets(html);
  console.log(`Preflight: checking ${urls.length} remote asset(s)\n`);

  // Time-boxed, and falls back to GET: some CDNs answer HEAD with 405/403, and
  // a preflight that false-negatives would block a send that was actually fine.
  const check = async (url: string, method: "HEAD" | "GET") =>
    fetch(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });

  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        let r = await check(url, "HEAD");
        if (!r.ok && (r.status === 403 || r.status === 405)) {
          r = await check(url, "GET");
        }
        return { url, status: r.status, ok: r.ok, err: "" };
      } catch (e) {
        try {
          const r = await check(url, "GET");
          return { url, status: r.status, ok: r.ok, err: "" };
        } catch (e2) {
          return { url, status: 0, ok: false, err: (e2 as Error).message };
        }
      }
    }),
  );

  for (const r of results) {
    const path = r.url.replace("https://patrickwingert.com", "");
    const why = r.err ? `  ${r.err}` : "";
    console.log(
      `  ${r.ok ? "OK " : "BAD"}  ${String(r.status).padEnd(3)}  ${path}${why}`,
    );
  }

  const bad = results.filter((r) => !r.ok);
  if (bad.length) {
    console.error(
      `\n${bad.length} asset(s) not reachable. Aborting before send — a test ` +
        `with broken images tells you nothing. Wait for the Vercel deploy.`,
    );
    process.exit(1);
  }
  console.log("\nAll assets reachable.");
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey && !dryRun) {
    console.error("RESEND_API_KEY is not set.");
    process.exit(1);
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "patrick@patrickwingert.com";
  const subject = `[TEST] ${nationalsRaceReportSubject}`;

  // Render once against a placeholder purely to preflight the shared assets.
  const sample = injectBgcolor(
    await render(
      React.createElement(NationalsRaceReportEmail, {
        email: recipients[0] || "preview@example.com",
      }),
    ),
  );

  console.log(`Subject: ${subject}`);
  console.log(`From:    Patrick Wingert <${fromEmail}>`);
  console.log(`Size:    ${(sample.length / 1024).toFixed(1)}KB`);
  console.log(
    `Gmail:   ${sample.length / 1024 < 102 ? "under" : "OVER"} the 102KB clip threshold\n`,
  );

  await preflight(sample);

  if (dryRun) {
    console.log(
      `\nDRY RUN — nothing sent. Would have sent to: ${
        recipients.length ? recipients.join(", ") : "(no recipients given)"
      }`,
    );
    return;
  }

  console.log(`\nSending to ${recipients.length} recipient(s):\n`);
  const resend = new Resend(apiKey);

  for (const to of recipients) {
    // Re-render per recipient so the footer's unsubscribe link is correct.
    const html = injectBgcolor(
      await render(React.createElement(NationalsRaceReportEmail, { email: to })),
    );

    const { data, error } = await resend.emails.send({
      from: `Patrick Wingert <${fromEmail}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`  FAILED  ${to}:`, error);
      process.exitCode = 1;
    } else {
      console.log(`  SENT    ${to}  (${data?.id})`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
