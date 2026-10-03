/** @jest-environment node */
jest.mock("server-only", () => ({}), { virtual: true });
import { sendLeadEmail } from "@/lib/providers/email";

describe("SendLayer REST adapter", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;
  const fetchMock = jest.fn();
  beforeEach(() => {
    process.env = { ...originalEnv, DATABASE_URL: "postgresql://test:test@localhost:5432/test", SENDLAYER_API_KEY: "test-key", MMS_FROM_EMAIL: "website@example.com", MMS_NOTIFICATION_EMAIL: "team@example.com" };
    global.fetch = fetchMock;
    fetchMock.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());
  afterAll(() => { process.env = originalEnv; global.fetch = originalFetch; });
  it("sends escaped complete conference details with Reply-To", async () => {
    fetchMock.mockResolvedValue(Response.json({ MessageID: "email_1" }));
    await expect(sendLeadEmail({ id: "lead_1", source: "conference", name: "Ada", email: "ada@example.com", message: "A <safe> enquiry", metadata: { date: "2026-12-01", delegates: "200", venue: "Harare", services: ["Sound", "Video"] } })).resolves.toBe("email_1");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://console.sendlayer.com/api/v1/email");
    expect(options.headers.Authorization).toBe("Bearer test-key");
    const body = JSON.parse(options.body);
    expect(body.To).toEqual([{ name: "MMS Team", email: "team@example.com" }]);
    expect(body.ReplyTo).toEqual([{ name: "Ada", email: "ada@example.com" }]);
    expect(body.HTMLContent).toContain("A &lt;safe&gt; enquiry");
    for (const value of ["2026-12-01", "200", "Harare", "Sound, Video", "/conference-production"]) expect(body.PlainContent).toContain(value);
  });
  it.each([Response.json({ Errors: [{ Code: 13, Message: "private detail" }] }), Response.json({}, { status: 429 })])("rejects provider failures safely", async (response) => {
    fetchMock.mockResolvedValue(response);
    await expect(sendLeadEmail({ id: "lead_1", source: "contact", name: "Ada", email: "ada@example.com", message: "Hello" })).rejects.toThrow("Email provider rejected");
    expect(JSON.stringify(jest.mocked(console.error).mock.calls)).not.toContain("private detail");
  });
  it("rejects network errors safely", async () => {
    fetchMock.mockRejectedValue(new Error("private credentials"));
    await expect(sendLeadEmail({ id: "lead_1", source: "contact", name: "Ada", email: "ada@example.com", message: "Hello" })).rejects.toThrow("Email provider rejected");
  });
});
