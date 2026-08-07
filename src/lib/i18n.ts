"use client";

import { createContext, useContext } from "react";
import { dict, type DictKey } from "./dictionary";

/** Supported locales */
export type Locale = "pt" | "en";

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  t: (key: string, fallback?: string) => string;
}

export const STORAGE_KEY = "mc-locale";

export const LanguageContext = createContext<LanguageContextType>({
  locale: "pt",
  setLocale: () => {},
  toggle: () => {},
  t: (key, fallback) => fallback ?? key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Shorthand for useLanguage().t */
export function useT() {
  const { t } = useLanguage();
  return t;
}

export function getInitialLocale(): Locale {
  // Detecta o idioma de origem do usuário (navigator.language):
  // - "pt", "pt-BR", "pt-PT" → PT
  // - qualquer outro → EN
  // Samuel pediu (07/08/2026): abre no padrão do país de origem,
  // pt-BR se vier do Brasil, inglês se vier de outro país.
  if (typeof window === "undefined") return "pt";
  const lang = (navigator.language || navigator.languages?.[0] || "pt").toLowerCase();
  if (lang.startsWith("pt")) return "pt";
  return "en";
}

/** Translate a key using the dictionary (for non-hook contexts) */
export function translate(locale: Locale, key: string, fallback?: string): string {
  const value = (dict[locale] as any)?.[key];
  if (value) return value;
  const ptValue = (dict.pt as any)?.[key];
  if (ptValue) return ptValue;
  return fallback ?? key;
}
