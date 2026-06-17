# 🛸 Portifolio Samuel — Project Context

## Identity

**Portfolio profissional estilo painel de controle sci-fi.** Interface imersiva com tema ciano+preto, animações cinematográficas e parallax scene com cockpit. Não é um portfolio comum — é uma experiência de "painel de controle" onde o usuário pilota o sistema.

**Problema que resolve:** Portfolios tradicionais são currículos fancy que não demonstram capacidade técnica real. Portifolio Samuel transforma a navegação em vitrine do que Samuel sabe fazer: animações fluidas, design system consistente, arquitetura Next.js madura, testes E2E, acessibilidade e performance.

**Propósito:** Apresentar Samuel Medeiros como desenvolvedor full-stack com portfólio interativo. Cada seção é um componente isolado com seu próprio micro-design — como módulos de uma nave espacial.

**Seções:** Profile (hero c/ foto e bio) → Skills Grid (ícones por categoria) → Core Engine (About Me narrativo) → ProjectHangar (cards com filtro) → Games (um por vez + toggle "ver todos") → Contato (rate-limited + validação) → Footer (links, stats, navegação).

**Experiência do usuário:** Parallax scene integrada — grid + cockpit SVG + HUD panels + partículas formam a entrada. Scroll suave com parallax layers (L0-L3). Navegação por scroll + keyboard shortcuts (desktop). Tema escuro ciano+preto com consistência visual cinematográfica.

**URL:** https://samuelmedeiros.vercel.app
**Git:** GitHub (público) — Samuelfmedeiros/portifolio
**Deploy:** Vercel (automático no push pra master)

## Core Rules
- **Tema visual:** ciano+preto, cinematográfico, animações fortes. ~~Treasure Planet~~ (arquivado 2026-06).
- **Splash:** ❌ Removido (14/06/2026). Ambiente (grid + cockpit) SEMPRE visível. Hero content fadeIn com stagger por cima. Splash anterior arquivado em `src/components/_old/SplashScreen.tsx`.
- **Sessões:** HeroSection min-h-[70vh], scroll-mt-20 pra navbar, games em abas (um por vez + toggle "ver todos").
- **CSP:** sincronizada entre `next.config.js` e `vercel.json`. Vercel prioriza `vercel.json`.
- **Componentes:** GameShowcase com tabs + grid toggle. KeyboardShortcuts só desktop.

## ADRs Relevantes
`docs/adr/ADR-001` ~~Treasure Planet~~ **Deprecado**, `ADR-002` (Splash boot sequence), `ADR-003` (Vercel deploy)

## Stack
Next.js 16 · Turbopack · React 19 · Tailwind 4 · Framer Motion · Supabase · Playwright · Vitest · Umami Analytics (self-hosted)

## Lint Status
**0 errors, 0 warnings** — ESLint limpo. Build compila sem TypeScript errors.

## Fixes Recentes
- **Scroll vertical cards jogos (17/06):** `overflow-y-hidden` nos cards (não rolam pra cima/baixo) + `min-h-[160px]` (evita layout shift no load). SEM `touchAction:pan-x` — scroll vertical propaga pra página.
- **Loading state jogos (17/06):** Spinner + "Carregando jogo..." enquanto iframe carrega CDNs (React + Babel do unpkg). `useState(false)` inicial, reset ao fechar.
- **Deploy Vercel (17/06):** GSAP adicionado ao `package.json` (faltava nas dependencies, quebrava build na Vercel). Buffer→Uint8Array no download-cv. Fix imports MotionValue/useScroll/useTransform no ProfileSection.
- **Umami tracking (17/06):** Eventos nos botões Apoiar (`support-modal`) e Consultoria Técnica. Evento `click-consulting-cta` já existia.
- **Centralização (17/06):** Título "🎮 Games" e heading "▸ JORNADA" centralizados. Cards de jogos com `justify-center`.
- **Parallax Intro (14/06):** SplashScreen deletado. Entrada integrada: L0/L1 fadeIn 0.5-0.6s + hero stagger + background delays.
- Feature flag `NEXT_PUBLIC_ENABLE_SPLASH` ~~obsoleta~~ — splash removido
- Navbar navegação: scroll único com offset, sem scrollend/timeout
- Logo `#hero` → scroll pro topo (seção não existia)
- `activeSection` inicial corrigido de `"hero"` → `"profile"`
- ProfileSection: `scroll-mt-20` + `id="profile-heading"` adicionados
- ProjectHangar: `id="projects"` duplicado removido (já existe no page.tsx wrapper)

## Config
- `NEXT_PUBLIC_ENABLE_SPLASH` — ~~obsoleto, splash removido 14/06/2026~~. Mantido para compatibilidade.
- ProfileSection: L0 (grid) e L1 (cockpit) com `initial/animate` para fade-in de entrada

## CI/CD
GitHub Actions → lint → test (vitest --run) → build. Deploy Vercel manual via CLI (`vercel --token "$VERCEL_TOKEN" --prod`). Automático ainda não configurado. Produção local :3001 + staging :3000.

## 📅 Histórico
- **Início:** 06/05/2026 — 245+ commits
- **Pico:** Maio/2026 (174 commits — responsivo, testes, analytics, footer)
- **14/06/2026:** Renomeado MC → Portifolio Samuel. Produção self-host :3001. Umami Analytics instalado.

## ⚙️ Deploys

### Staging (Capivara)
Portifolio tem staging em **capivara.seu.pet** via proxy reverso do Capivara:
- **Sistema:** systemd `portifolio-staging.service` na porta 3000 (`systemctl --user enable portifolio-staging`)
- **URL local:** http://localhost:3000
- **Proxy Capivara:** `/api/portifolio-proxy/` (autenticado, só usuários logados)
- **Dashboard:** seção "Portifolio Staging" no capivara.seu.pet com iframe
- **Splash:** ❌ removido (parallax layers como entrada)
- **X-Frame-Options:** `SAMEORIGIN` (permite iframe do capivara.seu.pet)
- **Build:** `pnpm build` antes de alterações
- **Reiniciar:** `systemctl --user restart portifolio-staging`

### Produção (self-host)
- **Sistema:** systemd `portifolio.service` na porta 3001
- **URL local:** http://localhost:3001
- **Build:** `pnpm build` e `systemctl --user restart portifolio.service`
- **Vercel:** `samuelmedeiros.vercel.app` (deploy manual via CLI, build funcional após adicionar gsap ao package.json)

## 📊 Analytics (Umami)
- **Servidor:** Umami v3 rodando em `localhost:3100` (service `umami.service`)
- **Acesso:** `capivara.seu.pet/api/umami/` (via proxy Capivara, precisa de login admin/umami)
- **Admin:** Configurado (usuário: admin, senha: umami — resetada 17/06)
- **Tracking script:** Injetado no `<head>` do layout (data-website-id dde11802-...)
- **Dados:** 4 sites monitorados (Portifolio Samuel, Capivara, Arachne, Dogwalk)
- **Eventos:** section_view, theme_toggle, cv_download, nav_click, contact_submit, click-consulting-cta
