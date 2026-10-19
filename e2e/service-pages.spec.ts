import { test, expect } from "@playwright/test";
import { contactLeadSchema } from "../lib/validation/leads";

const services = [
  { path: "/services/drone", service: "Drone Services", cta: "Discuss your aerial shoot", project: "Other / Not Sure" },
  { path: "/services/weddings-elopements", service: "Weddings & Elopements", cta: "Tell us about your day", project: "Wedding Film" },
];

for (const item of services) {
  test(`${item.service} route, FAQ and enquiry preserve the service`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    let submitted: Record<string, unknown> | undefined;
    await page.route("**/api/leads", route => {
      submitted = route.request().postDataJSON();
      const valid = contactLeadSchema.safeParse(submitted).success;
      return route.fulfill({ status: valid ? 200 : 422, json: valid ? { success: true, saved: true, submissionId: "service_fixture", notificationStatus: "pending_retry" } : { error: "Invalid input" } });
    });
    const response = await page.goto(item.path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page).toHaveTitle(new RegExp(item.service.replace(" & Elopements", "")));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${item.path}$`));
    await page.locator("main summary").first().click();
    await expect(page.locator("main details").first()).toHaveAttribute("open", "");
    await page.getByRole("link", { name: item.cta, exact: true }).click();
    await expect(page.locator("#enquiry")).toContainText(`Enquiring about: ${item.service}`);
    await expect(page.getByRole("button", { name: item.project, exact: true })).toHaveAttribute("aria-pressed", "true");
    // Exercise a state change so this also waits for the form to hydrate.
    const conference = page.getByRole("button", { name: "Conference / Event", exact: true });
    await conference.click();
    await expect(conference).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: item.project, exact: true }).click();
    await expect(page.getByRole("button", { name: item.project, exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByLabel("Your Name", { exact: true }).fill("Service Test Visitor");
    await page.getByLabel("Email Address", { exact: true }).fill("service-fixture@example.com");
    await page.getByLabel("Your Message", { exact: true }).fill("Please discuss coverage for our planned shoot.");
    await page.getByRole("button", { name: "Send Message", exact: true }).click();
    await expect(page.getByText("Message received", { exact: false })).toBeVisible();
    expect(submitted).toMatchObject({ service: item.service, origin: item.path });
  });

  for (const width of [320, 390, 768, 1280, 1440]) {
    test(`${item.service} fits ${width}px with readable imagery`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(item.path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const hero = page.locator("main img").first();
      await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), { timeout: 20000 }).toBe(true);
      await page.screenshot({ path: `test-results/${item.path.split("/").pop()}-${width}.png`, fullPage: true });
    });
  }
}

test("desktop Drone Services link and homepage feature links resolve", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.getByRole("link", { name: "Drone Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/drone$/);
  await expect(nav.getByRole("link", { name: "Drone Services", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Services", exact: true })).not.toHaveAttribute("aria-current", "page");
  await page.goto("/#services");
  await page.locator('section[aria-labelledby="weddings-feature-title"]').screenshot({ path: "test-results/home-weddings-feature.png" });
  await page.getByRole("link", { name: "Learn more about Drone Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/drone$/);
  for (const label of ["Discover Weddings & Elopements coverage", "Explore weddings & elopements"]) {
    await page.goto("/#services");
    await page.locator("#services").getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(/\/services\/weddings-elopements$/);
  }
});

test("services catalogue links its drone card and wedding feature to the dedicated pages", async ({ page }) => {
  test.skip(!process.env.MMS_TEST_DATABASE_URL, "Dedicated test PostgreSQL required for the catalogue journey");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const response = await page.goto("/services");
  expect(response?.status()).toBe(200);
  await page.getByRole("link", { name: "Explore Drone Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/drone$/);
  await page.goto("/services");
  await page.getByRole("link", { name: "Explore weddings & elopements", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/weddings-elopements$/);
});

test("mobile wedding feature remains readable and animated content is reachable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#services");
  const feature = page.locator('section[aria-labelledby="weddings-feature-title"]');
  await feature.scrollIntoViewIfNeeded();
  await expect(feature.getByRole("heading", { name: "Weddings & Elopements" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await feature.screenshot({ path: "test-results/home-weddings-feature-mobile.png" });
  await feature.getByRole("link", { name: "Explore weddings & elopements", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/weddings-elopements$/);
  await page.locator("summary").first().scrollIntoViewIfNeeded();
  await expect(page.locator("summary").first()).toBeVisible();
});

test("mobile Drone navigation supports keyboard, Escape and route changes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Mobile navigation" })).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  const drone = dialog.getByRole("link", { name: "Drone Services", exact: true });
  await expect(drone).toBeVisible();
  await drone.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/services\/drone$/);
  await expect(dialog).toHaveCount(0);
});
