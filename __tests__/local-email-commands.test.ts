/** @jest-environment node */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";

it.each([
  ["scripts/smtp.cjs", "send"],
  ["scripts/test-titan-smtp.cjs"],
])("refuses %s without explicit send confirmation", (...args) => {
  const result = spawnSync(process.execPath, ["--conditions=react-server", ...args], {
    encoding: "utf8", timeout: 15000, windowsHide: true,
    // Keep these negative tests unable to authenticate even if a gate regresses.
    env: { ...process.env, SMTP_PASSWORD: "", DATABASE_URL: "postgresql://test:test@127.0.0.1/unused_test" },
  });
  expect(result.error).toBeUndefined();
  expect(result.status).toBe(1);
  expect(result.stderr).toContain("--confirm-send");
  expect(result.stdout).not.toContain('"stage":"verify"');
  expect(result.stdout).not.toContain('"accepted":true');
});

async function runContactTool(checkOnly: boolean, accepted = true) {
  const verifySmtp = jest.fn().mockResolvedValue(undefined);
  const checkDatabase = jest.fn().mockResolvedValue({ passed: true });
  const notifyLead = jest.fn().mockResolvedValue(true);
  const findUniqueOrThrow = jest.fn()
    .mockResolvedValueOnce({ name: "MMS LOCAL TITAN SMTP TEST", email: "mms-local-smtp-test@example.com", message: "CLEARLY LABELLED LOCAL SMTP CONTACT-ENDPOINT TEST. Not a customer enquiry.", emailStatus: accepted ? "accepted" : "pending" })
    .mockResolvedValueOnce({ emailStatus: accepted ? "accepted" : "reconciliation_required", emailProviderId: accepted ? "<mms-lead-fixture_1@mosimediasolutions.com>" : null });
  const writes = jest.fn();
  const fileSystem = { existsSync: () => false, mkdirSync: jest.fn(), openSync: jest.fn(() => 1), closeSync: jest.fn(), writeFileSync: writes };
  const output: string[] = [];
  const contextProcess = { argv: ["node", "tool", checkOnly ? "--check-only" : "--confirm-send", "http://localhost:3300"], cwd: () => process.cwd(), exitCode: 0 };
  const fetchMock = jest.fn(async (url: URL, options?: { body?: string; headers?: { Origin?: string } }) => {
    let status = 200;
    if (url.pathname === "/api/leads") {
      const body = JSON.parse(options?.body || "{}");
      status = options?.headers?.Origin === "https://example.invalid" ? 403 : body.website || body.email === "invalid" ? 422 : 200;
    }
    return { status, ok: status === 200, body: { cancel: async () => {} }, json: async () => ({ saved: true, submissionId: "fixture_1", notificationStatus: accepted ? "accepted" : "pending_retry" }) };
  });
  const modules: Record<string, unknown> = {
    "node:fs": fileSystem, "node:path": path, "./server-bootstrap.cjs": {},
    "../lib/env.ts": { requireEmailEnv: () => ({ host: "smtp.titan.email", user: "info@mosimediasolutions.com", to: "info@mosimediasolutions.com", from: "info@mosimediasolutions.com" }) },
    "../lib/email/smtp.ts": { verifySmtp }, "../lib/email/errors.ts": { smtpFailure: () => ({ code: "EUNKNOWN" }) },
    "./check-db.cjs": { checkDatabase, safeDatabaseError: () => ({}) },
    "../lib/db.ts": { db: { lead: { findUniqueOrThrow }, $disconnect: async () => {} } },
    "../lib/leads.ts": { notifyLead },
  };
  await runInNewContext(readFileSync(path.join(process.cwd(), "scripts/test-titan-smtp.cjs"), "utf8"), {
    require: (name: string) => { if (!(name in modules)) throw new Error("Unexpected dependency"); return modules[name]; },
    process: contextProcess, console: { log: (value: string) => output.push(value), error: (value: string) => output.push(value) },
    fetch: fetchMock, URL, AbortSignal,
  });
  return { verifySmtp, checkDatabase, notifyLead, findUniqueOrThrow, writes, output: output.join("\n"), exitCode: contextProcess.exitCode, fetchMock };
}

it("tests the complete explicitly confirmed contact flow with mocked integrations and verifies SMTP provenance", async () => {
  const result = await runContactTool(false);
  expect(result.exitCode).toBe(0);
  expect(result.verifySmtp).toHaveBeenCalledTimes(1);
  expect(result.checkDatabase).toHaveBeenCalledTimes(1);
  expect(result.notifyLead).not.toHaveBeenCalled();
  expect(result.findUniqueOrThrow).toHaveBeenCalledTimes(2);
  expect(result.output).toContain('"smtpAccepted":true');
  expect(result.output).toContain('"persisted":true');
  expect(result.output).toContain('"inboxDeliveryConfirmed":false');
});

it("fails when the endpoint did not send, without independently sending a fallback email", async () => {
  const result = await runContactTool(false, false);
  expect(result.exitCode).toBe(1);
  expect(result.notifyLead).not.toHaveBeenCalled();
  expect(result.output).toContain('"smtpAccepted":false');
});

it("performs check-only requests without authenticating SMTP, writing state or submitting a valid enquiry", async () => {
  const result = await runContactTool(true);
  expect(result.exitCode).toBe(0);
  expect(result.verifySmtp).not.toHaveBeenCalled();
  expect(result.checkDatabase).not.toHaveBeenCalled();
  expect(result.notifyLead).not.toHaveBeenCalled();
  expect(result.writes).not.toHaveBeenCalled();
  expect(result.output).toContain('"enquirySubmitted":false');
  expect(result.output).toContain('"emailSent":false');
});
