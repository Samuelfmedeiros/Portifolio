"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Star, GitFork, Calendar, Zap } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { Repo } from "@/lib/types";
import { FEATURED_PROJECTS } from "@/lib/staticProjects";
import { getProjectAffiliates } from "@/lib/monetization";
import { useAnalytics } from "@/hooks/useAnalytics";

const FEATURED = FEATURED_PROJECTS;

// Language color map
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

// Gradient map for known projects
const PROJECT_GRADIENTS: Record<string, string> = {
  "seu.pet": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "portifolio": "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  DogWalk: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
};

// Tech tag colors based on category
const getTagStyle = (tech: string) => {
  const lower = tech.toLowerCase();
  if (["next.js", "react", "next"].includes(lower))
    return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  if (["supabase", "postgresql", "postgres", "sql", "mysql"].includes(lower))
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (["python", "pandas", "numpy", "scikit"].includes(lower))
    return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  if (["tailwind", "css", "html"].includes(lower))
    return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  if (["docker", "cloudflare", "azure", "aws"].includes(lower))
    return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (["node", "express", "hono", "api"].includes(lower))
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (["power", "bi", "dax", "excel"].includes(lower))
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  return "bg-[var(--border)]/50 text-[var(--text-secondary)] border-[var(--border)]/30";
};

// Extract tech tags from repo
const extractTechTags = (repo: Repo): string[] => {
  const tags: string[] = [];
  if (repo.language) tags.push(repo.language);
  if (repo.topics && repo.topics.length > 0) {
    tags.push(...repo.topics.filter((t) => t !== "featured"));
  }
  // Infer from description
  const desc = (repo.description || "").toLowerCase();
  if (desc.includes("next.js") || desc.includes("nextjs")) tags.push("Next.js");
  if (desc.includes("react")) tags.push("React");
  if (desc.includes("supabase")) tags.push("Supabase");
  if (desc.includes("tailwind")) tags.push("Tailwind");
  if (desc.includes("python")) tags.push("Python");
  if (desc.includes("docker")) tags.push("Docker");
  if (desc.includes("power bi") || desc.includes("powerbi")) tags.push("Power BI");
  if (desc.includes("sql")) tags.push("SQL");
  // Deduplicate
  return [...new Set(tags)].slice(0, 5);
};

function ProjectCard({ repo, index: i }: { repo: Repo; index: number }) {
  const isFeatured = FEATURED.includes(repo.name);
  const techTags = extractTechTags(repo);
  const langColor = repo.language ? LANG_COLORS[repo.language] || "var(--accent)" : "var(--accent)";
  const updated = repo.pushed_at
    ? new Date(repo.pushed_at).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
    : null;
  const gradient = repo.imageGradient || PROJECT_GRADIENTS[repo.name] || "linear-gradient(135deg, var(--accent) 0%, var(--accent-alt, #7c3aed) 100%)";
  const { track } = useAnalytics();

  return (
    <motion.div
      key={repo.id}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, delay: i * 0.05 }}
    >
      <GlassCard
        delay={0}
        className="group relative h-full flex flex-col overflow-hidden hover:scale-[1.03] transition-all duration-300"
      >
        {/* Holo-card glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent-alt)]/5" />
        <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit] bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-[var(--accent-alt)]/20 blur-sm" />
        
        {/* Scan-line effect on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.3) 2px, rgba(0, 212, 255, 0.3) 4px)",
            backgroundSize: "100% 4px"
          }}
        />

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-3 right-3 z-20">
            <span className="text-[9px] font-mono text-[var(--accent)] border border-[var(--accent)]/40 px-2 py-0.5 rounded bg-[var(--accent)]/10 backdrop-blur-sm">
              ★ FEATURED
            </span>
          </div>
        )}

        {/* Project image header — clickable if has demo */}
        {repo.homepage || repo.hasDemo ? (
          <a
            href={repo.homepage || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[120px] w-full shrink-0 overflow-hidden flex items-center justify-center block group/image"
            style={{ background: gradient }}
            onClick={() => track({ type: "project_click", project: repo.name })}
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_60%)]" />
            {/* Grid overlay pattern */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />
            {repo.imageUrl ? (
              <Image
                src={repo.imageUrl}
                alt={repo.name}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                unoptimized
              />
            ) : repo.icon ? (
              <span className="text-4xl relative z-10 drop-shadow-lg">{repo.icon}</span>
            ) : (
              <span className="font-mono text-xl font-bold text-white/90 tracking-wider drop-shadow-lg relative z-10">
                {repo.name}
              </span>
            )}
            {/* Play overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover/image:opacity-100 text-white font-mono text-xs tracking-widest transition-opacity duration-300 flex items-center gap-1">
                ▶ ACESSAR
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--card-bg,#0a0a1a)] to-transparent" />
          </a>
        ) : (
          <div
            className="relative h-[120px] w-full shrink-0 overflow-hidden flex items-center justify-center"
            style={{ background: gradient }}
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_60%)]" />
            {/* Grid overlay pattern */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />
            {repo.imageUrl ? (
              <Image
                src={repo.imageUrl}
                alt={repo.name}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                unoptimized
              />
            ) : repo.icon ? (
              <span className="text-4xl relative z-10 drop-shadow-lg">{repo.icon}</span>
            ) : (
              <span className="font-mono text-xl font-bold text-white/90 tracking-wider drop-shadow-lg relative z-10">
                {repo.name}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--card-bg,#0a0a1a)] to-transparent" />
          </div>
        )}

        <div className="relative p-1 flex flex-col flex-1">
          {/* Name (always visible now) */}
          <p className="text-xs font-mono font-semibold text-[var(--text-primary)] mb-1 truncate">
            {repo.icon && repo.name}
          </p>

          {/* Description */}
          <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2 flex-1 mt-1">
            {repo.description || "No description provided"}
          </p>

          {/* Tech tags */}
          {techTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {techTags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${getTagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] mb-3 pb-3 border-b border-[var(--border)]/30">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: langColor }}
                />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3" /> {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-0.5">
              <GitFork className="w-3 h-3" /> {repo.forks_count}
            </span>
            {updated && (
              <span className="flex items-center gap-0.5 ml-auto">
                <Calendar className="w-3 h-3" /> {updated}
              </span>
            )}
          </div>

          {/* Action links */}
          <div className="flex gap-3">
            {repo.html_url && (
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 group/link"
              >
                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                REPO
              </a>
            )}
            {(repo.homepage || repo.hasDemo) && (
              <a
                href={repo.homepage || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-[var(--accent-alt)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 group/link"
              >
                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                SITE
              </a>
            )}
          </div>

          {/* Affiliate "powered by" links */}
          {getProjectAffiliates(repo.name).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-[var(--border)]/20">
              <span className="text-[8px] font-mono text-[var(--text-secondary)]/40 self-center">
                powered by
              </span>
              {getProjectAffiliates(repo.name).map((aff) => (
                <a
                  key={aff.key}
                  href={aff.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="text-[8px] font-mono text-[var(--text-secondary)]/40 hover:text-[var(--accent)] transition-colors flex items-center gap-0.5"
                >
                  <Zap className="w-2 h-2" />
                  {aff.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function ProjectHangar({ repos, title = "▸ PROJETOS" }: { repos: Repo[]; title?: string }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { track } = useAnalytics();

  // Collect all unique languages/tags for filter
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    if (!repos) return ["all"];
    repos.forEach((r) => {
      if (r.language) tagSet.add(r.language);
      r.topics?.forEach((t) => {
        if (t !== "featured") tagSet.add(t);
      });
    });
    return ["all", ...Array.from(tagSet).sort()];
  }, [repos]);

  // Filter repos
  const filteredRepos = useMemo(() => {
    if (activeFilter === "all") return repos;
    return repos.filter(
      (r) =>
        r.language === activeFilter || r.topics?.includes(activeFilter)
    );
  }, [repos, activeFilter]);

  if (!repos || repos.length === 0) {
    return (
      <section className="py-8 px-6">
        <h2 className="text-xl font-mono text-[var(--accent)] mb-6 text-center">
          ▸ Nenhum projeto encontrado
        </h2>
      </section>
    );
  }

  return (
    <section className="py-8 px-6">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-xl font-mono text-[var(--accent)] mb-4 text-center"
      >
        {title}
      </motion.h2>

      {/* Filter bar */}
      {allTags.length > 1 && (
        <div className="flex items-center justify-center gap-1 mb-4 overflow-x-auto hide-scrollbar pb-2">
          {allTags.slice(0, 12).map((tag) => (
            <button
              key={tag}
              onClick={() => { setActiveFilter(tag); track({ type: "project_filter", filter: tag }); }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all shrink-0 whitespace-nowrap ${
                activeFilter === tag
                  ? "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40 shadow-[0_0_10px_var(--accent)]/10"
                  : "text-[var(--text-secondary)] border border-transparent hover:border-[var(--border)]/50 hover:text-[var(--text-primary)] hover:bg-[var(--border)]/10"
              }`}
            >
              {tag === "all" ? "Todos" : tag}
            </button>
          ))}
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-4 mb-6 font-mono text-xs text-[var(--text-secondary)]">
        <span>{filteredRepos.length} projeto{filteredRepos.length !== 1 ? "s" : ""}</span>
        <span className="text-[var(--border)]">|</span>
        <span>Filtro: {activeFilter === "all" ? "Todos" : activeFilter}</span>
      </div>

      {/* Cards grid */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        layout
      >
        <AnimatePresence>
          {filteredRepos.map((repo, i) => (
            <ProjectCard key={repo.id} repo={repo} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredRepos.length === 0 && (
        <div className="text-center py-8">
          <p className="font-mono text-sm text-[var(--text-secondary)]">
            Nenhum projeto encontrado com o filtro {'"'}{activeFilter}{'"'}
          </p>
          <button
            onClick={() => setActiveFilter("all")}
            className="mt-4 px-4 py-2 rounded-lg font-mono text-xs text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </section>
  );
}
