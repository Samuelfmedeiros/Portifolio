"use client";

import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";
import { STRIPE_CONSULTING_CONFIG } from "@/lib/stripe-consulting";

/**
 * Stripe Consulting CTA — "Me contrate" button.
 * Links to Stripe Payment Link for consulting services.
 * Always visible (no consent needed — it's a service offering, not an ad).
 * Tracks clicks via Umami data attribute.
 */
export function StripeConsultingCTA({ className = "" }: { className?: string }) {
  if (!STRIPE_CONSULTING_CONFIG.enabled) return null;

  return (
    <motion.a
      href={STRIPE_CONSULTING_CONFIG.paymentLink}
      target="_blank"
      rel="noopener noreferrer"
      data-umami-event="click-consulting-cta"
      aria-label="Solicitar orçamento de consultoria"
      className={`group relative inline-flex items-center gap-3 px-6 py-3 rounded-xl font-sans text-sm font-semibold
        bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5
        border border-[var(--accent)]/40 hover:border-[var(--accent)]/70
        text-[var(--accent)] hover:text-white
        shadow-lg shadow-[var(--accent)]/10 hover:shadow-[var(--accent)]/25
        transition-all duration-300 overflow-hidden ${className}`}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Background glow on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Briefcase className="w-5 h-5 relative z-10" />
      <span className="relative z-10">Me contrate</span>
      <span className="relative z-10 text-[var(--accent)]/60 group-hover:text-white/70 text-xs hidden sm:inline">
        — Solicitar orçamento
      </span>
      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />

      {/* Animated border glow */}
      <span className="absolute inset-0 rounded-xl border border-[var(--accent)]/0 group-hover:border-[var(--accent)]/50 transition-all duration-500" />
    </motion.a>
  );
}

/**
 * Compact icon-only version for tight spaces (footer, navbar).
 * Renders ONLY the icon so it can be nested inside an existing <a>.
 */
export function StripeConsultingIcon({ className = "" }: { className?: string }) {
  if (!STRIPE_CONSULTING_CONFIG.enabled) return null;

  return (
    <Briefcase
      className={`w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors ${className}`}
    />
  );
}
