import { render } from "@react-email/components";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import React from "react";
import NationalsPreRaceEmail from "./nationals-pre-race-email";

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
  "email/long-beach-recap/lb-nationals.png",
  "email/nationals/nat-hero.jpg",
  "email/nationals/nat-caf-jersey.jpg",
  "email/nationals/nat-keri-melissa.jpg",
  "email/nationals/nat-closing.jpg",
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
      `data:${mime};base64,${base64}`
    );
  }

  return { html: updatedHtml, missing };
}

async function main() {
  const rendered = await render(
    React.createElement(NationalsPreRaceEmail, {
      email: "preview@example.com",
    })
  );

  const { html, missing } = inlineLocalPreviewImages(rendered);
  const outPath = resolve(__dirname, "nationals-pre-race-preview.html");
  writeFileSync(outPath, html);

  console.log(`Preview written to ${outPath}`);
  if (missing.length) {
    console.log("\nImages not yet available (will show as broken in preview):");
    for (const path of missing) console.log(`  - ${path}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
