"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { GITHUB_SPONSORS_CONFIG } from "@/lib/monetization";

/**
 * GitHub Sponsors badge — discrete "Sponsor me" link.
 * Always visible (donation link, not ad — no consent needed).
 */
export function GitHubSponsors({ className = "" }: { className?: string }) {
  if (!GITHUB_SPONSORS_CONFIG.enabled) return null;

  return (
    <motion.a
      href={GITHUB_SPONSORS_CONFIG.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Patrocine no GitHub Sponsors"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs
        border border-[var(--border)]/50
        bg-[var(--bg-primary)]/50 hover:bg-pink-500/10
        text-[var(--text-secondary)] hover:text-pink-400
        transition-all duration-200 group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <Heart className="w-3.5 h-3.5 group-hover:text-pink-500 transition-colors" />
      <span>Patrocine</span>
    </motion.a>
  );
}

/**
 * Compact icon-only version for tight spaces.
 * Renders ONLY the icon (no <a> wrapper) so it can be nested inside
 * an existing <a> without creating invalid nested <a> elements.
 */
export function GitHubSponsorsIcon({ className = "" }: { className?: string }) {
  if (!GITHUB_SPONSORS_CONFIG.enabled) return null;

  return (
    <Heart
      className={`w-4 h-4 text-[var(--text-secondary)] hover:text-pink-500 transition-colors ${className}`}
    />
  );
}
