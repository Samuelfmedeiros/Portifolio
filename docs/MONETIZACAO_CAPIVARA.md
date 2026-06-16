# 🐹 Capivara — Análise de Potencial de Monetização

> Data: 16/06/2026
> Autor: Samuel's Hermes
> Status: ❌ Não viável como produto standalone

## O que é o Capivara

Hub pessoal seguro com login + convites temporários para visualizar **Arachne** (crawler) e **Portifolio Samuel** (staging). Centraliza o ecossistema Samuel num lugar só.

**Stack:** FastAPI + SQLite + JWT + React + Tailwind + Cloudflare Tunnel

## Análise de Produto

### 1. Self-hosted open source + hosted version paga?

**Problemas:**
- ⛓️ **Altamente acoplado ao ecossistema Samuel** — proxies pro Arachne, stats do Portifolio, sync scripts específicos
- 🏗️ **Requer infra estrutura** — Cloudflare Tunnel, systemd, nginx — não é plug-and-play
- 🎯 **Mercado nichado demais** — "dashboard pessoal para desenvolvedores que têm múltiplos serviços internos" é um público minúsculo
- 🧩 **Funcionalidades genéricas insuficientes** — auth JWT + dashboard + proxies já existem em ferramentas maduras (Grafana, Homarr, Heimdall, Homer)

### 2. Ferramenta interna que outras pessoas pagariam?

**Potencial baixo porque:**
- O **valor real** do ecossistema Samuel está no **Arachne** (plataforma de scraping/RAG) — não no Capivara
- Capivara é um **agregador** — sozinho não resolve um problema específico que alguém pagaria pra resolver
- Funcionalidades como "sync com D1" são **diferenciais técnicos** que só fazem sentido no contexto do Samuel

### 3. O que poderia ser extraído como produto?

| Componente | Potencial | Justificativa |
|-----------|-----------|---------------|
| **Auth JWT + invite system** | ⭐ Médio | Lindo, mas existem dezenas de soluções (Supabase Auth, Clerk, Auth0) |
| **Dashboard com stats** | ⭐ Baixo | Cada pessoa quer ver métricas diferentes |
| **Proxy de serviços** | ⭐⭐ Médio | Útil, mas nginx/caddy/frpc já resolvem |
| **D1 sync** | ⭐ Alto | Backup automático SQLite → Cloudflare D1 é genuinamente útil e sub-explorado |
| **Visual glass style** | ⭐ Baixo | É design, não funcionalidade |

## Conclusão

### ❌ Não monetizar como produto standalone

Capivara nasceu como ferramenta pessoal e deve continuar sendo. Tentar transformá-lo em produto exigiria:
1. **Generalização massiva** — desacoplar de Samuel, remover dependências de Arachne/Portifolio
2. **Competir com ferramentas maduras** — Grafana, Homarr, Heimdall, todas gratuitas e mais completas
3. **Manter duas versões** — a pessoal de Samuel + a genérica — custo de manutenção elevado

### ✅ Caminhos recomendados

1. **Foco no Arachne** — já tem planos (Free/Pro), Precisa de integração Stripe pra cobrar
2. **Consultoria técnica** — Stripe Payment Link no Portifolio (em paralelo)
3. **D1 Sync como micro-saas** — o sync SQLite→Cloudflare D1 é o único componente com potencial real de produto independente

### 📊 Pricing Arachne (já definido)

| Plano | Preço | Limites |
|-------|-------|---------|
| Free | R$ 0 | 1KB/mês, 3 docs, 100 chunks |
| Pro | R$ 49/mês | 100MB, 10K chunks, RAG completo |
| Pro Anual | R$ 490/ano | Mesmo que Pro, 2 meses grátis |

## Próximos Passos Recomendados

1. ✅ Stripe Payment Link para consultoria no Portifolio **(em andamento)**
2. ⏳ Integrar Stripe no Arachne para cobrança dos planos Pro
3. ❌ Não investir em produto separado do Capivara
