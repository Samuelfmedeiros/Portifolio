import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mission Control — Samuel Andrade",
    short_name: "Mission Control",
    description: "Portfólio profissional — Analista de Dados & Produto",
    start_url: "/mission-control/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#22d3ee",
    icons: [
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
