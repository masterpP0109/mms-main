/** @jest-environment node */

jest.mock("@/lib/leads", () => ({ createLead: jest.fn() }));

import { createLead } from "@/lib/leads";
import { POST } from "@/app/api/leads/route";

const mockedCreateLead = jest.mocked(createLead);

describe("lead API", () => {
  beforeEach(() => mockedCreateLead.mockReset());

  it("persists and returns a successful contact submission", async () => {
    mockedCreateLead.mockResolvedValue({ id: "lead_1", duplicate: false, notified: true });
    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": "request-1" },
      body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com", message: "Please quote our event." }),
    }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true, submissionId: "lead_1", duplicate: false });
    expect(mockedCreateLead).toHaveBeenCalledWith(expect.objectContaining({ source: "contact", email: "ada@example.com" }), "request-1");
  });

  it("rejects invalid input before persistence", async () => {
    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "", email: "bad", message: "" }),
    }));
    expect(response.status).toBe(422);
    expect(mockedCreateLead).not.toHaveBeenCalled();
  });

  it("returns accepted when the lead is saved but providers fail", async () => {
    mockedCreateLead.mockResolvedValue({ id: "lead_2", duplicate: false, notified: false });
    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Grace Hopper", email: "grace@example.com", message: "Production enquiry" }),
    }));
    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toMatchObject({ notificationPending: true });
  });
});
