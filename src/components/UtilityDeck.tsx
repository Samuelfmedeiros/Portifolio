"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calculator, Gamepad2, X } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { MissionClock } from "./MissionClock";
import { DataCalculator } from "./DataCalculator";
import { MiniGame } from "./MiniGame";
import type { Widget } from "@/lib/types";

export function UtilityDeck() {
  const [activeWidget, setActiveWidget] = useState<Widget>(null);

  return (
    <section id="utility" className="py-16 md:py-20 px-4 md:px-6">
      <h2 className="text-2xl md:text-3xl font-mono text-[var(--accent)] mb-8 md:mb-12 text-center">
        ▸ UTILITY DECK
      </h2>

      <div className="max-w-xl mx-auto">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <button
            onClick={() => setActiveWidget(activeWidget === "clock" ? null : "clock")}
            className={`glass p-4 md:p-6 rounded-xl text-center transition-all hover:scale-105 border-[var(--border)] ${
              activeWidget === "clock" ? "ring-1 ring-[var(--accent)]" : ""
            }`}
          >
            <Clock className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-[var(--accent)]" />
            <span className="font-mono text-[10px] md:text-xs text-[var(--text-secondary)]">Relógio</span>
          </button>

          <button
            onClick={() => setActiveWidget(activeWidget === "calculator" ? null : "calculator")}
            className={`glass p-4 md:p-6 rounded-xl text-center transition-all hover:scale-105 border-[var(--border)] ${
              activeWidget === "calculator" ? "ring-1 ring-[var(--accent)]" : ""
            }`}
          >
            <Calculator className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-[var(--accent)]" />
            <span className="font-mono text-[10px] md:text-xs text-[var(--text-secondary)]">Calculadora</span>
          </button>

          <button
            onClick={() => setActiveWidget(activeWidget === "game" ? null : "game")}
            className={`glass p-4 md:p-6 rounded-xl text-center transition-all hover:scale-105 border-[var(--border)] ${
              activeWidget === "game" ? "ring-1 ring-[var(--accent)]" : ""
            }`}
          >
            <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-[var(--accent)]" />
            <span className="font-mono text-[10px] md:text-xs text-[var(--text-secondary)]">Mini-game</span>
          </button>
        </div>

        <AnimatePresence>
          {activeWidget && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 md:mt-6 overflow-hidden"
            >
              <GlassCard className="relative">
                <button
                  onClick={() => setActiveWidget(null)}
                  className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--accent)]"
                >
                  <X className="w-4 h-4" />
                </button>

                {activeWidget === "clock" && <MissionClock />}
                {activeWidget === "calculator" && <DataCalculator />}
                {activeWidget === "game" && <MiniGame />}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
