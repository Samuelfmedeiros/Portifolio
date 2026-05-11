# Mission Control — Plano de Melhorias

**Data:** 2026-05-11
**Projeto:** mission-control
**Stack:** Next.js 16 + Framer Motion + Tailwind + Supabase

---

## 1. Página Sem Rolagem (Above-the-Fold)

### Problema
Hero é full-screen mas resto da página tem scroll infinito.

### Solução
Redesenhar como **single-page dashboard layout** — tudo visível em ~100vh com scroll interno por seção (snap scroll opcional):

- **Hero/Capa** — 100vh, nome + tagline + CTAs
- **Seções abaixo** — grid cards visíveis sem scroll externo
- Scroll snap suave entre seções principais

### Tarefas
- [ ] Redesenhar `src/app/page.tsx` — wrapper com `min-h-screen` e `flex-col`
- [ ] Section cards visíveis em ~100vh sem scroll externo
- [ ] Scroll smooth entre seções com `scroll-snap`

---

## 2. Menu Sem Hambúrguer (Mobile-Native)

### Problema
Mobile usa hamburger → drawer. Samuel quer navegação visível.

### Solução
- **Desktop**: nav horizontal completa (já existe)
- **Mobile**: `md:hidden` — nav horizontal compacta com ícones menores, textos abreviados
  - "Sobre" → "☀" com tooltip
  - "Projetos" → "◎" com tooltip
  - "Terminal" → "$" com tooltip
  - "Contato" → "✉" com tooltip
  - Links sociais: GitHub, LinkedIn, Mail apenas ícones

### Tarefas
- [ ] Remover hamburger menu do `Navbar.tsx`
- [ ] Criar versão mobile compacta com ícones+nomes curtos
- [ ] Tooltips em cada item de navegação

---

## 3. Mobile-First Responsivo

### Problema atual
- `min-h-screen` no Hero não garante adaptação mobile
- Grid de 4 colunas em SkillsGrid é 2-col mobile, mas não hay breakpoints intermediários
- Formulário de contato pode não funcionar em mobile

### Tarefas
- [ ] Auditar todos os breakpoints: `sm:`, `md:`, `lg:`
- [ ] Garantir que HeroSection seja legível em 320px
- [ ] Garantir `ContactForm` funcione em mobile
- [ ] `Terminal` — altura adequada em mobile
- [ ] Testar em viewport 375px e 414px

---

## 4. Testes Unitários

### Tarefas
- [ ] `src/components/__tests__/Navbar.test.tsx` — nav links, theme toggle
- [ ] `src/components/__tests__/HeroSection.test.tsx` — título visível, CTAs
- [ ] `src/components/__tests__/SkillsGrid.test.tsx` — grid renderiza cards
- [ ] `src/components/__tests__/ContactForm.test.tsx` — form submission, validação
- [ ] Coverage: mínimo 60% em componentes de UI

---

## 5. Testes E2E (Playwright)

### Tarefas
- [ ] `tests/navigation.spec.ts` — nav links funcionam, scroll para seções
- [ ] `tests/terminal.spec.ts` — terminal aceita comandos, responde
- [ ] `tests/contact.spec.ts` — form envia (mock Supabase)
- [ ] `tests/theme.spec.ts` — toggle de tema funciona
- [ ] Mobile viewport: `375x812` (iPhone)

---

## 6. Melhorias de Código

### Tarefas
- [ ] Corrigir IDs duplicados (`#about` em CoreEngine E AboutTimeline)
- [ ] Adicionar `scroll-padding-top` no `html` pra navbar fixa
- [ ] Extrair constantes (NAV_ITEMS, SKILLS_DATA, etc) pra arquivos separados
- [ ] Tipar props dos componentes com TypeScript
- [ ] Remover `as any` de qualquer lugar
- [ ] Adicionar error boundaries onde faltam

---

## 7. Novas Funções

- [ ] **Keyboard shortcuts** — `?` mostra shortcuts, `t` toggle tema, `j/k` navegação
- [ ] **Smooth scroll progress indicator** — barra no topo mostrando progresso da página
- [ ] **Copy email** — botão de copiar email no Contact
- [ ] **Minimap** — mini navegação lateral showing posição na página
- [ ] **Particles background** — background animado no hero (substituir ou complementar parallax)

---

## 8. Melhorar Funções Existentes

- [ ] **Terminal** — mais comandos úteis (`help`, `ls`, `whoami`, `clear`, `theme`)
- [ ] **ProjectHangar** — filtro por linguagem, ordenação
- [ ] **SkillsGrid** — tooltip com descrição da skill ao hover
- [ ] **ThemeToggle** — animação de transição melhor

---

## 9. Multi-Agente — Divisão de Trabalho

| Agente | Responsabilidade |
|--------|-----------------|
| **Agent-UI** | Layout, Navbar, Mobile, Responsividade, Hero |
| **Agent-Tests** | Unit tests (Vitest), E2E tests (Playwright) |
| **Agent-Funcional** | Novas funções, melhorias de Terminal/Projects/Skills |
| **Agent-Code** | Code quality, TypeScript, error boundaries, constants |

---

## 10. Prints das Mudanças

- Antes → Depois de cada feature
- Screenshot do mobile (375px)
- Screenshot do desktop (1280px)

---

## Problemas Conhecidos (a corrigir)

1. `id="about"` duplicado em CoreEngine e AboutTimeline
2. Navbar fixa sobrepõe headings ao scroll (falta `scroll-padding`)
3. Hamburger menu não é mobile-native
4. Long-scroll não é "above-the-fold friendly"
