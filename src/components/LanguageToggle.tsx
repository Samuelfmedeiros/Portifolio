"use client";

import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

export const LanguageToggle = memo(function LanguageToggle() {
  const { locale, toggle } = useLanguage();
  const { t } = useLanguage();
  const [hover, setHover] = useState(false);
  const next = locale === "pt" ? "EN" : "PT";

  return (
    <div className="relative">
      {hover && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-[var(--accent)]/70"
        >
          {next}
        </motion.span>
      )}

      <motion.button
        onClick={toggle}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="glass p-2 rounded-full min-w-[36px] flex items-center justify-center"
        aria-label={locale === "pt" ? t("aria.language.toggle") : "Mudar para português"}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={locale}
            initial={{ opacity: 0, scale: 0.5, y: locale === "pt" ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: locale === "pt" ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] font-bold font-mono text-[var(--accent)] tabular-nums tracking-wider"
          >
            {locale === "pt" ? "PT" : "EN"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
});
