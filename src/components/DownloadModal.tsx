"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, User, Mail, Shield } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
}

export function DownloadModal({ open, onClose }: DownloadModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const downloadingRef = useRef(false);
  const { track } = useAnalytics();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent || downloadingRef.current) return;

    downloadingRef.current = true;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/download-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email: email || undefined,
          consent: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erro ao baixar" }));
        throw new Error(err.error || "Erro ao baixar currículo");
      }

      // Track no Umami
      track({
        type: "cv_download",
        hasName: !!name.trim(),
        hasEmail: !!email.trim(),
      });

      // Download do PDF
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Samuel_Andrade_2026.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus("success");
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      downloadingRef.current = false;
    }
  }

  function resetForm() {
    setName("");
    setEmail("");
    setConsent(false);
    setStatus("idle");
    setErrorMsg("");
  }

  function handleClose() {
    if (status === "loading") return;
    onClose();
    setTimeout(resetForm, 200);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md rounded-xl border border-[var(--accent)]/30 bg-[#0a0a0f] p-6 shadow-2xl shadow-[var(--accent)]/10"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              disabled={status === "loading"}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors disabled:opacity-40"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                <Download size={22} className="text-[var(--accent)]" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] font-mono">
                Baixar Currículo
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Samuel Medeiros — Currículo 2026
              </p>
            </div>

            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Download size={24} className="text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-emerald-400 font-mono">
                  Download iniciado! 🚀
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name — optional */}
                <div>
                  <label
                    htmlFor="cv-name"
                    className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] mb-1.5"
                  >
                    <User size={12} />
                    Nome <span className="text-[var(--text-secondary)]/50">(opcional)</span>
                  </label>
                  <input
                    id="cv-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-3 py-2 rounded-lg bg-[#111118] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 focus:outline-none focus:border-[var(--accent)]/60 transition-colors font-mono"
                  />
                </div>

                {/* Email — optional */}
                <div>
                  <label
                    htmlFor="cv-email"
                    className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] mb-1.5"
                  >
                    <Mail size={12} />
                    Email <span className="text-[var(--text-secondary)]/50">(opcional)</span>
                  </label>
                  <input
                    id="cv-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#111118] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 focus:outline-none focus:border-[var(--accent)]/60 transition-colors font-mono"
                  />
                </div>

                {/* Consent — required */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/15">
                  <input
                    id="cv-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[var(--border)] bg-[#111118] text-[var(--accent)] focus:ring-[var(--accent)]/30 accent-[var(--accent)]"
                  />
                  <label htmlFor="cv-consent" className="text-[11px] text-[var(--text-secondary)] leading-snug cursor-pointer">
                    <span className="flex items-center gap-1 font-medium text-[var(--text-primary)] mb-0.5">
                      <Shield size={11} /> Consentimento de coleta
                    </span>
                    Autorizo a coleta de dados de navegação (IP, User-Agent,
                    navegador) e das informações fornecidas acima para fins
                    estatísticos de download do currículo.{' '}
                    <a href="/privacidade" target="_blank" className="text-[var(--accent)] hover:underline">
                      Política de Privacidade
                    </a>
                  </label>
                </div>

                {/* Error */}
                {status === "error" && (
                  <p className="text-xs text-red-400 font-mono text-center">{errorMsg}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!consent || status === "loading"}
                  className="w-full py-2.5 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] font-mono text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[var(--bg-primary)] border-t-transparent rounded-full animate-spin" />
                      Preparando...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Baixar Currículo
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[var(--text-secondary)]/50 font-mono">
                  Seus dados não serão compartilhados com terceiros
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
