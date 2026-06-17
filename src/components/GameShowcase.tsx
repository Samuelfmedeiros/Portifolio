"use client";

import { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Repo } from "@/lib/types";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/lib/i18n";

const GAME_IMAGES: Record<string, string> = {
  "simon-game": "/games/simon-game.webp",
  "asteroid-dodge": "/games/asteroid-dodge.webp",
  "code-typing": "/games/code-typing.webp",
  "memory-matrix": "/games/memory-matrix.webp",
  "terminal": "/games/terminal.webp",
};

export function GameShowcase({ repos }: { repos: Repo[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics();
  const { t } = useLanguage();

  if (!repos || repos.length === 0) return null;

  const playGame = useCallback((name: string, url: string | null) => {
    track({ type: "game_play", game: name });
    const el = embedRef.current;
    if (!el) return;
    const match = url?.match(/\/games\/([^/]+)/);
    const apiUrl = match ? `/api/game/${match[1]}` : null;
    if (!apiUrl) return;
    const titleEl = el.querySelector("[data-game-title]");
    if (titleEl) titleEl.textContent = name;
    let iframe = el.querySelector("iframe") as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.className = "w-full h-[450px] md:h-[550px]";
      iframe.title = name;
      el.querySelector("[data-game-container]")?.appendChild(iframe);
    }
    iframe.src = apiUrl;
    el.style.display = "block";
  }, [track]);

  const closeGame = useCallback(() => {
    const el = embedRef.current;
    if (!el) return;
    el.style.display = "none";
    const iframe = el.querySelector("iframe");
    if (iframe) iframe.src = "";
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll("[data-game-btn]");
    const handleClick = (e: Event) => {
      const btn = e.currentTarget as HTMLElement;
      const name = btn.getAttribute("data-game-btn");
      const url = btn.getAttribute("data-game-url");
      if (name) playGame(name, url);
    };
    buttons.forEach((btn) => btn.addEventListener("click", handleClick));
    return () => buttons.forEach((btn) => btn.removeEventListener("click", handleClick));
  }, [playGame]);

  return (
    <div className="py-6 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-mono text-[var(--accent)] mb-4">🎮 {t("games.section.title")}</h2>
        <div className="relative">
          <button onClick={() => scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" })} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--border)] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity" aria-label={t("games.scroll.left")}><ChevronLeft className="w-3.5 h-3.5" /></button>

          <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 scroll-smooth snap-x snap-mandatory" style={{ overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}>
            {repos.map((repo) => (
              <div key={repo.name} className="flex-shrink-0 w-[180px] snap-start" style={{ touchAction: "manipulation" }}>
                <GlassCard className="overflow-hidden h-full">
                  <button data-game-btn={repo.name} data-game-url={repo.homepage || ""} className="relative h-[110px] w-full overflow-hidden block text-left cursor-pointer" style={{ background: repo.imageGradient || "linear-gradient(135deg, var(--accent) 0%, var(--accent-alt, #7c3aed) 100%)" }}>
                    {GAME_IMAGES[repo.name] ? (
                      <img src={GAME_IMAGES[repo.name]} alt={repo.name} className="w-full h-full object-cover pointer-events-none" loading="lazy" draggable={false} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 pointer-events-none">
                        <span className="text-3xl drop-shadow-lg">{repo.icon || "🎮"}</span>
                        <span className="text-[9px] font-mono text-white/70">{repo.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-white drop-shadow-lg">▶ {t("games.play")}</span>
                    </div>
                  </button>
                  <div className="p-2.5">
                    <button data-game-btn={repo.name} data-game-url={repo.homepage || ""} className="text-xs font-mono font-semibold text-[var(--text-primary)] truncate w-full text-left hover:text-[var(--accent)] transition-colors cursor-pointer">{repo.name}</button>
                    <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1 mt-0.5 leading-relaxed">{repo.description}</p>
                    {repo.html_url && (
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-0.5 mt-1.5 text-[9px] font-mono text-[var(--accent-alt)]/60 hover:text-[var(--accent)] transition-colors"
                      >
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        repo
                      </a>
                    )}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          <button onClick={() => scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" })} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--border)] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity" aria-label={t("games.scroll.right")}><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>

        <div ref={embedRef} data-game-section style={{ display: "none" }} className="mt-4">
          <div className="relative rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-primary)]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span data-game-title className="text-xs font-mono text-[var(--accent)]" />
              </div>
              <button onClick={closeGame} className="w-6 h-6 rounded flex items-center justify-center hover:bg-[var(--border)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]" aria-label={t("games.embed.close")}>✕</button>
            </div>
            <div data-game-container />
          </div>
        </div>
      </div>
    </div>
  );
}
