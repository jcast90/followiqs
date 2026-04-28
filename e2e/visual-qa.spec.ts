import { test, expect } from "@playwright/test";

/**
 * Visual QA tests — capture screenshots of every page and verify
 * they render correctly. Used by the build pipeline to catch
 * blank pages, broken layouts, and missing content.
 *
 * Run against a deployed URL:
 *   BASE_URL=https://product.vercel.app npx playwright test e2e/visual-qa.spec.ts
 *
 * Captures BOTH desktop (1280x800) and mobile (375x812) screenshots
 * per page and flags horizontal overflow at mobile widths.
 */

const pages = [
  { name: "landing", path: "/", mustContain: ["h1"] },
  { name: "login", path: "/login", mustContain: ["input[type='email']"] },
  { name: "signup", path: "/signup", mustContain: ["input[type='email']"] },
];

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 375, height: 812 };

for (const p of pages) {
  test(`${p.name} page renders at desktop viewport`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(p.path);
    await page.waitForLoadState("networkidle");

    // Page should not be blank
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(50);

    // Required elements should exist
    for (const selector of p.mustContain) {
      await expect(page.locator(selector).first()).toBeVisible();
    }

    // No error pages — check visible text only (innerText excludes script payloads)
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toContain("Application error");
    expect(visibleText).not.toContain("Internal Server Error");
    expect(visibleText).not.toMatch(/\b500\b.*(?:error|server)/i);

    // Screenshot for visual review
    await page.screenshot({
      path: `e2e/screenshots/${p.name}-desktop.png`,
      fullPage: true,
    });
  });

  test(`${p.name} page renders at mobile viewport (375px)`, async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(p.path);
    await page.waitForLoadState("networkidle");

    // Page should not be blank
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(50);

    // Required elements should still exist at mobile
    for (const selector of p.mustContain) {
      await expect(page.locator(selector).first()).toBeVisible();
    }

    // No error pages
    const visibleText = await page.locator("body").innerText();
    expect(visibleText).not.toContain("Application error");
    expect(visibleText).not.toContain("Internal Server Error");

    // Horizontal overflow check — document width must not exceed viewport width
    // (allow 2px tolerance for sub-pixel rounding).
    const metrics = await page.evaluate(() => ({
      docWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(
      metrics.docWidth,
      `Page scrolls horizontally at 375px (docWidth=${metrics.docWidth}, viewport=${metrics.viewportWidth}). ` +
        `Wrap wide elements (tables, pre, long strings) in overflow-x-auto containers and add responsive grid modifiers (sm:/md:/lg:).`,
    ).toBeLessThanOrEqual(metrics.viewportWidth + 2);

    // Screenshot for visual review
    await page.screenshot({
      path: `e2e/screenshots/${p.name}-mobile.png`,
      fullPage: true,
    });
  });
}

test("all nav links work", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Get all internal links
  const links = await page.locator("a[href^='/']").all();
  const hrefs = new Set<string>();
  for (const link of links) {
    const href = await link.getAttribute("href");
    if (href && !href.includes("#")) hrefs.add(href);
  }

  // Visit each and verify it doesn't 500
  for (const href of hrefs) {
    const response = await page.goto(href);
    expect(response?.status()).toBeLessThan(500);
  }
});

test("mobile: desktop sidebar is hidden behind responsive breakpoint", async ({ page }) => {
  // At mobile widths, the dashboard sidebar must be hidden and only revealed
  // via the MobileHeader sheet. If a fixed sidebar renders at 375px, the
  // dashboard page will scroll horizontally.
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const sidebars = page.locator("aside");
  const count = await sidebars.count();
  for (let i = 0; i < count; i++) {
    const cls = (await sidebars.nth(i).getAttribute("class")) || "";
    // A mounted <aside> at mobile should be hidden and revealed at lg/md
    // breakpoints. This catches sidebars missing their responsive gate.
    if (cls.includes("fixed") || cls.includes("sticky")) {
      expect(
        cls,
        "A fixed/sticky <aside> is visible at 375px without a responsive hidden/lg: gate",
      ).toMatch(/hidden.*(?:lg|md|sm):(?:flex|block|grid)/);
    }
  }
});
