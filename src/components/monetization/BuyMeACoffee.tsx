"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { BMC_CONFIG } from "@/lib/monetization";

/**
 * Buy Me a Coffee — discrete support button.
 * Renders a small, themed button that links to BMC page.
 * No tracking, no cookies — just a link.
 * Always visible (does NOT require ad consent — it's a donation link, not an ad).
 */
export function BuyMeACoffee({ className = "" }: { className?: string }) {
  if (!BMC_CONFIG.enabled) return null;

  return (
    <motion.a
      href={BMC_CONFIG.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Apoie meu trabalho no Buy Me a Coffee"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs
        border border-[var(--border)]/50
        bg-[var(--bg-primary)]/50 hover:bg-[var(--accent)]/10
        text-[var(--text-secondary)] hover:text-[var(--accent)]
        transition-all duration-200 group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <Coffee className="w-3.5 h-3.5 group-hover:text-amber-500 transition-colors" />
      <span>Apoie</span>
    </motion.a>
  );
}

/**
 * Compact BMC icon-only version — for tight spaces.
 * Renders ONLY the icon (no <a> wrapper) so it can be nested inside
 * an existing <a> without creating invalid nested <a> elements.
 */
export function BuyMeACoffeeIcon({ className = "" }: { className?: string }) {
  if (!BMC_CONFIG.enabled) return null;

  return (
    <Coffee
      className={`w-4 h-4 text-[var(--text-secondary)] hover:text-amber-500 transition-colors ${className}`}
    />
  );
}
