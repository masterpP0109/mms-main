/** @jest-environment node */
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("@/lib/db", () => ({ db: { lead: { updateMany: jest.fn(), findUniqueOrThrow: jest.fn(), update: jest.fn() } } }));
jest.mock("@/lib/providers/acknowledgement", () => ({ sendCustomerAcknowledgement: jest.fn() }));
import { db } from "@/lib/db";
import { notifyCustomer } from "@/lib/acknowledgements";
import { sendCustomerAcknowledgement } from "@/lib/providers/acknowledgement";
import { SmtpNotificationError } from "@/lib/email/errors";
beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.mocked(db.lead.updateMany).mockResolvedValue({ count: 1 });
  jest.mocked(db.lead.findUniqueOrThrow).mockResolvedValue({ id: "lead_1", source: "contact", name: "Ada", email: "ada@example.com", message: "Hello", createdAt: new Date(), metadata: {}, acknowledgementAttempts: 1 } as never);
  jest.mocked(sendCustomerAcknowledgement).mockResolvedValue("ack_1");
});
afterEach(() => jest.restoreAllMocks());
it("records acknowledgement acceptance independently of staff email state", async () => {
  await expect(notifyCustomer("lead_1")).resolves.toBe(true);
  expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ id: "lead_1", acknowledgementStatus: "sending" }), data: expect.objectContaining({ acknowledgementStatus: "accepted", acknowledgementProviderId: "ack_1", acknowledgementError: null }) }));
  expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ acknowledgementAttempts: { lt: 5 }, source: { not: "whatsapp" } }) }));
});
it("does not resend accepted, historical, phone-only or already claimed work", async () => {
  jest.mocked(db.lead.updateMany).mockResolvedValue({ count: 0 });
  await expect(notifyCustomer("lead_1")).resolves.toBe(false);
  expect(sendCustomerAcknowledgement).not.toHaveBeenCalled();
});
it.each([true, false])("keeps safe retry/reconciliation state when retrySafe=%s", async retrySafe => {
  jest.mocked(sendCustomerAcknowledgement).mockRejectedValue(new SmtpNotificationError("ETIMEDOUT", retrySafe));
  await expect(notifyCustomer("lead_1")).resolves.toBe(false);
  expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ acknowledgementStatus: retrySafe ? "retry_required" : "reconciliation_required" }) }));
});
it("leaves sending for reconciliation if acceptance cannot be recorded", async () => {
  jest.mocked(db.lead.updateMany).mockResolvedValueOnce({ count: 1 }).mockRejectedValueOnce(new Error("Database unavailable"));
  await expect(notifyCustomer("lead_1")).rejects.toThrow("Database unavailable");
  expect(db.lead.updateMany).toHaveBeenCalledTimes(2);
});
