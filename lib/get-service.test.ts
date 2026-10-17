/** @jest-environment node */
jest.mock("./db", () => ({ db: { service: { findFirst: jest.fn() } } }));
import { getService } from "./get-service";
import { db } from "./db";
beforeEach(() => jest.resetAllMocks());
it("uses staff edits for a formerly hardcoded slug", async () => {
  const record = { slug: "led-screen-rental", title: "Staff approved title", gallery: ["/image.webp"] };
  jest.mocked(db.service.findFirst).mockResolvedValue(record as never);
  expect(await getService(record.slug)).toEqual(record);
  expect(db.service.findFirst).toHaveBeenCalledWith({ where: { slug: record.slug, published: true } });
});
it("does not substitute local content when a record is missing", async () => {
  jest.mocked(db.service.findFirst).mockResolvedValue(null);
  expect(await getService("led-screen-rental")).toBeNull();
});
it("propagates outages rather than serving stale content", async () => {
  jest.mocked(db.service.findFirst).mockRejectedValue(new Error("Database unavailable"));
  await expect(getService("led-screen-rental")).rejects.toThrow("Database unavailable");
});
