# Decisão de Design — consentimento e jornada visual

Antes: botão "OK" ambíguo no banner, sem foco visível e sem aria-label; jornada visual sem buraco negro.

Depois: botão "Aceitar" / "Accept" com foco visível e aria-label; jornada com parallax revisado.

## Variante A — preenchimento ciano
Botão sólido ciano, texto escuro. Escolhida: destaque claro no consentimento.

## Variante B — contorno ciano
Botão com borda ciano e fundo transparente. Descartada: contraste menor em mobile.

## Variante C — ghost (descartada)
Sem borda e sem preenchimento. Descartada: falha no critério de foco visível.

## Arquivos de UI tocados desde o merge (47ee019)
- `src/components/BlackHoleVortex.test.tsx`
- `src/components/BlackHoleVortex.tsx`
- `src/components/ProfileSection.circuit-lines.test.tsx`
- `src/components/ProfileSection.tsx`
- `src/lib/engagement.init.test.ts`
- `src/lib/engagement.ts`

Critério de aceite: suíte Vitest verde, VRT estável, foco visível no teclado,
gate `design-guard` rc=0 com esta decisão registrada.
