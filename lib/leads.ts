import "server-only";
import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/providers/email";
import { sendLeadWhatsApp } from "@/lib/providers/whatsapp";
import { reconcileWhatsAppStatus } from "@/lib/whatsapp-status";
import { enforceIdentityLimit } from "@/lib/rate-limit";
import { isWhatsAppOutboundConfigured } from "@/lib/env";
import type { LeadInput } from "@/lib/validation/leads";

export function createIdempotencyKey(input: LeadInput, supplied?: string | null) {
  const payload = JSON.stringify(input);
  const scope = supplied?.trim().slice(0, 200) || String(Math.floor(Date.now() / 300_000));
  return createHash("sha256").update(payload + scope).digest("hex");
}

export async function notifyLead(id: string) {
  // Atomic claim prevents concurrent senders; a crashed sender stays in sending for manual reconciliation.
  const claim = await db.lead.updateMany({ where: { id, emailStatus: { in: ["pending", "retry_required"] }, emailAttempts: { lt: 5 } }, data: { emailStatus: "sending", emailAttempts: { increment: 1 } } });
  if (!claim.count) return false;
  const lead = await db.lead.findUniqueOrThrow({ where: { id } });
  let providerId: string;
  try {
    providerId = await sendLeadEmail({ ...lead, externalId: lead.externalId ?? undefined, source: lead.source as LeadInput["source"], email: lead.email ?? undefined, phone: lead.phone ?? undefined, organisation: lead.organisation ?? undefined, projectType: lead.projectType ?? undefined, metadata: (lead.metadata ?? {}) as LeadInput["metadata"] });
  } catch {
    console.error("Lead notification requires retry", { leadId: id, provider: "resend" });
    await db.lead.update({ where: { id }, data: { emailStatus: "retry_required", notificationError: "Resend notification not accepted; configuration or provider failure" } });
    return false;
  }
  // Keep sending if this update fails: acceptance is uncertain locally and must be reconciled before retry.
  await db.lead.update({ where: { id }, data: { emailStatus: "accepted", emailProviderId: providerId, notificationError: null } });
  return true;
}

export async function createLead(input: LeadInput, suppliedKey?: string | null) {
  const idempotencyKey = createIdempotencyKey(input, suppliedKey);
  const existing = await db.lead.findUnique({ where: { idempotencyKey } });
  if (existing) return { id: existing.id, duplicate: true, notified: ["accepted", "sent"].includes(existing.emailStatus) };
  // Shared database limit applies across Vercel instances, rather than process-local memory.
  await enforceIdentityLimit(input.email ?? input.phone ?? "unknown");
  let lead;
  try {
    // The lead row is also its durable notification work record: one atomic insert,
    // no external queue or separate transaction needed for two fixed channels.
    lead = await db.lead.create({ data: { ...input, metadata: input.metadata as Prisma.InputJsonValue | undefined, idempotencyKey, whatsappStatus: "pending" } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const duplicate = await db.lead.findUnique({ where: { idempotencyKey } });
      if (duplicate) return { id: duplicate.id, duplicate: true, notified: ["accepted", "sent"].includes(duplicate.emailStatus) };
    }
    throw error;
  }
  return { id: lead.id, duplicate: false, notified: false };
}

export async function notifyLeadWhatsApp(id: string) {
  if (!isWhatsAppOutboundConfigured()) {
    await db.lead.updateMany({ where: { id, whatsappStatus: "pending" }, data: { whatsappStatus: "not_configured" } });
    return false;
  }
  const claim = await db.lead.updateMany({ where: { id, whatsappStatus: { in: ["pending", "not_configured"] }, whatsappAttempts: { lt: 1 } }, data: { whatsappStatus: "sending", whatsappAttempts: { increment: 1 } } });
  if (!claim.count) return false;
  const lead = await db.lead.findUniqueOrThrow({ where: { id } });
  let providerId: string;
  try {
    providerId = await sendLeadWhatsApp({ ...lead, source: lead.source as LeadInput["source"], email: lead.email ?? undefined, phone: lead.phone ?? undefined, organisation: lead.organisation ?? undefined, projectType: lead.projectType ?? undefined, metadata: (lead.metadata ?? {}) as LeadInput["metadata"], externalId: lead.externalId ?? undefined });
  } catch {
    // Meta has no equivalent of the email idempotency key. Never automatically
    // replay an uncertain send; an operator must reconcile it with Meta first.
    await db.lead.update({ where: { id }, data: { whatsappStatus: "reconciliation_required" } });
    return false;
  }
  await db.lead.update({ where: { id }, data: { whatsappStatus: "accepted", whatsappProviderId: providerId } });
  await reconcileWhatsAppStatus(providerId);
  return true;
}
