/* eslint-disable @typescript-eslint/no-require-imports -- explicitly confirmed SMTP template test, no database writes. */
require("./server-bootstrap.cjs");
const fs = require("node:fs");
const path = require("node:path");
const { requireEmailEnv } = require("../lib/env.ts");
const { verifySmtp, sendEmail } = require("../lib/email/smtp.ts");
const { renderEnquiryEmail } = require("../lib/email/templates.ts");
const { smtpFailure } = require("../lib/email/errors.ts");

(async () => {
  if (!process.argv.includes("--confirm-send")) throw new Error("Explicit --confirm-send is required; nothing sent");
  const config = requireEmailEnv();
  if (config.host !== "smtp.titan.email" || config.user !== "info@mosimediasolutions.com" || config.to !== config.user) throw new Error("Expected MMS Titan configuration");
  // Without an explicitly supplied approved recipient, both template tests stay in MMS's inbox.
  const customer = process.argv.find(arg => arg.startsWith("--customer-email="))?.slice("--customer-email=".length) || config.user;
  const { z } = require("zod");
  z.email().parse(customer);
  await verifySmtp();
  const directory = path.join(process.cwd(), ".cache");
  fs.mkdirSync(directory, { recursive: true });
  const statePath = path.join(directory, "enquiry-template-test-once.json");
  const fd = fs.openSync(statePath, "wx");
  const state = { attempted: true, at: new Date().toISOString(), mmsAccepted: false, customerAccepted: false, customerMailboxSelfTest: customer === config.user, inboxDeliveryConfirmed: false };
  fs.writeFileSync(fd, JSON.stringify(state));
  fs.closeSync(fd);
  const fixture = { id: "MMS-TEMPLATE-TEST-20261020", createdAt: new Date(), source: "project_builder", name: "MMS EMAIL TEMPLATE TEST", email: customer, phone: "+263788111391", projectType: "corporate", message: "CLEARLY LABELLED TEMPLATE TEST ONLY. No customer enquiry was stored. Please check both template messages in the inbox/spam folder.", metadata: { audience: "large-event", timeline: "planned", venue: "Victoria Falls" } };
  // Persist each outcome independently; a lock remains after uncertain or partial acceptance.
  for (const audience of ["mms", "customer"]) {
    const template = renderEnquiryEmail(fixture, audience);
    await sendEmail({ leadId: fixture.id, ...template, subject: `[TEST] ${template.subject}`, ...(audience === "customer" ? { kind: "acknowledgement", to: customer } : { replyTo: { name: fixture.name, email: customer } }) });
    state[audience === "mms" ? "mmsAccepted" : "customerAccepted"] = true;
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    console.log(JSON.stringify({ template: audience, smtpAccepted: true, customerMailboxSelfTest: state.customerMailboxSelfTest, inboxDeliveryConfirmed: false }));
  }
})().catch(error => {
  const failure = smtpFailure(error);
  console.error(JSON.stringify({ testCompleted: false, code: failure.code, retrySafe: failure.retrySafe, note: "Check configuration or prior test lock; reconcile Titan before repeating." }));
  process.exitCode = 1;
});
