/** @jest-environment node */
jest.mock("@/lib/schedule-lead-emails", () => ({ scheduleLeadEmails: jest.fn() }));
jest.mock("@/lib/leads", () => ({ submitLead: jest.fn() }));

import { POST } from "@/app/api/leads/route";
import { submitLead } from "@/lib/leads";
import { scheduleLeadEmails } from "@/lib/schedule-lead-emails";
import { packageLeadSchema } from "@/lib/validation/leads";
import { packageExperiences } from "@/lib/packages";
import { renderEnquiryEmail } from "@/lib/email/templates";

const base = { kind: "package", category: "weddings", packageId: "intimate", name: "Package Visitor", email: "visitor@example.com", date: "2027-05-10", details: "Venue and coverage to discuss", attribution: { utm_source: "newsletter", utm_campaign: "signature", landingPage: "/packages" } };
function request(body: unknown) { return new Request("https://example.com/api/leads", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": "package-request" }, body: JSON.stringify(body) }); }
beforeEach(() => { jest.clearAllMocks(); jest.mocked(submitLead).mockResolvedValue({ id: "package_fixture", duplicate: false, notified: false }); });

it.each(packageExperiences)("saves $title through the existing lead and notification workflow", async experience => {
  const response = await POST(request({ ...base, category: experience.slug, packageId: experience.options[0].id }));
  expect(response.status).toBe(201);
  expect(submitLead).toHaveBeenCalledWith(expect.objectContaining({ source: "contact", projectType: experience.slug, message: base.details,
    metadata: expect.objectContaining({ service: experience.service, packageName: experience.options[0].name, packageId: experience.options[0].id, date: base.date, origin: `/packages/${experience.slug}`, utm_campaign: "signature" }) }), "package-request");
  expect(scheduleLeadEmails).toHaveBeenCalledWith("package_fixture");
  expect(await response.json()).toMatchObject({ saved: true, notificationStatus: "pending" });
});

it.each([
  { packageId: "aerial-stills" }, { category: "unknown" }, { date: "2027-02-30" },
  { attribution: { unexpected: "field" } }, { attribution: { landingPage: "https://external.example" } },
  { website: "bot" }, { details: "x".repeat(5001) }, { email: "invalid" },
])("rejects invalid package context before persistence: %j", async overrides => {
  expect((await POST(request({ ...base, ...overrides }))).status).toBe(422);
  expect(submitLead).not.toHaveBeenCalled();
});

it("accepts a flexible date and tailored option without inventing scope", () => {
  expect(packageLeadSchema.safeParse({ ...base, packageId: "tailored", date: undefined }).success).toBe(true);
});
it("does not schedule duplicate enquiries again", async () => {
  jest.mocked(submitLead).mockResolvedValue({ id: "package_fixture", duplicate: true, notified: true });
  const response = await POST(request(base));
  expect(response.status).toBe(200);
  expect(scheduleLeadEmails).not.toHaveBeenCalled();
});
it("returns a retryable error without claiming persistence when storage fails", async () => {
  jest.mocked(submitLead).mockRejectedValue(new Error("Unavailable"));
  expect((await POST(request(base))).status).toBe(500);
  expect(scheduleLeadEmails).not.toHaveBeenCalled();
});
it("includes package and date in both email audiences, with attribution internal only", () => {
  const lead = { id: "package_fixture", source: "contact" as const, name: base.name, email: base.email, message: base.details, createdAt: new Date(), metadata: { service: "Wedding Photography & Film", packageName: "Intimate Story", date: base.date, ...base.attribution } };
  for (const audience of ["mms", "customer"] as const) {
    const email = renderEnquiryEmail(lead, audience);
    expect(email.text).toContain("Intimate Story");
    expect(email.text).toContain(base.date);
    if (audience === "mms") expect(email.text).toContain("utm_campaign: signature");
    else { expect(email.text).not.toContain("signature"); expect(email.text).not.toContain(base.details); }
  }
});
