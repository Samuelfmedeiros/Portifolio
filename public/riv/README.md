# Rive Animation — Tatu Armadillo

Este diretório contém o arquivo `.riv` (Rive Runtime) usado no Mission Control para
a animação de boot do Tatu bola.

---

## 🚨 ARQUIVO .riv AUSENTE

O arquivo `tatu.riv` **não existe** e precisa ser criado no Rive Editor.

**Enquanto o .riv não existir:**
- O SplashScreen usa o SVG inline com animações CSS/Framer Motion (fallback)
- O componente `TatuRive` tenta carregar `/riv/tatu.riv` e mostra "RIVE OFFLINE" se falhar

---

## 🎬 Como criar o .riv

### 1. Acesse o Rive Editor

- Web: https://rive.app
- Ou baixe o desktop app em https://rive.app/download

### 2. Crie um novo arquivo

- **Resolution:** 150 × 100 (mesmo tamanho do SVG)
- **Artboard name:** `TatuArtboard` (ou o padrão)

### 3. Importe os paths do SVG

Use o SVG em `public/tatu-armadillo.svg` como referência visual.
No Rive Editor, desenhe os shapes manualmente ou cole o SVG como texto e converta.

#### Estrutura do personagem (grupos/nomes recomendados):

| Grupo/Nome       | Descrição                      | Cor / Estilo                   |
|------------------|--------------------------------|--------------------------------|
| `Shadow`         | Sombra no chão                 | rgba(0,0,0,0.3) blur 4px      |
| `Tail`           | Rabo curvo                     | stroke #6366f1 3.5px           |
| `BackLeg`        | Perna traseira                 | stroke #2d2d4a 5px             |
| `Shell`          | Casco principal (corpo)        | fill #1a1a2e→#0f0f1a grad     |
| `ShellHighlight` | Brilho superior do casco       | stroke url(#shellTop) 2px      |
| `ShellBand1-4`   | Segmentos verticais do casco   | stroke #22d3ee/cyan 1.2px      |
| `ShellDots1-4`   | Pontos de acento nos segmentos | fill #22d3ee r=1.2             |
| `Head`           | Cabeça                         | fill #1a1a2e + stroke #6366f1  |
| `Snout`          | Focinho                        | stroke #22d3ee 2px             |
| `Eye`            | Olho                           | fill #22d3ee r=2.5 + white r=1 |
| `Ear`            | Orelha                         | fill #2d2d4a + stroke #6366f1  |
| `FrontLeg`       | Perna dianteira                | stroke #2d2d4a 5px             |

### 4. Crie as animações

No Rive Editor, crie estas animações (Animation Timeline):

#### `idle` (loop)
- Tatu parado, respiração suave
- Cascos sobem/descem ~2px (loop 2s)
- Olho piscando ocasionalmente

#### `Fall` (one-shot)
- Tatu caindo de cima (topo do artboard → posição normal)
- Duration: ~0.8s
- Ease: ease-out
- Rabo balançando durante a queda

#### `Walk` (loop)
- Pernas alternando (front/back leg cycle)
- Cascos balançando levemente lado a lado
- Cabeça com leve bounce up/down
- Ra bo acompanhando o movimento
- Duration: ~0.5s por ciclo

#### `Dig_1` (one-shot) — primeira cavada
- Tatu empurra o chão com as patas dianteiras
- Casco levanta ligeiramente
- Partículas de poeira saindo

#### `Dig_2` (one-shot) — segunda cavada (mais forte)
- Movimento mais amplo que Dig_1
- Tatu inclina mais o corpo
- Mais partículas

#### `Dig_3` (one-shot) — terceira cavada (mais forte)
- Movimento máximo
- Tatu quase enterrando a cabeça
- Muitas partículas

#### `Recoil` (one-shot)
- Tatu dá um pequeno pulo pra trás (surpresa)
- Olho abre mais
- Duração: ~0.3s

#### `Burst` (one-shot)
- Tatu se abre/expande (transição pro reveal)
- Partículas de energia saindo do casco
- Glitch effect
- Duração: ~0.6s

### 5. Monte a State Machine

Crie uma State Machine chamada **`State Machine 1`** (ou outro nome, mas
atualize no `TatuRive.tsx` se mudar).

#### Inputs

| Input Name      | Type    | Descrição                                    |
|-----------------|---------|----------------------------------------------|
| `CavarGatilho`  | Trigger | Dispara a sequência de cavar (Dig_1→2→3)     |
| `Andando`       | Boolean | true → animação de Walk; false → idle        |
| `Revelado`      | Boolean | true → transição pro Burst/Reveal            |

#### Transições (entrada/saída)

```
[idle] ──(Andando=true)──→ [Walk]
 [idle] ──(CavarGatilho)──→ [Dig_1] ──auto──→ [idle]
 [Walk] ──(Andando=false)─→ [idle]
 [Walk] ──(CavarGatilho)──→ [Dig_1] ──auto──→ [Walk]
 [idle] ──(Revelado=true)──→ [Recoil] ──auto──→ [Burst]
 [Walk] ──(Revelado=true)──→ [Recoil] ──auto──→ [Burst]
[Dig_X] ──(Revelado=true)──→ [Recoil] ──auto──→ [Burst]
```

**Nota sobre CavarGatilho + 3 variações:**  
Use uma variável interna no Rive (counter ou random) pra alternar entre
Dig_1, Dig_2 e Dig_3 cada vez que CavarGatilho for disparado.
Ou crie 3 triggers separados (Cavar1, Cavar2, Cavar3) — mas o componente
atual espera um único trigger `CavarGatilho` e gerencia o contador via
`digCount` no React.

### 6. Exporte

No Rive Editor: **File → Export → Rive Runtime Binary (.riv)**

Salve como `tatu.riv` neste diretório (`public/riv/tatu.riv`).

---

## 🔧 Integração técnica

### Componentes

| Componente      | Arquivo                          | Função                                    |
|-----------------|----------------------------------|-------------------------------------------|
| `TatuRive`      | `src/components/TatuRive.tsx`     | Player Rive + state machine controller    |
| `SplashScreen`  | `src/components/SplashScreen.tsx` | Tela de boot com Tatu e black hole        |
| `AppWrapper`    | `src/components/AppWrapper.tsx`   | Wrapper que monta o SplashScreen          |

### Como ativar o Rive

O SplashScreen aceita `useRive={true}` como prop.
Para ativar: no `AppWrapper.tsx`, mude:

```tsx
<SplashScreen key="splash" onComplete={handleComplete} />
```
para:
```tsx
<SplashScreen key="splash" onComplete={handleComplete} useRive={true} />
```

Ou implemente auto-detecção verificando se `/riv/tatu.riv` existe via fetch.

### Fallback

Quando `useRive=false` ou o .riv falha ao carregar, o SplashScreen
usa o `TatuSVG` inline (CSS + Framer Motion) — mesma qualidade visual,
apenas menos suave que o Rive.

---

## 📦 Dependências

```
@rive-app/react-canvas: ^4.29.0    (já instalada)
```

## 🔄 Próximos passos

1. [ ] Criar `tatu.riv` no Rive Editor seguindo o spec acima
2. [ ] Copiar para `public/riv/tatu.riv`
3. [ ] Ativar `useRive={true}` no AppWrapper
4. [ ] Testar o build
5. [ ] Fazer deploy
