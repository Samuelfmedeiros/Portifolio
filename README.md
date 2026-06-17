<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/icon.svg">
    <img src="public/icon.svg" alt="Samuel Medeiros" width="90">
  </picture>
</p>

<h1 align="center">🛸 Portifolio Samuel</h1>

<p align="center">
  <strong>Portfólio profissional · Next.js · React · TypeScript</strong>
</p>

<p align="center">
  <a href="https://samuelmedeiros.vercel.app">
    <img src="https://img.shields.io/badge/Live-→_samuelmedeiros.vercel.app-06b6d4?style=flat-square&logoColor=white" alt="Live">
  </a>
  <a href="#-testes">
    <img src="https://img.shields.io/badge/Testes-222_passing-22c55e?style=flat-square" alt="Testes">
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

---

## Sobre

Portfólio profissional de **Samuel Medeiros** — desenvolvedor full stack e analista de dados. Fog do padrão "currículo bonitinho": cada seção é um módulo independente que demonstra habilidades reais em arquitetura de software, animações de ponta, qualidade de código e experiência do usuário.

→ **[samuelmedeiros.vercel.app](https://samuelmedeiros.vercel.app)**

### O que você encontra aqui

- **Arquitetura Next.js 16** — App Router, server components, API routes, Turbopack
- **Design system próprio** — tema escuro ciano+preto, glassmorphism, tipografia consistente
- **Animações cinematográficas** — Framer Motion com spring physics, parallax multicamada
- **Qualidade industrial** — 222 testes, CI/CD, CSP, acessibilidade, SEO
- **5 mini-games embutidos** — React no navegador, zero dependência externa

---

## Stack

| Área | Tecnologias |
|------|------------|
| **Core** | Next.js 16 · React 19 · TypeScript (strict) |
| **Estilo** | Tailwind CSS 4 · Glassmorphism · CSS custom properties |
| **Animações** | Framer Motion (layout animations, spring, gesture) |
| **Ícones** | Lucide React |
| **Testes** | Vitest · React Testing Library · Playwright |
| **Analytics** | Umami (self-hosted) |
| **Infra** | GitHub Actions · systemd (self-host) · Vercel |

---

## Seções

| Seção | O que faz |
|-------|-----------|
| **Hero** | TypeWriter com múltiplos títulos, parallax layers, cockpit SVG animado |
| **Profile** | Timeline de carreira interativa (clique pra expandir), grid de skills com barra de nível, HUD panels |
| **Projetos** | Grid com filtros por categoria, dados ao vivo do GitHub + fallback estático, GitHub Stats |
| **Jogos** | Carrossel com 5 jogos clássicos rodando em iframe — Memory Matrix, Simon, Code Typing, Terminal, Asteroid Dodge |
| **Contato** | Formulário com validação, rate-limit de 30s, consentimento LGPD, integração Resend |

---

## Testes

```
pnpm test:run       222 testes · 36 arquivos · 🟢 tudo passando
pnpm test:e2e       Smoke tests E2E com Playwright
```

Cobertura inclui todos os componentes, hooks, libs e páginas — cada PR é verificado no CI.

---

## Início Rápido

```bash
git clone https://github.com/Samuelfmedeiros/Portifolio.git
cd Portifolio
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Build produção

```bash
pnpm build
pnpm start          # http://localhost:3000
```

---

## Estrutura

```
src/
├── app/
│   ├── api/
│   │   ├── contact-notify/    # → POST: formulário de contato via Resend
│   │   ├── download-cv/       # → POST: download de currículo com consentimento
│   │   └── game/[slug]/       # → GET: proxy dos mini-games estáticos
│   ├── layout.tsx             # Root layout · metadata · SEO · analytics
│   ├── page.tsx               # Landing page com todas as seções
│   ├── privacidade/           # Política de privacidade (LGPD)
│   └── termos/                # Termos de uso
├── components/
│   ├── HeroSection.tsx        # Apresentação + parallax + cockpit
│   ├── ProfileSection.tsx     # Timeline + Skills grid + experiência
│   ├── ProjectHangar.tsx      # Grid de projetos com filtro
│   ├── GameShowcase.tsx       # Carrossel horizontal de jogos
│   ├── ContactForm.tsx        # Formulário com validação + LGPD
│   ├── Navbar.tsx             # Navegação responsiva (sem hamburger)
│   ├── Terminal.tsx           # Terminal interativo com 15+ comandos
│   ├── MiniGames/             # Código dos jogos (React + hooks)
│   ├── monetization/          # Stripe, BuyMeACoffee, GitHub Sponsors
│   └── *.tsx                  # Componentes auxiliares (Footer, DownloadModal, etc.)
├── hooks/
│   ├── useAnalytics.ts        # Tracking Umami tipado
│   └── useLocalStorage.ts     # Persistência local com SSR safety
├── lib/
│   ├── github.ts              # Cliente GitHub API com cache
│   ├── supabase.ts            # Cliente Supabase (fallback incluso)
│   ├── staticProjects.ts      # Projetos estáticos fallback
│   └── types.ts               # Tipos compartilhados
└── test/
    └── setup.tsx              # Setup Vitest + mocks
```

---

## Jogos Embutidos

Todos os jogos são HTML/CSS/JS puro (React via CDN) servidos como arquivos estáticos e embutidos via iframe. Código fonte aberto nos repositórios abaixo.

| Jogo | Repositório | Descrição |
|------|-------------|-----------|
| 🧠 Memory Matrix | [github](https://github.com/Samuelfmedeiros/memory-matrix) | Memorize células em grid progressivo 3×3 → 5×5 |
| 🎨 Simon Game | [github](https://github.com/Samuelfmedeiros/simon-game) | Sequência clássica de cores |
| ⌨️ Code Typing | [github](https://github.com/Samuelfmedeiros/code-typing) | Digite snippets de código o mais rápido possível |
| 💻 Terminal | [github](https://github.com/Samuelfmedeiros/terminal) | Shell interativo com 15+ comandos e easter eggs |
| 🚀 Asteroid Dodge | [github](https://github.com/Samuelfmedeiros/asteroid-dodge) | Desvie de asteroides com o mouse |

---

## Variáveis de Ambiente

Todas opcionais — o projeto tem fallback hardcoded incluso.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Licença

MIT © [Samuel Medeiros](https://github.com/Samuelfmedeiros)

<p align="center">
  <sub>Feito com ☕, 🎮 e muito cyan · Brasília/DF · 2026</sub>
</p>
