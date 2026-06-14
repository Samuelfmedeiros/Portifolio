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
    topics: ["featured", "web"],
    pushed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    imageGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    hasDemo: true,
    icon: "🐾",
    imageUrl: "/projects/seu.pet.gif",
  },
  {
    id: 1001,
    name: "simon-game",
    description:
      "Jogo clássico de memorização de sequência de cores. Repita a sequência para pontuar!",
    html_url: "https://github.com/Samuelfmedeiros/simon-game",
    homepage: "https://samuelfmedeiros.github.io/simon-game",
    stargazers_count: 0,
    forks_count: 0,
    language: "JavaScript",
    topics: ["game", "react"],
    pushed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    imageGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    hasDemo: false,
    icon: "🧠",
  },
  {
    id: 1002,
    name: "asteroid-dodge",
    description:
      "Jogo de desviar de asteroides. Controle a nave com o mouse e sobreviva o máximo possível!",
    html_url: "https://github.com/Samuelfmedeiros/asteroid-dodge",
    homepage: "https://samuelfmedeiros.github.io/asteroid-dodge",
    stargazers_count: 0,
    forks_count: 0,
    language: "JavaScript",
    topics: ["game", "react"],
    pushed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    imageGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    hasDemo: false,
    icon: "🚀",
  },
  {
    id: 1003,
    name: "code-typing",
    description:
      "Desafio de digitação de código. Digite snippets de várias linguagens o mais rápido possível!",
    html_url: "https://github.com/Samuelfmedeiros/code-typing",
    homepage: "https://samuelfmedeiros.github.io/code-typing",
    stargazers_count: 0,
    forks_count: 0,
    language: "JavaScript",
    topics: ["game", "react"],
    pushed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    imageGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    hasDemo: false,
    icon: "⌨️",
  },
  {
    id: 1004,
    name: "memory-matrix",
    description:
      "Jogo de memória visual. Memorize as células destacadas e recrie o padrão!",
    html_url: "https://github.com/Samuelfmedeiros/memory-matrix",
    homepage: "https://samuelfmedeiros.github.io/memory-matrix",
    stargazers_count: 0,
    forks_count: 0,
    language: "JavaScript",
    topics: ["game", "react"],
    pushed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    imageGradient: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
    hasDemo: false,
    icon: "🔲",
  },
  // NOTA: DogWalk removido — projeto está em fase de reformulação
];

export const FEATURED_PROJECTS = ["portifolio", "seu.pet", "simon-game", "asteroid-dodge", "code-typing", "memory-matrix"];
export const GAME_PROJECTS = ["simon-game", "asteroid-dodge", "code-typing", "memory-matrix"];
