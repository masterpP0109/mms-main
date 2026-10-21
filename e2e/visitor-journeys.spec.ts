import { test, expect } from "@playwright/test";
import { contactLeadSchema } from "../lib/validation/leads";

test("homepage keeps the MMS identity and links to services", async ({ page }) => {
  test.skip(!process.env.MMS_TEST_DATABASE_URL, "Dedicated test PostgreSQL required for the catalogue journey");
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  // Use the visible desktop navigation at its documented breakpoint.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Services", exact: true }).click();
  // The remote catalogue streams database content; allow that navigation to finish.
  await expect(page).toHaveURL(/\/services$/, { timeout: 20_000 });
  const detail = page.locator('a[href^="/services/"]').first();
  await expect(detail).toBeVisible();
  await detail.click();
  await expect(page.locator("h1")).toBeVisible();
});
test("project links resolve to published case studies", async ({ page }) => {
  test.skip(!process.env.MMS_TEST_DATABASE_URL, "Dedicated test PostgreSQL required for case studies");
  await page.goto("/projects");
  await page.getByRole("button", { name: /^Preview / }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close", exact: true }).filter({ hasText: "Close" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(page.isClosed()).toBe(false);
  await page.locator('a[href^="/projects/"]').first().click();
  await expect(page.locator("h1")).toBeVisible();
});
test("gallery opens and restores keyboard focus after Escape", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/gallery", { waitUntil: "domcontentloaded" });
  await page.locator('button[aria-label^="View "]').first().waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Drone", exact: true }).click();
  const trigger = page.getByRole("button", { name: "View Victoria Falls Aerial", exact: true });
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect.poll(() => page.getByRole("dialog").locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), { timeout: 15000 }).toBe(true);
  await page.screenshot({ path: "test-results/gallery-lightbox.png" });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
test("contact acknowledges persistence with no external send", async ({ page }) => {
  await page.route("**/api/leads", route => {
    const valid = contactLeadSchema.safeParse(route.request().postDataJSON()).success;
    return route.fulfill({ status: valid ? 200 : 422, json: valid ? { success: true, saved: true, submissionId: "e2e_fixture", notificationStatus: "pending_retry" } : { error: "Invalid input" } });
  });
  await page.goto(`/contact?origin=${encodeURIComponent("/Services?x=1")}&service=${"a".repeat(200)}`);
  await page.locator('input[name="name"]').fill("Test Visitor");
  await page.locator('input[name="email"]').fill("visitor@example.com");
  await page.locator('textarea[name="message"]').fill("Conference production enquiry");
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText("Message received", { exact: false })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("e2e_fixture");
});
for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test(`homepage fits a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBe(false);
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    await page.screenshot({ path: `test-results/home-${width}-viewport.png` });
  });
}

test("conference proposal form acknowledges saved enquiries", async ({ page }) => {
  await page.route("**/api/conference-enquiry", route => route.fulfill({ json: { success: true, saved: true, submissionId: "conference_fixture", notificationStatus: "pending_retry" } }));
  await page.goto("/conference-production#enquiry");
  await page.locator('input[name="organisation"]').fill("Fixture Organisation");
  await page.locator('input[name="contact"]').fill("Test Visitor");
  await page.locator('input[name="email"]').fill("visitor@example.com");
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText("Your enquiry has been saved", { exact: false })).toBeVisible();
});
test("quote builder completes all five steps without external sends", async ({ page }) => {
  await page.route("**/api/leads", route => route.fulfill({ json: { success: true, saved: true, submissionId: "brief_fixture", notificationStatus: "pending_retry" } }));
  await page.goto("/#builder");
  const builder = page.locator("#builder");
  for (let step = 0; step < 3; step++) {
    await builder.locator("button[aria-pressed]").first().click();
    await builder.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await builder.getByLabel("Your Name").fill("Test Visitor");
  await builder.getByLabel("Email Address").fill("visitor@example.com");
  await builder.getByRole("button", { name: "Review Brief", exact: true }).click();
  await builder.getByRole("button", { name: "Send My Brief & Get a Free Quote", exact: true }).click();
  await expect(builder.getByRole("status")).toContainText("has been saved");
});
test("mobile navigation opens, follows a link and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  const navigation = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("contact retries survive reload and acknowledged repeats receive a new key", async ({ page }) => {
  test.setTimeout(90000);
  const keys: string[] = [];
  await page.route("**/api/leads", route => {
    keys.push(route.request().headers()["idempotency-key"] || "");
    return keys.length === 1 ? route.abort("failed") : route.fulfill({ json: { success: true, saved: true, submissionId: "retry_fixture", notificationStatus: "pending_retry" } });
  });
  await page.goto("/contact");
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await page.reload();
    await page.locator('input[name="name"]').fill("Retry Fixture");
    await page.locator('input[name="email"]').fill("retry-fixture@example.com");
    await page.locator('textarea[name="message"]').fill("Reload retry fixture");
    await page.locator('button[type="submit"]').click();
    if (!attempt) {
      await expect(page.getByRole("alert").filter({ hasText: "couldn't send your enquiry" })).toBeVisible();
      const persisted = await page.evaluate(() => JSON.stringify(Object.entries(window.sessionStorage)));
      expect(persisted).not.toContain("retry-fixture@example.com");
    } else await expect(page.getByText("Message received", { exact: false })).toBeVisible();
  }
  expect(keys).toHaveLength(3);
  expect(keys[0]).toBeTruthy();
  expect(keys[1]).toBe(keys[0]);
  expect(keys[2]).not.toBe(keys[1]);
});
