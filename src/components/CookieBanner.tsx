"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { loadOpenpanelScript } from "@/lib/openpanel";

const CONSENT_KEY = "mc-analytics-consent";

export type AnalyticsConsent = "accepted" | "declined" | null;

interface CookieBannerContextType {
  consent: AnalyticsConsent;
  accept: () => void;
  decline: () => void;
  showBanner: boolean;
}

const CookieBannerContext = createContext<CookieBannerContextType>({
  consent: null,
  accept: () => {},
  decline: () => {},
  showBanner: false,
});

export function useAnalyticsConsent() {
  return useContext(CookieBannerContext);
}

function getStoredConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") return stored;
  } catch {
    // localStorage unavailable
  }
  return null;
}

export function CookieBannerProvider({ children }: { children: React.ReactNode }) {
  //  12/08/2026: initializers NÃO-determinísticos (typeof window / localStorage)
  // causavam React #418 — server renderiza SEM banner (mounted=false), client
  // renderiza COM banner (mounted=true) → hydration mismatch. Padrão correto:
  // estado inicial determinístico (idêntico ao server) + leitura real pós-mount.
  const [consent, setConsent] = useState<AnalyticsConsent>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  // We can't use useMonetizationConsent here because CookieBannerProvider
  // wraps MonetizationProvider, so we manage ads consent directly
  const [, setAdsChoice] = useState<"none" | "non-personalized" | "personalized">("none");

  // Consentimento já salvo == "accepted" deve carregar o analytics no boot,
  // sem depender de clique. State lazy-initialized; o loader precisa ser
  // chamado explicitamente no mount.
  useEffect(() => {
    // Leitura real do consentimento SÓ pós-mount (server e 1º render client
    // ficam idênticos → sem #418). O banner aparece após a hidratação.
    const stored = getStoredConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- consentimento vem do localStorage só pós-mount (SSR e 1º render client idênticos, #418)
    setConsent(stored);
    setShowBanner(stored === null);
    setMounted(true);
    if (stored === "accepted") {
      loadOpenpanelScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // localStorage unavailable
    }
    setConsent("accepted");
    setShowBanner(false);
    loadOpenpanelScript();
  }, []);

  const decline = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
      // Also decline all monetization when analytics declined
      localStorage.setItem("mc-monetization-consent", JSON.stringify({
        analytics: false,
        ads: false,
        nonPersonalizedAds: false,
      }));
      window.dispatchEvent(new CustomEvent("monetization-consent-changed"));
    } catch {
      // localStorage unavailable
    }
    setConsent("declined");
    setShowBanner(false);
  }, []);

  /** Accept analytics + choose ads level — also syncs monetization consent */
  const acceptWithAds = useCallback((adsLevel: "none" | "non-personalized" | "personalized") => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // localStorage unavailable
    }
    setConsent("accepted");
    setAdsChoice(adsLevel);
    setShowBanner(false);
    loadOpenpanelScript();

    // Sync monetization consent so MonetizationProvider picks it up
    try {
      const mcConsent = {
        analytics: true,
        ads: adsLevel === "personalized",
        nonPersonalizedAds: adsLevel === "non-personalized" || adsLevel === "personalized",
      };
      localStorage.setItem("mc-monetization-consent", JSON.stringify(mcConsent));
      // Dispatch custom event for same-tab (StorageEvent only fires in other tabs)
      window.dispatchEvent(new CustomEvent("monetization-consent-changed"));
    } catch {
      // localStorage unavailable
    }
  }, []);

  return (
    <CookieBannerContext.Provider value={{ consent, accept, decline, showBanner }}>
      {children}
      <AnimatePresence>
        {mounted && showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-2.5 md:p-4"
          >
            {/* 09/11/2026 — compactado a pedido do Samuel ("banner menor e mais
                organizado, principalmente no mobile"). Antes: card 154px de
                altura no mobile porque os 3 botoes quebravam em 2 linhas
                (texto 12px, p-4, mb-3). Agora: grid de 3 colunas iguais no
                celular (1 linha so), padding e tipografia reduzidos, icone
                menor, texto em 11px. Altura de toque mantida em 34px (acima
                do minimo WCAG 2.5.8 de 24px). */}
            <div className="max-w-2xl mx-auto glass rounded-xl border border-[var(--border)]/50 backdrop-blur-md shadow-2xl px-3 py-2.5 md:px-5 md:py-4">
              <div className="flex items-start gap-2 md:gap-3">
                <Cookie className="w-4 h-4 md:w-5 md:h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] md:text-sm font-mono text-[var(--text-primary)] leading-snug mb-2 md:mb-3">
                    {t("cookie.banner.text")}
                  </p>

                  {/* 09/11/2026 — 2 botoes so, a pedido do Samuel: "se a pessoa
                      aceita tudo ela aceita o rastreio e as demais coisas".
                      O botao "Sem rastreio" foi removido. Grid de 2 colunas no
                      mobile (1 linha) e linha unica no desktop. */}
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => acceptWithAds("personalized")}
                      className="min-h-[34px] px-1 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-[11px] sm:text-xs font-semibold bg-[var(--accent)] text-white border border-[var(--accent)] hover:brightness-110 transition-all leading-tight"
                    >
                      {t("cookie.banner.accept_all")}
                    </button>
                    {/* 🔴 Bug corrigido 09/11/2026: "Aceitar tudo" chamava
                        acceptWithAds("none"), gravando ads:false e
                        nonPersonalizedAds:false. Efeito medido: nenhum anúncio
                        carregava NUNCA, nem com AdSense configurado — o usuário
                        dizia "aceito tudo" e o site entendia "nenhum anúncio".
                        Agora "Aceitar tudo" = personalizado (rastreio incluso). */}
                    <button
                      onClick={() => decline()}
                      className="min-h-[34px] px-1 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-[11px] sm:text-xs text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--border)]/20 transition-colors leading-tight"
                    >
                      {t("cookie.banner.decline")}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => decline()}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0 -mt-0.5 -mr-0.5 p-1"
                  aria-label={t("cookie.close", "Fechar banner de cookies")}
                >
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CookieBannerContext.Provider>
  );
}
