/** @jest-environment node */
jest.mock("@/lib/db", () => ({ db: { service: { findMany: jest.fn() }, project: { findMany: jest.fn() } } }));

import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { db } from "@/lib/db";
import { pageMetadata, siteOrigin } from "@/lib/site-metadata";

const originalSiteUrl = process.env.SITE_URL;
beforeEach(() => { delete process.env.SITE_URL; jest.resetAllMocks(); });
afterAll(() => { if (originalSiteUrl === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = originalSiteUrl; });

it.each([undefined, "", "not a URL", "javascript:alert(1)", "http://mosimediasolutions.com/"])("uses the preferred production origin for %s", value => {
  if (value !== undefined) process.env.SITE_URL = value;
  expect(siteOrigin()).toBe("https://www.mosimediasolutions.com");
  expect(robots().sitemap).toBe("https://www.mosimediasolutions.com/sitemap.xml");
});

it("supports an explicitly configured staging origin without a path suffix", () => {
  process.env.SITE_URL = "https://preview.example.com/old-path/";
  expect(siteOrigin()).toBe("https://preview.example.com");
});

it("keeps sharing metadata tied to the current page", () => {
  const metadata = pageMetadata("/privacy", "Enquiry Privacy", "How MMS handles enquiries");
  expect(metadata.alternates?.canonical).toBe("/privacy");
  expect(metadata.openGraph).toMatchObject({ title: "Enquiry Privacy", url: "/privacy", description: "How MMS handles enquiries", siteName: "Mosi Media Solutions" });
  expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
});

it("includes static pages and published catalogue records without duplicate dedicated services", async () => {
  const updatedAt = new Date("2026-10-24T00:00:00Z");
  jest.mocked(db.service.findMany).mockResolvedValue([{ slug: "drone", updatedAt }, { slug: "special-effects", updatedAt }, { slug: "led-screen-rental", updatedAt }] as never);
  jest.mocked(db.project.findMany).mockResolvedValue([{ slug: "published-event", updatedAt }] as never);
  const entries = await sitemap();
  const urls = entries.map(entry => entry.url);
  expect(urls).toContain("https://www.mosimediasolutions.com/");
  expect(urls).toContain("https://www.mosimediasolutions.com/privacy");
  expect(urls).toContain("https://www.mosimediasolutions.com/packages/drone");
  expect(urls).toContain("https://www.mosimediasolutions.com/services/led-screen-rental");
  expect(urls).toContain("https://www.mosimediasolutions.com/projects/published-event");
  expect(new Set(urls).size).toBe(urls.length);
  expect(db.service.findMany).toHaveBeenCalledWith({ where: { published: true }, select: { slug: true, updatedAt: true } });
});

it("retains static URLs and the healthy catalogue during an outage without logging error contents", async () => {
  jest.mocked(db.service.findMany).mockRejectedValue(new Error("private database details"));
  jest.mocked(db.project.findMany).mockResolvedValue([{ slug: "published-event", updatedAt: new Date() }] as never);
  const logger = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    const entries = await sitemap();
    expect(entries.map(entry => entry.url)).toEqual(expect.arrayContaining(["https://www.mosimediasolutions.com/", "https://www.mosimediasolutions.com/projects/published-event"]));
    expect(JSON.stringify(logger.mock.calls)).not.toContain("private database details");
  } finally { logger.mockRestore(); }
});
