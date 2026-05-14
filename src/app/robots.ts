import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://samuelmedeiros.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
