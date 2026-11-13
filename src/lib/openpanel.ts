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
  // Guard de instância ÚNICA (medido 13/11/2026): 5 call sites chamam esta
  // função (CookieBanner x3, ConditionalAnalytics, ContactForm, DownloadModal).
  // Como o `<script>` só é anexado no FIM da função, chamadas que chegam antes
  // passam todas pelo check acima — cada uma criava seu próprio stub, refazia o
  // `init` e disparava seu próprio `page_view`. Resultado: 2 eventos idênticos
  // por load (um com device `dono:<ip>`, outro com hash). A flag é setada antes
  // de qualquer trabalho, então só a primeira execução avança.
  const marca = window as unknown as { __opIniciado?: boolean };
  if (marca.__opIniciado) return;
  marca.__opIniciado = true;

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
    // Desligado 13/11/2026: gerava um `screen_view` por navegação, sem `path` e
    // sem `site` — evento que não serve para funil e infla a contagem do
    // projeto `seupet`. O `page_view` vai abaixo, com path e marca de quem é.
    trackScreenViews: false,
    trackOutgoingLinks: true,
    trackAttributes: true,
  });

  // NÃO emitir `page_view` daqui (medido 13/11/2026).
  //
  // O portfólio já tem um medidor: `HitBeacon` → `/api/hit` → caixa da loja,
  // que grava na tabela `hits` (com UTM) E reenvia pro OpenPanel com
  // `site='portfolio'`. Somar um segundo `page_view` por JS fazia todo load
  // entrar 2x — um com device `dono:<ip>` (classificação por IP, no servidor) e
  // outro com hash + `visitante_motivo=cookie`. Medido: 2 eventos idênticos em
  // `/` no mesmo segundo.
  //
  // O caminho do servidor é MELHOR: ele sabe o IP (marca o dono mesmo sem
  // cookie) e carrega o UTM, que o JS não vê depois do primeiro load. Então a
  // medição de visita fica só com o beacon; este arquivo serve para os eventos
  // de conversão (`openpanelTrack`: contato, download de CV).

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
