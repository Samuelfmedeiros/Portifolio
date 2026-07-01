"use client";

import { motion } from "framer-motion";
import { Briefcase, ExternalLink } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { STRIPE_CONSULTING_CONFIG } from "@/lib/stripe-consulting";
import { MP_CONSULTING_CONFIG } from "@/lib/mercadopago-consulting";

/**
 * Seletor de Gateway para Consultoria Técnica.
 *
 * Mostra botões lado a lado para cada gateway habilitado:
 * - Stripe (cartão internacional)
 * - Mercado Pago (Pix, Boleto, Cartão Brasil)
 *
 * Se apenas um gateway estiver configurado, mostra só ele (compatibilidade reversa).
 */
export function ConsultingButton() {
  const { track } = useAnalytics();
  const stripeEnabled = STRIPE_CONSULTING_CONFIG.enabled;
  const mpEnabled = MP_CONSULTING_CONFIG.enabled;

  // Nenhum gateway configurado — não renderiza nada
  if (!stripeEnabled && !mpEnabled) return null;

  // Apenas Stripe configurado — botão único (compatibilidade reversa)
  if (stripeEnabled && !mpEnabled) {
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

  // Apenas MP configurado — botão único
  if (!stripeEnabled && mpEnabled) {
    return (
      <motion.a
        href={MP_CONSULTING_CONFIG.paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ type: "external_link", url: MP_CONSULTING_CONFIG.paymentLink, label: "Consultoria MP" })}
        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-semibold
          bg-gradient-to-r from-[#00B5E2]/10 to-transparent
          border border-[#00B5E2]/60 hover:border-[#00B5E2]/50
          text-[var(--text-secondary)] hover:text-[#00B5E2]
          shadow-lg hover:shadow-[#00B5E2]/10
          transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#00B5E2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Briefcase className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Consultoria Técnica</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00B5E2]/15 text-[#00B5E2] relative z-10">
          Pix, Boleto, Cartão
        </span>
        <ExternalLink className="w-3 h-3 relative z-10 text-[var(--text-secondary)]/60 group-hover:text-[#00B5E2]" />
      </motion.a>
    );
  }

  // Ambos configurados — dual gateway lado a lado
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* Stripe */}
      <motion.a
        href={STRIPE_CONSULTING_CONFIG.paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ type: "external_link", url: STRIPE_CONSULTING_CONFIG.paymentLink, label: "Consultoria Stripe" })}
        className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-sm font-semibold
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
        <span className="relative z-10">Cartão (Internacional)</span>
      </motion.a>

      {/* Mercado Pago */}
      <motion.a
        href={MP_CONSULTING_CONFIG.paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ type: "external_link", url: MP_CONSULTING_CONFIG.paymentLink, label: "Consultoria MP" })}
        className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-sm font-semibold
          bg-gradient-to-r from-[#00B5E2]/10 to-transparent
          border border-[#00B5E2]/40 hover:border-[#00B5E2]/60
          text-[var(--text-secondary)] hover:text-[#00B5E2]
          shadow-lg hover:shadow-[#00B5E2]/10
          transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#00B5E2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Briefcase className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Pix, Boleto, Cartão</span>
      </motion.a>
    </div>
  );
}
