# 📋 CHANGELOG — Portifolio Samuel

## [2026-08-11] — CV ATS 98.8/100 + hydration fix #418 + vulns 61→2

### 🚀 Features
- **CVs ATS-friendly PT/EN**: corrige cópia EN=PT literal, fontes de verdade md + gerador/validador; ats-score 96/100 (`118bd26`, `100b5d6`)
- **CV+site alinhados**: links Site/GitHub + 5 keywords reais (98.8/100), profileData sincronizado (Supabase→PG/Stripe/Pages, Hitss, TRT, pós-graduação) (`896f629`)

### 🔧 Fixes
- **hydration #418**: LanguageProvider pt determinístico, locale real pós-mount (`a94ca22`) + baselines visuais atualizados (`20193c7`)
- **Umami LGPD**: carrega no boot quando consentimento aceito (`6f59c6d`)
- **vulns 61→2**: overrides pnpm (ajv, smol-toml, once, esbuild) (`327d326`)

### 🧪 Testes
- Anti-regressão PDFs PT/EN distintos + plano ATS documentado (`a01c22d`)

### 🔒 Segurança
- gitleaks+bandit+opengrep scan (`8cfa843`)

14 commits · push bare+origin OK · HEAD: `20193c7`

## [2026-08-09] — RSS/LifeLog fixes + i18n audit + vulns

### 📡 RSS / ISR (LifeLog)
- Sort por `pubDate` desc no parser — ordem estável dos 3 posts
- Filtra posts EN durante o parse + `MAX_POSTS 30` — só posts PT recentes
- Remove `force-cache` do fetch — posts novos refletem no ISR
- ISR `revalidate: 30min` na página — posts novos do LifeLog refletem

### 🧪 Testes / Limpeza
- Report do i18n audit agrupado por componente — output legível
- Gitignore tmp + findings audit 09/08; remove arquivos tmp commitados por engano
- `pnpm update` — 61 vulns (1C/43H) → 6 (0C/2H devDeps)
- Revert melhorias região projetos (filtro/modal/i18n) — não aprovado

**20 commits · HEAD: `23322b8` ✅ push bare+origin**

## [2026-08-07] — i18n 100% + CV locale-aware + auditoria CI
### 🌐 i18n
- Locale por origem (navigator.language): pt-BR/pt-PT → PT, outro → EN; não restaura último salvo
- Zero PT hardcoded visível: Terminal (time/date/uptime/neofetch/fix/matrix/sudo/run/ls/exit/whois/holofote/lights_out), ProfileSection, Footer aria/tracking, PalettePicker, ContactForm, SupportButton (modal Pix), games label, UnifiedProfile skills
- **Auditoria CI**: teste falha se achar texto PT hardcoded fora de t() — varre JSX text + aria/placeholder/title em 14 componentes
### 📄 CV
- Download segue o locale: EN → Samuel_Andrade_Resume_2026.pdf, PT → Samuel_Andrade_2026.pdf
- 17 commits · push bare+origin OK

## [2026-08-06] — Bug Hunter + i18n Terminal completo

### 🐛 Bug Hunter
- **Auditoria de render SPA**: verifica se componentes React montaram corretamente no Portifólio (Next.js)

### 🌐 i18n
- **Terminal completo**: `terminal.help` agora usa `t()` — 26 comandos traduzíveis PT/EN, último reduto de PT hardcoded eliminado

**8 commits · HEAD: `ff41895` ✅ push bare+origin**

## [2026-08-05] — VRT + CV Privacy Fix

### 🧪 Testes
- **VRT Playwright**: `toHaveScreenshot` adicionado para 4 seções principais (home, projetos, games, contato)

### 🔒 Privacy
- **CV fix**: endereço completo e CEP removidos — fica apenas "Brasília-DF" (regenerado do DOCX fonte em F:\)

**4 commits · HEAD: `1aa9c44` ✅ push bare+origin**