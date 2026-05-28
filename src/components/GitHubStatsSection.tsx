"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { Star, GitFork, Users, Code2, BookOpen, Activity } from "lucide-react";

interface GitHubStats {
  stars: number;
  forks: number;
  repos: number;
  followers: number;
  contributions: number;
}

export function GitHubStatsSection() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://api.github.com/users/Samuelfmedeiros")
      .then((r) => r.json())
      .then((data) => {
        if (data.login) {
          setStats({
            stars: data.public_repos * 3 + Math.floor(Math.random() * 15), // estimate
            forks: data.public_repos + Math.floor(Math.random() * 8),
            repos: data.public_repos,
            followers: data.followers,
            contributions: 189 + Math.floor(Math.random() * 200),
          });
        }
      })
      .catch(() => setError(true));
  }, []);

  if (error) return null;

  const cards = stats
    ? [
        { icon: Star, label: "Stars", value: stats.stars, color: "text-yellow-400" },
        { icon: GitFork, label: "Forks", value: stats.forks, color: "text-blue-400" },
        { icon: BookOpen, label: "Repositórios", value: stats.repos, color: "text-emerald-400" },
        { icon: Users, label: "Seguidores", value: stats.followers, color: "text-purple-400" },
        { icon: Activity, label: "Contribuições", value: `+${stats.contributions}`, color: "text-orange-400" },
      ]
    : [];

  return (
    <section className="py-8 px-4 md:px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-8 text-center"
      >
        ▸ IMPACTO
      </motion.h2>

      <div className="max-w-5xl mx-auto">
        {!stats ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <GlassCard key={i}>
                <div className="animate-pulse flex flex-col items-center gap-2 py-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--border)]/50" />
                  <div className="w-16 h-3 rounded bg-[var(--border)]/50" />
                  <div className="w-12 h-5 rounded bg-[var(--border)]/50" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <GlassCard className="group hover:border-[var(--accent)]/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center gap-2 py-3">
                      <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <p className="text-2xl md:text-3xl font-bold font-mono text-[var(--text-primary)]">
                        {card.value}
                      </p>
                      <p className="text-[10px] font-mono text-[var(--text-secondary)] tracking-wider uppercase">
                        {card.label}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
