import assert from "node:assert/strict";
import fs from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { launchBrowser } from "../scripts/browser.mjs";
import { serve } from "../scripts/serve.mjs";
const server = serve(4173);
const browser = await launchBrowser();
const dir = "test-results";
fs.mkdirSync(dir, { recursive: true });
const base = "http://127.0.0.1:4173/SAML_Theory/";
const manifest = JSON.parse(
  fs.readFileSync("docs/build-manifest.json", "utf8"),
);
const failures = [];
const results = [];
async function audit(page, name) {
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  fs.writeFileSync(`${dir}/axe-${name}.json`, JSON.stringify(report, null, 2));
  assert.deepEqual(
    report.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
    })),
    [],
    name,
  );
}
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => failures.push(error.message));
  for (const route of [
    "",
    "reference/",
    "search/",
    ...manifest.documents.map((d) => d.route),
  ]) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator("h1").count(), 1, route);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      true,
      `Horizontal page overflow: ${route}`,
    );
  }
  results.push(
    "All 34 navigable pages load without page-level overflow or script exceptions.",
  );
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${dir}/home-desktop.png`, fullPage: true });
  await audit(page, "home");
  await page.getByRole("link", { name: "Start with Lesson 1" }).click();
  assert(page.url().includes("/lessons/lesson-01-"));
  assert(
    (
      await page
        .locator(".prose p")
        .first()
        .evaluate((el) => getComputedStyle(el).fontFamily)
    ).includes("Source Serif 4"),
  );
  await page.screenshot({ path: `${dir}/lesson-desktop.png`, fullPage: true });
  await audit(page, "lesson");
  const trigger = page.getByRole("link", { name: "Open full diagram" }).first();
  await trigger.click();
  assert.equal(await page.locator("dialog[open]").count(), 1);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog[open]").count(), 0);
  assert.equal(
    await trigger.evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByRole("link", { name: "Questions (15)" }).click();
  const summaries = page
    .locator("summary")
    .filter({ hasText: "Show explanation" });
  await summaries.nth(0).click();
  await summaries.nth(1).click();
  assert.equal(await page.locator("article details[open]").count(), 2);
  await audit(page, "questions");
  await page.getByRole("link", { name: "Search", exact: true }).click();
  const input = page.getByRole("searchbox", { name: "Search terms" });
  await input.fill("RelayState");
  assert((await page.locator("#search-results li").count()) > 0);
  assert(page.url().includes("q=RelayState"));
  await page.reload();
  assert.equal(await input.inputValue(), "RelayState");
  await input.fill("no-such-topic-zzz");
  assert.equal(await page.locator("#no-results").isVisible(), true);
  await page.getByRole("button", { name: "Clear search" }).click();
  assert.equal(await page.locator("#search-results li").count(), 31);
  assert.equal(
    await input.evaluate((el) => el === document.activeElement),
    true,
  );
  await audit(page, "search");
  const missing = await page.goto(base + "missing-page/");
  assert.equal(missing.status(), 404);
  await audit(page, "not-found");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [name, route] of [
    ["home", ""],
    ["lesson", manifest.documents[0].route],
    ["questions", "questions/lesson-01/"],
    ["reference", "reference/"],
  ]) {
    await page.goto(base + route);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      true,
      name,
    );
    assert.equal(await page.locator(".course-menu").getAttribute("open"), null);
    await page.screenshot({
      path: `${dir}/${name}-mobile.png`,
      fullPage: true,
    });
    await audit(page, `${name}-mobile`);
  }
  await page.goto(base + manifest.documents[0].route);
  await page.getByText("Browse lessons", { exact: true }).click();
  assert.equal(await page.locator(".course-menu").getAttribute("open"), "");
  await page.getByText("Browse lessons", { exact: true }).click();
  await page.getByRole("link", { name: "Open full diagram" }).first().click();
  assert.equal(await page.locator("#close-diagram").isVisible(), true);
  await page.getByRole("button", { name: "Close diagram" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await nojs.newPage();
  await fallback.goto(base + "questions/lesson-01/");
  await fallback.locator("article summary").first().click();
  assert.equal(await fallback.locator("article details[open]").count(), 1);
  await fallback.goto(base + manifest.documents[0].route);
  await fallback
    .getByRole("link", { name: "Open full diagram" })
    .first()
    .click();
  assert(fallback.url().endsWith(".svg"));
  await nojs.close();
  assert.deepEqual(failures, []);
  results.push(
    "Lesson navigation, independent answers, diagram modal/Escape/focus restoration, search/clear/no-results/reload, 404, mobile navigation, reduced motion and no-JavaScript fallback pass.",
  );
  console.log(
    JSON.stringify({ passed: results, accessibilityViolations: 0 }, null, 2),
  );
  fs.writeFileSync(
    `${dir}/results.json`,
    JSON.stringify({ passed: results, accessibilityViolations: 0 }, null, 2),
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
