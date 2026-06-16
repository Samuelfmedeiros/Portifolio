# ⚡ Performance — Audit Report

**Data:** 16/06/2026
**Ferramenta:** Playwright (Performance API) + análise de bundle
**URL testada:** `http://localhost:3000/`

---

## ✅ Resumo

| Métrica | Valor | Status |
|---------|-------|--------|
| **First Paint (FP)** | 700ms | ✅ |
| **First Contentful Paint (FCP)** | 700ms | ✅ |
| **DOM Content Loaded** | 602ms | ✅ |
| **Load Event** | 1.4s | ✅ |
| **HTML Transfer** | 26.6 KB | ✅ |
| **HTML Decoded** | 165.3 KB | ✅ |
| **Total Page Transfer** | 787.3 KB | ⚠️ Aceitável |
| **JS Bundles** | 16 chunks | ✅ |
| **Maior chunk JS** | 232 KB (disk) / 70 KB (transfer) | ✅ |
| **CSS** | 14 KB | ✅ |
| **Imagens com lazy** | 6/6 | ⚠️ |

---

## 📦 Bundle Analysis

### JavaScript
- **Total de chunks:** 16
- **Maiores chunks (disk):**
  - `chunks/15j1dw3jmokm.js` — 232 KB
  - `chunks/0itiyyj-mcj8k.js` — 224 KB
  - `chunks/0uy.20wdprx8i.js` — 136 KB
  - `chunks/0-vuh3.gj87od.js` — 132 KB
- **Frameworks incluídos:** Next.js 16 + React 19 + Framer Motion + Supabase client
- **Otimizações:** Tree-shaking ativo via `compiler.removeConsole` ✅

### CSS
- **Único bundle:** 14 KB
- **Estratégia:** Tailwind CSS 4 (JIT) + CSS custom properties — mínimo CSS crítico ✅

---

## 🖼️ Images

| Arquivo | Tamanho | Formato | Loading |
|---------|---------|---------|---------|
| `/projects/seu.pet.gif` | 69.4 KB | **GIF** ⚠️ | lazy |
| `/projects/portifolio.webp` | 20.7 KB | WebP ✅ | lazy |
| `/games/memory-matrix.webp` | 85.9 KB | WebP ✅ | lazy |
| `/games/simon-game.webp` | 59.8 KB | WebP ✅ | lazy |
| `/games/code-typing.webp` | 74.6 KB | WebP ✅ | lazy |
| `/games/asteroid-dodge.webp` | 78.6 KB | WebP ✅ | lazy |

### Achados
- **6 imagens, todas lazy** — as primeiras 2 (project cards) estão above-fold e poderiam ser `eager`
- **`seu.pet.gif`** — formato GIF desatualizado; converter para WebP economizaria ~40-50%
- **next.config.js** com `formats: ['image/avif', 'image/webp']` ✅
- **Dimensões explícitas:** `<Image>` do Next.js com width/height ✅ (previne CLS)

---

## 🔤 Font Loading

| Fonte | Display | Estratégia |
|-------|---------|------------|
| Inter (variable) | `swap` | `next/font` — self-hosted ✅ |
| JetBrains Mono (variable) | `swap` | `next/font` — self-hosted ✅ |

- **15 font faces** carregadas (variações de peso)
- **`display: swap`** — texto renderiza com fallback imediatamente ✅
- **CSS Variables** (`--font-inter`, `--font-jetbrains-mono`) — troca eficiente ✅
- **Nenhum FOIT** — fallback tipográfico ativo ✅

---

## ⚠️ Recomendações

### 1. Above-fold images → `eager`
As imagens dos cards de projeto (`seu.pet.gif`, `portifolio.webp`) estão no viewport inicial e usam `loading="lazy"`. Trocar para `eager` para evitar atraso na renderização.

**Impacto:** Pequeno (já são 20-70 KB), mas pode melhorar LCP.

### 2. Converter `seu.pet.gif` → WebP
GIF de 69 KB → WebP ~30 KB. Ganho de ~55%.

**Impacto:** Redução de ~40 KB no total transferido.

### 3. Total Page Transfer (787 KB)
Para um portfólio com parallax, animações e 6 imagens, 787 KB está na média. Monitorar se crescer com novos projetos.

---

## ✅ Boas Práticas Presentes

- ✅ `next/font` com `display: swap` — self-hosted, sem requests externos
- ✅ Tree-shaking agressivo (`removeConsole` em produção)
- ✅ Image optimization configurado (WebP + AVIF)
- ✅ `<Image>` com `loading="lazy"` e dimensões explícitas
- ✅ Tailwind CSS 4 JIT — sem CSS não utilizado
- ✅ HTML semântico e tamanho reduzido (26.6 KB)
- ✅ Sem dependências pesadas desnecessárias

---

*Audit gerado via Playwright Navigation Timing API*
