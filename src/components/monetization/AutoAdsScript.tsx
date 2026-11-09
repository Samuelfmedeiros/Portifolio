"use client";

import { useEffect } from "react";
import { ADSENSE_CONFIG } from "@/lib/monetization";
import { useMonetizationConsent } from "./MonetizationProvider";

/**
 * Carrega o script global do Google AdSense (Auto ads) respeitando consentimento.
 *
 * Por que existe (medido 09/11/2026):
 * O script `adsbygoogle.js` só era injetado dentro do componente `<AdSense>`, que
 * exige um slot manual numérico válido para montar. O `.env` trazia `footer` e
 * `sidebar` como slot — texto, não ID — então nenhum `<AdSense>` renderizava, o
 * script nunca entrava na página e o HTML de produção ficou com 0 ocorrências de
 * `adsbygoogle` e `ca-pub-` por ~2 meses. Auto ads dispensa slot manual: basta o
 * script + a meta tag `google-adsense-account` no <head>.
 *
 * Consentimento: sem ele, nenhum script é carregado (LGPD/GDPR). O Google usa o
 * próprio IAB TCF quando `data-npa` não está setado; aqui marcamos anúncios não
 * personalizados quando o usuário só aceitou isso.
 */
export function AutoAdsScript() {
  const { consent } = useMonetizationConsent();
  const adsAllowed =
    !!consent && (consent.nonPersonalizedAds || (consent.analytics && consent.ads));

  useEffect(() => {
    if (!adsAllowed) return;
    if (!ADSENSE_CONFIG.enabled) return;

    const SEL = 'script[src*="pagead2.googlesyndication.com"]';
    if (document.querySelector(SEL)) return;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      ADSENSE_CONFIG.clientId
    )}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    // Só anúncios não personalizados quando o usuário não consentiu personalização.
    if (!(consent.analytics && consent.ads)) {
      script.setAttribute("data-npa", "1");
    }
    script.dataset.adsenseSource = "auto-ads";
    document.head.appendChild(script);

    return () => {
      // Mantém o script: remover/reinserir faz o Google recarregar anúncios.
      // O AdSense é idempotente por client id.
    };
  }, [adsAllowed, consent]);

  return null;
}
