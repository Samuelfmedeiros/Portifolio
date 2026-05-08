"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { Briefcase, GraduationCap, Award } from "lucide-react";

const experiences = [
  {
    icon: Briefcase,
    period: "2023 — Atual",
    title: "Analista de Dados & Produto",
    company: "Setor Privado",
    description: "Dashboards em Power BI, modelagem SQL, pipelines ETL e automação com Python.",
    tags: ["Power BI", "SQL", "Python", "ETL"],
  },
  {
    icon: GraduationCap,
    period: "2022 — 2024",
    title: "Formação em Tecnologia",
    company: "Área de Dados",
    description: "Formação em análise de dados, SQL avançado e Business Intelligence.",
    tags: ["Análise de Dados", "BI", "SQL"],
  },
  {
    icon: Award,
    period: "2024",
    title: "Certificações & Especializações",
    company: "Coursera / Udemy / Digital Innovation One",
    description: "Machine Learning, LLMs, Docker, Git/GitHub, Power BI Avançado.",
    tags: ["ML", "LLMs", "Docker", "Git"],
  },
];

export function AboutTimeline() {
  return (
    <section id="about" className="py-12 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-10 text-center"
      >
        ▸ TRAJETÓRIA
      </motion.h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {experiences.map((exp, i) => {
          const Icon = exp.icon;
          return (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative pl-8"
            >
              {/* Timeline line */}
              {i < experiences.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-px bg-gradient-to-b from-[var(--accent)] to-transparent" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-2 top-5 w-4 h-4 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              </div>

              <GlassCard delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <h3 className="font-semibold text-sm md:text-base text-[var(--text-primary)]">
                        {exp.title}
                      </h3>
                      <span className="text-[10px] md:text-xs font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[var(--text-secondary)] mb-2">
                      {exp.company}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--border)] text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}