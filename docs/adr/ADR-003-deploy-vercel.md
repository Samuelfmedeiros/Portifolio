# ADR-003: Deploy Vercel + CI/CD com GitHub Actions

**Status:** Aceito
**Data:** 2026-06-11

## Contexto
Portifolio Samuel é um Next.js SPA com SSR mínimo. Precisávamos de deploy automático e confiável com preview deployments para PRs.

Alternativas consideradas: Cloudflare Pages (usado no Dogwalk), Netlify, AWS Amplify, servidor próprio.

## Decisão
Vercel como host (Next.js é da Vercel = integração nativa) + GitHub Actions para CI:
- **Vercel:** deploy preview automático em cada PR, produção no push pra master
- **GitHub Actions:** lint, testes unitários (Vitest), testes E2E (Playwright), depois deploy via Vercel CLI
- **Pipeline:** PR aberto → lint + test → preview deploy | push master → lint + test → produção

O token Vercel está configurado nos secrets do GitHub (`VERCEL_TOKEN`), com `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` para deploy via CLI.

## Consequências
- Positivo: preview deployments = revisão visual antes de merge
- Positivo: Vercel otimiza Next.js automaticamente (ISR, imagens)
- Positivo: pipeline unificado (testes + deploy no mesmo lugar)
- Negativo: dependência do ecossistema Vercel
- Negativo: build multiplataforma (Windows WSL → CI Linux) pode ter diferenças
