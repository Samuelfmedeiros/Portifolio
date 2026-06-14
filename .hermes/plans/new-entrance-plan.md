# 🛸 Portifolio Samuel — Plano de Melhorias Completas

> Gerado: 14/06/2026
> Contexto: Samuel pediu recomeço do zero após múltiplas tentativas frustradas de splash/animação de entrada.

---

## Diagnóstico Atual

### O que foi tentado (e rejeitado):
1. **Tatu cavando buraco negro** — SVG complexo, arquivado em `_old/`
2. **Grid Fade CSS** — atual, "muito ruim"
3. **Opacity wrapper** — conflitava com stagger do hero
4. **Crossfade 200ms** — "splash muito rápido", transição ainda ruim

### Problemas raiz (o plano precisa resolver TUDO):

| # | Problema | Impacto |
|---|----------|---------|
| P1 | Splash não comunica identidade visual | Grid genérico não vende a proposta sci-fi do MC |
| P2 | Transição splash→conteúdo abrupta | Sensação de "travado" |
| P3 | Hero entrance sem impacto (stagger fraca) | Conteúdo aparece sem emoção |
| P4 | Backgrounds infinitos competem no mount | Frame drops na entrada |
| P5 | Scroll-trigger abaixo do hero genérico | Seções aparecem sem personalidade |

---

## Plano de Fases

### Fase 0 — Limpeza 🧹 (pré-requisito)

**Antes de qualquer implementação:**
- [ ] Reverter TODAS as mudanças recentes de animação (AppWrapper, SplashScreen, delays)
- [ ] Voltar ao estado do commit `a321574` (antes de qualquer tentativa de splash fix)
- [ ] Ou: fazer branch nova `feat/new-entrance` e começar limpo

**Motivo:** Múltiplas camadas de patch sobre patch criaram interdependências frágeis. Começar limpo evita carryover de bugs.

---

### Fase 1 — Hero como Ponto de Entrada 🎬

**Conceito:** Sem splash screen. O HERO É O SPLASH.

Em vez de uma tela preta com grid, a **própria seção Profile (Hero) serve como tela de entrada**. Ela já tem o visual de cockpit sci-fi — é só usar isso como "boot sequence" em vez de colocar uma tela na frente.

**Implementação:**

1. **Remover `SplashScreen.tsx`** completamente — `AppWrapper` não mostra mais splash
2. **Refatorar `AppWrapper`** — sem splash, sem `showContent` condicional. Só renderiza children.
3. **ProfileSection vira tela de boot:**
   - Estado inicial: `opacity: 0` em TODO o conteúdo textual
   - Background cockpit SVG + grid + HUD panels ficam VISÍVEIS desde o start
   - Partículas de dados sobem em background (já existem)
   - Após 400ms: HUD panels piscam "STATUS: ONLINE", "SESSIONS: 1,337" etc
   - Após 600ms: Grid background fade-in completo
   - Após 800ms: Nome "Samuel Medeiros" fadeInUp com easing forte
   - Após 1.2s: Typewriter título
   - Após 1.8s: Skills tags + botões
4. **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — o "easing forte" que Apple/Linear usam para entrada premium

**Resultado:** O usuário chega no site e vê um painel de controle "ligando" — os módulos aparecem em sequência, como uma nave inicializando sistemas. SEM tela preta, SEM transição abrupta.

---

### Fase 2 — Stagger Cinematográfico 🎯

**Conceito:** Substituir a stagger atual (0.3s entre itens, linear) por uma sequência coreografada com easing premium.

**Easing de entrada:** `cubic-bezier(0.16, 1, 0.3, 1)`
- Começo rápido (visível imediatamente)
- Desaceleração suave no final (sem "tranco")

**Timeline da entrada:**

| Tempo | Elemento | Animação | Duração |
|-------|----------|----------|---------|
| 0ms | Cockpit SVG + Grid bg | Já visível (fade-in background) | — |
| 400ms | HUD panels (STATUS, SESSIONS) | Opacity flicker (já existe) | 0.4s |
| 600ms | Grid bg completa | Opacity 1 | 0.2s |
| 700ms | Linhas de circuito começam | strokeDashoffset animado | ∞ (delay 0.7s) |
| 800ms | "Samuel" | y: 30→0, opacity: 0→1 | 0.8s |
| 1.1s | "Medeiros" (destaque cyan) | y: 30→0, opacity: 0→1 | 0.8s |
| 1.3s | Divider cyan | scaleX: 0→1, opacity: 0→1 | 0.5s |
| 1.5s | TypeWriter título | opacity: 0→1 (já typewriter) | 0.6s + typing |
| 1.8s | Description text | y: 20→0 | 0.5s |
| 2.0s | Skills tags (stagger 0.08s) | scale: 0.9→1, opacity: 0→1 | 0.4s each |
| 2.5s | Botões CTA | y: 20→0 | 0.5s |
| 3.0s | Scroll indicator | opacity: 0→1 | 1s |

**Total:** ~3s até tudo visível, mas o usuário vê progresso contínuo a cada 200-400ms.

**O que muda do código atual:**
- ProfileSection: `initial="hidden"` + `animate="visible"` com `variants` + `staggerChildren` em vez de `initial`/`animate` individuais
- Usar `useAnimation()` com timeline ou um state `phase` que avança

---

### Fase 3 — Background Sem Competição 🌌

**Conceito:** Background effects (DataParticles, CircuitLines, FloatingHexagons, HUDDataPanels) só começam DEPOIS da entrada do hero.

**Implementação:**

1. **Wrapper `BackgroundLayer`** que recebe `delay={2500}` — todos os backgrounds infinitos ficam DENTRO
2. `BackgroundLayer` usa `useAnimation` com delay de 2.5s
3. Partículas de dados têm delay mínimo de 2.5s (aleatório +2.5s)
4. CircuitLines: só animam após 2.5s
5. Hexágonos flutuantes: delay 2.5s + individual

**Resultado:** Durante os primeiros 2.5s, só o hero está animando. Backgrounds entram depois, sem competição.

---

### Fase 4 — Scroll-Trigger com Personalidade 📜

**Conceito:** Cada seção abaixo do hero não é só "fadeInUp" — cada uma tem micro-personalidade.

| Seção | Entrada |
|-------|---------|
| Projetos | stagger nos cards (0.08s) + escala (0.95→1) + border glow |
| Terminal | typewriter aparece linha por linha |
| Contato | Campos aparecem da esquerda para direita |
| Footer | fade simples (menos importante) |

**FadeInSection** já existe e funciona. Só precisa de:
- `delay` progressivo por seção (já implementado)
- `easing` melhorado para `[0.16, 1, 0.3, 1]`
- `distance` maior (40px em vez de 30px)

---

### Fase 5 — Navbar e Transições de Seção 🧭

**Conceito:** Navbar não surge imediatamente — aparece após o hero entrance estar completa (~3s).

- Navbar `initial={{ y: -80 }}` com `delay: 3`
- Scroll suave entre seções com `scroll-behavior: smooth` (já existe)
- Back-to-top button aparece só após scroll abaixo do hero

---

## Resumo do Timeline Final

```
0s      1s       2s       3s       4s
│       │        │        │        │
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
├─ HUD boot ─┤
│            ├─ Hero stagger ──────┤
│                                  ├─ Backgrounds lentos ──→
│                                  ├─ Navbar surge ──→
│                                                 ├─ Scroll sections → (user decide)
```

---

## Arquivos que precisam mudar

| Arquivo | O que muda |
|---------|------------|
| `AppWrapper.tsx` | Remover splash logic, sem condicional de content |
| `SplashScreen.tsx` | **DELETAR** — não precisa mais |
| `SplashScreen.test.tsx` | **DELETAR** junto |
| `ProfileSection.tsx` | Adicionar `phase` state machine para entrada sequencial |
| `ProfileSection.tsx` | Background effects ganham wrapper de delay |
| `FadeInSection.tsx` | Easing melhorado, distance maior |
| `Navbar.tsx` | Adicionar `delay: 3` no animate |
| `page.tsx` | Ajustar delays dos FadeInSection wrappers |
| `globals.css` | Remover `splashFade` keyframe (se não usado mais) |
| `AppWrapper.test.tsx` | Atualizar testes para novo comportamento |

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Sem splash = perda de identidade visual | Hero com cockpit + HUD já é a identidade — não precisa de tela preta |
| Hero sem splash = conteúdo aparece cedo demais | State machine com `opacity: 0` inicial controla timing |
| Usuário fecha antes de ver tudo | Primeiro elemento visível em 400ms (HUD) — rápido o suficiente |
| Perda de "visited" state (2ª visita) | SessionStorage mantém — na 2ª visita, hero entra mais rápido (delays reduzidos) |
| Muita complexidade de estado | Manter simples: `useState<phase>` com 4-5 fases, setTimeout avança |

---

## Próximos passos

Se você aprovar o plano, posso:
1. Criar branch `feat/new-entrance` 
2. Implementar Fase 1-3 em sequência
3. Testar (242 testes têm que continuar passando)
4. Subir staging no Capivara pra você ver antes do deploy

> ⚠️ **Importante:** Isso é um PLANO. Não executei nada ainda — só pesquisei, analisei e documentei. Me avisa se quer ajustar algo ou se posso começar.
