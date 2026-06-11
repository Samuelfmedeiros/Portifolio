# 🛸 Mission Control — Project Context

## Identity
Portfolio profissional estilo painel de controle sci-fi. Next.js 16 + Tailwind 4 + Framer Motion + Supabase.
**URL:** https://samuelmedeiros.vercel.app
**Git:** GitHub (público) — Samuelfmedeiros/mission-control
**Deploy:** Vercel (automático no push pra master)

## Core Rules
- **Tema visual:** ciano+preto, cinematográfico, animações fortes. ~~Treasure Planet~~ (arquivado 2026-06).
- **Splash:** Tatu cavando buraco negro (SVG inline, 5 fases). Skip button + reduced motion.
- **Sessões:** HeroSection min-h-[70vh], scroll-mt-20 pra navbar, games em abas (um por vez + toggle "ver todos").
- **CSP:** sincronizada entre `next.config.js` e `vercel.json`. Vercel prioriza `vercel.json`.
- **Componentes:** GameShowcase com tabs + grid toggle. KeyboardShortcuts só desktop.

## ADRs Relevantes
`docs/adr/ADR-001` ~~Treasure Planet~~ **Deprecado**, `ADR-002` (Splash boot sequence), `ADR-003` (Vercel deploy)

## Stack
Next.js 16 · Turbopack · React 19 · Tailwind 4 · Framer Motion · Supabase · Playwright · Vitest

## CI/CD
GitHub Actions → lint → test (vitest --run) → build → deploy Vercel. Preview deploys em PRs.
