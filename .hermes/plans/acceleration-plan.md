# 🔄 Plano: Acelerar PataPass com Projetos Prontos

## 📊 Diagnóstico Rápido — O que já temos vs o que falta

| Área | Status | O que falta |
|------|--------|-------------|
| 🏗️ **Auth + Roles** | ✅ Feito (Supabase, RLS, Turnstile) | Refinar onboarding multi-step |
| 💰 **Stripe Connect** | ✅ Feito (checkout, webhook, payouts) | Testes end-to-end |
| 🗺️ **Mapa + GPS** | ✅ Feito (MapLibre, tracking) | Otimizar consumo de bateria |
| 🔍 **Busca** | 🔄 Refatorado (171 linhas) | Integrar geolocalização real |
| 📅 **Agendamento** | ✅ Feito (Schedule, Scheduling) | Recurring/pacotes |
| 💬 **Chat** | ✅ Feito (contexto, hook) | Notificações push |
| 📊 **Admin** | ✅ Feito (MasterDashboard) | — |
| 🧪 **Testes** | ✅ 975 testes | 3 flaky |

## 🔥 Projetos Open-Source que Podem Acelerar

### 1. MapLibre + React — Substituir mapa embutido
| Projeto | ⭐ | Por que usar |
|---------|---|-------------|
| [`w3cj/openfreemap-examples`](https://github.com/w3cj/openfreemap-examples) | 248 | Exemplos React prontos com OpenFreeMap (nosso provedor atual) |
| [`lhapaipai/maplibre-react-components`](https://github.com/lhapaipai/maplibre-react-components) | 33 | Componentes React prontos (Marker, Popup, NavigationControl) |
| [`maptiler/tileserver-gl`](https://github.com/maptiler/tileserver-gl) | 2.8k | Self-host tile server → sem depender de API key externa |

**Ganho:** Substituir iframe OSM + MapLibre manual por componentes React testados.

### 2. Supabase SaaS Starters — Boilerplate de monetização
| Projeto | ⭐ | Por que usar |
|---------|---|-------------|
| [`bluemanta/saas-starter`](https://github.com/bluemanta/saas-starter) | — | Next.js 15 + Supabase + Drizzle + shadcn + Stripe |
| [`HafidIdrissi/nextjs-ai-saas-boilerplate`](https://github.com/HafidIdrissi/nextjs-ai-saas-boilerplate) | — | Next.js 15 + Supabase auth + Stripe billing + RLS + CI/CD |

**Ganho:** Padrões de Stripe Subscription, planos, onboarding.

### 3. Stripe Connect Marketplace
| Projeto | ⭐ | Por que usar |
|---------|---|-------------|
| Próprio `_worker.js` | — | Já temos webhook HMAC, Connect onboarding, payout tracking |
| Stripe docs: [Connect Onboarding](https://stripe.com/docs/connect) | — | Componente `AccountOnboarding` já integrado |

**Ganho:** Já temos o essencial — só faltam testes end-to-end.

### 4. Componentes UI Prontos
| Biblioteca | ⭐ | O que substitui no PataPass |
|------------|---|---------------------------|
| [`shadcn/ui`](https://ui.shadcn.com/) | 85k+ | Substituir inline styles por componentes testados (Dialog, Toast, Tabs, Select) |
| [`radix-ui`](https://www.radix-ui.com/) (base do shadcn) | 16k+ | Acessibilidade garantida (ARIA, keyboard nav) |

**Ganho:** Eliminar ~2.000 linhas de `styles.js` inline em todo o projeto.

### 5. MapLibre Route/Directions
| Projeto | ⭐ | Por que usar |
|---------|---|-------------|
| [`stevage/map-gl-utils`](https://github.com/stevage/map-gl-utils) | 234 | Utilitários MapLibre prontos (bounds, zoom, markers) |
| OpenRouteService API (gratuita) | — | Rotas entre pontos GPS (substitui cálculo manual) |

**Ganho:** Rotas visuais no mapa em vez de linha reta.

## 🛠️ Ferramentas pra Automatizar

| Ferramenta | O que acelera |
|-----------|--------------|
| **v0.dev** (Vercel) | Gera componentes React por prompt → copiar pro nosso código |
| **Claude/Cursor** | Geração de testes, componentes, schemas |
| **Supabase Studio** | Gerador de RLS policies, schema diff, SQL editor |
| **Stripe Dashboard** | Test webhooks, logs de eventos, debug de pagamento |
| **PageSpeed Insights** | Otimização PWA/performance |
| **LightHouse CI** | Gatilho automático de auditoria |

## 📋 Plano de Ação Prioritário

### Fase 1 — Esta Semana (~4h)
| Tarefa | Impacto | Deps |
|--------|---------|------|
| **A. Substituir MapLibre por componentes prontos** (`w3cj/openfreemap-examples`) | Alta — mapa + markers + popups testados | — |
| **B. Integrar `maplibre-react-components`** | Média — NavigationControl, GeolocateControl prontos | A |
| **C. Adicionar rotas visuais com OpenRouteService** | Alta — tracer rota do passeio no mapa | A |

### Fase 2 — Próxima Semana (~6h)
| Tarefa | Impacto | Deps |
|--------|---------|------|
| **D. Extrair design system com shadcn/ui** | Alta — elimina 2k linhas de styles inline | — |
| **E. Onboarding multi-step (TutorQuickRegistration)** | Alta — reduz churn no cadastro | — |
| **F. Notificações push (Web Push API)** | Alta — engajamento do passeador | — |

### Fase 3 — Pendências Técnicas (~2h)
| Tarefa | Impacto | Deps |
|--------|---------|------|
| **G. Self-host tileserver-gl** | Média — elimina dependência de API key | Docker |
| **H. Rodar migration SQL** | Média — unificar GPS tables | Supabase Dashboard |
| **I. CI/CD — token CF com permissão Pages** | Média — deploy automático | Cloudflare Dashboard |

## 📈 Resultado Esperado

| Antes | Depois |
|-------|--------|
| Mapa com iframe OSM + MapLibre manual | Componentes React testados + rotas visuais |
| ~2k linhas de styles inline | Design system com shadcn/ui |
| 3 testes flaky | 0 flaky |
| CI/CD manual | Deploy automático via GitHub |
| Dependência de OpenFreeMap público | Self-host tileserver ou fallback resiliente |

## 🚀 Próximo Passo Imediato

Quer que eu comece pela **Fase 1A** — substituir o mapa atual por componentes prontos do `w3cj/openfreemap-examples` + `maplibre-react-components`? Isso vai dar markers, popups e geolocation prontos em vez de iframe.
