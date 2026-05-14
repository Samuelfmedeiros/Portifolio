import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://samuelmedeiros.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
