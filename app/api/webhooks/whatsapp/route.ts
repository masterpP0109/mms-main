import { createHash, timingSafeEqual } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import { verifyWhatsAppSignature } from "@/lib/providers/whatsapp";

export const runtime = "nodejs";

function equalSecret(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const expected = getServerEnv().WHATSAPP_VERIFY_TOKEN;
  if (url.searchParams.get("hub.mode") === "subscribe" && expected && equalSecret(url.searchParams.get("hub.verify_token") ?? "", expected)) {
    return new Response(url.searchParams.get("hub.challenge") ?? "", { headers: { "Content-Type": "text/plain" } });
  }
  return Response.json({ error: "Webhook verification failed" }, { status: 403 });
}

type Message = { id?: string; from?: string; type?: string; text?: { body?: string }; contacts?: Array<{ profile?: { name?: string } }> };
type Payload = { entry?: Array<{ changes?: Array<{ value?: { messages?: Message[] } }> }> };

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyWhatsAppSignature(rawBody, request.headers.get("x-hub-signature-256"))) return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
  let payload: Payload;
  try { payload = JSON.parse(rawBody) as Payload; } catch { return Response.json({ error: "Malformed webhook payload" }, { status: 400 }); }
  const messages = payload.entry?.flatMap((entry) => entry.changes?.flatMap((change) => change.value?.messages ?? []) ?? []) ?? [];
  let processed = 0;
  let duplicates = 0;
  for (const message of messages) {
    if (!message.id || !message.from) continue;
    try {
      await db.$transaction(async (tx) => {
        await tx.webhookEvent.create({ data: { provider: "meta_whatsapp", externalId: message.id!, eventType: `message.${message.type ?? "unknown"}`, payload: message as Prisma.InputJsonValue } });
        await tx.lead.create({ data: {
          source: "whatsapp", name: message.contacts?.[0]?.profile?.name || `WhatsApp ${message.from!.slice(-4)}`,
          phone: message.from, message: message.text?.body?.slice(0, 5000) || `[${message.type ?? "unsupported"} WhatsApp message]`,
          idempotencyKey: createHash("sha256").update(`whatsapp:${message.id}`).digest("hex"), externalId: message.id,
          emailStatus: "not_requested", whatsappStatus: "received",
        } });
      });
      processed++;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") duplicates++;
      else {
        console.error("WhatsApp webhook persistence failed", { messageId: message.id, error: error instanceof Error ? error.message : "Unknown error" });
        return Response.json({ error: "Webhook processing failed" }, { status: 500 });
      }
    }
  }
  return Response.json({ received: true, processed, duplicates });
}
