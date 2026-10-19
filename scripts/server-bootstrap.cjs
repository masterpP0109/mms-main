/* eslint-disable @typescript-eslint/no-require-imports -- shared bootstrap for local server-only CLIs. */
const path = require("node:path");
const fs = require("node:fs");
const ts = require("typescript");
const Module = require("node:module");
const loaded = require("@next/env").loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production", { info() {}, error() {} });
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith("@/") ? path.join(process.cwd(), name.slice(2)) : name, ...args); };
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);

function smtpEnvironmentReport() {
  const local = loaded.loadedEnvFiles.find(file => file.path === ".env.local");
  return {
    loadedFiles: loaded.loadedEnvFiles.map(file => file.path),
    settings: ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASSWORD", "CONTACT_EMAIL_TO"].map(name => ({
      name, present: Boolean(process.env[name]),
      matchesLocalFile: Boolean(local?.env[name]) && local.env[name] === process.env[name],
    })),
  };
}
module.exports = { smtpEnvironmentReport };
