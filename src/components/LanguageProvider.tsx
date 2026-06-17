"use client";

import { useState, useEffect, type ReactNode } from "react";
import { LanguageContext, getInitialLocale, type Locale } from "@/lib/i18n";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  // Sync to localStorage + html lang attribute
  useEffect(() => {
    localStorage.setItem("mc-locale", locale);
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);
  const toggle = () => setLocaleState((prev) => (prev === "pt" ? "en" : "pt"));

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}
