/** @jest-environment node */
import { submissionKey, acknowledgeSubmission } from "@/lib/submission-key";
it("reuses keys for retries and changes them for different payloads", async () => {
  const first = await submissionKey({ message: "Hello" });
  expect(await submissionKey({ message: "Hello" })).toBe(first);
  expect(await submissionKey({ message: "Different" })).not.toBe(first);
});
it("allows a genuine identical enquiry after acknowledged success", async () => {
  const payload = { message: "Repeat enquiry" };
  const first = await submissionKey(payload);
  await acknowledgeSubmission(payload);
  expect(await submissionKey(payload)).not.toBe(first);
});
it("treats reordered object keys as the same retry", async () => {
  expect(await submissionKey({ name: "Fixture", message: "Stable order" })).toBe(await submissionKey({ message: "Stable order", name: "Fixture" }));
});
it("expires abandoned retries after a day", async () => {
  const now = Date.now();
  const payload = { message: "Expired retry" };
  const first = await submissionKey(payload);
  const clock = jest.spyOn(Date, "now").mockReturnValue(now + 24 * 3600_000 + 1000);
  try { expect(await submissionKey(payload)).not.toBe(first); } finally { clock.mockRestore(); }
});
it("survives a module reload without storing customer text", async () => {
  const values = new Map<string, string>();
  const browserStorage: Storage = { get length() { return values.size; }, getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: key => { values.delete(key); }, clear: () => values.clear(), key: index => [...values.keys()][index] ?? null };
  Object.defineProperty(globalThis, "window", { value: { sessionStorage: browserStorage }, configurable: true });
  try {
    const payload = { email: "private-fixture@example.com", message: "Reload fixture" };
    const first = await submissionKey(payload);
    expect(JSON.stringify([...values])).not.toContain("private-fixture");
    jest.resetModules();
    const reloaded = await import("@/lib/submission-key");
    expect(await reloaded.submissionKey(payload)).toBe(first);
    await reloaded.acknowledgeSubmission(payload);
    expect(values.size).toBe(0);
    expect(await reloaded.submissionKey(payload)).not.toBe(first);
  } finally { delete (globalThis as unknown as { window?: unknown }).window; }
});
it("keeps retries usable when browser storage is blocked", async () => {
  Object.defineProperty(globalThis, "window", { value: { get sessionStorage() { throw new Error("Storage blocked"); } }, configurable: true });
  try {
    const payload = { message: "Storage blocked fixture" };
    expect(await submissionKey(payload)).toBe(await submissionKey(payload));
  } finally { delete (globalThis as unknown as { window?: unknown }).window; }
});

it.each(["not json", "{}", '"legacy-key"', '{"key":42,"createdAt":true}', '{"key":"invalid","createdAt":0}'])("recovers from malformed stored retry data: %s", async saved => {
  const browserStorage = { length: 0, key: () => null, getItem: () => saved, setItem: jest.fn(), removeItem: jest.fn() };
  Object.defineProperty(globalThis, "window", { value: { sessionStorage: browserStorage }, configurable: true });
  try { expect(await submissionKey({ malformed: saved })).toMatch(/^[0-9a-f-]{36}$/i); }
  finally { delete (globalThis as unknown as { window?: unknown }).window; }
});
it("does not fail a conversion when browser storage is full", async () => {
  const browserStorage = { length: 0, key: () => null, getItem: () => null, setItem: () => { throw new Error("Quota exceeded"); }, removeItem: () => { throw new Error("Storage blocked"); } };
  Object.defineProperty(globalThis, "window", { value: { sessionStorage: browserStorage }, configurable: true });
  try {
    const payload = { message: "Quota fixture" };
    const first = await submissionKey(payload);
    expect(await submissionKey(payload)).toBe(first);
    await expect(acknowledgeSubmission(payload)).resolves.toBeUndefined();
    expect(await submissionKey(payload)).not.toBe(first);
  } finally { delete (globalThis as unknown as { window?: unknown }).window; }
});
