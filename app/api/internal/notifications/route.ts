import { createHash, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { notifyLead, notifyLeadWhatsApp } from "@/lib/leads";
import { isWhatsAppOutboundConfigured } from "@/lib/env";
import { notifyCustomer } from "@/lib/acknowledgements";
import { eligibleEmail, recoverEmailWork } from "@/lib/email/outbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) return Response.json({ error: "Worker not configured" }, { status: 503 });
  const hash = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(hash(request.headers.get("authorization") ?? ""), hash(`Bearer ${secret}`))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    // Bounded batches and backoff keep execution within the function budget.
    const now = Date.now();
    await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date(now - 3600_000) } } });
    await recoverEmailWork(new Date(now));
    const leads = await db.lead.findMany({
      where: { source: { not: "whatsapp" }, OR: [eligibleEmail("notification", new Date(now)), eligibleEmail("acknowledgement", new Date(now)), { whatsappStatus: { in: isWhatsAppOutboundConfigured() ? ["pending", "not_configured"] : ["pending"] } }] },
      orderBy: { createdAt: "asc" }, take: 3, select: { id: true },
    });
    let processed = 0;
    for (const lead of leads) {
      // Do not start another SMTP handshake near the serverless execution limit.
      if (Date.now() - now > 35_000) break;
      await Promise.allSettled([notifyLead(lead.id), notifyLeadWhatsApp(lead.id), notifyCustomer(lead.id)]);
      processed++;
    }
    const attention = await db.lead.count({ where: { OR: [{ emailStatus: "reconciliation_required" }, { acknowledgementStatus: "reconciliation_required" }, { acknowledgementStatus: "sending", updatedAt: { lt: new Date(now - 10 * 60_000) } }, { whatsappStatus: { in: ["not_configured", "reconciliation_required", "failed"] } }, { emailStatus: "sending", updatedAt: { lt: new Date(now - 10 * 60_000) } }, { whatsappStatus: "sending", updatedAt: { lt: new Date(now - 10 * 60_000) } }] } });
    if (attention) console.error("Notification reconciliation required", { count: attention });
    return Response.json({ processed, attention }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Notification worker failed");
    return Response.json({ error: "Worker failed" }, { status: 503 });
  }
}
