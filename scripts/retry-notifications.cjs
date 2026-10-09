/* eslint-disable @typescript-eslint/no-require-imports -- CLI uses CommonJS to load the shared TypeScript server modules. */
// Run with node --conditions=react-server scripts/retry-notifications.cjs LEAD_ID
const path = require("node:path");
const fs = require("node:fs");
const ts = require("typescript");
const Module = require("node:module");
require("@next/env").loadEnvConfig(process.cwd());
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith("@/") ? path.join(process.cwd(), name.slice(2)) : name, ...args);
};
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { db } = require("../lib/db.ts");
const { notifyLead } = require("../lib/leads.ts");
(async () => {
  const id = process.argv[2];
  if (!id) throw new Error("Supply a lead ID reviewed for retry");
  const lead = await db.lead.findUniqueOrThrow({ where: { id } });
  if (!["pending", "retry_required"].includes(lead.emailStatus)) throw new Error("Status requires reconciliation or was already accepted; no send attempted");
  // Resend retains idempotency keys for 24 hours. Be conservative about ambiguous failures.
  if (Date.now() - lead.createdAt.getTime() > 23 * 3600000 && !process.argv.includes("--confirmed-not-accepted")) throw new Error("Older than safe retry window; reconcile Resend logs before a manual send");
  console.log({ leadId: id, accepted: await notifyLead(id) });
})().catch(() => { console.error("Retry blocked or failed; review lead status and Resend logs. No customer data logged."); process.exitCode = 1; }).finally(() => db.$disconnect());
