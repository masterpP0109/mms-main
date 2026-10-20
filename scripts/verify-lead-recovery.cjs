/* eslint-disable @typescript-eslint/no-require-imports -- controlled database verification with simulated SMTP only. */
require("./server-bootstrap.cjs");
const assert = require("node:assert/strict");
const { randomUUID, createHash } = require("node:crypto");
const { db } = require("../lib/db.ts");
const { createLead } = require("../lib/leads.ts");
const { deliverEmail, recoverEmailWork } = require("../lib/email/outbox.ts");
const { SmtpNotificationError } = require("../lib/email/errors.ts");
const token = randomUUID();
const email = `mms-recovery-${token}@example.com`;
const ids = [];
const rateKeys = [0, 1].map(offset => createHash("sha256").update(`${email}:${Math.floor(Date.now() / 600_000) + offset}`).digest("hex"));
async function run() {
  assert.ok(process.argv.includes("--confirm-test-records"), "Pass --confirm-test-records to create and remove UUID-scoped fixtures");
  const input = { source: "contact", name: "MMS AUTOMATED RECOVERY TEST", email, message: "Test fixture only; no real emails will be sent." };
  const result = await createLead(input, token);
  ids.push(result.id);
  const row = await db.lead.findUniqueOrThrow({ where: { id: result.id } });
  assert.equal(row.emailStatus, "pending");
  assert.equal(row.acknowledgementStatus, "pending");
  assert.equal(row.emailAttempts, 0);
  assert.equal(row.acknowledgementAttempts, 0);
  const duplicates = await Promise.all(Array.from({ length: 8 }, () => createLead(input, token)));
  assert.ok(duplicates.every(item => item.duplicate && item.id === row.id));
  assert.equal(await db.lead.count({ where: { email } }), 1);
  console.log("PASS real Neon insert/read, initial statuses and eight concurrent duplicate submissions");
  const failed = () => Promise.reject(new SmtpNotificationError("EAUTH", true, 535));
  await deliverEmail(row.id, "notification", failed);
  await deliverEmail(row.id, "acknowledgement", async () => "simulated-customer-acceptance");
  let state = await db.lead.findUniqueOrThrow({ where: { id: row.id } });
  assert.equal(state.emailStatus, "retry_required");
  assert.equal(state.acknowledgementStatus, "accepted");
  assert.ok(state.emailNextAttemptAt > new Date());
  let sends = 0;
  const accepted = async () => { sends++; return "simulated-internal-acceptance"; };
  await deliverEmail(row.id, "notification", accepted);
  assert.equal(sends, 0, "Backoff must prevent an early send");
  await db.lead.update({ where: { id: row.id }, data: { emailNextAttemptAt: new Date(Date.now() - 1000) } });
  await Promise.all([deliverEmail(row.id, "notification", accepted), deliverEmail(row.id, "notification", accepted)]);
  assert.equal(sends, 1, "Atomic claim must prevent concurrent SMTP sends");
  state = await db.lead.findUniqueOrThrow({ where: { id: row.id } });
  assert.equal(state.emailStatus, "accepted");
  assert.equal(state.emailAttempts, 2);
  assert.equal(state.acknowledgementAttempts, 1);
  console.log("PASS auth failure, independent channel success, enforced backoff and single-send concurrent retry (simulated SMTP)");
  await db.lead.update({ where: { id: row.id }, data: { emailStatus: "pending", emailAttempts: 0 } });
  await deliverEmail(row.id, "notification", () => Promise.reject(new SmtpNotificationError("ETIMEDOUT", false)));
  assert.equal((await db.lead.findUniqueOrThrow({ where: { id: row.id } })).emailStatus, "reconciliation_required");
  await db.lead.update({ where: { id: row.id }, data: { emailStatus: "sending", emailClaimedAt: new Date(Date.now() - 660_000) } });
  await recoverEmailWork(new Date(), row.id);
  assert.equal((await db.lead.findUniqueOrThrow({ where: { id: row.id } })).emailStatus, "reconciliation_required");
  assert.equal(await deliverEmail(row.id, "notification", accepted), false);
  const pending = await createLead({ ...input, message: "Interrupted before background trigger" }, `${token}-pending`);
  ids.push(pending.id);
  await recoverEmailWork(new Date(), pending.id);
  assert.equal(await deliverEmail(pending.id, "notification", accepted), true);
  assert.equal(await deliverEmail(pending.id, "acknowledgement", async () => "simulated-recovered-customer"), true);
  console.log("PASS ambiguous timeout retained, interrupted claims flagged, pending work recovered after skipped trigger (simulated SMTP)");
}
run().catch(error => {
  console.error("FAIL recovery verification", { type: error.name, code: error.code, detail: error instanceof assert.AssertionError ? error.message : "Details suppressed" }); process.exitCode = 1;
}).finally(async () => {
  try {
    if (ids.length) await db.lead.deleteMany({ where: { id: { in: ids }, email } });
    if (ids.length) await db.rateLimit.deleteMany({ where: { key: { in: rateKeys } } });
    console.log("UUID-scoped recovery fixtures removed");
  } finally { await db.$disconnect(); }
});
