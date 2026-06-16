"use client";

import { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Repo } from "@/lib/types";
import { useAnalytics } from "@/hooks/useAnalytics";

const GAME_IMAGES: Record<string, string> = {
  "simon-game": "/games/simon-game.png",
  "asteroid-dodge": "/games/asteroid-dodge.png",
  "code-typing": "/games/code-typing.png",
  "memory-matrix": "/games/memory-matrix.png",
  "terminal": "/games/terminal.png",
};

export function GameShowcase({ repos }: { repos: Repo[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics();

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
        <h2 className="text-xl font-mono text-[var(--accent)] mb-4">🎮 JOGOS</h2>
        <div className="relative">
          <button onClick={() => scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" })} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--border)] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity" aria-label="Esquerda"><ChevronLeft className="w-3.5 h-3.5" /></button>

          <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory scroll-smooth">
            {repos.map((repo) => (
              <div key={repo.name} className="flex-shrink-0 w-[180px] snap-start">
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
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-white drop-shadow-lg">▶ JOGAR</span>
                    </div>
                  </button>
                  <div className="p-2.5">
                    <button data-game-btn={repo.name} data-game-url={repo.homepage || ""} className="text-xs font-mono font-semibold text-[var(--text-primary)] truncate w-full text-left hover:text-[var(--accent)] transition-colors cursor-pointer">{repo.name}</button>
                    <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1 mt-0.5 leading-relaxed">{repo.description}</p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          <button onClick={() => scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" })} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--border)] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity" aria-label="Direita"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>

        <div ref={embedRef} data-game-section style={{ display: "none" }} className="mt-4">
          <div className="relative rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-primary)]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span data-game-title className="text-xs font-mono text-[var(--accent)]" />
              </div>
              <button onClick={closeGame} className="w-6 h-6 rounded flex items-center justify-center hover:bg-[var(--border)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]" aria-label="Fechar">✕</button>
            </div>
            <div data-game-container />
          </div>
        </div>
      </div>
    </div>
  );
}
