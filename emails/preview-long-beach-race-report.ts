import { render } from "@react-email/components";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import LongBeachRaceReportEmail from "./long-beach-race-report-email";

// Remote URL path -> local file under public/, inlined as data URIs so the
// preview HTML renders without deploying the assets first. Race photos that
// haven't been dropped in yet are skipped so the preview still builds.
const previewImagePaths = [
  "email/header.jpeg",
  "email/performance-wealth.png",
  "email/caf.png",
  "email/atf.png",
  "email/dare2tri.png",
  "email/sebcm.png",
  "email/david-rotter.png",
  "email/long-beach/funding-forward-motion.png",
  "email/long-beach-recap/lb-run.jpg",
  "email/long-beach-recap/lb-swim-exit.jpg",
  "email/long-beach-recap/lb-group.jpg",
  "email/long-beach-recap/lb-melissa-2025.jpg",
  "email/long-beach-recap/lb-melissa-2026.jpg",
  "email/long-beach-recap/lb-nationals.png",
  "email/long-beach-recap/lb-closing.jpg",
];

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function inlineLocalPreviewImages(html: string) {
  let updatedHtml = html;
  const missing: string[] = [];

  for (const path of previewImagePaths) {
    const filePath = resolve("public", path);
    if (!existsSync(filePath)) {
      missing.push(path);
      continue;
    }

    const ext = path.split(".").pop()?.toLowerCase() ?? "";
    const mime = MIME_BY_EXT[ext] ?? "application/octet-stream";
    const base64 = readFileSync(filePath).toString("base64");
    updatedHtml = updatedHtml.replaceAll(
      `https://patrickwingert.com/${path}`,
      `data:${mime};base64,${base64}`,
    );
  }

  if (missing.length > 0) {
    console.warn(
      `Missing ${missing.length} asset(s) — left as remote URLs:\n  ${missing.join("\n  ")}`,
    );
  }

  return updatedHtml;
}

async function main() {
  const html = inlineLocalPreviewImages(
    await render(
      React.createElement(LongBeachRaceReportEmail, {
        email: "patrick@example.com",
      }),
    ),
  );

  writeFileSync("emails/long-beach-race-report-preview.html", html);
  console.log("Preview saved to emails/long-beach-race-report-preview.html");
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
