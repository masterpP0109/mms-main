/* eslint-disable @typescript-eslint/no-require-imports -- isolated database integration CLI */
const assert = require("node:assert/strict");
const { randomUUID, createHmac } = require("node:crypto");
const path = require("node:path");
const fs = require("node:fs");
const ts = require("typescript");
const Module = require("node:module");
const url = new URL(process.env.MMS_TEST_DATABASE_URL || "postgresql://invalid/invalid");
assert.ok(["localhost", "127.0.0.1"].includes(url.hostname) && url.pathname.endsWith("_test"), "Set MMS_TEST_DATABASE_URL to an isolated local database ending in _test");
process.env.DATABASE_URL = url.href;
process.env.SMTP_PASSWORD = "";
delete process.env.WHATSAPP_ACCESS_TOKEN;
process.env.WHATSAPP_APP_SECRET = "integration-test-only";
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith("@/") ? path.join(process.cwd(), name.slice(2)) : name, ...args); };
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { db } = require("../lib/db.ts");
const { createLead, notifyLeadWhatsApp } = require("../lib/leads.ts");
const { getService } = require("../lib/get-service.ts");
const { POST } = require("../app/api/webhooks/whatsapp/route.ts");
async function run() {
  const token = randomUUID();
  const input = { source: "contact", name: "Integration fixture", email: `${token}@example.com`, message: "Isolated concurrency test" };
  const results = await Promise.all(Array.from({ length: 8 }, () => createLead(input, token)));
  assert.equal(new Set(results.map(result => result.id)).size, 1);
  const lead = await db.lead.findUniqueOrThrow({ where: { id: results[0].id } });
  assert.equal(lead.emailStatus, "pending");
  assert.equal(lead.whatsappStatus, "pending");
  assert.equal(lead.emailAttempts, 0);
  assert.equal(lead.acknowledgementStatus, "pending");
  assert.equal(lead.acknowledgementAttempts, 0);
  await notifyLeadWhatsApp(lead.id);
  const deferred = await db.lead.findUniqueOrThrow({ where: { id: lead.id } });
  assert.equal(deferred.whatsappStatus, "not_configured");
  assert.equal(deferred.whatsappAttempts, 0);
  const previousFetch = global.fetch;
  const previousPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  let providerCalls = 0;
  try {
    process.env.WHATSAPP_ACCESS_TOKEN = "isolated-provider-fixture";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "fixture-phone-id";
    global.fetch = async () => {
      providerCalls++;
      return Response.json({ messages: [{ id: `wamid.fixture.${token}` }] });
    };
    await Promise.all([notifyLeadWhatsApp(lead.id), notifyLeadWhatsApp(lead.id)]);
    const recovered = await db.lead.findUniqueOrThrow({ where: { id: lead.id } });
    assert.equal(recovered.whatsappStatus, "accepted");
    assert.equal(recovered.whatsappAttempts, 1);
    assert.equal(providerCalls, 1);
  } finally {
    global.fetch = previousFetch;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    if (previousPhoneId === undefined) delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    else process.env.WHATSAPP_PHONE_NUMBER_ID = previousPhoneId;
  }
  const content = await db.service.create({ data: { slug: `test-${token}`, title: "Private fixture", category: "Test", description: "Isolated content fixture", heroImage: "/victoria_falls_banner.png", gallery: [], features: [], published: false, updatedAt: new Date("2000-01-01") } });
  assert.equal(await getService(content.slug), null);
  await db.$executeRaw`UPDATE "Service" SET "published" = true, "title" = ${"Edited fixture"} WHERE "id" = ${content.id}`;
  const edited = await getService(content.slug);
  assert.equal(edited.title, "Edited fixture");
  assert.ok(edited.updatedAt > new Date("2001-01-01"));
  await db.service.delete({ where: { id: content.id } });
  const phone = `2637${Date.now().toString().slice(-8)}`;
  async function inbound(id) {
    const body = JSON.stringify({ entry: [{ changes: [{ value: { contacts: [{ wa_id: phone, profile: { name: "Integration fixture" } }], messages: [{ id, from: phone, type: "text", text: { body: "Thread fixture" } }] } }] }] });
    return POST(new Request("https://example.com/api/webhooks/whatsapp", { method: "POST", headers: { "Content-Type": "application/json", "x-hub-signature-256": `sha256=${createHmac("sha256", process.env.WHATSAPP_APP_SECRET).update(body).digest("hex")}` }, body }));
  }
  const ids = Array.from({ length: 3 }, () => `wamid.test.${randomUUID()}`);
  const responses = await Promise.all(ids.map(inbound));
  responses.forEach(response => assert.equal(response.status, 200));
  const contact = await db.contact.findUniqueOrThrow({ where: { phone }, include: { conversation: { include: { messages: true } } } });
  assert.equal(contact.conversation.messages.length, 3);
  assert.ok(contact.conversation.leadId);
  assert.equal((await (await inbound(ids[0])).json()).duplicates, 1);
  assert.equal(await db.lead.count({ where: { phone } }), 1);
  console.log("Database integration passed: concurrent lead idempotency, durable pending work, configuration recovery with one mocked provider call, signed webhook persistence, duplicate handling and shared conversation grouping. No real provider sends.");
}
run().catch(error => { console.error("Isolated integration failed", { type: error.name }); process.exitCode = 1; }).finally(() => db.$disconnect());
