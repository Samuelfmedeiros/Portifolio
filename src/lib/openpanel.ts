/**
 * OpenPanel tracking — self-hosted (openpanel.seu.pet).
 *
 * Carregado apenas APÓS consentimento, igual ao Umami (LGPD): o banner
 * "Aceitar", o download de CV e o envio do formulário chamam os dois.
 *
 * Same-origin: o script e a ingestão passam por rewrites do Next
 * (`/analytics/op1.js` e `/api/op/*` → openpanel.seu.pet), então a CSP
 * `'self'` + COEP `require-corp` do site não bloqueiam nada.
 */

const OP_SCRIPT_SRC = "/analytics/op1.js";
const OP_CLIENT_ID = "a3c3b6a8-a751-461a-88f9-8317f6760360";
const OP_API_URL = "/api/op";

type OpFn = ((...args: unknown[]) => void) & { q?: unknown[] };

/** Injeta o script do OpenPanel dinamicamente (idempotente — não duplica). */
export function loadOpenpanelScript(): void {
  if (typeof window === "undefined") return;
  if (document.querySelector('script[data-op-analytics]')) return;

  const w = window as unknown as { op?: OpFn };
  if (!w.op) {
    const queue: unknown[] = [];
    const stub = new Proxy(function () {} as unknown as OpFn, {
      get: (_t, prop) => {
        if (prop === "q") return queue;
        return (...args: unknown[]) => {
          queue.push([prop as string, ...args]);
        };
      },
      has: (_t, prop) => prop === "q",
    });
    w.op = stub;
  }

  w.op("init", {
    apiUrl: OP_API_URL,
    clientId: OP_CLIENT_ID,
    trackScreenViews: true,
    trackOutgoingLinks: true,
    trackAttributes: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = OP_SCRIPT_SRC;
  script.setAttribute("data-op-analytics", "1");
  document.head.appendChild(script);
}

/** Evento manual (ex.: submit/funil). */
export function openpanelTrack(
  name: string,
  properties?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { op?: OpFn };
  if (w.op) w.op("track", name, properties ?? {});
}
