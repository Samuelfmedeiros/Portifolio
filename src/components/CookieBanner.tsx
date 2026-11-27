"use client";

import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { loadOpenpanelScript } from "@/lib/openpanel";

const CONSENT_KEY = "mc-analytics-consent";

/**
 * 26/11/2026 — gap de UI (rodada 2 do test-loop): a barra de consentimento é
 * `fixed bottom-0` e media ~110px (desktop) / ~154px (mobile). No primeiro
 * viewport ela cobria a linha "NÍVEL" dos cards de habilidades — informação
 * real escondida por um overlay, não uma questão de gosto.
 *
 * Cura em 2 camadas, sem tocar no contrato do contexto (`showBanner` continua
 * `true` no mount; só a revelação do DOM é atrasada):
 *
 *  1. REVELAÇÃO — a barra só entra depois do primeiro scroll do usuário
 *     (ou imediatamente, se a página não tem scroll suficiente: aí não existe
 *     conteúdo para ser coberto). Em scrollY=0 nada é sobreposto.
 *  2. RESERVA — com a barra no ar, a altura REAL dela (medida, não chute) é
 *     gravada em `--cookie-banner-h` no `<html>`; o `body` consome a var como
 *     `padding-bottom`. Quando o usuário chega no fim da página, o rodapé
 *     termina antes da barra, não embaixo dela. Some a var no hide/unmount.
 */
const BANNER_HEIGHT_VAR = "--cookie-banner-h";
/** px de scroll que contam como "usuário começou a rolar" */
const REVEAL_SCROLL_PX = 8;

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
  // Revelacao da barra fixa (ver efeito abaixo).
  const [revealed, setRevealed] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
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

  // 🔴 Gap da rodada 2 do test-loop (medido em .audit-shots): a barra é
  // `fixed bottom-0`, então na primeira pintada ela nascia POR CIMA do conteúdo
  // — 110px no desktop / 154px no mobile cobrindo justamente a linha "NÍVEL"
  // dos cards de skills (cards em y≈655-790, barra em y≈690-800). Nenhuma
  // reserva de espaço cura isso com o topo da página visível: `padding-bottom`
  // só empurra o FIM do documento, não o que está na primeira viewport.
  //
  // Cura: a barra só entra no DOM quando (a) a página não rola — aí não há
  // nada para cobrir, ou (b) o usuário já rolou. `showBanner` continua true no
  // mount (contrato do provider intacto: consentimento ainda não decidido), só
  // a BARRA deixa de nascer sobre conteúdo. Aceitar/recusar seguem iguais.
  useEffect(() => {
    if (!showBanner || typeof window === "undefined") return;
    const doc = document.documentElement;
    const onScroll = () => {
      if (window.scrollY > 4 || doc.scrollTop > 4) {
        setRevealed(true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      }
    };
    // Página que deixa de ser rolavel (rotação/teclado): nada a cobrir, mostra.
    const onResize = () => {
      if (doc.scrollHeight <= window.innerHeight + 8) {
        setRevealed(true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      }
    };
    // `setState` sincrono dentro de effect dispara render em cascata
    // (react-hooks/set-state-in-effect, ligado pelo core-web-vitals do Next 16).
    // A decisao e de layout e nao muda com 1 frame de atraso — entao o frame
    // garante render unico sem alterar comportamento.
    let frame = 0;
    if (doc.scrollHeight <= window.innerHeight + 8) {
      frame = window.requestAnimationFrame(() => setRevealed(true));
    } else {
      window.addEventListener("scroll", onScroll);
      window.addEventListener("resize", onResize);
    }
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [showBanner]);

  // Reserva de espaço: com a barra na tela, o documento ganha `padding-bottom`
  // da altura REAL dela (medida por ResizeObserver, não constante — o card muda
  // entre mobile e desktop). Sem isso o último bloco do footer ficava embaixo
  // da barra e inacessível no fim da página.
  useEffect(() => {
    if (!mounted || !showBanner || !revealed) return;
    const doc = document.documentElement;
    // O mock de framer-motion do jsdom (src/test/setup.tsx) renderiza motion.div
    // como <div> puro e não repassa `ref`; o querySelector é o fallback para a
    // medição continuar testável fora do navegador real.
    const el =
      bannerRef.current ??
      doc.querySelector<HTMLElement>('[data-testid="cookie-banner"]');
    const aplicar = () => {
      const h = el?.offsetHeight ?? 0;
      if (h <= 0) return;
      const previa = parseFloat(doc.style.getPropertyValue("--cookie-banner-h")) || 0;
      if (previa === h) return;
      // 26/11/2026 (medido no e2e mobile 390x844): quem chega ao fim do
      // documento com UM salto (tecla End, flick, scroll instantâneo do
      // teste) recebe a reserva DEPOIS de já ter parado no fundo — a barra
      // nascia 114px acima do fim e cobria as 2 últimas linhas do footer
      // ("Last updated", "Portifolio Samuel v2.0"). A reserva aumenta o
      // scrollHeight; sem acompanhar, o usuário fica 114px antes do fim.
      // Cura: se estava colado no fundo, o scroll avança o mesmo tanto.
      // (a página precisar rolar já livra o jsdom, onde scrollHeight é 0 e
      // `scrollTo` não existe — evita o "Not implemented" no console.)
      const rola =
        document.documentElement.scrollHeight > window.innerHeight + 8;
      const noFim =
        rola &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2;
      doc.style.setProperty("--cookie-banner-h", `${h}px`);
      if (noFim && h > previa) {
        window.scrollTo({ top: window.scrollY + (h - previa), behavior: "auto" });
      }
    };
    aplicar();
    let ro: ResizeObserver | undefined;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(aplicar);
      ro.observe(el);
    }
    return () => {
      ro?.disconnect();
      doc.style.removeProperty("--cookie-banner-h");
    };
  }, [mounted, showBanner, revealed]);

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
        {mounted && showBanner && revealed && (
          <motion.div
            ref={bannerRef}
            data-testid="cookie-banner"
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
            {/* Região explícita: o axe acusa `region` moderate quando o
                conteúdo do banner (o <p> do texto de consentimento) vive
                fora de qualquer landmark. Solução: marcar o card como
                região nomeada — o texto passa a ter ancestral com role. */}
            <div
              role="region"
              aria-label={t("cookie.banner.title", "Consentimento de cookies")}
              className="max-w-2xl mx-auto glass rounded-xl border border-[var(--border)]/50 backdrop-blur-md shadow-2xl px-3 py-2.5 md:px-5 md:py-4"
            >
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
                      className="min-h-[34px] px-1 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-[11px] sm:text-xs font-semibold bg-[var(--accent)] text-[var(--bg-primary)] border border-[var(--accent)] hover:brightness-110 transition-all leading-tight"
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
