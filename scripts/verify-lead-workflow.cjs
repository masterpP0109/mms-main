/* eslint-disable @typescript-eslint/no-require-imports -- one explicitly authorized browser/database/SMTP verification. */
require("./server-bootstrap.cjs");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const { db } = require("../lib/db.ts");
const { verifySmtp } = require("../lib/email/smtp.ts");
const { requireEmailEnv } = require("../lib/env.ts");
const { renderEnquiryEmail } = require("../lib/email/templates.ts");
const { z } = require("zod");
const origin = "http://127.0.0.1:3102";
const statePath = ".cache/lead-workflow-once.json";
let server, log, browser;
async function run() {
  assert.ok(process.argv.includes("--confirm-send"), "Explicit --confirm-send required");
  const customer = z.email().parse(process.argv.find(arg => arg.startsWith("--customer-email="))?.slice(17));
  const config = requireEmailEnv();
  assert.equal(config.to, "info@mosimediasolutions.com");
  assert.equal(config.host, "smtp.titan.email");
  assert.ok(fs.existsSync(".next/BUILD_ID"), "Run the production build first");
  await verifySmtp();
  fs.mkdirSync(".cache", { recursive: true });
  const fd = fs.openSync(statePath, "wx");
  const state = { attempted: true, token: randomUUID(), customerAccepted: false, mmsAccepted: false, inboxConfirmed: false };
  fs.writeFileSync(fd, JSON.stringify(state, null, 2)); fs.closeSync(fd);
  log = fs.openSync(".cache/lead-workflow-server.log", "w");
  server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "3102"], {
    windowsHide: true, stdio: ["ignore", log, log], env: { ...process.env, NODE_ENV: "production", WHATSAPP_ACCESS_TOKEN: "", SITE_URL: origin },
  });
  const deadline = Date.now() + 60_000;
  while (true) {
    assert.equal(server.exitCode, null, "Local server exited");
    try { if ((await fetch(`${origin}/contact`, { signal: AbortSignal.timeout(2000) })).ok) break; } catch { /* Startup. */ }
    assert.ok(Date.now() < deadline, "Server startup timed out");
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(".cache/ms-playwright");
  const { chromium, expect } = require("@playwright/test");
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(`${origin}/contact?service=Corporate%20Event%20Production&origin=%2Fservices`);
  await page.getByRole("button", { name: "Other / Not Sure", exact: true }).click();
  await page.getByLabel("Your Name", { exact: true }).fill("MMS TEST ENQUIRY - Priviledge Mukunga");
  await page.getByLabel("Email Address", { exact: true }).fill(customer);
  await page.getByLabel("Phone Number (optional)", { exact: true }).fill("+263788111391");
  await page.getByLabel("Your Message", { exact: true }).fill(`CLEARLY LABELLED MMS SYSTEM TEST ${state.token}. Not a customer booking. Please verify both email templates and matching enquiry references. Corporate event production; timeline: planning ahead.`);
  const responsePromise = page.waitForResponse(response => response.url().endsWith("/api/leads") && response.request().method() === "POST");
  const started = Date.now();
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  const response = await responsePromise;
  state.responseMs = Date.now() - started;
  assert.equal(response.status(), 201);
  const result = await response.json();
  state.submissionId = result.submissionId; state.reference = result.reference;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  assert.equal(result.reference, `MMS-${result.submissionId}`);
  assert.equal(result.notificationStatus, "pending");
  await expect(page.getByText("Message received", { exact: false })).toBeVisible();
  await expect(page.getByText(result.reference, { exact: false })).toBeVisible();
  await page.screenshot({ path: ".cache/lead-workflow-success.png", fullPage: true });
  const saved = await db.lead.findUniqueOrThrow({ where: { id: result.submissionId } });
  assert.equal(saved.email, customer);
  assert.ok(saved.message.includes(state.token));
  state.persisted = true;
  const original = response.request();
  const replay = await fetch(`${origin}/api/leads`, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": original.headers()["idempotency-key"] }, body: original.postData(), signal: AbortSignal.timeout(15_000) });
  assert.equal(replay.status, 200);
  const duplicate = await replay.json();
  assert.equal(duplicate.submissionId, result.submissionId);
  assert.equal(duplicate.duplicate, true);
  assert.equal(await db.lead.count({ where: { idempotencyKey: saved.idempotencyKey } }), 1);
  state.duplicateVerified = true;
  const until = Date.now() + 90_000;
  let row;
  do {
    row = await db.lead.findUniqueOrThrow({ where: { id: result.submissionId } });
    if (row.emailStatus !== "pending" && row.emailStatus !== "sending" && row.acknowledgementStatus !== "pending" && row.acknowledgementStatus !== "sending") break;
    await new Promise(resolve => setTimeout(resolve, 500));
  } while (Date.now() < until);
  state.mmsAccepted = row.emailStatus === "accepted" && Boolean(row.emailProviderId);
  state.customerAccepted = row.acknowledgementStatus === "accepted" && Boolean(row.acknowledgementProviderId);
  state.emailStatus = row.emailStatus; state.acknowledgementStatus = row.acknowledgementStatus;
  state.emailAttempts = row.emailAttempts; state.acknowledgementAttempts = row.acknowledgementAttempts;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  for (const audience of ["mms", "customer"]) {
    const template = renderEnquiryEmail({ ...row, email: row.email ?? undefined, phone: row.phone ?? undefined }, audience);
    assert.ok(template.text.includes(state.reference));
    if (audience === "customer") assert.ok(!template.text.includes("Source page:"));
    fs.writeFileSync(`.cache/lead-workflow-${audience}.html`, template.html);
    await page.setViewportSize({ width: 320, height: 900 });
    await page.setContent(template.html);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({ path: `.cache/lead-workflow-${audience}.png`, fullPage: true });
  }
  console.log(JSON.stringify(state, null, 2));
  assert.equal(state.mmsAccepted, true, "Internal email must have independent SMTP acceptance");
  assert.equal(state.customerAccepted, true, "Customer email must have independent SMTP acceptance");
  assert.equal(row.emailAttempts, 1);
  assert.equal(row.acknowledgementAttempts, 1);
  console.log("PASS real Chromium form -> 201 -> Neon retrieval -> duplicate replay -> two independent SMTP acceptances; inbox receipt still needs verification");
}
run().catch(error => {
  console.error("FAIL controlled lead workflow", { type: error.name, code: error.code, detail: error instanceof assert.AssertionError ? error.message : "Details suppressed; inspect local test state" }); process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  if (server && server.exitCode === null && server.pid) { const exited = once(server, "exit"); server.kill(); await exited; }
  if (log !== undefined) fs.closeSync(log);
  await db.$disconnect();
});
