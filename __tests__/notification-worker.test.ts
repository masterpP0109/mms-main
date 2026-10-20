/** @jest-environment node */
jest.mock("@/lib/db", () => ({ db: { rateLimit: { deleteMany: jest.fn() }, lead: { updateMany: jest.fn(), findMany: jest.fn(), count: jest.fn() } } }));
jest.mock("@/lib/leads", () => ({ notifyLead: jest.fn(), notifyLeadWhatsApp: jest.fn() }));
jest.mock("@/lib/env", () => ({ isWhatsAppOutboundConfigured: jest.fn() }));
jest.mock("@/lib/acknowledgements", () => ({ notifyCustomer: jest.fn() }));
import { isWhatsAppOutboundConfigured } from "@/lib/env";
import { GET } from "@/app/api/internal/notifications/route";
import { db } from "@/lib/db";
import { notifyLead, notifyLeadWhatsApp } from "@/lib/leads";
import { notifyCustomer } from "@/lib/acknowledgements";

const previous = process.env.CRON_SECRET;
beforeEach(() => { jest.resetAllMocks(); process.env.CRON_SECRET = "a".repeat(32); });
afterAll(() => { if (previous === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = previous; });
it("fails closed without configured authentication", async () => {
  delete process.env.CRON_SECRET;
  expect((await GET(new Request("https://example.com/api/internal/notifications"))).status).toBe(503);
  expect(db.lead.findMany).not.toHaveBeenCalled();
});
it("rejects unauthenticated scheduler calls", async () => {
  expect((await GET(new Request("https://example.com/api/internal/notifications"))).status).toBe(401);
  expect(db.lead.findMany).not.toHaveBeenCalled();
});
it("awaits both channels for a bounded authenticated batch", async () => {
  jest.mocked(db.lead.findMany).mockResolvedValue([{ id: "lead_1" }] as never);
  jest.mocked(db.lead.count).mockResolvedValue(0);
  const response = await GET(new Request("https://example.com/api/internal/notifications", { headers: { Authorization: `Bearer ${"a".repeat(32)}` } }));
  expect(response.status).toBe(200);
  expect(notifyLead).toHaveBeenCalledWith("lead_1");
  expect(notifyLeadWhatsApp).toHaveBeenCalledWith("lead_1");
  expect(notifyCustomer).toHaveBeenCalledWith("lead_1");
  expect(db.lead.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 3 }));
});
it.each([true, false])("only requeues configuration-deferred work when configured=%s", async configured => {
  jest.mocked(isWhatsAppOutboundConfigured).mockReturnValue(configured);
  jest.mocked(db.lead.findMany).mockResolvedValue([]);
  jest.mocked(db.lead.count).mockResolvedValue(0);
  const response = await GET(new Request("https://example.com/api/internal/notifications", { headers: { Authorization: `Bearer ${"a".repeat(32)}` } }));
  expect(response.status).toBe(200);
  expect(db.lead.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ OR: expect.arrayContaining([{ whatsappStatus: { in: configured ? ["pending", "not_configured"] : ["pending"] } }]) }) }));
});
