"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { PALETTES } from "@/lib/palettes";
import { useLanguage } from "@/lib/i18n";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * ControlBar — unified control panel for theme, palette, and language.
 *
 * Renders inline in the navbar (left side), replacing 3 separate
 * dropdown/popover controls. Everything is visible at a glance.
 *
 * Layout: [theme toggle] [6 palette dots] [lang toggle]
 */
export const ControlBar = memo(function ControlBar() {
  const { theme, toggle } = useTheme();
  const { palette, setPalette } = useTheme();
  const { locale, toggle: toggleLang } = useLanguage();
  const { t } = useLanguage();
  const { track } = useAnalytics();
  const [themeHover, setThemeHover] = useState(false);
  const [langHover, setLangHover] = useState(false);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const nextLang = locale === "pt" ? "EN" : "PT";

  return (
    <div className="flex items-center gap-1.5" role="toolbar" aria-label={t("controlbar.aria", "Controles de aparência")}>
      {/* ─── Theme Toggle ─── */}
      <div className="relative">
        {themeHover && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-[var(--accent)]/70"
          >
            {nextTheme === "light" ? t("controlbar.light", "Claro") : t("controlbar.dark", "Escuro")}
          </motion.span>
        )}
        <motion.button
          onClick={toggle}
          onHoverStart={() => setThemeHover(true)}
          onHoverEnd={() => setThemeHover(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: theme === "dark" ? 0 : 180 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="glass p-1.5 rounded-full"
          aria-label={theme === "dark" ? t("aria.theme.light", "Ativar modo claro") : t("aria.theme.dark", "Ativar modo escuro")}
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="sun"
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="w-4 h-4 text-[var(--accent)]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className="w-4 h-4 text-[var(--accent)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ─── Divider ─── */}
      <div className="w-px h-5 bg-[var(--border)]/40" aria-hidden="true" />

      {/* ─── Palette Swatches (inline, no popover) ─── */}
      <div className="flex items-center gap-1" role="radiogroup" aria-label={t("controlbar.palette", "Paleta de cores")}>
        {PALETTES.map((p) => {
          const isActive = p.id === palette;
          return (
            <motion.button
              key={p.id}
              onClick={() => {
                setPalette(p.id);
                track({ type: "external_link", url: "palette", label: p.name });
              }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                isActive
                  ? "border-[var(--accent)] scale-110 shadow-sm shadow-[var(--accent)]/30"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: p.accentDark }}
              aria-label={p.name}
              title={p.name}
              role="radio"
              aria-checked={isActive}
            />
          );
        })}
      </div>

      {/* ─── Divider ─── */}
      <div className="w-px h-5 bg-[var(--border)]/40" aria-hidden="true" />

      {/* ─── Language Toggle ─── */}
      <div className="relative">
        {langHover && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-[var(--accent)]/70"
          >
            {nextLang}
          </motion.span>
        )}
        <motion.button
          onClick={toggleLang}
          onHoverStart={() => setLangHover(true)}
          onHoverEnd={() => setLangHover(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="glass p-1.5 rounded-full min-w-[30px] flex items-center justify-center"
          aria-label={locale === "pt" ? t("aria.language.en", "Mudar para inglês") : t("aria.language.pt", "Mudar para português")}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={locale}
              initial={{ opacity: 0, scale: 0.5, y: locale === "pt" ? -10 : 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: locale === "pt" ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-bold font-mono text-[var(--accent)] tabular-nums tracking-wider"
            >
              {locale === "pt" ? "PT" : "EN"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
});
