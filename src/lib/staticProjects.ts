import type { Repo } from "./types";

export const STATIC_PROJECTS: Repo[] = [
  {
    id: 999001,
    name: "seu.pet",
    description:
      "Plataforma de marketplace para serviços pet — React, Supabase, Stripe e Cloudflare.",
    html_url: null,
    homepage: "https://seu.pet",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    topics: ["featured"],
    pushed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    imageGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    hasDemo: true,
  },
  // NOTA: DogWalk removido — projeto está em fase de reformulação
];

export const FEATURED_PROJECTS = ["mission-control", "seu.pet"];
