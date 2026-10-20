import "server-only";
import { after } from "next/server";
import { processLeadEmails } from "@/lib/leads";

export function scheduleLeadEmails(id: string) {
  try { after(() => processLeadEmails(id)); }
  catch {
    // Persistence already succeeded. The authenticated worker owns recovery.
    console.error("Email background trigger unavailable; outbox retained", { leadId: id });
  }
}
