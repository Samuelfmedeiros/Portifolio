"use client";

import { motion } from "framer-motion";
import { CreditCard, ArrowRight, QrCode, Barcode } from "lucide-react";
import { MP_CONSULTING_CONFIG } from "@/lib/mercadopago-consulting";

/**
 * Mercado Pago Consulting CTA — "Me contrate" via Mercado Pago.
 * Links to Mercado Pago Checkout Pro for consulting services.
 * Ideal for Brazilian customers (Pix, Boleto, Cartão parcelado).
 * Tracks clicks via Umami data attribute.
 */
export function MpConsultingCTA({ className = "" }: { className?: string }) {
  if (!MP_CONSULTING_CONFIG.enabled) return null;

  return (
    <motion.a
      href={MP_CONSULTING_CONFIG.paymentLink}
      target="_blank"
      rel="noopener noreferrer"
      data-umami-event="click-consulting-mp"
      aria-label="Solicitar orçamento de consultoria via Mercado Pago"
      className={`group relative inline-flex items-center gap-3 px-6 py-3 rounded-xl font-sans text-sm font-semibold
        bg-gradient-to-r from-[#00B5E2]/20 to-[#009EE3]/5
        border border-[#00B5E2]/40 hover:border-[#00B5E2]/70
        text-[#00B5E2] hover:text-white
        shadow-lg shadow-[#00B5E2]/10 hover:shadow-[#00B5E2]/25
        transition-all duration-300 overflow-hidden ${className}`}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Background glow on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-[#00B5E2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Band-eirinhas de métodos de pagamento MP */}
      <span className="relative z-10 flex items-center gap-1">
        <QrCode className="w-4 h-4" />
        <Barcode className="w-4 h-4" />
        <CreditCard className="w-4 h-4" />
      </span>
      <span className="relative z-10">Mercado Pago</span>
      <span className="relative z-10 text-[#00B5E2]/60 group-hover:text-white/70 text-xs hidden sm:inline">
        — Pix, Boleto, Cartão
      </span>
      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />

      {/* Animated border glow */}
      <span className="absolute inset-0 rounded-xl border border-[#00B5E2]/0 group-hover:border-[#00B5E2]/50 transition-all duration-500" />
    </motion.a>
  );
}

/**
 * Compact icon-only version for tight spaces (footer, navbar).
 * Renders ONLY the MP icon so it can be nested inside an existing <a>.
 */
export function MpConsultingIcon({ className = "" }: { className?: string }) {
  if (!MP_CONSULTING_CONFIG.enabled) return null;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <QrCode className="w-3 h-3" />
      <Barcode className="w-3 h-3" />
      <CreditCard className="w-4 h-4 text-[var(--text-secondary)] hover:text-[#00B5E2] transition-colors" />
    </span>
  );
}
