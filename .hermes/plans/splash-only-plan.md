# 🛸 MC Splash — Plano de Melhorias (Só a splash)

> Gerado: 14/06/2026
> Foco: **Apenas o SplashScreen**. Site não muda.

---

## Diagnóstico

**Splash atual:** Tela preta + grid cyan que fade in/out em 1.2s. Genérica — não comunica "Mission Control" nem "Samuel Medeiros".

**O que o usuário quer:** Uma splash que:
- Tenha personalidade (sci-fi, HUD, painel de controle)
- Seja cinematográfica (não "fraca")
- Tenha duração confortável (não "muito rápido")
- Transição suave pro conteúdo

---

## Proposta: MISSION CONTROL BOOT SEQUENCE

**Conceito:** Simular o boot de um sistema de nave — como o painel ligando.

**3 fases:**

### Fase 1 — Grid Power-On (0-0.8s)
- Tela preta
- Grid cyan aparece gradualmente (já existe, manter)
- **NOVO:** Cantos cyan "draw in" — moldura HUD aparecendo nas bordas

### Fase 2 — Boot Messages (0.8-2.5s)
- Texto central "MISSION CONTROL v2.0" em fonte monospace, cyan
- Abaixo, mensagens de boot aparecem tipo terminal:
  ```
  > INITIALIZING DISPLAY...          [OK]
  > LOADING NAVIGATION MODULES...    [OK]
  > CONNECTING TO DATABASE...        [OK]
  > CALIBRATING SENSORS...           [OK]
  > SYSTEM READY.
  ```
- Cada linha: fadeInLeft com ~0.3s de intervalo
- Última linha "SYSTEM READY." pisca (cursor blink)

### Fase 3 — Portal Transition (2.5-3.0s)
- Boot messages "desligam" (fadeOut rápido com flicker)
- Moldura HUD acelera pra dentro (scale)
- Grid brilha um frame
- **Tela fica branca/cyan por 1 frame** (flash de transição)
- Conteúdo aparece (hero stagger começa)

---

## Opções de Implementação

### Opção A — CSS + React State (simples)
- SplashScreen vira componente com estados: `power-on → booting → transitioning`
- Cada linha de boot é um `<p>` com CSS `@keyframes fadeInLeft + animation-delay`
- Sem framer-motion na splash (mais leve)

### Opção B — Framer Motion
- `motion.div` com `variants` e `staggerChildren` para linhas de boot
- Transições mais fluidas entre fases
- Já é dependência do projeto

**Recomendação: Opção A** — CSS puro é mais performático pra splash (não precisa de JS pra animar). Splash deve ser o mais leve possível pra não atrasar o resto.

---

## Arquivos que mudam

| Arquivo | Mudança |
|---------|---------|
| `src/components/SplashScreen.tsx` | Reescrever: HUD boot + messages + portal transition |
| `src/app/globals.css` | Adicionar keyframes: `fadeInLeftBoot`, `flickerOut`, `drawCorner` |
| `src/components/AppWrapper.tsx` | Só ajustar timing da transição (se necessário) |

**Nada mais no site muda.** Hero, seções, backgrounds, navbar — tudo igual.

---

## Timeline da Splash

```
0.0s  ── Tela preta
0.3s  ── Grid cyan fade-in
0.6s  ── Cantos HUD começam a desenhar (1s de animação)
0.8s  ── "MISSION CONTROL v2.0" fadeIn
1.1s  ── > INITIALIZING DISPLAY...
1.4s  ── > LOADING NAVIGATION MODULES...
1.7s  ── > CONNECTING TO DATABASE...
2.0s  ── > CALIBRATING SENSORS...
2.3s  ── > SYSTEM READY. (cursor pisca)
2.5s  ── Flicker out + brilho
2.8s  ── Splash some, conteúdo aparece
```

Total: ~2.8s. Boot messages dão progresso visível, mantendo atenção.

---

## Riscos

| Risco | Mitigação |
|-------|-----------|
| 2.8s muito longo | Reduzir intervalo entre msgs de 0.3s pra 0.2s = ~2.0s total |
| Typewriter parece "coisa de 2010" | Manter fadeInLeft em vez de typewriter letra-por-letra |
| Conteúdo aparece de repente no fim | Flicker + brilho + crossfade mascara a transição |
| Perda da grid (que já é fraca) | Grid mantida como base — só adiciona HUD + texto por cima |

---

## Exemplo Visual (ASCII)

```
┌──────────────────────────────────┐
│ ╔══╗ ┌──┐ ╔══╗                  │  ← Cantos HUD
│ ║  ║ │  │ ║  ║                  │
│ ╚══╝ └──┘ ╚══╝                  │
│                                  │
│        MISSION CONTROL           │  ← Texto central
│             v2.0                 │
│                                  │
│    > INITIALIZING DISPLAY... ✅  │  ← Boot msgs
│    > LOADING MODULES...      ✅  │     aparecendo
│    > CALIBRATING SENSORS...  ✅  │     uma por uma
│    > SYSTEM READY. █             │  ← Cursor piscando
│                                  │
│        ░░░░░░░░░░░░░░░░░         │  ← Grid de fundo
└──────────────────────────────────┘
```

---

Se aprovar, começo pela Opção A (CSS puro). Meio período de implementação + testes.
