"use client";

import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";
import { useLanguage } from "@/lib/i18n";

export const LanguageToggle = memo(function LanguageToggle() {
  const { locale, toggle } = useLanguage();
  const { t } = useLanguage();
  const [hover, setHover] = useState(false);
  const mounted = useMounted();
  // Mostra o idioma de DESTINO (a outra língua) — assim o usuário sabe
  // que o site tem PT e EN. O idioma atual é evidente pelo texto da página.
  const next = locale === "pt" ? "EN" : "PT";
  // Nome acessível precisa CONTER o texto visível ("EN"/"PT") — WCAG 2.5.3 (label in
  // name). Só "Mudar para inglês" reprovava em label-content-name-mismatch no axe de
  // produção (4 rotas x 2 temas x 2 viewports, sério). O rótulo por dicionário já é
  // o certo em cada idioma ("Mudar para inglês" / "Switch to Portuguese").
  const ariaLabel = `${next} — ${t("aria.language.toggle")}`;

  return (
    <div className="relative">
      {hover && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-[var(--accent)]/70"
        >
          {locale === "pt" ? t("lang.toggle.en", "English") : t("lang.toggle.pt", "Português")}
        </motion.span>
      )}

      <motion.button
        onClick={toggle}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="glass p-2 rounded-full min-w-[36px] flex items-center justify-center"
        data-analytics-id="nav.lang"
        aria-label={ariaLabel}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={next}
            initial={mounted ? { opacity: 0, scale: 0.5, y: next === "EN" ? -10 : 10 } : false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: next === "EN" ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] font-bold font-mono text-[var(--accent)] tabular-nums tracking-wider"
          >
            {next}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
});
