/** @jest-environment node */
jest.mock("@/lib/db", () => ({ db: { webhookEvent: { findMany: jest.fn() }, lead: { updateMany: jest.fn() } } }));
import { db } from "@/lib/db";
import { reconcileWhatsAppStatus } from "@/lib/whatsapp-status";
beforeEach(() => jest.resetAllMocks());
it("reconciles early read events even if a sent event arrived later", async () => {
  jest.mocked(db.webhookEvent.findMany).mockResolvedValue([{ eventType: "status.sent" }, { eventType: "status.read" }] as never);
  await reconcileWhatsAppStatus("wamid.fixture");
  expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { whatsappStatus: "read" } }));
});
it("does not downgrade an already delivered/read notification on a late sent event", async () => {
  jest.mocked(db.webhookEvent.findMany).mockResolvedValue([{ eventType: "status.sent" }] as never);
  await reconcileWhatsAppStatus("wamid.fixture");
  expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ whatsappStatus: { in: ["accepted"] } }) }));
});
it("leaves accepted notifications unchanged without a delivery event", async () => {
  jest.mocked(db.webhookEvent.findMany).mockResolvedValue([]);
  await reconcileWhatsAppStatus("wamid.fixture");
  expect(db.lead.updateMany).not.toHaveBeenCalled();
});

it("surfaces a failure received after a sent acknowledgement", async () => {
  jest.mocked(db.webhookEvent.findMany).mockResolvedValue([{ eventType: "status.failed" }] as never);
  await reconcileWhatsAppStatus("wamid.fixture");
  expect(db.lead.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ whatsappStatus: { in: ["accepted", "sent"] } }), data: { whatsappStatus: "failed" } }));
});
