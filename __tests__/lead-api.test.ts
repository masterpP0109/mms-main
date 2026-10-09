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

  it("accepts a quote builder submission", async () => {
    mockedCreateLead.mockResolvedValue({ id: "quote_1", duplicate: false, notified: true });
    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ada", email: "ada@example.com", goal: "brand", audience: "digital-first", timeline: "soon", details: "Campaign" }),
    }));
    expect(response.status).toBe(200);
    expect(mockedCreateLead).toHaveBeenCalledWith(expect.objectContaining({ source: "project_builder", projectType: "brand", message: "Campaign" }), null);
    await expect(response.json()).resolves.toMatchObject({ saved: true, notificationStatus: "accepted" });
  });

  it("rejects invalid input before persistence", async () => {
    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "", email: "bad", message: "" }),
    }));
    expect(response.status).toBe(422);
    expect(mockedCreateLead).not.toHaveBeenCalled();
  });

  it("returns saved success when email requires retry", async () => {
    mockedCreateLead.mockResolvedValue({ id: "lead_2", duplicate: false, notified: false });
    const response = await POST(new Request("http://localhost/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Grace Hopper", email: "grace@example.com", message: "Production enquiry" }),
    }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true, saved: true, notificationStatus: "pending_retry" });
  });
});
