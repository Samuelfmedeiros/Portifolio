"use client";

import { motion } from "framer-motion";
import { Briefcase, ExternalLink } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { STRIPE_CONSULTING_CONFIG } from "@/lib/stripe-consulting";

/**
 * Botão "Consultoria Técnica" — link direto pro Stripe Payment Link
 */
export function ConsultingButton() {
  const { track } = useAnalytics();
  if (!STRIPE_CONSULTING_CONFIG.enabled) return null;

  return (
    <motion.a
      href={STRIPE_CONSULTING_CONFIG.paymentLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track({ type: "external_link", url: STRIPE_CONSULTING_CONFIG.paymentLink, label: "Consultoria Técnica" })}
      className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-semibold
        bg-gradient-to-r from-[var(--accent)]/10 to-transparent
        border border-[var(--border)]/60 hover:border-[var(--accent)]/50
        text-[var(--text-secondary)] hover:text-[var(--accent)]
        shadow-lg hover:shadow-[var(--accent)]/10
        transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Briefcase className="w-4 h-4 relative z-10" />
      <span className="relative z-10">Consultoria Técnica</span>
      <ExternalLink className="w-3 h-3 relative z-10 text-[var(--text-secondary)]/60 group-hover:text-[var(--accent)]" />
    </motion.a>
  );
}
