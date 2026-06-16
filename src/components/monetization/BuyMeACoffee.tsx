"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { BMC_CONFIG } from "@/lib/monetization";

/**
 * Buy Me a Coffee — apoio voluntário.
 * Botão visível que convida a apoiar o desenvolvimento open-source.
 * Sem tracking, sem cookies — apenas um link de doação.
 * Sempre visível (não requer consentimento de anúncios).
 */
export function BuyMeACoffee({ className = "" }: { className?: string }) {
  if (!BMC_CONFIG.enabled) return null;

  return (
    <motion.a
      href={BMC_CONFIG.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Apoie meu trabalho no Buy Me a Coffee"
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-sm
        border border-[var(--border)]/60
        bg-gradient-to-r from-[var(--bg-primary)]/80 to-[var(--bg-secondary)]/80
        hover:from-amber-500/10 hover:to-amber-600/5
        text-[var(--text-primary)] hover:text-amber-400
        shadow-sm hover:shadow-amber-500/10
        transition-all duration-300 group ${className}`}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
    >
      <Coffee className="w-5 h-5 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
      <span className="font-medium">Apoie meu trabalho</span>
      <span className="text-[var(--text-muted)] text-xs hidden sm:inline">
        — Buy Me a Coffee
      </span>
      <svg className="w-3 h-3 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
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
