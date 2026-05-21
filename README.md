# 🛰️ Mission Control — Portfólio Futurista

> Portfólio pessoal com vibe de cockpit de nave espacial — telemetria em tempo real, mini-games e terminal interativo.

**🌐 Live:** [samuelmedeiros.vercel.app](https://samuelmedeiros.vercel.app/)

---

## 🚀 Features

- **Splash Screen** — Tela de boot estilo sistema operacional com nome "Samuel Medeiros"
- **Cockpit Background** — 7 camadas visuais (StarField, PerspectiveGrid, Parallax, Scanline, SpeedLines, HUD, CockpitBorders)
- **HUD Overlay** — Telemetria em tempo real (altitude, velocidade, coordenadas, sistemas)
- **Terminal Interativo** — 15+ comandos com easter eggs e sanitização de inputs
- **Mission Games** — 4 mini-games (Simon Sequence, Asteroid Dodge, Code Typing, Memory Matrix)
- **Project Hangar** — Grid de projetos do GitHub com filtros, tech tags e holo-card effects
- **DogWalk Blueprint** — Showcase do projeto PataPass/DogWalk
- **Core Engine** — Métricas e estatísticas do desenvolvedor
- **Skills Grid** — Grid de habilidades com ícones animados
- **About Timeline** — Timeline de carreira
- **Contact Form** — Formulário com validação, contador de caracteres e integração Supabase
- **Dark/Light Theme** — "Night Vision" e "Daylight Ops" com transição suave
- **Keyboard Shortcuts** — Atalhos de teclado (`?` help, `t` theme, `j/k` navegação)
- **Responsive** — Menu horizontal scrollable no mobile, zero hamburger
- **Acessibilidade** — Focus-visible, reduced-motion, aria labels, skip links, print styles
- **SEO** — JSON-LD structured data, Open Graph, Twitter Cards
- **Analytics** — Rastreamento de eventos via Supabase
- **Error Boundary** — Graceful fallback para erros de renderização
- **Security** — CSP, HSTS, X-Frame-Options, XSS protection, input sanitization
- **CI/CD** — GitHub Actions (Build + Lint + Test + E2E) + Vercel deploy automático

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS 4, Glassmorphism |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Backend | Supabase (PostgreSQL) |
| Testes Unit | Vitest + Testing Library (47 arquivos de teste) |
| Testes E2E | Playwright (smoke tests contra produção) |
| Deploy | Vercel (produção) + GitHub Pages (static fallback) |
| CI/CD | GitHub Actions |

---

## 📦 Instalação

### Pré-requisitos

- Node.js 20+
- pnpm 9+

```bash
# Clonar repositório
git clone https://github.com/Samuelfmedeiros/mission-control.git
cd mission-control

# Instalar dependências
pnpm install

# Variáveis de ambiente (crie .env.local)
cp .env.example .env.local

# Rodar dev server
pnpm dev

# Build production
pnpm build
```

---

## 🔑 Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STATIC_EXPORT=false
```

---

## 📁 Estrutura do Projeto

```
mission-control/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + metadata + SEO
│   │   └── page.tsx                # Landing page com todas as seções
│   ├── components/
│   │   ├── SplashScreen.tsx        # Tela de boot do sistema
│   │   ├── CockpitBackground.tsx   # Compositor das 7 camadas visuais
│   │   ├── StarField.tsx           # Estrelas com parallax
│   │   ├── PerspectiveGrid.tsx     # Grid em perspectiva 3D
│   │   ├── ParallaxBackground.tsx  # Camada de parallax
│   │   ├── Scanline.tsx            # Efeito CRT scanline
│   │   ├── SpeedLines.tsx          # Linhas de velocidade
│   │   ├── CockpitBorders.tsx      # Bordas do cockpit
│   │   ├── HUDOverlay.tsx          # Telemetria em tempo real
│   │   ├── Navbar.tsx              # Menu integrado (sem hambúrguer)
│   │   ├── HeroSection.tsx         # Hero com parallax
│   │   ├── Terminal.tsx            # Terminal interativo
│   │   ├── MissionGames.tsx        # Tab bar dos jogos
│   │   ├── MiniGame.tsx            # Jogo de sequência (Simon)
│   │   ├── MiniGames/
│   │   │   ├── AsteroidDodge.tsx   # Desvie de asteroides
│   │   │   ├── CodeTyping.tsx      # Digitação rápida hacker
│   │   │   └── MemoryMatrix.tsx    # Jogo de memória
│   │   ├── ProjectHangar.tsx       # Grid de projetos
│   │   ├── DogWalkBlueprint.tsx    # Showcase PataPass
│   │   ├── CoreEngine.tsx          # Métricas do dev
│   │   ├── SkillsGrid.tsx          # Grid de habilidades
│   │   ├── AboutTimeline.tsx       # Timeline de carreira
│   │   ├── ContactForm.tsx         # Formulário de contato
│   │   ├── UtilityDeck.tsx         # Widgets utilitários
│   │   ├── MissionClock.tsx        # Relógio mission
│   │   ├── DataCalculator.tsx      # Calculadora de dados
│   │   ├── Footer.tsx              # Footer com copyright
│   │   ├── GlassCard.tsx           # Card glassmorphism
│   │   ├── Tooltip.tsx             # Tooltip component
│   │   ├── ScrollProgress.tsx      # Barra de progresso scroll
│   │   ├── BackToTop.tsx           # Botão voltar ao topo
│   │   ├── ThemeToggle.tsx         # Toggle dark/light
│   │   ├── ThemeProvider.tsx       # Context de tema
│   │   ├── KeyboardShortcuts.tsx   # Atalhos de teclado
│   │   ├── AnalyticsTracker.tsx    # Rastreamento de eventos
│   │   ├── JsonLd.tsx              # Structured data SEO
│   │   ├── ErrorBoundary.tsx       # Error boundary React
│   │   ├── FadeInSection.tsx       # Fade-in on scroll
│   │   ├── ResponsiveSection.tsx   # Wrapper responsivo
│   │   ├── Skeleton.tsx            # Skeleton loading
│   │   ├── HangarSkeleton.tsx      # Skeleton do ProjectHangar
│   │   ├── LoadingSpinner.tsx      # Spinner animado
│   │   ├── SkipLink.tsx            # Skip navigation link
│   │   └── AppWrapper.tsx          # Wrapper principal
│   ├── hooks/
│   │   └── useLocalStorage.ts      # Hook de localStorage
│   ├── lib/
│   │   ├── github.ts               # GitHub API client
│   │   ├── supabase.ts             # Supabase client
│   │   ├── staticProjects.ts       # Projetos estáticos fallback
│   │   └── types.ts                # TypeScript types
│   └── test/
│       └── setup.tsx               # Vitest setup + mocks
├── tests/
│   └── smoke.spec.ts               # E2E smoke tests (Playwright)
├── .github/workflows/
│   ├── ci.yml                      # CI: Build + Lint + Test + E2E
│   └── pages.yml                   # Deploy GitHub Pages
├── next.config.ts                  # Next.js config
├── vitest.config.ts                # Vitest configuration
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

---

## 🧪 Testes

```bash
# Testes unitários (47 arquivos)
pnpm test:run

# Testes E2E (smoke tests contra produção)
pnpm test:e2e
```

### Cobertura

- **47 arquivos de teste unitário** — todos os 45 componentes + hooks + libs
- **1 arquivo E2E** — smoke tests contra `samuelmedeiros.vercel.app`
- CI executa ambos em cada push para `master`

---

## 🔒 Segurança

- **Content Security Policy** — Restringe fontes de scripts, estilos e imagens
- **HSTS** — Força HTTPS com preload
- **X-Frame-Options: DENY** — Previne clickjacking
- **Input Sanitization** — Terminal sanitiza todos os inputs (anti-XSS)
- **noopener noreferrer** — Todos os links externos com proteção
- **Supabase RLS** — Row Level Policies para proteção de dados
- **Error Boundary** — Graceful fallback para erros de renderização

---

## 🎮 Comandos do Terminal

| Comando | Descrição |
|---------|-----------|
| `ajuda` | Lista de comandos |
| `sobre` | Sobre Samuel |
| `projetos` | Lista de projetos |
| `habilidades` | Tech skills |
| `contato` | Informações de contato |
| `stack` | Tech stack do projeto |
| `neofetch` | System info estilizado |
| `date` | Data e hora atual |
| `uptime` | Tempo de atividade |
| `github` | Info do GitHub |
| `theme` | Alterna dark/light |
| `matrix` | Easter egg |
| `sudo rm -rf /` | 🙃 |

---

## 🚀 Deploy

### Vercel (Produção — Primário)
Deploy automático em push para `master`.
URL: `https://samuelmedeiros.vercel.app/`

### GitHub Pages (Static — Fallback)
```bash
NEXT_PUBLIC_STATIC_EXPORT=true pnpm build
```

### CI/CD
- **ci.yml**: Build → Lint → Type Check → Test → E2E (smoke tests)
- **pages.yml**: Static export + deploy para GitHub Pages
- Ambos rodam em cada push para `master`

---

## 👤 Autor

**Samuel Medeiros** — Desenvolvedor Full Stack & Analista de Dados
- 📧 samuelandrademedeiros@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/samuelandrademedeiros)
- 🐙 [GitHub](https://github.com/Samuelfmedeiros)

---

## 📄 Licença

MIT
