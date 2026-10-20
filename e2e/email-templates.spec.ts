import { test, expect } from "@playwright/test";
import { renderEnquiryEmail } from "../lib/email/templates";

for (const audience of ["mms", "customer"] as const) {
  for (const width of [320, 640]) {
    test(`${audience} enquiry email is readable at ${width}px`, async ({ page }) => {
      const fixture = { id: "MMS-EMAIL-PREVIEW", createdAt: new Date("2026-10-20T10:00:00Z"), source: "project_builder" as const, name: "Preview Customer", email: "preview@example.com", phone: "+263788111391", projectType: "corporate", message: "Please quote our event.\nWe need filming and sound.\n" + "A".repeat(150), metadata: { audience: "large-event", timeline: "planned", venue: "Victoria Falls" } };
      await page.setViewportSize({ width, height: 900 });
      await page.setContent(renderEnquiryEmail(fixture, audience).html);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByText("Corporate Event", { exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await expect(page.getByRole("link", { name: "info@mosimediasolutions.com" })).toHaveAttribute("href", "mailto:info@mosimediasolutions.com");
      await page.screenshot({ path: `test-results/email-${audience}-${width}.png`, fullPage: true });
    });
  }
}

test("builder stops invalid email before review", async ({ page }) => {
  await page.goto("/#builder");
  const builder = page.locator("#builder");
  for (let step = 0; step < 3; step++) {
    await builder.locator("button[aria-pressed]").first().click();
    await builder.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await builder.getByLabel("Your Name").fill("Preview Customer");
  await builder.getByLabel("Email Address").fill("invalid-email");
  await builder.getByRole("button", { name: "Review Brief", exact: true }).click();
  await expect(builder.getByLabel("Email Address")).toBeVisible();
  expect(await builder.getByLabel("Email Address").evaluate((input: HTMLInputElement) => input.validity.valid)).toBe(false);
});
