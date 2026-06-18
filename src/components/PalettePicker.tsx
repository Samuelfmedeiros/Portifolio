"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { PALETTES } from "@/lib/palettes";
import { useLanguage } from "@/lib/i18n";

export const PalettePicker = memo(function PalettePicker() {
  const { palette, setPalette } = useTheme();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  // current palette is derived from palette state

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="glass p-2 rounded-full"
        aria-label={t("palette.toggle", "Trocar paleta de cores")}
        title="Paleta de cores"
      >
        <Palette className="w-4 h-4 text-[var(--accent)]" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50"
            >
              <div className="glass rounded-xl p-3 border border-[var(--border)] shadow-lg">
                <p className="text-[10px] font-mono text-[var(--text-secondary)] tracking-wider mb-2 text-center">
                  PALETA
                </p>
                <div className="flex gap-2">
                  {PALETTES.map((p) => {
                    const isActive = p.id === palette;
                    const color = p.accentDark;
                    return (
                      <motion.button
                        key={p.id}
                        onClick={() => {
                          setPalette(p.id);
                          setOpen(false);
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-6 h-6 rounded-full border-2 transition-colors ${
                          isActive ? "border-[var(--accent)]" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={p.name}
                        title={p.name}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});
