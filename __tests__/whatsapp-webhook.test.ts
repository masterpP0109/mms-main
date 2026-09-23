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
    transactionMock.mockImplementation(async (callback) => callback({ webhookEvent: { create: jest.fn() }, lead: { create: jest.fn() } }));
    const response = await POST(new Request("http://localhost/api/webhooks/whatsapp", { method: "POST", headers: { "x-hub-signature-256": "valid" }, body: payload }));
    await expect(response.json()).resolves.toMatchObject({ processed: 1, duplicates: 0 });
  });

  it("acknowledges duplicate webhook events without creating another lead", async () => {
    transactionMock.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("duplicate", { code: "P2002", clientVersion: "6.19.3" }));
    const response = await POST(new Request("http://localhost/api/webhooks/whatsapp", { method: "POST", headers: { "x-hub-signature-256": "valid" }, body: payload }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ processed: 0, duplicates: 1 });
  });
});
