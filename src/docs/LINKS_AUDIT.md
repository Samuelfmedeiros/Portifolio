# 🔗 Dead Links + Rotas — Audit Report

**Data:** 16/06/2026
**URL base:** https://samuelmedeiros.vercel.app (SITE_URL)

---

## ✅ Rotas — Testadas (curl)

| Rota | Status | Tipo |
|------|--------|------|
| `/` (Home) | ✅ 200 | Static (ISR 1h) |
| `/privacidade` | ✅ 200 | Static |
| `/termos` | ✅ 200 | Static |
| `/robots.txt` | ✅ 200 | Generated |
| `/sitemap.xml` | ✅ 200 | Generated |
| `/opengraph-image` | ✅ 200 | Dynamic OG image |
| `/manifest.webmanifest` | ✅ Build | Static |
| `/api/game/simon-game` | ✅ 200 | Dynamic |
| `/api/game/asteroid-dodge` | ✅ 200 | Dynamic |
| `/api/game/code-typing` | ✅ 200 | Dynamic |
| `/api/game/memory-matrix` | ✅ 200 | Dynamic |
| `/rota-inexistente` | ✅ 404 | Custom not-found |
| `/api/game/terminal` | 🔴 ~~404~~ → **Removido** | Não tinha index.html |

---

## 🔧 Correções Aplicadas

### `/api/game/terminal` — 404 (FIX)
- **Problema:** "terminal" listado em `GAME_PROJECTS` mas não tem `public/games/terminal/index.html`
- **Causa:** Terminal é um componente React (`src/components/Terminal.tsx`), não um jogo standalone
- **Correção:** Removido "terminal" de `GAME_PROJECTS` em `src/lib/staticProjects.ts`
- **Impacto:** Terminal não aparece mais como jogo na seção de games (já acessível via seção Terminal)

---

## 🔗 Links Internos (Navbar + Footer)

### Navbar
| Link | Destino | Status |
|------|---------|--------|
| `#profile` | ProfileSection (Hero) | ✅ Scroll interno |
| `#jornada` | Jornada/Timeline | ✅ Scroll interno |
| `#projects` | ProjectHangar | ✅ Scroll interno |
| `#games` | GameShowcase | ✅ Scroll interno |
| `#contact` | ContactForm | ✅ Scroll interno |
| `#hero` | Topo (Logo) | ✅ Scroll ao topo |

### Footer
| Link | Destino | Status |
|------|---------|--------|
| GitHub | `github.com/Samuelfmedeiros` | ✅ Externo |
| LinkedIn | `linkedin.com/in/samuelandrademedeiros` | ✅ Externo |
| WhatsApp | `wa.me/556191191722` | ✅ Externo |
| Email | `mailto:samuelandrademedeiros@gmail.com` | ✅ Externo |
| Currículo | `/Samuel_Andrade_2026.pdf` | ✅ Estático |
| BuyMeACoffee | Configurável via `BMC_CONFIG.url` | ✅ Externo |
| GitHub Sponsors | Configurável via `GITHUB_SPONSORS_CONFIG.url` | ✅ Externo |

### Hero CTA
| Link | Destino | Status |
|------|---------|--------|
| "Ver Projetos" | `#projects` | ✅ Scroll interno |
| "Baixar Curriculo" | `/Samuel_Andrade_2026.pdf` | ✅ PDF (84 KB) |

### 404 Page
| Link | Destino | Status |
|------|---------|--------|
| "RETORNAR À BASE" | `/` | ✅ Next.js Link |

---

## 🤖 Sitemap & Robots

### `sitemap.xml` (gerado dinamicamente)
- ✅ URLs: `/`, `/privacidade`, `/termos`
- ✅ Prioridades: Home=1.0, demais=0.5
- ✅ ChangeFreq: Home=monthly, demais=yearly
- ✅ `lastModified` atualizado automaticamente
- ✅ Canonical: `https://samuelmedeiros.vercel.app`
- ❌ **Faltando:** `/robots.txt`, `/opengraph-image`, `/manifest.webmanifest` — não crítico

### `robots.txt` (gerado + estático)
- ✅ `Allow: /` para todos user-agents
- ✅ Sitemap aponta para `sitemap.xml`
- ✅ Consistente entre `public/robots.txt` (estático) e `src/app/robots.ts` (dinâmico)

### Canonical URL
- ✅ `metadataBase` = `https://samuelmedeiros.vercel.app`
- ✅ `alternates.canonical` = `https://samuelmedeiros.vercel.app`
- ✅ `alternates.languages` = pt-BR e en-US definidos

---

## 📋 Recomendações

1. **Adicionar mais entradas no sitemap** — incluir `/robots.txt` e `/opengraph-image` para indexação completa
2. **Verificar links externos periodicamente** — GitHub, LinkedIn, WhatsApp podem mudar
3. **Considerar link checker automatizado** — `broken-link-checker` ou similar no CI
