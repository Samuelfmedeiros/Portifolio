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
- `src/app/globals.css`
- `src/components/BlackHoleVortex.test.tsx`
- `src/components/BlackHoleVortex.tsx`
- `src/components/CookieBanner.tsx`
- `src/components/ProfileSection.circuit-lines.test.tsx`
- `src/components/ProfileSection.tsx`
- `src/lib/engagement-init.test.ts`
- `src/lib/engagement.init.test.ts`
- `src/lib/engagement.ts`

## Decisão 27/11/2026 — contraste AA do CTA do hero (worker ui)

Antes: texto do CTA "Ver Projetos" em `var(--accent)` (`#0369a1`) sobre o
gradiente do próprio botão (`--accent/20 → --accent/5` sobre `--bg-card`).
No pior stop o fundo compõe `rgb(202,223,235)` e a razão fica **4.32:1** no
tema light — reprova AA (16px bold não é *large text*). Dark já passava (7.50:1).

Variante A — token dedicado `--accent-readable` (escolhida): dark mantém
`var(--accent)`; light mistura 80% do accent com o slate do tema via
`color-mix`, preservando o matiz ciano. Medido **5.22:1**. Uma linha no
className do CTA em `ProfileSection.tsx`.

Variante B — escurecer `--accent` global: descartada, muda a paleta inteira
e quebraria as baselines VRT das 4 rotas fullPage.

Variante C — fundo sólido no botão: descartada, altera a identidade visual do
hero (gradiente é assinatura do projeto).

Medição no browser real (`tests/a11y-hero-contrast.spec.ts`), porque o
axe-core **não** emite `color-contrast` quando o fundo é gradiente — trata
como desconhecido. Nenhuma cor é fixada no teste: trocar o token por algo que
reprove AA quebra a spec. Prova RED→GREEN registrada em `AGENTS.md`.

Critério de aceite: suíte Vitest verde, VRT estável, foco visível no teclado,
gate `design-guard` rc=0 com esta decisão registrada.

## Decisão 27/11/2026 — reveal do CookieBanner sem setState síncrono (fix de lint)

Antes: quando a página já cabe na viewport, o effect chamava `setRevealed(true)`
de forma síncrona (`CookieBanner.tsx:127`) e o ESLint do Next 16 acusava
`react-hooks/set-state-in-effect` — 1 erro, e o step `Run lint` do `deploy.yml`
é bloqueante (master `149883e` com CI/CD em failure e deploy parado).

Depois: o mesmo `setRevealed(true)` roda no próximo frame
(`requestAnimationFrame`, cancelado no cleanup). Nenhuma mudança visual — o
banner aparece 1 frame depois, e o render deixa de ser em cascata. `eslint`
passa de 1 erro para 0, `CookieBanner.test.tsx` 13/13 verde.

Variante A — `requestAnimationFrame` (escolhida): zero mudança de layout, um
frame de atraso imperceptível, sem re-render extra.

Variante B — ler o layout no `useLayoutEffect` antes do paint: descartada,
`setState` dentro de `useLayoutEffect` cai na mesma regra e blocaria o paint.

Variante C — subir o limiar do `scrollHeight` e ignorar o caso da página curta:
descartada, deixa o banner escondido em telas altas (bug funcional).

