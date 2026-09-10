/**
 * Umami tracking — carregamento dinâmico do script.
 *
 * O script do Umami é carregado SOMENTE após consentimento (LGPD).
 * Fontes de consentimento:
 *   1. CookieBanner "Aceitar" (consentimento explícito)
 *   2. Download de currículo (o modal exige checkbox de LGPD)
 *   3. Envio do formulário de contato (o form exige checkbox de LGPD)
 *
 * Decisão 04/08/2026 (Samuel): ações de contato = consentimento implícito.
 * Quem baixa CV ou envia mensagem já mostrou intenção → carrega o Umami,
 * mesmo sem ter clicado "aceitar" no banner. Aumenta cobertura de coleta.
 */

/**
 * ?v=2 (10/09): cache-bust do edge. O Cloudflare guardou por ate 24h uma copia
 * ENVENENADA do script.js (CORP: same-origin, pre-fix 42e5a8b do Capivara) na URL
 * exata; com COEP require-corp da propria pagina, o browser baixava mas nao
 * executava (ERR_BLOCKED_BY_RESPONSE). URL nova = cache key nova = origin fresco
 * com CORP cross-origin. Nao remover sem motivo documentado (TRAP #10).
 */
const UMAMI_SCRIPT_SRC = "https://capivara.seu.pet/api/umami/script.js?v=2";
const UMAMI_WEBSITE_ID = "39676cee-8416-4a33-ba06-cbc7af177c27";

/** Injeta o script do Umami dinamicamente (idempotente — não duplica). */
export function loadUmamiScript(): void {
  if (typeof window === "undefined") return;
  if (document.querySelector(`script[src*="capivara.seu.pet/api/umami/script.js"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = UMAMI_SCRIPT_SRC;
  script.setAttribute("data-website-id", UMAMI_WEBSITE_ID);
  document.head.appendChild(script);
}
