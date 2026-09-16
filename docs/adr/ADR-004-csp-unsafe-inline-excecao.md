# ADR-004: Exceção documentada — `unsafe-inline` em script-src/style-src na CSP

**Status:** Aceito
**Data:** 2026-09-15
**Origem:** Finding Cerberus semanal 15/09 (Medium) — `script-src 'unsafe-inline'` e `style-src 'unsafe-inline'` no header CSP de portifolio.seu.pet / samuelmedeiros.vercel.app
**Revisores:** Portifólio (posse) + Cerberus/capivara (red team)

## Contexto

O loop ofensivo do Cerberus sinalizou `'unsafe-inline'` na CSP como risco Medium.
A auditoria de 15/09 foi feita com evidência real (headers ao vivo nas duas origens +
HTML da home + varredura dos 14 chunks JS servidos), não por leitura de config:

1. **O `unsafe-inline` de scripts NÃO vem dos ads.** AdSense/GTM estão dormentes em
   produção: `NEXT_PUBLIC_ADSENSE_CLIENT_ID` não está definido, nenhum chunk nem HTML
   entregue contém `ca-pub`/`adsbygoogle`/`googletagmanager`. Os domínios Google na CSP
   são porta para feature flag futura de monetização, não causa do inline.
2. **A causa real é o Next.js 16 App Router.** Cada página SSR carrega flight payloads
   inline no HTML (~11 `<script>` sem `src` só na home: `__next_f.push`, `$RB/$RC/$RT`,
   theme FOUC prevention, bfcache reload, JSON-LD) e o beacon/`email-decode` da Cloudflare
   injeta script inline adicional. Adicionalmente, 263 atributos `style="..."` no HTML
   (Tailwind arbitrary values + CSS vars por paleta) exigem `style-src 'unsafe-inline'`.
3. **Migrar para nonce/hash não remove o inline de graça.** CSP3 define que, quando há
   qualquer hash ou nonce em `script-src`, o navegador **ignora** `'unsafe-inline'` — ou
   seja, habilitar nonce cai no modo estrito total e todo inline precisa do nonce,
   inclusive os do framework. O caminho oficial (middleware gera nonce por request +
   `Script`/`next.config` repassam) torna **toda página dinâmica**: mata o cache de CDN
   e anula ISR/edge-cache (o site hoje é 100% cacheável nas rotas públicas). Docs Next
   "Content Security Policy" + field notes CSP em App Router (2026) confirmam o trade-off.

## Decisão

Mantemos `'unsafe-inline'` em `script-src` e `style-src` como **exceção documentada**,
com as seguintes compensações e limites:

- `base-uri 'self'`, `form-action 'self'`, `object-src` implícito (`default-src 'self'`)
  permanecem estritos — contêm o impacto de um inline injetado.
- `upgrade-insecure-requests` dispensável: site 100% HTTPS (HSTS preload ativo).
- O risco residual aceitável é: um XSS que injete `<script>` inline executa. A superfície
  de injeção é coberta por React escaping + testes Vitest/Playwright + gitleaks no CI.
- Revisão obrigatória desta exceção: **anual** ou quando (a) o Next passar a emitir
  flight payloads por `src` externo, (b) surgir `Content-Security-Policy-Report-Only`
  com violações reais, ou (c) o projeto habilitar AdSense/GTM em produção.

## Hardening cirúrgico que ACOMPANHA esta exceção (fechado neste PR)

1. **`https://unpkg.com` PERMANECE no `script-src` — corrigido pela evidência ao vivo.**
   Auditar antes de cortar: `/games/*/index.html` (5 jogos) recebe o header CSP da regra
   coringa `/:path*` (verificado 15/09: `curl -sI .../games/asteroid-dodge/index.html` traz
   o CSP) e carrega React/ReactDOM/Babel do unpkg — remover o domínio quebraria os jogos.
   O risco real ali é supply-chain de CDN, já mapeado em docs/SEGURANCA.md ("SRI pending"):
   **follow-up registrado** — adicionar `integrity`/SRI nos `<script>` dos 5 jogos em PR
   próprio (fora do escopo deste, que é a exceção de inline).
2. **Alinhada a divergência latente entre os dois arquivos**: `next.config.js` continha
   `'unsafe-eval'` e o header servido (por `vercel.json`, que sobrescreve) não. `vercel.json`
   passa a ser a **fonte única documentada** (comentário âncora no `next.config.js` + este
   ADR; o JSON de Vercel não aceita comentários). `next.config.js` perde o `'unsafe-eval'`
   e sua diretiva `script-src` passa a ser byte a byte a do JSON — nada
   no build de produção atual (Turbopack) depende dele; se um dia depender, volta com
   registro neste ADR.
3. **Domínios Google Analytics/GTM/AdSense mantidos — decisão explícita**: são gate da
   feature de monetização já implementada (`src/components/monetization/AdSense.tsx`,
   ativada por env `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, hoje desligado). Removê-los quebraria
   o ligar-futuro por env. Registrado aqui para o Cerberus saber que é intencional.

## Consequências

- Positivo: finding Medium do Cerberus encerra com razão técnica verificada, sem
  regressão de performance (cache/ISR preservados) e com a CSP mais enxuta (unpkg fora).
- Positivo: dupla-manutenção `vercel.json` vs `next.config.js` vira regra documentada
  (fonte única = vercel.json).
- Negativo: permanece vetado nonce/hash enquanto o site depender de cache edge — se um
  dia isso mudar, este ADR deve ser reavaliado (gatilhos listados acima).

## Verificação (reproduzível)

```bash
# header ao vivo nas duas origens (idêntico, pós-deploy deste PR):
curl -sI https://portifolio.seu.pet | grep -i '^content-security-policy'
curl -sI https://samuelmedeiros.vercel.app | grep -i '^content-security-policy'
# provas de que inline vem do framework, não dos ads:
curl -s https://portifolio.seu.pet | grep -o '<script[^>]*>' | grep -vc 'src='   # ~11 inline
curl -s https://portifolio.seu.pet | grep -c "ca-pub\|adsbygoogle"               # 0
```
