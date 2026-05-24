"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Decorative cockpit SVG as inline component
function CockpitSVG() {
  return (
    <svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Horizon curve */}
      <path
        d="M0 450 Q360 400 720 420 Q1080 440 1440 410 L1440 900 L0 900 Z"
        fill="url(#horizonGlow)"
        opacity="0.08"
      />
      <path
        d="M0 450 Q360 400 720 420 Q1080 440 1440 410"
        stroke="url(#accentGrad)"
        strokeWidth="1"
        opacity="0.15"
      />

      {/* Cockpit frame lines */}
      <path
        d="M100 0 L100 100 Q100 200 200 250 L400 320"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity="0.1"
      />
      <path
        d="M1340 0 L1340 100 Q1340 200 1240 250 L1040 320"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity="0.1"
      />

      {/* Dashboard arc */}
      <path
        d="M200 800 Q720 650 1240 800"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity="0.06"
        fill="none"
      />
      <path
        d="M300 820 Q720 700 1140 820"
        stroke="var(--accent)"
        strokeWidth="0.3"
        opacity="0.04"
        fill="none"
      />

      {/* Side panel lines */}
      <line x1="80" y1="100" x2="80" y2="800" stroke="var(--accent)" strokeWidth="0.3" opacity="0.05" />
      <line x1="1360" y1="100" x2="1360" y2="800" stroke="var(--accent)" strokeWidth="0.3" opacity="0.05" />

      {/* HUD targeting reticle - center */}
      <circle cx="720" cy="380" r="80" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />
      <circle cx="720" cy="380" r="40" stroke="var(--accent)" strokeWidth="0.3" opacity="0.08" />
      <circle cx="720" cy="380" r="10" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />

      {/* Crosshair lines */}
      <line x1="720" y1="280" x2="720" y2="480" stroke="var(--accent)" strokeWidth="0.3" opacity="0.06" />
      <line x1="620" y1="380" x2="820" y2="380" stroke="var(--accent)" strokeWidth="0.3" opacity="0.06" />

      {/* Corner brackets */}
      <path d="M680 340 L680 320 L700 320" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <path d="M760 340 L760 320 L740 320" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <path d="M680 420 L680 440 L700 440" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <path d="M760 420 L760 440 L740 440" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />

      {/* Decorative dots */}
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 120 + (i % 3) * 40;
        const cx = 720 + Math.cos(angle) * radius;
        const cy = 380 + Math.sin(angle) * radius * 0.6;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={1 + (i % 2)}
            fill="var(--accent)"
            opacity={0.04 + (i % 3) * 0.02}
          />
        );
      })}

      {/* Gradients */}
      <defs>
        <radialGradient id="horizonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const svgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[85vh] flex items-center justify-center px-4 md:px-6 overflow-hidden">
      {/* Background layer with parallax - grid + circles */}
      <motion.div
        style={{ y: bgY, opacity }}
        className="absolute inset-0 z-0"
      >
        {/* Grid de fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        {/* Circulos centrais decorativos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--accent)] opacity-8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[var(--accent)] opacity-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[var(--accent)] opacity-18" />

        {/* Pontos decorativos */}
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-20" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-25" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-15" />
      </motion.div>

      {/* Cockpit SVG overlay with slower parallax */}
      <motion.div
        style={{ y: svgY, opacity }}
        className="absolute inset-0 z-[1] pointer-events-none"
      >
        <CockpitSVG />
      </motion.div>

      {/* Content with stronger parallax */}
      <motion.div style={{ y: textY, opacity }} className="text-center max-w-3xl mx-auto relative z-10">
        {/* Glassmorphism card wrapper */}
        <div className="glass rounded-2xl p-8 md:p-12 border border-[var(--glass-border)] shadow-2xl"
          style={{
            boxShadow: "0 0 40px rgba(34, 211, 238, 0.05), 0 0 80px rgba(99, 102, 241, 0.03)",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] mb-4 whitespace-nowrap"
          >
            Samuel{" "}
            <motion.span
              className="text-[var(--accent)] inline"
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
            Desenvolvedor Full Stack &amp; Analista de Dados -- Brasilia/DF
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-xs sm:text-sm text-[var(--text-secondary)] mb-10"
          >
            Next.js, React, Python, SQL e Machine Learning para transformar dados em decisoes estrategicas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {["Power BI", "SQL", "Python", "Machine Learning", "ETL", "Azure"].map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="glass px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm text-[var(--accent)] border border-[var(--border)]"
                style={{
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
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
              style={{
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              Baixar Curriculo
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-8 flex flex-col items-center gap-2"
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
      </motion.div>
    </section>
  );
}
