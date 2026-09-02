"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TypeWriterProps {
  phrases: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function TypeWriter({
  phrases,
  className = "",
  speed = 40,
  deleteSpeed = 25,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState(() => phrases[0] ?? "");
  const [isDeleting, setIsDeleting] = useState(false);
  // Acessibilidade: usuário com prefers-reduced-motion não vê cursor piscando
  // (também estabiliza o fullPage screenshot dos testes visuais)
  const prefersReducedMotion = useReducedMotion();

  // Se as frases mudaram (ex: troca de locale PT/EN), reinicia a digitação
  // com as novas frases — senão continua mostrando o idioma antigo.
  const phrasesKey = phrases.join("|");
  const [lastKey, setLastKey] = useState(phrasesKey);
  useEffect(() => {
    if (phrasesKey !== lastKey) {
      setLastKey(phrasesKey);
      setCurrentText("");
      setIsDeleting(false);
      setCurrentPhraseIndex(0);
    }
  }, [phrasesKey, lastKey]);

  const tick = useCallback(() => {
    const fullText = phrases[currentPhraseIndex];

    if (isDeleting) {
      setCurrentText(fullText.substring(0, currentText.length - 1));
    } else {
      setCurrentText(fullText.substring(0, currentText.length + 1));
    }
  }, [currentPhraseIndex, currentText, isDeleting, phrases]);

  // Acessibilidade (WCAG 2.3.3): prefers-reduced-motion → frase completa estática.
  // O ciclo de digitação é animação não-essencial; mostrar o texto inteiro imediatamente
  // também estabiliza o fullPage screenshot dos testes visuais.
  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentText(phrases[0]);
      setIsDeleting(false);
      setCurrentPhraseIndex(0);
    }
  }, [prefersReducedMotion, phrases]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const fullText = phrases[currentPhraseIndex];

    if (!isDeleting && currentText === fullText) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentText === "") {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 300);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(tick, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, tick, speed, deleteSpeed, pauseDuration]);

  return (
    <span
      className={className}
      role="text"
      aria-label={phrases[currentPhraseIndex]}
    >
      {currentText}
      <motion.span
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-[1em] bg-[var(--accent)] ml-0.5 align-middle"
      />
    </span>
  );
}
