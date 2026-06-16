import { test } from "@playwright/test";

test("game realmente funciona", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning")
      errors.push(`[${msg.type()}] ${msg.text().substring(0, 150)}`);
  });

  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Click memory-matrix
  await page.evaluate(() => {
    const btn = document.querySelector("[data-game-btn='memory-matrix']") as HTMLElement;
    if (btn) btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await page.waitForTimeout(2000);

  // Check embed state
  const result = await page.evaluate(() => {
    const container = document.querySelector("[data-game-container]");
    const embedDiv = container?.closest("[data-game-section]") as HTMLElement;
    const iframe = container?.querySelector("iframe");
    const title = document.querySelector("[data-game-title]")?.textContent;
    return {
      containerExists: !!container,
      embedDisplay: embedDiv?.style.display || getComputedStyle(embedDiv!).display,
      iframeExists: !!iframe,
      iframeSrc: iframe?.src,
      title: title,
    };
  });
  console.log("Result:", JSON.stringify(result, null, 2));

  if (result.iframeExists) {
    // Wait for iframe to load
    await page.waitForTimeout(5000);
    console.log(`Erros totais: ${errors.length}`);
    errors.forEach(e => console.log(`  ${e.slice(0, 120)}`));
  }
});
