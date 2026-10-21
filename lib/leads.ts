import "server-only";
import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/providers/email";
import { deliverEmail } from "@/lib/email/outbox";
import { sendLeadWhatsApp } from "@/lib/providers/whatsapp";
import { reconcileWhatsAppStatus } from "@/lib/whatsapp-status";
import { enforceIdentityLimit } from "@/lib/rate-limit";
import { isWhatsAppOutboundConfigured } from "@/lib/env";
import { notifyCustomer } from "@/lib/acknowledgements";
import type { LeadInput } from "@/lib/validation/leads";

export function createIdempotencyKey(input: LeadInput, supplied?: string | null) {
  const payload = JSON.stringify(input);
  const scope = supplied?.trim().slice(0, 200) || String(Math.floor(Date.now() / 300_000));
  return createHash("sha256").update(payload + scope).digest("hex");
}

export async function notifyLead(id: string) {
  return deliverEmail(id, "notification", sendLeadEmail);
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
    lead = await db.lead.create({ data: { ...input, metadata: input.metadata as Prisma.InputJsonValue | undefined, idempotencyKey, whatsappStatus: "pending", acknowledgementStatus: input.source !== "whatsapp" && input.email ? "pending" : "not_requested" } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const duplicate = await db.lead.findUnique({ where: { idempotencyKey } });
      if (duplicate) return { id: duplicate.id, duplicate: true, notified: ["accepted", "sent"].includes(duplicate.emailStatus) };
    }
    throw error;
  }
  return { id: lead.id, duplicate: false, notified: false };
}

/** Persist first; callers schedule processLeadEmails after the response. */
export async function submitLead(input: LeadInput, suppliedKey?: string | null) {
  return createLead(input, suppliedKey);
}

export async function processLeadEmails(id: string) {
  const outcomes = await Promise.allSettled([notifyLead(id), notifyCustomer(id)]);
  outcomes.forEach((outcome, channel) => {
    if (outcome.status === "rejected") console.error("Enquiry email processing incomplete", { leadId: id, channel });
  });
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
