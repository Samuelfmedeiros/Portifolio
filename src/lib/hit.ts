"use client";

/**
 * Medição de visita do portfólio — manda 1 beacon por navegação pro caixa da loja.
 *
 * Por que aqui e não no Umami: o Umami deste site só carrega depois do consentimento e a
 * ingestão dele respondeu 400 quando testada (17/10) — o portfólio ficava sem nenhum número
 * de chegada. Este beacon é sem cookie, sem IP e sem identificador: só caminho + referrer,
 * no mesmo endpoint que a loja já usa (`/api/hit`, coluna `site='portfolio'`).
 *
 * O destino é RELATIVO (`/api/hit`) e o `next.config.js` faz o rewrite pro caixa da loja.
 * Chamar skills.seu.pet direto funcionava, mas a resposta cross-origin era barrada por COEP
 * e sujava o console a cada visita; same-origin resolve sem afrouxar COEP nem CSP.
 *
 * Não coleta dado pessoal, então não depende do banner de cookies (LGPD: dado agregado), mas
 * respeita DNT/GPC: quem pediu pra não ser rastreado não é contado.
 */

const URL_CAIXA =
  process.env.NEXT_PUBLIC_LOJA_HIT_URL || "/api/hit";

type Corpo = { site: string; path: string; ref: string };

function pediuParaNaoSerRastreado(): boolean {
  if (typeof navigator === "undefined") return true;
  const dnt = navigator.doNotTrack;
  const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl;
  return dnt === "1" || dnt === "yes" || gpc === true;
}

function deveMedir(): boolean {
  if (typeof window === "undefined") return false;
  // Em desenvolvimento o beacon poluiria a contagem real; só roda com override explícito.
  if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_LOJA_HIT_URL) {
    return false;
  }
  return !pediuParaNaoSerRastreado();
}

/** Envia o hit. Silencioso de propósito: medição nunca pode atrapalhar a página. */
export function enviarHit(path: string, ref: string, url: string = URL_CAIXA): boolean {
  if (!deveMedir()) return false;
  const corpo: Corpo = { site: "portfolio", path, ref };
  const dados = JSON.stringify(corpo);
  try {
    // text/plain evita o preflight de CORS (o servidor lê o corpo como JSON de qualquer forma).
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([dados], { type: "text/plain" }));
      return true;
    }
    void fetch(url, {
      method: "POST",
      body: dados,
      headers: { "content-type": "text/plain" },
      keepalive: true,
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}
