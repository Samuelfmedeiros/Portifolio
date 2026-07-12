# 🛸 Portifolio Samuel — Session State

## 🎯 Identidade
Portfólio profissional sci-fi · Next.js 16 + React 19 + Tailwind 4 · Painel de controle interativo com animações cinematográficas e 5 mini-games

## 📍 Estado Atual
- **Branch:** `master`
- **Último commit:** `6eb98ae` — feat: recria capas portifolio e lifelog no estilo collage — build: permite build com warnings ESLint (ignoreDuringBuilds: true) — feat(games): atualiza 5 jogos com melhorias mobile (v3 port) — auto-sync: 2026-07-05 21:01 — auto-sync: 2026-07-05 12:00 — auto-sync: 2026-07-05 06:06 — auto-sync: 2026-07-05 05:12 — docs: auto-update semanal — chore(memory): auto-log b43b0ef — auto-sync: 2026-07-04 21:01 — auto-sync: 2026-07-04 17:00 — auto-sync: 2026-07-04 06:01 — auto-sync: 2026-07-04 04:01 — docs: atualiza README.md, cria ARCHITECTURE.md — docs: auto-update AGENTS.md + HISTORY.md — chore(memory): auto-log d7abf19 — auto-sync: 2026-07-03
- **Status:** ✅ Funcional — produção em Vercel + self-host :3001
- **Testes:** 217 passando
- **Lint:** 0 errors, 0 warnings
- **URL:** https://samuelmedeiros.vercel.app

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

## 🔗 Links
- **Live:** https://samuelmedeiros.vercel.app
- **GitHub:** https://github.com/Samuelfmedeiros/portifolio
- **Bare:** `/mnt/f/Samuel Backup/git-bare/portifolio.git`
- **Deploy:** `vercel --token $VERCEL_TOKEN --prod`
- **Staging:** `capivara.seu.pet` (porta 3000, systemd)
