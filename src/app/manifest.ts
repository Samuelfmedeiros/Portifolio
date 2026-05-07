import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mission Control — Samuel Andrade",
    short_name: "Mission Control",
    description: "Portfólio profissional — Analista de Dados & Produto",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#22d3ee",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
