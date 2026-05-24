"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

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
  const [consent, setConsent] = useState<AnalyticsConsent>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredConsent();
    setConsent(stored);
    setShowBanner(stored === null);
  }, []);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // localStorage unavailable
    }
    setConsent("accepted");
    setShowBanner(false);
  }, []);

  const decline = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
    } catch {
      // localStorage unavailable
    }
    setConsent("declined");
    setShowBanner(false);
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
                    Utilizamos analytics para melhorar sua experiência. Aceita?
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={accept}
                      className="px-4 py-2 rounded-lg font-mono text-xs bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40 hover:bg-[var(--accent)]/30 transition-colors"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={decline}
                      className="px-4 py-2 rounded-lg font-mono text-xs text-[var(--text-secondary)] border border-[var(--border)]/50 hover:bg-[var(--border)]/10 transition-colors"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
                <button
                  onClick={decline}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
                  aria-label="Fechar banner de cookies"
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
