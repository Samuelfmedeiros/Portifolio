"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Repo } from "@/lib/types";
import { useAnalytics } from "@/hooks/useAnalytics";

// Imagens IA — pendente de recarga da FAL.ai
const GAME_IMAGES: Record<string, string> = {};

export function GameShowcase({ repos }: { repos: Repo[] }) {
  const [playingGame, setPlayingGame] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics();

  if (!repos || repos.length === 0) return null;

  const handlePlay = (repo: Repo) => {
    setPlayingGame(repo.name);
    track({ type: "game_play", game: repo.name });
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 220;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const playingRepo = repos.find((r) => r.name === playingGame);

  return (
    <div className="py-6 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-xl font-mono text-[var(--accent)] mb-4"
        >
          🎮 JOGOS
        </motion.h2>

        {/* Horizontal scroll with arrows */}
        <div className="relative group/scroll">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--border)] flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/40"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Cards row */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory scroll-smooth"
          >
            {repos.map((repo) => {
              const imgSrc = GAME_IMAGES[repo.name];
              const gradient = repo.imageGradient || "linear-gradient(135deg, var(--accent) 0%, var(--accent-alt, #7c3aed) 100%)";

              return (
                <div
                  key={repo.name}
                  className="flex-shrink-0 w-[180px] snap-start"
                >
                  <GlassCard className="overflow-hidden group/card h-full">
                    {/* Image header */}
                    <div
                      className="relative h-[110px] w-full overflow-hidden"
                      style={
                        imgSrc
                          ? { background: gradient }
                          : { background: gradient }
                      }
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={repo.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                          <span className="text-3xl drop-shadow-lg">
                            {repo.icon || "🎮"}
                          </span>
                          <span className="text-[9px] font-mono text-white/70">
                            {repo.name}
                          </span>
                        </div>
                      )}

                      {/* Hover play overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/50 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={() => handlePlay(repo)}
                          className="opacity-0 group-hover/card:opacity-100 bg-[var(--accent)] text-[var(--bg-primary)] px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider transition-all hover:scale-110 active:scale-95 shadow-lg shadow-[var(--accent)]/30"
                        >
                          ▶ JOGAR
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--card-bg,#0a0a1a)] to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="p-2.5">
                      <p className="text-xs font-mono font-semibold text-[var(--text-primary)] truncate">
                        {repo.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1 mt-0.5 leading-relaxed">
                        {repo.description}
                      </p>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[var(--bg-primary)]/90 border border-[var(--border)] flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/40"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Game embed area */}
        <AnimatePresence>
          {playingGame && playingRepo && (
            <motion.div
              key={playingGame}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="mt-4 overflow-hidden"
            >
              <div className="relative rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-primary)]">
                {/* Top bar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-primary)]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-[var(--accent)]">
                      {playingGame}
                    </span>
                  </div>
                  <button
                    onClick={() => setPlayingGame(null)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-[var(--border)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    aria-label="Fechar jogo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Iframe for external games */}
                {playingRepo.homepage && (
                  <iframe
                    src={playingRepo.homepage}
                    className="w-full h-[450px] md:h-[550px]"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope"
                    title={playingGame}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                )}

                {/* Terminal placeholder */}
                {playingGame === "terminal" && (
                  <div className="flex items-center justify-center h-[300px] bg-[#0a0a0a]">
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">💻</span>
                      <p className="font-mono text-xs text-[var(--text-secondary)]">
                        Terminal será embutido como componente
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
