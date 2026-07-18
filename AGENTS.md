# 🛸 Portifolio Samuel — Session State

## 🎯 Identidade
Portfólio profissional sci-fi · Next.js 16 + React 19 + Tailwind 4 · Painel de controle interativo com animações cinematográficas e 5 mini-games

## 📍 Estado Atual
- **Branch:** `master`
- **Status:** ✅ Production em Vercel
- **Testes:** 219 passando
- **Lint:** 0 errors, 0 warnings
- **URL:** https://samuelmedeiros.vercel.app
- **Stack:** Next.js 16 (App Router + Turbopack) + Tailwind 4 + Framer Motion + Playwright

## ✅ Features Implementadas
- Parallax scene multicamada (L0-L3) com cockpit SVG animado
- 5 mini-games embutidos (iframe + React via CDN)
- Formulário de contato com validação + rate-limit + LGPD + Capivara API
- Projetos com dados do GitHub + fallback estático
- Timeline de carreira interativa + Skills grid categorizado
- Terminal interativo com 15+ comandos
- Tema escuro ciano+preto com design system consistente (dark/light + 6 paletas)
- i18n PT/EN completo (todos os componentes)
- Umami Analytics (eventos, pageviews, heatmaps)
- Stripe + Mercado Pago (apoio/consultoria)
- CSP sincronizada, acessibilidade (95+), SEO (100), manifest PWA
- Cookie Banner com consentimento LGPD + opções
- Deploy automático Vercel via CI (`deploy.yml` com health check + rollback)
- PostgreSQL 18 local via Capivara (contact form, CV downloads, events)

## 🎨 Diretrizes de Design
1. **Glassmorphism:** Use `backdrop-blur-md` e bordas semi-transparentes (`border-white/10`) em todos os cards.
2. **Cores:**
   - **Tema Escuro:** Fundo `#000000`, acentos em `cyan-400` e `indigo-500`.
   - **Tema Claro:** Fundo `#f8fafc`, acentos em `slate-900`.
3. **Animações:** Use Framer Motion para entradas suaves. Elementos de HUD podem ter leve "flicker" ocasional para realismo.

## 📁 Estrutura
- `src/app/` — App Router (layout, metadata, API routes, pages)
- `src/components/` — Hero, Profile, Projects, Games, Contact, Navbar, Terminal
- `src/hooks/` — useAnalytics, useLocalStorage
- `src/lib/` — GitHub API, types, fallback data, Capivara API client
- `src/test/` — Vitest setup + mocks
- `src/components/MiniGames/` — Código dos 5 jogos (React)

## 🔗 Links
- **Live:** https://samuelmedeiros.vercel.app
- **GitHub:** https://github.com/Samuelfmedeiros/portifolio
- **Deploy:** Push na master → CI/CD automático
- **API (Capivara):** https://capivara.seu.pet/api/portifolio/public
- **Bare:** `/mnt/f/Samuel Backup/git-bare/portifolio.git`

## 📄 Documentação Essencial
| Arquivo | Conteúdo |
|---------|----------|
| `README.md` | Visão geral, badges, instruções de setup |
| `DEPLOY.md` | Deploy automático + manual + troubleshooting |
| `SECURITY.md` | Política de segurança + headers + auditoria |
| `docs/ARCHITECTURE.md` | Stack, seções, performance |
| `docs/HISTORY.md` | História completa do projeto |
| `docs/STRIPE_PORTIFOLIO.md` | Integração Stripe (consultoria) |
| `docs/adr/` | Decisões arquiteturais (3 ADRs) |
