/** @jest-environment node */
jest.mock("@/lib/db", () => ({ db: { webhookEvent: { findMany: jest.fn() }, $queryRaw: jest.fn(), lead: { create: jest.fn(), findUnique: jest.fn(), findUniqueOrThrow: jest.fn(), count: jest.fn(), update: jest.fn(), updateMany: jest.fn() } } }));
jest.mock("@/lib/providers/email", () => ({ sendLeadEmail: jest.fn() }));
jest.mock("@/lib/providers/whatsapp", () => ({ sendLeadWhatsApp: jest.fn() }));
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/providers/email";
import { sendLeadWhatsApp } from "@/lib/providers/whatsapp";
import { createLead, notifyLead, notifyLeadWhatsApp, createIdempotencyKey } from "@/lib/leads";
const input = { source: "contact" as const, name: "Ada", email: "ada@example.com", message: "Hello" };
const lead = { ...input, id: "lead_1", createdAt: new Date(), metadata: {}, emailStatus: "pending" };
describe("lead persistence and notifications", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.mocked(db.lead.findUnique).mockResolvedValue(null);
    jest.mocked(db.lead.count).mockResolvedValue(0);
    jest.mocked(db.$queryRaw).mockResolvedValue([{ count: 1 }]);
    jest.mocked(db.webhookEvent.findMany).mockResolvedValue([]);
    jest.mocked(db.lead.create).mockResolvedValue(lead as never);
    jest.mocked(db.lead.findUniqueOrThrow).mockResolvedValue(lead as never);
    jest.mocked(db.lead.updateMany).mockResolvedValue({ count: 1 });
    jest.mocked(db.lead.update).mockResolvedValue(lead as never);
    jest.mocked(sendLeadWhatsApp).mockResolvedValue("wa_1");
  });
  afterEach(() => jest.restoreAllMocks());
  it("atomically saves pending work without making provider calls", async () => {
    await expect(createLead(input)).resolves.toMatchObject({ id: "lead_1", notified: false });
    expect(db.lead.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ whatsappStatus: "pending" }) }));
    expect(sendLeadEmail).not.toHaveBeenCalled();
    expect(sendLeadWhatsApp).not.toHaveBeenCalled();
  });
  it("retains the saved enquiry on provider or configuration failure", async () => {
    jest.mocked(sendLeadEmail).mockRejectedValue(new Error("private customer data"));
    await expect(notifyLead("lead_1")).resolves.toBe(false);
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
    jest.mocked(db.$queryRaw).mockResolvedValue([]);
    await expect(createLead(input)).rejects.toMatchObject({ status: 429 });
    expect(db.lead.create).not.toHaveBeenCalled();
  });
  it("records a successful independently processed email", async () => {
    jest.mocked(sendLeadEmail).mockResolvedValue("email_1");
    await expect(notifyLead("lead_1")).resolves.toBe(true);
    expect(db.lead.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "accepted", emailProviderId: "email_1" }) }));
  });
  it("records Meta acceptance with its provider message identifier", async () => {
    await expect(notifyLeadWhatsApp("lead_1")).resolves.toBe(true);
    expect(db.lead.update).toHaveBeenCalledWith(expect.objectContaining({ data: { whatsappStatus: "accepted", whatsappProviderId: "wa_1" } }));
  });
  it("retains uncertain Meta attempts for reconciliation", async () => {
    jest.mocked(sendLeadWhatsApp).mockRejectedValue(new Error("private provider details"));
    await expect(notifyLeadWhatsApp("lead_1")).resolves.toBe(false);
    expect(db.lead.update).toHaveBeenCalledWith(expect.objectContaining({ data: { whatsappStatus: "reconciliation_required" } }));
  });
  it("does not resend a Meta notification claimed by another worker", async () => {
    jest.mocked(db.lead.updateMany).mockResolvedValue({ count: 0 });
    await expect(notifyLeadWhatsApp("lead_1")).resolves.toBe(false);
    expect(sendLeadWhatsApp).not.toHaveBeenCalled();
  });
  it("does not notify either provider when persistence fails", async () => {
    jest.mocked(db.lead.create).mockRejectedValue(new Error("Database unavailable"));
    await expect(createLead(input)).rejects.toThrow("Database unavailable");
    expect(sendLeadEmail).not.toHaveBeenCalled();
    expect(sendLeadWhatsApp).not.toHaveBeenCalled();
  });
  it("includes all input fields in duplicate detection", () => {
    expect(createIdempotencyKey(input, "key")).not.toBe(createIdempotencyKey({ ...input, name: "Grace" }, "key"));
  });
});
