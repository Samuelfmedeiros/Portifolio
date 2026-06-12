"use client";

import { motion } from "framer-motion";
import {
  BarChart3, Database, Code2, Brain, Globe, Bot, Container, GitBranch,
  Briefcase, GraduationCap, Award,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Tooltip } from "./Tooltip";

/* ──────────────────── DATA UNIFICADA ──────────────────── */

const timeline = [
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

/* ──────────────────── COMPONENTES ──────────────────── */

function SkillsCompact() {
  return (
    <div className="mb-8">
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-3"
      >
        ▸ HABILIDADES
      </motion.h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {skills.map((skill) => (
          <Tooltip key={skill.name} content={
            <div className="text-center">
              <p className="font-semibold text-xs">{skill.name}</p>
              <p className="font-mono text-[10px] text-[var(--accent)]">{skill.level}</p>
              <p className="font-mono text-[9px] text-[var(--text-secondary)]">{skill.category}</p>
            </div>
          }>
            <GlassCard className="group hover:scale-[1.02] transition-all duration-200">
              <div className="flex flex-col items-center gap-1.5 py-1">
                <skill.icon className="w-6 h-6 text-[var(--accent)] group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[10px] md:text-xs">{skill.name}</span>
                <div className="w-full h-1 rounded-full bg-[var(--border)]/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${levelWidth[skill.level]}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                  />
                </div>
              </div>
            </GlassCard>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ item, index }: { item: typeof timeline[0]; index: number }) {
  const isLast = index === timeline.length - 1;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative pl-6"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-[var(--accent)]/60 to-transparent" />
      )}
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-5 w-3.5 h-3.5 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
      </div>
      
      <GlassCard className="py-2.5 px-3.5 hover:border-[var(--accent)]/40 transition-colors">
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
            
            {/* Skills usadas inline */}
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
            
            {/* Tags */}
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

/* ──────────────────── MAIN COMPONENT ──────────────────── */

export function UnifiedProfile() {
  return (
    <section id="profile" className="py-8 px-4 md:px-6" aria-labelledby="profile-heading">
      <motion.h2
        id="profile-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-6 text-center"
      >
        ▸ PERFIL
      </motion.h2>

      <div className="max-w-4xl mx-auto">
        {/* Skills compactos no topo */}
        <SkillsCompact />
        
        {/* Timeline unificada */}
        <div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-4"
          >
            ▸ JORNADA
          </motion.h3>
          <div className="space-y-3">
            {timeline.map((item, i) => (
              <TimelineItem key={`${item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}