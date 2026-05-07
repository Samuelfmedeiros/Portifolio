"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { Radio, Send, CheckCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { supabase } from "@/lib/supabase";
import type { FormStatus } from "@/lib/types";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const lastSentRef = useRef<number>(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSentRef.current < 30_000) {
      setStatus("error");
      setErrorMessage("⚠ Aguarde 30 segundos entre envios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("⚠ Formato de email inválido.");
      return;
    }

    lastSentRef.current = now;
    setStatus("sending");

    if (!supabase) {
      setStatus("error");
      setErrorMessage("⚠ Banco de dados indisponível.");
      return;
    }

    const { error } = await supabase.from("messages").insert({
      name,
      email,
      content,
    });

    if (error) {
      console.error("Supabase error:", error);
      setStatus("error");
    } else {
      setStatus("sent");
      setName("");
      setEmail("");
      setContent("");
    }
  };

  return (
    <section id="contact" className="py-20 px-6">
      <h2 className="text-3xl font-mono text-[var(--accent)] mb-12 text-center">
        ▸ TRANSMISSÃO
      </h2>

      <GlassCard className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Radio className="w-5 h-5 text-[var(--accent)] animate-pulse" />
          <span className="font-mono text-sm text-[var(--text-secondary)]">
            CANAL DE COMUNICAÇÃO ABERTO
          </span>
        </div>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <p className="font-mono text-sm text-[var(--accent)]">TRANSMISSÃO ENVIADA COM SUCESSO</p>
            <button
              onClick={() => { setStatus("idle"); setErrorMessage(""); }}
              className="mt-4 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)]"
            >
              [NOVA TRANSMISSÃO]
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-[var(--text-secondary)] mb-1">
                01 — OPERADOR
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[var(--text-secondary)] mb-1">
                02 — FREQUÊNCIA (EMAIL)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[var(--text-secondary)] mb-1">
                03 — MENSAGEM
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="w-full bg-black/30 border border-[var(--border)] rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
                placeholder="Digite sua mensagem..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full glass border-[var(--accent)]/30 rounded-lg py-3 font-mono text-sm text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "sending" ? (
                "ENVIANDO..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> INICIAR TRANSMISSÃO
                </>
              )}
            </button>

            {status === "error" && (
              <p className="text-xs font-mono text-red-400 text-center">
                {errorMessage || "ERRO NA TRANSMISSÃO. Tente novamente."}
              </p>
            )}
          </form>
        )}
      </GlassCard>
    </section>
  );
}
