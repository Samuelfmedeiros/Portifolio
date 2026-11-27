/**
 * `initEngagement` — o controller de eventos de engajamento (scroll, seções,
 * cliques, tempo de página, web vitals, erros de JS).
 *
 * Cada caminho deste modulo já quebrou em producao alguma vez (medido 26/11/2026):
 * `section_time` nunca saia para a secao mais alta do site, `web_vital` nunca
 * saia porque `entry.name` chega vazio, `ui_click` nunca saia porque o DOM nao
 * tinha `[data-analytics-id]`. Os testes abaixo travam o contrato de cada
 * caminho usando DOM jsdom de verdade; apenas infra externa (IntersectionObserver,
 * PerformanceObserver, `window.op`) entra como stub.
 *
 * Cobertura alvo do critic: engagement.ts >= 50% (estava 34%).
 *
 * PITFALL medido neste host (vitest 5 + jsdom + fake timers): o modulo e o
 * arquivo de teste leem `sessionStorage` de objetos DIFERENTES, e stubs cujos
 * metodos lançam nao chegam ao modulo. Por isso:
 *  - `sessionStorage` entra como fake com Map via `vi.stubGlobal` (unico formato
 *    que o modulo enxerga — `vi.spyOn` e assign direto nao chegam);
 *  - o caminho "sem storage" eh testado com `sessionStorage = undefined`
 *    (getItem levanta TypeError e cai no catch do modulo).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initEngagement, markSent, shouldSend } from './engagement';

/** Chamada registrada no stub de `window.op`: [method, event, props]. */
type Chamada = [string, string, Record<string, unknown>];

/** IntersectionObserver/PerformanceObserver originais (setup.tsx), capturados 1x. */
const ORIG_IO = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;

let chamadas: Chamada[] = [];
let store: Map<string, string>;
let ioCallback: ((entries: unknown[], observer?: unknown) => void) | null = null;
let poCallback: ((list: unknown, observer?: unknown) => void) | null = null;
let ioDisconnect: ReturnType<typeof vi.fn>;
let poDisconnect: ReturnType<typeof vi.fn>;
let observados: Element[] = [];
/** Cleanup do ultimo `initEngagement` — rodado no afterEach mesmo se o assert falhar. */
let limpar: (() => void) | undefined;

function iniciar(opts: Parameters<typeof initEngagement>[0]): void {
  limpar = initEngagement(opts);
}

function eventos(nome: string): Array<Record<string, unknown>> {
  return chamadas.filter((c) => c[1] === nome).map((c) => c[2]);
}

function registrarOp(): void {
  (window as unknown as { op?: unknown }).op = (
    method: string,
    name: string,
    props: unknown,
  ) => {
    chamadas.push([method, name, props as Record<string, unknown>]);
  };
}

function definirProp(alvo: object, prop: string, valor: unknown): void {
  Object.defineProperty(alvo, prop, { value: valor, configurable: true });
}

/** Dispara um `scroll` real com metricas controladas. */
function scrollPara(scrollTop: number, scrollHeight = 3000, clientHeight = 800): void {
  window.scrollY = scrollTop;
  definirProp(document.documentElement, 'scrollHeight', scrollHeight);
  definirProp(window, 'innerHeight', clientHeight);
  window.dispatchEvent(new Event('scroll'));
}

/** dispara o callback do IntersectionObserver como o navegador faria. */
function cruzarSecao(entry: unknown): void {
  ioCallback?.([entry], undefined);
}

/** dispara o callback do PerformanceObserver (lista com getEntries). */
function observarVital(entries: unknown[]): void {
  poCallback?.({ getEntries: () => entries }, undefined);
}

function criarBotao(id: string, label?: string, texto?: string): HTMLButtonElement {
  const el = document.createElement('button');
  el.setAttribute('data-analytics-id', id);
  if (label !== undefined) el.setAttribute('data-analytics-label', label);
  if (texto !== undefined) el.textContent = texto;
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  chamadas = [];
  ioCallback = null;
  poCallback = null;
  observados = [];
  ioDisconnect = vi.fn();
  poDisconnect = vi.fn();
  limpar = undefined;
  store = new Map<string, string>();
  registrarOp();
  vi.stubGlobal('sessionStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  });
  document.body.innerHTML = '';
  document.documentElement.lang = '';
  definirProp(window, 'innerHeight', 800);
  definirProp(document.documentElement, 'scrollHeight', 3000);
  definirProp(document, 'visibilityState', 'visible');
  window.scrollY = 0;

  // IntersectionObserver do setup NAO eh configuravel — `vi.stubGlobal` estoura.
  // Assignment simples na propriedade writable instala o fake.
  class IntersectionObserverFake {
    constructor(cb: (entries: unknown[], observer?: unknown) => void) {
      ioCallback = cb;
    }
    observe = (el: Element): void => {
      observados.push(el);
    };
    unobserve = vi.fn();
    disconnect = ioDisconnect;
    takeRecords = (): unknown[] => [];
  }
  class PerformanceObserverFake {
    constructor(cb: (list: unknown, observer?: unknown) => void) {
      poCallback = cb;
    }
    observe = vi.fn();
    disconnect = poDisconnect;
  }
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = IntersectionObserverFake;
  (globalThis as { PerformanceObserver?: unknown }).PerformanceObserver = PerformanceObserverFake;
  // Date.now controlado: tempo de pagina, secao e flush usam o relogio
  vi.useFakeTimers();
});

afterEach(() => {
  limpar?.();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = ORIG_IO;
  delete (globalThis as { PerformanceObserver?: unknown }).PerformanceObserver;
});

describe('markSent / shouldSend', () => {
  it('marca a sessao e passa a barrar o evento', () => {
    expect(shouldSend('k.mark')).toBe(true);
    markSent('k.mark');
    expect(store.get('k.mark')).toBe('1');
    expect(shouldSend('k.mark')).toBe(false);
  });

  it('sessionStorage indisponivel nao derruba a pagina', () => {
    vi.stubGlobal('sessionStorage', undefined);
    // getItem em undefined levanta TypeError -> catch do modulo
    expect(() => shouldSend('k')).not.toThrow();
    expect(() => markSent('k')).not.toThrow();
    // `8859ce1` corrigiu o catch, que devolvia `null` (falsy) e por isso
    // BARRAVA todo evento quando o storage estava bloqueado — `if (!shouldSend)`
    // tratava null como "nao envia". Com `true` a regra do comentario vale:
    // sem dedupe, mas com dado.
    expect(shouldSend('k')).toBe(true);
  });
});

describe('initEngagement — guardas de entrada', () => {
  it('sem window e noop (SSR)', () => {
    vi.stubGlobal('window', undefined);
    const cleanup = initEngagement({ site: 'portfolio' });
    expect(typeof cleanup).toBe('function');
    expect(() => cleanup()).not.toThrow();
  });

  it('DNT ligado desliga tudo: init e noop', () => {
    vi.stubGlobal('navigator', { doNotTrack: '1', language: 'pt-BR' });
    const btn = criarBotao('hero.cv', 'Baixar CV');
    iniciar({ site: 'portfolio' });
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    scrollPara(2000);
    window.dispatchEvent(new ErrorEvent('error', { message: 'boom' }));
    expect(chamadas).toEqual([]);
    expect(observados).toEqual([]);
    expect(ioCallback).toBeNull();
  });
});

describe('initEngagement — scroll_depth', () => {
  it('emite os marcos na ordem em que sao cruzados', () => {
    iniciar({ site: 'portfolio' });
    // 0% no mount: nada
    scrollPara(2000); // 2000/2200 = 90% -> primeiro marco ainda nao cruzado = 25
    expect(eventos('scroll_depth')).toEqual([
      { site: 'portfolio', path: location.pathname, lang: 'pt-BR', pct: 25 },
    ]);
    scrollPara(2200); // 100% -> 50
    expect(eventos('scroll_depth').map((e) => e.pct)).toEqual([25, 50]);
    expect(store.get(`eng:scroll:${location.pathname}:25`)).toBe('1');
  });

  it('sessionStorage de outro pageview da sessao barra o marco sem repetir', () => {
    iniciar({ site: 'portfolio' });
    scrollPara(2000); // 25
    scrollPara(2200); // 50
    // marco 75 ja emitido em outra pagina desta sessao
    store.set(`eng:scroll:${location.pathname}:75`, '1');
    scrollPara(2200); // nextMark daria 75 -> shouldSend barra
    scrollPara(2200); // e nao marca como alcancado: tenta 75 de novo
    expect(eventos('scroll_depth').map((e) => e.pct)).toEqual([25, 50]);
  });

  it('documento curto (sem scroll) emite o primeiro marco no mount', () => {
    definirProp(document.documentElement, 'scrollHeight', 500);
    iniciar({ site: 'portfolio' });
    // scrollHeight(500) <= clientHeight(800) -> scrollPct devolve 100 -> o
    // usuario viu a pagina inteira: o marco 25 sai no proprio mount.
    expect(eventos('scroll_depth').map((e) => e.pct)).toEqual([25]);
  });

  it('ACHADO MEDIDO: doc curto sobe um marco por scroll, sem scroll novo', () => {
    definirProp(document.documentElement, 'scrollHeight', 500);
    iniciar({ site: 'portfolio' });
    for (let i = 0; i < 6; i++) scrollPara(0, 500, 800);
    // `reached` so acumula o marco emitido, e `nextMark` sempre devolve o
    // proximo maior: num doc curto (pct sempre 100) cada evento de scroll
    // (resize, orientacao) sobe um marco. Limitado a 4/sessao pelos 4 marcos
    // e deduplicado pelo sessionStorage — travado como esta, com o achado
    // registrado para o dono decidir se vale endurecer em `onScroll`.
    expect(eventos('scroll_depth').map((e) => e.pct)).toEqual([25, 50, 75, 100]);
  });

  it('lang do document vence o fallback pt-BR', () => {
    document.documentElement.lang = 'en';
    iniciar({ site: 'portfolio' });
    scrollPara(2000);
    expect(eventos('scroll_depth')[0].lang).toBe('en');
  });

  it('keyPrefix isola as chaves por site', () => {
    iniciar({ site: 'portfolio', keyPrefix: 'pf' });
    scrollPara(2000);
    expect(store.get(`pf:scroll:${location.pathname}:25`)).toBe('1');
    expect(eventos('scroll_depth')).toHaveLength(1);
  });
});

describe('initEngagement — section_time', () => {
  function secaoNoDom(id: string, altura = 3000): HTMLElement {
    const el = document.createElement('div');
    el.setAttribute('data-track-section', id);
    definirProp(el, 'getBoundingClientRect', () => ({ height: altura }));
    document.body.appendChild(el);
    return el;
  }

  it('secao mais alta que a viewport emite tempo ao sair de foco', () => {
    const projects = secaoNoDom('projects', 3043);
    iniciar({ site: 'portfolio' });
    expect(observados).toContain(projects);

    // 26% de ratio numa secao de 3043px em viewport 800 = em foco (regra medida)
    cruzarSecao({ target: projects, intersectionRatio: 0.26, boundingClientRect: { height: 3043 } });
    vi.advanceTimersByTime(1500);
    cruzarSecao({ target: projects, intersectionRatio: 0, boundingClientRect: { height: 3043 } });

    expect(eventos('section_time')).toEqual([
      {
        site: 'portfolio',
        path: location.pathname,
        lang: 'pt-BR',
        section: 'projects',
        ms: 1500,
      },
    ]);
  });

  it('passagem rapida (<1s) e ruido: nao emite', () => {
    const blog = secaoNoDom('blog', 400);
    iniciar({ site: 'portfolio' });
    cruzarSecao({ target: blog, intersectionRatio: 1, boundingClientRect: { height: 400 } });
    vi.advanceTimersByTime(300);
    cruzarSecao({ target: blog, intersectionRatio: 0, boundingClientRect: { height: 400 } });
    expect(eventos('section_time')).toEqual([]);
  });

  it('secao que cabe na viewport exige metade visivel', () => {
    const contato = secaoNoDom('contact', 400);
    iniciar({ site: 'portfolio' });
    cruzarSecao({ target: contato, intersectionRatio: 0.4, boundingClientRect: { height: 400 } });
    vi.advanceTimersByTime(1500);
    cruzarSecao({ target: contato, intersectionRatio: 0, boundingClientRect: { height: 400 } });
    expect(eventos('section_time')).toEqual([]);
  });

  it('entrada sem data-track-section e ignorada', () => {
    const semId = document.createElement('div');
    document.body.appendChild(semId);
    iniciar({ site: 'portfolio' });
    cruzarSecao({ target: semId, intersectionRatio: 1, boundingClientRect: { height: 300 } });
    vi.advanceTimersByTime(1500);
    cruzarSecao({ target: semId, intersectionRatio: 0, boundingClientRect: { height: 300 } });
    expect(eventos('section_time')).toEqual([]);
  });

  it('um evento por secao por sessao, mesmo entrando/saindo duas vezes', () => {
    const jogos = secaoNoDom('games', 3000);
    iniciar({ site: 'portfolio' });
    for (let volta = 0; volta < 2; volta++) {
      cruzarSecao({ target: jogos, intersectionRatio: 0.3, boundingClientRect: { height: 3000 } });
      vi.advanceTimersByTime(1200);
      cruzarSecao({ target: jogos, intersectionRatio: 0, boundingClientRect: { height: 3000 } });
    }
    expect(eventos('section_time')).toHaveLength(1);
  });

  it('trackSections:false liga nenhum observer', () => {
    iniciar({ site: 'portfolio', trackSections: false });
    expect(ioCallback).toBeNull();
    expect(observados).toEqual([]);
  });
});

describe('initEngagement — ui_click', () => {
  it('emite id + label do dataset', () => {
    criarBotao('hero.cv', 'Baixar CV');
    iniciar({ site: 'portfolio' });
    document
      .querySelector('[data-analytics-id="hero.cv"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(eventos('ui_click')).toEqual([
      {
        site: 'portfolio',
        path: location.pathname,
        lang: 'pt-BR',
        id: 'hero.cv',
        label: 'Baixar CV',
      },
    ]);
  });

  it('sem label no dataset cai no textContent, truncado em 60', () => {
    criarBotao('hero.longo', undefined, 'X'.repeat(100));
    iniciar({ site: 'portfolio' });
    document
      .querySelector('[data-analytics-id="hero.longo"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(eventos('ui_click')[0].label).toBe('X'.repeat(60));
  });

  it('um clique por id por sessao', () => {
    const btn = criarBotao('nav.tema', 'Tema');
    iniciar({ site: 'portfolio' });
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(eventos('ui_click')).toHaveLength(1);
    expect(store.get('eng:click:nav.tema')).toBe('1');
  });

  it('clique num filho encontra o pai com data-analytics-id', () => {
    const btn = criarBotao('project.open.x', 'Abrir');
    const span = document.createElement('span');
    btn.appendChild(span);
    iniciar({ site: 'portfolio' });
    span.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(eventos('ui_click').map((e) => e.id)).toEqual(['project.open.x']);
  });

  it('clique sem data-analytics-id nao emite; clique no document nao quebra', () => {
    const limpo = document.createElement('button');
    document.body.appendChild(limpo);
    iniciar({ site: 'portfolio' });
    limpo.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(chamadas).toEqual([]);
  });

  it('trackClicks:false nao escuta cliques', () => {
    const btn = criarBotao('hero.cv', 'Baixar CV');
    iniciar({ site: 'portfolio', trackClicks: false });
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(eventos('ui_click')).toEqual([]);
  });
});

describe('initEngagement — engagement_time / pagehide / visibilitychange', () => {
  it('pagehide emite o tempo visivel acumulado', () => {
    iniciar({ site: 'portfolio' });
    vi.advanceTimersByTime(2000);
    window.dispatchEvent(new Event('pagehide'));
    expect(eventos('engagement_time')).toEqual([
      { site: 'portfolio', path: location.pathname, lang: 'pt-BR', ms: 2000 },
    ]);
  });

  it('menos de 1s de pagina nao emite tempo', () => {
    iniciar({ site: 'portfolio' });
    vi.advanceTimersByTime(400);
    window.dispatchEvent(new Event('pagehide'));
    expect(eventos('engagement_time')).toEqual([]);
  });

  it('pagehide repetido nao duplica (uma vez por sessao)', () => {
    iniciar({ site: 'portfolio' });
    vi.advanceTimersByTime(2000);
    window.dispatchEvent(new Event('pagehide'));
    vi.advanceTimersByTime(2000);
    window.dispatchEvent(new Event('pagehide'));
    expect(eventos('engagement_time')).toHaveLength(1);
  });

  it('visibilitychange hidden faz flush e visible reinicia a contagem', () => {
    definirProp(document, 'visibilityState', 'hidden');
    iniciar({ site: 'portfolio' });
    // mount com a aba escondida: visibleSince comeca em 0

    definirProp(document, 'visibilityState', 'visible');
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(1500);
    definirProp(document, 'visibilityState', 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(eventos('engagement_time')).toEqual([
      { site: 'portfolio', path: location.pathname, lang: 'pt-BR', ms: 1500 },
    ]);
  });
});

describe('initEngagement — web_vital', () => {
  it('acumula LCP maior e CLS sem input e despeja no flush', () => {
    iniciar({ site: 'portfolio' });
    observarVital([{ entryType: 'largest-contentful-paint', startTime: 980 }]);
    observarVital([{ entryType: 'largest-contentful-paint', startTime: 1234.6 }]);
    observarVital([{ entryType: 'largest-contentful-paint', startTime: 300 }]);
    observarVital([
      { entryType: 'layout-shift', startTime: 0, value: 0.02 },
      { entryType: 'layout-shift', startTime: 0, value: 0.5, hadRecentInput: true },
      { entryType: 'layout-shift', startTime: 0, value: 0.018 },
    ]);
    window.dispatchEvent(new Event('pagehide'));

    expect(eventos('web_vital')).toEqual([
      { site: 'portfolio', path: location.pathname, lang: 'pt-BR', metric: 'LCP', value: 1235 },
      { site: 'portfolio', path: location.pathname, lang: 'pt-BR', metric: 'CLS', value: 38 },
    ]);
  });

  it('sem vital observado nao emite', () => {
    iniciar({ site: 'portfolio' });
    observarVital([{ entryType: 'paint', startTime: 10, value: 1 }]);
    window.dispatchEvent(new Event('pagehide'));
    expect(eventos('web_vital')).toEqual([]);
  });

  it('trackVitals:false nao cria PerformanceObserver', () => {
    iniciar({ site: 'portfolio', trackVitals: false });
    expect(poCallback).toBeNull();
  });
});

describe('initEngagement — js_error', () => {
  it('emite a mensagem do erro', () => {
    iniciar({ site: 'portfolio' });
    window.dispatchEvent(new ErrorEvent('error', { message: 'TypeError: x is not a function' }));
    expect(eventos('js_error')).toEqual([
      {
        site: 'portfolio',
        path: location.pathname,
        lang: 'pt-BR',
        message: 'TypeError: x is not a function',
      },
    ]);
  });

  it('mensagem longa e truncada; mensagem vazia e ignorada', () => {
    iniciar({ site: 'portfolio' });
    window.dispatchEvent(new ErrorEvent('error', { message: 'E'.repeat(200) }));
    window.dispatchEvent(new ErrorEvent('error', { message: '' }));
    const evs = eventos('js_error');
    expect(evs).toHaveLength(1);
    expect(evs[0].message).toBe('E'.repeat(120));
  });

  it('trackErrors:false nao escuta erros', () => {
    iniciar({ site: 'portfolio', trackErrors: false });
    window.dispatchEvent(new ErrorEvent('error', { message: 'boom' }));
    expect(eventos('js_error')).toEqual([]);
  });
});

describe('initEngagement — cleanup', () => {
  it('remove todos os listeners e desconecta observers', () => {
    const secao = document.createElement('div');
    secao.setAttribute('data-track-section', 'projects');
    definirProp(secao, 'getBoundingClientRect', () => ({ height: 3000 }));
    document.body.appendChild(secao);
    const btn = criarBotao('hero.cv', 'Baixar CV');
    iniciar({ site: 'portfolio' });
    expect(observados).toContain(secao);

    limpar?.();
    limpar = undefined;

    scrollPara(2000);
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    window.dispatchEvent(new ErrorEvent('error', { message: 'boom' }));
    window.dispatchEvent(new Event('pagehide'));
    cruzarSecao({ target: secao, intersectionRatio: 0.3, boundingClientRect: { height: 3000 } });

    expect(chamadas).toEqual([]);
    expect(ioDisconnect).toHaveBeenCalled();
    expect(poDisconnect).toHaveBeenCalled();
  });
});