import { test } from "@playwright/test";

test("debug games render", async ({ page }) => {
  const errors: string[] = [];

  page.on("console", (msg) => {
    errors.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    errors.push(`[PAGE ERROR] ${err.message}`);
    errors.push(`[STACK] ${err.stack?.substring(0, 1000) || "none"}`);
  });
  page.on("requestfailed", (req) =>
    errors.push(
      `[REQ FAIL] ${req.url().substring(0, 120)} - ${req.failure()?.errorText || "?"}`
    )
  );

  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForSelector("#games", { timeout: 10000 });
  await page.waitForTimeout(500);

  // Click memory-matrix (uses DEV build, shows full error)
  const gameBtn = page.locator("button[aria-label='Jogar memory-matrix']");
  await gameBtn.click();
  await page.waitForTimeout(5000);

  console.log("\n=== ERRORS ===");
  for (const err of errors) console.log(err);
});
