"use client";

import { motion, AnimatePresence, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";
import {
  BarChart3, Database, Code2, Brain, Globe, Bot, Container, GitBranch,
  Briefcase, GraduationCap, Award,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { TypeWriter } from "./TypeWriter";
import { useAnalytics } from "@/hooks/useAnalytics";

/* ──────────────────── DATA ──────────────────── */

const timeline = [
  {
    type: "experience" as const,
    icon: Briefcase,
    period: "2025 — Atual",
    title: "Desenvolvedor Full Stack Autônomo",
    company: "Capivara / Arachne / DogWalk",
    description: "Arquitetura e desenvolvimento de plataformas completas: scraper inteligente com RAG, backend multi-tenant FastAPI, marketplace pet com Supabase e Cloudflare.",
    tags: ["Next.js", "FastAPI", "Supabase", "Cloudflare", "Python"],
    skillsUsed: ["Next.js & React", "Python", "SQL & PostgreSQL", "Docker", "Git & GitHub"],
  },
  {
    type: "experience" as const,
    icon: Briefcase,
    period: "2025",
    title: "Analista de Dados — ANA",
    company: "Agência Nacional de Águas",
    description: "Análise de dados hídricos, dashboards Power BI, automação Python/SQL",
    tags: ["Power BI", "Python", "SQL", "ETL"],
    skillsUsed: ["Power BI", "SQL & PostgreSQL", "Python"],
  },
  {
    type: "experience" as const,
    icon: Briefcase,
    period: "2024 — 2025",
    title: "Técnico de Suporte N1 — Global Hitss",
    description: "Suporte hardware/software/redes, Azure, M365",
    tags: ["Azure", "Microsoft 365", "Suporte"],
    skillsUsed: ["Docker", "Git & GitHub"],
  },
  {
    type: "education" as const,
    icon: GraduationCap,
    period: "Em Andamento",
    title: "Pós-graduação em Banco de Dados e BI",
    company: "IESB",
    description: "SQL Server, PostgreSQL, Power BI, DAX, ETL",
    tags: ["SQL", "Power BI", "BI"],
    skillsUsed: ["SQL & PostgreSQL", "Power BI"],
  },
  {
    type: "education" as const,
    icon: GraduationCap,
    period: "2022 — 2024",
    title: "Análise e Desenvolvimento de Sistemas",
    company: "IESB — Data & ML",
    description: "Data science, ML, desenvolvimento full-stack",
    tags: ["Python", "Machine Learning", "Data Science"],
    skillsUsed: ["Python", "Machine Learning", "Next.js & React"],
  },
  {
    type: "certification" as const,
    icon: Award,
    period: "2023 — 2025",
    title: "Certificações",
    company: "Coursera / Udemy / DIO",
    description: "ML, LLMs, Docker, Git, CI/CD, Linux, Power BI Avançado",
    tags: ["ML", "LLMs", "Docker", "Git", "Python"],
    skillsUsed: ["LLMs Locais", "Docker", "Git & GitHub"],
  },
  {
    type: "experience" as const,
    icon: Bot,
    period: "2025",
    title: "Hermes Agent — Agente Autônomo",
    company: "Projeto Pessoal",
    description: "Desenvolvimento de agente de IA autônomo com Hermes Agent, integração multi-plataforma, deploy WSL e Cloudflare.",
    tags: ["IA", "Automação", "Agent", "Cloudflare"],
    skillsUsed: ["Next.js & React", "Python", "Docker", "Git & GitHub"],
  },
];

const skills = [
  { icon: BarChart3, name: "Power BI", category: "BI", level: "Expert", color: "from-cyan-400 to-emerald-400" },
  { icon: Database, name: "SQL", category: "Data", level: "Expert", color: "from-cyan-400 to-emerald-400" },
  { icon: Code2, name: "Python", category: "Backend", level: "Advanced", color: "from-cyan-400 to-blue-400" },
  { icon: Brain, name: "Machine Learning", category: "AI", level: "Advanced", color: "from-cyan-400 to-blue-400" },
  { icon: Globe, name: "Next.js", category: "Web", level: "Advanced", color: "from-cyan-400 to-blue-400" },
  { icon: Bot, name: "LLMs Locais", category: "AI", level: "Proficient", color: "from-purple-400 to-pink-400" },
  { icon: Container, name: "Docker", category: "DevOps", level: "Proficient", color: "from-purple-400 to-pink-400" },
  { icon: GitBranch, name: "Git", category: "Tools", level: "Advanced", color: "from-cyan-400 to-blue-400" },
];

const levelWidth: Record<string, number> = { Expert: 95, Advanced: 78, Proficient: 60 };

/* ──────────────────── COCKPIT SVG ──────────────────── */

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
      <path d="M0 450 Q360 400 720 420 Q1080 440 1440 410 L1440 900 L0 900 Z" fill="url(#phorizonGlow)" opacity="0.08" />
      <path d="M0 450 Q360 400 720 420 Q1080 440 1440 410" stroke="url(#paccentGrad)" strokeWidth="1" opacity="0.15" />
      <path d="M100 0 L100 100 Q100 200 200 250 L400 320" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
      <path d="M1340 0 L1340 100 Q1340 200 1240 250 L1040 320" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
      <path d="M200 800 Q720 650 1240 800" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" fill="none" />
      <path d="M300 820 Q720 700 1140 820" stroke="var(--accent)" strokeWidth="0.3" opacity="0.04" fill="none" />
      <line x1="80" y1="100" x2="80" y2="800" stroke="var(--accent)" strokeWidth="0.3" opacity="0.05" />
      <line x1="1360" y1="100" x2="1360" y2="800" stroke="var(--accent)" strokeWidth="0.3" opacity="0.05" />
      <circle cx="720" cy="380" r="80" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />
      <circle cx="720" cy="380" r="40" stroke="var(--accent)" strokeWidth="0.3" opacity="0.08" />
      <circle cx="720" cy="380" r="10" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
      <line x1="720" y1="280" x2="720" y2="480" stroke="var(--accent)" strokeWidth="0.3" opacity="0.06" />
      <line x1="620" y1="380" x2="820" y2="380" stroke="var(--accent)" strokeWidth="0.3" opacity="0.06" />
      <path d="M680 340 L680 320 L700 320" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <path d="M760 340 L760 320 L740 320" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <path d="M680 420 L680 440 L700 440" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      <path d="M760 420 L760 440 L740 440" stroke="var(--accent)" strokeWidth="0.8" opacity="0.12" />
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 120 + (i % 3) * 40;
        const cx = 720 + Math.cos(angle) * radius;
        const cy = 380 + Math.sin(angle) * radius * 0.6;
        return (
          <circle key={i} cx={cx} cy={cy} r={1 + (i % 2)} fill="var(--accent)" opacity={0.04 + (i % 3) * 0.02} />
        );
      })}
      <defs>
        <radialGradient id="phorizonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="paccentGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ──────────────────── FLOATING HEXAGONS ──────────────────── */

const hexagonPath = "M0,-20 L17.32,-10 L17.32,10 L0,20 L-17.32,10 L-17.32,-10 Z";

const hexagons = [
  { id: 0, x: "8%", y: "25%", size: 24, delay: 0, parallaxSpeed: 0.15, opacity: 0.07 },
  { id: 1, x: "88%", y: "45%", size: 32, delay: 1.5, parallaxSpeed: 0.1, opacity: 0.05 },
  { id: 2, x: "12%", y: "65%", size: 18, delay: 0.8, parallaxSpeed: 0.2, opacity: 0.06 },
];

function FloatingHexagons({ yOffset }: { yOffset: MotionValue<string> }) {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {hexagons.map((h) => (
        <motion.div
          key={h.id}
          style={{ y: yOffset }}
          className="absolute"
          initial={{ left: h.x, top: h.y }}
          animate={{
            y: [0, -8 * (h.id + 1), 0],
            rotate: [0, 15, 0, -15, 0],
          }}
          transition={{
            y: { duration: 5 + h.id * 2, repeat: Infinity, ease: "easeInOut", delay: h.delay + 2 },
            rotate: { duration: 8 + h.id * 3, repeat: Infinity, ease: "easeInOut", delay: h.delay + 2 },
          }}
        >
          <svg width={h.size} height={h.size} viewBox="-22 -22 44 44" className="overflow-visible">
            <path
              d={hexagonPath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.8"
              opacity={h.opacity}
            />
            <path
              d={hexagonPath}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.3"
              opacity={h.opacity * 0.5}
              transform={`scale(${1 + (h.id % 2) * 0.4})`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────── HUD DATA PANELS ──────────────────── */

const hudPanels = [
  { id: 0, label: "STATUS", value: "ONLINE", x: "6%", y: "20%", color: "var(--success)", delay: 0 },
  { id: 1, label: "SESSIONS", value: "1,337", x: "82%", y: "18%", color: "var(--accent)", delay: 0.8 },
  { id: 2, label: "UPTIME", value: "99.97%", x: "5%", y: "55%", color: "var(--accent)", delay: 1.5 },
  { id: 3, label: "DATA NODES", value: "ACTIVE", x: "83%", y: "55%", color: "var(--success)", delay: 2.2 },
];

function HUDDataPanels({ yOffset }: { yOffset: MotionValue<string> }) {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {hudPanels.map((panel) => (
        <motion.div
          key={panel.id}
          style={{ y: yOffset }}
          className="absolute"
          initial={{ left: panel.x, top: panel.y, opacity: 0 }}
          animate={{
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: panel.delay + 2 },
          }}
        >
          <div
            className="glass rounded-md px-2.5 py-1.5"
            style={{
              borderColor: "var(--border)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: panel.color }} />
              <span className="text-[8px] font-mono tracking-wider text-[var(--text-secondary)] opacity-60">
                {panel.label}
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold tracking-wide" style={{ color: panel.color, opacity: 0.7 }}>
              {panel.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────── DATA PARTICLES ──────────────────── */

const PARTICLE_COUNT = 20;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function DataParticles() {
  const particles = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: rand() * 100,
      size: rand() * 2 + 1,
      delay: rand() * 8,
      duration: 6 + rand() * 8,
      drift: (rand() - 0.5) * 40,
    }));
  }, []);

  // Altura fixa de 900px (viewport independente), sem depender de window
  const animHeight = 900;

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: "var(--accent)",
          }}
          animate={{
            y: [0, -animHeight],
            x: [0, p.drift],
            opacity: [0, 0.5, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay + 2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────── CIRCUIT LINES ──────────────────── */

function CircuitLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Circuit path 1 — top left to center */}
      <motion.path
        d="M-20,100 L100,100 L180,180 L180,300"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity={0.06}
        strokeDasharray="6 4"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -100 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
      />
      {/* Circuit path 2 — top right to center */}
      <motion.path
        d="M1460,80 L1360,80 L1280,160 L1280,280"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity={0.06}
        strokeDasharray="6 4"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -100 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 2.5 }}
      />
      {/* Circuit path 3 — bottom left */}
      <motion.path
        d="M-20,750 L120,750 L200,670 L200,550"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity={0.05}
        strokeDasharray="8 6"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: 100 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 3 }}
      />
      {/* Circuit path 4 — bottom right */}
      <motion.path
        d="M1460,700 L1340,700 L1260,620 L1260,500"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity={0.05}
        strokeDasharray="8 6"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: 100 }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: 3.5 }}
      />
    </svg>
  );
}

/* ──────────────────── SKILLS GRID ──────────────────── */

function SkillsCompact() {
  return (
    <div className="mb-8">
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-6 text-center"
      >
        ▸ HABILIDADES
      </motion.h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            viewport={{ once: true }}
            className="group relative"
          >
            {/* Glow border on hover */}
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-[var(--accent)]/0 via-[var(--accent)]/0 to-[var(--accent)]/0 group-hover:from-[var(--accent)]/20 group-hover:via-[var(--accent)]/5 group-hover:to-[var(--accent-alt)]/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
            
            <div className="relative glass rounded-xl p-4 md:p-5 border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all duration-300 h-full flex flex-col">
              {/* Icon with colored glow */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_var(--accent)]/20">
                  <skill.icon className="w-4 h-4 md:w-5 md:h-5 text-[var(--accent)] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm md:text-base text-[var(--text-primary)] block truncate">
                    {skill.name}
                  </span>
                </div>
              </div>

              {/* Category badge */}
              <div className="mb-auto">
                <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent)]/8 text-[var(--accent)]/70 border border-[var(--accent)]/15">
                  {skill.category}
                </span>
              </div>

              {/* Level bar */}
              <div className="mt-3 pt-3 border-t border-[var(--border)]/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]/60 uppercase tracking-wider">
                    Nível
                  </span>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: `var(--proficiency-${skill.level.toLowerCase()}, var(--accent))` }}>
                    {skill.level}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--border)]/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${levelWidth[skill.level]}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r"
                    style={{
                      background: `linear-gradient(90deg, var(--accent), var(--accent-alt, #7c3aed))`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────── TIMELINE ITEM ──────────────────── */

function TimelineItem({ item, index, onSelect, isSelected }: { 
  item: typeof timeline[0]; 
  index: number; 
  onSelect?: (item: typeof timeline[0]) => void;
  isSelected?: boolean;
}) {
  const isLast = index === timeline.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="relative pl-6"
    >
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-[var(--accent)]/60 to-transparent" />
      )}
      <div className="absolute left-0 top-5 w-3.5 h-3.5 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
      </div>
      <GlassCard 
        onClick={() => onSelect?.(item)}
        className={`py-2.5 px-3.5 cursor-pointer transition-all duration-200
          hover:border-[var(--accent)]/60 hover:shadow-lg hover:shadow-[var(--accent)]/5
          ${isSelected ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/30' : ''}`}
        role="button"
        tabIndex={0}
        aria-expanded={isSelected}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.(item);
          }
        }}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-7 h-7 rounded-md bg-[var(--accent)]/10 flex items-center justify-center">
            <item.icon className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-xs md:text-sm truncate">{item.title}</h4>
              <span className="text-[9px] font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                {item.period}
              </span>
            </div>
            {item.company && (
              <p className="text-[9px] font-mono text-[var(--text-secondary)] mb-1">{item.company}</p>
            )}
            <p className="text-[10px] text-[var(--text-secondary)] mb-1.5">{item.description}</p>
            {item.skillsUsed && (
              <div className="flex flex-wrap gap-1 mb-1">
                {item.skillsUsed.map((skill) => (
                  <span
                    key={skill}
                    className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--border)]/50 text-[var(--text-secondary)]"
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
}

/* ──────────────────── TIMELINE MODAL ──────────────────── */

function TimelineModal({ item, onClose }: { item: typeof timeline[0]; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes: ${item.title}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">{item.title}</h3>
                {item.company && (
                  <p className="text-xs font-mono text-[var(--text-secondary)]">{item.company}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-[var(--border)]/50 hover:bg-[var(--border)] flex items-center justify-center transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Period badge */}
          <div className="mb-3">
            <span className="text-[10px] font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">
              {item.period}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed mb-4">
            {item.description}
          </p>

          {/* Skills */}
          {item.skillsUsed && item.skillsUsed.length > 0 && (
            <div className="mb-3">
              <h4 className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">Habilidades</h4>
              <div className="flex flex-wrap gap-1.5">
                {item.skillsUsed.map((skill) => (
                  <span key={skill} className="text-[10px] font-mono px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h4 className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded-full bg-[var(--border)]/50 text-[var(--text-secondary)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────── MAIN COMPONENT ──────────────────── */

export function ProfileSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics();
  const [selectedItem, setSelectedItem] = useState<typeof timeline[0] | null>(null);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const TIMELINE_DEFAULT_COUNT = 4;

  // Track section view
  useEffect(() => {
    const el = document.getElementById("profile");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track({ type: "section_view", section: "profile" });
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [track]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const svgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const floatY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "60%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  // P1 + P2: grouped timeline + collapse
  const typeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    experience: { label: 'Experiência', icon: Briefcase },
    education: { label: 'Educação', icon: GraduationCap },
    certification: { label: 'Certificação', icon: Award },
  };

  const displayItems = showFullTimeline ? timeline : timeline.slice(0, TIMELINE_DEFAULT_COUNT);

  const renderPlan: Array<
    | { kind: 'item'; item: typeof timeline[0]; displayIndex: number }
    | { kind: 'sep'; icon: React.ComponentType<{ className?: string }>; label: string }
  > = [];
  let lastType: string | null = null;
  for (const [i, item] of displayItems.entries()) {
    if (lastType !== null && item.type !== lastType) {
      const cfg = typeConfig[item.type];
      if (cfg) renderPlan.push({ kind: 'sep', icon: cfg.icon, label: cfg.label });
    }
    renderPlan.push({ kind: 'item', item, displayIndex: i });
    lastType = item.type;
  }

  return (
    <motion.section
      id="profile"
      ref={containerRef}
      className="relative min-h-screen py-8 px-4 md:px-6 overflow-hidden scroll-mt-20"
      aria-labelledby="profile-heading"
    >
      {/* L0: Background parallax — grid + circles (sempre visível) */}
      <motion.div
        style={{ y: bgY, willChange: "transform" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--accent)] opacity-8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[var(--accent)] opacity-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[var(--accent)] opacity-18" />
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-20" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-25" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-15" />
      </motion.div>

      {/* L1: Cockpit SVG overlay (sempre visível) */}
      <motion.div
        style={{ y: svgY, willChange: "transform" }}
        className="absolute inset-0 z-[1] pointer-events-none"
      >
        <CockpitSVG />
      </motion.div>

      {/* L1b: Floating hexagons */}
      <FloatingHexagons yOffset={floatY} />

      {/* L1c: HUD data panels */}
      <HUDDataPanels yOffset={floatY} />

      {/* L2: Data particles */}
      <DataParticles />

      {/* L2b: Circuit trace lines */}
      <CircuitLines />

      {/* L3: Hero content — parallax mais rápido, fade out */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity, willChange: "transform, opacity" }}
        className="relative z-10 text-center max-w-3xl mx-auto mb-8"
      >
        <div
          className="glass rounded-2xl p-4 md:p-8 border border-[var(--glass-border)] shadow-2xl"
          style={{
            boxShadow: "0 0 40px color-mix(in srgb, var(--accent) 5%, transparent), 0 0 80px color-mix(in srgb, var(--accent-alt) 3%, transparent)",
          }}
        >
          <motion.h1
            id="profile-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] mb-3"
          >
            Samuel{" "}
            <motion.span
              className="text-[var(--accent)] inline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              Medeiros
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="h-px w-24 md:w-32 mx-auto bg-[var(--accent)] mb-4"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-sm md:text-base lg:text-lg text-[var(--text-secondary)] mb-6 h-7"
          >
            <TypeWriter
              phrases={[
                "Desenvolvedor Full Stack & Analista de Dados — Brasília/DF",
                "Transformando dados em decisões estratégicas",
                "Python • SQL • Power BI • Machine Learning",
                "Next.js • React • TypeScript • Node.js",
                "4+ anos transformando negócios com dados",
              ]}
              speed={35}
              deleteSpeed={20}
              pauseDuration={3000}
            />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
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
      </motion.div>

      {/* L4: Skills + Timeline — parallax sutil */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <SkillsCompact />

        {/* Timeline com P1 (separadores) + P2 (collapse) */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-4"
          >
            ▸ JORNADA
          </motion.h3>

          {/* P2: CTA expandir quando colapsado */}
          {!showFullTimeline && timeline.length > TIMELINE_DEFAULT_COUNT && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowFullTimeline(true)}
              className="w-full text-left px-1 py-1.5 mb-2 text-[11px] font-mono text-[var(--accent)]/70 hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-[var(--accent)] opacity-60">⏵</span>
              Ver jornada completa ({timeline.length - TIMELINE_DEFAULT_COUNT} itens)
            </motion.button>
          )}

          <div className="space-y-3">
            {renderPlan.map((entry) =>
              entry.kind === 'sep' ? (
                <motion.div
                  key={`sep-${entry.label}`}
                  initial={{ opacity: 0, scaleX: 0.8 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  className="flex items-center gap-2 py-1.5"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
                  <span className="text-[9px] font-mono text-[var(--accent)]/50 tracking-[0.2em] uppercase whitespace-nowrap flex items-center gap-1">
                    <entry.icon className="w-2.5 h-2.5" />
                    {entry.label}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent)]/30 via-transparent to-transparent" />
                </motion.div>
              ) : (
                <div key={`item-${entry.item.title}-${entry.displayIndex}`}>
                  <TimelineItem
                    item={entry.item}
                    index={entry.displayIndex}
                    onSelect={setSelectedItem}
                    isSelected={selectedItem?.title === entry.item.title && selectedItem?.period === entry.item.period}
                  />
                </div>
              )
            )}

            {/* P2: Botão "mostrar mais" no final quando colapsado */}
            {!showFullTimeline && timeline.length > TIMELINE_DEFAULT_COUNT && (
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                onClick={() => setShowFullTimeline(true)}
                className="w-full py-2 text-center text-[10px] font-mono text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                ⏷ Mostrar todos os {timeline.length} itens
              </motion.button>
            )}

            {/* P2: Botão recolher quando expandido */}
            {showFullTimeline && timeline.length > TIMELINE_DEFAULT_COUNT && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowFullTimeline(false)}
                className="w-full py-2 text-center text-[10px] font-mono text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                ⏶ Mostrar menos
              </motion.button>
            )}

            {/* Fecho visual da Jornada */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center pt-1 pb-4"
            >
              <div className="w-px h-10 bg-gradient-to-b from-[var(--accent)]/40 via-[var(--accent)]/10 to-transparent" />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="w-5 h-5 rounded-full border border-[var(--accent)]/30 bg-[var(--bg-primary)]/80 flex items-center justify-center mt-1"
              >
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]/60" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="text-[10px] font-mono text-[var(--text-muted)] mt-3 tracking-wider"
              >
                ∞ Continuo evoluindo
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Timeline Modal */}
      <AnimatePresence>
        {selectedItem && (
          <TimelineModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>

    </motion.section>
  );
}
