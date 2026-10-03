/** @jest-environment node */
import { getService } from "./get-service";
import { db } from "./db";
import type { Service } from "@prisma/client";
import { contentSlug, services } from "./services";

jest.mock("./db", () => ({
  db: { service: { findFirst: jest.fn() } },
}));

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
  jest.clearAllMocks();
});

test("loads local service content and new galleries without querying Prisma", async () => {
  delete process.env.DATABASE_URL;
  const led = await getService("led-screen-rental");
  const sound = await getService("professional-sound-systems");
  expect(led?.title).toBe("LED Screen Rental");
  expect(led?.gallery).toHaveLength(3);
  expect(led?.gallery.every((src) => src.startsWith("/mms/ledScreens/"))).toBe(true);
  expect(sound?.gallery).toEqual(services.find((item) => contentSlug(item.title) === "professional-sound-systems")?.gallery);
  expect(await getService("unknown-service")).toBeNull();
  expect(db.service.findFirst).not.toHaveBeenCalled();
});

test("queries published database content for services outside the local catalog", async () => {
  process.env.DATABASE_URL = "postgresql://localhost/test";
  jest.mocked(db.service.findFirst).mockResolvedValue(null);
  expect(await getService("database-only-service")).toBeNull();
  expect(db.service.findFirst).toHaveBeenCalledWith({
    where: { slug: "database-only-service", published: true },
  });
});

test.each([
  ["led-screen-rental", "/mms/ledScreens/"],
  ["professional-sound-systems", "/mms/PaSystem/"],
])("uses the supplied gallery for %s even with database content", async (slug) => {
  process.env.DATABASE_URL = "postgresql://localhost/test";
  const storedService = {
    slug,
    title: "CMS title",
    gallery: ["/mms/old-image.jpg"],
  } as Service;
  jest.mocked(db.service.findFirst).mockResolvedValue(storedService);
  const service = await getService(slug);
  const local = services.find((item) => contentSlug(item.title) === slug);
  expect(service?.title).toBe(local?.title);
  expect(service?.gallery).toEqual(local?.gallery);
  expect(db.service.findFirst).not.toHaveBeenCalled();
});

test.each(services.map((service) => [contentSlug(service.title), service]))(
  "loads the current catalog entry for %s",
  async (slug, local) => {
    const service = await getService(slug as string);
    expect(service?.title).toBe((local as typeof services[number]).title);
    expect(service?.gallery).toEqual((local as typeof services[number]).gallery);
  },
);
