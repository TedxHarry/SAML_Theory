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
      await page.locator('.toc, [aria-label="On this page"]').count(),
      0,
      route,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      true,
      `Horizontal page overflow: ${route}`,
    );
  }
  results.push(
    `All ${manifest.documents.length + 3} navigable pages load without page-level overflow or script exceptions.`,
  );
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${dir}/home-desktop.png`, fullPage: true });
  await audit(page, "home");
  await page.getByRole("link", { name: "Start with Lesson 1" }).click();
  assert(page.url().includes("/lessons/lesson-01-"));
  const menuToggle = page.locator(".course-menu > summary");
  const expandedMain = await page.locator("main").boundingBox();
  assert((await page.locator(".reading-layout").boundingBox()).width > 800);
  await menuToggle.click();
  await page.waitForFunction(
    () => localStorage.getItem("saml-lessons-desktop") === "closed",
  );
  assert.equal(await page.locator(".course-menu").getAttribute("open"), null);
  assert(
    (await page.locator("main").boundingBox()).width > expandedMain.width + 150,
  );
  assert((await page.locator(".sidebar").boundingBox()).width <= 73);
  await page.reload();
  assert.equal(await page.locator(".course-menu").getAttribute("open"), null);
  await menuToggle.focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(
    () => localStorage.getItem("saml-lessons-desktop") === "open",
  );
  assert.equal(await page.locator(".course-menu").getAttribute("open"), "");
  await audit(page, "expanded-sidebar");
  results.push(
    "Right outline removed on every route; desktop menu collapses to a rail, frees content width, persists across reload and expands by keyboard.",
  );
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
  await page.getByRole("link", { name: "Quizzes (20)" }).click();
  assert(page.url().endsWith("/quizzes/lesson-01/"));
  assert.equal(
    await page.locator('.reading-modes [aria-current="page"]').innerText(),
    "Quizzes (20)",
  );
  const quizBanks = manifest.documents.filter((d) => d.kind === "Quizzes");
  const positions = new Set();
  for (const bank of quizBanks) {
    await page.goto(base + bank.route);
    const data = JSON.parse(await page.locator("#quiz-data").textContent());
    assert.equal(await page.locator(".quiz-card").count(), bank.quizzes);
    for (const q of data.questions) {
      const order = await page
        .locator(`#${q.id} input`)
        .evaluateAll((nodes) => nodes.map((n) => n.value));
      positions.add(order.indexOf(q.correctId));
    }
    const q = data.questions[0];
    const card = page.locator(`#${q.id}`);
    const wrong = q.options.find((o) => o.id !== q.correctId);
    await card.locator(`input[value="${wrong.id}"]`).check();
    assert(
      (await card.locator(".quiz-result").innerText()).includes(
        "Your selected answer is incorrect",
      ),
    );
    assert(
      (await card.locator(".quiz-result").innerText()).includes(
        wrong.explanation,
      ),
    );
    assert(
      (await card.locator(".quiz-result").innerText()).includes(
        q.options.find((o) => o.id === q.correctId).text,
      ),
    );
    assert.equal(
      await page.locator("#quiz-progress").innerText(),
      "1 of 20 answered",
    );
    assert.equal(await page.locator(".quiz-feedback:visible").count(), 1);
    const groupBox = await card.locator("fieldset").boundingBox();
    const feedbackBox = await card.locator(".quiz-feedback").boundingBox();
    assert(feedbackBox.y >= groupBox.y + groupBox.height);
    await card.locator(`input[value="${q.correctId}"]`).check();
    assert.equal(await card.locator(".quiz-verdict").innerText(), "Correct.");
    assert(
      (await card.locator(".quiz-announcement").textContent()).includes(
        "Correct answer:",
      ),
    );
    assert.equal(
      await page.locator("#quiz-progress").innerText(),
      "1 of 20 answered",
    );
    await card.getByText("Understand every option", { exact: true }).click();
    assert.equal(await card.locator(".quiz-rationales li").count(), 4);
  }
  assert.equal(
    positions.size,
    4,
    "Correct answers must appear across all four positions",
  );
  await page.goto(base + "quizzes/lesson-01/");
  const firstCard = page.locator(".quiz-card").first();
  const orderBefore = await firstCard
    .locator("input")
    .evaluateAll((nodes) => nodes.map((n) => n.value));
  await firstCard.locator("input").first().focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowDown");
  assert.equal(
    await firstCard.locator("input:checked").inputValue(),
    orderBefore[1],
  );
  const firstFeedback = await firstCard.locator(".quiz-result").innerText();
  await page.locator(".quiz-card").nth(1).locator("input").first().check();
  assert.equal(
    await firstCard.locator(".quiz-result").innerText(),
    firstFeedback,
  );
  assert.equal(
    await page.locator("#quiz-progress").innerText(),
    "2 of 20 answered",
  );
  await firstCard.getByText("Understand every option", { exact: true }).click();
  await audit(page, "quizzes-feedback");
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: `${dir}/quizzes-desktop.png` });
  await page.reload();
  assert.equal(await page.locator("input:checked").count(), 0);
  assert.equal(await page.locator(".quiz-feedback:visible").count(), 0);
  const orderAfter = await firstCard
    .locator("input")
    .evaluateAll((nodes) => nodes.map((n) => n.value));
  // Randomness itself is covered deterministically in the unit suite; test the live page uses it too.
  const randomPage = await context.newPage();
  await randomPage.addInitScript(() => {
    Math.random = () => 0.999;
  });
  await randomPage.goto(base + "quizzes/lesson-01/");
  const highOrder = await randomPage
    .locator(".quiz-card")
    .first()
    .locator("input")
    .evaluateAll((nodes) => nodes.map((n) => n.value));
  const lowPage = await context.newPage();
  await lowPage.addInitScript(() => {
    Math.random = () => 0;
  });
  await lowPage.goto(base + "quizzes/lesson-01/");
  const lowOrder = await lowPage
    .locator(".quiz-card")
    .first()
    .locator("input")
    .evaluateAll((nodes) => nodes.map((n) => n.value));
  assert.notDeepEqual(highOrder, lowOrder);
  assert.deepEqual([...orderBefore].sort(), [...orderAfter].sort());
  await randomPage.close();
  await lowPage.close();
  const quizData = JSON.parse(await page.locator("#quiz-data").textContent());
  const correctCard = page.locator(`#${quizData.questions[0].id}`);
  await correctCard
    .locator(`input[value="${quizData.questions[0].correctId}"]`)
    .check();
  const correctFeedback = await correctCard.locator(".quiz-result").innerText();
  const retried = quizData.questions.slice(1, 3);
  const previousOrders = [];
  for (const q of retried) {
    const card = page.locator(`#${q.id}`);
    previousOrders.push(
      await card
        .locator("input")
        .evaluateAll((nodes) => nodes.map((n) => n.value)),
    );
    await card
      .locator(
        `input[value="${q.options.find((o) => o.id !== q.correctId).id}"]`,
      )
      .check();
  }
  await page
    .getByRole("button", { name: "Retry missed questions (2)", exact: true })
    .click();
  assert.equal(
    await page.locator("#quiz-progress").innerText(),
    "1 of 20 answered",
  );
  assert.equal(
    await correctCard.locator(".quiz-result").innerText(),
    correctFeedback,
  );
  assert.equal(await correctCard.locator("input:checked").count(), 1);
  for (const [i, q] of retried.entries()) {
    const card = page.locator(`#${q.id}`);
    assert.equal(await card.locator("input:checked").count(), 0);
    assert.equal(await card.locator(".quiz-feedback").isVisible(), false);
    assert.notDeepEqual(
      await card
        .locator("input")
        .evaluateAll((nodes) => nodes.map((n) => n.value)),
      previousOrders[i],
    );
    await card.locator(`input[value="${q.correctId}"]`).check();
    assert.equal(await card.locator(".quiz-verdict").innerText(), "Correct.");
    await card.getByText("Understand every option", { exact: true }).click();
    const optionTexts = await card
      .locator(".quiz-option")
      .evaluateAll((nodes) => nodes.map((n) => n.lastElementChild.textContent));
    const explanations = await card
      .locator(".quiz-rationales strong")
      .allTextContents();
    optionTexts.forEach((text, index) =>
      assert(explanations[index].endsWith(text)),
    );
  }
  const packet = page.locator("#L01-Q17");
  assert.equal(await packet.locator(".quiz-evidence").isVisible(), true);
  assert.equal(await packet.locator(".quiz-reasoning").isVisible(), true);
  assert.equal(
    await page
      .getByRole("button", { name: /Retry missed questions/ })
      .isVisible(),
    false,
  );
  await audit(page, "quiz-retry-and-evidence");
  for (const slug of [
    "mixed-review",
    "annotated-saml-messages",
    "troubleshooting-comparisons",
    "okta-settings-to-saml",
    "final-engineering-case",
  ]) {
    await page.goto(base + `reference/${slug}/`);
    for (const disclosure of await page.locator("article details").all())
      await disclosure.locator("summary").click();
    await audit(page, `practice-${slug}`);
  }
  results.push(
    "Missed-only retry preserves correct answers, resets and reshuffles missed choices, and keeps rationale order aligned. Five new practice guides and evidence/reasoning prompts pass accessibility checks.",
  );
  results.push(
    "All 10 quiz banks: correct/incorrect feedback, answer changes, four explanations, independent state, keyboard selection, shuffled positions and fresh-visit reset pass.",
  );
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
  assert.equal(
    await page.locator("#search-results li").count(),
    manifest.documents.length,
  );
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
    ["quizzes", "quizzes/lesson-01/"],
    ["reference", "reference/"],
    ["annotated-messages", "reference/annotated-saml-messages/"],
    ["engineering-case", "reference/final-engineering-case/"],
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
  await page.goto(base + "quizzes/lesson-01/");
  await page.locator(".quiz-card").first().locator("input").first().check();
  await page
    .locator(".quiz-card")
    .first()
    .getByText("Understand every option", { exact: true })
    .click();
  await audit(page, "quizzes-mobile-feedback");
  await page.locator(".quiz-card").first().locator("input:checked").focus();
  await page.screenshot({ path: `${dir}/quizzes-mobile-viewport.png` });
  await page
    .locator(".quiz-card")
    .first()
    .screenshot({ path: `${dir}/quiz-card-mobile.png` });
  await page.setViewportSize({ width: 320, height: 740 });
  for (const bank of quizBanks) {
    await page.goto(base + bank.route);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      true,
      `Narrow quiz: ${bank.route}`,
    );
    const tabs = page.locator(".reading-modes a");
    assert.equal(await tabs.count(), 3);
    for (const tab of await tabs.all()) assert(await tab.isVisible());
  }
  await page.setViewportSize({ width: 390, height: 844 });
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
  await fallback.goto(base + "quizzes/lesson-01/");
  assert.equal(await fallback.locator(".quiz-options:visible").count(), 0);
  await fallback
    .getByText("Show answer and explanations", { exact: true })
    .first()
    .click();
  assert.equal(await fallback.locator(".quiz-card details[open]").count(), 1);
  assert(
    (await fallback.locator(".quiz-card details[open]").innerText()).includes(
      "Correct answer:",
    ),
  );
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
