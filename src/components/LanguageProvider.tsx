"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { LanguageContext, getInitialLocale, translate, type Locale } from "@/lib/i18n";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Fix #44 (hydration mismatch #418): inicia SEMPRE com "pt" — determinístico,
  // idêntico no server e no primeiro render do client → hidratação consistente.
  // O locale real do usuário (navigator.language) é detectado pós-mount (client-only).
  const [locale, setLocaleState] = useState<Locale>("pt");

  // Detecta o idioma do usuário só no client, DEPOIS da hidratação.
  // Efeito roda 1x no mount; não sobrescreve toggle manual posterior.
  useEffect(() => {
    setLocaleState(getInitialLocale());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
