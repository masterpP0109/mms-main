import { test, expect } from "@playwright/test";
import { weddingPackages } from "../lib/wedding-packages";

for (const option of weddingPackages) {
  test(`${option.name}: destination selection, reload, scroll and submitted payload`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    let payload: Record<string, unknown> = {};
    await page.route("**/api/leads", route => {
      payload = route.request().postDataJSON();
      return route.fulfill({ status: 201, json: { success: true, saved: true, submissionId: "destination_fixture", notificationStatus: "accepted" } });
    });
    await page.goto("/packages/weddings");
    await page.getByRole("link", { name: `Enquire about ${option.name}`, exact: true }).click();
    await expect(page).toHaveURL(url => url.searchParams.get("package") === option.id && url.searchParams.get("location") === option.location && url.hash === "#package-enquiry");
    const form = page.locator("#package-enquiry form");
    await expect(form.getByLabel("Package preference")).toHaveValue(option.id);
    await expect(form.getByRole("textbox", { name: "Preferred location", exact: true })).toHaveValue(option.location);
    await expect.poll(() => page.locator("#package-enquiry").evaluate(el => { const box = el.getBoundingClientRect(); return box.top < innerHeight && box.bottom > 0; })).toBe(true);
    await page.reload();
    await expect(form.getByLabel("Package preference")).toHaveValue(option.id);
    await expect(form.getByRole("textbox", { name: "Preferred location", exact: true })).toHaveValue(option.location);
    await form.getByLabel("Your name", { exact: true }).fill("Destination Test Visitor");
    await form.getByLabel("Email address", { exact: true }).fill("destination-fixture@example.com");
    await form.getByLabel("Project details").fill("Please discuss photography and film coverage at our selected destination.");
    await form.getByRole("button", { name: "Send my package enquiry" }).click();
    await expect(page.locator("#package-enquiry").getByRole("status")).toContainText("Your enquiry has been saved");
    expect(payload).toMatchObject({ kind: "package", category: "weddings", packageId: option.id, location: option.location });
  });
}

test("changing the destination preserves typed details and updates the venue", async ({ page }) => {
  await page.goto("/packages/weddings?package=victoria-falls-hotel#package-enquiry");
  await page.getByLabel("Your name", { exact: true }).fill("Keep my details");
  await page.getByLabel("Project details").fill("Our plans must remain here.");
  for (const option of weddingPackages) {
    await page.getByLabel("Package preference").selectOption(option.id);
    await expect(page.getByRole("textbox", { name: "Preferred location", exact: true })).toHaveValue(option.location);
    await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("Keep my details");
    await expect(page.getByLabel("Project details")).toHaveValue("Our plans must remain here.");
  }
});

for (const id of ["intimate", "celebration", "complete"]) {
  test(`shared ${id} URL remains a custom enquiry`, async ({ page }) => {
    await page.goto(`/packages/weddings?package=${id}&utm_source=legacy#package-enquiry`);
    await expect(page.getByLabel("Package preference")).toHaveValue("tailored");
    await expect(page).toHaveURL(url => url.searchParams.get("package") === "tailored" && url.searchParams.get("utm_source") === "legacy");
    await expect(page.getByRole("textbox", { name: "Preferred location", exact: true })).toHaveValue("");
  });
}

test("repairs old location-after-fragment URLs and preserves the intended destination", async ({ page }) => {
  await page.goto("/packages/weddings?package=tailored&utm_source=legacy#package-enquiry&location=The%20Lookout%20Caf%C3%A9");
  await expect(page.getByLabel("Package preference")).toHaveValue("lookout-cafe");
  await expect(page.getByRole("textbox", { name: "Preferred location", exact: true })).toHaveValue("The Lookout Café");
  await expect(page).toHaveURL(url => url.searchParams.get("location") === "The Lookout Café" && url.hash === "#package-enquiry" && url.searchParams.get("utm_source") === "legacy");
});

for (const width of [390, 768, 1440]) {
  test(`consistent package structure and card layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const category of ["weddings", "drone", "podcasts"]) {
      await page.goto(`/packages/${category}`);
      const packages = page.locator("#package-options");
      await expect(packages.locator("article")).toHaveCount(3);
      await page.getByRole("link", { name: "Find your starting point", exact: true }).click();
      await expect.poll(() => packages.evaluate(el => el.getBoundingClientRect().top < innerHeight)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const cards = packages.locator("article");
      await expect(cards).toHaveCount(3);
      await expect(packages).toContainText("Tailored quotation");
      await expect(packages).toContainText("Coverage to discuss");
      for (const image of await packages.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      }
      await packages.screenshot({ path: `test-results/package-consistent-${category}-${width}.png` });
    }
    expect(errors).toEqual([]);
  });
}

