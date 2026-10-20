import "server-only";
import { sendEmail } from "@/lib/email/smtp";
import type { LeadInput } from "@/lib/validation/leads";
import { renderEnquiryEmail } from "@/lib/email/templates";

export async function sendLeadEmail(lead: LeadInput & { id: string; createdAt: Date }) {
  return sendEmail({
    leadId: lead.id,
    replyTo: lead.email ? { name: lead.name, email: lead.email } : undefined,
    ...renderEnquiryEmail(lead, "mms"),
  });
}
