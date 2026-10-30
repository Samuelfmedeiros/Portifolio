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
    const queue: unknown[][] = [];
    // Stub de fila até o op1.js real carregar. O script oficial faz
    // `s = e.op.q; t = new l(s.shift()[1]); s.forEach(n => ...)`, ou seja:
    // ele ESPERA que cada item da fila seja [name, args[]] e chama o stub
    // como função `w.op(name, args)` — logo o Proxy precisa do trap
    // `apply` (sem ele a chamada cai no vazio, a fila fica vazia e o
    // `s.shift()[1]` do op1.js lança "Cannot read properties of
    // undefined (reading '1')" — pageerror em TODO visitante).
    const stub = new Proxy(function () {} as unknown as OpFn, {
      apply: (_t, _thisArg, args) => {
        // Fila no formato [method, ...args]: o op1.js faz
        // `new l(s.shift()[1])` (init: item[1] = options) e
        // `t[n[0]](...n.slice(1))` (demais: método + args) — os
        // argumentos crus da chamada já são exatamente esse formato.
        queue.push(args);
      },
      get: (_t, prop) => {
        if (prop === "q") return queue;
        return (...fnArgs: unknown[]) => {
          queue.push([prop as string, ...fnArgs]);
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
