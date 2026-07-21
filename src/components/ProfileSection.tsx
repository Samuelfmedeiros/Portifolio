"use client";

import { motion, AnimatePresence, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect, useCallback, startTransition } from "react";
import {
  BarChart3, Database, Code2, Brain, Globe, Bot, Container, GitBranch,
  Cpu, Flame, Zap, GitMerge, RefreshCw, HardDrive, Sigma, FileJson,
  Briefcase, GraduationCap, Award,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { TypeWriter } from "./TypeWriter";
import { DownloadModal } from "./DownloadModal";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/lib/i18n";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { gsap, ScrollTrigger } from "@/hooks/useGsapAnimation";

/* ──────────────────── DATA ──────────────────── */

const timeline = [
  {
    type: "experience" as const,
    icon: Briefcase,
    period: "2025 — Atual",
    title: "Desenvolvedor Full Stack Autônomo",
    company: "Capivara / Arachne / DogWalk",
    description: "Arquitetura e desenvolvimento de plataformas completas do zero: Arachne (scraper inteligente com RAG), Capivara (hub pessoal multi-tenant com FastAPI e autenticação JWT), DogWalk (marketplace pet com Supabase, Stripe, Cloudflare Workers). Responsável por todo o ciclo — modelagem de dados, APIs REST, deploy em produção, CI/CD, testes automatizados e documentação técnica. Stack principal: Next.js, React, FastAPI, Supabase, Cloudflare, Docker, Python, TypeScript, PostgreSQL.",
    tags: ["Next.js", "FastAPI", "Supabase", "Cloudflare", "Python"],
    skillsUsed: ["Next.js & React", "Python", "SQL & PostgreSQL", "Docker", "Git & GitHub"],
  },
  {
    type: "experience" as const,
    icon: Briefcase,
    period: "2025",
    title: "Analista de Dados — ANA",
    company: "Agência Nacional de Águas",
    description: "Análise de dados hídricos em larga escala na Agência Nacional de Águas. Desenvolvimento de dashboards interativos no Power BI para monitoramento de recursos hídricos, automação de pipelines de ETL com Python e SQL, integração de fontes de dados heterogêneas (sensores, estações, bases históricas). Criação de relatórios executivos e técnicos para tomada de decisão em políticas públicas de recursos hídricos.",
    tags: ["Power BI", "Python", "SQL", "ETL"],
    skillsUsed: ["Power BI", "SQL & PostgreSQL", "Python"],
  },
  {
    type: "experience" as const,
    icon: Briefcase,
    period: "2024 — 2025",
    title: "Técnico de Suporte N1 — Global Hitss",
    description: "Atendimento de suporte técnico N1 para funcionários da Global Hitss em ambiente corporativo com mais de 2.000 usuários. Diagnóstico e resolução de problemas de hardware, software, redes e periféricos. Administração de usuários e dispositivos no Azure Active Directory e Microsoft 365. Configuração e manutenção de estações de trabalho, impressoras e equipamentos de rede. Suporte presencial e remoto com SLA de até 4 horas.",
    tags: ["Azure", "Microsoft 365", "Suporte"],
    skillsUsed: ["Docker", "Git & GitHub"],
  },
  {
    type: "education" as const,
    icon: GraduationCap,
    period: "Em Andamento",
    title: "Pós-graduação em Ciência de Dados e Machine Learning Engineering",
    company: "IESB",
    description: "Curso de pós-graduação focado em Ciência de Dados e Machine Learning Engineering no IESB. Estudo aprofundado de algoritmos de ML (regressão, classificação, clustering, redes neurais), engenharia de features, avaliação de modelos, deployment em produção. Domínio de SQL para análise exploratória, Power BI para visualização de dados, Python (pandas, numpy, scikit-learn, tensorflow) para modelagem preditiva e ETL.",
    tags: ["Data Science", "Machine Learning", "SQL", "Python"],
    skillsUsed: ["Python", "Machine Learning", "SQL & PostgreSQL"],
  },
  {
    type: "education" as const,
    icon: GraduationCap,
    period: "2022 — 2024",
    title: "Análise e Desenvolvimento de Sistemas",
    company: "IESB — Data & ML",
    description: "Graduação tecnológica em Análise e Desenvolvimento de Sistemas com ênfase em Data & ML pelo IESB. Formação abrangente em ciência da computação: algoritmos, estruturas de dados, banco de dados relacionais e não-relacionais, engenharia de software, desenvolvimento web full-stack. Disciplinas específicas em machine learning, inteligência artificial, estatística aplicada e visualização de dados. Projetos práticos utilizando Python, SQL, React e Next.js.",
    tags: ["Python", "Machine Learning", "Data Science"],
    skillsUsed: ["Python", "Machine Learning", "Next.js & React"],
  },
  {
    type: "certification" as const,
    icon: Award,
    period: "2023 — 2025",
    title: "Certificações",
    company: "Coursera / Udemy / DIO",
    description: "Certificações em Machine Learning, LLMs Locais, Docker, Git e CI/CD, Linux e Power BI Avançado por plataformas como Coursera, Udemy e DIO. Aprendizado contínuo em tecnologias emergentes: deployment de modelos de linguagem local (Ollama, llama.cpp), automação de infraestrutura com Docker e GitHub Actions, análise de dados avançada com Power BI (DAX, M, modelagem dimensional), e administração de sistemas Linux para ambientes de produção.",
    tags: ["ML", "LLMs", "Docker", "Git", "Python"],
    skillsUsed: ["LLMs Locais", "Docker", "Git & GitHub"],
  },
  {
    type: "experience" as const,
    icon: Briefcase,
    period: "2021 — 2023",
    title: "Auxiliar Técnico Freelancer",
    company: "Autônomo",
    description: "Instalação, configuração e manutenção de computadores, impressoras e periféricos. Suporte técnico presencial/remoto, implantação de sistemas.",
    tags: ["Suporte Técnico", "Hardware", "Redes"],
    skillsUsed: ["Suporte Técnico"],
  },
  {
    type: "experience" as const,
    icon: Briefcase,
    period: "2017 — 2020",
    title: "Auxiliar Técnico",
    company: "TRT 10ª Região (CETEFE)",
    description: "Digitalização e organização de documentos judiciais, controle logístico de armazenamento digital, verificação de integridade de informações.",
    tags: ["Documentação", "Gestão Digital", "Processos"],
    skillsUsed: ["Gestão de Documentos"],
  },
];

const skills = [
  // Core
  { icon: BarChart3, name: "Power BI", category: "BI", level: "Expert", color: "from-cyan-400 to-emerald-400", description: "Dashboards interativos, DAX, M, modelagem dimensional" },
  { icon: Database, name: "SQL", category: "Data", level: "Expert", color: "from-cyan-400 to-emerald-400", description: "Consultas complexas, otimização, schema design, PostgreSQL" },
  { icon: Code2, name: "Python", category: "Backend", level: "Advanced", color: "from-cyan-400 to-blue-400", description: "FastAPI, automação, ETL, pandas, scikit-learn" },
  { icon: Brain, name: "Machine Learning", category: "AI", level: "Advanced", color: "from-cyan-400 to-blue-400", description: "Regressão, classificação, clustering, redes neurais" },
  { icon: Globe, name: "Next.js", category: "Web", level: "Advanced", color: "from-cyan-400 to-blue-400", description: "SSR, SSG, API Routes, App Router, Turbopack" },
  { icon: Bot, name: "LLMs Locais", category: "AI", level: "Proficient", color: "from-purple-400 to-pink-400", description: "Ollama, llama.cpp, RAG, embedding, fine-tuning" },
  { icon: Container, name: "Docker", category: "DevOps", level: "Proficient", color: "from-purple-400 to-pink-400", description: "Containerização, Docker Compose, multi-stage builds" },
  { icon: GitBranch, name: "Git", category: "Tools", level: "Advanced", color: "from-cyan-400 to-blue-400", description: "Versionamento, branching, rebase, hooks, workflow" },
  // Fundidos
  { icon: Brain, name: "ML Frameworks", category: "AI", level: "Proficient", color: "from-purple-400 to-pink-400", description: "TensorFlow, PyTorch, scikit-learn, Hugging Face" },
  { icon: GitBranch, name: "Git & CI/CD", category: "DevOps", level: "Proficient", color: "from-purple-400 to-pink-400", description: "GitHub Actions, pipelines, deploy automatizado" },
  // Adicionados
  { icon: Globe, name: "Cloudflare", category: "DevOps", level: "Proficient", color: "from-purple-400 to-pink-400", description: "Pages, Workers, D1, Tunnel, DNS, edge computing" },
  { icon: Code2, name: "TypeScript", category: "Web", level: "Advanced", color: "from-cyan-400 to-blue-400", description: "Tipagem estática, genéricos, interfaces, strict mode" },
  // Arquivados
  // TensorFlow + PyTorch → ML Frameworks
  // GitLab + CI/CD → Git & CI/CD
  // Spark, Hadoop, R, XML/JSON → removidos (não refletem stack atual)
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
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: 3.5 }}
      />
    </svg>
  );
}

/* ──────────────────── SKILLS GRID ──────────────────── */

function SkillsCompact() {
  const { t } = useLanguage();
  return (
    <div className="mb-8">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-6 text-center"
      >
        {t("profile.skills.heading", "▸ HABILIDADES")}
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
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

              {/* Description — textual content for SEO */}
              {'description' in skill && skill.description && (
                <p className="text-[10px] text-[var(--text-secondary)]/70 leading-relaxed mt-2 line-clamp-2">
                  {skill.description}
                </p>
              )}

              {/* Level bar */}
              <div className="mt-3 pt-3 border-t border-[var(--border)]/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]/60 uppercase tracking-wider">
                    {t("profile.level", "Nível")}
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
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25) }}
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
              <h3 className="font-semibold text-xs md:text-sm truncate">{item.title}</h3>
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
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true, onClose);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      ref={modalRef}
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
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);
  const [selectedItem, setSelectedItem] = useState<typeof timeline[0] | null>(null);
  const [showFullTimeline, setShowFullTimeline] = useState(true);
  const [showBio, setShowBio] = useState(false);
  const TIMELINE_DEFAULT_COUNT = 4;
  const [showDownloadModal, setShowDownloadModal] = useState(false);

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
    experience: { label: t("profile.label.experience", "Experiência"), icon: Briefcase },
    education: { label: t("profile.label.education", "Educação"), icon: GraduationCap },
    certification: { label: t("profile.label.certification", "Certificação"), icon: Award },
  };

  // Always mount all items — Samuel: "sempre deve montar tudo, lógica é o contrário"
  const renderPlan: Array<
    | { kind: 'item'; item: typeof timeline[0]; displayIndex: number; hidden: boolean }
    | { kind: 'sep'; icon: React.ComponentType<{ className?: string }>; label: string; hidden: boolean }
  > = [];
  let lastType: string | null = null;
  let pastCutoff = false;
  for (const [i, item] of timeline.entries()) {
    if (!showFullTimeline && i >= TIMELINE_DEFAULT_COUNT) pastCutoff = true;
    if (lastType !== null && item.type !== lastType) {
      const cfg = typeConfig[item.type];
      if (cfg) renderPlan.push({ kind: 'sep', icon: cfg.icon, label: cfg.label, hidden: pastCutoff });
    }
    renderPlan.push({ kind: 'item', item, displayIndex: i, hidden: pastCutoff });
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
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        style={{ y: svgY, willChange: "transform" }}
        className="absolute inset-0 z-[1] pointer-events-none"
      >
        <CockpitSVG />
      </motion.div>

      {/* L1b: Floating hexagons */}
      <div className="hidden md:block">
        <FloatingHexagons yOffset={floatY} />
      </div>

      {/* L1c: HUD data panels */}
      <div className="hidden md:block">
        <HUDDataPanels yOffset={floatY} />
      </div>

      {/* L2: Data particles */}
      <div className="hidden md:block">
        <DataParticles />
      </div>

      {/* L2b: Circuit trace lines */}
      <div className="hidden md:block">
        <CircuitLines />
      </div>

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
              transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              Medeiros
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="h-px w-24 md:w-32 mx-auto bg-[var(--accent)] mb-4"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
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
            transition={{ duration: 0.4, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-sans text-base font-bold overflow-hidden
                bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5
                border-2 border-[var(--accent)]/50 hover:border-[var(--accent)]
                text-[var(--accent)] hover:text-white
                shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40
                hover:scale-[1.06] active:scale-[0.97]
                transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 font-semibold tracking-wide">Ver projetos</span>
              <svg className="w-5 h-5 relative z-10 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="group relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-sans text-sm font-semibold overflow-hidden
                bg-gradient-to-br from-[var(--accent)] via-[var(--accent)]/90 to-[var(--accent-alt)]/40
                text-black
                shadow-lg shadow-[var(--accent)]/30 hover:shadow-[var(--accent)]/50
                hover:scale-[1.04] active:scale-[0.97]
                transition-all duration-300"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="relative z-10 font-semibold ml-1.5">Baixar Curriculo</span>
              <span className="relative z-10 text-black/50 group-hover:text-black/70 text-xs hidden sm:inline ml-1">— PDF</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bio — conteúdo textual rico, expansível */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 max-w-3xl mx-auto px-4 mt-8 mb-12"
      >
        <div className="glass rounded-xl p-6 md:p-8 border border-[var(--border)]/50">
          <button
            onClick={() => setShowBio(!showBio)}
            className="w-full text-center focus:outline-none group cursor-pointer"
            aria-expanded={showBio}
            aria-label={t("profile.about.aria", "Sobre mim")}
          >
            <div className="flex items-center justify-center gap-3">
              <h2 className="font-mono text-sm tracking-[0.3em] text-[var(--accent)]">{t("profile.about.heading", "▸ SOBRE")}</h2>
              <motion.span
                animate={{ rotate: showBio ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-[var(--accent)]/60 group-hover:text-[var(--accent)] transition-colors inline-flex"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </motion.span>
            </div>
          </button>

          <AnimatePresence initial={false}>
            <motion.div
              key="bio-content"
              initial={{ height: 0, opacity: 0 }}
              animate={showBio ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
              role="region"
              aria-live="polite"
              aria-label={t("profile.about.aria", "Sobre mim")}
            >
              <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed pt-4 mt-3 border-t border-[var(--border)]/30">
                <p>
                  Sou <strong className="text-[var(--text-primary)]">Samuel Medeiros</strong>, Desenvolvedor Full Stack e Analista de Dados com sede em Brasília/DF. Minha atuação combina engenharia de software com análise de dados — construo plataformas web completas enquanto extraio insights estratégicos de dados complexos.
                </p>
                <p>
                  No desenvolvimento, trabalho com <strong className="text-[var(--accent)]">Next.js, React, TypeScript, FastAPI e Python</strong> para criar aplicações escaláveis. Minha stack inclui Supabase para backend-as-a-service, Cloudflare para deploy e edge computing, Docker para containerização, e PostgreSQL para bancos de dados relacionais. Já entreguei projetos como um scraper inteligente com RAG semântico (Arachne), um hub pessoal multi-tenant (Capivara), e um marketplace pet com pagamentos Stripe (DogWalk).
                </p>
                <p>
                  Na análise de dados, sou especialista em <strong className="text-[var(--accent)]">Power BI, SQL e Python</strong> — crio dashboards interativos, pipelines de ETL, e modelos preditivos com machine learning. Minha experiência na Agência Nacional de Águas (ANA) envolveu análise de dados hídricos em larga escala, automação de processos e relatórios executivos para tomada de decisão em políticas públicas.
                </p>
                <p>
                  Atualmente curso Pós-graduação em Ciência de Dados e Machine Learning Engineering no IESB, e mantenho aprendizado contínuo em LLMs locais (Ollama, llama.cpp), CI/CD com GitHub Actions, e arquiteturas serverless. Acredito que tecnologia de qualidade começa com código limpo, testes automatizados e documentação clara.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* L4: Skills + Timeline — parallax sutil */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <SkillsCompact />

        {/* Timeline com P1 (separadores) + P2 (collapse) */}
        <div id="jornada" className="scroll-mt-20 pb-16 md:pb-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-6 text-center"
          >
            {t("profile.journey.heading", "▸ JORNADA")}
          </motion.h2>

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
              {t("profile.show.full", "Ver jornada completa ({count} itens)").replace("{count}", String(timeline.length - TIMELINE_DEFAULT_COUNT))}
            </motion.button>
          )}

          <div className="space-y-3" role="region" aria-live="polite" aria-label={t("profile.journey.heading", "▸ JORNADA")}>
            {renderPlan.map((entry) =>
              entry.kind === 'sep' ? (
                <motion.div
                  key={`sep-${entry.label}`}
                  initial={{ opacity: 0, scaleX: 0.8 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  className={`flex items-center gap-2 py-1.5 ${entry.hidden ? 'hidden' : ''}`}
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
                  <span className="text-[9px] font-mono text-[var(--accent)]/50 tracking-[0.2em] uppercase whitespace-nowrap flex items-center gap-1">
                    <entry.icon className="w-2.5 h-2.5" />
                    {entry.label}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent)]/30 via-transparent to-transparent" />
                </motion.div>
              ) : (
                <div key={`item-${entry.item.title}-${entry.displayIndex}`} className={entry.hidden ? 'hidden' : ''}>
                  <TimelineItem
                    item={entry.item}
                    index={entry.displayIndex}
                    onSelect={setSelectedItem}
                    isSelected={selectedItem?.title === entry.item.title && selectedItem?.period === entry.item.period}
                  />
                </div>
              )
            )}

            {/* P2: Botão "mostrar menos" quando expandido (sempre visível) */}
            {showFullTimeline && timeline.length > TIMELINE_DEFAULT_COUNT && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowFullTimeline(false)}
                className="w-full py-3 text-center text-[10px] font-mono text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("profile.show.less", "Mostrar menos")}
              </motion.button>
            )}

            {/* P2: Botão "ver completa" no final quando colapsado */}
            {!showFullTimeline && timeline.length > TIMELINE_DEFAULT_COUNT && (
              <motion.button
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                onClick={() => setShowFullTimeline(true)}
                className="w-full py-2 text-center text-[10px] font-mono text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                ⏷ {t("profile.show.full", "Ver jornada completa ({count} itens)").replace("{count}", String(timeline.length - TIMELINE_DEFAULT_COUNT))}
              </motion.button>
            )}

            {/* Fecho visual da Jornada */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center pt-1 pb-8"
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
                {t("profile.evolving", "∞ Continuo evoluindo")}
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

      <DownloadModal
        open={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />

    </motion.section>
  );
}
