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

export type OpFn = ((...args: unknown[]) => void) & { q?: unknown[] };

/** Fila do OpenPanel pronta (init enfileirado) — ver `aoIniciarOp`. */
let iniciado = false;
const pendentes: Array<() => void> = [];

/**
 * Cria o stub de fila do OpenPanel (idempotente, não marca a instância como
 * iniciada). O script oficial faz `s = e.op.q; t = new l(s.shift()[1])` — ele
 * ESPERA que cada item da fila seja `[method, ...args]` e chama o stub como
 * função (`apply`), daí o Proxy: sem o trap `apply` a chamada cai no vazio e o
 * `s.shift()[1]` do op1.js lança "Cannot read properties of undefined".
 *
 * Exportado porque `initEngagement` roda no mount, ANTES do `load` que carrega
 * o SDK: sem stub, todo evento dessa janela era descartado (medido 26/11/2026
 * em produção — `web_vital` e `js_error` nunca chegavam ao `/api/op/track`).
 */
export function garantirStubOp(): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { op?: OpFn };
  if (typeof w.op === "function") return;
  const queue: unknown[][] = [];
  const stub = new Proxy(function () {} as unknown as OpFn, {
    apply: (_t, _thisArg, args) => {
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

/**
 * Assina o momento em que a fila do OpenPanel está pronta (stub criado + `init`
 * enfileirado). Quem emite evento antes disso precisa BUFFERIZAR: empurrar
 * direto no stub sem `init` na frente quebra o op1.js, que faz
 * `q.shift()[1]` assumindo que o primeiro item é o init (pageerror em todo
 * visitante e os eventos enfileirados se perdem).
 */
export function aoIniciarOp(cb: () => void): void {
  if (iniciado) {
    try { cb(); } catch { /* assinante quebrado não derruba o chamador */ }
    return;
  }
  pendentes.push(cb);
}

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
  garantirStubOp();

  w.op?.("init", {
    apiUrl: OP_API_URL,
    clientId: OP_CLIENT_ID,
    // Desligado 13/11/2026: gerava um `screen_view` por navegação, sem `path` e
    // sem `site` — evento que não serve para funil e infla a contagem do
    // projeto `seupet`. O `page_view` vai abaixo, com path e marca de quem é.
    trackScreenViews: false,
    trackOutgoingLinks: true,
    trackAttributes: true,
  });

  // A fila do stub agora é válida (o `init` é o primeiro item, como o op1.js
  // espera). Quem bufferizou evento antes disso pode despejar com segurança.
  iniciado = true;
  for (const cb of pendentes.splice(0)) {
    try { cb(); } catch { /* um assinante quebrado não impede os outros */ }
  }

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
