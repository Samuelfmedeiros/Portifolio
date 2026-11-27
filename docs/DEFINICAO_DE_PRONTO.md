# Definição de Pronto — Portifólio

> Finish line fora do código (princípio 1 do vídeo `KIX9IL1jP8Y`). Preenchido antes de novas implementações. Correlation ID: `20261127-principios-video-ecossistema`.

## Meta verificável (1 linha)
Build publicado com suíte verde, Lighthouse SEO 100 / acessibilidade 95+, CSP rigorosa e gate de modularização rc=0.

## Requisitos funcionais
- RF1: seções Hero (TypeWriter + parallax L0-L3), Profile (timeline + skills), Projetos (grid filtrável GitHub), Jogos (5 iframes), Contato (form validado), Terminal (15+ comandos).
- RF2: formulário de contato com rate-limit 30s, consentimento LGPD e envio via Resend.
- RF3: analytics Umami (pageviews + eventos) e dados GitHub com fallback.

## Requisitos não funcionais
- RNF1: Next.js 16 + Turbopack, React 19, Tailwind 4, Framer Motion + GSAP.
- RNF2: 177 testes (Vitest + RTL), 0 lint errors/warnings, Lighthouse SEO 100 e a11y 95+.
- RNF3: CSP rigorosa, gitleaks, dependabot, gate de modularização rc=0.
- RNF4: deploy Vercel + self-host :3001; staging capivara.seu.pet :3000.

## Fora de escopo
- Mudanças de tema/identidade visual sem aprovação (gate de deploy do Samuel).
- Branches `roger/*` pendentes; as 276 branches não foram tocadas.

## Critério de pronto
| # | Checagem | Evidência obrigatória |
|---|---|---|
| 1 | testes | `npm test` com contagem ≥177 |
| 2 | build | `npm run build` rc=0 |
| 3 | gates | `python3 .ci/modularization-guard.py --config .ci/modularization.json` rc=0 + design-gate rc=0 |
| 4 | rastreabilidade | tag `patch-*` + hash no ledger com `--proof` |

## Proibições
- Sem gasto, push ou mensagem a humano sem aval do dono.
- Sem reiniciar serviço; sem auto-deploy sem vídeo de aprovação (regra de deploy).
- Sem mexer nos 2 arquivos untracked alheios (`src/lib/engagement-init.test.ts`, `tests/_contrast-measure.spec.ts`).

## Referências
- `AGENTS.md`, `docs/ARCHITECTURE.md`, `.ci/modularization.json`
- Plano: `~/.opencode/plan/2026-11-27-principios-video-ecossistema.md`
