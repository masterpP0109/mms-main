import { test, expect } from "@playwright/test";

const routes = ["/", "/about", "/conference-production", "/services/drone", "/services/weddings-elopements", "/services/special-effects", "/packages", "/packages/weddings", "/packages/drone", "/packages/podcasts", "/gallery", "/contact", "/privacy"];

for (const width of [390, 768, 1440]) {
  test(`public pages retain landmarks, metadata, media and layout at ${width}px`, async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    const titles = new Set<string>();
    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("main#main-content"), route).toHaveCount(1);
      await expect(page.locator("h1"), route).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]'), route).toHaveAttribute("href", `https://www.mosimediasolutions.com${route === "/" ? "" : route}`);
      expect(titles.has(await page.title()), route).toBe(false);
      titles.add(await page.title());
      await expect(page.locator('meta[name="description"]'), route).toHaveAttribute("content", /\S{10,}/);
      // Load each vertical section so lazy images are actually exercised.
      await page.evaluate(async () => {
        document.querySelectorAll("img").forEach(image => { image.loading = "eager"; });
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
          scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      });
      await expect.poll(() => page.locator("img").evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)), { timeout: 20000, message: route }).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `test-results/refinement-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}.png` });
    }
    expect(errors).toEqual([]);
  });
}

test("gallery category URLs, history, lightbox keyboard and image failures recover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/gallery?cat=Drone&utm_source=review");
  await expect(page.getByRole("button", { name: "Drone", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Wedding", exact: true }).click();
  await expect(page).toHaveURL(/cat=Wedding/);
  expect(new URL(page.url()).searchParams.get("utm_source")).toBe("review");
  await page.goBack();
  await expect(page.getByRole("button", { name: "Drone", exact: true })).toHaveAttribute("aria-pressed", "true");
  const trigger = page.getByRole("button", { name: "View Victoria Falls landscape", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Gallery image viewer" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("Falls Panorama");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.route("**/_next/image?**", route => route.abort());
  await page.goto("/gallery?cat=Brand");
  await expect(page.getByText("Image unavailable. Try another photo.").first()).toBeVisible();
});

test("skip link, slideshow pause and featured-work keys remain operable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const pause = page.getByRole("button", { name: "Pause slideshow", exact: true });
  await pause.click();
  await expect(page.getByRole("button", { name: "Resume slideshow", exact: true })).toHaveAttribute("aria-pressed", "true");
  const carousel = page.getByRole("region", { name: "Featured projects, swipe or use arrow keys" });
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".work-controls")).toContainText("2 / 5");
  await page.keyboard.press("End");
  await expect(page.locator(".work-controls")).toContainText("5 / 5");
  await page.getByRole("button", { name: "Previous featured project" }).click();
  await expect(page.locator(".work-controls")).toContainText("4 / 5");
});

test("quick contact reuses the configured WhatsApp number without sending", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("link", { name: "+263 788 111 391", exact: true })).toHaveAttribute("href", "https://wa.me/263788111391");
  await expect(page.getByRole("link", { name: "info@mosimediasolutions.com", exact: true })).toHaveAttribute("href", "mailto:info@mosimediasolutions.com");
});

test("a fading tile from the previous gallery category cannot crash or open the wrong image", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/gallery");
  const previousTile = await page.getByRole("button", { name: "View Event speaker", exact: true }).elementHandle();
  await page.getByRole("button", { name: "Conference", exact: true }).click();
  await previousTile!.dispatchEvent("click");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View Conference presentation", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [390, 768, 1440]) {
  test(`catalogue pages, details and project expansion at ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services");
    await page.locator("img").evaluateAll(images => images.forEach(image => { if (image instanceof HTMLImageElement) image.loading = "eager"; }));
    await expect.poll(() => page.locator("img").evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)), { timeout: 30000 }).toBe(true);
    await expect(page.locator("main#main-content")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: `test-results/refinement-services-${width}.png` });
    const service = page.locator('main a[href^="/services/"]').first();
    const servicePath = await service.getAttribute("href");
    await service.click();
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.mosimediasolutions.com${servicePath}`);
    await page.goto("/projects");
    const studies = page.locator('main a[href^="/projects/"]');
    await expect(studies).toHaveCount(6);
    await page.getByRole("button", { name: "View More Projects", exact: true }).click();
    await expect(studies).toHaveCount(12);
    await page.getByRole("button", { name: "Conference", exact: true }).click();
    await expect(studies).toHaveCount(3);
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(studies).toHaveCount(6);
    const preview = page.getByRole("button", { name: /^Preview / }).first();
    await preview.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(preview).toBeFocused();
    const projectPath = await studies.first().getAttribute("href");
    await studies.first().click();
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.mosimediasolutions.com${projectPath}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: `test-results/refinement-project-detail-${width}.png` });
  });
}

test("the gallery has usable photographs with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/gallery");
    await expect(page.getByText("Enable JavaScript for filters and the image viewer", { exact: false })).toBeVisible();
    await expect(page.locator('#gallery-static a[href^="/mms/"]')).toHaveCount(12);
  } finally { await context.close(); }
});

test("animated desktop featured work retains keyboard focus and navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Pause slideshow", exact: true }).click();
  await expect(page.locator("#gallery .pin-spacer")).toHaveCount(1);
  const carousel = page.getByRole("region", { name: "Featured projects, swipe or use arrow keys" });
  await carousel.focus();
  await expect(carousel).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.locator(".work-controls")).toContainText("5 / 5");
  await expect(carousel).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.locator(".work-controls")).toContainText("1 / 5");
  await expect(carousel).toBeFocused();
});
