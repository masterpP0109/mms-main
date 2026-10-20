import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { smtpFailure } from "./errors";
import type { EmailLead } from "./templates";

export const MAX_EMAIL_ATTEMPTS = 5;
export const SMTP_RETRY_PREFIX = "SMTP notification not accepted (";
const fields = {
  notification: { status: "emailStatus", attempts: "emailAttempts", error: "notificationError", provider: "emailProviderId", next: "emailNextAttemptAt", claimed: "emailClaimedAt" },
  acknowledgement: { status: "acknowledgementStatus", attempts: "acknowledgementAttempts", error: "acknowledgementError", provider: "acknowledgementProviderId", next: "acknowledgementNextAttemptAt", claimed: "acknowledgementClaimedAt" },
} as const;
export type EmailChannel = keyof typeof fields;

export function eligibleEmail(channel: EmailChannel, now = new Date()): Prisma.LeadWhereInput {
  const f = fields[channel];
  return {
    [f.attempts]: { lt: MAX_EMAIL_ATTEMPTS },
    ...(channel === "acknowledgement" ? { source: { not: "whatsapp" }, email: { not: null } } : {}),
    OR: [{ [f.status]: "pending" }, {
      [f.status]: "retry_required", [f.error]: { startsWith: SMTP_RETRY_PREFIX },
      OR: [{ [f.next]: null, updatedAt: { lt: new Date(now.getTime() - 300_000) } }, { [f.next]: { lte: now } }],
    }],
  };
}

/** The lead row is the transactional outbox for its two fixed email channels. */
export async function deliverEmail(id: string, channel: EmailChannel, send: (lead: EmailLead) => Promise<string>) {
  const f = fields[channel];
  const claim = await db.lead.updateMany({ where: { id, ...eligibleEmail(channel) }, data: {
    [f.status]: "sending", [f.attempts]: { increment: 1 }, [f.claimed]: new Date(),
  } });
  if (!claim.count) return false;
  const lead = await db.lead.findUniqueOrThrow({ where: { id } });
  const attempt = lead[f.attempts];
  const owned: Prisma.LeadWhereInput = { id, [f.status]: "sending", [f.attempts]: attempt };
  let providerId: string;
  try {
    providerId = await send({ ...lead, source: lead.source as EmailLead["source"], email: lead.email ?? undefined, phone: lead.phone ?? undefined, organisation: lead.organisation ?? undefined, projectType: lead.projectType ?? undefined, externalId: lead.externalId ?? undefined, metadata: (lead.metadata ?? {}) as EmailLead["metadata"] });
  } catch (error) {
    const failure = smtpFailure(error);
    console.error("Enquiry email failed", { channel, leadId: id, code: failure.code, responseCode: failure.responseCode, retrySafe: failure.retrySafe, attempt });
    await db.lead.updateMany({ where: owned, data: {
      [f.status]: failure.retrySafe && attempt < MAX_EMAIL_ATTEMPTS ? "retry_required" : "reconciliation_required",
      [f.error]: failure.message, [f.claimed]: null,
      [f.next]: failure.retrySafe ? new Date(Date.now() + Math.min(3600_000, 300_000 * 2 ** (attempt - 1))) : null,
    } });
    return false;
  }
  // SMTP has no exactly-once guarantee. If recording acceptance fails, never replay blindly.
  const recorded = await db.lead.updateMany({ where: owned, data: {
    [f.status]: "accepted", [f.provider]: providerId, [f.error]: null, [f.next]: null, [f.claimed]: null,
  } });
  return recorded.count === 1;
}

export async function recoverEmailWork(now = new Date(), id?: string) {
  const stale = new Date(now.getTime() - 10 * 60_000);
  for (const channel of Object.keys(fields) as EmailChannel[]) {
    const f = fields[channel];
    await db.lead.updateMany({ where: { ...(id ? { id } : {}), OR: [
      { [f.status]: "sending", OR: [{ [f.claimed]: { lt: stale } }, { [f.claimed]: null, updatedAt: { lt: stale } }] },
      { [f.status]: { in: ["pending", "retry_required"] }, [f.attempts]: { gte: MAX_EMAIL_ATTEMPTS } },
      { [f.status]: "retry_required", OR: [{ [f.error]: null }, { NOT: { [f.error]: { startsWith: SMTP_RETRY_PREFIX } } }] },
    ] }, data: { [f.status]: "reconciliation_required" } });
  }
}
