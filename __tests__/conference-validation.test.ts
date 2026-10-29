import { conferenceLeadSchema } from "@/lib/validation/leads";

const enquiry = { organisation: "Example organisation", contact: "Test Visitor", email: "visitor@example.com" };

it.each(["-1", "0", "2.5", "many", "1e3", "9007199254740992"])("rejects invalid delegate count %s before persistence", delegates => {
  expect(conferenceLeadSchema.safeParse({ ...enquiry, delegates }).success).toBe(false);
});

it.each([undefined, "", "25", "1000"])("allows optional or whole delegate count %s", delegates => {
  expect(conferenceLeadSchema.safeParse({ ...enquiry, delegates }).success).toBe(true);
});
