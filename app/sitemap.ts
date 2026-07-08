import type { MetadataRoute } from "next";

const siteUrl = "https://patrickwingert.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-08");

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/schedule`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sponsors`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/team`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
