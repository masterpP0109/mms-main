/* eslint-disable @typescript-eslint/no-require-imports -- real production-build smoke test. */
require("./server-bootstrap.cjs");
const assert = require("node:assert/strict");
const { randomUUID, createHmac, createHash } = require("node:crypto");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");
const { securePostgresUrl } = require("../lib/postgres-url.ts");

// Own the localhost server so fixture enquiries cannot send real notifications.
const token = randomUUID();
const origin = "http://127.0.0.1:3101";
const secret = `neon-smoke-${token}`;
const emails = ["contact", "builder", "conference", "browser"].map(kind => `neon-${token}-${kind}@example.com`);
const slug = `neon-smoke-${token}`;
const phone = `2637${Date.now().toString().slice(-8)}`;
const externalIds = [1, 2].map(i => `wamid.${slug}.${i}`);
const rateKeys = new Set();
let server, log, browser, ownsPhone = false;
const manifest = `.cache/neon-e2e-fixtures-${token}.json`;
const db = new PrismaClient({ datasources: { db: { url: securePostgresUrl(process.env.DATABASE_URL) } } });

function trackRateKey(email) {
  rateKeys.add(createHash("sha256").update(`${email}:${Math.floor(Date.now() / 600_000)}`).digest("hex"));
  fs.writeFileSync(manifest, JSON.stringify({ token, emails, slug, phone, externalIds, rateKeys: [...rateKeys] }));
}
async function request(route, options) {
  return fetch(`${origin}${route}`, { ...options, signal: AbortSignal.timeout(120_000) });
}
async function post(route, payload, key) {
  if (payload.email) trackRateKey(payload.email);
  const response = await request(route, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(payload) });
  assert.ok([200, 201].includes(response.status), `${route} should save successfully`);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.equal(body.saved, true);
  return body;
}
async function checkPage(route, title) {
  const response = await request(route);
  assert.equal(response.status, 200, route);
  assert.ok((await response.text()).includes(title), `${route} must render the database title`);
}
async function run() {
  assert.ok(new URL(process.env.DATABASE_URL).hostname.endsWith(".neon.tech"), "Configure a Neon DATABASE_URL first");
  assert.ok(fs.existsSync(".next/BUILD_ID"), "Run npm run build first");
  assert.equal(await db.contact.count({ where: { phone } }), 0, "Fixture phone must be unused");
  ownsPhone = true;
  fs.mkdirSync(".cache", { recursive: true });
  fs.writeFileSync(manifest, JSON.stringify({ token, emails, slug, phone, externalIds, rateKeys: [] }));
  log = fs.openSync(".cache/neon-e2e-server.log", "w");
  server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "3101"], {
    cwd: process.cwd(), windowsHide: true, stdio: ["ignore", log, log],
    env: { ...process.env, NODE_ENV: "production", SMTP_PASSWORD: "", WHATSAPP_ACCESS_TOKEN: "", WHATSAPP_APP_SECRET: secret, SITE_URL: origin },
  });
  let spawnError;
  server.on("error", error => { spawnError = error; });
  const deadline = Date.now() + 60_000;
  while (true) {
    if (spawnError) throw spawnError;
    assert.equal(server.exitCode, null, "Production server exited; inspect .cache/neon-e2e-server.log");
    try { if ((await fetch(origin, { signal: AbortSignal.timeout(2000) })).ok) break; } catch { /* Wait for startup. */ }
    assert.ok(Date.now() < deadline, "Production server startup timed out");
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  console.log("PASS production server started on 127.0.0.1:3101 (outbound notifications disabled)");

  await db.service.create({ data: { slug, title: "Neon smoke service", category: "Test", description: "Temporary database read verification", heroImage: "/victoria_falls_banner.png", gallery: [], features: [] } });
  await db.project.create({ data: { slug, title: "Neon smoke project", category: "Test", description: "Temporary database read verification", year: 2026, heroImage: "/victoria_falls_banner.png", gallery: [], tags: [] } });
  await checkPage("/services", "Neon smoke service");
  await checkPage(`/services/${slug}`, "Neon smoke service");
  await checkPage("/projects", "Neon smoke project");
  await checkPage(`/projects/${slug}`, "Neon smoke project");
  await db.service.update({ where: { slug }, data: { title: "Updated Neon smoke service" } });
  await checkPage(`/services/${slug}`, "Updated Neon smoke service");
  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.ok(xml.includes(`/services/${slug}`) && xml.includes(`/projects/${slug}`));
  console.log("PASS Postgres content writes, catalogue/detail reads, live updates and sitemap");

  const contact = { name: "Neon test contact", email: emails[0], message: "Temporary Neon verification", service: "Drone Services", origin: "/services/drone" };
  const first = await post("/api/leads", contact, `${token}-contact`);
  const duplicates = await Promise.all([1, 2, 3].map(() => post("/api/leads", contact, `${token}-contact`)));
  duplicates.forEach(result => { assert.equal(result.submissionId, first.submissionId); assert.equal(result.duplicate, true); });
  let saved;
  const notifyDeadline = Date.now() + 15_000;
  do {
    saved = await db.lead.findUniqueOrThrow({ where: { id: first.submissionId } });
    if (saved.emailStatus !== "pending" && saved.emailStatus !== "sending") break;
    await new Promise(resolve => setTimeout(resolve, 100));
  } while (Date.now() < notifyDeadline);
  assert.equal(saved.email, emails[0]);
  assert.equal(saved.metadata.service, contact.service);
  assert.equal(saved.emailStatus, "retry_required");
  assert.equal(saved.emailAttempts, 1);
  assert.equal(await db.lead.count({ where: { email: emails[0] } }), 1);
  const bucket = await db.rateLimit.findUniqueOrThrow({ where: { key: [...rateKeys][0] } });
  assert.equal(bucket.count, 1);
  const brief = await post("/api/leads", { name: "Neon test brief", email: emails[1], goal: "Film", audience: "Visitors", timeline: "Next month", details: "Temporary Neon verification" }, `${token}-brief`);
  assert.equal((await db.lead.findUniqueOrThrow({ where: { id: brief.submissionId } })).source, "project_builder");
  const conference = await post("/api/conference-enquiry", { contact: "Neon test conference", organisation: "Test", email: emails[2], services: ["AV"], details: "Temporary Neon verification" }, `${token}-conference`);
  assert.equal((await db.lead.findUniqueOrThrow({ where: { id: conference.submissionId } })).source, "conference");
  console.log("PASS contact, project brief and conference HTTP submissions persisted; concurrent retries reuse one lead and rate-limit bucket");

  const body = JSON.stringify({ entry: [{ changes: [{ value: { contacts: [{ wa_id: phone, profile: { name: "Neon test WhatsApp" } }], messages: externalIds.map(id => ({ id, from: phone, type: "text", text: { body: "Temporary Neon verification" } })) } }] }] });
  const webhook = () => request("/api/webhooks/whatsapp", { method: "POST", headers: { "Content-Type": "application/json", "x-hub-signature-256": `sha256=${createHmac("sha256", secret).update(body).digest("hex")}` }, body });
  const inbound = await webhook();
  assert.equal(inbound.status, 200);
  assert.equal((await inbound.json()).processed, 2);
  const replay = await webhook();
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).duplicates, 2);
  const thread = await db.contact.findUniqueOrThrow({ where: { phone }, include: { conversation: { include: { messages: true } } } });
  assert.equal(thread.conversation.messages.length, 2);
  assert.ok(thread.conversation.leadId);
  assert.equal(await db.webhookEvent.count({ where: { externalId: { in: externalIds } } }), 2);
  console.log("PASS signed webhook, contact, conversation, messages and webhook deduplication persisted");

  process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve(".cache/ms-playwright");
  const { chromium, expect } = require("@playwright/test");
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(`${origin}/contact?service=Drone%20Services&origin=%2Fservices%2Fdrone`);
  await page.getByRole("button", { name: "Other / Not Sure", exact: true }).click();
  await expect(page.getByRole("button", { name: "Other / Not Sure", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Your Name", { exact: true }).fill("Neon browser verification");
  await page.getByLabel("Email Address", { exact: true }).fill(emails[3]);
  await page.getByLabel("Your Message", { exact: true }).fill("Real browser to Next.js to Neon verification");
  trackRateKey(emails[3]);
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(page.getByText("Message received", { exact: false })).toBeVisible({ timeout: 30_000 });
  assert.equal(await db.lead.count({ where: { email: emails[3] } }), 1);
  await page.screenshot({ path: ".cache/neon-e2e-contact.png", fullPage: true });
  console.log("PASS real Chromium contact form -> Next.js API -> Neon row -> success message");
}
async function cleanup() {
  await browser?.close();
  if (server && server.exitCode === null && server.pid) {
    const exited = once(server, "exit");
    server.kill();
    await exited;
  }
  if (log !== undefined) fs.closeSync(log);
  // Only remove this run's UUID-scoped fixtures, in foreign-key order.
  await db.$transaction(async tx => {
    const contact = ownsPhone ? await tx.contact.findUnique({ where: { phone }, include: { conversation: true } }) : null;
    if (contact?.conversation) {
      await tx.message.deleteMany({ where: { conversationId: contact.conversation.id } });
      await tx.conversation.delete({ where: { id: contact.conversation.id } });
      if (contact.conversation.leadId) await tx.lead.delete({ where: { id: contact.conversation.leadId } });
    }
    if (contact) await tx.contact.delete({ where: { id: contact.id } });
    await tx.webhookEvent.deleteMany({ where: { externalId: { in: externalIds } } });
    await tx.lead.deleteMany({ where: { email: { in: emails } } });
    await tx.rateLimit.deleteMany({ where: { key: { in: [...rateKeys] } } });
    await tx.service.deleteMany({ where: { slug } });
    await tx.project.deleteMany({ where: { slug } });
  }, { maxWait: 10_000, timeout: 60_000 });
  if (fs.existsSync(manifest)) fs.unlinkSync(manifest);
  console.log("PASS temporary verification records removed");
}
run().catch(error => {
  console.error("FAIL Neon end-to-end verification", { type: error.name, message: error instanceof assert.AssertionError ? error.message : "Inspect the local server log; database details suppressed" });
  process.exitCode = 1;
}).finally(async () => {
  try { await cleanup(); }
  catch { console.error("FAIL fixture cleanup; inspect UUID-scoped neon-smoke records"); process.exitCode = 1; }
  finally { await db.$disconnect(); }
});
