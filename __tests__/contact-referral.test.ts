/** @jest-environment node */
import { spawnSync } from "node:child_process";
import { CONTACT_ORIGIN_PATTERN, contactReferral } from "@/lib/contact-referral";
import { contactLeadSchema } from "@/lib/validation/leads";

it.each(["/", "/services", "/services/event-production/", "/conference-production"])("preserves a valid referral path %s", origin => {
  expect(contactReferral(new URLSearchParams({ origin })).origin).toBe(origin);
});
it.each(["/Services", "/services?x=1", "https://example.com", "/a//b", "/" + "a".repeat(301)])("falls back safely for malformed referral %s", origin => {
  const referral = contactReferral(new URLSearchParams({ origin, service: "a".repeat(200) }));
  expect(referral).toEqual({ origin: "/contact", service: "a".repeat(160) });
  expect(contactLeadSchema.safeParse({ name: "Test Visitor", email: "fixture@example.com", message: "Referral fixture", ...referral }).success).toBe(true);
});
it("rejects raw invalid origin values at the API schema", () => {
  expect(contactLeadSchema.safeParse({ name: "Test Visitor", email: "fixture@example.com", message: "Referral fixture", origin: "/a//b" }).success).toBe(false);
});
it("rejects a long near-match without blocking the test process", () => {
  // Bound execution in a child: the previous ambiguous pattern would time out.
  const script = `console.log(new RegExp(${JSON.stringify(CONTACT_ORIGIN_PATTERN.source)}).test('/' + 'a'.repeat(40) + '!'))`;
  const result = spawnSync(process.execPath, ["-e", script], { timeout: 5000, encoding: "utf8", windowsHide: true });
  expect(result.error).toBeUndefined();
  expect(result.status).toBe(0);
  expect(result.stdout.trim()).toBe("false");
});
