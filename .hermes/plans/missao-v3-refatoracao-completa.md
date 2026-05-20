# Mission Control v3.0 — Refatoração Completa

> **Para Hermes:** Usar subagent-driven-development para implementar task por task.

**Goal:** Refatoração completa do portfólio Mission Control com vibe de nave espacial, testes, segurança, performance e documentação.

**Architecture:** Next.js 16 App Router, React 19, TypeScript, TailwindCSS 4, Framer Motion, Vitest + Playwright. Deploy Vercel (https://samuelmedeiros.vercel.app/).

**Tech Stack:** Next.js 16, React 19, TypeScript, TailwindCSS 4, Framer Motion, Vitest, Playwright, Supabase, Lucide React

---

## Agente 1 — Testes + Qualidade (agente-testes)

### Tarefa 1.1: Rodar testes existentes e baseline
- Rodar `npx vitest run` e capturar resultados
- Rodar `npx playwright test` e capturar resultados
- Documentar quais testes passam/falham

### Tarefa 1.2: Criar testes faltantes
- Criar testes para TODOS os componentes sem teste:
  - `CockpitBackground.test.tsx`
  - `CockpitBorders.test.tsx`
  - `ErrorBoundary.test.tsx`
  - `FadeInSection.test.tsx`
  - `HangarSkeleton.test.tsx`
  - `HUDOverlay.test.tsx`
  - `JsonLd.test.tsx`
  - `KeyboardShortcuts.test.tsx`
  - `LoadingSpinner.test.tsx`
  - `MissionClock.test.tsx`
  - `ParallaxBackground.test.tsx`
  - `PerspectiveGrid.test.tsx`
  - `ProjectHangar.test.tsx`
  - `ResponsiveSection.test.tsx`
  - `Scanline.test.tsx`
  - `SkipLink.test.tsx`
  - `Skeleton.test.tsx`
  - `SpeedLines.test.tsx`
  - `SplashScreen.test.tsx`
  - `StarField.test.tsx`
  - `UtilityDeck.test.tsx`
  - `DogWalkBlueprint.test.tsx`
  - `useLocalStorage.test.ts` (hooks)
  - `lib/github.test.ts`
  - `lib/supabase.test.ts`
  - `lib/types.test.ts`
  - `lib/staticProjects.test.ts`

### Tarefa 1.3: Corrigir bugs encontrados
- Fix qualquer bug encontrado nos testes
- Garantir que TODOS os testes passem

## Agente 2 — UI/UX Futurista + Menu + MiniGames (agente-ui)

### Tarefa 2.1: Eliminar menu hambúrguer → Menu integrado
- Refatorar `Navbar.tsx` para menu integrado responsivo sem hambúrguer
- Desktop: menu horizontal clean com glass effect
- Mobile: menu scrollable horizontal com ícones + labels compactos
- Manter active section indicator
- Animações suaves de hover

### Tarefa 2.2: Forçar scroll ao topo ao navegar
- Garantir que cada navegação entre seções sempre role do topo
- Adicionar `window.scrollTo({ top: 0, behavior: 'smooth' })` no handleNavClick
- Adicionar `scrollRestoration: 'manual'` no layout

### Tarefa 2.3: Criar 3 mini-games adicionais
- **Game 1 — Asteroid Dodge**: Jogo onde o usuário desvia de asteroides clicando/esquivando
- **Game 2 — Code Typing**: Digitar código rápido estilo terminal hacker
- **Game 3 — Memory Matrix**: Jogo de memória com padrões de grid futurista
- Integrar os games na seção "Terminal" ou seção dedicada "Mission Games"
- Manter o MiniGame.tsx existente (sequência lógica) como game 4

### Tarefa 2.4: Reforçar vibe de nave espacial
- Adicionar efeito de "painel de controle" nos cantos
- Sons sutis de nave (hover effects com Web Audio API)
- HUD com dados fake mais detalhados (velocidade, coordenadas, etc.)
- Adicionar seção "Mission Status" com status bar futurista
- Melhoria no CockpitBackground com mais camadas visuais

### Tarefa 2.5: Melhorar visualização dos projetos
- Refatorar `ProjectHangar.tsx` com cards mais ricos
- Adicionar preview images dos projetos
- Filtros por linguagem/tech
- Efeito de "holo-card" ao hover
- Tags de tecnologia com cores
- Layout grid mais dinâmico

### Tarefa 2.6: Melhorar navegação e velocidade
- Otimizar framer-motion animations (reduzir complexidade)
- Adicionar lazy loading para componentes pesados
- Otimizar o canvas do ParallaxBackground (reduzir stars se necessário)
- Adicionar `will-change` para elementos animados
- Implementar debouncing em scroll handlers

## Agente 3 — Segurança Completa (agente-seguranca)

### Tarefa 3.1: Audit de segurança completo
- Verificar todos os `dangerouslySetInnerHTML`
- Verificar XSS em todos os inputs (ContactForm, Terminal)
- Verificar SQL injection (Supabase queries)
- Verificar CSRF protection
- Verificar CORS headers
- Verificar que tokens/API keys não estão expostos no client
- Verificar `rel="noopener noreferrer"` em todos links externos
- Verificar Content Security Policy headers
- Verificar sanitização de inputs

### Tarefa 3.2: Implementar melhorias de segurança
- Adicionar CSP headers no next.config.ts
- Sanitizar inputs do ContactForm
- Adicionar rate limiting no contact form
- Proteger Supabase com RLS policies (já tem supabase-rls.sql)
- Adicionar helmet-like headers
- Validar e sanitizar dados do GitHub API
- Adicionar input validation em todos os forms

### Tarefa 3.3: Security Headers
- Configurar security headers no next.config.ts
- X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- Strict-Transport-Security
- Content-Security-Policy
- Referrer-Policy
- Permissions-Policy

## Agente 4 — Performance + README + Melhorias Finais (agente-perf)

### Tarefa 4.1: Otimizações de performance
- Implementar `React.memo` onde faltando
- Otimizar re-renders com `useMemo`/`useCallback`
- Code splitting para componentes pesados
- Otimizar imagens e assets
- Reduzir bundle size
- Implementar virtual scrolling se necessário

### Tarefa 4.2: Criar README.md completo
- Título e descrição do projeto
- Tech stack
- Como rodar localmente
- Estrutura do projeto
- Features
- Testes
- Deploy
- Contribuição
- Licença

### Tarefa 4.3: Melhorias gerais de código
- Padronizar imports e exports
- Melhorar tipagem TypeScript
- Adicionar JSDoc onde necessário
- Remover código morto/duplicado
- Organizar components em subdiretórios se necessário

### Tarefa 4.4: Backup final
- Rodar backup.sh full
- Verificar integridade do backup
