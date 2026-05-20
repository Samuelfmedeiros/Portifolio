# Plano: Parallax Futurista — "Nave Futurista" ✅ CONCLUÍDO

Status: Todos os 6 itens implementados, committed e pushed (master).
Commits: `8b19b14` (cockpit compositor) + `b8ba81a` (speed lines warp)

## Estado Atual (ANTES)

- `ParallaxBackground.tsx` (ativo no layout): Canvas com 250 estrelas, 3 nebulosas, shooting stars, mouse parallax, scroll Y, deep space gradient — já é rico.
- Componentes existentes mas **NÃO usados**: `StarField`, `PerspectiveGrid`, `HUDOverlay`, `Scanline`, `CockpitBorders`.
- `ChronoLogParallax.tsx`: Seção dedicada para About timeline (3 camadas com Framer Motion).

## Problema

Os 5 componentes "cockpit" estavam prontos mas não compunham a experiência. O background era rico mas isolado — faltava a camada de HUD, grid de perspectiva, scanline e bordas de cockpit para dar a sensação de "visório de nave".

## ✅ Checklist Completo

| # | Item | Status | Arquivo |
|---|------|--------|---------|
| 1 | Campo estelar 3 camadas | ✅ | `ParallaxBackground.tsx` (250 estrelas, canvas) + `StarField.tsx` (3 profundidades framer-motion) |
| 2 | Grid de perspectiva | ✅ | `PerspectiveGrid.tsx` (refinado: opacidade 0.12, cores cyan fixas) |
| 3 | HUD Overlay | ✅ | `HUDOverlay.tsx` (telemetria + flicker + prefers-reduced-motion) |
| 4 | Scanline sutil | ✅ | `Scanline.tsx` (12s + repeatDelay 3s, orgânico) |
| 5 | Speed lines (warp) | ✅ | `SpeedLines.tsx` (NOVO — 20 linhas, proporcional ao scroll speed) |
| 6 | Borda cockpit | ✅ | `CockpitBorders.tsx` (pulse escalonado + acentos topo/base) |

## Arquitetura Final das Camadas (z-index stack)
