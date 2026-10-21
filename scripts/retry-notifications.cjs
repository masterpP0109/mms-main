/* eslint-disable @typescript-eslint/no-require-imports -- CLI uses CommonJS to load the shared TypeScript server modules. */
// Run with node --conditions=react-server scripts/retry-notifications.cjs LEAD_ID
require("./server-bootstrap.cjs");
const { db } = require("../lib/db.ts");
const { notifyLead } = require("../lib/leads.ts");
(async () => {
  const id = process.argv[2];
  if (!id) throw new Error("Supply a lead ID reviewed for retry");
  const lead = await db.lead.findUniqueOrThrow({ where: { id } });
  if (!["pending", "retry_required", "reconciliation_required"].includes(lead.emailStatus)) throw new Error("Status requires reconciliation or was already accepted; no send attempted");
  const needsReview = lead.emailStatus === "reconciliation_required" || (lead.emailStatus === "retry_required" && !lead.notificationError?.startsWith("SMTP notification not accepted ("));
  if (needsReview) {
    if (!process.argv.includes("--confirmed-not-accepted")) throw new Error("Reconcile Titan and previous provider records before retrying an uncertain attempt");
    const claim = await db.lead.updateMany({ where: { id, emailStatus: lead.emailStatus, updatedAt: lead.updatedAt }, data: { emailStatus: "retry_required", emailAttempts: 0, emailNextAttemptAt: new Date(), emailClaimedAt: null, notificationError: "SMTP notification not accepted (EMANUAL)" } });
    if (!claim.count) throw new Error("Notification changed during reconciliation; no send attempted");
  }
  console.log({ leadId: id, accepted: await notifyLead(id) });
})().catch(() => { console.error("Retry blocked or failed; review lead status and Titan SMTP records. No customer data logged."); process.exitCode = 1; }).finally(() => db.$disconnect());
