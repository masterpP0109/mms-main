/* eslint-disable @typescript-eslint/no-require-imports -- database-independent SMTP verification and explicitly gated sending. */
const fs = require("node:fs");
const path = require("node:path");
const { smtpEnvironmentReport } = require("./server-bootstrap.cjs");
const { requireEmailEnv } = require("../lib/env.ts");
const { verifySmtp, sendEmail } = require("../lib/email/smtp.ts");
const { smtpFailure } = require("../lib/email/errors.ts");

async function main() {
  const mode = process.argv[2] || "verify";
  if (!["verify", "send"].includes(mode) || (mode === "send" && !process.argv.includes("--confirm-send"))) {
    console.error("Use email:verify, or explicitly request email:test:send -- --confirm-send. No email sent.");
    process.exitCode = 1; return;
  }
  const config = requireEmailEnv();
  if (config.host !== "smtp.titan.email" || config.user !== "info@mosimediasolutions.com" || config.to !== "info@mosimediasolutions.com") {
    throw new Error("SMTP test requires the intended Titan host and MMS sender/recipient");
  }
  console.log(JSON.stringify({ stage: "configuration", host: config.host, port: config.port, secure: true, certificateVerification: true, user: config.user, from: config.from, to: config.to, environment: smtpEnvironmentReport() }));
  await verifySmtp();
  console.log(JSON.stringify({ stage: "verify", passed: true, emailSent: false, note: "Connection/authentication passed; this does not prove inbox delivery." }));
  if (mode === "verify") return;

  const statePath = path.join(process.cwd(), ".cache", "titan-smtp-local-test.json");
  const legacy = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};
  if (legacy.directAttempted) throw new Error("Previous test-send attempt recorded; reconcile Titan before any repeat");
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  const lockPath = path.join(path.dirname(statePath), "titan-direct-test-once.json");
  // Exclusive creation prevents two simultaneous commands from sending twice.
  const fd = fs.openSync(lockPath, "wx");
  fs.writeFileSync(fd, JSON.stringify({ attempted: true, at: new Date().toISOString() }));
  fs.closeSync(fd);
  legacy.directAttempted = true;
  fs.writeFileSync(statePath, JSON.stringify(legacy, null, 2));
  const messageId = await sendEmail({ leadId: "local_titan_smtp_test_v1", subject: "MMS Local Titan SMTP Test", text: "MMS LOCAL TITAN SMTP TEST. Not a customer enquiry. Please confirm arrival in Titan's inbox or spam folder.", html: "<p><strong>MMS LOCAL TITAN SMTP TEST</strong></p><p>Not a customer enquiry. Please confirm arrival in Titan's inbox or spam folder.</p>" });
  legacy.directAccepted = true;
  fs.writeFileSync(statePath, JSON.stringify(legacy, null, 2));
  fs.writeFileSync(lockPath, JSON.stringify({ attempted: true, accepted: true, messageId }));
  console.log(JSON.stringify({ stage: "one-time-test", accepted: true, messageId, inboxDeliveryConfirmed: false }));
}
main().catch(error => {
  const failure = smtpFailure(error);
  console.error(JSON.stringify({ stage: "smtp", passed: false, code: failure.code, responseCode: failure.responseCode, retrySafe: failure.retrySafe, emailAcceptanceConfirmed: false }));
  process.exitCode = 1;
});
