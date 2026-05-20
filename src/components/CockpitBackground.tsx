"use client";

import { ParallaxBackground } from "./ParallaxBackground";
import { PerspectiveGrid } from "./PerspectiveGrid";
import { StarField } from "./StarField";
import { Scanline } from "./Scanline";
import { CockpitBorders } from "./CockpitBorders";
import { HUDOverlay } from "./HUDOverlay";

/**
 * CockpitBackground — Compositor visual "Nave Futurista"
 *
 * Empilha todas as camadas do parallax em ordem Z correta:
 *   L0: ParallaxBackground  (canvas — estrelas, nebulosas, shooting stars)
 *   L1: PerspectiveGrid      (grid de perspectiva Tron-style)
 *   L2: StarField            (campo estelar framer-motion — 3 camadas de profundidade)
 *   L3: Scanline             (linha de varredura horizontal)
 *   L4: CockpitBorders       (bordas decorativas do visor)
 *   L5: HUDOverlay           (telemetria fake nos cantos)
 */
export function CockpitBackground() {
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

      {/* L4: Cockpit Borders — cantos decorativos simulando visor de nave */}
      <CockpitBorders />

      {/* L5: HUD Overlay — telemetria nos cantos da tela */}
      <HUDOverlay />
    </div>
  );
}
