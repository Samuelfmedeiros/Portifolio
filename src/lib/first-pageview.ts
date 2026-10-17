/**
 * Pageview anônima de primeira interação (Opção A — 09/10/2026).
 *
 * CONTEXTO: o Umami só é injetado depois de consentimento
 * (`loadUmamiScript()` em ./umami.ts), e as portas de consentimento implícito
 * (baixar CV, enviar formulário) são raras. Resultado medido: 0 eventos por
 * 24h com o analytics inteiramente funcional — o visitante que só navega e sai
 * nunca é contado.
 *
 * O QUE FAZ: quem interage com o banner de cookies (aceitar, recusar ou
 * fechar) gera UMA pageview. A pessoa já foi informada sobre coleta e
 * executou uma ação consciente no aviso — é o menor passo que devolve
 * sinal sem rastrear quem recusou.
 *
 * O QUE NAO FAZ: não rastreia quem ignora o banner (nunca clica), não usa
 * cookie próprio, não envia evento identificável. O Umami já é cookieless e
 * anônimo por padrão; isto aqui só decide QUANDO a contagem pode começar.
 *
 * Se o Umami ainda não carregou (consentimento recusado), a pageview é
 * enfileirada e enviada quando o script aparecer — sem polling.
 */

const PENDING_KEY = "mc-analytics-pending-pageview";

/**
 * Flag por ABA (variável de módulo, não sessionStorage): a pageview é contada
 * uma vez por carregamento da página. sessionStorage é compartilhado entre
 * abas do mesmo site — usá-lo como trava faria a 2ª aba perder a pageview.
 * Erro pego pelo teste em 09/10/2026 (3 chamadas = 3 eventos).
 */
let countedThisPage = false;

/** Envia a pageview se o Umami já estiver disponível. */
function flush(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.umami?.track) return false;
  if (countedThisPage) return true; // já contou nesta página — não repete
  try {
    window.umami.track("pageview", { url: window.location.pathname });
    countedThisPage = true;
    try { sessionStorage.removeItem(PENDING_KEY); } catch { /* indisponível */ }
    return true;
  } catch {
    return false;
  }
}

/**
 * Marca que uma pageview deve ser contada. Chamar na PRIMEIRA interação do
 * visitante com o banner de cookies — em qualquer dos 3 caminhos
 * (aceitar / recusar / fechar), porque todos são ação consciente sobre o aviso.
 */
export function markFirstPageview(): void {
  if (typeof window === "undefined") return;
  if (countedThisPage) return;

  if (flush()) return;

  // Umami ainda não carregou (recusou ou script pendente): espera aparecer.
  // { once: true } evita listener pendurado contando 2x se o evento repetir.
  window.addEventListener("umami:ready", flush, { once: true });
}

/**
 * Chamar uma vez no boot quando o consentimento JÁ está aceito, para a
 * pageview da visita não se perder (quem aceitou em visita anterior).
 */
export function flushPendingPageview(): void {
  markFirstPageview();
}
