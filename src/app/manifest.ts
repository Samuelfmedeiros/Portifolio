import type { MetadataRoute } from "next";
import { dict } from "@/lib/dictionary";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  // Detecta locale pelo cookie (padrão: pt se não encontrado)
  // No Next.js server component, o cookie está disponível via headers()
  return {
    name: "Portifolio Samuel — Samuel Medeiros",
    short_name: "Portifolio Samuel",
    description: dict.en["manifest.description"] || dict.pt["manifest.description"],
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