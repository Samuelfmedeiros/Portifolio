"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code, Star, GitFork } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Repo } from "@/lib/types";

const FEATURED = ["DogWalk", "mission-control"];

export function ProjectHangar({ repos }: { repos: Repo[] }) {
  if (!repos || repos.length === 0) {
    return (
      <section id="projects" className="py-20 px-6">
        <h2 className="text-3xl font-mono text-[var(--accent)] mb-12 text-center">
          ▸ HANGAR VAZIO — NENHUM PROJETO ENCONTRADO
        </h2>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-6">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl font-mono text-[var(--accent)] mb-12 text-center"
      >
        ▸ HANGAR DE PROJETOS
      </motion.h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo, i) => {
          const isFeatured = FEATURED.includes(repo.name);
          return (
            <GlassCard
              key={repo.id}
              delay={i * 0.1}
              className={`${isFeatured ? "ring-1 ring-[var(--accent)]" : ""} hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[var(--text-secondary)]" />
                  <h3 className="font-mono text-sm text-[var(--text-primary)]">
                    {repo.name}
                  </h3>
                </div>
                {isFeatured && (
                  <span className="text-[10px] font-mono text-[var(--accent)] border border-[var(--accent)] px-2 py-0.5 rounded">
                    FEATURED
                  </span>
                )}
              </div>

              <p className="text-xs text-[var(--text-secondary)] mb-4 line-clamp-2">
                {repo.description || "No description"}
              </p>

              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mb-4">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" /> {repo.forks_count}
                </span>
              </div>

              <div className="flex gap-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> REPO
                </a>
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[var(--accent-alt)] hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> DEMO
                  </a>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
