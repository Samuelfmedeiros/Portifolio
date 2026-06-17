"use client";

import { createContext, useContext } from "react";

/** Supported locales */
export type Locale = "pt" | "en";

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
}

export const STORAGE_KEY = "mc-locale";

export const LanguageContext = createContext<LanguageContextType>({
  locale: "pt",
  setLocale: () => {},
  toggle: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "en") return "en";
  return "pt";
}
