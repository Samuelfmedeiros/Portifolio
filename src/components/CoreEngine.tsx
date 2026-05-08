"use client";

import { motion } from "framer-motion";
import { Cpu, BrainCircuit, TrendingUp } from "lucide-react";
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
    title: "Ferramentas",
    items: [
      "Power BI, DAX, Power Query",
      "SQL Server, PostgreSQL",
      "Python, Pandas, NumPy",
    ],
  },
  {
    icon: BrainCircuit,
    title: "Inteligência Artificial",
    items: [
      "Machine Learning (scikit-learn)",
      "LLMs e IA Generativa",
      "Automação com Python",
    ],
  },
  {
    icon: TrendingUp,
    title: "Experiência",
    items: [
      "ETL e transformação de dados",
      "Dashboards para tomada de decisão",
      "Suporte técnico e infraestrutura",
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
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-10 text-center"
      >
        ▸ FERRAMENTAS
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
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                  <h3 className="font-mono text-sm font-bold text-[var(--text-primary)]">
                    {card.title}
                  </h3>
                </div>

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