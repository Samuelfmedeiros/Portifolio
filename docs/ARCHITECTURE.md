# 🛸 Portifolio Samuel — Arquitetura

## Visão Geral

Portfólio profissional sci-fi com experiência de "painel de controle". Interface imersiva com tema ciano+preto, animações cinematográficas, 5 mini-games e design system consistente.

## Stack

Next.js 16 + Turbopack + React 19 + Tailwind 4 + Framer Motion + GSAP + Supabase + Playwright + Vitest + Umami

## Seções

| Seção | Componente | Destaque |
|-------|-----------|----------|
| **Hero** | `HeroSection.tsx` | TypeWriter, parallax L0-L3, cockpit SVG |
| **Profile** | `ProfileSection.tsx` | Timeline interativa, Skills grid com barra |
| **Projetos** | `ProjectHangar.tsx` | Grid filtrável, dados GitHub + fallback |
| **Jogos** | `GameShowcase.tsx` | 5 jogos em iframe, React via CDN |
| **Contato** | `ContactForm.tsx` | Validação, rate-limit 30s, LGPD, Resend |
| **Terminal** | `Terminal.tsx` | 15+ comandos interativos |

## Performance
- 177 testes (Vitest + RTL)
- 0 lint errors, 0 warnings
- Lighthouse: SEO 100, Acessibilidade 95+
- CSP rigorosa, Gitleaks, Dependabot

## Deploy
- **Produção:** Vercel (auto-deploy) + self-host :3001 (redundante)
- **Staging:** capivara.seu.pet :3000 (systemd)
- **Analytics:** Umami self-hosted (eventos + pageviews)

## Documentação
- `AGENTS.md` — Estado atual do projeto + diretrizes de design
- `README.md` — Visão geral, badges, instruções de setup
- `DEPLOY.md` — Deploy automático + troubleshooting
- `docs/HISTORY.md` — História completa do projeto
