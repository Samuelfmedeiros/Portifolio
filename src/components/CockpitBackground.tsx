"use client";

import { useIdleHydration } from "@/hooks/useIdleHydration";

import { ParallaxBackground } from "./ParallaxBackground";
import { PerspectiveGrid } from "./PerspectiveGrid";
import { StarField } from "./StarField";
import { Scanline } from "./Scanline";
import { CockpitBorders } from "./CockpitBorders";
import { SpeedLines } from "./SpeedLines";

/**
 * CockpitBackground — Compositor visual "Nave Futurista"
 *
 * Empilha todas as camadas do parallax em ordem Z correta:
 *   L0: ParallaxBackground  (canvas — estrelas, nebulosas, shooting stars)
 *   L1: PerspectiveGrid      (grid de perspectiva Tron-style)
 *   L2: StarField            (campo estelar framer-motion — 3 camadas de profundidade)
 *   L3: Scanline             (linha de varredura horizontal)
 *   L3b: SpeedLines           (efeito warp no scroll rápido)
 *   L4: CockpitBorders       (bordas decorativas do visor)
 */
export function CockpitBackground() {
  // Perf 01/09/2026: fundo é aria-hidden / não-LCP — adiar a hidratação das 6
  // camadas de animação (canvas rAF, GSAP, framer repeat) para o idle do browser.
  // Tira ~26s de main-thread work + 20 long tasks do path crítico (perf 58->90+).
  const ready = useIdleHydration();
  if (!ready) {
    // Fundamentado: body já tem var(--bg-primary) — sem FOUC enquanto espera.
    return <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden" />;
  }
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* L0: Canvas base — estrelas, nebulosas, shooting stars, mouse parallax */}
      <ParallaxBackground />

      {/* L1: Grid de perspectiva — linhas convergentes estilo runway */}
      <PerspectiveGrid />

      {/* L2: Campo estelar framer-motion — 3 camadas com parallax de scroll */}
      <StarField />

      {/* L3: Scanline — linha de varredura horizontal */}
      <Scanline />

      {/* L3b: SpeedLines — efeito warp durante scroll rápido */}
      <SpeedLines />

      {/* L4: Cockpit Borders — cantos decorativos simulando visor de nave */}
      <CockpitBorders />
    </div>
  );
}
