# 📦 OLD_STUFF — Histórico de Arquivos Consolidados (Portifolio)

> Arquivos removidos da estrutura em 18/07/2026.
> Conteúdo útil preservado aqui para referência histórica.

---

## 📊 .hermes/plans/ — Planos de Melhoria (18/07/2026)

### acceleration-plan.md
Plano de aceleração do Portifolio — melhorias de performance e UX.
**Status:** Implementado (animações otimizadas, lazy loading ativo)

### melhorias-portfolio.md
Lista de melhorias planejadas para o Portifolio v2.
**Status:** Itens implementados ou migrados para GitHub Issues

### new-entrance-plan.md
Plano para nova tela de entrada do Portifolio.
**Status:** Substituído pelo splash sequence (ADR-002)

### parallax-intro-plan.md
Plano de introdução com parallax.
**Status:** Substituído pelo splash boot sequence (ADR-002)

### splash-only-plan.md
Plano simplificado de splash screen.
**Status:** Substituído pelo splash boot sequence (ADR-002)

---

## 📊 docs/STRIPE_PORTIFOLIO.md (mantido)
Documentação de integração Stripe do Portifolio.
**Status:** Mantido ativo — referência de configuração de pagamento

---

*Fim do OLD_STUFF.md — Documentos preservados para consulta histórica.*

---
## ADR-001: Tema Treasure Planet (Deprecado)

# ADR-001: Tema Visual Treasure Planet (Ciano + Preto)

**Status:** Deprecado — arquivado por decisão de Samuel (2026-06-11)
**Data:** 2026-06-11

## Contexto
Portifolio Samuel é o portfólio profissional de Samuel. Precisava de uma identidade visual marcante, cinematográfica, que fugisse do padrão "dev portfolio genérico".

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
