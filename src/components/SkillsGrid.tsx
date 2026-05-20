"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Database,
  Code2,
  Brain,
  Globe,
  Bot,
  Container,
  GitBranch,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Tooltip } from "@/components/Tooltip";

interface Skill {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  category: string;
  proficiency: "Expert" | "Advanced" | "Proficient";
  description: string;
}

const skills: Skill[] = [
  {
    icon: BarChart3,
    name: "Power BI",
    category: "BI & Analytics",
    proficiency: "Expert",
    description: "Interactive dashboards, DAX, data modeling",
  },
  {
    icon: Database,
    name: "SQL & PostgreSQL",
    category: "Data",
    proficiency: "Expert",
    description: "Complex queries, optimization, ETL pipelines",
  },
  {
    icon: Code2,
    name: "Python",
    category: "Backend",
    proficiency: "Advanced",
    description: "FastAPI, automation, data processing",
  },
  {
    icon: Brain,
    name: "Machine Learning",
    category: "AI",
    proficiency: "Advanced",
    description: "Scikit-learn, model training, evaluation",
  },
  {
    icon: Globe,
    name: "Next.js & React",
    category: "Web",
    proficiency: "Advanced",
    description: "Full-stack apps, SSR, responsive UI",
  },
  {
    icon: Bot,
    name: "LLMs Locais",
    category: "AI",
    proficiency: "Proficient",
    description: "Ollama, prompt engineering, RAG systems",
  },
  {
    icon: Container,
    name: "Docker",
    category: "DevOps",
    proficiency: "Proficient",
    description: "Containerization, docker-compose, CI/CD",
  },
  {
    icon: GitBranch,
    name: "Git & GitHub",
    category: "Tools",
    proficiency: "Advanced",
    description: "Version control, branching strategies",
  },
];

const proficiencyColor = {
  Expert: "text-[var(--proficiency-expert)]",
  Advanced: "text-[var(--proficiency-advanced)]",
  Proficient: "text-[var(--proficient)]",
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function SkillsGrid() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto" aria-labelledby="skills-heading">
      <motion.h2
        id="skills-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-12 text-center"
      >
        ▸ HABILIDADES
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
        role="list"
        aria-label="Lista de habilidades técnicas"
      >
        {skills.map((skill) => (
          <motion.div key={skill.name} variants={item} role="listitem">
            <Tooltip
              content={
                <div className="text-center">
                  <p className="font-semibold text-xs text-[var(--text-primary)]">
                    {skill.name}
                  </p>
                  <p className={`font-mono text-[10px] mt-1 ${proficiencyColor[skill.proficiency]}`}>
                    {skill.proficiency}
                  </p>
                  <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-1 leading-tight">
                    {skill.description}
                  </p>
                </div>
              }
            >
              <GlassCard className="group hover:border-[var(--accent)]/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1">
                <div className="flex flex-col items-center text-center gap-3 py-2 cursor-default">
                  <skill.icon className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-[var(--text-primary)]">
                      {skill.name}
                    </h3>
                    <p className="font-mono text-[10px] md:text-xs text-[var(--text-secondary)] mt-1">
                      {skill.category}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}