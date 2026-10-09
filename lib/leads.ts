import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/providers/email";
import { sendLeadWhatsApp } from "@/lib/providers/whatsapp";
import { RequestError } from "@/lib/http";
import type { LeadInput } from "@/lib/validation/leads";

export function createIdempotencyKey(input: LeadInput, supplied?: string | null) {
  const payload = JSON.stringify(input);
  const scope = supplied?.trim().slice(0, 200) || String(Math.floor(Date.now() / 300_000));
  return createHash("sha256").update(payload + scope).digest("hex");
}

export async function notifyLead(id: string) {
  // Atomic claim prevents concurrent senders; a crashed sender stays in sending for manual reconciliation.
  const claim = await db.lead.updateMany({ where: { id, emailStatus: { in: ["pending", "retry_required"] } }, data: { emailStatus: "sending" } });
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
  const recent = await db.lead.count({ where: { ...(input.email ? { email: input.email } : { phone: input.phone }), createdAt: { gte: new Date(Date.now() - 600_000) } } });
  if (recent >= 10) throw new RequestError(429, "Too many enquiries");
  let lead;
  try {
    lead = await db.lead.create({ data: { ...input, metadata: input.metadata as Prisma.InputJsonValue | undefined, idempotencyKey } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const duplicate = await db.lead.findUnique({ where: { idempotencyKey } });
      if (duplicate) return { id: duplicate.id, duplicate: true, notified: ["accepted", "sent"].includes(duplicate.emailStatus) };
    }
    throw error;
  }
  const [email, whatsapp] = await Promise.allSettled([notifyLead(lead.id), sendLeadWhatsApp({ ...input, id: lead.id })]);
  try {
    await db.lead.update({ where: { id: lead.id }, data: { whatsappStatus: whatsapp.status === "fulfilled" && whatsapp.value ? "sent" : "failed", whatsappProviderId: whatsapp.status === "fulfilled" ? whatsapp.value : undefined } });
  } catch { console.error("Lead notification status update failed", { leadId: lead.id }); }
  if (email.status === "rejected") console.error("Lead email status needs reconciliation", { leadId: lead.id });
  return { id: lead.id, duplicate: false, notified: email.status === "fulfilled" && email.value };
}
