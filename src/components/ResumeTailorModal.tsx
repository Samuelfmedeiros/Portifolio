"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  FileText,
  Loader2,
  Shield,
  AlertCircle,
  ListChecks,
  Download,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useAnalytics } from "@/hooks/useAnalytics";
import { generateResumePdf, type ResumePDFData } from "@/lib/resumePdf";
import { getResumeData } from "@/lib/resumeData";
import type { BrandTheme } from "@/lib/brandColors";

interface ResumeTailorModalProps {
  open: boolean;
  onClose: () => void;
}

/** Painel "o que a IA mudou" (V5) — diff base × tailored calculado no client. */
interface ResumeDiff {
  fields: { label: string; before: string; after: string }[];
  skillsAfter: string[];
  highlights: string[];
  jobMatch: string[];
  bulletsChanged: number;
}

function buildDiff(resume: ResumePDFData, locale: "pt" | "en"): ResumeDiff {
  const base = getResumeData(locale);
  const en = locale === "en";
  const L = {
    role: en ? "Role" : "Cargo",
    objective: en ? "Objective" : "Objetivo",
    summary: en ? "Summary" : "Resumo",
  };
  const fields: ResumeDiff["fields"] = [];
  if (resume.role && resume.role !== base.role) {
    fields.push({ label: L.role, before: base.role, after: resume.role });
  }
  if (resume.objective && resume.objective !== base.objective) {
    fields.push({ label: L.objective, before: base.objective, after: resume.objective });
  }
  if (resume.summary && resume.summary !== base.summary) {
    fields.push({ label: L.summary, before: base.summary, after: resume.summary });
  }

  const baseBullets = new Set(
    base.experiences.flatMap((e) => e.bullets).map((b) => b.trim()),
  );
  const newBullets = (resume.experiences ?? []).flatMap((e) => e.bullets ?? []);
  const bulletsChanged = newBullets.filter((b) => !baseBullets.has(b.trim())).length;

  return {
    fields,
    skillsAfter: resume.skills ?? base.skills,
    highlights: resume.highlights ?? [],
    jobMatch: resume.jobMatch ?? [],
    bulletsChanged,
  };
}

export function ResumeTailorModal({ open, onClose }: ResumeTailorModalProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [diff, setDiff] = useState<ResumeDiff | null>(null);
  const [lastDownload, setLastDownload] = useState<{ blob: Blob; filename: string } | null>(null);
  const runningRef = useRef(false);
  const { t, locale } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, open, () => { if (status !== "loading") onClose(); });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (runningRef.current) return;

    runningRef.current = true;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/resume-tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, locale }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: t("resume.tailor.error.generic") }));
        throw new Error(err.error || t("resume.tailor.error.generic"));
      }

      const data = await res.json();

      // Se a API detectou que o input NÃO é sobre vaga → entrega o PDF
      // normal do site (o mesmo do botão "Baixar Currículo").
      if (data.standard) {
        const dlRes = await fetch("/api/download-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ consent: true, locale: data.locale ?? locale }),
        });
        if (!dlRes.ok) throw new Error(t("resume.tailor.error.generic"));
        const blob = await dlRes.blob();
        downloadBlob(blob, (data.locale ?? locale) === "en" ? "Samuel_Andrade_Resume_2026.pdf" : "Samuel_Andrade_2026.pdf");
        setStatus("success");
        setTimeout(() => {
          onClose();
          setStatus("idle");
          setInput("");
        }, 1600);
        return;
      }

      const resume = data.resume as ResumePDFData;
      const brand = (data.brand ?? null) as BrandTheme | null;

      // Gera o PDF do currículo a partir do JSON (ATS-friendly).
      // Se a API detectou a marca (ex: Google), aplica o tema de cores dela.
      const pdfBlob = generateResumePdf({ ...resume, jobRef: data.jobRef }, locale, brand);
      const filename = locale === "en" ? "Samuel_Andrade_Resume_Tailored.pdf" : "Samuel_Andrade_Curriculo_Personalizado.pdf";
      downloadBlob(pdfBlob, filename);

      // V5: mantém o modal aberto e mostra o painel "o que a IA mudou".
      setLastDownload({ blob: pdfBlob, filename });
      setDiff(buildDiff(resume, locale));
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("resume.tailor.error.generic"));
    } finally {
      runningRef.current = false;
    }
  }

  function handleDownloadAgain() {
    if (!lastDownload) return;
    downloadBlob(lastDownload.blob, lastDownload.filename);
  }

  function handleClose() {
    if (status === "loading") return;
    onClose();
    setTimeout(() => {
      setStatus("idle");
      setDiff(null);
      setLastDownload(null);
    }, 200);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" ref={modalRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-secondary)] p-6 shadow-2xl shadow-[var(--accent)]/10"
          >
            <button
              onClick={handleClose}
              disabled={status === "loading"}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors disabled:opacity-40"
              aria-label={t("cv.close", "Fechar")}
            >
              <X size={18} />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                <Sparkles size={20} className="text-[var(--accent)]" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] font-mono">
                {t("resume.tailor.title")}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {t("resume.tailor.subtitle")}
              </p>
            </div>

            {status === "success" ? (
              <div className="space-y-3" aria-live="polite">
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-9 h-9 rounded-full bg-[var(--success)]/10 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[var(--success)]" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--success)] font-mono">
                    {t("resume.tailor.success", "Currículo gerado!")}
                  </p>
                </div>

                {diff && (
                  <div className="rounded-lg border border-[var(--accent)]/20 bg-[var(--bg-card)]">
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border)]">
                      <ListChecks size={13} className="text-[var(--accent)]" />
                      <p className="text-[11px] font-semibold font-mono text-[var(--text-primary)]">
                        {t("resume.tailor.diff.title", "O que a IA mudou")}
                      </p>
                    </div>

                    <div className="max-h-64 overflow-y-auto px-3 py-2 space-y-3">
                      {/* Campos de texto reescritos (antes → depois) */}
                      {diff.fields.map((f) => (
                        <div key={f.label}>
                          <p className="text-[10px] uppercase tracking-wide font-mono text-[var(--text-secondary)] mb-0.5">
                            {f.label}
                          </p>
                          <p className="text-[11px] leading-snug text-[var(--text-secondary)] line-through decoration-red-400/50">
                            {f.before}
                          </p>
                          <p className="text-[11px] leading-snug text-[var(--text-primary)]">
                            {f.after}
                          </p>
                        </div>
                      ))}

                      {/* Skills reordenadas/enquadradas */}
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-mono text-[var(--text-secondary)] mb-1">
                          {t("resume.tailor.diff.skills", "Skills priorizadas para a vaga")}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {diff.skillsAfter.map((s) => {
                            const short = s.split(":")[0].slice(0, 34);
                            return (
                              <span
                                key={s}
                                className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--text-primary)]"
                              >
                                {short}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Palavras-chave da vaga (chips do PDF) */}
                      {diff.highlights.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wide font-mono text-[var(--text-secondary)] mb-1">
                            {t("resume.tailor.diff.highlights", "Palavras-chave da vaga")}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {diff.highlights.map((h) => (
                              <span
                                key={h}
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] font-semibold"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Match com a vaga (bullets novos no PDF) */}
                      {diff.jobMatch.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wide font-mono text-[var(--text-secondary)] mb-1">
                            {t("resume.tailor.diff.match", "Match com a vaga")}
                          </p>
                          <ul className="space-y-1">
                            {diff.jobMatch.map((m) => (
                              <li key={m} className="text-[11px] leading-snug text-[var(--text-primary)] flex gap-1.5">
                                <span className="text-[var(--accent)] shrink-0">▸</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Bullets reescritos */}
                      {diff.bulletsChanged > 0 && (
                        <p className="text-[10px] font-mono text-[var(--text-secondary)]">
                          +{" "}
                          {t(
                            "resume.tailor.diff.bullets",
                            "bullets de experiência reescritos para a vaga",
                          )}
                          : <span className="text-[var(--accent)] font-semibold">{diff.bulletsChanged}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownloadAgain}
                  className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-mono text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  {t("resume.tailor.btn.again", "Baixar novamente")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="resume-tailor-input"
                    className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] mb-1.5"
                  >
                    <FileText size={12} />
                    {t("resume.tailor.label", "Vaga, empresa ou área")}
                  </label>
                  <textarea
                    id="resume-tailor-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("resume.tailor.placeholder")}
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 focus:outline-none focus:border-[var(--accent)]/60 transition-colors font-mono resize-none"
                  />
                  <p className="text-[10px] text-right text-[var(--text-secondary)] font-mono mt-1">
                    {input.length}/500
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/15">
                  <Shield size={14} className="mt-0.5 text-[var(--accent)] shrink-0" />
                  <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                    {t("resume.tailor.notice", "A IA reescreve o currículo para a vaga. Dados reais são mantidos — nada é inventado.")}
                  </p>
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 font-mono text-center flex items-center justify-center gap-1.5">
                    <AlertCircle size={12} /> {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={input.trim().length < 5 || status === "loading"}
                  className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-mono text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t("resume.tailor.btn.loading")}
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      {t("resume.tailor.btn")}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
