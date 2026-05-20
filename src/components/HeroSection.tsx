"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center px-4 md:px-6 overflow-hidden">
      {/* Fundo com Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        {/* Grid de fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        
        {/* Círculo central decorativo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--accent)] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[var(--accent)] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[var(--accent)] opacity-30" />
        
        {/* Pontos decorativos */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--accent)] rounded-full opacity-50" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--accent)] rounded-full opacity-30" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[var(--accent)] rounded-full opacity-40" />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-[var(--accent)] rounded-full opacity-20" />
      </motion.div>

      <div className="text-center max-w-3xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] mb-4"
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
          className="text-sm md:text-base lg:text-lg text-[var(--text-secondary)] mb-2"
        >
          Desenvolvedor Full Stack &amp; Analista de Dados — Brasília/DF
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-xs sm:text-sm text-[var(--text-secondary)] mb-10"
        >
          Next.js, React, Python, SQL e Machine Learning para transformar dados em decisões estratégicas.
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
            className="px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-mono text-sm font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Ver Projetos
          </a>
          <a
            href="/Samuel_Andrade_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm hover:bg-[var(--border)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Baixar Currículo
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono text-[var(--text-secondary)] tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-[var(--border)] flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-[var(--accent)] rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}