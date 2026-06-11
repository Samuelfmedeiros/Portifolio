# Rive Editor Guide — Tatu Character Design

Este documento contém todas as referências visuais e paths do SVG do Tatu
para facilitar a recriação no Rive Editor.

---

## 🎨 Paleta de Cores

| Token               | Cor       | Uso                       |
|---------------------|-----------|---------------------------|
| `--accent`          | `#22d3ee` | Cyan (detalhes, olho)     |
| `--accent-alt`      | `#6366f1` | Indigo (rabo, cabeça)     |
| Shell gradient      | `#1a1a2e` → `#0f0f1a` | Casco principal |
| Head fill           | `#1a1a2e` | Cabeça                    |
| Legs                | `#2d2d4a` | Pernas                    |

---

## 📐 Paths do SVG (referência exata)

### Casco (Shell) — corpo principal
```
M 55,48 C 55,20 72,10 98,12 C 118,14 130,26 130,48
C 130,64 120,74 100,76 C 72,78 55,68 55,48 Z
```
- Fill: gradient `#1a1a2e`→`#2d2d4a`→`#0f0f1a`
- Stroke: `#22d3ee` 0.8px

### Brilho do Casco (Shell Highlight)
```
M 60,48 C 60,24 74,14 98,16 C 114,17 126,27 126,48
```
- Stroke: gradient shellTop (cyan→indigo→transparent) 2px
- Opacity: 0.3

### Segmentos do Casco (4 linhas verticais)
```
Linha 1: (68,14)→(68,74)
Linha 2: (84,11)→(84,76)
Linha 3: (100,11)→(100,76)
Linha 4: (116,15)→(116,72)
```
- Stroke: gradient bandShine, 1.2px

### Pontos de Acento (4 círculos)
```
Ponto 1: cx=72  cy=22  r=1.2  fill=#22d3ee  opacity=0.4
Ponto 2: cx=88  cy=68  r=1.2  fill=#22d3ee  opacity=0.5
Ponto 3: cx=104 cy=22  r=1.2  fill=#22d3ee  opacity=0.6
Ponto 4: cx=120 cy=68  r=1.2  fill=#22d3ee  opacity=0.7
```

### Cabeça (Head)
```
M 55,48 C 50,30 38,24 28,26 C 18,28 10,34 8,42
C 6,50 14,54 24,54 C 34,54 45,54 55,48 Z
```
- Fill: `#1a1a2e`
- Stroke: `#6366f1` 0.8px

### Focinho (Snout)
```
M 8,42 C 3,43 0,43 0,44
```
- Stroke: `#22d3ee` 2px, round cap
- Ponto na ponta: cx=1 cy=44 r=1 fill=#22d3ee opacity=0.6 blur 1px

### Olho (Eye)
```
Círculo externo: cx=28 cy=33 r=2.5 fill=#22d3ee
Círculo interno: cx=28 cy=33 r=1   fill=white
Glow:            cx=28 cy=33 r=5   fill=#22d3ee opacity=0.12 blur 3px
```

### Orelha (Ear)
```
M 35,25 C 33,18 35,14 40,16 C 44,18 42,24 38,26
```
- Fill: `#2d2d4a`
- Stroke: `#6366f1` 0.6px

### Rabo (Tail)
```
M 117,52 C 130,48 140,32 143,22 C 145,16 147,14 145,18
```
- Stroke: `#6366f1` 3.5px, round cap
- No fill

### Perna Traseira (Back Leg)
```
M 100,72 L 100,88 Q 100,92 104,90
```
- Stroke: `#2d2d4a` 5px, round cap
- No fill

### Perna Dianteira (Front Leg)
```
M 70,72 L 70,88 Q 70,92 74,90
```
- Stroke: `#2d2d4a` 5px, round cap
- No fill

### Sombra (Shadow)
```
Ellipse: cx=80 cy=86 rx=35 ry=6
```
- Fill: rgba(0,0,0,0.3) blur 4px
- Ocultar no burst (isBurst=true)

---

## 🦴 Estrutura de Bones/Grupos (sugerida)

```
Root (150×100)
├── ShadowGroup
│   └── Shadow
├── TatuGroup (centro ~75,50)
│   ├── Tail
│   │   └── TailPath (bone: tailBone)
│   ├── BodyGroup
│   │   ├── Shell (bone: bodyBone)
│   │   ├── ShellHighlight
│   │   ├── ShellBand1 (bone: band1)
│   │   ├── ShellBand2 (bone: band2)
│   │   ├── ShellBand3 (bone: band3)
│   │   ├── ShellBand4 (bone: band4)
│   │   ├── Dot1
│   │   ├── Dot2
│   │   ├── Dot3
│   │   └── Dot4
│   ├── HeadGroup (bone: neckBone)
│   │   ├── Head
│   │   ├── Snout
│   │   ├── Eye
│   │   ├── EyeGlow
│   │   └── Ear
│   ├── BackLegGroup (bone: backLegBone)
│   │   └── BackLeg
│   └── FrontLegGroup (bone: frontLegBone)
│       └── FrontLeg
```

---

## 🎞️ Keyframe Guide por Animação

### `idle` (loop, 2s)
| Tempo | Bone            | Propriedade            | Valor       |
|-------|-----------------|------------------------|-------------|
| 0s    | bodyBone        | Y                      | 0           |
| 1s    | bodyBone        | Y                      | -2px        |
| 2s    | bodyBone        | Y                      | 0           |
| 0s    | backLegBone     | Rotation               | -5°         |
| 1s    | backLegBone     | Rotation               | 5°          |
| 2s    | backLegBone     | Rotation               | -5°         |
| 0s    | frontLegBone    | Rotation               | 5°          |
| 1s    | frontLegBone    | Rotation               | -5°         |
| 2s    | frontLegBone    | Rotation               | 5°          |
| —     | Eye             | Opacity (blink)        | 1→0→1(0.1s) |

### `Fall` (one-shot, 0.8s)
| Tempo | Bone            | Propriedade            | Valor                    |
|-------|-----------------|------------------------|--------------------------|
| 0s    | TatuGroup       | Y                      | -100px (fora da tela)    |
| 0.8s  | TatuGroup       | Y                      | 0 (posição final)        |
| 0s    | TatuGroup       | Opacity                | 0                        |
| 0.2s  | TatuGroup       | Opacity                | 1                        |
| 0s    | tailBone        | Rotation               | -20°                     |
| 0.4s  | tailBone        | Rotation               | 10°                      |
| 0.8s  | tailBone        | Rotation               | 0°                       |

### `Walk` (loop, 0.5s)
| Tempo | Bone            | Propriedade            | Valor       |
|-------|-----------------|------------------------|-------------|
| 0s    | backLegBone     | Rotation               | -20°        |
| 0.25s | backLegBone     | Rotation               | 20°         |
| 0.5s  | backLegBone     | Rotation               | -20°        |
| 0s    | frontLegBone    | Rotation               | 20°         |
| 0.25s | frontLegBone    | Rotation               | -20°        |
| 0.5s  | frontLegBone    | Rotation               | 20°         |
| 0s    | bodyBone        | Y                      | 0           |
| 0.25s | bodyBone        | Y                      | -2px        |
| 0.5s  | bodyBone        | Y                      | 0           |
| 0s    | headBone/neck   | Y                      | 0           |
| 0.25s | headBone/neck   | Y                      | -1px        |
| 0.5s  | headBone/neck   | Y                      | 0           |

### `Dig_1` / `Dig_2` / `Dig_3` (one-shot, 0.3s cada)
| Tempo | Bone            | Propriedade            | Valor (1/2/3)            |
|-------|-----------------|------------------------|--------------------------|
| 0s    | frontLegBone    | Rotation               | 0° / 0° / 0°             |
| 0.15s | frontLegBone    | Rotation               | 30° / 40° / 50°          |
| 0.3s  | frontLegBone    | Rotation               | 0° / 0° / 0°             |
| 0s    | backLegBone     | Rotation               | 0° / 0° / 0°             |
| 0.15s | backLegBone     | Rotation               | -30° / -35° / -40°       |
| 0.3s  | backLegBone     | Rotation               | 0° / 0° / 0°             |
| 0s    | bodyBone        | Y                      | 0 / 0 / 0                |
| 0.15s | bodyBone        | Y                      | 3 / 5 / 8                |
| 0.3s  | bodyBone        | Y                      | 0 / 0 / 0                |
| 0s    | Shell           | Scale Y                | 1 / 1 / 1                |
| 0.15s | Shell           | Scale Y                | 1.05 / 1.08 / 1.12       |
| 0.3s  | Shell           | Scale Y                | 1 / 1 / 1                |
| —     | Dust particles  | (partículas saindo)    | Quantidade crescente 1→3 |

### `Recoil` (one-shot, 0.2s)
| Tempo | Bone            | Propriedade            | Valor        |
|-------|-----------------|------------------------|--------------|
| 0s    | TatuGroup       | X                      | 0            |
| 0.1s  | TatuGroup       | X                      | 15px (pra trás) |
| 0.2s  | TatuGroup       | X                      | 0            |
| 0s    | Eye             | Scale X                | 1            |
| 0.1s  | Eye             | Scale X                | 1.5          |
| 0.2s  | Eye             | Scale X                | 1            |
| 0s    | bodyBone        | Y                      | 0            |
| 0.1s  | bodyBone        | Y                      | -5px (pulo)  |
| 0.2s  | bodyBone        | Y                      | 0            |

### `Burst` (one-shot, 0.6s)
| Tempo | Bone            | Propriedade            | Valor           |
|-------|-----------------|------------------------|-----------------|
| 0s    | TatuGroup       | Scale                  | 1               |
| 0.6s  | TatuGroup       | Scale                  | 1.5             |
| 0s    | TatuGroup       | Opacity                | 1               |
| 0.6s  | TatuGroup       | Opacity                | 0               |
| 0s    | Shell           | Stroke                 | #22d3ee 0.8px   |
| 0.3s  | Shell           | Stroke                 | #22d3ee 3px     |
| 0.6s  | Shell           | Stroke                 | #22d3ee 0px     |
| —     | Energy particles| (partículas em espiral) | saindo do centro |

---

## ⚡ Dicas para o Rive Editor

1. **Use bone constraints** para conectar as pernas ao corpo — assim
   quando o corpo se move, as pernas acompanham.
2. **Nested artboards** não são necessários — um artboard único com
   grupos/bones é suficiente.
3. **Easing:** use cubic-bezier(0.25, 0.46, 0.45, 0.94) para
   animações de entrada/saída (mesmo easing do projeto).
4. **Partículas de poeira:** crie shapes pequenos e use opacity timeline
   para fazê-los aparecer/desaparecer durante as cavadas.
5. **Teste no navegador:** após exportar o .riv, use a ferramenta de
   preview do Rive Editor ou monte localmente com `npm run dev`.

---

## ✅ Checklist de Verificação

- [ ] Artboard: `TatuArtboard` (150×100)
- [ ] State Machine: `State Machine 1`
- [ ] Inputs: `CavarGatilho` (trigger), `Andando` (bool), `Revelado` (bool)
- [ ] Animações: `idle`, `Fall`, `Walk`, `Dig_1`, `Dig_2`, `Dig_3`, `Recoil`, `Burst`
- [ ] Transições configuradas na State Machine
- [ ] Exportado como **Rive Runtime Binary (.riv)**
- [ ] Arquivo salvo em `public/riv/tatu.riv`
- [ ] Build local `npm run build` passa
