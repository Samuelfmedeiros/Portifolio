# 🛸 Plano: Parallax Intro (integrada ao site)

> Só muda a entrada. O site fica igual.

---

## Conceito: "Cockpit Wake"

**Sem splash, sem tela preta.** O site carrega com tudo visível, mas as camadas de parallax "acordam" em sequência — como uma nave ligando os sistemas.

As camadas já existem (L0 a L3 no ProfileSection), cada uma com seu parallax. Só precisam de um **brief entrance** no mount:

```
0.0s ── Background grid aparece (opacity já no estado final)
0.0s ── Cockpit SVG aparece sutilmente (opacity 0→1, 0.4s)
0.0s ── HUD panels oscilam (já existem)
0.3s ── "Samuel" fadeInUp (já existe, delay 0)
0.6s ── "Medeiros" fadeInUp (já existe, delay 0.3)
0.8s ── Typewriter começa (já existe)
1.2s ── Skills + botões (já existem)
```

**O que muda de verdade:**
1. `SplashScreen.tsx` é removido
2. `AppWrapper` não tem mais splash — só renderiza children
3. Background parallax layers ganham um `initial={{ opacity: 0 }}` + `animate={{ opacity: 1 }}` com duração de 0.4s
4. Hero stagger permanece (já funciona)

**Resultado:** O usuário chega, vê o parallax se revelando em 0.4s, e o conteúdo fade-in por cima. É integrado, não tem "tela na frente".

---

## O que muda (mínimo)

| Arquivo | Mudança |
|---------|---------|
| `SplashScreen.tsx` | **DELETAR** |
| `SplashScreen.test.tsx` | **DELETAR** |
| `AppWrapper.tsx` | Simplificar: só renderiza children, sem state de splash |
| `ProfileSection.tsx` | Adicionar `initial={{ opacity: 0 }}` nas camadas L0-L1 (só 0→1 em 0.4s) |
| `globals.css` | Remover `splashFade` keyframe |
| `AppWrapper.test.tsx` | Simplificar: testar que renderiza children |

**Hero stagger, backgrounds com delay, scroll-trigger, FadeInSection — TUDO igual.**

---

## Timeline final

```
0.0s   Site carrega
0.0s   Grid + Cockpit aparecem (opacity 0→1 em 0.4s)
0.0s   "Samuel" começa fadeInUp (0.8s)
0.3s   "Medeiros" começa
0.5s   Grid + Cockpit já visíveis (entrada completa)
0.8s   Typewriter
1.2s   Skills + botões
1.5s   Backgrounds lentos começam
```

Sem splash. Sem tela preta. O parallax É a entrada.
