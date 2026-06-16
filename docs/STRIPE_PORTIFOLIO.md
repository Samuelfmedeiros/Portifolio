# 💰 Portifolio Samuel — Stripe Payment Link

> Data: 16/06/2026
> Status: ⏳ Aguardando Stripe secret key para criar Payment Link

## 🎯 Objetivo

Criar um **Stripe Payment Link** para "Consultoria / Contratação" que permita:
- Clientes pagarem por consultoria técnica via cartão de crédito (BRL)
- Samuel receber pagamentos recorrentes ou avulsos
- Link direto embutido no Portifolio (botão "Me contrate")

## 📋 Checklist

- [x] Conta Stripe existente (usada pelo PataPass/Dogwalk)
- [x] Publishable key configurada: `pk_live_51TgFhoJ9IBwdHn6XBzWqZnGaEXRIu3vcgcuPRvfsVL6hFSdxYoh2igfEKKNpaUZjnwkzxPVBOwhYfNar9xyp7ig500hbd8BZww`
- [ ] **Secret key não encontrada** — está nos secrets do Cloudflare Pages + Supabase Edge Functions (criptografado)
- [ ] Stripe Product "Consultoria" criado
- [ ] Stripe Price criado
- [ ] Stripe Payment Link criado
- [ ] CTA "Me contrate" adicionado no Portifolio
- [ ] Testado antes de divulgar

## 🔧 Como criar o Payment Link

### Opção 1: Stripe Dashboard (mais rápido)

1. Acessar https://dashboard.stripe.com/products/create
2. Criar produto "Consultoria Técnica"
3. Adicionar preço sugerido: R$ 150/hora ou pacotes (ex: R$ 2.000 - 20h)
4. Criar Payment Link na aba "Payment Links"
5. Copiar URL (ex: `https://buy.stripe.com/...`)
6. Configurar no Portifolio via env var `NEXT_PUBLIC_STRIPE_CONSULTING_LINK`

### Opção 2: Stripe API (quando tiver a secret key)

```bash
# Requer STRIPE_SECRET_KEY no ambiente
# 1. Criar produto
curl https://api.stripe.com/v1/products \
  -u sk_live_...: \
  -d name="Consultoria Técnica" \
  -d description="Desenvolvimento web · Consultoria técnica · Auditoria de código"

# 2. Criar preço (R$ 150/hora)
curl https://api.stripe.com/v1/prices \
  -u sk_live_...: \
  -d currency=brl \
  -d unit_amount=15000 \
  -d product=prod_... \
  -d "recurring[interval]"=one_time

# 3. Criar Payment Link
curl https://api.stripe.com/v1/payment_links \
  -u sk_live_...: \
  -d "line_items[0][price]"=price_... \
  -d "line_items[0][quantity]"=1
```

## 🔗 Env Vars Necessárias (Portifolio)

```env
# Stripe — Link de consultoria
NEXT_PUBLIC_STRIPE_CONSULTING_LINK=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51TgFhoJ9IBwdHn6XBzWqZnGaEXRIu3vcgcuPRvfsVL6hFSdxYoh2igfEKKNpaUZjnwkzxPVBOwhYfNar9xyp7ig500hbd8BZww
```

## 📊 Analytics

Portifolio já tem **Umami Analytics** instalado (servidor em localhost:3100). Para medir conversão do CTA:
- Umami tracking já está configurado nos componentes
- Adicionar `data-umami-event="click-consulting-cta"` no botão
- Ver métricas em: https://capivara.seu.pet/api/umami/

## 🚀 Próximos Passos

1. Samuel fornecer Stripe secret key OU criar Payment Link pelo Dashboard
2. Configurar env vars no Portifolio
3. Build + deploy
4. Testar fluxo completo de pagamento
5. Divulgar
