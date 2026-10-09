/** @jest-environment node */
jest.mock("@/lib/db", () => ({ db: { lead: { create: jest.fn(), findUnique: jest.fn(), findUniqueOrThrow: jest.fn(), count: jest.fn(), update: jest.fn(), updateMany: jest.fn() } } }));
jest.mock("@/lib/providers/email", () => ({ sendLeadEmail: jest.fn() }));
jest.mock("@/lib/providers/whatsapp", () => ({ sendLeadWhatsApp: jest.fn() }));
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/providers/email";
import { sendLeadWhatsApp } from "@/lib/providers/whatsapp";
import { createLead, notifyLead, createIdempotencyKey } from "@/lib/leads";
const input = { source: "contact" as const, name: "Ada", email: "ada@example.com", message: "Hello" };
const lead = { ...input, id: "lead_1", createdAt: new Date(), metadata: {}, emailStatus: "pending" };
describe("lead persistence and notifications", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.mocked(db.lead.findUnique).mockResolvedValue(null);
    jest.mocked(db.lead.count).mockResolvedValue(0);
    jest.mocked(db.lead.create).mockResolvedValue(lead as never);
    jest.mocked(db.lead.findUniqueOrThrow).mockResolvedValue(lead as never);
    jest.mocked(db.lead.updateMany).mockResolvedValue({ count: 1 });
    jest.mocked(db.lead.update).mockResolvedValue(lead as never);
    jest.mocked(sendLeadWhatsApp).mockResolvedValue("wa_1");
  });
  afterEach(() => jest.restoreAllMocks());
  it("saves before sending and records acceptance", async () => {
    jest.mocked(sendLeadEmail).mockImplementation(async () => { expect(db.lead.create).toHaveBeenCalled(); return "email_1"; });
    await expect(createLead(input)).resolves.toMatchObject({ notified: true });
    expect(db.lead.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "accepted", emailProviderId: "email_1" }) }));
  });
  it("retains the saved enquiry on provider or configuration failure", async () => {
    jest.mocked(sendLeadEmail).mockRejectedValue(new Error("private customer data"));
    await expect(createLead(input)).resolves.toMatchObject({ id: "lead_1", notified: false });
    expect(db.lead.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "retry_required" }) }));
    expect(JSON.stringify(jest.mocked(console.error).mock.calls)).not.toContain("private customer data");
  });
  it("does not send again for a duplicate submission", async () => {
    jest.mocked(db.lead.findUnique).mockResolvedValue({ ...lead, emailStatus: "accepted" } as never);
    await expect(createLead(input)).resolves.toMatchObject({ duplicate: true, notified: true });
    expect(db.lead.create).not.toHaveBeenCalled();
    expect(sendLeadEmail).not.toHaveBeenCalled();
  });
  it("does not send if another worker claimed the notification", async () => {
    jest.mocked(db.lead.updateMany).mockResolvedValue({ count: 0 });
    await expect(notifyLead("lead_1")).resolves.toBe(false);
    expect(sendLeadEmail).not.toHaveBeenCalled();
  });
  it("leaves sending for reconciliation when recording acceptance fails", async () => {
    jest.mocked(sendLeadEmail).mockResolvedValue("email_1");
    jest.mocked(db.lead.update).mockRejectedValue(new Error("DB offline"));
    await expect(notifyLead("lead_1")).rejects.toThrow("DB offline");
    expect(db.lead.update).not.toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "retry_required" }) }));
  });
  it("limits repeated enquiries before creation", async () => {
    jest.mocked(db.lead.count).mockResolvedValue(10);
    await expect(createLead(input)).rejects.toMatchObject({ status: 429 });
    expect(db.lead.create).not.toHaveBeenCalled();
  });
  it("includes all input fields in duplicate detection", () => {
    expect(createIdempotencyKey(input, "key")).not.toBe(createIdempotencyKey({ ...input, name: "Grace" }, "key"));
  });
});
