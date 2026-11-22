"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/lib/i18n";

/**
 * Botão "Serviço" — leva para a página de oferta de automação com IA (/servico).
 *
 * Fica na mesma fileira de "Apoiar" (SupportButton) e "Consultoria Técnica"
 * (ConsultingButton), no bloco `role="region" aria-label="Apoio e consultoria"`
 * do layout. A diferença de intenção: Apoiar é contribuição, Consultoria é
 * pagamento avulso por hora, Serviço é a oferta de pacote (diagnóstico +
 * automação). Por isso o realce de acento no texto, mantendo a mesma geometria
 * dos irmãos (px-6 py-3 rounded-xl, borda de var(--border), motion 1.04).
 */
export function ServicoButton() {
  const { track } = useAnalytics();
  const { t } = useLanguage();

  return (
    <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
      <Link
        href="/servico"
        data-testid="servico-button"
        onClick={() =>
          track({ type: "external_link", url: "/servico", label: t("monetization.servico", "Serviço") })
        }
        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-semibold
          bg-gradient-to-r from-[var(--accent)]/15 to-transparent
          border border-[var(--accent)]/40 hover:border-[var(--accent)]/70
          text-[var(--accent)] hover:text-[var(--accent)]
          shadow-lg hover:shadow-[var(--accent)]/20
          transition-all duration-300 overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Sparkles className="w-4 h-4 relative z-10" />
        <span className="relative z-10">{t("monetization.servico", "Serviço")}</span>
        <ArrowRight className="w-3 h-3 relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </Link>
    </motion.div>
  );
}
