"use client";

import { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

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

/** Injeta o script do Umami dinamicamente (chamado após consentimento) */
function loadUmamiScript() {
  if (typeof window === "undefined") return;
  // Evita duplicata
  if (document.querySelector('script[src*="capivara.seu.pet/api/umami/script.js"]')) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://capivara.seu.pet/api/umami/script.js";
  script.setAttribute("data-website-id", "39676cee-8416-4a33-ba06-cbc7af177c27");
  document.head.appendChild(script);
}

export function CookieBannerProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<AnalyticsConsent>(() => {
    try {
      if (typeof window !== "undefined") {
        return getStoredConsent();
      }
    } catch {}
    return null;
  });
  const [showBanner, setShowBanner] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        return getStoredConsent() === null;
      }
    } catch {}
    return false;
  });
  const [mounted] = useState(() => typeof window !== "undefined");
  const [showAdsOptions, setShowAdsOptions] = useState(false);
  const { t } = useLanguage();

  // We can't use useMonetizationConsent here because CookieBannerProvider
  // wraps MonetizationProvider, so we manage ads consent directly
  const [, setAdsChoice] = useState<"none" | "non-personalized" | "personalized">("none");

  // No more need for the initialization effect — state is lazy-initialized

  const accept = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // localStorage unavailable
    }
    setConsent("accepted");
    setShowBanner(false);
    loadUmamiScript();
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
    loadUmamiScript();

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
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
          >
            <div className="max-w-3xl mx-auto glass rounded-xl border border-[var(--border)]/50 backdrop-blur-md shadow-2xl p-4 md:p-5">
              <div className="flex items-start gap-3">
                <Cookie className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-mono text-[var(--text-primary)] mb-3">
                    {t("cookie.banner.text")}
                  </p>

                  {!showAdsOptions ? (
                    <div className="flex items-center gap-2 flex-nowrap">
                      <button
                        onClick={() => acceptWithAds("non-personalized")}
                        className="px-4 py-2 rounded-lg font-mono text-xs font-semibold bg-[var(--accent)] text-white border border-[var(--accent)] hover:brightness-110 transition-all shrink-0"
                      >
                        {t("cookie.banner.accept_all")}
                      </button>
                      <button
                        onClick={() => decline()}
                        className="px-4 py-2 rounded-lg font-mono text-xs text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--border)]/20 transition-colors shrink-0"
                      >
                        {t("cookie.banner.decline")}
                      </button>
                      <button
                        onClick={() => setShowAdsOptions(true)}
                        className="px-3 py-2 rounded-lg font-mono text-xs text-[var(--text-secondary)]/60 hover:text-[var(--text-secondary)] transition-colors shrink-0"
                      >
                        {t("cookie.banner.customize")}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono text-[var(--text-secondary)] mb-2">
                        {t("cookie.banner.ads_choice")}
                      </p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => acceptWithAds("personalized")}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors text-left"
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0" />
                          <div>
                            <span className="block">{t("cookie.banner.ads_personalized")}</span>
                            <span className="block text-[9px] text-[var(--text-secondary)]">{t("cookie.banner.ads_personalized_hint")}</span>
                          </div>
                        </button>
                        <button
                          onClick={() => acceptWithAds("non-personalized")}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs text-[var(--text-secondary)] border border-[var(--border)]/50 hover:bg-[var(--border)]/10 transition-colors text-left"
                        >
                          <EyeOff className="w-3.5 h-3.5 shrink-0" />
                          <div>
                            <span className="block">{t("cookie.banner.ads_nonpersonalized")}</span>
                            <span className="block text-[9px] text-[var(--text-secondary)]">{t("cookie.banner.ads_nonpersonalized_hint")}</span>
                          </div>
                        </button>
                        <button
                          onClick={() => acceptWithAds("none")}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs text-[var(--text-secondary)]/60 hover:text-[var(--text-secondary)] transition-colors text-left"
                        >
                          <Cookie className="w-3.5 h-3.5 shrink-0" />
                          <div>
                            <span className="block">{t("cookie.banner.analytics_only")}</span>
                            <span className="block text-[9px] text-[var(--text-secondary)]">{t("cookie.banner.analytics_only_hint")}</span>
                          </div>
                        </button>
                      </div>
                      <button
                        onClick={() => setShowAdsOptions(false)}
                        className="text-[10px] font-mono text-[var(--text-secondary)]/60 hover:text-[var(--text-secondary)] transition-colors mt-1"
                      >
                        {t("cookie.banner.back")}
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => decline()}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
                  aria-label={t("cookie.close", "Fechar banner de cookies")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CookieBannerContext.Provider>
  );
}
