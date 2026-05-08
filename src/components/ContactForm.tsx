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
      setErrorMessage("Aguarde 30 segundos entre envios.");
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
    <section id="contact" className="py-12 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-8 text-center"
      >
        ▸ CONTATO
      </motion.h2>

      {/* Social contact bar */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <a
          href="https://linkedin.com/in/samuelandrade"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors group"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
        <span className="text-[var(--border)]">|</span>
        <a
          href="https://github.com/Samuelfmedeiros"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </a>
        <span className="text-[var(--border)]">|</span>
        <a
          href="mailto:samuelandrademedeiros@gmail.com"
          className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          ✉ samuelandrademedeiros@gmail.com
        </a>
      </div>

      <GlassCard className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <Radio className="w-4 h-4 text-[var(--accent)] animate-pulse" />
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Entre em contato
          </span>
        </div>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <p className="font-mono text-sm text-[var(--accent)]">Mensagem enviada</p>
            <button
              onClick={() => { setStatus("idle"); setErrorMessage(""); }}
              className="mt-4 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)]"
            >
              Enviar outra mensagem
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-[var(--text-secondary)] mb-1">
                Nome
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
                Email
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
                Mensagem
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
                "Enviando..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> Enviar mensagem
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
