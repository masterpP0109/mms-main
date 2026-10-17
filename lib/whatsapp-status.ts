import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
type Store = Pick<Prisma.TransactionClient, "webhookEvent" | "lead">;

// Event records also cover statuses that arrive before provider acceptance is saved.
export async function reconcileWhatsAppStatus(providerId: string, store: Store = db) {
  const events = await store.webhookEvent.findMany({ where: { provider: "meta_whatsapp", providerMessageId: providerId, eventType: { in: ["status.read", "status.delivered", "status.failed", "status.sent"] } }, select: { eventType: true } });
  const status = ["read", "delivered", "failed", "sent"].find(value => events.some(event => event.eventType === `status.${value}`));
  if (!status) return;
  const previous = status === "read" ? ["accepted", "sent", "delivered", "failed"] : status === "delivered" ? ["accepted", "sent", "failed"] : status === "failed" ? ["accepted", "sent"] : ["accepted"];
  await store.lead.updateMany({ where: { whatsappProviderId: providerId, whatsappStatus: { in: previous } }, data: { whatsappStatus: status } });
}
