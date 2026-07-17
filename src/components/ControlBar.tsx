"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { PALETTES } from "@/lib/palettes";
import { useLanguage } from "@/lib/i18n";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * ControlBar — unified controls for theme, palette, and language.
 *
 * Renders inline in the navbar (left side), replacing 3 separate
 * popover/dropdown controls. Everything visible at a glance.
 *
 * Design goals:
 * - Minimalist but NOT small (touch-friendly targets)
 * - No hover-only tooltips (they don't work on mobile)
 * - No breaking/overflow even on narrow screens
 * - Inline radio group for palettes (no popover)
 *
 * Layout: [theme toggle] [6 palette dots] [lang toggle]
 */
export const ControlBar = memo(function ControlBar() {
  const { theme, toggle } = useTheme();
  const { palette, setPalette } = useTheme();
  const { locale, toggle: toggleLang } = useLanguage();
  const { t } = useLanguage();
  const { track } = useAnalytics();

  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2 shrink-0"
      role="toolbar"
      aria-label={t("controlbar.aria", "Appearance controls")}
    >
      {/* ─── Theme Toggle ─── */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="glass p-2 rounded-full min-h-[36px] min-w-[36px] flex items-center justify-center"
        aria-label={
          theme === "dark"
            ? t("aria.theme.light", "Activate light mode")
            : t("aria.theme.dark", "Activate dark mode")
        }
        title={
          theme === "dark"
            ? t("controlbar.light", "Light")
            : t("controlbar.dark", "Dark")
        }
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
              <Sun className="w-5 h-5 text-[var(--accent)]" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-5 h-5 text-[var(--accent)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ─── Divider ─── */}
      <div className="w-px h-5 bg-[var(--border)]/40 shrink-0" aria-hidden="true" />

      {/* ─── Palette Swatches (inline, no popover) ─── */}
      <div
        className="flex items-center gap-1.5"
        role="radiogroup"
        aria-label={t("controlbar.palette", "Color palette")}
      >
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
              className={`w-5 h-5 rounded-full border-2 transition-all min-h-[20px] min-w-[20px] ${
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
      <div className="w-px h-5 bg-[var(--border)]/40 shrink-0" aria-hidden="true" />

      {/* ─── Language Toggle ─── */}
      <motion.button
        onClick={toggleLang}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="glass px-2.5 py-2 rounded-full min-h-[36px] flex items-center justify-center"
        aria-label={
          locale === "pt"
            ? t("aria.language.en", "Switch to English")
            : t("aria.language.pt", "Switch to Portuguese")
        }
        title={locale === "pt" ? "EN" : "PT"}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={locale}
            initial={{ opacity: 0, scale: 0.5, y: locale === "pt" ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: locale === "pt" ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-bold font-mono text-[var(--accent)] tabular-nums tracking-wider"
          >
            {locale === "pt" ? "PT" : "EN"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
});
