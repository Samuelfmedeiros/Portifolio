# 🛸 Portifolio Samuel — Session State

## 🎯 Identidade
Portfólio profissional sci-fi · Next.js 16 + React 19 + Tailwind 4 · Painel de controle interativo com animações cinematográficas e 5 mini-games

## 📍 Estado Atual
- **Branch:** `master`
- **Último commit:** `c1f6956` — auto-sync: 2026-08-09 05:00 — auto-sync: 2026-08-09 04:00 — fix(theme): completa CSS VT da animação circular (isolation + mix-blend normal, validado no LifeLog) + duração 600→400ms — fluida e rápida — auto-sync: 2026-08-07 18:30 — i18n 100% + CV locale-aware
- **Status:** ✅ Funcional — produção em Vercel + self-host :3001
- **Testes:** 239 passando
- **Lint:** 0 errors, 0 warnings
- **URL:** https://samuelmedeiros.vercel.app


## Sessão 2026-08-07 — i18n 100% + CV locale-aware + auditoria CI
- **i18n por origem**: locale detectado via navigator.language (pt-BR/pt-PT → PT, outro → EN); NÃO restaura último salvo — cada visita detecta a origem
- **CV locale-aware**: /api/download-cv serve Samuel_Andrade_2026.pdf (PT) ou Samuel_Andrade_Resume_2026.pdf (EN) conforme locale
- **Zero PT hardcoded**: Terminal (todos os comandos), ProfileSection, Footer, PalettePicker, ContactForm, SupportButton (modal Pix), games label — varredura profunda
- **Auditoria CI**: teste falha se achar texto PT hardcoded fora de t() (varre JSX text + aria/placeholder/title em 14 componentes)
- 17 commits · push bare+origin OK · HEAD: `d97540b`

## Sessão 2026-08-06 — Bug Hunter + i18n Terminal completo
- **Bug Hunter Portifólio**: auditoria de render SPA Next.js — verifica se componentes React montaram corretamente
- **i18n Terminal completo**: terminal.help agora usa t() — 26 comandos traduzíveis PT/EN, último reduto de PT hardcoded eliminado
- HEAD: ff41895 · 8 commits · push bare+origin OK

## Sessão 2026-08-05 — VRT + CV fix
- **VRT Playwright**: toHaveScreenshot em 4 seções principais (home, projetos, games, contato)
- **CV fix**: remove endereço completo e CEP — fica apenas "Brasília-DF" (regenerado do DOCX fonte)
- **4 commits** · push bare+origin OK · HEAD: `1aa9c44`
## ✅ Features Implementadas
- Parallax scene multicamada (L0-L3) com cockpit SVG animado
- 5 mini-games embutidos (iframe + React via CDN)
- Formulário de contato com validação + rate-limit + LGPD + Resend
- Projetos com dados do GitHub + fallback estático
- Timeline de carreira interativa + Skills grid categorizado
- Terminal interativo com 15+ comandos
- Tema escuro ciano+preto com design system consistente
- i18n PT/EN completo (todos os componentes)
- Umami Analytics (eventos, pageviews, heatmaps)
- Stripe + Mercado Pago (apoio/consultoria)
- CSP sincronizada, acessibilidade, SEO, manifest PWA
- Cookie Banner com consentimento LGPD + opções

## 🗺️ Próximos Passos
- [ ] Deploy automático Vercel via CI (atualmente manual via CLI)
- [ ] E2E Playwright em CI
- [ ] Modo escuro toggle persistente
- [ ] SEO: mais meta tags + schema.org

## 📁 Estrutura
- `src/app/` — App Router (layout, metadata, API routes, pages)
- `src/components/` — Hero, Profile, Projects, Games, Contact, Navbar, Terminal
- `src/hooks/` — useAnalytics, useLocalStorage
- `src/lib/` — GitHub API, types, fallback data
- `src/test/` — Vitest setup + mocks
- `src/components/MiniGames/` — Código dos 5 jogos (React)

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
Next.js 16 · Turbopack · React 19 · Tailwind 4 · Framer Motion · Playwright · Vitest · Umami Analytics (self-hosted)

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

---

## 🔒 Deps — pnpm 10 via corepack + overrides (04/08/2026)

- **Use SEMPRE o pnpm do packageManager** (pnpm@10.34.5): `COREPACK_ENABLE_STRICT=0 corepack pnpm@10.34.5 <cmd>`. O pnpm global é 9.12.3 — regenerar lockfile com ele quebra o CI (ERR_PNPM_EEXIST).
- **Store:** o corepack pnpm 10 pode cair em /tmp/.pnpm-store (efêmero). Configurar uma vez: `corepack pnpm@10.34.5 config set store-dir /home/samuel/.pnpm-store --global`. node_modules instalado com major diferente exige `install --config.confirmModulesPurge=false`.
- **pnpm.overrides no package.json** fixa deps transitivas vulneráveis do vercel CLI (tar>=7.5.19, undici>=7.29.0, minimatch>=10.2.3, path-to-regexp>=8.4.0, js-yaml>=4.3.0, sharp>=0.35.0, @fastify/static>=10.1.1). Audit: 68→6 (0 high/critical; produção limpa).
- **Audit:** produção sempre `pnpm audit --prod` (deve dar "No known vulnerabilities"). As 6 restantes são dev tooling (vercel/netlify/vitest) low/moderate.

## 🛡️ REGRA DE SEGURANÇA CONTÍNUA (04/08/2026)

> **"Segurança é acompanhamento."** — Samuel. Política unificada com LifeLog e LEVE LAVANDA.

- **A cada entrega:** `pnpm audit` + verificar headers no `vercel.json` + integridade do lockfile
- **Semanalmente:** revisar `docs/SEGURANCA.md` + atualizar inventário
- **Mensalmente:** revisar dependências + domínios na CSP (remover stale)
- **Ao adicionar feature:** reavaliar superfície de ataque
- **Referências:** OWASP Top 10:2025, HttpArmor, OWASP Web Checklist
- **Cron:** `Portfolio Security Watchdog` (diário, 24h, silent unless issues)
- **Doc completo:** `docs/SEGURANCA.md`
