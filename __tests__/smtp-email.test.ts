/** @jest-environment node */
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("nodemailer", () => ({ __esModule: true, default: { createTransport: jest.fn() } }));
import nodemailer from "nodemailer";
import { sendLeadEmail } from "@/lib/providers/email";
import { sendCustomerAcknowledgement } from "@/lib/providers/acknowledgement";
import { sendEmail, verifySmtp } from "@/lib/email/smtp";
import { SmtpNotificationError, smtpFailure } from "@/lib/email/errors";

const sendMail = jest.fn();
const verify = jest.fn();
const close = jest.fn();
const lead = { id: "lead_1", createdAt: new Date("2026-10-09T10:00:00Z"), source: "conference" as const, name: "Ada", email: "ada@example.com", message: "A <safe> enquiry", metadata: { date: "2026-12-01", delegates: "200", venue: "Harare", services: ["Sound", "Video"] } };
const accepted = { messageId: "<fixture@example.com>", accepted: ["team@example.com"], rejected: [], response: "250 2.0.0 queued" };

describe("Titan SMTP notifications", () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv, SMTP_HOST: "smtp.titan.email", SMTP_PORT: "465", SMTP_USER: "website@example.com", SMTP_PASSWORD: "smtp-test-fixture", CONTACT_EMAIL_TO: "team@example.com" };
    sendMail.mockReset().mockResolvedValue(accepted);
    verify.mockReset().mockResolvedValue(true);
    close.mockReset();
    jest.mocked(nodemailer.createTransport).mockReset().mockReturnValue({ sendMail, verify, close } as unknown as ReturnType<typeof nodemailer.createTransport>);
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => { process.env = originalEnv; jest.restoreAllMocks(); });
  it("sends acknowledgement only to the submitted email from the authenticated mailbox", async () => {
    sendMail.mockResolvedValue({ ...accepted, accepted: [lead.email] });
    await expect(sendCustomerAcknowledgement(lead)).resolves.toBe(accepted.messageId);
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: lead.email, from: { name: "Mosi Media Solutions", address: "website@example.com" }, replyTo: "website@example.com", messageId: "<mms-ack-lead_1@example.com>" }));
    expect(sendMail.mock.calls[0][0].text).toContain("Your enquiry has been saved");
  });
  it("rejects an invalid acknowledgement recipient before SMTP send", async () => {
    await expect(sendCustomerAcknowledgement({ ...lead, email: "bad\r\nBcc: other@example.com" })).rejects.toThrow();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("awaits SMTP acceptance and preserves escaped templates and validated Reply-To", async () => {
    await expect(sendLeadEmail(lead)).resolves.toBe(accepted.messageId);
    const [body] = sendMail.mock.calls[0];
    expect(body.to).toBe("team@example.com");
    expect(body.from).toEqual({ name: "Mosi Media Solutions", address: "website@example.com" });
    expect(body.replyTo).toBe("ada@example.com");
    expect(body.html).toContain("A &lt;safe&gt; enquiry");
    for (const value of ["2026-12-01", "200", "Harare", "Sound, Video", "lead_1", lead.createdAt.toISOString()]) expect(body.text).toContain(value);
    expect(body.messageId).toBe("<mms-lead-lead_1@example.com>");
    expect(close).toHaveBeenCalledTimes(1);
  });
  it("verifies using implicit TLS on 465 with certificate verification and no protocol logging", async () => {
    await verifySmtp();
    expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: "smtp.titan.email", port: 465, secure: true,
      auth: { user: "website@example.com", pass: "smtp-test-fixture" },
      tls: { rejectUnauthorized: true, minVersion: "TLSv1.2", servername: "smtp.titan.email" },
      logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true,
    }));
    expect(verify).toHaveBeenCalledTimes(1);
    expect(sendMail).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalledTimes(1);
  });
  it("waits for the send promise before returning acceptance", async () => {
    let resolveSend!: (value: typeof accepted) => void;
    sendMail.mockReturnValue(new Promise(resolve => { resolveSend = resolve; }));
    let completed = false;
    const pending = sendLeadEmail(lead).then(() => { completed = true; });
    await Promise.resolve();
    expect(completed).toBe(false);
    resolveSend(accepted);
    await pending;
    expect(completed).toBe(true);
  });
  it.each([
    { ...accepted, accepted: [] }, { ...accepted, accepted: ["another@example.com"] },
    { ...accepted, rejected: ["team@example.com"] }, { ...accepted, messageId: "" }, { ...accepted, response: "450 rejected" },
  ])("never reports success without recipient acceptance and a final positive response", async result => {
    sendMail.mockResolvedValue(result);
    await expect(sendLeadEmail(lead)).rejects.toMatchObject({ code: "EACCEPTANCE", retrySafe: false });
  });
  it("records explicit auth rejection without logging credentials or raw messages", async () => {
    sendMail.mockRejectedValue({ code: "EAUTH", responseCode: 535, command: "AUTH private credentials", message: "smtp-test-fixture ada@example.com" });
    await expect(sendLeadEmail(lead)).rejects.toMatchObject({ code: "EAUTH", responseCode: 535, retrySafe: true });
    expect(JSON.stringify(jest.mocked(console.error).mock.calls)).not.toMatch(/private credentials|ada@example|smtp-test-fixture/);
    expect(close).toHaveBeenCalledTimes(1);
  });
  it("requires reconciliation for connection loss after DATA", async () => {
    sendMail.mockRejectedValue({ code: "ETIMEDOUT", command: "DATA", message: "private provider details" });
    await expect(sendLeadEmail(lead)).rejects.toMatchObject({ code: "ETIMEDOUT", retrySafe: false });
  });
  it("does not replay a generic connection failure after DATA", () => {
    expect(smtpFailure({ code: "ECONNECTION", command: "DATA" }).retrySafe).toBe(false);
  });
  it("sanitizes unknown errors and closes failed verification", async () => {
    verify.mockRejectedValue(new Error("private credentials"));
    await expect(verifySmtp()).rejects.toThrow("SMTP notification not accepted (EUNKNOWN)");
    expect(close).toHaveBeenCalledTimes(1);
  });
  it.each(["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "CONTACT_EMAIL_TO"])("requires %s without opening a connection", async key => {
    delete process.env[key];
    await expect(sendLeadEmail(lead)).rejects.toMatchObject({ code: "ECONFIG", retrySafe: true });
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
  it.each(["587", "25", "invalid"])("rejects unsupported port %s", async port => {
    process.env.SMTP_PORT = port;
    await expect(verifySmtp()).rejects.toBeInstanceOf(SmtpNotificationError);
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
  it("rejects a setting that would disable implicit TLS", async () => {
    process.env.SMTP_SECURE = "false";
    await expect(verifySmtp()).rejects.toMatchObject({ code: "ECONFIG" });
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
  it("preserves whitespace in the local password", async () => {
    process.env.SMTP_PASSWORD = " fixture with spaces ";
    await verifySmtp();
    expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({ auth: { user: "website@example.com", pass: " fixture with spaces " } }));
  });
  it.each([undefined, "invalid\r\nBcc: other@example.com"])("omits invalid or absent Reply-To", async email => {
    await sendLeadEmail({ ...lead, email, phone: "+263788111391" });
    expect(sendMail.mock.calls[0][0].replyTo).toBeUndefined();
  });
  it("removes header newlines without changing the template body", async () => {
    await sendEmail({ leadId: "test", subject: "Enquiry\r\nBcc: injected", text: "fixture", html: "<p>fixture</p>" });
    expect(sendMail.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });
  it("exposes only allowlisted error codes", () => {
    expect(smtpFailure({ code: "private-value", responseCode: 999, command: "private command" })).toMatchObject({ code: "EUNKNOWN", responseCode: undefined, retrySafe: false });
    expect(smtpFailure({ code: "ESOCKET", command: "CONN" }).retrySafe).toBe(false);
  });
  it("requires reconciliation when Nodemailer reports a lost connection as CONN", () => {
    expect(smtpFailure({ code: "ECONNECTION", command: "CONN" }).retrySafe).toBe(false);
    expect(smtpFailure({ code: "ETIMEDOUT", command: "CONN" }).retrySafe).toBe(false);
  });
});
