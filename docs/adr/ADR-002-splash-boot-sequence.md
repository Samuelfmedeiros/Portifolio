# ADR-002: Splash Estilo Boot Sequence

**Status:** Aceito
**Data:** 2026-06-11

## Contexto
A splash do Portifolio Samuel precisava ser impactante e condizente com o tema Treasure Planet. A primeira versão usava o Tatu animado (herdado de conceito do Dogwalk), mas não combinava com o "painel de controle" do portfólio.

Alternativas consideradas: manter splash Tatu (fora de tema), loading spinner minimalista, animação de foguete.

## Decisão
Splash estilo **boot sequence de nave espacial**:
- Texto estilo terminal bootando módulos (`INITIALIZING CORE SYSTEMS...`, `LOADING NAVIGATION...`)
- Scanlines e flickering estilo CRT antigo
- Progress bar animada
- Transição com fade/glitch para o conteúdo principal
- Background preto com texto ciano (cores do tema)

O efeito remete a "ligar o painel de comando" da nave — consistente com o nome "Portifolio Samuel".

## Consequências
- Positivo: coerente com a identidade visual
- Positivo: experiência memorável de entrada
- Negativo: tempo extra de splash (2-3 segundos) pode irritar usuários frequentes
- Negativo: skip button implementado para reduzir atrito
