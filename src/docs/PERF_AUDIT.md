# ⚡ Performance — Audit Report

**Data:** 16/06/2026
**Projeto:** Portifolio Samuel (Next.js 16 · Turbopack · Tailwind 4)

---

## ✅ Bundle Size

| Métrica | Valor |
|---------|-------|
| Total JS chunks (18) | ~1.2 MB (gzip ~350 KB estimado) |
| Maior chunk | ~232 KB (framer-motion) |
| Static assets (CSS, fonts) | ~1.6 MB |
| Font files (Inter + JetBrains Mono) | ~320 KB (WOFF2) |

**Status:** ✅ Aceitável. Framer-motion é o maior contribuidor, esperado para um site com animações cinematográficas.

### Otimizações ativas
- ✅ `removeConsole: true` em produção — tree-shaking de console.log
- ✅ `reactRemoveProperties: true` — remove atributos de teste em produção
- ✅ `poweredByHeader: false` — remove header X-Powered-By
- ✅ Turbopack em desenvolvimento
- ✅ Tailwind CSS JIT — apenas estilos usados no bundle

---

## 🖼️ Imagens — Otimização Aplicada

Converti PNGs para WebP (quality 85) com ImageMagick. Economia total: **~200 KB**.

| Imagem | Antes (PNG) | Depois (WebP) | Redução |
|--------|------------|---------------|---------|
| games/asteroid-dodge.png | 108 KB | 79 KB | 27% |
| games/code-typing.png | 104 KB | 75 KB | 28% |
| games/memory-matrix.png | 120 KB | 86 KB | 28% |
| games/simon-game.png | 92 KB | 60 KB | 35% |
| games/terminal.png | 96 KB | 60 KB | 37% |
| projects/portifolio.png | 32 KB | 21 KB | 34% |
| projects/seu.pet.png | 152 KB | 27 KB | 82% |
| og-image.png | 22 KB | 8.5 KB | 61% |

### Configuração de imagens
- ✅ `next/image` com formatos `['image/avif', 'image/webp']`
- ✅ `loading="lazy"` em todas as imagens de projeto e jogo
- ✅ Device sizes: 640–3840px para responsivo
- ⚠️ `unoptimized` usado nas imagens do ProjectHangar (são URLs externas do GitHub)

---

## 📦 Lazy Loading

| Componente | Técnica | Status |
|-----------|---------|--------|
| ProjectHangar | `<Suspense fallback={<HangarSkeleton />}>` | ✅ |
| GitHub API data | Async `getRepos()` com Suspense | ✅ |
| Game images | `loading="lazy"` no `<img>` | ✅ |
| Game iframe | Criado dinamicamente no clique "JOGAR" | ✅ |
| FadeInSection sections | Framer Motion `whileInView` | ✅ |
| ProfileSection skills | `whileInView` com stagger | ✅ |

---

## 🎨 Font Loading

| Fonte | Loader | Display | Weight |
|-------|--------|---------|--------|
| Inter | `next/font` | swap | 400, 500, 600, 700 |
| JetBrains Mono | `next/font` | swap | 400, 500 |

- ✅ `next/font` faz auto-prede load dos arquivos WOFF2
- ✅ `display: "swap"` — texto visível imediatamente com fallback, troca quando fonte carrega
- ✅ Subset `latin` apenas — sem caracteres desnecessários
- ✅ Fonte variável (variable: `--font-inter`, `--font-jetbrains-mono`)

---

## 📐 CLS (Cumulative Layout Shift)

- ❌ **Nenhum shift significativo detectado** — layout é estável desde o primeiro paint
- CockpitBackground usa `position: absolute; inset: 0` — não afeta fluxo
- HeroSection com `min-h-[70vh]` — espaço reservado
- Imagens com `fill` + `object-cover` — proporção mantida
- Font `display: swap` evita FOIT (Flash of Invisible Text)

---

## 🔧 Recomendações

1. **Converter GIF do DogWalk para MP4/WebM** — `seu.pet.gif` (72 KB) seria 80% menor como WebM
2. **Remover imagens PNG originais** após confirmar que WebP funciona em todos os navegadores alvo
3. **Considerar next/dynamic** para framer-motion — pode reduzir o chunk inicial (mas impacto marginal)
4. **Monitorar perf com Lighthouse** — recomendo rodar mensalmente via CI

---

## Build Output

```
Route (app)                Revalidate  Expire
┌ ○ /                              1h      1y
├ ○ /_not-found
├ ƒ /api/game/[slug]
├ ○ /manifest.webmanifest
├ ○ /opengraph-image
├ ○ /privacidade
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ○ /termos

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

- ✅ 7 páginas estáticas + 1 dinâmica (API de games)
- ✅ ISR com revalidate 1h na home
- ✅ Build em ~4 segundos
