// Engajamento — contrato único de eventos de interação para os sites do Samuel.
//
// Fonte: OpenPanel self-hosted (projeto por site desde 13/11). A tabela `events`
// tem colunas `path`/`origin`/`duration` e `properties` (Map<String,String>).
// Este modulo emite APENAS eventos com chaves primitivas — sem PII, sem email,
// sem coordenadas de clique, sem stack de erro.
//
// Contrato dos eventos:
//   scroll_depth   { site, path, pct, lang }
//   section_time   { site, path, section, ms }
//   ui_click       { site, path, id, label }
//   engagement_time{ site, path, ms }
//   web_vital      { site, path, metric, value }
//   js_error       { site, path, message }
//
// Regras duras (medidas 26/11):
// - dedupe por sessao via sessionStorage: um marco de scroll / um botao por sessao;
// - DNT/GPC desligam a coleta (mesma regra do beacon da loja);
// - analytics NUNCA quebra a pagina: todo envio e try/catch silencioso;
// - `post_depth` continua sendo o evento canonico dos posts (post-depth.ts) —
//   este modulo cobre	paginas gerais e interacoes, sem duplicar aquele evento.

import { aoIniciarOp, type OpFn } from './openpanel';

export interface EngagementOptions {
  site: string;
  trackSections?: boolean;
  trackClicks?: boolean;
  trackVitals?: boolean;
  trackErrors?: boolean;
  /** Prefixo das chaves de sessionStorage (isolamento por site). */
  keyPrefix?: string;
}

/** Marcos emitidos uma vez por pagina/sessao. */
export const SCROLL_MARKS = [25, 50, 75, 100] as const;

export function scrollPct(scrollTop: number, scrollHeight: number, clientHeight: number): number {
  if (!Number.isFinite(scrollTop) || !Number.isFinite(scrollHeight) || !Number.isFinite(clientHeight)) return 0;
  if (scrollHeight <= clientHeight || scrollHeight <= 0) return 100;
  const raw = (scrollTop / (scrollHeight - clientHeight)) * 100;
  return Math.max(0, Math.min(100, Math.floor(raw)));
}

/** Proximo marco ainda nao atingido; null quando o ultimo foi cruzado. */
export function nextMark(pct: number, already: readonly number[] = []): number | null {
  for (const m of SCROLL_MARKS) {
    if (pct >= m && !already.includes(m)) return m;
  }
  return null;
}

export function engagementKey(prefix: string, kind: string, id: string): string {
  return `${prefix || 'eng'}:${kind}:${id}`;
}

/** Retorna true quando o evento pode ser enviado (ou quando nao ha storage). */
export function shouldSend(key: string): boolean {
  try {
    return sessionStorage.getItem(key) !== '1';
  } catch {
    return true; // sem storage: envia (melhor perder dedupe que o dado)
  }
}

export function markSent(key: string): void {
  try { sessionStorage.setItem(key, '1'); } catch { /* silencioso */ }
}

/** Respeita DNT/GPC — mesmo contrato do beacon de visita da loja. */
export function trackingDisabled(nav?: Navigator): boolean {
  const n = nav ?? (typeof navigator === 'undefined' ? undefined : navigator);
  if (!n) return true;
  const dnt = (n as Navigator & { doNotTrack?: string | null }).doNotTrack;
  const gpc = (n as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
  return dnt === '1' || gpc === true;
}

/**
 * Emite um evento de engajamento. Bufferiza enquanto o SDK do OpenPanel não
 * está no DOM — que é o caso comum: `initEngagement` roda no mount da página e
 * o SDK só é injetado depois do `load`.
 */
const BUFFER_MAX = 50;
const buffer: Array<[string, Record<string, string | number>]> = [];
let assinou = false;

export function emit(name: string, properties: Record<string, string | number>): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { op?: OpFn };
  if (typeof w.op === 'function') {
    try { w.op('track', name, properties); } catch { /* analytics nunca quebra a pagina */ }
    return;
  }
  // SDK ainda não está no DOM: bufferiza em vez de empurrar no stub vazio
  // (item sem `init` na frente faz o op1.js lançar "Cannot read properties of
  // undefined (reading '1')" e o evento se perde — medido 26/11/2026).
  if (buffer.length < BUFFER_MAX) buffer.push([name, properties]);
  if (assinou) return;
  assinou = true;
  aoIniciarOp(() => {
    assinou = false;
    for (const [n, p] of buffer.splice(0)) {
      try {
        const alvo = window as unknown as { op?: OpFn };
        if (typeof alvo.op === 'function') alvo.op('track', n, p);
      } catch { /* idem: nunca quebra a pagina */ }
    }
  });
}

/**
 * Uma secao conta como "em foco" quando metade dela cabe na tela ou, se for
 * mais alta que a viewport, quando qualquer parte dela esta visivel.
 *
 * Medido em producao 26/11/2026: `#projects` tem 3043 px no desktop (viewport
 * 800) e 5092 px no mobile (viewport 844) — com `threshold: 0.5` o ratio
 * maximo possivel e 0.26 e 0.17, entao `section_time` NUNCA era emitido para a
 * maior secao do site. As secoes baixas (#blog, #contact, #games) funcionavam,
 * o que escondia o defeito numa primeira olhada.
 */
export function secaoEmFoco(ratio: number, alturaAlvo: number, alturaViewport: number): boolean {
  if (!Number.isFinite(ratio) || ratio <= 0) return false;
  if (!Number.isFinite(alturaAlvo) || !Number.isFinite(alturaViewport)) return false;
  if (alturaAlvo > alturaViewport) return true;
  return ratio >= 0.5;
}

/**
 * Nome do Web Vital a partir do `entryType`. LCP e CLS chegam com `name === ""`
 * (medido 26/11/2026 no Chromium), então `entry.name` não identifica nada —
 * era por isso que `web_vital` nunca saía.
 */
export function nomeDoVital(entryType: string): 'LCP' | 'CLS' | null {
  if (entryType === 'largest-contentful-paint') return 'LCP';
  if (entryType === 'layout-shift') return 'CLS';
  return null;
}

export interface VitalsAcumulados {
  /** Maior LCP visto (ms) — o LCP final e o último valor observado. */
  lcpMs: number;
  /** CLS somado, só de shifts sem input recente (regra do Web Vitals). */
  cls: number;
}

/**
 * Acumula uma entrada de performance. LCP substitui o valor anterior; CLS soma
 * apenas shifts sem `hadRecentInput` — exatamente a regra oficial, e evita o
 * flood de um evento por shift.
 */
export function acumularVital(
  estado: VitalsAcumulados,
  entrada: { entryType: string; startTime: number; value?: number; hadRecentInput?: boolean },
): void {
  const tipo = nomeDoVital(entrada.entryType);
  if (tipo === 'LCP') {
    if (Number.isFinite(entrada.startTime) && entrada.startTime > estado.lcpMs) estado.lcpMs = Math.round(entrada.startTime);
    return;
  }
  if (tipo === 'CLS' && !entrada.hadRecentInput) {
    const v = entrada.value;
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) estado.cls += v;
  }
}

/** Pares [métrica, valor] prontos para envio (CLS em milésimos, inteiro). */
export function vitaisParaEnviar(estado: VitalsAcumulados): Array<['LCP' | 'CLS', number]> {
  const saida: Array<['LCP' | 'CLS', number]> = [];
  if (estado.lcpMs > 0) saida.push(['LCP', Math.round(estado.lcpMs)]);
  if (estado.cls > 0) saida.push(['CLS', Math.round(estado.cls * 1000)]);
  return saida;
}
export function initEngagement(opts: EngagementOptions): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
  if (trackingDisabled()) return () => {};

  const site = opts.site;
  const prefix = opts.keyPrefix || 'eng';
  const path = location.pathname;
  const lang = document.documentElement.lang || 'pt-BR';
  const cleanups: Array<() => void> = [];
  const base = (): Record<string, string | number> => ({ site, path, lang });

  // --- scroll: marcos por pagina/sessao ---------------------------------
  const reached: number[] = [];
  const onScroll = (): void => {
    const pct = scrollPct(window.scrollY, document.documentElement.scrollHeight, window.innerHeight);
    const mark = nextMark(pct, reached);
    if (mark === null) return;
    const key = engagementKey(prefix, 'scroll', `${path}:${mark}`);
    if (!shouldSend(key)) return;
    reached.push(mark);
    markSent(key);
    emit('scroll_depth', { ...base(), pct: mark });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));
  onScroll();

  // --- secoes: tempo de permanencia por bloco ---------------------------
  if (opts.trackSections !== false && typeof IntersectionObserver !== 'undefined') {
    const entered = new Map<Element, number>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target;
        const id = el.getAttribute('data-track-section');
        if (!id) continue;
        const visivel = secaoEmFoco(e.intersectionRatio, e.boundingClientRect.height, window.innerHeight);
        if (visivel) {
          if (!entered.has(el)) entered.set(el, Date.now());
        } else {
          const t0 = entered.get(el);
          entered.delete(el);
          if (!t0) continue;
          const ms = Date.now() - t0;
          if (ms < 1000) continue; // ruido de passagem rapida
          const key = engagementKey(prefix, 'section', `${path}:${id}`);
          if (!shouldSend(key)) continue;
          markSent(key);
          emit('section_time', { ...base(), section: id, ms });
        }
      }
    // Thresholds que uma secao alta TAMBEM alcanca: com 0.5 fixo, #projects
    // (3043 px desktop / 5092 px mobile) nunca passava de 0.26/0.17.
    }, { threshold: [0, 0.25, 0.5, 1] });
    document.querySelectorAll('[data-track-section]').forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());
  }

  // --- cliques em botoes com data-analytics-id --------------------------
  if (opts.trackClicks !== false) {
    const onClick = (ev: MouseEvent): void => {
      const target = ev.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>('[data-analytics-id]');
      if (!el) return;
      const id = el.dataset.analyticsId || '';
      if (!id) return;
      const key = engagementKey(prefix, 'click', id);
      if (!shouldSend(key)) return;
      markSent(key);
      const label = (el.dataset.analyticsLabel || el.textContent || '').trim().slice(0, 60);
      emit('ui_click', { ...base(), id, label });
    };
    document.addEventListener('click', onClick, true);
    cleanups.push(() => document.removeEventListener('click', onClick, true));
  }

  // --- tempo de pagina (somente visivel) --------------------------------
  let visibleSince = document.visibilityState === 'visible' ? Date.now() : 0;
  let total = 0;
  const vitais: VitalsAcumulados = { lcpMs: 0, cls: 0 };

  /** Despeja os eventos de saida (tempo de pagina + vitais) uma vez por sessao. */
  const flush = (): void => {
    if (visibleSince) { total += Date.now() - visibleSince; visibleSince = 0; }
    const kTime = engagementKey(prefix, 'time', path);
    if (total >= 1000 && shouldSend(kTime)) {
      markSent(kTime);
      emit('engagement_time', { ...base(), ms: total });
    }
    // Vitais saem UMA vez por pagina/sessao: sem isso, cada `layout-shift`
    // virava um POST (medido 26/11/2026: ~30 eventos CLS num unico scroll).
    for (const [metric, value] of vitaisParaEnviar(vitais)) {
      const k = engagementKey(prefix, `vital-${metric}`, path);
      if (!shouldSend(k)) continue;
      markSent(k);
      emit('web_vital', { ...base(), metric, value });
    }
  };
  const onVisibility = (): void => {
    if (document.visibilityState === 'hidden') flush();
    else if (!visibleSince) visibleSince = Date.now();
  };
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', flush);
  cleanups.push(() => {
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', flush);
  });

  // --- Web Vitals e erros de JS -----------------------------------------
  if (opts.trackVitals !== false && typeof PerformanceObserver !== 'undefined') {
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          acumularVital(vitais, {
            entryType: entry.entryType,
            startTime: entry.startTime,
            value: (entry as PerformanceEntry & { value?: number }).value,
            hadRecentInput: (entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput,
          });
        }
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
      po.observe({ type: 'layout-shift', buffered: true });
      cleanups.push(() => po.disconnect());
    } catch { /* navegador sem suporte: segue sem vital */ }
  }
  if (opts.trackErrors !== false) {
    const onError = (ev: ErrorEvent): void => {
      const msg = String(ev.message || '').slice(0, 120);
      if (!msg) return;
      emit('js_error', { ...base(), message: msg });
    };
    window.addEventListener('error', onError);
    cleanups.push(() => window.removeEventListener('error', onError));
  }

  return () => cleanups.forEach((fn) => fn());
}
