# Plano: Parallax Futurista — "Nave Futurista"

## Estado Atual

- `ParallaxBackground.tsx` (ativo no layout): Canvas com 250 estrelas, 3 nebulosas, shooting stars, mouse parallax, scroll Y, deep space gradient — já é rico.
- Componentes existentes mas **NÃO usados**: `StarField`, `PerspectiveGrid`, `HUDOverlay`, `Scanline`, `CockpitBorders`.
- `ChronoLogParallax.tsx`: Seção dedicada para About timeline (3 camadas com Framer Motion).

## Problema

Os 5 componentes "cockpit" estão prontos mas não compõem a experiência. O background é rico mas isolado — falta a camada de HUD, grid de perspectiva, scanline e bordas de cockpit para dar a sensação de "visório de nave".

## Plano de Execução

### 1. Criar `CockpitBackground.tsx` (compositor)
Novo componente que empilha TODAS as camadas visuais em ordem correta:
- L0: `ParallaxBackground` (canvas base — estrelas, nebulosas, shooting stars)
- L1: `PerspectiveGrid` (grid de perspectiva Tron-style)
- L2: `StarField` (campo estelar framer-motion — camadas 3D parallax)
- L3: `Scanline` (linha de varredura)
- L4: `CockpitBorders` (bordas do visor)
- L5: `HUDOverlay` (telemetria nos cantos)

### 2. Atualizar `layout.tsx`
Substituir `<ParallaxBackground />` por `<CockpitBackground />`.

### 3. Refinar componentes existentes
- `PerspectiveGrid`: Ajustar opacidade para não competir com as estrelas
- `HUDOverlay`: Adicionar `prefers-reduced-motion` para desativar flicker
- `CockpitBorders`: Adicionar animação sutil de "pulse" nas bordas
- `Scanline`: Variar velocidade para não ser robótico demais

### 4. Performance
- Tudo via CSS `transform` e `will-change` (GPU accelerated)
- `ParallaxBackground` já usa `requestAnimationFrame` com cleanup correto
- `StarField` usa `useMemo` para evitar re-generação de estrelas
- `HUDOverlay` usa `setInterval` de 1s — leve

### 5. prefers-reduced-motion
- Respeitar em todas as camadas animadas (StarField, Scanline, HUDOverlay flicker)
- `ParallaxBackground` já respeita (dark mode only, sem animação no light)

## Arquivos a modificar
- `src/components/CockpitBackground.tsx` (NOVO)
- `src/app/layout.tsx` (trocar import)
- `src/components/PerspectiveGrid.tsx` (refinar)
- `src/components/CockpitBorders.tsx` (animar pulse)
- `src/components/Scanline.tsx` (variar velocidade)
