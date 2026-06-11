# ADR-001: Tema Visual Treasure Planet (Ciano + Preto)

**Status:** Aceito
**Data:** 2026-06-11

## Contexto
Mission Control é o portfólio profissional de Samuel. Precisava de uma identidade visual marcante, cinematográfica, que fugisse do padrão "dev portfolio genérico".

Alternativas consideradas: tema clean white/minimalista, dark padrão (Dracula, One Dark), tema retrô synthwave.

## Decisão
Tema visual inspirado no filme **Treasure Planet** (Planeta do Tesouro):
- **Cores primárias:** Cyan (#00d4ff) + preto (#0a0a0f)
- **Estilo:** cinematográfico, com letterbox (barras pretas 16:9) e transições de cena
- **Tipografia:** bold, contrastante, com glow effects em texto
- **Ícones:** estilo "painel de nave espacial" com tracking numbers e UI de sci-fi
- **Animações:** estilo "boot sequence" com scanlines e flickering CRT

A paleta ciano+preto não só remete ao filme como é agradável visualmente em dark mode e contrasta com o mar de portfolios de dev (azul escuro ou branco).

## Consequências
- Positivo: identidade única e reconhecível
- Positivo: tema escuro = agradável para leitura noturna
- Positivo: animações cinematográficas causam boa impressão
- Negativo: pode não agradar recrutadores mais tradicionais
- Negativo: animações pesadas precisam de `prefers-reduced-motion`
