"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, PenLine } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { LifelogPost } from "@/lib/lifelogRss";

interface BlogSectionProps {
  post: LifelogPost | null;
}

export function BlogSection({ post }: BlogSectionProps) {
  const { t } = useLanguage();

  if (!post) return null;

  return (
    <section className="py-8 px-6">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-xl font-mono text-[var(--accent)] mb-6 text-center"
      >
        {t("blog.section.title", "▸ DO BLOG")}
      </motion.h2>

      <div className="max-w-3xl mx-auto">
        <motion.a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="group block glass rounded-xl p-5 md:p-6 border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all duration-300 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[var(--accent)] border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
              <PenLine className="w-3 h-3" />
              {t("blog.latest", "ÚLTIMO POST")}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base md:text-lg font-mono text-[var(--text-primary)] leading-relaxed group-hover:text-[var(--accent)] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <ArrowUpRight className="w-5 h-5 shrink-0 text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>

          <p className="text-xs font-mono text-[var(--text-secondary)] mt-3 group-hover:text-[var(--accent)] transition-colors">
            {t("blog.read", "Ler no LifeLog →")}
          </p>
        </motion.a>
      </div>
    </section>
  );
}
