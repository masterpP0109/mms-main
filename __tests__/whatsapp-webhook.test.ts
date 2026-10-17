/** @jest-environment node */

import { Prisma } from "@prisma/client";

const transactionMock = jest.fn();
jest.mock("@/lib/db", () => ({ db: { $transaction: (...args: unknown[]) => transactionMock(...args) } }));
jest.mock("@/lib/providers/whatsapp", () => ({ verifyWhatsAppSignature: jest.fn(() => true) }));
jest.mock("@/lib/env", () => ({ getServerEnv: jest.fn(() => ({ WHATSAPP_VERIFY_TOKEN: "verify-me" })) }));

import { GET, POST } from "@/app/api/webhooks/whatsapp/route";

const payload = JSON.stringify({ entry: [{ changes: [{ value: { messages: [{ id: "wamid.duplicate", from: "263700000000", type: "text", text: { body: "Hello" } }] } }] }] });

describe("WhatsApp webhook", () => {
  beforeEach(() => transactionMock.mockReset());

  it("verifies the subscription token", async () => {
    const response = await GET(new Request("http://localhost/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=12345"));
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("12345");
  });

  it("persists an inbound message once", async () => {
    transactionMock.mockImplementation(async (callback) => callback({ webhookEvent: { create: jest.fn() }, contact: { upsert: jest.fn().mockResolvedValue({ id: "contact_1" }) }, conversation: { upsert: jest.fn().mockResolvedValue({ id: "thread_1", leadId: null }), update: jest.fn() }, message: { create: jest.fn() }, lead: { create: jest.fn().mockResolvedValue({ id: "lead_1" }) } }));
    const response = await POST(new Request("http://localhost/api/webhooks/whatsapp", { method: "POST", headers: { "Content-Type": "application/json", "x-hub-signature-256": "valid" }, body: payload }));
    await expect(response.json()).resolves.toMatchObject({ processed: 1, duplicates: 0 });
  });

  it("acknowledges duplicate webhook events without creating another lead", async () => {
    transactionMock.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("duplicate", { code: "P2002", clientVersion: "6.19.3" }));
    const response = await POST(new Request("http://localhost/api/webhooks/whatsapp", { method: "POST", headers: { "Content-Type": "application/json", "x-hub-signature-256": "valid" }, body: payload }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ processed: 0, duplicates: 1 });
  });

  it("rejects malformed envelopes rather than crashing during iteration", async () => {
    const response = await POST(new Request("http://localhost/api/webhooks/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entry: {} }) }));
    expect(response.status).toBe(400);
    expect(transactionMock).not.toHaveBeenCalled();
  });

  it("bounds chunked webhook bodies", async () => {
    const response = await POST(new Request("http://localhost/api/webhooks/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: "x".repeat(256001) }));
    expect(response.status).toBe(413);
    expect(transactionMock).not.toHaveBeenCalled();
  });

  it("uses value.contacts and adds later messages to the existing thread", async () => {
    const tx = { webhookEvent: { create: jest.fn() }, contact: { upsert: jest.fn().mockResolvedValue({ id: "contact_1" }) }, conversation: { upsert: jest.fn().mockResolvedValue({ id: "thread_1", leadId: "lead_existing" }), update: jest.fn() }, message: { create: jest.fn() }, lead: { create: jest.fn() } };
    transactionMock.mockImplementation(async (callback) => callback(tx));
    const body = JSON.parse(payload);
    body.entry[0].changes[0].value.contacts = [{ wa_id: "263700000000", profile: { name: "Ada" } }];
    const response = await POST(new Request("http://localhost/api/webhooks/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
    expect(response.status).toBe(200);
    expect(tx.contact.upsert).toHaveBeenCalledWith(expect.objectContaining({ update: { name: "Ada" } }));
    expect(tx.message.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ conversationId: "thread_1", text: "Hello" }) }));
    expect(tx.lead.create).not.toHaveBeenCalled();
  });
});
