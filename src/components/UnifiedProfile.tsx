"use client";

import { motion } from "framer-motion";
import {
  BarChart3, Database, Code2, Brain, Globe, Bot, Container, GitBranch,
  Cpu, BrainCircuit, TrendingUp, Briefcase, GraduationCap, Award,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Tooltip } from "./Tooltip";

/* ──────────────────── DATA ──────────────────── */

const skills = [
  { icon: BarChart3,   name: "Power BI",         category: "BI & Analytics", proficiency: "Expert" as const,     description: "Interactive dashboards, DAX, data modeling" },
  { icon: Database,    name: "SQL & PostgreSQL",  category: "Data",           proficiency: "Expert" as const,     description: "Complex queries, optimization, ETL pipelines" },
  { icon: Code2,       name: "Python",            category: "Backend",        proficiency: "Advanced" as const,   description: "FastAPI, automation, data processing" },
  { icon: Brain,       name: "Machine Learning",  category: "AI",             proficiency: "Advanced" as const,   description: "Scikit-learn, model training, evaluation" },
  { icon: Globe,       name: "Next.js & React",   category: "Web",            proficiency: "Advanced" as const,   description: "Full-stack apps, SSR, responsive UI" },
  { icon: Bot,         name: "LLMs Locais",       category: "AI",             proficiency: "Proficient" as const, description: "Ollama, prompt engineering, RAG systems" },
  { icon: Container,   name: "Docker",            category: "DevOps",         proficiency: "Proficient" as const, description: "Containerization, docker-compose, CI/CD" },
  { icon: GitBranch,   name: "Git & GitHub",      category: "Tools",          proficiency: "Advanced" as const,   description: "Version control, branching strategies" },
];

const toolCards = [
  { icon: Cpu,           title: "Ferramentas", items: ["Power BI, DAX, Power Query", "SQL Server, PostgreSQL", "Python, Pandas, NumPy"] },
  { icon: BrainCircuit,  title: "Inteligência Artificial", items: ["Machine Learning (scikit-learn)", "LLMs e IA Generativa", "Automação com Python"] },
  { icon: TrendingUp,    title: "Experiência", items: ["ETL e transformação de dados", "Dashboards para tomada de decisão", "Suporte técnico e infraestrutura"] },
];

const experiences = [
  { icon: Briefcase,     period: "2025",          title: "Analista de Dados — ANA (Agência Nacional de Águas)", description: "Análise e tratamento de dados de sistemas hídricos. Dashboards em Power BI. Automação de rotinas com Python e SQL.", tags: ["Power BI", "Python", "SQL", "ETL"] },
  { icon: Briefcase,     period: "2024 — 2025",   title: "Técnico de Suporte N1 — Global Hitss", description: "Diagnóstico e solução de problemas em hardware, software e redes. Microsoft Azure e Microsoft 365.", tags: ["Azure", "Microsoft 365", "Suporte"] },
  { icon: Briefcase,     period: "2017 — 2020",   title: "Auxiliar Técnico — TRT 10ª Região (CETEFE)", description: "Digitalização e organização de documentos judiciais. Controle e logística de armazenamento digital.", tags: ["Gestão Documental", "Suporte"] },
  { icon: GraduationCap, period: "Em Andamento",  title: "Pós-graduação em Banco de Dados e BI", company: "Centro Universitário IESB", description: "SQL Server, PostgreSQL, Power BI, Power Query, DAX, ETL.", tags: ["SQL", "Power BI", "BI"] },
  { icon: GraduationCap, period: "2022 — 2024",   title: "Análise e Desenvolvimento de Sistemas — Data & ML", company: "Centro Universitário IESB", description: "Formação em análise de dados, desenvolvimento de sistemas, modelagem e Machine Learning.", tags: ["Python", "Machine Learning", "Data Science"] },
  { icon: Award,         period: "2023 — 2025",   title: "Certificações e Especializações", company: "Coursera / Udemy / DIO", description: "Machine Learning, LLMs, Docker, Git/GitHub, CI/CD, Linux, Power BI Avançado.", tags: ["ML", "LLMs", "Docker", "Git", "Python"] },
];

const proficiencyColor: Record<string, string> = {
  Expert: "text-[var(--proficiency-expert)]",
  Advanced: "text-[var(--proficiency-advanced)]",
  Proficient: "text-[var(--proficient)]",
};

/* ──────────────────── ANIMATIONS ──────────────────── */

const stagger = (delay = 0.08) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: delay } },
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const sectionTitle = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ──────────────────── SUB-SECTIONS ──────────────────── */

function SkillsSubSection() {
  return (
    <div aria-labelledby="skills-sub-heading">
      <motion.h3 id="skills-sub-heading" variants={sectionTitle} className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-4">
        ▸ HABILIDADES
      </motion.h3>
      <motion.div
        variants={stagger(0.06)}
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        role="list" aria-label="Lista de habilidades técnicas"
      >
        {skills.map((s) => (
          <motion.div key={s.name} variants={fadeUp} role="listitem">
            <Tooltip content={
              <div className="text-center">
                <p className="font-semibold text-xs text-[var(--text-primary)]">{s.name}</p>
                <p className={`font-mono text-[10px] mt-1 ${proficiencyColor[s.proficiency]}`}>{s.proficiency}</p>
                <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-1 leading-tight">{s.description}</p>
              </div>
            }>
              <GlassCard className="group hover:border-[var(--accent)]/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1">
                <div className="flex flex-col items-center text-center gap-2 py-1 cursor-default">
                  <s.icon className="w-7 h-7 md:w-8 md:h-8 text-[var(--accent)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-xs md:text-sm text-[var(--text-primary)]">{s.name}</h4>
                    <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-0.5">{s.category}</p>
                  </div>
                </div>
              </GlassCard>
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function ToolsSubSection() {
  return (
    <div className="mt-8" aria-labelledby="tools-sub-heading">
      <motion.h3 id="tools-sub-heading" variants={sectionTitle} className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-4">
        ▸ FERRAMENTAS
      </motion.h3>
      <motion.div
        variants={stagger(0.1)}
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        role="list" aria-label="Habilidades e ferramentas"
      >
        {toolCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={fadeUp} role="listitem">
              <GlassCard className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                  <h4 className="font-mono text-xs font-bold text-[var(--text-primary)]">{card.title}</h4>
                </div>
                <ul className="space-y-1.5">
                  {card.items.map((item) => (
                    <li key={item} className="text-[11px] font-mono text-[var(--text-secondary)] flex items-start gap-2">
                      <span className="text-[var(--accent)] mt-px shrink-0" aria-hidden="true">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function ExperienceSubSection() {
  return (
    <div className="mt-8" aria-labelledby="exp-sub-heading">
      <motion.h3 id="exp-sub-heading" variants={sectionTitle} className="font-mono text-xs tracking-[0.25em] text-[var(--accent)] mb-4">
        ▸ EXPERIÊNCIA
      </motion.h3>
      <div className="space-y-4">
        {experiences.map((exp, i) => {
          const Icon = exp.icon;
          return (
            <motion.div
              key={`${exp.title}-${i}`}
              variants={fadeLeft}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              custom={i}
              className="relative pl-7"
              role="article" aria-label={exp.title}
            >
              {i < experiences.length - 1 && (
                <div className="absolute left-3.5 top-8 bottom-0 w-px bg-gradient-to-b from-[var(--accent)] to-transparent" aria-hidden="true" />
              )}
              <div className="absolute left-1.5 top-4 w-3.5 h-3.5 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex items-center justify-center" aria-hidden="true">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              </div>
              <GlassCard delay={i * 0.08} className="py-3 px-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <h4 className="font-semibold text-xs md:text-sm text-[var(--text-primary)]">{exp.title}</h4>
                      <span className="text-[10px] font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-1.5 py-0.5 rounded whitespace-nowrap">{exp.period}</span>
                    </div>
                    {exp.company && (
                      <p className="text-[10px] font-mono text-[var(--text-secondary)] mb-1">{exp.company}</p>
                    )}
                    <p className="text-[11px] text-[var(--text-secondary)] mb-2">{exp.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--border)] text-[var(--text-secondary)]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
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
        viewport={{ once: true }}
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-8 text-center"
      >
        ▸ PERFIL
      </motion.h2>

      <motion.div
        variants={stagger(0.05)}
        initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="max-w-5xl mx-auto"
      >
        <ExperienceSubSection />
      </motion.div>
    </section>
  );
}
