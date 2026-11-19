import { test, expect } from "@playwright/test";
import { homePackageExperiences, packageExperiences } from "../lib/packages";
import { packageLeadSchema } from "../lib/validation/leads";

for (const experience of homePackageExperiences) {
  test(`${experience.title}: selection, attribution, error recovery and saved conversion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => { window.mmsAnalyticsConsent = true; });
    let attempts = 0;
    let payload: Record<string, unknown> = {};
    await page.route("**/api/leads", route => {
      payload = route.request().postDataJSON();
      expect(packageLeadSchema.safeParse(payload).success).toBe(true);
      attempts++;
      return route.fulfill(attempts === 1 ? { status: 500, json: { error: "Unavailable" } } : { status: 201, json: { success: true, saved: true, submissionId: "package_fixture", notificationStatus: "pending" } });
    });
    await page.goto("/?utm_source=signature&utm_campaign=launch");
    const signature = page.locator("#signature-experiences");
    const ctaName = experience.homeCta ?? `Explore ${experience.title}`;
    await signature.getByRole("link", { name: ctaName, exact: true }).click();
    await expect(page).toHaveTitle(new RegExp(experience.homeTitle ?? experience.title));
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/packages/${experience.slug}$`));
    // Streaming metadata can briefly render identical inherited image tags.
    // Require a single image value, with no conflicting parent image.
    await expect.poll(() => page.locator('meta[property="og:image"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute("content")))])).toEqual([expect.stringMatching(new RegExp(experience.image.replace(/\./g, "\\.")))]);
    const structured = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(structured!)["@graph"][0]["@type"]).toBe("Service");
    await page.getByRole("link", { name: `Enquire about ${experience.options[0].name}`, exact: true }).click();
    const form = page.locator("#package-enquiry form");
    await expect(form.getByLabel("Package preference")).toHaveValue(experience.options[0].id);
    await expect(form).toContainText(experience.service);
    await form.getByLabel("Your name", { exact: true }).fill("Package Test Visitor");
    await form.getByLabel("Email address", { exact: true }).fill("package-fixture@example.com");
    await form.getByLabel("Preferred date (optional)").fill("2027-05-10");
    await form.getByLabel("Project details").fill("Please discuss our location and production scope.");
    await form.getByLabel("Package preference").selectOption(experience.options[1].id);
    await form.getByRole("button", { name: "Send my package enquiry" }).click();
    await expect(form.getByRole("alert")).toBeVisible();
    await expect(form.getByLabel("Email address", { exact: true })).toHaveValue("package-fixture@example.com");
    expect(await page.evaluate(() => window.dataLayer?.filter(item => item.event === "generate_lead").length || 0)).toBe(0);
    await form.getByRole("button", { name: "Send my package enquiry" }).click();
    await expect(page.locator("#package-enquiry").getByRole("status")).toContainText("Your enquiry has been saved");
    expect(payload).toMatchObject({ category: experience.slug, packageId: experience.options[1].id, date: "2027-05-10", attribution: { utm_source: "signature", utm_campaign: "launch", landingPage: "/" } });
    const events = await page.evaluate(() => window.dataLayer?.filter(item => item.event === "generate_lead"));
    expect(events).toHaveLength(1);
    expect(JSON.stringify(events)).not.toContain("package-fixture@example.com");
  });

  for (const width of [320, 390, 768, 1280, 1440]) {
    test(`${experience.title} layout at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/packages/${experience.slug}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const hero = page.locator("main img").first();
      await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      await page.locator("summary").first().click();
      await expect(page.locator("details").first()).toHaveAttribute("open", "");
      await page.screenshot({ path: `test-results/packages-${experience.slug}-${width}.png`, fullPage: true });
    });
  }
}

for (const experience of packageExperiences.filter(item => item.slug === "drone" || item.slug === "podcasts")) {
  test(`${experience.title} overview route renders cleanly`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/packages/${experience.slug}`);
    await expect(page.locator("main h1")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

test("overview, mobile navigation, service links and invalid package URLs", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Packages", exact: true }).click();
  await expect(page).toHaveURL(/\/packages$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Creating Experiences. Capturing Moments. Delivering Excellence.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: "test-results/packages-overview-mobile.png", fullPage: true });
  for (const [service, category] of [["drone", "drone"], ["weddings-elopements", "weddings"]]) {
    await page.goto(`/services/${service}`);
    await page.locator(`main a[href="/packages/${category}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`/packages/${category}$`));
  }
  const response = await page.goto("/packages/not-a-category");
  expect(response?.status()).toBe(404);
});

test("packages catalogue progressive disclosure, compare table, modal focus and responsive fit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/packages");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/packages");

  // Sticky category nav
  const nav = page.getByRole("navigation", { name: "Package categories" });
  await expect(nav.getByRole("link", { name: "Corporate", exact: true })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Celebrations", exact: true })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Video Production", exact: true })).toBeVisible();

  // Compare packages toggle
  const compareBtn = page.getByRole("button", { name: "Compare packages" }).first();
  await compareBtn.click();
  await expect(page.getByRole("region", { name: /Conference & Corporate Event Packages comparison/ })).toBeVisible();
  await page.getByRole("button", { name: "Hide comparison" }).first().click();

  // Level 2 inclusions modal + Escape focus return
  const viewAllBtn = page.getByRole("button", { name: "View all inclusions" }).first();
  await viewAllBtn.focus();
  await viewAllBtn.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Corporate Essentials");
  await expect(dialog).toContainText("Professional PA sound system.");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(viewAllBtn).toBeFocused();

  // Direct package enquiry + add-ons multi-select quote builder on /packages
  let capturedPayload: Record<string, unknown> = {};
  await page.route("**/api/leads", route => {
    capturedPayload = route.request().postDataJSON();
    return route.fulfill({
      status: 201,
      json: { success: true, saved: true, submissionId: "pkg_direct_1", reference: "MMS-DIRECT-1" },
    });
  });

  const addOnsSummary = page.locator("details summary").first();
  await addOnsSummary.click();
  const addButtons = page.locator("details").first().getByRole("button", { name: "+ Add to quote" });
  await addButtons.nth(0).click();
  await addButtons.nth(0).click();
  await expect(page.locator("details").first()).toContainText("2 add-ons selected");

  await page.getByRole("button", { name: "Request this package" }).first().click();
  const enquiryDialog = page.getByRole("dialog");
  await expect(enquiryDialog).toBeVisible();
  await expect(enquiryDialog.getByLabel("Selected package")).toHaveValue("corporate-essentials");
  await expect(enquiryDialog).toContainText("Selected optional add-ons (2)");
  await enquiryDialog.getByLabel("Your name").fill("Direct Quote Client");
  await enquiryDialog.getByLabel("Email address").fill("direct@example.com");
  await enquiryDialog.getByRole("button", { name: "Send package enquiry" }).click();
  await expect(enquiryDialog).toContainText("MMS-DIRECT-1");
  expect(capturedPayload).toMatchObject({
    kind: "package",
    category: "conferences",
    packageId: "corporate-essentials",
  });
  expect(String(capturedPayload.details)).toContain("Selected optional add-ons:");
});

test("campaign date and details prefill safely and unknown options fall back", async ({ page }) => {
  await page.goto("/packages/podcasts?package=unapproved&preferred_date=2027-03-02&details=Interview%20brief#package-enquiry");
  await expect(page.getByLabel("Package preference")).toHaveValue("tailored");
  await expect(page.getByLabel("Preferred date (optional)")).toHaveValue("2027-03-02");
  await expect(page.getByLabel("Project details")).toHaveValue("Interview brief");
  await page.getByLabel("Your name", { exact: true }).fill("Still planning");
  await page.getByLabel("Package preference").selectOption("video-conversation");
  await expect(page.getByLabel("Package preference")).toHaveValue("video-conversation");
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("Still planning");
  await expect(page.getByLabel("Project details")).toHaveValue("Interview brief");
});

test("without JavaScript the form cannot submit contact details into a URL", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/packages/weddings");
    const enquiry = page.locator("#package-enquiry");
    await expect(enquiry.locator('button[type="submit"]:enabled')).toHaveCount(0);
    await expect(enquiry.getByRole("link", { name: "info@mosimediasolutions.com" })).toBeVisible();
  } finally { await context.close(); }
});

for (const width of [1024, 1280, 1440]) {
  test(`signature experience cards and inner content stay equal-sized at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#signature-experiences");
    const cards = page.locator("#signature-experiences article");
    await expect(cards).toHaveCount(3);
    const metrics = await cards.evaluateAll(articles =>
      articles.map(article => {
        const imageLink = article.querySelector("a");
        const heading = article.querySelector("h3");
        const tagline = imageLink?.querySelector("p");
        const description = article.querySelector(":scope > p");
        const cta = article.querySelector(":scope > div > a");
        return {
          card: article.getBoundingClientRect(),
          image: imageLink?.getBoundingClientRect(),
          heading: heading?.getBoundingClientRect(),
          tagline: tagline?.getBoundingClientRect(),
          description: description?.getBoundingClientRect(),
          cta: cta?.getBoundingClientRect(),
        };
      })
    );
    const assertEqual = (values: (number | undefined)[], label: string) => {
      const defined = values.filter((v): v is number => typeof v === "number");
      expect(defined, label).toHaveLength(3);
      expect(Math.max(...defined) - Math.min(...defined), label).toBeLessThanOrEqual(2);
    };
    assertEqual(metrics.map(m => m.card.width), "card width");
    assertEqual(metrics.map(m => m.card.height), "card height");
    assertEqual(metrics.map(m => m.image?.width), "image width");
    assertEqual(metrics.map(m => m.image?.height), "image height");
    assertEqual(metrics.map(m => m.heading?.top), "heading top");
    assertEqual(metrics.map(m => m.heading?.height), "heading height");
    assertEqual(metrics.map(m => m.tagline?.top), "tagline top");
    assertEqual(metrics.map(m => m.tagline?.height), "tagline height");
    assertEqual(metrics.map(m => m.description?.top), "description top");
    assertEqual(metrics.map(m => m.description?.height), "description height");
    assertEqual(metrics.map(m => m.cta?.top), "cta top");
    assertEqual(metrics.map(m => m.cta?.width), "cta width");
    assertEqual(metrics.map(m => m.cta?.height), "cta height");
  });
}
