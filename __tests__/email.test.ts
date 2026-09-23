/** @jest-environment node */

const sendMock = jest.fn();
jest.mock("resend", () => ({ Resend: jest.fn(() => ({ emails: { send: sendMock } })) }));

import { sendLeadEmail } from "@/lib/providers/email";

describe("Resend email adapter", () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv, DATABASE_URL: "postgresql://test:test@localhost:5432/test", RESEND_API_KEY: "re_test", EMAIL_FROM: "MMS <website@example.com>", LEAD_NOTIFICATION_EMAIL: "team@example.com" };
    sendMock.mockReset();
  });
  afterAll(() => { process.env = originalEnv; });

  it("sends a lead notification and returns the provider ID", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_1" }, error: null });
    await expect(sendLeadEmail({ id: "lead_1", source: "contact", name: "Ada", email: "ada@example.com", message: "A <safe> enquiry" })).resolves.toBe("email_1");
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ to: ["team@example.com"], replyTo: "ada@example.com", headers: { "X-Entity-Ref-ID": "lead_1" } }));
    expect(sendMock.mock.calls[0][0].html).toContain("A &lt;safe&gt; enquiry");
  });

  it("surfaces a safe error when Resend rejects the notification", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "provider detail" } });
    await expect(sendLeadEmail({ id: "lead_1", source: "contact", name: "Ada", email: "ada@example.com", message: "Hello" })).rejects.toThrow("Email provider rejected");
  });
});
