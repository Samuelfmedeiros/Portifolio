import { loadOpenpanelScript } from './openpanel';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SCROLL_MARKS,
  acumularVital,
  engagementKey,
  emit,
  nextMark,
  nomeDoVital,
  scrollPct,
  secaoEmFoco,
  shouldSend,
  trackingDisabled,
  vitaisParaEnviar,
} from './engagement';

describe('scrollPct', () => {
  it('documento mais curto que a janela = 100%', () => {
    expect(scrollPct(0, 500, 800)).toBe(100);
  });

  it('topo/fim e clamp de overscroll', () => {
    expect(scrollPct(0, 3000, 800)).toBe(0);
    expect(scrollPct(2200, 3000, 800)).toBe(100);
    expect(scrollPct(99999, 3000, 800)).toBe(100);
    expect(scrollPct(-50, 3000, 800)).toBe(0);
  });

  it('valores invalidos nao quebram', () => {
    expect(scrollPct(Number.NaN, 3000, 800)).toBe(0);
    expect(scrollPct(0, 0, 0)).toBe(100);
  });
});

describe('nextMark', () => {
  it('emite o marco cruzado e nunca repete', () => {
    expect(nextMark(24)).toBeNull();
    expect(nextMark(25)).toBe(25);
    expect(nextMark(80, [25, 50, 75])).toBeNull();
    expect(nextMark(100, [25, 50])).toBe(75);
  });

  it('marcos sao 25/50/75/100', () => {
    expect([...SCROLL_MARKS]).toEqual([25, 50, 75, 100]);
  });
});

describe('engagementKey / shouldSend', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('chave e estavel e isolada por prefixo', () => {
    expect(engagementKey('ll', 'scroll', '/post/x:50')).toBe('ll:scroll:/post/x:50');
    expect(engagementKey('', 'click', 'cta')).toBe('eng:click:cta');
  });

  it('respeita sessionStorage quando disponivel', () => {
    const data = new Map<string, string>();
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    });
    expect(shouldSend('k')).toBe(true);
    data.set('k', '1');
    expect(shouldSend('k')).toBe(false);
  });
});

describe('trackingDisabled', () => {
  it('DNT e GPC desligam', () => {
    expect(trackingDisabled({ doNotTrack: '1' } as unknown as Navigator)).toBe(true);
    expect(trackingDisabled({ globalPrivacyControl: true } as unknown as Navigator)).toBe(true);
    expect(trackingDisabled({ doNotTrack: '0' } as unknown as Navigator)).toBe(false);
  });
});

describe('emit', () => {
  it('chama window.op("track", ...) e engole erro', () => {
    const calls: unknown[][] = [];
    vi.stubGlobal('window', {
      op: (...args: unknown[]) => void calls.push(args),
    });
    emit('ui_click', { site: 'lifelog', id: 'cta', label: 'Ver mais' });
    expect(calls).toEqual([['track', 'ui_click', { site: 'lifelog', id: 'cta', label: 'Ver mais' }]]);
  });

  it('sem window e silencioso', () => {
    vi.stubGlobal('window', undefined);
    expect(() => emit('x', {})).not.toThrow();
  });

  it('sem op antes do load: bufferiza e NÃO cria stub pela metade', () => {
    const janela: { op?: unknown } = {};
    vi.stubGlobal('window', janela);
    emit('web_vital', { site: 'portfolio', metric: 'LCP', value: 1200 });
    // stub sem `init` na frente quebra o op1.js — então nem criamos
    expect(janela.op).toBeUndefined();

    // quando o SDK entra (loadOpenpanelScript), o buffer é despejado na fila,
    // DEPOIS do init — que é a ordem que o op1.js espera
    loadOpenpanelScript();
    const fila = (janela.op as { q?: unknown[][] } | undefined)?.q ?? [];
    expect(fila.length).toBeGreaterThanOrEqual(2);
    expect(fila[0][0]).toBe('init');
    expect(fila).toContainEqual(['track', 'web_vital', { site: 'portfolio', metric: 'LCP', value: 1200 }]);
  });

  it('bufferiza no maximo 50 eventos (nao cresce sem limite)', () => {
    const janela: { op?: unknown } = {};
    vi.stubGlobal('window', janela);
    for (let i = 0; i < 80; i++) emit('scroll_depth', { site: 'portfolio', pct: i });
    expect(janela.op).toBeUndefined();
  });
});

describe('nomeDoVital', () => {
  it('identifica pelo entryType (entry.name vem vazio no Chromium)', () => {
    expect(nomeDoVital('largest-contentful-paint')).toBe('LCP');
    expect(nomeDoVital('layout-shift')).toBe('CLS');
  });

  it('entryType desconhecido nao vira evento', () => {
    expect(nomeDoVital('')).toBeNull();
    expect(nomeDoVital('paint')).toBeNull();
  });
});

describe('acumularVital / vitaisParaEnviar', () => {
  it('LCP guarda o maior valor visto, nao um evento por entrada', () => {
    const e = { lcpMs: 0, cls: 0 };
    acumularVital(e, { entryType: 'largest-contentful-paint', startTime: 180 });
    acumularVital(e, { entryType: 'largest-contentful-paint', startTime: 640 });
    acumularVital(e, { entryType: 'largest-contentful-paint', startTime: 320 });
    expect(vitaisParaEnviar(e)).toEqual([['LCP', 640]]);
  });

  it('CLS soma shifts sem input recente e ignora os com input', () => {
    const e = { lcpMs: 0, cls: 0 };
    acumularVital(e, { entryType: 'layout-shift', startTime: 0, value: 0.02 });
    acumularVital(e, { entryType: 'layout-shift', startTime: 0, value: 0.3, hadRecentInput: true });
    acumularVital(e, { entryType: 'layout-shift', startTime: 0, value: 0.018 });
    // 0.038 acumulado -> 38 milésimos
    expect(vitaisParaEnviar(e)).toEqual([['CLS', 38]]);
  });

  it('sem nada observado nao envia evento', () => {
    expect(vitaisParaEnviar({ lcpMs: 0, cls: 0 })).toEqual([]);
  });

  it('entrada invalida nao contamina o estado', () => {
    const e = { lcpMs: 0, cls: 0 };
    acumularVital(e, { entryType: 'layout-shift', startTime: 0, value: Number.NaN });
    acumularVital(e, { entryType: 'largest-contentful-paint', startTime: Number.NaN });
    expect(vitaisParaEnviar(e)).toEqual([]);
  });
});

describe('secaoEmFoco', () => {
  it('secao mais alta que a viewport conta como em foco com qualquer parte visivel', () => {
    // #projects real: 3043 px em viewport 800 (ratio maximo 0.26)
    expect(secaoEmFoco(0.26, 3043, 800)).toBe(true);
    // mobile: 5092 px em viewport 844 (ratio maximo 0.17)
    expect(secaoEmFoco(0.17, 5092, 844)).toBe(true);
  });

  it('secao que cabe na viewport continua exigindo metade visivel', () => {
    expect(secaoEmFoco(0.49, 434, 800)).toBe(false);
    expect(secaoEmFoco(0.5, 434, 800)).toBe(true);
  });

  it('fora da tela e entrada invalida nunca contam', () => {
    expect(secaoEmFoco(0, 3043, 800)).toBe(false);
    expect(secaoEmFoco(Number.NaN, 3043, 800)).toBe(false);
    expect(secaoEmFoco(0.3, Number.NaN, 800)).toBe(false);
  });
});
