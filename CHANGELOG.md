# 📋 CHANGELOG — Portifolio Samuel

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