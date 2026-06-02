# 🛰️ Mission Control | Samuel Andrade Portfolio

[![CI](https://github.com/Samuelfmedeiros/mission-control/actions/workflows/ci.yml/badge.svg)](https://github.com/Samuelfmedeiros/mission-control/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/tests-29%20passed-brightgreen)](https://github.com/Samuelfmedeiros/mission-control)

Portal interativo de demonstração técnica, desenvolvido com estética de interface de comando espacial (Mission Control). Centraliza projetos de análise de dados, automação e engenharia de software em um ambiente imersivo.

## 🚀 Tecnologias

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Estilização:** Tailwind CSS 4 (Temas Dark/Light)
- **Animações:** Framer Motion (Parallax, HUD, Spring)
- **Ícones:** Lucide React
- **Backend:** Supabase (mensagens + analytics)
- **Testes:** Vitest + Testing Library (29 testes)
- **CI/CD:** GitHub Actions

## 🛠️ Módulos

| Módulo | Descrição |
|--------|-----------|
| **Hero HUD** | Telemetria de scroll, indicadores de sistema, animações |
| **Hangar de Projetos** | Cards dinâmicos via API do GitHub |
| **Terminal Central** | CLI interativa (`help`, `whoami`, `ls projects`, `skills`) |
| **Utility Deck** | Relógio de missão, calculadora, mini-game |
| **Transmissão** | Formulário de contato → Supabase |

## 🎨 Temas

- **Night Vision** — Dark mode: preto puro `#000` + ciano neon `#22d3ee`
- **Daylight Ops** — Light mode: cinza NASA `#f8fafc` + azul marinho

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

Cobertura: 5 arquivos, 29 testes — GlassCard, ThemeProvider, Terminal, MiniGame, DataCalculator.

## 📡 Deploy

Configurado para Vercel via GitHub Actions. Ao fazer push na `master`, o CI executa lint → type-check → tests → build.

---

**Samuel Andrade** — Analista de Dados & Produto  
BI · SQL · Python · Machine Learning · Next.js
