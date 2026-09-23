/** @jest-environment node */

import { createHmac } from "node:crypto";
import { sendLeadWhatsApp, verifyWhatsAppSignature } from "@/lib/providers/whatsapp";

describe("Meta WhatsApp adapter", () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv, DATABASE_URL: "postgresql://test:test@localhost:5432/test", WHATSAPP_ACCESS_TOKEN: "token", WHATSAPP_PHONE_NUMBER_ID: "123", WHATSAPP_NOTIFICATION_TO: "263700000000", WHATSAPP_APP_SECRET: "app-secret" };
    jest.restoreAllMocks();
  });
  afterAll(() => { process.env = originalEnv; });

  it("accepts a valid Meta signature and rejects a forged one", () => {
    const body = '{"object":"whatsapp_business_account"}';
    const signature = `sha256=${createHmac("sha256", "app-secret").update(body).digest("hex")}`;
    expect(verifyWhatsAppSignature(body, signature)).toBe(true);
    expect(verifyWhatsAppSignature(body, "sha256=deadbeef")).toBe(false);
  });

  it("sends the configured approved template", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ messages: [{ id: "wamid.1" }] }), { status: 200 }));
    await expect(sendLeadWhatsApp({ id: "lead_1", source: "contact", name: "Ada", email: "ada@example.com", message: "Hello" })).resolves.toBe("wamid.1");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/123/messages"), expect.objectContaining({ method: "POST", headers: expect.objectContaining({ Authorization: "Bearer token" }) }));
  });

  it("returns a safe provider failure", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(new Response("{}", { status: 500 }));
    await expect(sendLeadWhatsApp({ id: "lead_1", source: "contact", name: "Ada", message: "Hello" })).rejects.toThrow("WhatsApp provider rejected");
  });
});
