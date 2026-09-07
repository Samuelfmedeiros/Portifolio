import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Bloqueia acesso DIRETO aos PDFs do currículo servidos de /public.
 *
 * Download legítimo = fluxo do DownloadModal -> POST /api/download-cv
 * (consentimento LGPD + log em cv_downloads + notificação Telegram/Resend).
 * URL direta do arquivo estático = 404 (sem log, sem consent, sem analytics).
 *
 * Contexto: 07/09/2026 — /Samuel_Andrade_2026.pdf e /Samuel_Andrade_Resume_2026.pdf
 * respondiam 200 direto da Vercel, fora do fluxo do modal (furo de LGPD/rastreio).
 * Os arquivos continuam em /public (a rota da API os lê via fs); o proxy só
 * intercepta as URLs públicas antes do file system.
 */
const BLOCKED_PDFS = new Set([
  "/samuel_andrade_2026.pdf",
  "/samuel_andrade_resume_2026.pdf",
]);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase();
  if (BLOCKED_PDFS.has(pathname)) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/Samuel_Andrade_2026.pdf", "/Samuel_Andrade_Resume_2026.pdf"],
};
