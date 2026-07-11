import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GameShowcase } from "./GameShowcase";
import { LanguageContext } from "@/lib/i18n";
import type { ReactNode } from "react";
import type { Repo } from "@/lib/types";
import React from "react";

// Mock monetization to avoid import issues
vi.mock("@/lib/monetization", () => ({
  getProjectAffiliates: () => [],
}));

// Wrapper with i18n mock translations
function I18nWrapper({ children }: { children: ReactNode }) {
  const t = (key: string, fallback?: string) =>
    ({
      "games.section.title": "▸ JOGOS",
      "games.play": "Jogar",
      "games.loading": "Carregando jogo...",
      "games.embed.close": "Fechar",
      "games.scroll.left": "Esquerda",
      "games.scroll.right": "Direita",
    })[key] ?? fallback ?? key;

  return React.createElement(
    LanguageContext.Provider,
    { value: { locale: "pt" as const, setLocale: () => {}, toggle: () => {}, t } },
    children
  );
}

describe("GameShowcase", () => {
  const gameRepos: Repo[] = [
    {
      id: 1001,
      name: "memory-matrix",
      description: "Jogo de memória visual.",
      html_url: "https://github.com/Samuelfmedeiros/memory-matrix",
      homepage: "/games/memory-matrix/index.html",
      stargazers_count: 0,
      forks_count: 0,
      language: "JavaScript",
      topics: ["game", "react"],
      pushed_at: "2024-01-01",
      created_at: "2024-01-01",
      imageGradient: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
      hasDemo: false,
      icon: "🔲",
    },
    {
      id: 1002,
      name: "simon-game",
      description: "Jogo clássico de memorização.",
      html_url: "https://github.com/Samuelfmedeiros/simon-game",
      homepage: "/games/simon-game/index.html",
      stargazers_count: 0,
      forks_count: 0,
      language: "JavaScript",
      topics: ["game", "react"],
      pushed_at: "2024-01-01",
      created_at: "2024-01-01",
      imageGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      hasDemo: false,
      icon: "🧠",
    },
    {
      id: 1005,
      name: "asteroid-dodge",
      description: "Jogo de desviar de asteroides.",
      html_url: "https://github.com/Samuelfmedeiros/asteroid-dodge",
      homepage: "/games/asteroid-dodge/index.html",
      stargazers_count: 0,
      forks_count: 0,
      language: "JavaScript",
      topics: ["game", "react"],
      pushed_at: "2024-01-01",
      created_at: "2024-01-01",
      imageGradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      hasDemo: false,
      icon: "🚀",
    },
  ];

  const renderWithI18n = (ui: ReactNode) => render(<I18nWrapper>{ui}</I18nWrapper>);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns nothing when repos array is empty", () => {
    const { container } = renderWithI18n(<GameShowcase repos={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders section with game title", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    expect(screen.getByText("▸ JOGOS")).toBeInTheDocument();
  });

  it("renders all game card names", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    expect(screen.getByText("memory-matrix")).toBeInTheDocument();
    expect(screen.getByText("simon-game")).toBeInTheDocument();
    expect(screen.getByText("asteroid-dodge")).toBeInTheDocument();
  });

  it("renders game cover images with correct src", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(3);

    const srcs = images.map((img) => img.getAttribute("src"));
    expect(srcs).toContain("/games/memory-matrix.webp");
    expect(srcs).toContain("/games/simon-game.webp");
    expect(srcs).toContain("/games/asteroid-dodge.webp");
  });

  it("renders game cover images with lazy loading", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  it("renders game cover images as non-draggable", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("draggable", "false");
    });
  });

  it("uses icon fallback when no game image available", () => {
    const customRepos: Repo[] = [
      {
        id: 9999,
        name: "custom-game",
        description: "A custom game without cover image",
        html_url: "",
        homepage: null,
        stargazers_count: 0,
        forks_count: 0,
        language: "TypeScript",
        topics: ["game"],
        pushed_at: "2024-01-01",
        created_at: "2024-01-01",
        icon: "🎮",
      },
    ];

    renderWithI18n(<GameShowcase repos={customRepos} />);
    // Should NOT render an img tag for unknown games
    const images = screen.queryAllByRole("img");
    const gameImgs = images.filter((img) => img.getAttribute("src")?.startsWith("/games/"));
    expect(gameImgs.length).toBe(0);
    // Should show the icon emoji
    expect(screen.getByText(/\uD83C\uDFAE/)).toBeInTheDocument();
    // Should show the game name (there are 2 matches: card header + button label)
    expect(screen.getAllByText("custom-game").length).toBeGreaterThanOrEqual(1);
  });

  it("has left and right scroll buttons", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    const leftBtn = screen.getByLabelText("Esquerda");
    const rightBtn = screen.getByLabelText("Direita");
    expect(leftBtn).toBeTruthy();
    expect(rightBtn).toBeTruthy();
  });

  it("renders each game card with a Play button overlay", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    // The text is rendered as "▶ Jogar", use regex
    const playLabels = screen.getAllByText(/Jogar/);
    expect(playLabels.length).toBe(3);
  });

  it("shows the embed section when a game is clicked", async () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);

    const embedSection = document.querySelector("[data-game-section]");
    expect(embedSection).toBeTruthy();
    expect((embedSection as HTMLElement).style.display).toBe("none");

    const gameBtn = document.querySelector('[data-game-btn="memory-matrix"]');
    expect(gameBtn).toBeTruthy();

    if (gameBtn) {
      fireEvent.click(gameBtn);
    }

    await waitFor(() => {
      expect((embedSection as HTMLElement).style.display).toBe("block");
    });
  });

  it("shows game title when embed is opened", async () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);

    const gameBtn = document.querySelector('[data-game-btn="simon-game"]');
    if (gameBtn) {
      fireEvent.click(gameBtn);
    }

    await waitFor(() => {
      const titleEl = document.querySelector("[data-game-title]");
      expect(titleEl?.textContent).toBe("simon-game");
    });
  });

  it("creates an iframe inside the embed container when game is clicked", async () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);

    const gameBtn = document.querySelector('[data-game-btn="memory-matrix"]');
    if (gameBtn) {
      fireEvent.click(gameBtn);
    }

    await waitFor(() => {
      const container = document.querySelector("[data-game-container]");
      const iframe = container?.querySelector("iframe");
      expect(iframe).toBeTruthy();
      expect(iframe?.src).toContain("/api/game/memory-matrix");
    });
  });

  it("sets iframe title to game name", async () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);

    const gameBtn = document.querySelector('[data-game-btn="asteroid-dodge"]');
    if (gameBtn) {
      fireEvent.click(gameBtn);
    }

    await waitFor(() => {
      const container = document.querySelector("[data-game-container]");
      const iframe = container?.querySelector("iframe");
      expect(iframe?.title).toBe("asteroid-dodge");
    });
  });

  it("shows loading state when game starts loading", async () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);

    expect(screen.queryByText("Carregando jogo...")).not.toBeInTheDocument();

    const gameBtn = document.querySelector('[data-game-btn="memory-matrix"]');
    if (gameBtn) {
      fireEvent.click(gameBtn);
    }

    await waitFor(() => {
      expect(screen.getByText("Carregando jogo...")).toBeInTheDocument();
    });
  });

  it("hides embed when close button is clicked", async () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);

    const gameBtn = document.querySelector('[data-game-btn="simon-game"]');
    if (gameBtn) {
      fireEvent.click(gameBtn);
    }

    await waitFor(() => {
      expect(screen.getByLabelText("Fechar")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Fechar"));

    const embedSection = document.querySelector("[data-game-section]");
    expect((embedSection as HTMLElement).style.display).toBe("none");
  });

  it("left scroll button scrolls the container", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    const leftBtn = screen.getByLabelText("Esquerda");
    fireEvent.click(leftBtn);
    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalled();
  });

  it("right scroll button scrolls the container", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    const rightBtn = screen.getByLabelText("Direita");
    fireEvent.click(rightBtn);
    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalled();
  });

  it("renders repo link for each game", () => {
    renderWithI18n(<GameShowcase repos={gameRepos} />);
    const links = screen.getAllByText("repo");
    expect(links.length).toBe(3);
    links.forEach((link) => {
      expect(link.closest("a")).toHaveAttribute("href");
    });
  });

  it("all 5 game images exist in GAME_IMAGES map in production", () => {
    const expectedGames = [
      "simon-game",
      "asteroid-dodge",
      "code-typing",
      "memory-matrix",
      "terminal",
    ];

    const allFive: Repo[] = expectedGames.map((name, i) => ({
      id: 2000 + i,
      name,
      description: `Game ${name}`,
      html_url: `https://github.com/Samuelfmedeiros/${name}`,
      homepage: `/games/${name}/index.html`,
      stargazers_count: 0,
      forks_count: 0,
      language: "JavaScript",
      topics: ["game"],
      pushed_at: "2024-01-01",
      created_at: "2024-01-01",
    }));

    renderWithI18n(<GameShowcase repos={allFive} />);

    expectedGames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(5);
  });
});
