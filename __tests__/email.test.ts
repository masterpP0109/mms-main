/** @jest-environment node */
jest.mock("server-only", () => ({}), { virtual: true });
jest.mock("resend", () => ({ Resend: jest.fn() }));
import { Resend } from "resend";
import { sendLeadEmail } from "@/lib/providers/email";
const send = jest.fn();
const lead = { id: "lead_1", createdAt: new Date("2026-10-09T10:00:00Z"), source: "conference" as const, name: "Ada", email: "ada@example.com", message: "A <safe> enquiry", metadata: { date: "2026-12-01", delegates: "200", venue: "Harare", services: ["Sound", "Video"] } };
describe("Resend notifications", () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv, DATABASE_URL: "postgresql://test:test@localhost/test", RESEND_API_KEY: "test-key", MMS_FROM_EMAIL: "website@example.com", MMS_NOTIFICATION_EMAIL: "team@example.com" };
    send.mockReset();
    jest.mocked(Resend).mockImplementation(() => ({ emails: { send } }) as unknown as Resend);
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => { process.env = originalEnv; jest.restoreAllMocks(); });
  it("records acceptance and sends escaped complete details with Reply-To", async () => {
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
    await expect(sendLeadEmail(lead)).resolves.toBe("email_1");
    const [body, options] = send.mock.calls[0];
    expect(body.to).toEqual(["team@example.com"]);
    expect(body.from).toBe("website@example.com");
    expect(body.replyTo).toBe("ada@example.com");
    expect(body.html).toContain("A &lt;safe&gt; enquiry");
    for (const value of ["2026-12-01", "200", "Harare", "Sound, Video", "lead_1", lead.createdAt.toISOString()]) expect(body.text).toContain(value);
    expect(options).toMatchObject({ idempotencyKey: "mms-lead/lead_1" });
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });
  it.each([{ data: null, error: { statusCode: 429, message: "private detail" } }, { data: null, error: null }])("handles provider failures safely", async response => {
    send.mockResolvedValue(response);
    await expect(sendLeadEmail(lead)).rejects.toThrow("Email provider rejected");
    expect(JSON.stringify(jest.mocked(console.error).mock.calls)).not.toMatch(/private detail|ada@example|test-key/);
  });
  it("sanitizes transport errors", async () => {
    send.mockRejectedValue(new Error("private credentials"));
    await expect(sendLeadEmail(lead)).rejects.toThrow("Email provider rejected");
  });
  it.each(["RESEND_API_KEY", "MMS_FROM_EMAIL", "MMS_NOTIFICATION_EMAIL"])("requires %s", async key => {
    delete process.env[key];
    await expect(sendLeadEmail(lead)).rejects.toThrow("not configured");
    expect(send).not.toHaveBeenCalled();
  });
  it("notifies for phone-only enquiries without invalid Reply-To", async () => {
    send.mockResolvedValue({ data: { id: "email_2" } });
    await sendLeadEmail({ ...lead, email: undefined, phone: "+263788111391" });
    expect(send.mock.calls[0][0].replyTo).toBeUndefined();
  });
});
