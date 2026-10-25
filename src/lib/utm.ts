/**
 * Amarração entre ativos (REGRA-AMARRACAO): todo link que sai do portfólio leva UTM, e o
 * beacon de visita carrega os UTM da página — sem isso o destino não sabe quem mandou e a
 * visita vira número solto.
 *
 * Medido em 24/10/2026 pelo @moedas: o portfólio tinha 13 links cruzados e ZERO com UTM.
 */

export const UTM_SOURCE = "portfolio";

export const CAMPOS_UTM = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

export type Utms = Partial<Record<(typeof CAMPOS_UTM)[number], string>>;

type Opcoes = {
  medium: string;
  campaign: string;
  content?: string;
  source?: string;
};

/**
 * Devolve a URL com utm_source/medium/campaign (e content opcional).
 * Preserva query já existente e não duplica parâmetro. URL inválida volta como veio —
 * medição nunca pode quebrar link.
 */
export function comUtm(url: string, opcoes: Opcoes): string {
  try {
    // Base fixa: aceita caminho relativo sem estourar no construtor do URL.
    const alvo = new URL(url, "https://portifolio.seu.pet");
    alvo.searchParams.set("utm_source", opcoes.source || UTM_SOURCE);
    alvo.searchParams.set("utm_medium", opcoes.medium);
    alvo.searchParams.set("utm_campaign", opcoes.campaign);
    if (opcoes.content) alvo.searchParams.set("utm_content", opcoes.content);
    return alvo.toString();
  } catch {
    return url;
  }
}

/**
 * UTM da página atual (query string). Quem chega com `?utm_source=lifelog` continua sendo
 * atribuído ao lifelog; sem UTM nenhum, a origem é o próprio portfólio.
 */
export function utmsDaPagina(search: string): Utms {
  const params = new URLSearchParams(search || "");
  const saida: Utms = {};
  for (const campo of CAMPOS_UTM) {
    const valor = params.get(campo);
    if (valor) saida[campo] = valor.slice(0, 64);
  }
  if (!saida.utm_source) saida.utm_source = UTM_SOURCE;
  return saida;
}
