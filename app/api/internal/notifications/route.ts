import { createHash, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { notifyLead, notifyLeadWhatsApp } from "@/lib/leads";
import { isWhatsAppOutboundConfigured } from "@/lib/env";

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
    await db.lead.updateMany({ where: { emailStatus: { in: ["pending", "retry_required"] }, OR: [{ emailAttempts: { gte: 5 } }, { emailAttempts: { gt: 0 }, createdAt: { lt: new Date(now - 23 * 3600_000) } }] }, data: { emailStatus: "reconciliation_required" } });
    const leads = await db.lead.findMany({
      where: { source: { not: "whatsapp" }, OR: [{ emailStatus: "pending" }, { emailStatus: "retry_required", updatedAt: { lt: new Date(now - 5 * 60_000) } }, { whatsappStatus: { in: isWhatsAppOutboundConfigured() ? ["pending", "not_configured"] : ["pending"] } }] },
      orderBy: { createdAt: "asc" }, take: 3, select: { id: true },
    });
    let processed = 0;
    for (const lead of leads) {
      await Promise.allSettled([notifyLead(lead.id), notifyLeadWhatsApp(lead.id)]);
      processed++;
    }
    const attention = await db.lead.count({ where: { OR: [{ emailStatus: "reconciliation_required" }, { whatsappStatus: { in: ["not_configured", "reconciliation_required", "failed"] } }, { emailStatus: "sending", updatedAt: { lt: new Date(now - 10 * 60_000) } }, { whatsappStatus: "sending", updatedAt: { lt: new Date(now - 10 * 60_000) } }] } });
    if (attention) console.error("Notification reconciliation required", { count: attention });
    return Response.json({ processed, attention }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Notification worker failed");
    return Response.json({ error: "Worker failed" }, { status: 503 });
  }
}
