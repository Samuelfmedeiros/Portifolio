# 🛰️ Mission Control — Portfólio Futurista

> Portfólio pessoal com vibe de cockpit de nave espacial — telemetria em tempo real, mini-games e terminal interativo.

**🌐 Live:** [samuelmedeiros.vercel.app](https://samuelmedeiros.vercel.app/)

---

## 🚀 Features

- **Cockpit Background** — 6 camadas visuais (parallax, grid, estrelas, scanlines, speed lines, HUD)
- **HUD Overlay** — Telemetria em tempo real (altitude, velocidade, coordenadas, sistemas)
- **Terminal Interativo** — 15+ comandos com easter eggs e sanitização de inputs
- **Mission Games** — 4 mini-games (Sequência, Asteroid Dodge, Code Typing, Memory Matrix)
- **Project Hangar** — Grid de projetos do GitHub com filtros, tech tags e holo-card effects
- **Dark/Light Theme** — "Night Vision" e "Daylight Ops" com transição suave
- **Responsive** — Menu horizontal scrollable no mobile, zero hamburger
- **Acessibilidade** — Focus-visible, reduced-motion, aria labels, skip links, print styles
- **Security** — CSP, HSTS, X-Frame-Options, XSS protection, input sanitization
- **CI/CD** — GitHub Actions + Vercel deploy automático

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS 4, Glassmorphism |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Backend | Supabase (PostgreSQL) |
| Testes Unit | Vitest + Testing Library |
| Testes E2E | Playwright |
| Deploy | Vercel |
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
│   │   ├── layout.tsx          # Root layout + metadata
│   │   └── page.tsx            # Landing page com todas as seções
│   ├── components/
│   │   ├── CockpitBackground.tsx  # Compositor das 6 camadas visuais
│   │   ├── HUDOverlay.tsx         # Telemetria em tempo real
│   │   ├── Navbar.tsx             # Menu integrado (sem hambúrguer)
│   │   ├── Terminal.tsx           # Terminal interativo
│   │   ├── ProjectHangar.tsx      # Grid de projetos
│   │   ├── MiniGame.tsx           # Jogo de sequência (Simon)
│   │   ├── MiniGames/
│   │   │   ├── MissionGames.tsx   # Tab bar dos jogos
│   │   │   ├── AsteroidDodge.tsx  # Desvie de asteroides
│   │   │   ├── CodeTyping.tsx     # Digitação rápida hacker
│   │   │   └── MemoryMatrix.tsx   # Jogo de memória
│   │   ├── HeroSection.tsx        # Hero com parallax
│   │   ├── AboutTimeline.tsx      # Timeline de carreira
│   │   ├── SkillsGrid.tsx         # Grid de habilidades
│   │   ├── ContactForm.tsx        # Formulário de contato
│   │   └── ...                    # +20 componentes
│   ├── hooks/
│   │   └── useLocalStorage.ts     # Hook de localStorage
│   ├── lib/
│   │   ├── github.ts              # GitHub API client
│   │   ├── supabase.ts            # Supabase client
│   │   ├── staticProjects.ts      # Projetos estáticos
│   │   └── types.ts               # TypeScript types
│   └── test/
│       └── setup.tsx              # Vitest setup + mocks
├── tests/                         # Playwright e2e tests
├── next.config.ts                 # Config + security headers
├── vitest.config.ts               # Vitest configuration
└── playwright.config.ts           # Playwright configuration
```

---

## 🧪 Testes

```bash
# Testes unitários
pnpm test:run

# Testes E2E
pnpm test:e2e
```

---

## 🔒 Segurança

- **Content Security Policy** — Restringe fontes de scripts, estilos e imagens
- **HSTS** — Força HTTPS com preload
- **X-Frame-Options: DENY** — Previne clickjacking
- **Input Sanitization** — Terminal sanitiza todos os inputs (anti-XSS)
- **noopener noreferrer** — Todos os links externos com proteção
- **Supabase RLS** — Row Level Policies para proteção de dados

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
| `theme` | Alterna dark/light |
| `matrix` | Easter egg |
| `sudo rm -rf /` | 🙃 |

---

## 🚀 Deploy

### Vercel (Produção)
Deploy automático em push para `master`.

### GitHub Pages (Static)
```bash
NEXT_PUBLIC_STATIC_EXPORT=true pnpm build
```

---

## 👤 Autor

**Samuel Medeiros** — Desenvolvedor Full Stack & Analista de Dados
- 📧 samuelandrademedeiros@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/samuelandrademedeiros)
- 🐙 [GitHub](https://github.com/Samuelfmedeiros)

---

## 📄 Licença

MIT
