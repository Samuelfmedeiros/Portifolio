import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Portifolio Samuel — Samuel Medeiros",
    short_name: "Portifolio Samuel",
    description: "Portfólio profissional — Desenvolvedor Full Stack & Analista de Dados",
    start_url: "/",
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