import "server-only";
import { db } from "@/lib/db";
import { sendCustomerAcknowledgement } from "@/lib/providers/acknowledgement";
import { smtpFailure } from "@/lib/email/errors";
import type { LeadInput } from "@/lib/validation/leads";

/** Independent claim/status: never replay the staff notification to repair a customer email. */
export async function notifyCustomer(id: string) {
  const claim = await db.lead.updateMany({ where: {
    id, source: { not: "whatsapp" }, email: { not: null }, acknowledgementAttempts: { lt: 5 },
    OR: [{ acknowledgementStatus: "pending" }, { acknowledgementStatus: "retry_required", acknowledgementError: { startsWith: "SMTP notification not accepted (" } }],
  }, data: { acknowledgementStatus: "sending", acknowledgementAttempts: { increment: 1 } } });
  if (!claim.count) return false;
  const lead = await db.lead.findUniqueOrThrow({ where: { id } });
  let providerId: string;
  try {
    providerId = await sendCustomerAcknowledgement({ ...lead, source: lead.source as LeadInput["source"], email: lead.email ?? undefined, phone: lead.phone ?? undefined, organisation: lead.organisation ?? undefined, projectType: lead.projectType ?? undefined, externalId: lead.externalId ?? undefined, metadata: (lead.metadata ?? {}) as LeadInput["metadata"] });
  } catch (error) {
    const failure = smtpFailure(error);
    console.error("Customer acknowledgement incomplete", { leadId: id, code: failure.code, responseCode: failure.responseCode });
    await db.lead.update({ where: { id }, data: { acknowledgementStatus: failure.retrySafe ? "retry_required" : "reconciliation_required", acknowledgementError: failure.message } });
    return false;
  }
  await db.lead.update({ where: { id }, data: { acknowledgementStatus: "accepted", acknowledgementProviderId: providerId, acknowledgementError: null } });
  return true;
}
