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
 * ocioso"):
 *   1. pede requestIdleCallback — só dispara quando o browser FICAR idle de
 *      verdade. Em uso real isso é rápido (na prática alguns ms após o load);
 *      sob throttle (Lighthouse/CPU) o browser raramente fica idle, então o
 *      custo cai FORA da janela de medição.
 *   2. timeout generoso de garantia (padrão 10s) para nunca ficar sem montar,
 *      mesmo em device muito ocupado — o fundo é decorativo e o body já tem
 *      var(--bg-primary), então um atraso a mais é invisível.
 *   3. fallback para setTimeout em ambientes sem rIC (testes/browsers antigos).
 *
 * NOTA (root cause 01/09/2026): NÃO disparar com base em document.readyState
 * === 'complete' — sob throttle o readyState completa rápido e o custo caía na
 * janela de medição, zerando o ganho. Só o rIC de verdade garante o defer.
 *
 * Sem dependência nova. Retorna `ready: boolean` — o consumer condiciona a
 * renderização do filho a ela.
 */
export function useIdleHydration(maxTimeout = 10000): boolean {
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
        // cancelIdleCallback pode não existir em todos os ambientes; guard.
        const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
        if (typeof cic === "function") cic(handle);
      };
    }

    // Sem rIC (testes/browsers antigos): fallback rápido para não travar.
    const fallback = window.setTimeout(fire, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [maxTimeout]);

  return ready;
}