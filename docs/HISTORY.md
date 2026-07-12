# 🛸 Portifolio Samuel — História do Projeto

> **De um conceito de interface sci-fi a um portfólio profissional com 222 testes, 5 jogos e i18n completo.**

---

## Gênese: O Painel de Controle (Maio 2026)

O Portifolio Samuel nasceu da insatisfação com portfólios tradicionais — "currículos bonitinhos" que não demonstram capacidade técnica real.

A ideia original era um **painel de controle de nave espacial**: cada seção como um módulo independente, animações cinematográficas, tema ciano+preto. O usuário não só vê o portfólio — ele **pilota** a experiência.

**Primeiro nome:** "Mission Control" (MC). Interface com grid + cockpit SVG + HUD panels + partículas.

---

## Sprint 1-2: Fundação Visual (Maio 2026)

Construção da base:
- Next.js 14 + App Router + Tailwind
- HeroSection com TypeWriter + parallax layers
- Cockpit SVG animado como entrada cinematográfica
- Tema escuro ciano+preto com glassmorphism

**Documento de design:** ADR-001 ~~Treasure Planet~~ (arquivado), ADR-002 (Splash boot sequence)

---

## Sprint 3-4: Conteúdo + Jogos (Maio/Junho 2026)

Expansão das seções:
- ProfileSection com timeline de carreira + Skills grid
- ProjectHangar com filtros + dados ao vivo do GitHub
- **GameShowcase**: 5 jogos embutidos via iframe (Memory Matrix, Simon, Code Typing, Terminal, Asteroid Dodge)
- Formulário de contato com validação + LGPD

**Marco:** 174 commits em Maio — o pico de desenvolvimento.

---

## Pivô: MC → Portifolio Samuel (14/Junho/2026)

**Mudanças principais:**
- Renomeado de "Mission Control" para "Portifolio Samuel"
- SplashScreen removido — parallax layers viram a entrada direta
- Umami Analytics instalado
- Produção self-host na porta 3001 (systemd `portifolio.service`)
- Staging em capivara.seu.pet (porta 3000, `portifolio-staging.service`)

---

## Sprint 5-6: Maturidade (Junho 2026)

Qualidade industrial:
- **222 testes** (Vitest + RTL) — todos os componentes, hooks e libs cobertos
- **CI/CD** — GitHub Actions (lint → test → build)
- **CSP** rigorosa sincronizada entre next.config.js e vercel.json
- **i18n PT/EN** completo — todos os componentes bilingual
- **Acessibilidade** — axe-core, aria labels, focus management
- **SEO** — sitemap, robots, opengraph, metadata
- **Segurança** — Gitleaks, Dependabot, SECURITY.md, .gitignore limpo

---

## Monetização + Expansão (Junho/Julho 2026)

Adição de recursos de apoio:
- **Stripe** — botão "Apoiar" com checkout
- **Mercado Pago** — consultoria técnica via Pix/Checkout
- **Dual gateway** — usuário escolhe como apoiar
- Eventos Umami para todos os CTAs

---

## Onde Estamos Hoje (Julho 2026)

### ✅ O Que Funciona
- Portfólio completo com 5 seções + 5 jogos
- 222 testes passando, 0 erros lint
- i18n PT/EN, analytics, segurança
- Deploy Vercel + self-host redundante
- Stripe + Mercado Pago integrados

### ❌ O Que Falta
- Deploy automático Vercel via CI (manual hoje)
- E2E Playwright no pipeline
- Toggle persistente de tema escuro
- Schema.org + SEO avançado

---

## 📈 Métricas de Evolução

| Métrica | Início (Maio) | Hoje (Julho) |
|---------|:-------------:|:------------:|
| Testes | 0 | 222 |
| Seções | 2 | 7 (Hero, Profile, Skills, Projetos, Jogos, Contato, Footer) |
| Jogos | 0 | 5 |
| Commits | 0 | 300+ |
| Deploy | Dev only | Vercel + self-host (redundante) |
| i18n | PT-only | PT/EN completo |
| Analytics | ❌ | Umami (eventos + pageviews) |

---

> *Histórico vivo — atualizado em Julho de 2026.*

## 2026-07-03 21:04
| Evento | Detalhe |
|--------|---------|
| Versão | version": "0.1.0 |
| Commit | `8368142` |
| Nova versão: version": "0.1.0 (tag anterior: v0.1.0) | |

## 2026-07-03 21:12
| Evento | Detalhe |
|--------|---------|
| Versão | version": "0.1.0 |
| Commit | `51be524` |
| Nova versão: version": "0.1.0 (tag anterior: v0.1.0) | |

## 2026-07-05 04:02
| Evento | Detalhe |
|--------|---------|
| Versão | version": "0.1.0 |
| Commit | `0c0300d` |
| Nova versão: version": "0.1.0 (tag anterior: v0.1.0) | |

## 2026-07-12 15:08
| Evento | Detalhe |
|--------|---------|
| Versão | version": "0.1.0 |
| Commit | `6eb98ae` |
| Nova feature detectada: feat: recria capas portifolio e lifelog no estilo collage | |
| Nova versão: version": "0.1.0 (tag anterior: v0.1.0) | |
