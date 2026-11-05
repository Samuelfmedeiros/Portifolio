/**
 * Agenda uma rotina de medição para DEPOIS do `load` da página.
 *
 * Motivo (medido 04/11/2026): os dois beacons do site — `/api/hit` (rewrite do
 * `next.config.js` para skills.seu.pet) e `/api/op/*` (rewrite para
 * openpanel.seu.pet) — disparavam no `useEffect` da hidratação, ANTES do evento
 * `load`. Cada rewrite externo é um proxy na borda do Vercel e a soma dos dois
 * somava ~650 ms no load: 1303 ms com os beacons x 657 ms sem eles. Medição não
 * pode atrasar a página — quem visita não espera o analytics para ver conteúdo.
 *
 * Regra: espera o `load` (ou `readyState === 'complete'`) e só então roda na
 * primeira folga da thread principal. `requestIdleCallback` quando existir;
 * `setTimeout(..., 0)` como fallback (jsdom, Safari antigo).
 *
 * Em navegação SPA (App Router) o `load` já aconteceu: `readyState` vem
 * `complete` e a rotina roda na folga seguinte, sem atraso perceptível.
 */
export function agendarAposCarga(fn: () => void): void {
  if (typeof window === "undefined") return;

  const rodarNaFolga = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => fn());
      return;
    }
    window.setTimeout(fn, 0);
  };

  if (document.readyState === "complete") {
    rodarNaFolga();
    return;
  }

  window.addEventListener("load", rodarNaFolga, { once: true });
}
