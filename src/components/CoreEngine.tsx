"use client";

import { motion } from "framer-motion";
import { Cpu, BrainCircuit, Rocket } from "lucide-react";
import { GlassCard } from "./GlassCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const cards = [
  {
    icon: Cpu,
    title: "HARDWARE",
    items: [
      "Ryzen 5 5600 + 32GB DDR4",
      "RTX 3060 12GB VRAM",
      "SSD NVMe 1TB",
    ],
  },
  {
    icon: BrainCircuit,
    title: "IA & LLMs",
    items: [
      "Ollama (Mistral, Llama 3, Phi)",
      "Scikit-learn, Pandas",
      "Fine-tuning local com Unsloth",
    ],
  },
  {
    icon: Rocket,
    title: "TRAJETÓRIA",
    items: [
      "Análise de Dados & BI (Power BI, SQL)",
      "Desenvolvimento Full Stack (Next.js, Python)",
      "Engenharia de IA (Machine Learning, LLMs locais)",
    ],
  },
];

export function CoreEngine() {
  return (
    <section id="about" className="py-12 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-mono text-[var(--accent)] mb-12 text-center"
      >
        ▸ CORE ENGINE
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={cardVariant}>
              <GlassCard className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                  <h3 className="font-mono text-sm font-bold text-[var(--text-primary)]">
                    {card.title}
                  </h3>
                </div>

                {/* Details */}
                <ul className="space-y-2">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="text-xs font-mono text-[var(--text-secondary)] flex items-start gap-2"
                    >
                      <span className="text-[var(--accent)] mt-0.5 shrink-0">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
