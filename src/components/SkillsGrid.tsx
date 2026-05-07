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

interface Skill {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  category: string;
}

const skills: Skill[] = [
  { icon: BarChart3, name: "Power BI", category: "BI & Analytics" },
  { icon: Database, name: "SQL & PostgreSQL", category: "Data" },
  { icon: Code2, name: "Python", category: "Backend" },
  { icon: Brain, name: "Machine Learning", category: "AI" },
  { icon: Globe, name: "Next.js & React", category: "Web" },
  { icon: Bot, name: "LLMs Locais", category: "AI" },
  { icon: Container, name: "Docker", category: "DevOps" },
  { icon: GitBranch, name: "Git & GitHub", category: "Tools" },
];

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
    <section className="py-20 md:py-28 px-4 md:px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-12 text-center"
      >
        ▸ SKILLS MATRIX
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
      >
        {skills.map((skill, i) => (
          <motion.div key={skill.name} variants={item}>
            <GlassCard delay={i * 0.08}>
              <div className="flex flex-col items-center text-center gap-3 py-2">
                <skill.icon className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent)]" />
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
