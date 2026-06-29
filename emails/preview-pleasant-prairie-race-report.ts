import { render } from "@react-email/components";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import PleasantPrairieRaceReportEmail from "./pleasant-prairie-race-report-email";

// Remote URL path -> local file under public/, inlined as data URIs so the
// preview HTML renders without deploying the assets first.
const previewImagePaths = [
  "email/performance-wealth.png",
  "email/caf.png",
  "email/atf.png",
  "email/dare2tri.png",
  "email/sebcm.png",
  "email/david-rotter.png",
  "email/pp-finish.jpg",
  "email/pp-bike.jpg",
  "email/pp-run.jpg",
  "email/pp-podium.jpg",
];

function inlineLocalPreviewImages(html: string) {
  let updatedHtml = html;

  for (const path of previewImagePaths) {
    const mime = path.endsWith(".jpg") ? "image/jpeg" : "image/png";
    const base64 = readFileSync(resolve("public", path)).toString("base64");
    updatedHtml = updatedHtml.replaceAll(
      `https://patrickwingert.com/${path}`,
      `data:${mime};base64,${base64}`,
    );
  }

  return updatedHtml;
}

async function main() {
  const html = inlineLocalPreviewImages(
    await render(
      React.createElement(PleasantPrairieRaceReportEmail, {
        email: "patrick@example.com",
      }),
    ),
  );

  writeFileSync("emails/pleasant-prairie-race-report-preview.html", html);
  console.log(
    "Preview saved to emails/pleasant-prairie-race-report-preview.html",
  );
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
