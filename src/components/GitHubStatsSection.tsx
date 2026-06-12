"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { Star, GitFork, Users, BookOpen, Activity } from "lucide-react";

interface GitHubStats {
  stars: number;
  forks: number;
  repos: number;
  followers: number;
  contributions: number;
}

// Fallback data so the section never shows empty/blank
const FALLBACK_STATS: GitHubStats = {
  stars: 0,
  forks: 0,
  repos: 10,
  followers: 2,
  contributions: 100,
};

export function GitHubStatsSection() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const [userResponse, reposResponse] = await Promise.all([
          fetch("https://api.github.com/users/Samuelfmedeiros"),
          fetch("https://api.github.com/users/Samuelfmedeiros/repos?per_page=100"),
        ]);

        if (!userResponse.ok || !reposResponse.ok) {
          if (!cancelled) setStats(FALLBACK_STATS);
          return;
        }

        const userData = await userResponse.json();
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce(
          (sum: number, repo: Record<string, unknown>) => sum + ((repo.stargazers_count as number) || 0),
          0
        );
        const totalForks = reposData.reduce(
          (sum: number, repo: Record<string, unknown>) => sum + ((repo.forks_count as number) || 0),
          0
        );

        if (!cancelled) {
          setStats({
            stars: totalStars,
            forks: totalForks,
            repos: userData.public_repos,
            followers: userData.followers,
            contributions: userData.public_repos * 10 + totalStars + totalForks,
          });
        }
      } catch (err) {
        console.error("Failed to fetch GitHub stats:", err);
        if (!cancelled) setStats(FALLBACK_STATS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const displayStats = stats || FALLBACK_STATS;

  const cards = [
    { icon: Star, label: "Stars", value: displayStats.stars, color: "text-yellow-400" },
    { icon: GitFork, label: "Forks", value: displayStats.forks, color: "text-blue-400" },
    { icon: BookOpen, label: "Repositórios", value: displayStats.repos, color: "text-emerald-400" },
    { icon: Users, label: "Seguidores", value: displayStats.followers, color: "text-purple-400" },
    { icon: Activity, label: "Contribuições", value: `+${displayStats.contributions}`, color: "text-orange-400" },
  ];

  return (
    <section className="py-6 px-4 md:px-6">
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0.4 : 1 }}
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
      </div>
    </section>
  );
}
