"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { initEngagement } from "@/lib/engagement";

/**
 * Ponto de extensao do analytics. O OpenPanel ja registra page_view pelo beacon
 * server-side (`/api/hit` -> HitBeacon), entao aqui NAO emitimos page_view —
 * isso dobraria a contagem (medido 13/11/2026).
 *
 * Este componente e montado por ConditionalAnalytics somente apos consentimento;
 * reinicia os observadores a cada troca de rota do App Router (sem reload).
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      return initEngagement({ site: "portfolio", keyPrefix: "pf" });
    } catch {
      return () => {}; // analytics nunca quebra a pagina
    }
  }, [pathname]);

  return null;
}
