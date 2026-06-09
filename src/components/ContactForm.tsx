"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { Radio, Send, CheckCircle, Copy, Check } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { supabase } from "@/lib/supabase";
import type { FormStatus } from "@/lib/types";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const lastSentRef = useRef<number>(0);

  const MAX_MESSAGE_LENGTH = 500;
  const messageLength = content.length;
  const isMessageTooLong = messageLength > MAX_MESSAGE_LENGTH;
  const isFormValid = name.trim() && email.trim() && content.trim() && !isMessageTooLong && lgpdConsent;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

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
      setLgpdConsent(false);
    }
  };

  return (
    <section id="contact" className="py-8 px-4 md:px-6" aria-labelledby="contact-heading">
      <motion.h2
        id="contact-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-mono text-lg md:text-xl tracking-[0.3em] text-[var(--accent)] mb-8 text-center"
      >
        ▸ CONTATO
      </motion.h2>

      {/* Status announcements for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {status === 'sending' && 'Enviando mensagem...'}
        {status === 'sent' && 'Mensagem enviada com sucesso!'}
        {status === 'error' && `Erro: ${errorMessage}`}
      </div>

      {/* WhatsApp CTA */}
      <div className="max-w-lg mx-auto mb-6">
        <a
          href="https://wa.me/556191191722?text=Olá Samuel, vi seu portfólio e gostaria de entrar em contato."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-[var(--whatsapp)] hover:opacity-90 text-white font-mono text-sm font-semibold py-3 px-6 rounded-lg transition-opacity"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Conversar no WhatsApp
        </a>
      </div>

      {/* Social contact bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <a
          href="https://linkedin.com/in/samuelandrademedeiros"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
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
        <button
          onClick={() => {
            navigator.clipboard.writeText("samuelandrademedeiros@gmail.com");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copiado!" : "samuelandrademedeiros@gmail.com"}
        </button>
      </div>

      <GlassCard className="max-w-lg mx-auto text-sm md:text-base">
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
            role="status"
            aria-label="Mensagem enviada com sucesso"
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[var(--success)]" />
            <p className="font-mono text-sm text-[var(--accent)]">Mensagem enviada</p>
            <button
              onClick={() => { setStatus("idle"); setErrorMessage(""); }}
              className="mt-4 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent)]"
            >
              Enviar outra mensagem
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulário de contato">
            <div>
              <label htmlFor="contact-name" className="block font-mono text-xs text-[var(--text-secondary)] mb-1">
                Nome
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)]/30 border border-[var(--border)] rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="Seu nome"
                aria-describedby="contact-name-desc"
              />
              <span id="contact-name-desc" className="sr-only">Digite seu nome completo</span>
            </div>

            <div>
              <label htmlFor="contact-email" className="block font-mono text-xs text-[var(--text-secondary)] mb-1">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[var(--bg-primary)]/30 border border-[var(--border)] rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="seu@email.com"
                aria-describedby="contact-email-desc"
              />
              <span id="contact-email-desc" className="sr-only">Formato esperado: seu@email.com</span>
            </div>

            <div>
              <label htmlFor="contact-message" className="block font-mono text-xs text-[var(--text-secondary)] mb-1">
                Mensagem
              </label>
              <textarea
                id="contact-message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                maxLength={MAX_MESSAGE_LENGTH + 50}
                className={`w-full bg-[var(--bg-primary)]/30 border rounded-lg px-4 py-2 font-mono text-sm text-[var(--text-primary)] outline-none transition-colors resize-none ${
                  isMessageTooLong
                    ? "border-[var(--error)] focus:border-[var(--error)]"
                    : "border-[var(--border)] focus:border-[var(--accent)]"
                }`}
                placeholder="Digite sua mensagem..."
                aria-describedby="contact-message-desc"
              />
              <span id="contact-message-desc" className="sr-only">Máximo de {MAX_MESSAGE_LENGTH} caracteres</span>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {messageLength === 0 ? "Mínimo 10 caracteres" : ""}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    isMessageTooLong
                      ? "text-[var(--error)]"
                      : messageLength > MAX_MESSAGE_LENGTH * 0.8
                        ? "text-[var(--proficiency-proficient)]"
                        : "text-[var(--text-secondary)]"
                  }`}
                  aria-live="polite"
                >
                  {messageLength}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
            </div>

            {/* LGPD Consent Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="contact-lgpd-consent"
                type="checkbox"
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[var(--accent)] cursor-pointer shrink-0"
              />
              <label htmlFor="contact-lgpd-consent" className="text-[11px] font-mono text-[var(--text-secondary)] leading-snug cursor-pointer">
                Concordo com a{" "}
                <a href="#privacidade" className="text-[var(--accent)] hover:underline">
                  Política de Privacidade
                </a>{" "}
                e autorizo o uso dos meus dados para contato.
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "sending" || !isFormValid}
              aria-busy={status === "sending"}
              className={`w-full glass border-[var(--accent)]/30 rounded-lg py-3 font-mono text-sm text-[var(--accent)] transition-colors flex items-center justify-center gap-2 ${
                !isFormValid && status !== "sending"
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[var(--accent)]/10"
              } disabled:opacity-50`}
            >
              {status === "sending" ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" /> Enviar mensagem
                </>
              )}
            </button>

            {status === "error" && (
              <p className="text-xs font-mono text-[var(--error)] text-center">
                {errorMessage || "Aguarde um momento e tente novamente."}
              </p>
            )}
          </form>
        )}
      </GlassCard>
    </section>
  );
}
