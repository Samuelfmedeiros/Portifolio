# 🚀 Deploy - Portifolio Samuel

## Stack
- **Framework:** Next.js 16.2.5 (App Router)
- **Deploy:** Vercel (automático via GitHub)
- **Build:** Turbopack + SWC Minify

---

## 📦 Deploy Automático (Vercel + GitHub)

O deploy é automático a cada push na `master`:

1. **Commita e pusha:**
   ```bash
   git add -A && git commit -m "feat: sua mudança"
   git push origin master
   ```

2. **Vercel faz o resto:**
   - Detecta o push no GitHub
   - Roda `pnpm build` automaticamente
   - Deploy em ~2-3 minutos
   - URL: `https://samuelmedeiros.vercel.app`

---

## 🛠️ Deploy Manual (CLI)

Se precisar deployar manualmente:

```bash
# Install deps (primeira vez)
pnpm install

# Build local
pnpm build

# Deploy produção
pnpm deploy:vercel

# OU com vercel direto
vercel --prod
```

---

## 📊 Scripts Úteis

```bash
# Dev server
pnpm dev

# Build produção
pnpm build

# Build com análise de bundle
pnpm build:analyze

# Rodar testes
pnpm test          # watch mode
pnpm test:run      # uma vez
pnpm test:e2e      # E2E com Playwright

# Lint
pnpm lint          # check
pnpm lint:fix      # auto-fix

# Deploy
pnpm deploy:dry    # preview
pnpm deploy:vercel # produção
```

---

## ⚡ Otimizações Ativas

- ✅ **SWC Minify** - bundles menores
- ✅ **Tree-shaking** - remove código morto
- ✅ **Imagens WebP/AVIF** - next-gen formats
- ✅ **Console removal** - remove logs em produção
- ✅ **Security headers** - HSTS, X-Frame-Options, etc.

---

## 🐛 Troubleshooting

### Build falha no F: drive
Se der `disk I/O error`:
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

---

## 📈 Performance

**Target:** Lighthouse 90+
- Code splitting automático (Next.js)
- Lazy loading em componentes pesados
- prefetch de rotas
- Imagens otimizadas

**Bundle size atual:** ~3MB (build completo)

---

**Último deploy:** 28/05/2026 - Cleanup + GitHub Stats real