import type { Repo } from "./types";

export const STATIC_PROJECTS: Repo[] = [
  {
    id: 999001,
    name: "seu.pet",
    description:
      "Plataforma de marketplace para serviços pet — React, Supabase, Stripe e Cloudflare.",
    html_url: "https://github.com/Samuelfmedeiros/dog-walk",
    homepage: "https://seu.pet",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    topics: ["featured"],
    pushed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const FEATURED_PROJECTS = ["DogWalk", "mission-control", "seu.pet"];
