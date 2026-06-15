"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, GitFork, Calendar, Grid3X3, List } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Repo } from "@/lib/types";
import { useAnalytics } from "@/hooks/useAnalytics";

// Language color map
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

// Tech tag colors
const getTagStyle = (tech: string) => {
  const lower = tech.toLowerCase();
  if (["next.js", "react", "next"].includes(lower)) return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  if (["supabase", "postgresql", "sql"].includes(lower)) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (["python", "pandas"].includes(lower)) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  if (["tailwind", "css", "html"].includes(lower)) return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  if (["docker", "cloudflare"].includes(lower)) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (["game", "react"].includes(lower)) return "bg-pink-500/15 text-pink-400 border-pink-500/30";
  return "bg-[var(--border)]/50 text-[var(--text-secondary)] border-[var(--border)]/30";
};

const GAME_GRADIENTS: Record<string, string> = {
  "simon-game": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "asteroid-dodge": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "code-typing": "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "memory-matrix": "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
};

function GameCard({ repo }: { repo: Repo }) {
  const gradient = repo.imageGradient || GAME_GRADIENTS[repo.name] || "linear-gradient(135deg, var(--accent) 0%, var(--accent-alt, #7c3aed) 100%)";
  const updated = repo.pushed_at
    ? new Date(repo.pushed_at).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
    : null;

  return (
    <GlassCard className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent-alt)]/5" />

      {/* Header with gradient + icon */}
      <div className="relative h-[100px] w-full flex items-center justify-center" style={{ background: gradient }}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_60%)]" />
        {repo.icon ? (
          <span className="text-3xl relative z-10 drop-shadow-lg">{repo.icon}</span>
        ) : (
          <span className="font-mono text-lg font-bold text-white/90 tracking-wider drop-shadow-lg relative z-10">{repo.name}</span>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--card-bg,#0a0a1a)] to-transparent" />
      </div>

      <div className="p-3">
        {/* Name */}
        <p className="text-xs font-mono font-semibold text-[var(--text-primary)] mb-1 truncate">
          {repo.name}
        </p>

        {/* Description */}
        <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
          {repo.description || "No description provided"}
        </p>

        {/* Tech tags */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {repo.topics.filter(t => t !== "featured").slice(0, 4).map((tag) => (
              <span key={tag} className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${getTagStyle(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] mb-2 pb-2 border-b border-[var(--border)]/30">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANG_COLORS[repo.language] || "var(--accent)" }} />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-0.5"><Star className="w-3 h-3" /> {repo.stargazers_count}</span>
          <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>
          {updated && <span className="flex items-center gap-0.5 ml-auto"><Calendar className="w-3 h-3" /> {updated}</span>}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {repo.html_url && (
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-mono text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> REPO
            </a>
          )}
          {repo.homepage && (
            <a href={repo.homepage} target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-mono text-[var(--accent-alt)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> DEMO
            </a>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export function GameShowcase({ repos }: { repos: Repo[] }) {
  const [activeTab, setActiveTab] = useState(repos[0]?.name || "");
  const [showAll, setShowAll] = useState(false);
  const { track } = useAnalytics();

  // Determine if mobile via CSS class toggle
  const showAsTabs = !showAll;

  if (!repos || repos.length === 0) return null;

  const activeRepo = repos.find((r) => r.name === activeTab) || repos[0];

  return (
    <div className="py-6 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl font-mono text-[var(--accent)]"
          >
            🎮 JOGOS
          </motion.h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs border border-[var(--border)]/50 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all"
          >
            {showAll ? <List className="w-3 h-3" /> : <Grid3X3 className="w-3 h-3" />}
            {showAll ? "Ver um por vez" : "Ver todos"}
          </button>
        </div>

        {/* Tab bar (always visible for navigation) */}
        <div className="flex gap-1 mb-4 bg-[var(--bg-primary)]/30 rounded-lg p-1 overflow-x-auto hide-scrollbar">
          {repos.map((repo) => (
            <button
              key={repo.name}
              onClick={() => { setActiveTab(repo.name); setShowAll(false); track({ type: "game_play", game: repo.name }); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition-all shrink-0 whitespace-nowrap ${
                !showAll && activeTab === repo.name
                  ? "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/30"
              }`}
            >
              <span>{repo.icon || "🎮"}</span>
              <span>{repo.name}</span>
            </button>
          ))}
        </div>

        {/* Content: Tab view */}
        {showAsTabs && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRepo.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-md mx-auto"
            >
              <GameCard repo={activeRepo} />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Content: Grid view */}
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {repos.map((repo, i) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GameCard repo={repo} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {repos.length === 0 && (
          <p className="text-center font-mono text-sm text-[var(--text-secondary)] py-8">
            Nenhum jogo encontrado
          </p>
        )}
      </div>
    </div>
  );
}
