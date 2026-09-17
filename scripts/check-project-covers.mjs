#!/usr/bin/env node
/**
 * Gate de capas: nada que ESTE commit publica pode ir ao ar sem capa real.
 *
 * Contexto (Samuel, 16/09/2026): projeto novo entrava pela API do GitHub sem
 * `imageUrl`, o card caia no fallback e o aviso so vinha do watchdog de 30min —
 * DEPOIS de estar no ar. Este gate inverte: roda no CI depois do build e ANTES
 * do deploy; achando capa quebrada no que este commit publica, o deploy nao
 * acontece.
 *
 * Duas categorias, de proposito separadas (senao o gate vira false positive e
 * trava push por motivo alheio ao commit):
 *
 *   BLOQUEIA (exit 1) — o defeito esta nos ARQUIVOS deste commit:
 *     · projeto em STATIC_PROJECTS sem `imageUrl` (vai cair no fallback)
 *     · `imageUrl`/`videoUrl` apontando para arquivo ausente no repo
 *     · arquivo pequeno demais (< MIN_BYTES) ou que nao e imagem/video
 *     · (modo --live) card no fallback ou capa que nao baixa na producao
 *
 *   NAO BLOQUEIA (exit 0) — sinal de projeto novo, fora deste commit:
 *     repo publico que apareceu na API do GitHub e ainda nao tem capa. Nao e
 *     este deploy que causa, e travar todo push ate alguem commitar a capa
 *     seria acoplar coisas independentes. Cobre-se por: fallback visual (card
 *     nunca fica pelado) + autogen 6h (abre PR com a capa) + watchdog 30min
 *     (avisa nos dois grupos). Aqui so reporta.
 *
 * A lista de projetos espelha EXATAMENTE o merge da home
 * (src/app/page.tsx getProjectData): repos da API + STATIC_PROJECTS, mesmos
 * filtros de exclusao. Divergencia aqui e falso negativo la.
 *
 * Fail-open SO em falha de medicao (API do GitHub fora, rede do CI): avisa e
 * segue, para nao pintar vermelho por infra. Fail-closed em achado real.
 *
 * Uso:
 *   node scripts/check-project-covers.mjs                        # gate pre-deploy
 *   node scripts/check-project-covers.mjs --live https://...      # site publicado
 *   node scripts/check-project-covers.mjs --json                  # saida maquina
 * Exit 0 = limpo | Exit 1 = achado bloqueante (mostra projeto:motivo).
 */
import { readFileSync, statSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { pathToFileURL } from "node:url";
import { setDefaultResultOrder } from "node:dns";

// O CI e esta maquina resolvem IPv6 primeiro e o fetch as vezes morre no
// handshake (visto 17/09: "fetch failed" intermitente). IPv4 primeiro + retry
// mantem a MEDICAO estavel — senao o gate mente (passa sem ter medido nada).
setDefaultResultOrder("ipv4first");

const FETCH_ATTEMPTS = 3;

export const GITHUB_REPOS_API =
  "https://api.github.com/users/Samuelfmedeiros/repos?per_page=20&sort=updated";

/** Mesmos filtros de src/lib/github.ts (name.includes("test")) + page.tsx. */
export const EXCLUDED_REPOS = ["SamuelFmedeiros", "arachne-mcp", "Arachne_Os_Crawl"];
export const EXCLUDED_SUBSTRING = "test";

/** Capa real tem corpo; abaixo disso e placeholder ou arquivo truncado. */
export const MIN_BYTES = 5_000;

export const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif", ".avif"]);
export const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);

/**
 * Entradas de STATIC_PROJECTS: nome, imagem e video referenciados.
 * Parser de texto (nao ha runtime de TS aqui) — por isso o teste em
 * src/lib/coverGate.test.ts trava o formato.
 */
export function parseStaticProjects(source) {
  const out = [];
  // cada entrada comeca em `id:` — o bloco vai ate o proximo `id:` ou o fim
  const blocks = source.split(/\n\s*id:\s*\d+\s*,/).slice(1);
  for (const block of blocks) {
    const name = block.match(/name:\s*"([^"]+)"/);
    if (!name) continue;
    const image = block.match(/imageUrl:\s*img\(\s*"([^"]+)"\s*\)/);
    const video = block.match(/videoUrl:\s*"([^"]+)"/);
    out.push({
      name: name[1],
      imageUrl: image ? image[1] : "",
      videoUrl: video ? video[1] : "",
      source: "static",
    });
  }
  return out;
}

/** Caminho local de um asset publico: "/projects/x.webp" -> "public/projects/x.webp". */
export function publicPath(url, publicDir = "public") {
  const clean = String(url || "").replace(/^\/+/, "");
  return join(publicDir, clean);
}

/**
 * Projetos que a home vai renderizar (merge da pagina), resolvendo a capa.
 * `githubRepos` = nomes vindos da API (vazio se a API falhou). Static tem
 * precedencia, como na home; quem so veio da API carrega source "api".
 */
export function effectiveProjects({ staticProjects, githubRepos = [] }) {
  const map = new Map();
  for (const name of githubRepos) {
    map.set(name, { name, imageUrl: "", videoUrl: "", source: "api" });
  }
  for (const p of staticProjects) map.set(p.name, p);
  return [...map.values()];
}

function defaultSize(path) {
  if (!existsSync(path)) return null;
  try {
    const st = statSync(path);
    return st.isFile() ? st.size : null;
  } catch {
    return null;
  }
}

/**
 * Separa o que bloqueia do que e apenas sinal.
 * `readSize` e injetado para o teste simular arquivo ausente/quebrado.
 */
export function validateProjects(projects, { publicDir = "public", readSize } = {}) {
  const size = readSize || defaultSize;
  const blocking = [];
  const advisory = [];
  let checked = 0;

  for (const p of projects) {
    checked++;
    const fromApiOnly = p.source === "api";

    if (!p.imageUrl) {
      // repo da API sem capa = projeto novo, nao defeito deste commit
      const entry = { name: p.name, reason: "card sem imageUrl (cairia no fallback)" };
      (fromApiOnly ? advisory : blocking).push(entry);
      continue;
    }

    const imgExt = extname(p.imageUrl).toLowerCase();
    if (!IMAGE_EXT.has(imgExt)) {
      blocking.push({ name: p.name, reason: `capa nao e imagem (${p.imageUrl})` });
      continue;
    }
    const bytes = size(publicPath(p.imageUrl, publicDir));
    if (bytes === null) {
      blocking.push({ name: p.name, reason: `capa ausente no repo (${p.imageUrl})` });
    } else if (bytes < MIN_BYTES) {
      blocking.push({
        name: p.name,
        reason: `capa de ${bytes}B (< ${MIN_BYTES}B) — ${p.imageUrl}`,
      });
    }

    if (p.videoUrl) {
      const vExt = extname(p.videoUrl).toLowerCase();
      const vBytes = size(publicPath(p.videoUrl, publicDir));
      if (!VIDEO_EXT.has(vExt)) {
        blocking.push({ name: p.name, reason: `video em formato inesperado (${p.videoUrl})` });
      } else if (vBytes === null) {
        blocking.push({ name: p.name, reason: `video ausente no repo (${p.videoUrl})` });
      } else if (vBytes < MIN_BYTES) {
        blocking.push({ name: p.name, reason: `video de ${vBytes}B — ${p.videoUrl}` });
      }
    }
  }
  return { blocking, advisory, violations: blocking, checked };
}

/**
 * Cards que cairam no fallback no HTML servido e capas que o HTML referencia.
 * Mesmo sinal que o watchdog de producao mede.
 */
export function parseLiveCards(html) {
  const fallback = [...new Set([...html.matchAll(/data-cover-name="([^"]+)"/g)].map((m) => m[1]))].sort();
  const covers = [...new Set(
    [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g)]
      .map((m) => m[1])
      .filter((src) => src.includes("/projects/"))
  )];
  return { fallback, covers };
}

/** fetch com retry — medicao instavel nao pode virar "tudo ok". */
async function fetchRetry(url, options = {}) {
  let lastErr;
  for (let i = 1; i <= FETCH_ATTEMPTS; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      lastErr = err;
      if (i < FETCH_ATTEMPTS) await new Promise((r) => setTimeout(r, 400 * i));
    }
  }
  throw lastErr;
}

async function fetchGithubRepos() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "covers-gate/1.0" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetchRetry(GITHUB_REPOS_API, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const repos = await res.json();
  return repos
    .map((r) => r.name)
    .filter((n) => !String(n).includes(EXCLUDED_SUBSTRING))
    .filter((n) => !EXCLUDED_REPOS.includes(n));
}

/** Mede o site publicado: fallback no HTML + cada capa baixada de verdade. */
async function liveViolations(baseUrl) {
  const home = baseUrl.replace(/\/+$/, "") + "/";
  const res = await fetchRetry(home, { headers: { "User-Agent": "covers-gate/1.0" } });
  if (!res.ok) throw new Error(`home respondeu ${res.status}`);
  const { fallback, covers } = parseLiveCards(await res.text());

  // Fallback em producao nao bloqueia: e estado de projeto novo (o commit nao
  // causa) e o watchdog de 30min ja avisa nos dois grupos. Capa referenciada que
  // nao baixa, sim — isso e defeito do que foi publicado.
  const advisory = fallback.map((name) => ({
    name,
    reason: "card caiu no fallback na producao (sem imagem)",
  }));
  const blocking = [];

  for (const src of covers) {
    const url = src.startsWith("http") ? src : new URL(src, home).toString();
    try {
      const r = await fetchRetry(url, { headers: { "User-Agent": "covers-gate/1.0" } });
      const ctype = r.headers.get("content-type") || "";
      const body = await r.arrayBuffer();
      if (!r.ok) blocking.push({ name: basename(url), reason: `capa HTTP ${r.status} (${url})` });
      else if (body.byteLength < MIN_BYTES)
        blocking.push({ name: basename(url), reason: `capa de ${body.byteLength}B (< ${MIN_BYTES}B)` });
      else if (!ctype.toLowerCase().includes("image"))
        blocking.push({ name: basename(url), reason: `capa content-type ${ctype}` });
    } catch (err) {
      blocking.push({ name: basename(url), reason: `capa nao baixou: ${err.message}` });
    }
  }
  return { blocking, advisory, checked: covers.length + fallback.length };
}

async function main() {
  const argv = process.argv.slice(2);
  const asJson = argv.includes("--json");
  const liveIdx = argv.indexOf("--live");
  const liveUrl = liveIdx >= 0 ? argv[liveIdx + 1] : "";

  const report = {
    mode: liveUrl ? "live" : "pre-deploy",
    checked: 0,
    measured: false,
    blocking: [],
    advisory: [],
    notes: [],
  };

  try {
    if (liveUrl) {
      const r = await liveViolations(liveUrl);
      report.checked = r.checked;
      report.measured = true;
      report.blocking = r.blocking;
      report.advisory = r.advisory;
    } else {
      const staticProjects = parseStaticProjects(readFileSync("src/lib/staticProjects.ts", "utf8"));
      if (!staticProjects.length) {
        report.notes.push("nao consegui parsear STATIC_PROJECTS — checagem abortada");
      }
      let githubRepos = [];
      try {
        githubRepos = await fetchGithubRepos();
        report.notes.push(`GitHub: ${githubRepos.length} repos publicos`);
      } catch (err) {
        // falha de medicao: nao pinta o CI de vermelho por infra
        report.notes.push(`GitHub API indisponivel (${err.message}) — repos novos nao checados`);
      }
      const r = validateProjects(effectiveProjects({ staticProjects, githubRepos }), {
        publicDir: "public",
      });
      report.measured = true;
      report.checked = r.checked;
      report.blocking = r.blocking;
      report.advisory = r.advisory;
    }
  } catch (err) {
    report.notes.push(`erro de medicao: ${err.message}`);
  }

  if (asJson) console.log(JSON.stringify(report, null, 2));
  else {
    for (const n of report.notes) console.log(`nota: ${n}`);
    for (const v of report.blocking) console.log(`BLOQUEIA=${v.name}:${v.reason}`);
    for (const a of report.advisory) console.log(`SEM_COBERTURA=${a.name}:${a.reason}`);
  }

  if (report.blocking.length) {
    if (!asJson) {
      console.error(
        `FAIL check-project-covers (${report.mode}): ${report.blocking.length} problema(s) bloqueante(s)`
      );
      console.error("Fix: python ~/.hermes/scripts/portfolio-covers-autogen.py (gera a capa e abre PR)");
      console.error("     ou ajuste imageUrl em src/lib/staticProjects.ts e commite o arquivo em public/projects/.");
    }
    process.exit(1);
  }

  // Medicao falhou: NUNCA dizer PASS. Exit 2 = nao medido (o CI trata como aviso,
  // nao como sucesso — foi assim que um "tudo ok" falso apareceu em 17/09).
  if (!report.measured) {
    if (!asJson) {
      console.error(`NAO_MEDIDO check-project-covers (${report.mode}): ${report.notes.join("; ") || "motivo desconhecido"}`);
    }
    process.exit(2);
  }

  if (!asJson) {
    const extra = report.advisory.length ? ` — ${report.advisory.length} repo novo sem capa (nao bloqueia)` : "";
    console.log(`PASS check-project-covers (${report.mode}): ${report.checked} card(s) checados${extra}`);
  }
  process.exit(0);
}

// So executa chamado direto pela CLI — importar no teste nao roda nada.
const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) main();