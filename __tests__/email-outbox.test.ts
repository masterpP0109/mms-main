/** @jest-environment node */
jest.mock("@/lib/db", () => ({ db: { lead: { updateMany: jest.fn(), findUniqueOrThrow: jest.fn() } } }));
import { db } from "@/lib/db";
import { deliverEmail, eligibleEmail, recoverEmailWork } from "@/lib/email/outbox";
import { SmtpNotificationError } from "@/lib/email/errors";
beforeEach(() => {
  jest.resetAllMocks();
  jest.mocked(db.lead.updateMany).mockResolvedValue({ count: 1 });
  jest.mocked(db.lead.findUniqueOrThrow).mockResolvedValue({ id: "fixture", source: "contact", name: "Test", email: "test@example.com", createdAt: new Date(), message: "Test", emailAttempts: 2, acknowledgementAttempts: 1 } as never);
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());
it("retries a temporary rejection using the channel clock and records later acceptance", async () => {
  const send = jest.fn().mockRejectedValueOnce(new SmtpNotificationError("EENVELOPE", true, 450)).mockResolvedValueOnce("provider-id");
  await expect(deliverEmail("fixture", "notification", send)).resolves.toBe(false);
  expect(db.lead.updateMany).toHaveBeenLastCalledWith(expect.objectContaining({ where: { id: "fixture", emailStatus: "sending", emailAttempts: 2 }, data: expect.objectContaining({ emailStatus: "retry_required", emailNextAttemptAt: expect.any(Date) }) }));
  await expect(deliverEmail("fixture", "notification", send)).resolves.toBe(true);
  expect(db.lead.updateMany).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({ emailStatus: "accepted", emailProviderId: "provider-id" }) }));
});
it("does not replay an ambiguous timeout", async () => {
  const send = jest.fn().mockRejectedValue(new SmtpNotificationError("ETIMEDOUT", false));
  await deliverEmail("fixture", "acknowledgement", send);
  expect(db.lead.updateMany).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({ acknowledgementStatus: "reconciliation_required", acknowledgementNextAttemptAt: null }) }));
});
it("recovers interrupted claims as reconciliation work and leaves fresh pending work eligible", async () => {
  await recoverEmailWork(new Date("2026-10-20T12:00:00Z"));
  expect(db.lead.updateMany).toHaveBeenCalledTimes(2);
  expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { OR: expect.arrayContaining([expect.objectContaining({ emailStatus: "sending", OR: expect.arrayContaining([{ emailClaimedAt: { lt: new Date("2026-10-20T11:50:00Z") } }]) })]) }, data: { emailStatus: "reconciliation_required" } }));
  expect(eligibleEmail("acknowledgement")).toMatchObject({ OR: expect.arrayContaining([{ acknowledgementStatus: "pending" }]) });
});
it("keeps customer retry eligibility independent from the internal channel clock", () => {
  const query = JSON.stringify(eligibleEmail("acknowledgement"));
  expect(query).toContain("acknowledgementNextAttemptAt");
  expect(query).not.toContain("emailNextAttemptAt");
});
