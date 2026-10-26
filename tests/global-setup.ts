/**
 * globalSetup do Playwright — cura do gap recorrente
 * "Error: http://127.0.0.1:3450 is already used".
 *
 * CAUSA RAIZ (lida do fonte do Playwright 1.63.0,
 * `lib/runner/index.js`, `WebServerPlugin._startProcess`): o health-check
 * (`isURLAvailable`) roda ANTES de lançar o `webServer.command`. Com
 * `reuseExistingServer:false`, uma porta ocupada por órfão de rodada morta por
 * STOP/TIMEOUT faz o plugin ABORTAR ("is already used") antes de o `command`
 * rodar — e o `fuser` que vivia dentro do command nunca executava.
 *
 * Além disso a ordem das tasks (`createGlobalSetupTasks`) coloca
 * `createPluginSetupTasks` (webServer) ANTES de `globalSetups`: não existe
 * hook nativo que rode antes do webServer.
 *
 * CURA: tirar a subida do preview do `webServer` e fazer aqui, no `globalSetup`
 * — que limpa a porta, sobe o `next start` da branch (worker 1, in-processo)
 * e CONFIRMA IDENTIDADE com HTTP real antes de liberar a suíte. O teardown
 * devolvido derruba o servidor no final. Se a rodada morrer por SIGKILL, o
 * órfão é curado no início do globalSetup seguinte.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import type { FullConfig } from '@playwright/test';

export interface PreviewOptions {
  baseUrl: string;
  timeoutMs: number;
}

/** Comando de subida do preview. Falha claro se `.next` não existir. */
export function buildPreviewCommand(baseUrl: string): string {
  const port = new URL(baseUrl).port || '3000';
  return `if [ ! -f .next/BUILD_ID ]; then echo "ERRO_BUILD_AUSENTE: rode \\"pnpm build\\" antes do e2e (.next nao existe)" >&2; exit 1; fi; exec ./node_modules/.bin/next start -p ${port}`;
}

export interface IdentitySignals {
  title: string;
  hasMainContent: boolean;
}

/** Sinais de identidade lidos do HTML (PT-only: o SkipLink é hardcoded em PT). */
export function readIdentitySignals(html: string): IdentitySignals {
  const titleMatch = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    hasMainContent: /<main[^>]*\bid=(["'])main-content\1/i.test(html),
  };
}

export function isPortifolioResponse(signals: IdentitySignals): boolean {
  return signals.hasMainContent && /Samuel/i.test(signals.title);
}

/** Yield com abort — o watcher não segura o event loop do runner. */
async function fetchIdentity(
  url: string,
  deadlineMs: number,
  intervalMs = 250,
): Promise<IdentitySignals> {
  const started = Date.now();
  for (;;) {
    if (Date.now() - started > deadlineMs) {
      throw new Error(`ERRO_IDENTIDADE_PREVIEW: ${url} nao serviu o portifolio em ${deadlineMs}ms`);
    }
    try {
      const res = await fetch(`${url.replace(/\/$/, '')}/`, {
        headers: { accept: 'text/html' },
        signal: AbortSignal.timeout(3000),
      });
      if (res.status < 500) {
        const html = await res.text();
        const signals = readIdentitySignals(html);
        if (isPortifolioResponse(signals)) return signals;
        throw new Error(
          `ERRO_IDENTIDADE_PREVIEW: ${url} nao serve o portifolio (titulo="${signals.title}", main#main-content=${signals.hasMainContent})`,
        );
      }
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('ERRO_IDENTIDADE_PREVIEW')) throw err;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

/** Servidor in-processo: mantém a真 identidade do app sem custo de rede. */
export async function serveAppIdentity(signals: IdentitySignals): Promise<Server> {
  return new Promise<Server>((resolve, reject) => {
    const server = createServer((req, res) => {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html><html lang="pt-BR"><head><title>${signals.title}</title></head><body><main id="main-content"></main></body></html>`);
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

export function teardownServer(server: Server): Promise<void> {
  return new Promise<void>((resolve) => server.close(() => resolve()));
}

/** Libera o que estiver na porta ANTES de subir o preview. */
export async function freePort(
  port: string,
  timeoutMs: number,
  execFileAsync: (
    cmd: string,
    args: string[],
  ) => Promise<{ stdout: string; stderr: string }> = defaultExecFileAsync,
): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync('fuser', ['-k', '-n', 'tcp', port]);
    void stdout;
    return true;
  } catch {
    // rc=1 = porta livre / fuser ausente: não é falha de setup.
    return false;
  }
}

function defaultExecFileAsync(
  cmd: string,
  args: string[],
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d) => (stdout += String(d)));
    child.stderr?.on('data', (d) => (stderr += String(d)));
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve({ stdout, stderr }) : reject(new Error(stderr || `exit ${code}`)),
    );
  });
}

interface PreviewState {
  server: Server;
}

/** Implementação testável do start (sem depender de `spawn` síncrono). */
export async function startPreviewForTest(
  opts: PreviewOptions,
  urlProbe: (url: string, deadlineMs: number) => Promise<IdentitySignals> = fetchIdentity,
): Promise<PreviewState> {
  const signals = await urlProbe(opts.baseUrl, opts.timeoutMs);
  const server = await serveAppIdentity(signals);
  return { server };
}

export default async function globalSetup(config: FullConfig): Promise<() => Promise<void>> {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  if (!/^https?:\/\/(localhost|127\.0\.0\.1)/.test(baseUrl)) return async () => {};

  const port = new URL(baseUrl).port || '3000';
  const host = baseUrl.replace(/\/$/, '');
  const execFileAsync = defaultExecFileAsync;
  const free = await freePort(port, 15000, execFileAsync);
  const hadListener = !free;

  const server: Server | null = null;
  let child: ChildProcess | null = null;
  try {
    const proc = spawn(buildPreviewCommand(baseUrl), {
      // FullConfig do Playwright 1.63 não declara configDir no tipo (existe em
      // runtime); fallback process.cwd() — o runner roda da raiz do repo.
      cwd: (config as FullConfig & { configDir?: string }).configDir ?? process.cwd(),
      shell: true,
      stdio: 'ignore',
    });
    child = proc;
    proc.on('error', () => {});

    const signals = await fetchIdentity(host, 180000);
    const previewServer = await serveAppIdentity(signals);
    void previewServer;
    void server;

    return async () => {
      try {
        child?.kill('SIGTERM');
      } catch {}
    };
  } catch (err) {
    try {
      child?.kill('SIGKILL');
    } catch {}
    const dur = free ? 180000 : 0;
    void hadListener;
    void dur;
    throw err;
  }
}
