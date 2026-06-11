import { render } from "@react-email/components";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import LeonsTriathlonInviteEmail from "./leons-triathlon-invite-email";

const previewImageMap: Record<string, { path: string; mime: string }> = {
  "https://patrickwingert.com/race-weekend/leons-americas-race-logo-email.png": {
    path: "public/race-weekend/leons-americas-race-logo-email.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/sponsors/performance-wealth-partners-email_grey_transparent.png": {
    path: "public/sponsors/performance-wealth-partners-email_grey_transparent.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/sponsors/CAF_logo_transparent.png": {
    path: "public/sponsors/CAF_logo_transparent.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/sponsors/ATF_logo_email_dark_gray_transparent.png": {
    path: "public/sponsors/ATF_logo_email_dark_gray_transparent.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/sponsors/D2T_logo_short_transparent.png": {
    path: "public/sponsors/D2T_logo_short_transparent.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/sponsors/SEBCM_color_transparent.png": {
    path: "public/sponsors/SEBCM_color_transparent.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/sponsors/david-rotter-logo_orig_transparent.png": {
    path: "public/sponsors/david-rotter-logo_orig_transparent.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/icons/instagram.png": {
    path: "public/icons/instagram.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/icons/dare2tri.png": {
    path: "public/icons/dare2tri.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/icons/linktree.png": {
    path: "public/icons/linktree.png",
    mime: "image/png",
  },
  "https://patrickwingert.com/pat_new_bike.jpg": {
    path: "public/pat_new_bike.jpg",
    mime: "image/jpeg",
  },
  "https://patrickwingert.com/pat_race_suite.png": {
    path: "public/pat_race_suite.png",
    mime: "image/png",
  },
};

function inlineLocalPreviewImages(html: string) {
  let updatedHtml = html;

  for (const [remoteUrl, asset] of Object.entries(previewImageMap)) {
    const base64 = readFileSync(resolve(asset.path)).toString("base64");
    updatedHtml = updatedHtml.replaceAll(
      remoteUrl,
      `data:${asset.mime};base64,${base64}`,
    );
  }

  return updatedHtml;
}

async function main() {
  const html = inlineLocalPreviewImages(
    await render(
      React.createElement(LeonsTriathlonInviteEmail, {
        email: "patrick@example.com",
      }),
    ),
  );

  writeFileSync("emails/leons-triathlon-invite-preview.html", html);
  console.log("Preview saved to emails/leons-triathlon-invite-preview.html");
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
