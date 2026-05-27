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
  {
    id: 999002,
    name: "DogWalk",
    description:
      "App de passeio pet com integração ao Dashboard PataPass.",
    html_url: "https://github.com/Samuelfmedeiros/dog-walk",
    homepage: "https://patapass.pages.dev/",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    topics: ["featured"],
    pushed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    imageGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    hasDemo: true,
  },
];

export const FEATURED_PROJECTS = ["DogWalk", "mission-control", "seu.pet"];
