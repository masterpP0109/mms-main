import "server-only";
import { deliverEmail } from "@/lib/email/outbox";
import { sendCustomerAcknowledgement } from "@/lib/providers/acknowledgement";

/** Independent claim/status: repairing this channel never replays the staff email. */
export async function notifyCustomer(id: string) {
  return deliverEmail(id, "acknowledgement", sendCustomerAcknowledgement);
}
