import { render } from "@react-email/components";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import SeasonUpdateEmail from "./season-update-email";
import React from "react";

async function main() {
  let html = await render(
    React.createElement(SeasonUpdateEmail, { email: "patrick@example.com" }),
  );

  // Replace remote URLs with base64 data URIs for local preview
  const imageMap: Record<string, string> = {
    "https://patrickwingert.com/pat-icon-orange.png": "public/pat-icon-orange.png",
    "https://patrickwingert.com/icons/instagram.png": "public/icons/instagram.png",
    "https://patrickwingert.com/icons/dare2tri.png": "public/icons/dare2tri.png",
    "https://patrickwingert.com/icons/linktree.png": "public/icons/linktree.png",
    "https://patrickwingert.com/icons/strava.png": "public/icons/strava.png",
  };

  for (const [url, localPath] of Object.entries(imageMap)) {
    try {
      const fullPath = resolve(process.cwd(), localPath);
      const buf = readFileSync(fullPath);
      const b64 = buf.toString("base64");
      html = html.replaceAll(url, `data:image/png;base64,${b64}`);
    } catch {
      console.warn(`Skipped: ${localPath} not found`);
    }
  }

  writeFileSync("emails/season-update-preview.html", html);
  console.log("Preview saved to emails/season-update-preview.html");
}

main();
