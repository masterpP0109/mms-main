import "server-only";
import { z } from "zod";
import { sendEmail } from "@/lib/email/smtp";
import { renderEnquiryEmail, type EmailLead } from "@/lib/email/templates";

export async function sendCustomerAcknowledgement(lead: EmailLead) {
  const email = z.email().parse(lead.email);
  return sendEmail({ leadId: lead.id, kind: "acknowledgement", to: email, ...renderEnquiryEmail(lead, "customer") });
}
