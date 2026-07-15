# 🚀 Deploy — Portifolio Samuel

## Stack
- **Framework:** Next.js 16 (App Router)
- **Deploy:** Vercel (automático via GitHub Actions — `deploy.yml`)
- **Build:** Turbopack + SWC Minify
- **CI:** Build + Lint + Test → Playwright E2E → Deploy

---

## 📦 Deploy Automático (Recomendado)

O deploy é automático a cada push na `master`:

```bash
git add -A && git commit -m "feat: sua mudança"
git push origin master
```

A Vercel detecta o push, roda `pnpm build`, e deploya em ~2-3 minutos.

**Pipeline CI (`deploy.yml`):**
1. Build + Lint + Test (Vitest)
2. Playwright E2E contra produção
3. Deploy Vercel com health check
4. Rollback automático se health check falhar

**Status:** https://vercel.com/samuelfmedeiros/portifolio/activity
**Live:** https://samuelmedeiros.vercel.app

---

## 🛠️ Deploy Manual (CLI)

```bash
# 1. Build local pra verificar erros
pnpm build

# 2. Deploy produção
pnpm deploy:vercel
# OU
vercel --prod
```

⚠️ **Build no WSL/NTFS:** `next build` em filesystem Windows (`/mnt/c/`, `/mnt/d/`, `/mnt/f/`) pode falhar com `ERR_OSSL_EVP_UNSUPPORTED` ou `ERR_DLOPEN_FAILED`. Copiar pra `/tmp/` e buildar de lá se necessário.

---

## 🧪 Validação Pós-Deploy

```bash
# Headers de segurança
curl -sI https://samuelmedeiros.vercel.app/ | grep -E "(Strict-Transport|Content-Security|X-Frame|Permissions)"

# Conteúdo renderizado
curl -sL https://samuelmedeiros.vercel.app/ | grep -o "▸ HABILIDADES\|▸ JORNADA" | head -5

# Testes locais
pnpm test:run       # Vitest (uma vez)
pnpm test:e2e       # Playwright E2E
pnpm lint           # ESLint
```

---

## 📊 Scripts Úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Build produção |
| `pnpm build:analyze` | Build com análise de bundle |
| `pnpm test` | Vitest watch mode |
| `pnpm test:run` | Vitest (uma vez) |
| `pnpm test:e2e` | Playwright E2E |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint auto-fix |
| `pnpm deploy:dry` | Preview deploy |
| `pnpm deploy:vercel` | Deploy produção |

---

## ⚡ Otimizações Ativas

- ✅ SWC Minify — bundles menores
- ✅ Tree-shaking — remove código morto
- ✅ Imagens WebP/AVIF — next-gen formats
- ✅ Console removal — remove logs em produção
- ✅ Security headers — HSTS, X-Frame-Options, CSP
- ✅ Code splitting automático (Next.js)
- ✅ Lazy loading em componentes pesados
- ✅ prefetch de rotas

---

## 🐛 Troubleshooting

### Build falha no F: drive
```bash
# Limpa cache do pnpm
pnpm store prune

# Ou copia pra /tmp e builda lá
rsync -av --exclude='node_modules' ./ /tmp/mc-build/
cd /tmp/mc-build && pnpm install && pnpm build
```

### Vercel não deploya
- Check se tá logado: `vercel whoami`
- Linka o projeto: `vercel link`
- Vê logs: `vercel logs`

### Git push falha
```bash
# Verificar remote
git remote -v

# Reconfigurar se necessário
git remote set-url origin git@github.com:Samuelfmedeiros/portifolio.git
```

---

**Última atualização:** Julho 2026
