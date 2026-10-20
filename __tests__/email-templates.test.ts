/** @jest-environment node */
import { renderEnquiryEmail } from "@/lib/email/templates";
const lead = { id: "mms_fixture_1", createdAt: new Date("2026-10-20T10:00:00Z"), source: "project_builder" as const, name: "Ada <script>alert(1)</script>", email: "ada@example.com", phone: "+263788111391", projectType: "brand", message: "First line\nA <safe> enquiry & full details", metadata: { audience: "digital-first", timeline: "soon" } };
it.each(["mms", "customer"] as const)("renders complete branded %s HTML and text with builder labels", audience => {
  const email = renderEnquiryEmail(lead, audience);
  expect(email.html).toContain('name="viewport"');
  expect(email.html).toContain("#c5a880");
  expect(email.html).not.toContain("<script>");
  expect(email.html).toContain("&lt;script&gt;");
  for (const value of [lead.id, lead.createdAt.toISOString(), lead.email, lead.phone, "Brand Campaign", "Digital-First", "Soon (1–3 months)", lead.message, "info@mosimediasolutions.com"]) expect(email.text).toContain(value);
  expect(email.text).not.toMatch(/24 hours|already read|has seen/i);
});
it("includes all provided conference details in both versions", () => {
  for (const audience of ["mms", "customer"] as const) {
    const email = renderEnquiryEmail({ ...lead, source: "conference", projectType: "Summit", metadata: { date: "2026-12-01", venue: "Harare", delegates: "200", services: ["Sound", "Video"] } }, audience);
    for (const value of ["2026-12-01", "Harare", "200", "Sound, Video", "Summit"]) expect(email.text).toContain(value);
  }
});
it("preserves very long messages safely and uses mobile wrapping", () => {
  const email = renderEnquiryEmail({ ...lead, message: "x".repeat(5000) }, "customer");
  expect(email.html).toContain("overflow-wrap:anywhere");
  expect(email.text).toContain("x".repeat(5000));
  expect(email.html).toContain("max-width:640px");
});
