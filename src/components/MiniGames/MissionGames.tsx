"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../GlassCard";
import { MiniGame } from "./MiniGame";
import { AsteroidDodge } from "./AsteroidDodge";
import { CodeTyping } from "./CodeTyping";
import { MemoryMatrix } from "./MemoryMatrix";

type GameTab = "simon" | "asteroid" | "typing" | "memory";

interface GameOption {
  id: GameTab;
  label: string;
  icon: string;
  component: React.ReactNode;
}

const GAMES: GameOption[] = [
  { id: "simon", label: "Sequência", icon: "🧠", component: <MiniGame /> },
  { id: "asteroid", label: "Asteroids", icon: "🚀", component: <AsteroidDodge /> },
  { id: "typing", label: "Code Type", icon: "⌨️", component: <CodeTyping /> },
  { id: "memory", label: "Memory", icon: "🔲", component: <MemoryMatrix /> },
];

export function MissionGames() {
  const [activeGame, setActiveGame] = useState<GameTab>("simon");

  const GAMES_REPO: Record<GameTab, string> = {
    simon: "https://github.com/Samuelfmedeiros/simon-game",
    asteroid: "https://github.com/Samuelfmedeiros/asteroid-dodge",
    typing: "https://github.com/Samuelfmedeiros/code-typing",
    memory: "https://github.com/Samuelfmedeiros/memory-matrix",
  };

  return (
    <div className="py-2">
      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-[var(--bg-primary)]/30 rounded-lg p-1 overflow-x-auto">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`flex-1 min-w-0 px-3 py-2 rounded-md font-mono text-xs transition-all whitespace-nowrap ${
              activeGame === game.id
                ? "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/30"
            }`}
          >
            <span className="mr-1">{game.icon}</span>
            <span className="inline sm:inline">{game.label}</span>
          </button>
        ))}
      </div>

      {/* Link ao repositório */}
      <div className="text-right mb-2">
        <a
          href={GAMES_REPO[activeGame]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-[var(--text-secondary)]/50 hover:text-[var(--accent)] transition-colors"
        >
          Ver código no GitHub →
        </a>
      </div>

      {/* Active game */}
      <GlassCard className="min-h-[280px]">
        <motion.div
          key={activeGame}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {GAMES.find((g) => g.id === activeGame)?.component}
        </motion.div>
      </GlassCard>
    </div>
  );
}
