"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  type MonetizationConsent,
  MONETIZATION_CONSENT_KEY,
  DEFAULT_MONETIZATION_CONSENT,
  parseMonetizationConsent,
  canShowAds,
  canShowPersonalizedAds,
} from "@/lib/monetization";
import { useAnalyticsConsent } from "@/components/CookieBanner";

// ─── Context ──────────────────────────────────────────────

interface MonetizationContextType {
  /** Current monetization consent state */
  consent: MonetizationConsent;
  /** Whether any ads can be shown */
  adsAllowed: boolean;
  /** Whether personalized ads can be shown */
  personalizedAdsAllowed: boolean;
  /** Accept all monetization (analytics + personalized ads) */
  acceptAll: () => void;
  /** Accept non-personalized ads only (no tracking) */
  acceptNonPersonalizedOnly: () => void;
  /** Decline all ads */
  declineAds: () => void;
  /** Update specific consent fields */
  updateConsent: (partial: Partial<MonetizationConsent>) => void;
  /** Whether the consent modal should be shown */
  showConsentModal: boolean;
  /** Dismiss the consent modal (user made a choice) */
  dismissConsentModal: () => void;
}

const MonetizationContext = createContext<MonetizationContextType>({
  consent: DEFAULT_MONETIZATION_CONSENT,
  adsAllowed: false,
  personalizedAdsAllowed: false,
  acceptAll: () => {},
  acceptNonPersonalizedOnly: () => {},
  declineAds: () => {},
  updateConsent: () => {},
  showConsentModal: false,
  dismissConsentModal: () => {},
});

export function useMonetizationConsent() {
  return useContext(MonetizationContext);
}

// ─── Provider ─────────────────────────────────────────────

export function MonetizationProvider({ children }: { children: ReactNode }) {
  const { consent: analyticsConsent } = useAnalyticsConsent();
  const [consent, setConsent] = useState<MonetizationConsent>(
    DEFAULT_MONETIZATION_CONSENT
  );
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load stored consent on mount + listen for changes from CookieBanner
  useEffect(() => {
    setMounted(true);
    const loadConsent = () => {
      const stored = localStorage.getItem(MONETIZATION_CONSENT_KEY);
      const parsed = parseMonetizationConsent(stored);
      if (parsed) {
        setConsent(parsed);
        setShowConsentModal(false);
      } else {
        setShowConsentModal(true);
      }
    };
    loadConsent();

    // Listen for storage events from CookieBanner syncs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === MONETIZATION_CONSENT_KEY) loadConsent();
    };
    // Also listen for same-tab dispatches (StorageEvent doesn't fire in same tab)
    const handleCustomSync = () => loadConsent();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("monetization-consent-changed", handleCustomSync);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("monetization-consent-changed", handleCustomSync);
    };
  }, []);

  // Sync analytics consent — if user declines analytics, disable personalized ads
  useEffect(() => {
    if (!mounted) return;
    if (analyticsConsent === "declined" && consent.ads) {
      // Can't have personalized ads without analytics consent
      const updated = { ...consent, analytics: false, ads: false };
      setConsent(updated);
      try {
        localStorage.setItem(MONETIZATION_CONSENT_KEY, JSON.stringify(updated));
      } catch {
        // localStorage unavailable
      }
    }
  }, [analyticsConsent, consent, mounted]);

  const saveConsent = useCallback((newConsent: MonetizationConsent) => {
    setConsent(newConsent);
    setShowConsentModal(false);
    try {
      localStorage.setItem(MONETIZATION_CONSENT_KEY, JSON.stringify(newConsent));
    } catch {
      // localStorage unavailable
    }
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      analytics: true,
      ads: true,
      nonPersonalizedAds: true,
    });
  }, [saveConsent]);

  const acceptNonPersonalizedOnly = useCallback(() => {
    saveConsent({
      analytics: consent.analytics,
      ads: false,
      nonPersonalizedAds: true,
    });
  }, [consent.analytics, saveConsent]);

  const declineAds = useCallback(() => {
    saveConsent({
      analytics: consent.analytics,
      ads: false,
      nonPersonalizedAds: false,
    });
  }, [consent.analytics, saveConsent]);

  const updateConsent = useCallback(
    (partial: Partial<MonetizationConsent>) => {
      const newConsent = { ...consent, ...partial };
      // Enforce: can't have personalized ads without analytics
      if (!newConsent.analytics) {
        newConsent.ads = false;
      }
      saveConsent(newConsent);
    },
    [consent, saveConsent]
  );

  const dismissConsentModal = useCallback(() => {
    setShowConsentModal(false);
  }, []);

  const value: MonetizationContextType = {
    consent,
    adsAllowed: canShowAds(consent),
    personalizedAdsAllowed: canShowPersonalizedAds(consent),
    acceptAll,
    acceptNonPersonalizedOnly,
    declineAds,
    updateConsent,
    showConsentModal: mounted && showConsentModal,
    dismissConsentModal,
  };

  return (
    <MonetizationContext.Provider value={value}>
      {children}
    </MonetizationContext.Provider>
  );
}
