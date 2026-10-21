/** @jest-environment node */
import { renderEnquiryEmail, zimbabweWhatsAppLink } from "@/lib/email/templates";
const lead = { id: "fixture_1", createdAt: new Date("2026-10-20T10:00:00Z"), source: "project_builder" as const, name: "Ada <script>alert(1)</script>", email: "ada@example.com", phone: "+263788111391", projectType: "brand", message: "First line\nA <safe> enquiry & full details", metadata: { audience: "digital-first", timeline: "soon", origin: "/#builder", debug: "private-debug-value" } };
it.each(["mms", "customer"] as const)("renders branded, escaped and responsive %s email", audience => {
  const email = renderEnquiryEmail(lead, audience);
  expect(email.html).toContain('name="viewport"');
  expect(email.html).toContain("#c5a880");
  expect(email.html).not.toContain("<script>");
  expect(email.html).toContain("&lt;script&gt;");
  for (const value of ["MMS-fixture_1", lead.email, lead.phone, "Brand Campaign", "Soon (1–3 months)", "info@mosimediasolutions.com"]) expect(email.text).toContain(value);
  if (audience === "mms") for (const value of ["Digital-First", lead.message]) expect(email.text).toContain(value);
  expect(email.text).not.toContain("private-debug-value");
  expect(email.text).not.toContain(lead.createdAt.toISOString());
});
it("keeps technical references in the internal footer and out of customer content", () => {
  const customer = renderEnquiryEmail(lead, "customer");
  expect(customer.text).toContain("Hello Ada");
  expect(customer.text).toContain("Please keep your enquiry reference when contacting us: MMS-fixture_1.");
  expect(customer.text).not.toMatch(/builder|Source page|Submitted|Internal reference/);
  const internal = renderEnquiryEmail(lead, "mms");
  expect(internal.text).toContain("20 October 2026 at 12:00 (Zimbabwe, UTC+2)");
  expect(internal.text).toContain("Source page: /#builder");
  expect(internal.html.indexOf("Internal reference details")).toBeGreaterThan(internal.html.indexOf("Contact client on WhatsApp"));
});
it("includes useful conference details in both versions", () => {
  for (const audience of ["mms", "customer"] as const) {
    const email = renderEnquiryEmail({ ...lead, source: "conference", projectType: "Summit", metadata: { date: "2026-12-01", venue: "Harare", delegates: "200", services: ["Sound", "Video"] } }, audience);
    for (const value of ["2026-12-01", "Sound, Video"]) expect(email.text).toContain(value);
    if (audience === "mms") for (const value of ["Harare", "200", "Summit"]) expect(email.text).toContain(value);
  }
});
it.each(["0788 111 391", "+263 (788) 111-391", "00263788111391", "263788111391"])("normalizes an unambiguous Zimbabwe mobile number: %s", phone => {
  expect(zimbabweWhatsAppLink(phone)).toBe("https://wa.me/263788111391");
});
it.each([undefined, "788111391", "+44788111391", "+2630788111391", "263799111391", "078811139", "0788111391<script>", "077123456789"])("omits invalid or ambiguous WhatsApp numbers: %s", phone => {
  expect(zimbabweWhatsAppLink(phone)).toBeUndefined();
});
it("preserves long messages safely with mobile wrapping", () => {
  const email = renderEnquiryEmail({ ...lead, message: "x".repeat(5000) }, "mms");
  expect(email.html).toContain("overflow-wrap:anywhere");
  expect(email.text).toContain("x".repeat(5000));
  expect(email.html).toContain("max-width:640px");
});
it("excludes unneeded message text and extra fields from customer acknowledgements", () => {
  const email = renderEnquiryEmail({ ...lead, message: "Untrusted message with https://untrusted.example", metadata: { ...lead.metadata, venue: "Private venue" } }, "customer");
  expect(email.text).not.toContain("https://untrusted.example");
  expect(email.text).not.toContain("Private venue");
  expect(email.text).not.toContain("Digital-First");
  expect(email.text).toContain(lead.email);
  expect(email.text).toContain(lead.phone);
});
