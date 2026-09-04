# 🛸 Portifolio Samuel — Session State

## 🎯 Identidade
Portfólio profissional sci-fi · Next.js 16 + React 19 + Tailwind 4 · Painel de controle interativo com animações cinematográficas e 5 mini-games

## 🔴 TEST-LOOP OBRIGATÓRIO ANTES DE QUALQUER ENTREGA (18/08 + v2 25/08/2026 — Samuel, GLOBAL)

Regra permanente em TODOS os projetos. Antes de declarar pronta/fazer deploy de QUALQUER
entrega (código, UI, pipeline, feature, fix), rodar SEMPRE o loop de testes com IA
(skill `ai-test-loop`):

1. **Builder = opencode CLI** (corrige gaps; NUNCA avalia o próprio trabalho — v2 25/08)
2. **Testes reais** — unit + e2e + VRT do projeto (build, vitest, playwright, lint)
3. **Critic determinístico separado** — nota 0-100 com evidência real, contexto fresco
4. **Reviewer opencode** — CONCORDO|DISCORDO (DISCORDO = reabrir loop) + nota revisor no PDF
5. **Evidência visual** — screenshots DESKTOP + MOBILE (Playwright/VLM), obrigatória para mudanças de visual
6. **Vídeo de aprovação** = entregue ao FINAL (mensagem única no grupo), nunca no meio
7. **Gate:** nota >= threshold (UI=100, código=85); nota < threshold → reavaliar e corrigir (máx 8 rodadas)
8. **PDF relatório** SEMPRE anexado via MEDIA:<caminho> (ou sendDocument + message_id confirmado)

**ADICIONAR TESTES DE COMPLEMENTO** — se dá pra cobrir área nova/regressão antes de entregar, cobrir.

Sem evidência real (testes + screenshot + nota + PDF entregue) NÃO é entrega completa.

## 📍 Estado Atual
- **Branch:** `master`
- **Último commit:** `8339399` — fix(resume-tailor): anti-422 (normalizeStr + sanitizeResumeHard) — **03/09**
- **Status:** ✅ Funcional — Vercel · sessão 03/09: Resume Tailor v4 integrado (ver `### Sessão 03/09`)
- **Testes:** 269/269 passando (validado 30/08 12:47 WSL pnpm test:run)
- **Lint:** 0 errors, 0 warnings
- **i18n EN em produção (30/08):** Hero, Contato, ConsultingButton, MissionClock (dict), Termos/Privacidade ✅ E2E real
- **CDN imagens:** same-origin (Vercel) — img.seu.pet removido do CSP (dead code)

### Sessão 03/09 — Resume Tailor v4 (modal + PDF + anti-422)
- **feat**: modal V4 integrado ao Footer — botão, wiring, dicionário i18n, testes (`4950b5c`)
- **fix**: PDF layout + tailoring da vaga + placeholder (`409f3ff`); anti-422 — normalizeStr (travessões/URL) + sanitizeResumeHard no merge de CV (`8339399`)
- **fix(build)**: brandColors.ts + jspdf ausentes no estado commitado (corrige preview Vercel `cd87600`) (`07821c5`)
- **perf**: corrida paralela entre modelos free + timeout 20s/chamada — latência 28s->18s (`3c1572a`)
- 8 commits no dia · push bare+origin OK · HEAD: `8339399`

### Sessão 30/08 — i18n audit + bug-hunter v3 (Fase 1) + UI nome/imagens
- Nome do card: `text-base md:text-lg` + `font-bold` + `var(--accent)` (aprovado Samuel, commit `98dd619`)
- Imagens: revert CDN `img.seu.pet` → same-origin (causava cards vazios no navegador real por bloqueio de rastreamento)
- **`scripts/i18n-audit.mjs` (NOVO):** scanner estático de strings hardcoded (98 arquivos, 3 categorias: hardcoded-jsx, raw-description, attr-aria-label). Relatório em `docs/agents/qualidade/bug-hunter/findings/i18n-audit-*.json`. Uso: `node scripts/i18n-audit.mjs`
- **`scripts/bug-hunter.mjs` ampliado:** escuta `pageerror` (hydration #418), `requestfailed`, e check de `brokenImages` (naturalWidth=0)
- i18n localizados (PT/EN): ContactForm, LazyContactForm, BuyMeACoffee, ErrorBoundary (`ErrorBoundaryWithI18n` wrapper), termos/privacidade h1, ConsultingButton, StripeConsulting, MpConsultingButton, MissionClock
- **Intencional PT-only (NÃO localizar):** MiniGames, API routes (emails), AdSense "Anúncio" (label anúncio obrigatório), `item.description` de dados (ProfileSection/GameShowcase)
- **URL:** https://samuelmedeiros.vercel.app


## Sessão 2026-08-28 — Capas PIL dos projetos

- **feat(projects)**: capas PIL 1280×720 para DogWalk/Arachne/Portifólio/LifeLog — gradientes + padrões geométricos (círculos/hex/grade) + glows (`ec33a5e` na master)
- **fix**: DogWalk usava `seu.pet.gif` quebrado (800×600) → `seu.pet.webp` (1280×720); GIF removido

## Sessão 2026-08-29 — Capas AI padrão LifeLog (APROVADAS por Samuel)

- **feat(projects)**: capas AI no **padrão LifeLog** (Worker Cloudflare FLUX.1 Schnell) para Arachne/Portifólio/LifeLog — aprovadas visualmente por Samuel em 29/08, commit `d151456` na master
  - **Arachne** `arachne.webp` — teias vermelhas neon (nova marca `#ff3b3b`; NUNCA roxo)
  - **Portifólio** `portifolio.webp` — holograma neon (opção B: interface holográfica azul/roxa flutuante, sem texto)
  - **LifeLog** `lifelog.webp` — livro azul (não rosa/magenta)
  - **Dogwalk** NÃO tem capa AI — card usa GIF scroll real (`seu-pet-scroll.mp4`)
- **Workflow**: prompts na skill `portfolio-covers-ai` (estrutura `Digital artwork. <tema>. Wide cinematic shot. Mood. Color palette. No text/watermark`) → Worker FLUX (JPEG 1024x1024) → crop centro 16:9 → resize 1280x720 → WebP q90 → preview PNG no Telegram → aprovação Samuel → commit cirúrgico + push → validar 200 no ar
- **Fórmula reutilizável**: skill `portfolio-covers-ai` (categoria frontend) — usar ao regenerar capas
- Iterações rejeitadas por Samuel: v3 clara (Péssimo), v4/v5 dark, v6 NIM, página com textos, wireframe, site flutuante claro, laptop — o que ele quer é cena CONCRETA/holograma

## Sessão 2026-08-25 (fim de dia) — View Transition circular restaurada
- **feat(theme)**: restaura View Transition circular no toggle de tema + botoes icon-only (`91dd9c5`)
- **fix(theme)**: flushSync no startViewTransition + origem do circulo no clique (`58ba720`)
- 2 commits no dia · push bare+origin OK · HEAD: `58ba720`
- ⚠️ **Pendência**: working tree sujo — AGENTS.md/HISTORY.md, playwright-report, snapshots PNG, findings bug-hunter 17-25/08, scripts prod-*.mjs (31 arquivos) — commitados no fim de dia

## Sessão 2026-08-14 (manhã) — Merge dos 3 PRs dependabot + README dual-língua
- **chore(deps)**: merge dos 3 PRs dependabot (rebase local + force-push + squash via API):
  - `#41` framer-motion `^12.43.0 → ^13.0.0` (`0d6e4c7`) — breaking só no peer opcional @emotion/is-prop-valid (não usado); MotionConfig reducedMotion continua igual
  - `#42` eslint-config-next `16.2.10 → 16.3.0` (`8e43663`)
  - `#43` netlify-cli `26.2.0 → 27.1.1` (`148feb7`)
  - Rebase necessário: branches estavam na base de 10-11/08, master evoluiu (lazy-hydration, a11y, snapshots) → E2E falhava por branch desatualizado, não por bug
  - CI nos 3 rebased: 8/8 success · HEAD pós-merge: 7/7 success
- **docs**: README dual-língua EN+PT-BR + testes 219→268 (`b358868`); snapshots CI (`1d7ae05`); feat #31 Games última seção/Blog navbar/touch targets (`9d1dea90`); emojis→SVGs ProjectIcon/GameIcon (`5887a75b`)
- HEAD: `148feb7` · deploy Vercel automático validado

## Sessão 2026-08-13 (fim de dia) — CI notificação Telegram com subject + docs semanais
- **chore**: CI notificação Telegram agora manda subject + arquivos alterados (`b375ccb`)
- **docs**: auto-update semanal (`d8b22ad`) · versiona findings bug-hunter 12-13/08 (`aea6d7e`) · estado atual HEAD 12/08 (`72ff9f0`)
- 4 commits no dia · push bare+origin OK · HEAD: `b375ccb`
- ⚠️ **Pendência**: working tree com refactor emojis→SVGs (`ProjectIcon.tsx`/`GameIcon.tsx` novos, ~200 linhas reais) + diff CRLF em 30 arquivos — NÃO commitado no fim de dia (aguarda revisão)

## Sessão 2026-08-12 — Perf lazy-hydration + a11y contraste AA + snapshots CI
- **perf**: lazy-hydration abaixo do fold (GameShowcase + ContactForm) via next/dynamic ssr:false + IntersectionObserver — reduz TBT/bootup sem CLS (`427413e`)
- **fix(a11y)**: contraste AA round 2 — botão WhatsApp light #128c7e→#0f766e (4.13→5.47), blog accent RSS via color-mix + yellow-800 badge via var(--accent) (`2b0985b`, `598f083`, `09836aa`)
- **test(e2e)**: snapshots visuais gerados no ambiente do CI + scroll progressivo/hidratação lazy antes do snapshot (`2ec0cef`, `d28e1e0`, `cadc2dc`)
- 15 commits no dia · push bare+origin OK · HEAD: `2ec0cef`

## Sessão 2026-08-11 — CV ATS 98.8/100 + hydration fix #418 + vulns 61→2 + baselines visuais

### 🚀 Features
- **feat(cv)**: CVs ATS-friendly PT/EN — corrige cópia EN=PT literal, fontes de verdade md + gerador/validador; ats-score (nota 96/100) (`118bd26`, `100b5d6`, `a01c22d`)
- **feat(cv+site)**: links Site/GitHub + 5 keywords reais (98.8/100), alinha profileData com CV (Supabase→PG/Stripe/Pages, Hitss Azure/M365, TRT 2017-2020, pós Ciência de Dados e Big Data Analytics), metadata stack real (`896f629`)

### 🔧 Fixes
- **fix(react)**: hydration #418 — LanguageProvider inicia com pt determinístico, locale real detectado pós-mount (`a94ca22`)
- **fix(tracking)**: carrega Umami no boot quando consentimento já foi aceito (LGPD) (`6f59c6d`)
- **fix(security)**: reduz vulns 61→2 via overrides pnpm (ajv, smol-toml, once, esbuild) (`327d326`)

### 🧪 Testes
- **test(e2e)**: atualiza baselines visuais (home/projetos/games/contato) — desatualizados após hydration fix (`20193c7`)
- **test(cv)**: anti-regressão PDFs PT/EN distintos + plano ATS documentado (`a01c22d`)

### 🔒 Segurança
- gitleaks+bandit+opengrep scan (`8cfa843`)

- 14 commits no dia · push bare+origin OK · HEAD: `20193c7`

## Sessão 2026-08-07 — i18n 100% + CV locale-aware + auditoria CI
- **i18n por origem**: locale detectado via navigator.language (pt-BR/pt-PT → PT, outro → EN); NÃO restaura último salvo — cada visita detecta a origem
- **CV locale-aware**: /api/download-cv serve Samuel_Andrade_2026.pdf (PT) ou Samuel_Andrade_Resume_2026.pdf (EN) conforme locale
- **Zero PT hardcoded**: Terminal (todos os comandos), ProfileSection, Footer, PalettePicker, ContactForm, SupportButton (modal Pix), games label — varredura profunda
- **Auditoria CI**: teste falha se achar texto PT hardcoded fora de t() (varre JSX text + aria/placeholder/title em 14 componentes)
- 17 commits · push bare+origin OK · HEAD: `d97540b`

## Sessão 2026-08-06 — Bug Hunter + i18n Terminal completo
- **Bug Hunter Portifólio**: auditoria de render SPA Next.js — verifica se componentes React montaram corretamente
- **i18n Terminal completo**: terminal.help agora usa t() — 26 comandos traduzíveis PT/EN, último reduto de PT hardcoded eliminado
- HEAD: ff41895 · 8 commits · push bare+origin OK

## Sessão 2026-08-05 — VRT + CV fix
- **VRT Playwright**: toHaveScreenshot em 4 seções principais (home, projetos, games, contato)
- **CV fix**: remove endereço completo e CEP — fica apenas "Brasília-DF" (regenerado do DOCX fonte)
- **4 commits** · push bare+origin OK · HEAD: `1aa9c44`
## ✅ Features Implementadas
- Parallax scene multicamada (L0-L3) com cockpit SVG animado
- 5 mini-games embutidos (iframe + React via CDN)
- Formulário de contato com validação + rate-limit + LGPD + Resend
- Projetos com dados do GitHub + fallback estático
- Timeline de carreira interativa + Skills grid categorizado
- Terminal interativo com 15+ comandos
- Tema escuro ciano+preto com design system consistente
- i18n PT/EN completo (todos os componentes)
- Umami Analytics (eventos, pageviews, heatmaps)
- Stripe + Mercado Pago (apoio/consultoria)
- CSP sincronizada, acessibilidade, SEO, manifest PWA
- Cookie Banner com consentimento LGPD + opções

## 🗺️ Próximos Passos
- [x] Deploy automático Vercel via CI
- [x] E2E Playwright em CI (3 shards + snapshots gerados no CI)
- [x] Modo escuro toggle persistente
- [ ] (opcional) Investigar branch `feat/navbar-redesign` não mergeada
- [ ] SEO: mais meta tags + schema.org

## 📁 Estrutura
- `src/app/` — App Router (layout, metadata, API routes, pages)
- `src/components/` — Hero, Profile, Projects, Games, Contact, Navbar, Terminal
- `src/hooks/` — useAnalytics, useLocalStorage
- `src/lib/` — GitHub API, types, fallback data
- `src/test/` — Vitest setup + mocks
- `src/components/MiniGames/` — Código dos 5 jogos (React)

### Resume Tailor AI (31/08/2026 — commitado, push aprovado)
- **NOTA:** critic 100/100, security 100/100, painel travou por 9Router (UnknownError upstream)
- **Commit:** `5bdf3d0` — 19 arquivos, 2342 inserções
- **Status:** ✅ master deployado
Feature "Baixar Currículo Personalizado" — IA reescreve o CV pra vaga → PDF com cores da marca.
- `src/app/api/resume-tailor/route.ts` — API `POST /api/resume-tailor` (OpenRouter + fallback Arachne; rate limit 3/min; guardrails)
- `src/lib/resumeData.ts` — CV estruturado PT/EN (dados imutáveis)
- `src/lib/resumePdf.ts` — gerador PDF jsPDF ATS-friendly (`generateResumePdf(r, locale, theme?)`)
- `src/lib/brandColors.ts` — detecção determinística de marca → cores do PDF (mapa curado ~45 marcas; LLM NUNCA escolhe cor)
- `src/lib/resumeGuardrails.ts` — `looksLikeInjection()` (blocklist), `validateResumeOutput()` (dados imutáveis), `parseLLMJson()`
- `src/components/ResumeTailorModal.tsx` — modal textarea → gera → baixa PDF
- Testes: `resumeGuardrails.test.ts` (26), `brandColors.test.ts` (9), `resumePdf.test.ts` (5), `ResumeTailorModal.test.tsx` (5)
- **PITFALL:** testes rodam DENTRO do WSL (`wsl -e bash -lc 'cd ~/projetos/portifolio && pnpm vitest run ...'`) — node_modules é Linux; vitest pelo Windows falha (rolldown WASI binding).
- Detalhes: `docs/plans/2026-08-30-resume-tailor-ai.md`

**Experiência do usuário:** Parallax scene integrada — grid + cockpit SVG + HUD panels + partículas formam a entrada. Scroll suave com parallax layers (L0-L3). Navegação por scroll + keyboard shortcuts (desktop). Tema escuro ciano+preto com consistência visual cinematográfica.

**URL:** https://samuelmedeiros.vercel.app
**Git:** GitHub (público) — Samuelfmedeiros/portifolio
**Deploy:** Vercel (automático no push pra master)

## Core Rules
- **Tema visual:** ciano+preto, cinematográfico, animações fortes. ~~Treasure Planet~~ (arquivado 2026-06).
- **Splash:** ❌ Removido (14/06/2026). Ambiente (grid + cockpit) SEMPRE visível. Hero content fadeIn com stagger por cima. Splash anterior arquivado em `src/components/_old/SplashScreen.tsx`.
- **Sessões:** HeroSection min-h-[70vh], scroll-mt-20 pra navbar, games em abas (um por vez + toggle "ver todos").
- 🔴 **HeroSection.tsx é CÓDIGO MORTO (11/08/2026):** nenhuma página o importa (só o próprio teste). O hero real é `ProfileSection.tsx`, que consome dados de `profileData.ts` (getSkills/getTimeline/getAbout). NÃO editar HeroSection achando que muda o site — editar `profileData.ts`/`ProfileSection.tsx`.
- **CSP:** sincronizada entre `next.config.js` e `vercel.json`. Vercel prioriza `vercel.json`.
- **Componentes:** GameShowcase com tabs + grid toggle. KeyboardShortcuts só desktop.

## ADRs Relevantes
`docs/adr/ADR-001` ~~Treasure Planet~~ **Deprecado**, `ADR-002` (Splash boot sequence), `ADR-003` (Vercel deploy)

## Stack
Next.js 16 · Turbopack · React 19 · Tailwind 4 · Framer Motion · Playwright · Vitest · Umami Analytics (self-hosted)

## Lint Status
**0 errors, 0 warnings** — ESLint limpo. Build compila sem TypeScript errors.

## Fixes Recentes
- **Scroll vertical cards jogos (17/06):** `overflow-y-hidden` nos cards (não rolam pra cima/baixo) + `min-h-[160px]` (evita layout shift no load). SEM `touchAction:pan-x` — scroll vertical propaga pra página.
- **Loading state jogos (17/06):** Spinner + "Carregando jogo..." enquanto iframe carrega CDNs (React + Babel do unpkg). `useState(false)` inicial, reset ao fechar.
- **Deploy Vercel (17/06):** GSAP adicionado ao `package.json` (faltava nas dependencies, quebrava build na Vercel). Buffer→Uint8Array no download-cv. Fix imports MotionValue/useScroll/useTransform no ProfileSection.
- **Umami tracking (17/06):** Eventos nos botões Apoiar (`support-modal`) e Consultoria Técnica. Evento `click-consulting-cta` já existia.
- **Centralização (17/06):** Título "🎮 Games" e heading "▸ JORNADA" centralizados. Cards de jogos com `justify-center`.
- **Parallax Intro (14/06):** SplashScreen deletado. Entrada integrada: L0/L1 fadeIn 0.5-0.6s + hero stagger + background delays.
- Feature flag `NEXT_PUBLIC_ENABLE_SPLASH` ~~obsoleta~~ — splash removido
- Navbar navegação: scroll único com offset, sem scrollend/timeout
- Logo `#hero` → scroll pro topo (seção não existia)
- `activeSection` inicial corrigido de `"hero"` → `"profile"`
- ProfileSection: `scroll-mt-20` + `id="profile-heading"` adicionados
- ProjectHangar: `id="projects"` duplicado removido (já existe no page.tsx wrapper)

## Config
- `NEXT_PUBLIC_ENABLE_SPLASH` — ~~obsoleto, splash removido 14/06/2026~~. Mantido para compatibilidade.
- ProfileSection: L0 (grid) e L1 (cockpit) com `initial/animate` para fade-in de entrada

## CI/CD
GitHub Actions → lint → test (vitest --run) → build. Deploy Vercel manual via CLI (`vercel --token "$VERCEL_TOKEN" --prod`). Automático ainda não configurado. Produção local :3001 + staging :3000.

## 📅 Histórico
- **Início:** 06/05/2026 — 245+ commits
- **Pico:** Maio/2026 (174 commits — responsivo, testes, analytics, footer)
- **14/06/2026:** Renomeado MC → Portifolio Samuel. Produção self-host :3001. Umami Analytics instalado.

## ⚙️ Deploys

### Staging (Capivara)
Portifolio tem staging em **capivara.seu.pet** via proxy reverso do Capivara:
- **Sistema:** systemd `portifolio-staging.service` na porta 3000 (`systemctl --user enable portifolio-staging`)
- **URL local:** http://localhost:3000
- **Proxy Capivara:** `/api/portifolio-proxy/` (autenticado, só usuários logados)
- **Dashboard:** seção "Portifolio Staging" no capivara.seu.pet com iframe
- **Splash:** ❌ removido (parallax layers como entrada)
- **X-Frame-Options:** `SAMEORIGIN` (permite iframe do capivara.seu.pet)
- **Build:** `pnpm build` antes de alterações
- **Reiniciar:** `systemctl --user restart portifolio-staging`

### Produção (self-host)
- **Sistema:** systemd `portifolio.service` na porta 3001
- **URL local:** http://localhost:3001
- **Build:** `pnpm build` e `systemctl --user restart portifolio.service`
- **Vercel:** `samuelmedeiros.vercel.app` (deploy manual via CLI, build funcional após adicionar gsap ao package.json)

## 📊 Analytics (Umami)
- **Servidor:** Umami v3 rodando em `localhost:3100` (service `umami.service`)
- **Acesso:** `capivara.seu.pet/api/umami/` (via proxy Capivara, precisa de login admin/umami)
- **Admin:** Configurado (usuário: admin, senha: umami — resetada 17/06)
- **Tracking script:** Injetado no `<head>` do layout (data-website-id dde11802-...)
- **Dados:** 4 sites monitorados (Portifolio Samuel, Capivara, Arachne, Dogwalk)
- **Eventos:** section_view, theme_toggle, cv_download, nav_click, contact_submit, click-consulting-cta

---

## 🔒 Deps — pnpm 10 via corepack + overrides (04/08/2026)

- **Use SEMPRE o pnpm do packageManager** (pnpm@10.34.5): `COREPACK_ENABLE_STRICT=0 corepack pnpm@10.34.5 <cmd>`. O pnpm global é 9.12.3 — regenerar lockfile com ele quebra o CI (ERR_PNPM_EEXIST).
- **Store:** o corepack pnpm 10 pode cair em /tmp/.pnpm-store (efêmero). Configurar uma vez: `corepack pnpm@10.34.5 config set store-dir /home/samuel/.pnpm-store --global`. node_modules instalado com major diferente exige `install --config.confirmModulesPurge=false`.
- **pnpm.overrides no package.json** fixa deps transitivas vulneráveis do vercel CLI (tar>=7.5.19, undici>=7.29.0, minimatch>=10.2.3, path-to-regexp>=8.4.0, js-yaml>=4.3.0, sharp>=0.35.0, @fastify/static>=10.1.1). Audit: 68→6 (0 high/critical; produção limpa).
- **Audit:** produção sempre `pnpm audit --prod` (deve dar "No known vulnerabilities"). As 6 restantes são dev tooling (vercel/netlify/vitest) low/moderate.

## 🛡️ REGRA DE SEGURANÇA CONTÍNUA (04/08/2026)

> **"Segurança é acompanhamento."** — Samuel. Política unificada com LifeLog e LEVE LAVANDA.

- **A cada entrega:** `pnpm audit` + verificar headers no `vercel.json` + integridade do lockfile
- **Semanalmente:** revisar `docs/SEGURANCA.md` + atualizar inventário
- **Mensalmente:** revisar dependências + domínios na CSP (remover stale)
- **Ao adicionar feature:** reavaliar superfície de ataque
- **Referências:** OWASP Top 10:2025, HttpArmor, OWASP Web Checklist
- **Cron:** `Portfolio Security Watchdog` (diário, 24h, silent unless issues)
- **Doc completo:** `docs/SEGURANCA.md`

---

## 🔴 ROGER + REGISTRO IMEDIATO (02/09/2026 — Samuel, GLOBAL)

**ROGER:** antes de declarar pronta/fazer deploy de QUALQUER entrega neste projeto, rodar o
test-loop obrigatório — skill `roger-test-loop` / `ai-test-loop` (orquestrador
`loop_orchestrator_unified.py`). Sem evidência real (testes + nota + PDF) NÃO é entrega.
Gate: UI=100, código=85. PDF relatório SEMPRE via MEDIA:.

**REGISTRO IMEDIATO:** toda alteração/coisa nova/caminho novo/mudança de workflow criada
NESTE projeto DEVE ser registrada no MESMO MOMENTO em que é criada — neste AGENTS.md
(arquivos, rotas, commands, endpoints novos), em skill (`skill_manage`) se repetível,
e em memory se infra/pitfall. "Feito" sem registro no ato = INCOMPLETO.

