/** @jest-environment node */
import { submitEnquiry } from "@/lib/submit-enquiry";
import { enquiryErrorMessage } from "@/lib/submit-enquiry";
const acknowledgement = { success: true, saved: true, submissionId: "saved_1", notificationStatus: "pending_retry" };
afterEach(() => jest.restoreAllMocks());
it.each([422, 429, 413])("provides safe actionable feedback for HTTP %s", async status => {
  jest.spyOn(global, "fetch").mockResolvedValue(Response.json({ error: "private diagnostics" }, { status }));
  try {
    await submitEnquiry("/api/leads", { name: "Fixture", email: "fixture@example.com", message: "Validation fixture" });
    throw new Error("Expected rejection");
  } catch (error) {
    expect(enquiryErrorMessage(error)).not.toContain("private diagnostics");
    expect(enquiryErrorMessage(error)).not.toContain("couldn't send");
  }
});
it("reuses the key after an uncertain response and changes it after acknowledged success", async () => {
  const fetchMock = jest.spyOn(global, "fetch").mockRejectedValueOnce(new TypeError("Connection lost")).mockResolvedValueOnce(Response.json(acknowledgement)).mockResolvedValueOnce(Response.json(acknowledgement));
  const input = { name: "Transport fixture", email: "fixture@example.com", message: "Lost response" };
  await expect(submitEnquiry("/api/leads", input)).rejects.toThrow();
  await expect(submitEnquiry("/api/leads", input)).resolves.toMatchObject({ saved: true });
  await submitEnquiry("/api/leads", input);
  const key = (index: number) => new Headers(fetchMock.mock.calls[index][1]?.headers).get("Idempotency-Key");
  expect(key(0)).toBe(key(1));
  expect(key(2)).not.toBe(key(1));
});
it("rejects a 200 response that does not acknowledge persistence", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue(Response.json({ success: true }));
  await expect(submitEnquiry("/api/leads", { name: "Fixture", email: "fixture@example.com", message: "Invalid acknowledgement" })).rejects.toThrow("couldn't confirm");
});
it("rejects provider-style failures without exposing server messages", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue(Response.json({ error: "private diagnostics" }, { status: 500 }));
  await expect(submitEnquiry("/api/leads", { name: "Fixture", email: "fixture@example.com", message: "Failure fixture" })).rejects.toThrow("couldn't confirm");
});
