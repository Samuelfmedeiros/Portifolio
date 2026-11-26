"use client";

import { useEffect } from "react";
import { useAnalyticsConsent } from "./CookieBanner";
import { AnalyticsTracker } from "./AnalyticsTracker";
import { loadOpenpanelScript } from "@/lib/openpanel";
import { initEngagement } from "@/lib/engagement";
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

    // Engajamento segue a MESMA regra do SDK (cookieless, sem consentimento):
    // antes ficava em AnalyticsTracker, montado só com consent === "accepted",
    // e por isso 100% dos visitantes que nao clicam no banner nao geravam
    // nenhum scroll_depth/section_time/ui_click (medido 26/11 em producao).
    let stop: (() => void) | null = null;
    try {
      stop = initEngagement({ site: "portfolio", keyPrefix: "pf" });
    } catch {
      stop = null; // analytics nunca quebra a pagina
    }
    return () => stop?.();
  }, []);

  // consent continua controlando apenas ads/monetizacao — nunca analytics.
  const { consent } = useAnalyticsConsent();
  void consent;
  return <AnalyticsTracker />;
}
