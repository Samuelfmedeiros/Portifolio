import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/types";

export const dynamic = "force-static";

const GAMES = [
  "memory-matrix",
  "simon-game",
  "code-typing",
  "terminal",
  "asteroid-dodge",
] as const;

// Data de geracao do sitemap no build. Antes era um literal fixo
// (2026-07-07) que mentia para o crawler: o sitemap parecia congelado
// desde julho mesmo com o site mudando.
const buildDate = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = buildDate;

  const pages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/termos`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const games: MetadataRoute.Sitemap = GAMES.map((game) => ({
    url: `${SITE_URL}/games/${game}/index.html`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...games];
}
