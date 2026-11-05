"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { enviarHit } from "@/lib/hit";
import { agendarAposCarga } from "@/lib/apos-carga";

/**
 * Dispara o beacon de visita a cada troca de rota (App Router: `usePathname` muda sem reload).
 * Componente sem UI — fica no layout e não renderiza nada.
 */
export default function HitBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    // No layout raiz o `usePathname()` pode chegar `null` na 1ª render — sem o fallback para
    // `location.pathname` o efeito sai calado e NADA é medido (era o caso até 17/10).
    const caminho = pathname || window.location.pathname;
    if (!caminho) return;
    // Fora do caminho crítico: o beacon sai depois do `load` (medido 04/11 —
    // os dois beacons somavam ~646 ms no load do site).
    agendarAposCarga(() => enviarHit(caminho, document.referrer || ""));
  }, [pathname]);

  return null;
}
