"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { LanguageContext, getInitialLocale, translate, type Locale } from "@/lib/i18n";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  // Sync to html lang attribute (não persiste locale — sempre PT na próxima visita)
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);
  const toggle = () => setLocaleState((prev) => (prev === "pt" ? "en" : "pt"));

  const t = useCallback(
    (key: string, fallback?: string) => translate(locale, key, fallback),
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
