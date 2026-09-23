import { createHmac, timingSafeEqual } from "node:crypto";
import { getServerEnv, requireWhatsAppOutboundEnv } from "@/lib/env";
import type { LeadInput } from "@/lib/validation/leads";

export async function sendLeadWhatsApp(lead: LeadInput & { id: string }) {
  const config = requireWhatsAppOutboundEnv();
  const response = await fetch(`https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: config.recipient,
      type: "template",
      template: {
        name: config.template,
        language: { code: "en" },
        components: [{ type: "body", parameters: [lead.name, lead.email ?? lead.phone ?? "No contact", lead.source, lead.id].map((text) => ({ type: "text", text })) }],
      },
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as { messages?: Array<{ id: string }> };
  if (!response.ok || !payload.messages?.[0]?.id) throw new Error(`WhatsApp provider rejected the notification (${response.status})`);
  return payload.messages[0].id;
}

export function verifyWhatsAppSignature(rawBody: string, signature: string | null, appSecret = getServerEnv().WHATSAPP_APP_SECRET) {
  if (!signature || !appSecret || !signature.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", appSecret).update(rawBody).digest("hex")}`;
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}
