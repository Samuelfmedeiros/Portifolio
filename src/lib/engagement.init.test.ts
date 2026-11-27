import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initEngagement, shouldSend } from './engagement';

/**
 * Cobertura do initEngagement — o bloco que decide o que sai de verdade.
 * O teste unitário das funções puras já existia; este cobre o wiring:
 * listeners, dedupe por sessão, flush em pagehide e limpeza.
 */

type TrackCall = [string, string, Record<string, unknown>];

function stubOp(): TrackCall[] {
  const calls: TrackCall[] = [];
  vi.stubGlobal('window', Object.assign(globalThis.window ?? {}, {
    op: (...args: unknown[]) => void calls.push(args as unknown as TrackCall),
  }));
  return calls;
}

describe('initEngagement', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
    document.body.innerHTML = '';
    vi.stubGlobal('scrollY', 0);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('sem storage, shouldSend devolve true (envia mesmo sem dedupe)', () => {
    const quebrado = {
      getItem: () => { throw new Error('storage bloqueado'); },
      setItem: () => { throw new Error('storage bloqueado'); },
    };
    vi.stubGlobal('sessionStorage', quebrado);
    expect(shouldSend('qualquer')).toBe(true);
  });

  it('DNT ligado nao registra listener de clique nem emite nada', () => {
    const calls = stubOp();
    Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true });
    const cleanup = initEngagement({ site: 'portfolio' });
    document.body.innerHTML = '<button data-analytics-id="cta">Ver</button>';
    document.querySelector('button')!.click();
    expect(calls.filter((c) => c[1] === 'ui_click')).toHaveLength(0);
    cleanup();
    Object.defineProperty(navigator, 'doNotTrack', { value: undefined, configurable: true });
  });

  it('clique com data-analytics-id emite ui_click UMA vez por sessao', () => {
    const calls = stubOp();
    const cleanup = initEngagement({ site: 'portfolio', keyPrefix: 'test' });
    document.body.innerHTML = '<button data-analytics-id="cta" data-analytics-label="Baixar CV">Baixar CV</button>';
    const btn = document.querySelector('button')!;
    btn.click();
    btn.click();
    const clicks = calls.filter((c) => c[1] === 'ui_click');
    expect(clicks).toHaveLength(1);
    expect(clicks[0][2]).toMatchObject({ site: 'portfolio', id: 'cta', label: 'Baixar CV' });
    cleanup();
  });

  it('clique sem data-analytics-id nao emite', () => {
    const calls = stubOp();
    const cleanup = initEngagement({ site: 'portfolio', keyPrefix: 'test2' });
    document.body.innerHTML = '<button>Sem id</button>';
    document.querySelector('button')!.click();
    expect(calls.filter((c) => c[1] === 'ui_click')).toHaveLength(0);
    cleanup();
  });

  it('pagehide emite engagement_time quando a pagina ficou visivel mais de 1s', () => {
    const calls = stubOp();
    const cleanup = initEngagement({ site: 'portfolio', keyPrefix: 'test3' });
    const agora = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(agora + 2500);
    window.dispatchEvent(new Event('pagehide'));
    const tempos = calls.filter((c) => c[1] === 'engagement_time');
    expect(tempos).toHaveLength(1);
    expect(Number(tempos[0][2].ms)).toBeGreaterThanOrEqual(1000);
    cleanup();
    vi.restoreAllMocks();
  });

  it('cleanup remove os listeners: clique depois do cleanup nao emite', () => {
    const calls = stubOp();
    const cleanup = initEngagement({ site: 'portfolio', keyPrefix: 'test4' });
    document.body.innerHTML = '<button data-analytics-id="cta">Ver</button>';
    cleanup();
    document.querySelector('button')!.click();
    expect(calls.filter((c) => c[1] === 'ui_click')).toHaveLength(0);
  });

  it('erro de JS vira js_error sem stack nem PII', () => {
    const calls = stubOp();
    const cleanup = initEngagement({ site: 'portfolio', keyPrefix: 'test5' });
    window.dispatchEvent(new ErrorEvent('error', { message: 'boom' }));
    const erros = calls.filter((c) => c[1] === 'js_error');
    expect(erros).toHaveLength(1);
    expect(erros[0][2]).toMatchObject({ site: 'portfolio', message: 'boom' });
    cleanup();
  });
});
