/* eslint-disable @typescript-eslint/no-require-imports -- explicit local end-to-end contact test. */
const fs = require("node:fs");
const path = require("node:path");
require("./server-bootstrap.cjs");
const { requireEmailEnv } = require("../lib/env.ts");
const { verifySmtp } = require("../lib/email/smtp.ts");
const { smtpFailure } = require("../lib/email/errors.ts");
const { checkDatabase, safeDatabaseError } = require("./check-db.cjs");

async function main() {
  const checkOnly = process.argv.includes("--check-only");
  if (!process.argv.includes("--confirm-send") && !checkOnly) {
    console.error("Contact test can store an enquiry and send one notification. Explicit --confirm-send is required; nothing submitted or sent.");
    process.exitCode = 1; return;
  }
  const target = process.argv.find(arg => arg.startsWith("http://")) || "http://localhost:3300";
  const base = new URL(target);
  if (base.protocol !== "http:" || !["localhost", "127.0.0.1", "[::1]"].includes(base.hostname) || base.username || base.password) throw new Error("Loopback URL required");
  let config;
  if (!checkOnly) {
    config = requireEmailEnv();
    if (config.host !== "smtp.titan.email" || config.user !== "info@mosimediasolutions.com" || config.to !== "info@mosimediasolutions.com") throw new Error("Authorized MMS configuration required");
    // Independent integrations must pass before a valid enquiry is submitted.
    await verifySmtp();
    const database = await checkDatabase({ checkSchema: true, requiredModels: ["Lead", "RateLimit"] });
    if (!database.passed) throw new Error("Required contact schema is not ready; no enquiry submitted");
  }

  const statePath = path.join(process.cwd(), ".cache", "titan-smtp-local-test.json");
  const previous = !checkOnly && fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};
  if (!checkOnly && (previous.contactAccepted || previous.submissionId)) throw new Error("Stored test already exists; reconcile its status instead of submitting again");
  const state = { ...previous };
  const fixture = { name: "MMS LOCAL TITAN SMTP TEST", email: "mms-local-smtp-test@example.com", service: "MMS Local Titan SMTP Test", origin: "/contact", projectType: "other", message: "CLEARLY LABELLED LOCAL SMTP CONTACT-ENDPOINT TEST. Not a customer enquiry.", website: "" };
  const endpoint = new URL("/api/leads", base);
  let checksPassed = true;
  for (const route of checkOnly ? ["/contact", "/services"] : ["/contact"]) {
    const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(30000) });
    await response.body?.cancel();
    console.log(JSON.stringify({ route, status: response.status, passed: response.status === 200 }));
    if (response.status !== 200) checksPassed = false;
  }
  for (const check of [
    { name: "cross-origin", headers: { Origin: "https://example.invalid" }, body: fixture, status: 403 },
    { name: "honeypot", headers: {}, body: { ...fixture, website: "bot-fixture" }, status: 422 },
    { name: "invalid-email", headers: {}, body: { ...fixture, email: "invalid" }, status: 422 },
  ]) {
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Origin: base.origin, ...check.headers }, body: JSON.stringify(check.body), signal: AbortSignal.timeout(20000) });
    console.log(JSON.stringify({ check: check.name, status: response.status, passed: response.status === check.status }));
    if (response.status !== check.status) checksPassed = false;
  }
  if (checkOnly) {
    console.log(JSON.stringify({ checkOnly: true, passed: checksPassed, enquirySubmitted: false, emailSent: false }));
    if (!checksPassed) process.exitCode = 1;
    return;
  }
  if (!checksPassed) throw new Error("Security or contact-route check failed; valid submission blocked");
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  const lockPath = path.join(path.dirname(statePath), "titan-contact-test-once.json");
  const fd = fs.openSync(lockPath, "wx");
  fs.writeFileSync(fd, JSON.stringify({ attempted: true, at: new Date().toISOString() }));
  fs.closeSync(fd);
  state.contactAttempted = true;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Origin: base.origin, "Idempotency-Key": "mms-local-titan-contact-test-v1" }, body: JSON.stringify(fixture), signal: AbortSignal.timeout(120000) });
  const result = await response.json();
  state.contactStatus = response.status;
  if (!response.ok || result.saved !== true || typeof result.submissionId !== "string") {
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    console.error(JSON.stringify({ stage: "contact-endpoint", status: response.status, persisted: false, emailAcceptanceConfirmed: false }));
    process.exitCode = 1; return;
  }
  state.submissionId = result.submissionId;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  const { db } = require("../lib/db.ts");
  try {
    // Read back the exact test row; never process an unbounded worker batch.
    const row = await db.lead.findUniqueOrThrow({ where: { id: result.submissionId }, select: { name: true, email: true, message: true, emailStatus: true } });
    if (row.name !== fixture.name || row.email !== fixture.email || row.message !== fixture.message) throw new Error("Stored fixture does not match");
    // Only the endpoint may send. A test-side fallback would hide a broken form.
    const accepted = result.notificationStatus === "accepted" && row.emailStatus === "accepted";
    const updated = await db.lead.findUniqueOrThrow({ where: { id: result.submissionId }, select: { emailStatus: true, emailProviderId: true } });
    const expectedMessageId = `<mms-lead-${result.submissionId.replace(/[^a-zA-Z0-9_-]/g, "")}@${config.from.split("@")[1]}>`;
    const smtpAccepted = accepted && updated.emailStatus === "accepted" && updated.emailProviderId === expectedMessageId;
    state.contactAccepted = smtpAccepted;
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    console.log(JSON.stringify({ stage: "contact-notification", persisted: true, smtpAccepted, emailStatus: updated.emailStatus, inboxDeliveryConfirmed: false }));
    if (!smtpAccepted) process.exitCode = 1;
  } finally { await db.$disconnect(); }
}
main().catch(error => {
  const failure = smtpFailure(error);
  console.error(JSON.stringify({ stage: "contact-test", failed: true, smtpCode: failure.code, responseCode: failure.responseCode, database: safeDatabaseError(error), rawDetailsSuppressed: true }));
  process.exitCode = 1;
});
