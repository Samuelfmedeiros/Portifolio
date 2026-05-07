Portfolio

[![CI](https://github.com/Samuelfmedeiros/mission-control/actions/workflows/ci.yml/badge.svg)](https://github.com/Samuelfmedeiros/mission-control/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/tests-49%20passed-brightgreen)](https://github.com/Samuelfmedeiros/mission-control)

Portal interativo de demonstração técnica, desenvolvido com estética de interface de comando espacial (Mission Control). Centraliza projetos de análise de dados, automação e engenharia de software em um ambiente imersivo.

## 🚀 Tecnologias

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Estilização:** Tailwind CSS 4 (Temas Dark/Light)
- **Animações:** Framer Motion (Parallax, HUD, Spring)
- **Ícones:** Lucide React
- **Backend:** Supabase (mensagens + analytics)
- **Testes:** Vitest + Testing Library (49 testes)
- **CI/CD:** GitHub Actions

## 🛠️ Módulos

| Módulo | Descrição |
|--------|-----------|
| **Hero HUD** | Telemetria de scroll, indicadores de sistema, animações |
| **Core Engine** | Especificações de hardware e stack (CPU, GPU, RAM, ferramentas) |
| **Skills Matrix** | Grade de competências técnicas com ícones e categorias |
| **Hangar de Projetos** | Cards dinâmicos via API do GitHub com ISR caching (1h) |
| **Terminal Central** | CLI interativa com histórico (↑↓), autocomplete (Tab), neofetch e matrix |
| **Utility Deck** | Relógio de missão, calculadora de dados, mini-game |
| **Transmissão** | Formulário de contato → Supabase com rate limiting |

## 🎨 Temas

- **Night Vision** — Dark mode: preto puro `#000` + ciano neon `#22d3ee`
- **Daylight Ops** — Light mode: cinza NASA `#f8fafc` + azul marinho

## ♿ Acessibilidade

- **SkipLink:** Link "Pular para conteúdo" visível ao focar (teclado)
- **Aria-labels:** Navegação com identificadores descritivos
- **Semântica:** HTML5 semântico com `main#main-content`, seções e roles

## 🔍 SEO & Performance

- **Metadata:** OpenGraph, robots, sitemap.xml, JsonLd (Schema.org Person)
- **ISR:** Dados do GitHub cacheados por 1 hora (`revalidate: 3600`)
- **Code Splitting:** Lazy loading com `next/dynamic` + skeletons
- **Error Boundary:** Fallback estilizado para erros de renderização
- **404 Customizada:** Página temática "SINAL PERDIDO"

## 📋 Setup

```bash
git clone https://github.com/Samuelfmedeiros/mission-control.git
cd mission-control
pnpm install
pnpm dev
```

### Variáveis de ambiente (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://oswchwwmamjaxcvisfie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_95sn-ZwxmwW7x0IBN9O9eg_rn1TJOQZ
```

## 🧪 Testes

```bash
pnpm test          # watch mode
pnpm test:run      # single run
```

Cobertura: 9 arquivos, **49 testes** — GlassCard, ThemeProvider, Terminal, MiniGame, DataCalculator, CoreEngine, HeroSection, Footer, SkillsGrid.

## 📡 Deploy

Configurado para Vercel via GitHub Actions. Ao fazer push na `master`, o CI executa:

```
lint → type-check → tests → build
```

---

**Samuel Andrade** — Analista de Dados & Produto  
BI · SQL · Python · Machine Learning · Next.js
