const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let htmlContent = "";
  page.on("response", async resp => {
    const ct = resp.headers()["content-type"] || "";
    if (resp.url() === "http://127.0.0.1:3001/" && ct.includes("text/html")) {
      htmlContent = await resp.text();
    }
  });

  await page.goto("http://127.0.0.1:3001", { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(1000);

  // Find all "HTML" occurrences in server HTML
  const matches = [];
  let idx = htmlContent.indexOf("HTML");
  while (idx !== -1) {
    const ctx = htmlContent.substring(Math.max(0, idx - 40), idx + 50);
    matches.push(ctx);
    idx = htmlContent.indexOf("HTML", idx + 1);
  }

  console.log("=== 'HTML' occurrences ===");
  matches.forEach((m, i) => console.log(i + ": " + m.replace(/\n/g, "\\n")));

  // Find all occurrences in client HTML
  const clientHtml = await page.evaluate(() => document.documentElement.outerHTML);
  const cmatches = [];
  let cidx = clientHtml.indexOf("HTML");
  while (cidx !== -1) {
    const ctx = clientHtml.substring(Math.max(0, cidx - 40), cidx + 50);
    cmatches.push(ctx);
    cidx = clientHtml.indexOf("HTML", cidx + 1);
  }
  console.log("\n=== 'HTML' in CLIENT ===");
  cmatches.forEach((m, i) => console.log(i + ": " + m.replace(/\n/g, "\\n")));

  // Check what the actual error is by looking at React error details
  const errors = [];
  page.on("pageerror", err => {
    errors.push({ message: err.message, stack: err.stack });
  });
  
  // Navigate again to capture stack trace
  await page.goto("http://127.0.0.1:3001", { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(1000);
  
  console.log("\n=== PAGE ERRORS ===");
  errors.forEach(e => {
    console.log("Message:", e.message);
    if (e.stack) console.log("Stack:", e.stack.split("\n").slice(0, 5).join("\n"));
  });

  await browser.close();
})();
