"use client";

import { useEffect } from "react";
import { useAnalyticsConsent } from "./CookieBanner";
import { AnalyticsTracker } from "./AnalyticsTracker";
import { loadOpenpanelScript } from "@/lib/openpanel";

/**
 * O OpenPanel é cookieless (sem cookies, sem dado pessoal), então carrega
 * independentemente do banner de consentimento — para não perder pageviews de
 * quem nunca clica no banner. O consentimento segue controlando ads/monetização.
 */
export function ConditionalAnalytics() {
  useEffect(() => {
    loadOpenpanelScript();
  }, []);

  const { consent } = useAnalyticsConsent();
  if (consent !== "accepted") return null;
  return <AnalyticsTracker />;
}
