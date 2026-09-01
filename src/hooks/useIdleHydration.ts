"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useIdleHydration — monta o filho (componentes decorativos) SOMENTE quando o
 * browser está ocioso (idle), tirando do path crítico o custo de hidratação JS.
 *
 * Uso: componentes aria-hidden / não-LCP (backgrounds, parallax, canvas) que
 * iniciam rAF/animations contínuas no mount. Adiar para depois do load reduz
 * main-thread work + long tasks sem mudar o visual (o body já tem bg).
 *
 * Estratégia (docs: requestIdleCallback é a API nativa para "trabalho quando
 * ocioso"; readyState 'complete' cobre carregamentos lentos de recursos):
 *   1. aguarda document.readyState === 'complete' (ou DOMContentLoaded se não)
 *   2. pede requestIdleCallback (timeout máximo ~2s para não adiar demais e
 *      o fundo nunca "sumir" — tem body bg + fade-in lento ao montar)
 *   3. fallback para setTimeout ~500ms em browsers sem rIC (testes/antigos)
 *
 * Sem dependência nova. Retorna `ready: boolean` — o consumer condiciona a
 * renderização do filho a ela.
 */
export function useIdleHydration(maxTimeout = 2000): boolean {
  const [ready, setReady] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    let cancelled = false;

    const fire = () => {
      if (cancelled || fired.current) return;
      fired.current = true;
      setReady(true);
    };

    // Listener oficial: dispara quando os sub-recursos terminam de carregar.
    let onReady: (() => void) | null = null;
    if (document.readyState === "complete") {
      fire();
    } else {
      onReady = fire;
      document.addEventListener("readystatechange", fire, { once: true, capture: true });
    }
    // Garantia: nunca ficar sem montar (fundo decorativo), mesmo se o load
    // demorar demais (recurso de terceiros pendurado etc).
    const fallback = window.setTimeout(fire, 6000);

    // Se rIC estiver disponível e ainda não disparou, empurra para o idle real.
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (typeof ric === "function") {
      const handle = ric(
        () => {
          if (!fired.current) fire();
        },
        { timeout: maxTimeout }
      );
      return () => {
        cancelled = true;
        window.clearTimeout(fallback);
        if (onReady) document.removeEventListener("readystatechange", onReady);
        // cancelIdleCallback pode não existir em todos os ambientes; guard.
        const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
        if (typeof cic === "function") cic(handle);
      };
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      if (onReady) document.removeEventListener("readystatechange", onReady);
    };
  }, [maxTimeout]);

  return ready;
}