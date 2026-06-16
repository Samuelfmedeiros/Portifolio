# 🎮 Games — Audit Report

**Data:** 16/06/2026
**Ferramenta:** Inspeção de HTML + API routes + GameShowcase component
**Total de jogos:** 4 (simon-game, asteroid-dodge, code-typing, memory-matrix)

---

## ✅ Resumo

| Métrica | Resultado |
|---------|-----------|
| **Jogos listados** | 4 ✅ |
| **API routes (200)** | 4/4 ✅ |
| **404 para slug inválido** | ✅ |
| **Iframe embed** | ✅ Criado dinamicamente via JS |
| **X-Frame-Options** | `SAMEORIGIN` ✅ |
| **Cache-Control** | `public, max-age=3600` ✅ |
| **Game images (webp)** | 4/4 ✅ |
| **Close button** | ✅ Fecha iframe e limpa src |
| **Analytics tracking** | ✅ `game_play` event no Umami |
| **React production mode** | ⚠️ memory-matrix **corrigido** (era development) |
| **HTML lang** | ⚠️ 2 jogos com `lang="en"` (deveriam ser `pt-BR`) |

---

## 🗂️ Jogos

| Jogo | API Status | Arquivo HTML | React Mode | HTML Lang | Image |
|------|-----------|-------------|------------|-----------|-------|
| `simon-game` | ✅ 200 | `index.html` | ✅ production | ✅ `pt-BR` | `/games/simon-game.webp` (59.8 KB) |
| `asteroid-dodge` | ✅ 200 | `index.html` | ✅ production | ❌ `en` → `pt-BR` | `/games/asteroid-dodge.webp` (78.6 KB) |
| `code-typing` | ✅ 200 | `index.html` | ✅ production | ❌ `en` → `pt-BR` | `/games/code-typing.webp` (74.6 KB) |
| `memory-matrix` | ✅ 200 | `index.html` | ✅ **corrigido** (era development) | ✅ `pt-BR` | `/games/memory-matrix.webp` (85.9 KB) |

---

## 🔧 Correções Aplicadas

### memory-matrix — React Development Mode (FIX)
- **Problema:** Carregava `react.development.js` e `react-dom.development.js` em vez de production
- **Risco:** Warnings no console do browser, perf slightly worse
- **Correção:** Alterado para `react.production.min.js` e `react-dom.production.min.js`

---

## ⚠️ Achados

### 1. HTML `lang="en"` em jogos standalone (BAIXO)

`asteroid-dodge` e `code-typing` usam `lang="en"` em vez de `lang="pt-BR"`:

| Jogo | Atual | Esperado |
|------|-------|----------|
| asteroid-dodge | `lang="en"` | `lang="pt-BR"` |
| code-typing | `lang="en"` | `lang="pt-BR"` |

**Impacto:** Baixo — jogos são carregados via iframe e não afetam a acessibilidade/SEO do portfólio principal. Afeta apenas a página HTML standalone.

**Recomendação:** Alterar `lang` para `pt-BR` nos HTMLs dos jogos para consistência com o restante do site.

### 2. Babel Standalone em todos os jogos (INFORMATIVO)

Todos os 4 jogos carregam `babel.standalone` para transpilação JSX no browser. Isso adiciona ~700 KB de JS em runtime.

**Impacto:** Moderado (delay de ~200-300ms no carregamento do jogo) — mas é o approach padrão para jogos standalone que não passam por build tooling.

**Recomendação:** Considerar pré-compilar os JSX dos jogos com Babel CLI para remover a dependência de runtime.

### 3. Imagens dos jogos

- ✅ 4 imagens WebP (total ~299 KB)
- ✅ Todas com `loading="lazy"`
- ✅ Images carregam rápido (20-86 KB cada)
- ✅ Formatos modernos (WebP)
- ⚠️ **Alt text:** usa `alt={repo.name}` (ex: `asteroid-dodge`, `simon-game`) — descrições em inglês não ideais para acessibilidade em português

---

## 🏗️ Arquitetura

```
GameShowcase (componente React)
  ├── Botão "▶ JOGAR" → evento analytics + cria iframe
  ├── iframe.src = /api/game/{slug}
  ├── API route: lê public/games/{slug}/index.html
  ├── X-Frame-Options: SAMEORIGIN
  ├── Cache-Control: 1 hora
  └── Botão "✕ Fechar" → limpa iframe.src, esconde container
```

- ✅ **Um jogo por vez** (single iframe, não múltiplos)
- ✅ **Analytics:** evento `game_play` rastreado no Umami
- ✅ **Scroll horizontal** com botões de navegação
- ✅ **Snap scrolling** para centralizar cards
- ✅ **GlassCard** com gradient background
- ✅ **GitHub repo link** em cada card

---

## ✅ Boas Práticas Presentes

- ✅ **Single iframe** — apenas um jogo carregado por vez (memória)
- ✅ **Cleanup on close** — `iframe.src = ""` remove o conteúdo
- ✅ **X-Frame-Options: SAMEORIGIN** — segurança contra clickjacking
- ✅ **Cache-Control: 1h** — jogos cacheados no navegador
- ✅ **Analytics tracking** — evento `game_play` no Umami
- ✅ **Scroll navigation** com `aria-label` nos botões
- ✅ **Snap scrolling** para UX consistente
- ✅ **Images with lazy loading** — 6 game screenshots em WebP
- ✅ **GAME_PROJECTS** limpo (terminal removido corretamente na LINKS_AUDIT)
- ✅ **Loading states** — skeleton durante carregamento de projetos

---

*Audit gerado por verificação de API routes + inspeção de componentes + análise de arquivos estáticos*
