/* eslint-disable @typescript-eslint/no-require-imports -- shared server CLI bootstrap. */
require("./server-bootstrap.cjs");
const { db } = require("../lib/db.ts");
const { notifyCustomer } = require("../lib/acknowledgements.ts");
(async () => {
  const id = process.argv[2];
  if (!id) throw new Error("Supply the enquiry reference reviewed for acknowledgement retry");
  const lead = await db.lead.findUniqueOrThrow({ where: { id } });
  if (!["pending", "retry_required", "reconciliation_required"].includes(lead.acknowledgementStatus)) throw new Error("No eligible acknowledgement; no email sent");
  if (lead.acknowledgementStatus === "reconciliation_required") {
    if (!process.argv.includes("--confirmed-not-accepted")) throw new Error("Reconcile Titan before retrying an uncertain acknowledgement");
    const claim = await db.lead.updateMany({ where: { id, acknowledgementStatus: lead.acknowledgementStatus, updatedAt: lead.updatedAt }, data: { acknowledgementStatus: "retry_required", acknowledgementError: "SMTP notification not accepted (EMANUAL)" } });
    if (!claim.count) throw new Error("Acknowledgement changed during reconciliation");
  }
  console.log({ leadId: id, acknowledgementAccepted: await notifyCustomer(id) });
})().catch(() => { console.error("Acknowledgement retry blocked or failed; review its status and Titan records."); process.exitCode = 1; }).finally(() => db.$disconnect());
