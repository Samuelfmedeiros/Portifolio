"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[var(--text-primary)] mb-4"
        >
          Samuel
          <motion.span
            className="text-[var(--accent)] block md:inline md:ml-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Medeiros
          </motion.span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="h-px w-24 md:w-32 mx-auto bg-[var(--accent)] mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base md:text-lg text-[var(--text-secondary)] mb-2"
        >
          Analista de Dados — Brasília/DF
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-sm text-[var(--text-secondary)] mb-10"
        >
          Dashboards, SQL, Python e Machine Learning para transformar dados em decisões estratégicas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {["Power BI", "SQL", "Python", "Machine Learning", "ETL", "Azure"].map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className="glass px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm text-[var(--accent)] border border-[var(--border)]"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-mono text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Ver Projetos
          </a>
          <a
            href="/Samuel_Andrade_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm hover:bg-[var(--border)] transition-colors"
          >
            Baixar Currículo
          </a>
        </motion.div>
      </div>
    </section>
  );
}