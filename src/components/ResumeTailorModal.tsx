"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, FileText, Loader2, Shield, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useAnalytics } from "@/hooks/useAnalytics";
import { generateResumePdf, type ResumePDFData } from "@/lib/resumePdf";
import type { BrandTheme } from "@/lib/brandColors";

interface ResumeTailorModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeTailorModal({ open, onClose }: ResumeTailorModalProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
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
      const pdfBlob = generateResumePdf(resume, locale, brand);
      downloadBlob(pdfBlob, locale === "en" ? "Samuel_Andrade_Resume_Tailored.pdf" : "Samuel_Andrade_Curriculo_Personalizado.pdf");

      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setInput("");
      }, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("resume.tailor.error.generic"));
    } finally {
      runningRef.current = false;
    }
  }

  function handleClose() {
    if (status === "loading") return;
    onClose();
    setTimeout(() => setStatus("idle"), 200);
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
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
                  <FileText size={24} className="text-[var(--success)]" />
                </div>
                <p className="text-sm font-semibold text-[var(--success)] font-mono">
                  {t("resume.tailor.success", "Currículo gerado!")}
                </p>
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
