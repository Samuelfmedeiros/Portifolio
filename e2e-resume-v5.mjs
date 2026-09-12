// e2e-resume-v5.mjs — E2E do Resume Tailor V5 (desktop + mobile, API real)
// Uso: node e2e-resume-v5.mjs <baseURL> <outdir>
// Ciclo por tentativa: reabre modal do zero (estado limpo), digita, submete.
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.argv[2] || "http://localhost:3377";
const OUT = process.argv[3] || "output/resume-tailor-shots/2026-09-04-v5";
fs.mkdirSync(OUT, { recursive: true });

const JOB = "Backend Python Senior position at Nubank";

async function scrollAll(page) {
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const t = setInterval(() => {
        y += 600; window.scrollTo(0, y);
        if (y >= document.body.scrollHeight) { clearInterval(t); res(); }
      }, 60);
    });
  });
}

async function openModal(page, tag) {
  const openBtn = page.locator("button:has-text('Download Customized Resume')").first();
  // tenta até 2x: click → espera input aparecer
  for (let i = 0; i < 2; i++) {
    await openBtn.click({ force: true, timeout: 20000 });
    const opened = await page.waitForSelector("#resume-tailor-input", { timeout: 20000 }).catch(() => null);
    if (opened) break;
    console.log(`  [${tag}] modal não abriu (tentativa ${i + 1}/2 de click)`);
  }
  const box = await page.waitForSelector("#resume-tailor-input", { timeout: 20000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, `modal-${tag}-open.png`) });
}

// 1 submissão: resolve {dl} ou {err}
async function submitOnce(page) {
  const dlObj = page.waitForEvent("download", { timeout: 180000 }).catch(() => null);
  const errP = page.waitForSelector("form:has(#resume-tailor-input) p.text-red-400", { timeout: 180000 })
    .then((el) => el.textContent()).catch(() => null);
  await page.locator("form:has(#resume-tailor-input) button[type=submit]").click({ force: true, timeout: 10000 });
  const which = await Promise.race([
    dlObj.then((d) => (d ? { dl: d } : null)),
    errP.then((t) => (t ? { err: (t || "").trim().slice(0, 120) } : null)),
  ]);
  return which || { err: null };
}

async function runFlow(browser, { mobile }) {
  const tag = mobile ? "mobile" : "desktop";
  const ctx = await browser.newContext(
    mobile
      ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" }
      : { viewport: { width: 1366, height: 900 } }
  );
  const page = await ctx.newPage();
  const errors = [];
  const known = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text() || "";
    const u = (m.location() && m.location().url) || "";
    // pré-existentes (provado em load puro sem interação — nada a ver com V5)
    if (t.includes("hydrated but some attributes")) { known.push("hydration (pre-existente)"); return; }
    if (t.includes("ERR_BLOCKED_BY_RESPONSE")) { known.push("blocked: " + u.slice(-80)); return; }
    // analytics do Umami: o site manda para capivara.seu.pet, que não libera
    // origin localhost — pre-existente, independe do V5
    if (t.includes("CORS policy") && (t.includes("/api/umami/") || u.includes("capivara.seu.pet"))) {
      known.push("umami CORS (pre-existente)");
      return;
    }
    // o console também emite "Failed to load resource: net::ERR_FAILED" para o
    // mesmo POST do Umami. Só é conhecido se a URL apontar para o Umami —
    // qualquer outro ERR_FAILED segue contando como falha (com a URL no texto).
    if (t.includes("ERR_FAILED")) {
      if (u.includes("capivara.seu.pet") || u.includes("umami")) {
        known.push("umami ERR_FAILED (pre-existente)");
        return;
      }
      errors.push(`ERR_FAILED url=${u || "(sem url)"} :: ${t.slice(0, 160)}`);
      return;
    }
    errors.push(t.slice(0, 200));
  });

  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(5000);

  // cookies — alguns botões exigem consent
  for (const t of ["Accept all", "Accept", "Aceitar todos", "Aceitar"]) {
    const b = page.locator(`button:has-text('${t}')`).first();
    if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); break; }
  }
  await page.waitForTimeout(800);
  await scrollAll(page);
  await page.waitForTimeout(1500);

  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const st = tag + (attempt > 0 ? `-try${attempt + 1}` : "");
    // 🔴 Rate limit da rota = 3 req/min POR IP (RATE_MAX=3). Em dev o servidor
    // lê x-forwarded-for e, sem ele, todas as chamadas caem na MESMA chave
    // ("unknown") — desktop+2 tentativas do mobile estouram o teto e o 4º POST
    // vira 429 "Muitas requisições. Aguarde um minuto." (a falha da 3ª
    // reabertura). Em produção cada cliente tem IP próprio. Aqui simulamos
    // isso com um IP por tentativa/device — sem isso o teste é falso-negativo.
    const fakeIp = `10.77.${mobile ? 2 : 1}.${attempt + 1}`;
    await ctx.setExtraHTTPHeaders({ "x-forwarded-for": fakeIp });
    try {
      await openModal(page, st);
    } catch (e) {
      lastErr = "abrir modal: " + e.message.slice(0, 80);
      console.log(`  [${tag}] ${lastErr} — recarrego página e reabro`);
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForTimeout(8000);
      await scrollAll(page);
      continue;
    }

    const ta = page.locator("#resume-tailor-input");
    await ta.fill(JOB, { timeout: 15000 });
    let filled = await ta.inputValue();
    if (filled !== JOB) {
      // fallback: digitação lenta (controlled input pode dropar keys do fill raro)
      await ta.fill("");
      await ta.click({ force: true });
      await page.keyboard.type(JOB, { delay: 30 });
      filled = await ta.inputValue();
    }
    if (filled !== JOB) {
      const diffChars = [...filled].filter((c, i) => c !== JOB[i]).slice(0, 5).map((c) => c.codePointAt(0));
      lastErr = "textarea diff chars=" + JSON.stringify(diffChars) + " len=" + filled.length + "/" + JOB.length;
      console.log(`  [${tag}] ${lastErr}`);
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(60000);
      continue;
    }

    const submitBtn = page.locator("form:has(#resume-tailor-input) button[type=submit]");
    for (let i = 0; i < 20 && !(await submitBtn.isEnabled().catch(() => false)); i++) {
      await page.waitForTimeout(300);
    }

    const r = await submitOnce(page);
    if (r.dl) {
      const pdfPath = path.join(OUT, `tailored-${tag}.pdf`);
      await r.dl.saveAs(pdfPath);
      await page.waitForSelector("text=Resume generated!", { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT, `modal-${tag}-success.png`) });

      const diffVisible = await page.locator("text=What the AI changed").first().isVisible().catch(() => false);
      const matchVisible = await page.locator("text=Job match").first().isVisible().catch(() => false);
      const skillsVisible = await page.locator("text=Skills prioritized").first().isVisible().catch(() => false);
      const head = Buffer.from(fs.readFileSync(pdfPath)).subarray(0, 5).toString();
      const size = fs.statSync(pdfPath).size;
      await ctx.close();
      return { tag, pdfPath, head, size, diffVisible, matchVisible, skillsVisible, errors, knownCount: known.length, knownUrls: known.filter((k) => k.startsWith("blocked:")) };
    }
    lastErr = r.err || "sem resposta (nem download nem erro visível)";
    console.log(`  [${tag}] tentativa ${attempt + 1} falhou: ${lastErr} — 60s e reabre`);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(60000);
  }
  await ctx.close();
  throw new Error(`[${tag}] submit falhou apos 3 tentativas: ${lastErr}`);
}

const browser = await chromium.launch();
const results = [];
for (const m of [false, true]) {
  results.push(await runFlow(browser, { mobile: m }));
}
// ── gate de CONTEÚDO: extrai o texto do PDF e recusa placeholder ──
// (o gate antigo só olhava size > 20000 — foi por isso que um PDF placeholder
// de 19KB quase passou, e o de 33KB com miolo falso passaria igual)
const PLACEHOLDER_TOKENS = [
  "ajustado para a vaga",
  "reescrito para a vaga",
  "requisito da vaga",
  "cargo real do CV",
  "evidência real do CV",
  "bullet1",
  "bullet2",
  "skill1",
  "skill2",
  "skill3",
];

function pdfTextChecks(pdfPath) {
  let text = "";
  try {
    text = execFileSync("pdftotext", ["-layout", pdfPath, "-"], { encoding: "utf8", timeout: 30000 });
  } catch (e) {
    return { ok: false, reason: "pdftotext falhou: " + e.message.slice(0, 120), text: "", hits: [] };
  }
  const lower = text.toLowerCase();
  const hits = PLACEHOLDER_TOKENS.filter((t) => lower.includes(t));
  const hasJobTerm = /nubank|python|backend|fastapi/i.test(text);
  const ok = text.trim().length > 1200 && hits.length === 0 && hasJobTerm;
  return { ok, reason: ok ? "conteudo real" : `chars=${text.trim().length} placeholders=${hits.length} jobTerm=${hasJobTerm}`, text, hits };
}

await browser.close();

let ok = true;
for (const r of results) {
  const pdfOk = r.head === "%PDF-" && r.size > 20000;
  const content = pdfTextChecks(r.pdfPath);
  const pass =
    pdfOk &&
    content.ok &&
    r.diffVisible &&
    r.errors.length === 0 &&
    r.knownCount !== undefined &&
    r.knownCount >= 0;
  if (!pass) ok = false;
  console.log(`[${r.tag.toUpperCase()}] pdf=${r.head} size=${r.size} diff=${r.diffVisible} match=${r.matchVisible} skills=${r.skillsVisible} errors=${r.errors.length}${r.knownCount ? " (known:" + r.knownCount + ")" : ""} => ${pass ? "PASS" : "FAIL"}`);
  for (const e of r.errors.slice(0, 5)) console.log("   " + e);
  if (!pdfOk) console.log(`   PDF invalido: ${r.pdfPath}`);
  console.log(`   conteudo: ${content.ok ? "OK" : "FALHOU"} (${content.reason})`);
  if (content.hits.length) console.log(`   placeholders: ${content.hits.join(", ")}`);
}
console.log(ok ? "E2E_V5_PASS" : "E2E_V5_FAIL");
process.exit(ok ? 0 : 1);
