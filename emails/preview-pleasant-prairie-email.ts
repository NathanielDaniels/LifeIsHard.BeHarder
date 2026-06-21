import { render } from "@react-email/components";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import PleasantPrairieEmail from "./pleasant-prairie-email";

// Remote URL path -> local file under public/, inlined as data URIs so the
// preview HTML renders before the new email images are deployed.
const previewImagePaths = [
  "email/performance-wealth.png",
  "email/caf.png",
  "email/atf.png",
  "email/dare2tri.png",
  "email/sebcm.png",
  "email/david-rotter.png",
  "email/header.jpeg",
  "email/triathlon_pleasant_prairie.png",
  "email/raceProof_leonsResults.jpeg",
  "email/training.jpeg",
  "email/bike_bag_damage.jpeg",
  "email/grit.jpeg",
];

function mimeFor(path: string) {
  if (path.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

function inlineLocalPreviewImages(html: string) {
  let updatedHtml = html;

  for (const path of previewImagePaths) {
    const base64 = readFileSync(resolve("public", path)).toString("base64");
    updatedHtml = updatedHtml.replaceAll(
      `https://patrickwingert.com/${path}`,
      `data:${mimeFor(path)};base64,${base64}`,
    );
  }

  return updatedHtml;
}

async function main() {
  const html = inlineLocalPreviewImages(
    await render(
      React.createElement(PleasantPrairieEmail, {
        email: "patrick@example.com",
      }),
    ),
  );

  writeFileSync("emails/pleasant-prairie-preview.html", html);
  console.log("Preview saved to emails/pleasant-prairie-preview.html");
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
