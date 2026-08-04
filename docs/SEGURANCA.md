# 🛡️ Portfólio Samuel — Plano de Segurança (v1.0)

> Documento dedicado de segurança do portfólio (04/08/2026).
> **Segurança é acompanhamento contínuo, não um documento parado.**
> Política unificada com LifeLog, LEVE LAVANDA e ecossistema Samuel.

---

## 🎯 Princípios

1. **Defense in depth** — várias camadas: código → build → deploy → headers → monitoramento
2. **Superfície maior que SSG puro** — o Portfólio tem: formulário de contato, iframes de jogos, AdSense, Stripe/MercadoPago, self-host staging. Cada um é vetor.
3. **Auditar a cada entrega** — pnpm audit + headers check + integridade do lockfile
4. **Secrets NUNCA no bundle** — todas as credenciais via GitHub Secrets ou .env (fora do git)
5. **Referências são pra USAR, não só documentar**

---

## 📦 Inventário (04/08/2026)

| Área | Controle | Status |
|------|----------|--------|
| **CSP** | `script-src 'unsafe-inline'` (AdSense+React requer), sem `unsafe-eval`, sem Supabase stale | ✅ Hardened 04/08 |
| **Headers** | HSTS (2 anos), X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, COOP, CORP, COEP | ✅ Completo 04/08 |
| **SCA** | `pnpm audit` — executado no CI | ✅ |
| **SAST** | ESLint — 0 errors, 0 warnings | ✅ |
| **Secrets** | GitHub Secrets + .env no .gitignore | ✅ |
| **HTTPS** | Vercel força HTTPS + HSTS preload | ✅ |
| **Cache** | `no-cache` (HTML) + guard bfcache (`pageshow`) | ✅ 03/08 |
| **Contato** | Formulário com rate-limit, LGPD, validação | ✅ |
| **AdSense** | Scripts restritos via CSP, carregamento lazy | ✅ |
| **Jogos** | iframe sandbox, carregamento via CDN externo | ⚠️ CDN externo (unpkg) |
| **Stripe/MercadoPago** | Links de pagamento externos (PCI out of scope) | ✅ |
| **Staging** | self-host :3001, proxy Capivara autenticado | ✅ |
| **Testes** | 218 Vitest + lint 0 errors | ✅ |
| **Lockfile** | `pnpm-lock.yaml` versionado, `--frozen-lockfile` no CI | ✅ |

---

## 🚨 Ameaças (OWASP adaptado ao Portfólio)

| # | Ameaça | Risco | Controle |
|---|--------|-------|----------|
| **A05** | **Security Misconfiguration** — CSP permissiva, headers faltando | 🟡 BAIXO | Headers completos, CSP sem unsafe-eval, COOP/CORP/COEP |
| **A06** | **Vulnerable Components** — deps com CVE, CDN externo | 🟡 MÉDIO | pnpm audit + Subresource Integrity (SRI) nos CDNs |
| **A08** | **Software Integrity** — lockfile corrompido | 🟡 BAIXO | Frozen lockfile no CI |
| **Client** | **XSS via formulário** — input malicioso no contato | 🟡 BAIXO | React escapa + rate-limit + validação backend |
| **Client** | **Clickjacking** — iframe de jogos abusado | 🟡 BAIXO | X-Frame-Options SAMEORIGIN |
| **Supply** | **CDN compromise** — unpkg/CDN malicioso | 🟡 MÉDIO | SRI pending, CSP restringe origens |
| **Data** | **Dados de contato expostos** — mensagens sem criptografia | 🟡 BAIXO | Capivara API com JWT + HTTPS |
| **Self-host** | **Staging exposto** — :3001 acessível na LAN | 🟡 BAIXO | Proxy Capivara autenticado + X-Frame SAMEORIGIN |

---

## 🛡️ Controles por área

### Headers (vercel.json)
- [x] CSP: sem `unsafe-eval`, domínios AdSense/GitHub/Capivara whitelistados
- [x] HSTS: 2 anos + includeSubDomains + preload
- [x] X-Frame-Options: SAMEORIGIN (permite iframe Capivara)
- [x] X-Content-Type-Options: nosniff
- [x] X-XSS-Protection: 1; mode=block
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: tudo bloqueado + sensores
- [x] COOP: same-origin
- [x] CORP: same-origin
- [x] COEP: require-corp

### Formulário de contato
- [x] Rate limiting (Capivara middleware)
- [x] Validação client-side (React) + server-side (Capivara API)
- [x] LGPD consent (checkbox obrigatório)
- [x] Dados via HTTPS → Capivara → PG (nunca expostos no front)

### AdSense
- [x] CSP restringe scripts só a domínios Google AdSense
- [x] Carregamento lazy (não bloqueia render)
- [x] Suporte a anúncios não-personalizados (LGPD)

### Jogos (iframe)
- [x] iframe com sandbox attributes
- [x] Conteúdo servido do próprio domínio ou CDN whitelistado
- [ ] SRI (Subresource Integrity) nos scripts do CDN

### Staging (self-host)
- [x] Porta 3001 bind 127.0.0.1
- [x] Proxy Capivara autenticado (JWT required)
- [x] X-Frame-Options SAMEORIGIN (permite iframe do capivara.seu.pet)

---

## 📊 Roadmap de segurança

| Fase | Entrega | Status |
|------|---------|--------|
| **1. Headers** | CSP, HSTS, X-Frame, COOP/CORP/COEP, Permissions-Policy | ✅ 04/08 |
| **2. CSP cleanup** | Remover unsafe-eval + Supabase stale | ✅ 04/08 |
| **3. SCA/SAST** | pnpm audit, ESLint, lockfile integrity | ✅ |
| **4. SRI** | Subresource Integrity nos CDNs (unpkg) | ⚠️ Pendente |
| **5. Monitoramento** | Cron de segurança, health check | ✅ 04/08 |
| **Contínuo** | pnpm audit, revisão de headers, update de deps | 🔄 |

---

## 🔍 Auditorias (ferramentas do ecossistema)

- `web-api-security-audit` — N/A (sem API própria; Capivara já auditado)
- `infrastructure-security-audit` — Staging self-host; proxy Capivara como gate
- `github-public-repo-security-audit` — ✅ Repo público, gitleaks pendente

---

## 📚 Referências de segurança (GitHub)

### 🆕 Novas (2025-2026)
1. **[HttpArmor](https://github.com/opensecurity/httparmor)** — gerador/validador de headers
2. **[OWASP Top 10:2025 Checklist](https://github.com/Sp3ctrX/owasp-top10-2025-checklist)** — 249 CWEs

### 📜 Clássico
3. **[OWASP Web Checklist](https://github.com/0xRadi/OWASP-Web-Checklist)** — padrão OWASP

---

## 🔄 Política de acompanhamento contínuo

- **A cada entrega:** `pnpm audit` + verificar headers + integridade do lockfile
- **Semanalmente:** revisar SEGURANCA.md + atualizar inventário
- **Mensalmente:** revisar dependências + domínios na CSP (remover stale)
- **Ao adicionar feature:** reavaliar superfície de ataque

---

*Criado: 04/08/2026 · v1.0 — política unificada do ecossistema Samuel*
