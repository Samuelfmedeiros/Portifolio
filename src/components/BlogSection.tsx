"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, PenLine } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { LifelogPost } from "@/lib/lifelogRss";

// Mapa de ícones por projeto (espelha o projects.ts do LifeLog)
const PROJECT_ICONS: Record<string, string> = {
  arachne: "🕷️",
  dogwalk: "🐶",
  portfolio: "🚀",
  capivara: "🐹",
  tatuengine: "🌊",
  seguranca: "🔒",
  lifelog: "📖",
  estudos: "📚",
  descobertas: "💡",
};

// Labels dos projetos (fallback pt)
const PROJECT_LABELS: Record<string, string> = {
  arachne: "Arachne",
  dogwalk: "Dogwalk",
  portfolio: "Portfólio",
  capivara: "Capivara",
  tatuengine: "TatuEngine",
  seguranca: "Segurança",
  lifelog: "LifeLog",
  estudos: "Estudos",
  descobertas: "Descobertas",
};

const DEFAULT_ACCENT = "var(--accent)";

function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

interface BlogCardProps {
  post: LifelogPost;
  index: number;
}

function BlogCard({ post, index }: BlogCardProps) {
  const accent = post.accent || DEFAULT_ACCENT;
  const projectLabel = post.project ? (PROJECT_LABELS[post.project] || post.project) : "LifeLog";
  const projectIcon = post.project ? (PROJECT_ICONS[post.project] || "📝") : "📝";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card,#ffffff)] hover:border-transparent transition-all duration-300"
      style={{ ["--blog-accent" as string]: accent }}
    >
      {/* Top accent line (igual PostCard do LifeLog) */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, var(--blog-accent), transparent)` }}
      />

      <a href={post.url} target="_blank" rel="noopener noreferrer" className="block no-underline">
        {/* Cover 21:9 (igual LifeLog) */}
        <div className="relative w-full aspect-[21/9] overflow-hidden" style={{ background: "var(--bg-gradient)" }}>
          {post.cover ? (
            <Image
              src={post.cover}
              alt={post.title}
              fill
              unoptimized
              loading="lazy"
              className="object-cover transition-transform duration-400 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl opacity-40" style={{ filter: `drop-shadow(0 0 20px var(--blog-accent))` }}>
                {projectIcon}
              </span>
            </div>
          )}
          {/* Badge do projeto (igual LifeLog) */}
          <div
            className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10"
            style={{ boxShadow: `0 0 12px color-mix(in srgb, var(--blog-accent) 40%, transparent)` }}
          >
            {projectIcon} {projectLabel}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-2 text-xs mb-2 text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1 font-mono" style={{ color: `var(--blog-accent)` }}>
              <PenLine className="w-3 h-3" />
              {post.project ? projectLabel.toUpperCase() : "LIFELOG"}
            </span>
            {post.date && (
              <span className="text-[var(--text-secondary)]">· {formatDate(post.date)}</span>
            )}
          </div>

          <h3 className="text-base md:text-lg font-semibold leading-snug mb-2 text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--blog-accent)] transition-colors duration-300">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
              {post.excerpt}
            </p>
          )}

          <div
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            style={{ color: `var(--blog-accent)` }}
          >
            Continuar lendo <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </a>
    </motion.article>
  );
}

interface BlogSectionProps {
  posts: LifelogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const { t, locale } = useLanguage();
  if (!posts || posts.length === 0) return null;

  // Filtra por locale: PT mostra posts sem /en/, EN mostra posts EN.
  // O RSS traz versões duplicadas (PT/EN do mesmo post).
  const isEn = locale === "en";
  const filtered = posts
    .filter((p) => (isEn ? p.url.includes("/en/") : !p.url.includes("/en/")))
    .slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <section className="py-8 px-6">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-xl font-mono text-[var(--accent)] mb-6 text-center"
      >
        {t("blog.section.title", "▸ DO BLOG")}
      </motion.h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {filtered.map((post, i) => (
          <BlogCard key={post.url} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
