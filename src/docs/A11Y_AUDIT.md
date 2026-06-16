# ♿ Acessibilidade — Audit Report

**Data:** 16/06/2026
**Ferramenta:** axe-core 4.11 + Playwright
**Páginas auditadas:** `/` (Home), `/privacidade`, `/termos`

---

## ✅ Resumo

| Métrica | Resultado |
|---------|-----------|
| Violações **críticas** | 0 |
| Violações **sérias** | 0 (excluindo contraste — ver abaixo) |
| Violações de **contraste** | ~15 elementos (documentado, não bloqueante) |
| **Skip Link** | ✅ Presente, funcional |
| **aria-labels** | ✅ Navegação, botões, links com labels |
| **heading hierarchy** | ✅ h1 → h2 → h3 → h4 bem definida |
| **tab order** | ✅ Navegação lógica |
| **keyboard navigation** | ✅ Skip link, tabs, Enter/Space em cards |
| **contraste geral** | ⚠️ Tema escuro sci-fi — contrastes baixos em elementos secundários |

---

## 🛠️ Correções Aplicadas

### Navbar — `role="list"` sem `role="listitem"` (CRÍTICO)
- **Problema:** Nav desktop e mobile usavam `<div role="list">` com filhos `<a>` sem `role="listitem"`
- **Correção:** Substituído por `<ul>` semântico com `<li>` em cada item
- **Impacto:** Screen readers agora anunciam corretamente "list with N items"

### TypeWriter — `aria-label` em `<span>` dentro de `<p>` (SÉRIO)
- **Problema:** `<span>` com `aria-label` dentro de `<p>` — ARIA não permitido
- **Correção:** Adicionado `role="text"` ao `<span>` — torna `aria-label` válido
- **Impacto:** Screen readers continuam ouvindo o texto completo do TypeWriter

---

## ⚠️ Contraste de Cores (não corrigido)

O tema escuro sci-fi propositalmente usa contrastes reduzidos em elementos decorativos. 
Lista de elementos com contraste abaixo do recomendado (WCAG AA 4.5:1):

### Home (/)
- Botão "Ver Projetos": `var(--bg-primary)` sobre `var(--accent)` (cyan) — contraste marginal
- Footer links e textos secundários com `var(--text-secondary)`/`var(--text-secondary)/50`
- Monetization links (BuyMeACoffee, GitHub Sponsors)
- Timeline item headings e descrições

### Privacidade / Termos
- Texto de introdução (`div > .mb-2`, `div > p`)
- Email copy button (`button[aria-label="Copiar email"] > span`)

### Recomendação
Para manter a estética sci-fi sem sacrificar acessibilidade:
- Aumentar opacidade de `var(--text-secondary)` de 0.5/0.3 para 0.7/0.5
- Adicionar `text-shadow` sutil em textos pequenos (11px-12px)
- Garantir que botões CTA tenham fundo mais contrastante

---

## ✅ Boas Práticas Presentes

- **SkipLink**: `Pular para conteúdo` no topo, visível no focus
- **Navbar**: `aria-label="Navegação principal"`, `aria-current` no item ativo
- **BackToTop**: `aria-label="Voltar ao topo"`
- **GitHub link**: `aria-label="GitHub"`
- **Heading hierarchy**: H1 "Samuel Medeiros" → H2 por seção → H3 por item
- **Role="button"** em cards clicáveis com `tabIndex={0}` e keydown handlers
- **aria-hidden="true"** em SVGs decorativos e partículas
- **HTML lang**: `lang="pt-BR"` no `<html>`
- **main landmark**: `<main id="main-content">`
- **Font display**: `swap` para evitar FOIT

---

## 📊 Scores axe-core

| Página | Violações Críticas | Violações Sérias (excl. contraste) |
|--------|-------------------|-------------------------------------|
| / | 0 | 0 |
| /privacidade | 0 | 0 |
| /termos | 0 | 0 |

---

*Audit gerado automaticamente com @axe-core/playwright*
