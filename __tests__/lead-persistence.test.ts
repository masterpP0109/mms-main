/** @jest-environment node */
jest.mock("@/lib/db", () => ({ db: { webhookEvent: { findMany: jest.fn() }, $queryRaw: jest.fn(), lead: { create: jest.fn(), findUnique: jest.fn(), findUniqueOrThrow: jest.fn(), count: jest.fn(), update: jest.fn(), updateMany: jest.fn() } } }));
jest.mock("@/lib/providers/email", () => ({ sendLeadEmail: jest.fn() }));
jest.mock("@/lib/acknowledgements", () => ({ notifyCustomer: jest.fn() }));
jest.mock("@/lib/providers/whatsapp", () => ({ sendLeadWhatsApp: jest.fn() }));
jest.mock("@/lib/env", () => ({ isWhatsAppOutboundConfigured: jest.fn() }));
import { isWhatsAppOutboundConfigured } from "@/lib/env";
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/providers/email";
import { SmtpNotificationError } from "@/lib/email/errors";
import { sendLeadWhatsApp } from "@/lib/providers/whatsapp";
import { createLead, submitLead, processLeadEmails, notifyLead, notifyLeadWhatsApp, createIdempotencyKey } from "@/lib/leads";
import { notifyCustomer } from "@/lib/acknowledgements";
const input = { source: "contact" as const, name: "Ada", email: "ada@example.com", message: "Hello" };
const lead = { ...input, id: "lead_1", createdAt: new Date(), metadata: {}, emailStatus: "pending", emailAttempts: 1 };
describe("lead persistence and notifications", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(isWhatsAppOutboundConfigured).mockReturnValue(true);
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
  it("returns persisted pending work without starting SMTP", async () => {
    jest.mocked(sendLeadEmail).mockImplementation(() => new Promise(() => {}));
    await expect(submitLead(input)).resolves.toMatchObject({ id: "lead_1", notified: false });
    expect(db.lead.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ acknowledgementStatus: "pending" }) }));
    expect(sendLeadEmail).not.toHaveBeenCalled();
    expect(notifyCustomer).not.toHaveBeenCalled();
  });
  it("processes both channels independently after persistence", async () => {
    jest.mocked(sendLeadEmail).mockResolvedValue("smtp_1");
    jest.mocked(notifyCustomer).mockRejectedValue(new Error("private customer data"));
    await processLeadEmails("lead_1");
    expect(sendLeadEmail).toHaveBeenCalledTimes(1);
    expect(notifyCustomer).toHaveBeenCalledWith("lead_1");
    expect(JSON.stringify(jest.mocked(console.error).mock.calls)).not.toContain("private customer data");
  });
  it("retains the saved enquiry on provider or configuration failure", async () => {
    jest.mocked(sendLeadEmail).mockRejectedValue(new SmtpNotificationError("ECONFIG", true));
    await expect(notifyLead("lead_1")).resolves.toBe(false);
    expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "retry_required" }) }));
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
  it("retains uncertain SMTP attempts for reconciliation rather than automatic replay", async () => {
    jest.mocked(sendLeadEmail).mockRejectedValue(new Error("private customer data"));
    await expect(notifyLead("lead_1")).resolves.toBe(false);
    expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "reconciliation_required", notificationError: "SMTP notification not accepted (EUNKNOWN)" }) }));
    expect(JSON.stringify(jest.mocked(console.error).mock.calls)).not.toContain("private customer data");
  });
  it("only claims fresh work or SMTP failures known not to be accepted", async () => {
    jest.mocked(sendLeadEmail).mockResolvedValue("smtp_1");
    await notifyLead("lead_1");
    expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ OR: expect.arrayContaining([{ emailStatus: "pending" }, expect.objectContaining({ emailStatus: "retry_required", notificationError: { startsWith: "SMTP notification not accepted (" } })]) }) }));
  });
  it("leaves sending for reconciliation when recording acceptance fails", async () => {
    jest.mocked(sendLeadEmail).mockResolvedValue("email_1");
    jest.mocked(db.lead.updateMany).mockResolvedValueOnce({ count: 1 }).mockRejectedValueOnce(new Error("DB offline"));
    await expect(notifyLead("lead_1")).rejects.toThrow("DB offline");
    expect(db.lead.updateMany).not.toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "retry_required" }) }));
  });
  it("limits repeated enquiries before creation", async () => {
    jest.mocked(db.$queryRaw).mockResolvedValue([]);
    await expect(createLead(input)).rejects.toMatchObject({ status: 429 });
    expect(db.lead.create).not.toHaveBeenCalled();
  });
  it("records a successful independently processed email", async () => {
    jest.mocked(sendLeadEmail).mockResolvedValue("email_1");
    await expect(notifyLead("lead_1")).resolves.toBe(true);
    expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "accepted", emailProviderId: "email_1" }) }));
  });
  it("records Meta acceptance with its provider message identifier", async () => {
    await expect(notifyLeadWhatsApp("lead_1")).resolves.toBe(true);
    expect(db.lead.update).toHaveBeenCalledWith(expect.objectContaining({ data: { whatsappStatus: "accepted", whatsappProviderId: "wa_1" } }));
  });
  it("defers missing configuration without consuming a provider attempt", async () => {
    jest.mocked(isWhatsAppOutboundConfigured).mockReturnValue(false);
    await expect(notifyLeadWhatsApp("lead_1")).resolves.toBe(false);
    expect(sendLeadWhatsApp).not.toHaveBeenCalled();
    expect(db.lead.updateMany).toHaveBeenCalledTimes(1);
    expect(db.lead.updateMany).toHaveBeenCalledWith({ where: { id: "lead_1", whatsappStatus: "pending" }, data: { whatsappStatus: "not_configured" } });
  });
  it("claims deferred unsent work once configuration is available", async () => {
    await expect(notifyLeadWhatsApp("lead_1")).resolves.toBe(true);
    expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "lead_1", whatsappStatus: { in: ["pending", "not_configured"] }, whatsappAttempts: { lt: 1 } } }));
    expect(sendLeadWhatsApp).toHaveBeenCalledTimes(1);
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
