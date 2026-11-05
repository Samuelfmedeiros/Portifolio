"use client";

import { useEffect } from "react";
import { useAnalyticsConsent } from "./CookieBanner";
import { AnalyticsTracker } from "./AnalyticsTracker";
import { loadOpenpanelScript } from "@/lib/openpanel";
import { agendarAposCarga } from "@/lib/apos-carga";

/**
 * O OpenPanel é cookieless (sem cookies, sem dado pessoal), então carrega
 * independentemente do banner de consentimento — para não perder pageviews de
 * quem nunca clica no banner. O consentimento segue controlando ads/monetização.
 */
export function ConditionalAnalytics() {
  useEffect(() => {
    // Fora do caminho crítico: o SDK de analytics (e o screen_view que ele
    // manda) carrega depois do `load` — medido 04/11, o rewrite `/api/op/*`
    // na borda do Vercel custava ~646 ms dentro do load.
    agendarAposCarga(() => loadOpenpanelScript());
  }, []);

  const { consent } = useAnalyticsConsent();
  if (consent !== "accepted") return null;
  return <AnalyticsTracker />;
}
