import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Bloqueia acesso DIRETO aos PDFs do currículo que vivem em /public.
 *
 * Download legítimo = fluxo do DownloadModal -> POST /api/download-cv
 * (consentimento LGPD + log em cv_downloads + notificação Telegram/Resend).
 * URL direta do arquivo estático = 404 (sem log, sem consent, sem analytics).
 *
 * ── 07/09/2026: os PDFs respondiam 200 direto da Vercel, fora do fluxo do
 *    modal (furo de LGPD/rastreio). Guard criado com matcher de 2 strings.
 *
 * ── 🔴 13/09/2026: GUARD VIVIA BYPASSADO. Medido em produção nos DOIS
 *    domínios (samuelmedeiros.vercel.app e portifolio.seu.pet), todos os
 *    caminhos abaixo entregavam o PDF real (application/pdf, 70968 bytes,
 *    MD5 7caf656437148384e18b4367b6a713df = idêntico ao arquivo do repo):
 *
 *      /Samuel_Andrade_2026.pdf          -> 404  (só este estava protegido)
 *      /%53amuel_Andrade_2026.pdf        -> 200  (S codificado)
 *      /Sam%75el_Andrade_2026.pdf        -> 200  (u codificado)
 *      /Samuel_Andrade_2026.p%64f        -> 200  (df codificado)
 *      /Samuel%5FAndrade%5F2026%2epdf    -> 200  (underscores + ponto)
 *
 * Causa raiz (duas camadas, ambas falhavam juntas):
 *  1. O `matcher` compara o path CRU via path-to-regexp. Listar 2 strings
 *     exatas significa que qualquer re-encoding do mesmo arquivo escapa do
 *     matcher — e o proxy NUNCA É CHAMADO.
 *  2. O `Set.has()` comparava `request.nextUrl.pathname` cru, normalizado
 *     apenas por `.toLowerCase()`. Mesmo que o matcher casasse, `%75` não é
 *     `u` para o Set.
 *  3. Depois do proxy, o Vercel decodifica o path e resolve no file system ->
 *     serve o estático.
 *
 * Cura:
 *  1. SEM `config.matcher` -> o proxy roda em TODA request. Elimina a classe
 *     inteira de escape-por-matcher (não existe encoding que "não case",
 *     porque não há matcher). Custo: o proxy passa a ser invocado também para
 *     assets; a função é O(segmentos do path) e sem I/O, então é desprezível.
 *     Trade-off monitorado: latência/custo de edge invocation por asset.
 *  2. Comparação NORMALIZADA e por BASENAME: percent-decode até fixpoint
 *     (cobre double-encoding `%2575`), colapso de dot-segments (`..`/`.`) e de
 *     slashes duplicados, minúsculas, e recusa de caminhos com NUL. Assim
 *     `/public/...`, `/%2e%2e/...`, `.PDF%00` e variantes de encoding caem na
 *     mesma forma canônica.
 *
 * Regra para o futuro: este arquivo não pode ganhar matcher restritivo sem
 * que a normalização abaixo seja provada contra as variantes do teste
 * (src/test/proxy.test.ts). O teste unitário É o contrato anti-regressão.
 */

const PDF_NAMES = [
  "samuel_andrade_2026.pdf",
  "samuel_andrade_resume_2026.pdf",
] as const;

/** Decodifica até não mudar mais (cobre %2575 -> %75 -> u). */
function percentDecode(input: string): string {
  let out = input;
  for (let i = 0; i < 8; i++) {
    let next: string;
    try {
      next = decodeURIComponent(out);
    } catch {
      break; // sequência de escape malformada: para no estado atual
    }
    if (next === out) break;
    out = next;
  }
  return out;
}

/** Colapsa ".", ".." e slashes duplicados num caminho canônico. */
function collapseSegments(input: string): string {
  const kept: string[] = [];
  for (const seg of input.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") {
      kept.pop();
      continue;
    }
    kept.push(seg);
  }
  return "/" + kept.join("/");
}

/**
 * Forma canônica para comparação. Duas passadas porque `%2e%2e` só vira ".."
 * depois do decode, e precisa ser colapsado na passada seguinte.
 */
function normalizePathname(raw: string): string {
  const first = collapseSegments(percentDecode(raw));
  return collapseSegments(percentDecode(first)).toLowerCase();
}

/** Último segmento, sem sufixos de ponto/whitespace. */
function basenameOf(pathname: string): string {
  const trimmed = pathname.replace(/[./\s]+$/g, "");
  const idx = trimmed.lastIndexOf("/");
  return (idx === -1 ? trimmed : trimmed.slice(idx + 1)).replace(/\s+/g, "");
}

/** Exportado para o teste unitário ser o contrato anti-regressão. */
export function isBlockedCvPath(rawPathname: string): boolean {
  if (rawPathname.includes("\0")) return true; // NUL smuggling: recusar sempre
  const normalized = normalizePathname(rawPathname);
  if (normalized.includes("\0")) return true; // NUL que só aparece após decode
  const base = basenameOf(normalized);
  if (!base) return false;
  for (const name of PDF_NAMES) {
    if (base === name) return true;
  }
  // Variante defensiva: cópias tipo "samuel_andrade_2026 (1).pdf"
  return /^samuel_andrade(_resume)?_2026[^/]*\.pdf$/.test(base);
}

export default function proxy(request: NextRequest) {
  if (isBlockedCvPath(request.nextUrl?.pathname ?? "")) {
    // Log dedicado: prova recorrência de tentativa de acesso direto (Vercel
    // function logs). Só no caminho de bloqueio -> custo zero no hot path.
    // Tudo defensivo: o proxy roda em TODA request e uma exceção aqui viraria
    // erro 500 no site inteiro. Preferimos 404 silencioso a jogar.
    try {
      const ua =
        typeof request.headers?.get === "function"
          ? request.headers.get("user-agent") ?? "unknown"
          : "unknown";
      console.warn(
        `[cv-guard] blocked direct access ${new Date().toISOString()} ` +
          `path=${JSON.stringify(request.nextUrl?.pathname ?? "")} ua=${ua}`
      );
    } catch {
      /* log nunca bloqueia a resposta de segurança */
    }
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

// ⚠️ Sem `export const config = { matcher: ... }` DE PROPÓSITO.
// Ver comentário do topo: matcher restritivo foi o vetor do bypass de 13/09.
