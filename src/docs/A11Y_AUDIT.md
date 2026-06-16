# ♿ Acessibilidade — Audit Report

**Data:** 16/06/2026 (atualizado)
**Ferramenta:** axe-core 4.11 (via @axe-core/playwright) + testes manuais de teclado
**Páginas auditadas:** `/` (Home), `/privacidade`, `/termos`

---

## ✅ Resumo

| Métrica | Resultado |
|---------|-----------|
| Violações **críticas** | 0 ✅ |
| Violações **sérias** | **color-contrast** (apenas em light mode — não bloqueante) |
| Violações **moderadas** | **region** (footer não encapsulado em landmark) |
| **Skip Link** | ✅ Presente, funcional, target `#main-content` focusável com `tabIndex={-1}` |
| **aria-labels** | ✅ Navegação, botões, links com labels descritivos |
| **Imagens sem alt** | 0 ✅ |
| **Botões sem texto** | 0 ✅ |
| **heading hierarchy** | ✅ h1 → h2 → h3 → h4 sem pulos |
| **tab order** | ✅ Skip link → Logo → Nav → GitHub → Tema → Paleta → Conteúdo principal |
| **keyboard navigation** | ✅ Skip link visível no focus, Tab/Enter/Space em elementos interativos |
| **contraste geral** | ⚠️ Light mode: textos cyan sobre fundo claro têm contraste insuficiente |

---

## 🛠️ Correções Aplicadas (16/06)

### Navbar — `aria-required-children` (CRÍTICO — RESOLVIDO)
- **Problema:** `<div role="list">` com filhos `<a>` sem `role="listitem"` — build desatualizada mantinha versão antiga
- **Correção:** Rebuild limpo forçou compilação do `<ul>` semântico com `<li>` filhos

### Skip Link — Target não focusável (SÉRIO — RESOLVIDO)
- **Problema:** `#main-content` existia mas não era focusável → axe-core reportava skip-link sem target
- **Correção:** Adicionado `tabIndex={-1}` ao `<main id="main-content">`

### Heading Hierarchy — h1 → h3 → h4 (MODERADO — RESOLVIDO)
- **Problema:** Seções usavam `h3` ("▸ HABILIDADES", "▸ JORNADA") quando deveriam ser `h2`
- **Correção:** Alterado `motion.h3` → `motion.h2` (2 ocorrências), e timeline items `h4` → `h3`

---

## ⚠️ Violações Remanescentes

### 1. Contraste de Cores (SÉRIO — apenas em light mode)

O tema claro do portfólio herda cores primárias do tema escuro (cyan), resultando em contraste baixo sobre fundo claro.

| Elemento | Contraste | Ratio Mínimo |
|----------|-----------|--------------|
| "Ver Projetos" — `#e7f1f8` on `#72badf` | 1.87:1 | 4.5:1 |
| Títulos de seção — `#0284c7` on `#f5f7fa` | 3.81:1 | 4.5:1 |
| Textos secundários — `#64748b` on `#f5f7fa` | 4.43:1 | 4.5:1 |

**Recomendação:** Revisar paleta de cores do light mode para garantir WCAG AA. Especificamente:
- Evitar usar `var(--accent)` (cyan) como cor de texto em fundo claro
- Aumentar contraste de `var(--text-secondary)` no tema claro

### 2. Landmarks — Conteúdo não encapsulado (MODERADO)

O footer (`<Footer />`) contém headings (`Samuel Medeiros`, `Redes`, `Currículo`, `Proteção de Dados`) que não estão dentro de uma landmark semântica (`<footer role="contentinfo">` não encapsula headings de forma correta na ótica do axe).

**Recomendação:** Envolver conteúdo informacional do footer em `<section>` com `aria-label` ou ajustar estrutura de landmarks.

---

## ✅ Boas Práticas Presentes

- ✅ **SkipLink**: `Pular para conteúdo` no topo, visível no focus via `focus:not-sr-only`
- ✅ **Navbar**: `aria-label="Navegação principal"`, `aria-current` no item ativo
- ✅ **Mobile nav**: `<ul>` semântico com `aria-label="Navegação mobile"`
- ✅ **BackToTop**: `aria-label="Voltar ao topo"`
- ✅ **GitHub link**: `aria-label="GitHub"`
- ✅ **ThemeToggle**: `aria-label="Trocar paleta de cores"` / `"Ativar modo escuro"`
- ✅ **PalettePicker**: `aria-label="Trocar paleta de cores"`
- ✅ **heading hierarchy**: h1 → h2 → h3 consistente
- ✅ **Role="button"** em cards clicáveis com `tabIndex={0}` e keydown handlers
- ✅ **aria-hidden="true"** em SVGs decorativos, partículas, ícones
- ✅ **HTML lang**: `lang="pt-BR"` no `<html>`
- ✅ **main landmark**: `<main id="main-content">`
- ✅ **Font display**: `swap` para evitar FOIT
- ✅ **Touch**: `touch-action: manipulation` no `<body>` para remover delay 300ms
- ✅ **Tab order**: Skip link primeiro foco, seguido por logo → navegação → ações → conteúdo

---

## 📊 Scores axe-core

| Página | Críticas | Sérias | Moderadas | Total |
|--------|----------|--------|-----------|-------|
| / | 0 | 1 (contraste) | 1 (region) | 2 |
| /privacidade | 0 | 1 (contraste) | 1 (region) | 2 |
| /termos | 0 | 1 (contraste) | 1 (region) | 2 |

---

*Audit gerado automaticamente com @axe-core/playwright 4.11*
