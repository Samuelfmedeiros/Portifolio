# Decisão de Design — consentimento de cookies

Antes: botão "OK" ambíguo no banner, sem foco visível e sem aria-label.

Depois: botão "Aceitar" / "Accept", foco visível, aria-label e contraste AA.

## Variante A — preenchimento ciano
Botão sólido ciano, texto escuro. Escolhida: destaque claro no consentimento.

## Variante B — contorno ciano
Botão com borda ciano e fundo transparente. Descartada: contraste menor em mobile.

## Variante C — ghost (descartada)
Sem borda e sem preenchimento. Descartada: falha no critério de foco visível.

Arquivo tocado: src/components/CookieBanner.tsx

Critério de aceite: suíte Vitest verde, VRT estável, foco visível no teclado.
