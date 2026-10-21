import { createHash, timingSafeEqual } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import { verifyWhatsAppSignature } from "@/lib/providers/whatsapp";
import { z } from "zod";
import { reconcileWhatsAppStatus } from "@/lib/whatsapp-status";
import { readBoundedBody, RequestError } from "@/lib/http";

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

const webhookSchema = z.object({
  entry: z.array(z.object({
    changes: z.array(z.object({
      value: z.object({
        statuses: z.array(z.object({ id: z.string().min(1).max(256), status: z.enum(["sent", "delivered", "read", "failed"]), timestamp: z.string().regex(/^\d{1,20}$/).optional() })).max(100).optional(),
        contacts: z.array(z.object({ wa_id: z.string().max(32), profile: z.object({ name: z.string().max(120) }).optional() })).max(100).optional(),
        messages: z.array(z.object({
          id: z.string().min(1).max(256), from: z.string().regex(/^\d{7,32}$/),
          type: z.string().min(1).max(80), text: z.object({ body: z.string().max(5000) }).optional(),
        }).passthrough()).max(100).optional(),
      }).passthrough(),
    })).max(100),
  })).max(100),
}).passthrough();

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") return Response.json({ error: "Content-Type must be application/json" }, { status: 415 });
  let rawBody: Buffer;
  try { rawBody = await readBoundedBody(request, 256_000); }
  catch (error) { return Response.json({ error: "Invalid webhook body" }, { status: error instanceof RequestError ? error.status : 400 }); }
  if (!verifyWhatsAppSignature(rawBody, request.headers.get("x-hub-signature-256"))) return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
  let payload: z.infer<typeof webhookSchema>;
  try { payload = webhookSchema.parse(JSON.parse(rawBody.toString("utf8"))); } catch { return Response.json({ error: "Malformed webhook payload" }, { status: 400 }); }
  const messages = payload.entry.flatMap((entry) => entry.changes.flatMap((change) => (change.value.messages ?? []).map((message) => ({ message, contacts: change.value.contacts }))));
  let processed = 0;
  let duplicates = 0;
  for (const { message, contacts } of messages) {
    if (!message.id || !message.from) continue;
    try {
      await db.$transaction(async (tx) => {
        await tx.webhookEvent.create({ data: { provider: "meta_whatsapp", externalId: message.id, eventType: `message.${message.type}`, payload: { type: message.type } as Prisma.InputJsonValue } });
        const name = contacts?.find((contact) => contact.wa_id === message.from)?.profile?.name || `WhatsApp ${message.from.slice(-4)}`;
        // Updating the contact serializes simultaneous messages from the same sender.
        const contact = await tx.contact.upsert({ where: { phone: message.from }, create: { phone: message.from, name }, update: { name } });
        const conversation = await tx.conversation.upsert({ where: { contactId: contact.id }, create: { contactId: contact.id }, update: {} });
        const text = message.text?.body || `[${message.type} WhatsApp message]`;
        await tx.message.create({ data: { externalId: message.id, conversationId: conversation.id, type: message.type, text } });
        if (!conversation.leadId) {
        const lead = await tx.lead.create({ data: {
          source: "whatsapp", name,
          phone: message.from, message: message.text?.body?.slice(0, 5000) || `[${message.type ?? "unsupported"} WhatsApp message]`,
          idempotencyKey: createHash("sha256").update(`whatsapp:${message.id}`).digest("hex"), externalId: message.id,
          emailStatus: "not_requested", whatsappStatus: "received",
        } });
        await tx.conversation.update({ where: { id: conversation.id }, data: { leadId: lead.id } });
        }
      }, { maxWait: 10_000, timeout: 20_000 });
      processed++;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") duplicates++;
      else {
        console.error("WhatsApp webhook persistence failed", { type: error instanceof Prisma.PrismaClientKnownRequestError ? "PrismaClientKnownRequestError" : "UnexpectedError", ...(error instanceof Prisma.PrismaClientKnownRequestError ? { code: error.code } : {}) });
        return Response.json({ error: "Webhook processing failed" }, { status: 500 });
      }
    }
  }
  const statuses = payload.entry.flatMap(entry => entry.changes.flatMap(change => change.value.statuses ?? []));
  for (const status of statuses) {
    try {
      await db.$transaction(async tx => {
        await tx.webhookEvent.create({ data: { provider: "meta_whatsapp", externalId: `status:${status.id}:${status.status}:${status.timestamp ?? ""}`, providerMessageId: status.id, eventType: `status.${status.status}`, payload: { status: status.status } } });
        await reconcileWhatsAppStatus(status.id, tx);
      }, { maxWait: 10_000, timeout: 20_000 });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) {
        console.error("WhatsApp status persistence failed");
        return Response.json({ error: "Webhook processing failed" }, { status: 500 });
      }
    }
  }
  return Response.json({ received: true, processed, duplicates });
}
