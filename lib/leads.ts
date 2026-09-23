import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { sendLeadEmail } from "@/lib/providers/email";
import { sendLeadWhatsApp } from "@/lib/providers/whatsapp";
import type { LeadInput } from "@/lib/validation/leads";

export function createIdempotencyKey(input: LeadInput, supplied?: string | null) {
  if (supplied?.trim()) return createHash("sha256").update(supplied.trim().slice(0, 200)).digest("hex");
  const bucket = Math.floor(Date.now() / 300_000);
  return createHash("sha256").update(JSON.stringify([input.source, input.email, input.phone, input.message, bucket])).digest("hex");
}

export async function createLead(input: LeadInput, suppliedKey?: string | null) {
  const idempotencyKey = createIdempotencyKey(input, suppliedKey);
  try {
    const lead = await db.lead.create({ data: { ...input, metadata: input.metadata as Prisma.InputJsonValue | undefined, idempotencyKey } });
    const notifications = await Promise.allSettled([
      input.email ? sendLeadEmail({ ...input, id: lead.id }) : Promise.resolve(undefined),
      sendLeadWhatsApp({ ...input, id: lead.id }),
    ]);
    const [email, whatsapp] = notifications;
    const emailSent = email.status === "fulfilled" && Boolean(email.value);
    const whatsappSent = whatsapp.status === "fulfilled" && Boolean(whatsapp.value);
    const failures = notifications.filter((result) => result.status === "rejected") as PromiseRejectedResult[];
    await db.lead.update({
      where: { id: lead.id },
      data: {
        emailStatus: input.email ? (emailSent ? "sent" : "failed") : "not_requested",
        emailProviderId: email.status === "fulfilled" ? email.value : undefined,
        whatsappStatus: whatsappSent ? "sent" : "failed",
        whatsappProviderId: whatsapp.status === "fulfilled" ? whatsapp.value : undefined,
        notificationError: failures.length ? failures.map((f) => f.reason instanceof Error ? f.reason.message : "Provider failure").join("; ").slice(0, 1000) : null,
      },
    });
    return { id: lead.id, duplicate: false, notified: emailSent || whatsappSent };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await db.lead.findUnique({ where: { idempotencyKey } });
      if (existing) return { id: existing.id, duplicate: true, notified: existing.emailStatus === "sent" || existing.whatsappStatus === "sent" };
    }
    throw error;
  }
}
