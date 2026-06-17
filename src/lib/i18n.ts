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
  if (typeof window === "undefined") return "pt";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "en") return "en";
  return "pt";
}

/** Translate a key using the dictionary (for non-hook contexts) */
export function translate(locale: Locale, key: string, fallback?: string): string {
  const value = (dict[locale] as any)?.[key];
  if (value) return value;
  const ptValue = (dict.pt as any)?.[key];
  if (ptValue) return ptValue;
  return fallback ?? key;
}
