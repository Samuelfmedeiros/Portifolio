<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/icon.svg">
    <img src="public/icon.svg" alt="Samuel Medeiros" width="90">
  </picture>
</p>

<h1 align="center">🛸 Samuel Portifolio</h1>

<p align="center">
  <strong>Professional portfolio · Next.js · React · TypeScript</strong>
</p>

<p align="center">
  <a href="https://samuelmedeiros.vercel.app">
    <img src="https://img.shields.io/badge/Live-→_samuelmedeiros.vercel.app-06b6d4?style=flat-square&logoColor=white" alt="Live">
  </a>
  <a href="#-tests">
    <img src="https://img.shields.io/badge/Tests-268_passing-22c55e?style=flat-square" alt="Tests">
  </a>
  <a href="https://github.com/Samuelfmedeiros/Portifolio/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/Samuelfmedeiros/Portifolio/ci.yml?branch=master&style=flat-square&logo=github&label=CI" alt="CI">
  </a>
  <a href="https://github.com/Samuelfmedeiros/Portifolio/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-6366f1?style=flat-square" alt="License">
  </a>
  <br />
  <img src="https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React_19-000?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-000?style=flat-square&logo=typescript" alt="TS">
  <img src="https://img.shields.io/badge/Tailwind_4-000?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Framer_Motion-000?style=flat-square&logo=framer" alt="Framer">
  <img src="https://img.shields.io/badge/Vitest-000?style=flat-square&logo=vitest" alt="Vitest">
</p>

> 🌐 **English** · [🇧🇷 Português](README.pt-BR.md)

---

## About

Professional portfolio of **Samuel Medeiros** — full stack developer and data analyst. Breaks the "cute resume" mold: each section is an independent module demonstrating real skills in software architecture, cutting-edge animation, code quality, and user experience.

→ **[samuelmedeiros.vercel.app](https://samuelmedeiros.vercel.app)**

### What you'll find here

- **Next.js 16 architecture** — App Router, server components, API routes, Turbopack
- **Own design system** — dark cyan+black theme, glassmorphism, consistent typography (dark/light + 6 palettes)
- **Cinematic animations** — Framer Motion with spring physics, multilayer parallax
- **Industrial-grade quality** — 268 tests, CI/CD, CSP, accessibility (95+), SEO (100)
- **5 embedded mini-games** — React in the browser, zero external dependency
- **i18n PT/EN** — complete across all components
- **Interactive terminal** — 15+ commands simulating a real environment
- **Analytics** — self-hosted Umami (events + pageviews)

---

## Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Backend** | Capivara API (local PostgreSQL 18) |
| **Tests** | Vitest + Testing Library + Playwright |
| **CI/CD** | GitHub Actions → Vercel |
| **Analytics** | Self-hosted Umami |

---

## Sections

| Section | Component | Highlight |
|---------|-----------|-----------|
| **Hero** | `HeroSection.tsx` | TypeWriter, parallax L0-L3, cockpit SVG |
| **Profile** | `ProfileSection.tsx` | Interactive timeline, Skills grid with bars |
| **Projects** | `ProjectHangar.tsx` | Filterable grid, GitHub data + static fallback |
| **Games** | `GameShowcase.tsx` | 5 games in iframe, React via CDN |
| **Contact** | `ContactForm.tsx` | Validation, rate-limit, LGPD, Capivara API |
| **Terminal** | `Terminal.tsx` | 15+ interactive commands |

---

## Getting Started

```bash
# Clone
git clone https://github.com/Samuelfmedeiros/portifolio.git
cd portifolio

# Install dependencies (pnpm required)
pnpm install

# Dev server
pnpm dev

# Build
pnpm build

# Tests
pnpm test:run
pnpm test:e2e
```

**Prerequisites:** Node.js 22+, pnpm 9+

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm build:analyze` | Build with bundle analysis |
| `pnpm test` | Vitest watch mode |
| `pnpm test:run` | Vitest (single run) |
| `pnpm test:e2e` | Playwright E2E |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint auto-fix |

---

## Tests

**268 tests passing** — covering:
- All 45 components
- Hooks (useLocalStorage, useAnalytics)
- Libs (GitHub API, staticProjects, Capivara API)
- 5 games (GameShowcase)
- E2E smoke tests (Playwright against production)

```bash
pnpm test:run    # Vitest
pnpm test:e2e    # Playwright
```

---

## Documentation

| File | Content |
|------|---------|
| [AGENTS.md](./AGENTS.md) | Current project state + design guidelines |
| [DEPLOY.md](./DEPLOY.md) | Automatic + manual deploy + troubleshooting |
| [SECURITY.md](./SECURITY.md) | Security policy + headers + audit |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Stack, sections, performance |
| [docs/HISTORY.md](./docs/HISTORY.md) | Complete project history |
| [docs/STRIPE_PORTIFOLIO.md](./docs/STRIPE_PORTIFOLIO.md) | Stripe integration (consulting) |

---

## License

MIT © Samuel Medeiros
