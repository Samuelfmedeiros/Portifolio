"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLanguage } from "@/lib/i18n";
import type { Repo } from "@/lib/types";

interface ProjectModalProps {
  repo: Repo;
  open: boolean;
  onClose: () => void;
}

// Language color map (copied from ProjectHangar)
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

const getTagStyle = (tech: string) => {
  const lower = tech.toLowerCase();
  if (["next.js", "react", "next"].includes(lower))
    return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  if (["supabase", "postgresql", "postgres", "sql", "mysql"].includes(lower))
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (["python", "fastapi", "pandas", "numpy", "scikit", "langchain", "crawl4ai"].includes(lower))
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

export function ProjectModal({ repo, open, onClose }: ProjectModalProps) {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, open, onClose);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const langColor = repo.language
    ? LANG_COLORS[repo.language] || "var(--accent)"
    : "var(--accent)";

  // Tech tags from topics
  const techTags = (repo.topics || [])
    .filter((t) => t !== "featured")
    .slice(0, 8);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
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
          aria-label={`Detalhes: ${repo.name}`}
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
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-xl">
                    {repo.icon || (
                      <span className="w-5 h-5 text-[var(--accent)] font-mono text-xs font-bold">
                        {repo.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">
                      {repo.name}
                    </h3>
                    {repo.language && (
                      <p className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: langColor }}
                        />
                        {repo.language}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-[var(--border)]/50 hover:bg-[var(--border)] flex items-center justify-center transition-colors shrink-0"
                  aria-label={t("modal.close")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Description */}
              {repo.description && (
                <p className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed mb-4">
                  {repo.description}
                </p>
              )}

              {/* Tech tags */}
              {techTags.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Tecnologias
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {techTags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-mono px-2 py-1 rounded-full border ${getTagStyle(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
