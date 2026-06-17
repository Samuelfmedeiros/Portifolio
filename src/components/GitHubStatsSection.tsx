"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, GitFork, BookOpen, Users, Activity } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useLanguage } from "@/lib/i18n";

interface GitHubStats {
  stars: number;
  forks: number;
  repos: number;
  followers: number;
  contributions: number;
}

interface GitHubStatsSectionProps {
  stats: GitHubStats | null;
  loading: boolean;
}

export function GitHubStatsSection({ stats, loading }: GitHubStatsSectionProps) {
  const { t } = useLanguage();

  const displayStats = stats || {
    stars: 0,
    forks: 0,
    repos: 0,
    followers: 0,
    contributions: 0,
  };

  // Skeleton state when loading
  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-28 md:w-36 h-20 rounded-lg bg-[var(--bg-primary)]/30 animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    { icon: Star, labelKey: "github.stars", value: displayStats.stars, color: "text-yellow-400" },
    { icon: GitFork, labelKey: "github.forks", value: displayStats.forks, color: "text-blue-400" },
    { icon: BookOpen, labelKey: "github.repos", value: displayStats.repos, color: "text-emerald-400" },
    { icon: Users, labelKey: "github.followers", value: displayStats.followers, color: "text-purple-400" },
    { icon: Activity, labelKey: "github.contributions", value: `+${displayStats.contributions}`, color: "text-orange-400" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {items.map((item, i) => (
        <motion.div
          key={item.labelKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="w-28 md:w-36 p-3 rounded-lg bg-[var(--bg-primary)]/30 border border-[var(--border)]/50 text-center"
        >
          <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
          <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
            {item.value}
          </div>
          <div className="text-[10px] font-mono text-[var(--text-secondary)]">
            {t(item.labelKey)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
