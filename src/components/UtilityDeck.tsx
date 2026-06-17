"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calculator, Gamepad2, X } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { MissionClock } from "./MissionClock";
// DataCalculator removido no cleanup
import { MiniGame } from "./MiniGames/MiniGame";
import type { Widget } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

const WIDGETS = [
  { key: "clock" as const, icon: Clock, labelKey: "utility.clock" },
  { key: "calculator" as const, icon: Calculator, labelKey: "utility.calculator" },
  { key: "game" as const, icon: Gamepad2, labelKey: "games.label.terminal" },
];

export const UtilityDeck = memo(function UtilityDeck() {
  const [activeWidget, setActiveWidget] = useState<Widget>(null);
  const { t } = useLanguage();

  return (
    <section id="utility" className="py-16 md:py-20 px-4 md:px-6">
      <h2 className="text-2xl md:text-3xl font-mono text-[var(--accent)] mb-8 md:mb-12 text-center">
        ▸ Utilitários
      </h2>

      <div className="max-w-xl mx-auto">
        <div className="grid grid-cols-3 gap-2 md:gap-4" role="group" aria-label="Utilitários">
          {WIDGETS.map(({ key, icon: Icon, labelKey }) => {
            const isActive = activeWidget === key;
            return (
              <button
                key={key}
                onClick={() => setActiveWidget(isActive ? null : key)}
                aria-expanded={isActive}
                aria-controls={`widget-${key}`}
                className={`glass p-4 md:p-6 rounded-xl text-center transition-all hover:scale-105 border-[var(--border)] ${
                  isActive ? "ring-1 ring-[var(--accent)]" : ""
                }`}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-[var(--accent)]" />
                <span className="font-mono text-[10px] md:text-xs text-[var(--text-secondary)]">{t(labelKey)}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {activeWidget && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 md:mt-6 overflow-hidden"
              id={`widget-${activeWidget}`}
              role="region"
              aria-label={`Widget: ${WIDGETS.find((w) => w.key === activeWidget)?.label}`}
            >
              <GlassCard className="relative">
                <button
                  onClick={() => setActiveWidget(null)}
                  className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--accent)]"
                  aria-label="Fechar widget"
                >
                  <X className="w-4 h-4" />
                </button>

                {activeWidget === "clock" && <MissionClock />}
                {/* calculator removido no cleanup */}
                {activeWidget === "game" && <MiniGame />}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});
