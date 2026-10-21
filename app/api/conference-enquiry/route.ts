import { submitLead } from "@/lib/leads";
import { errorResponse, parseJson } from "@/lib/http";
import { conferenceLeadSchema } from "@/lib/validation/leads";
import { scheduleLeadEmails } from "@/lib/schedule-lead-emails";
import { enquiryReference } from "@/lib/enquiry-reference";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, conferenceLeadSchema);
    const result = await submitLead({
      source: "conference", name: body.contact, email: body.email, phone: body.phone,
      organisation: body.organisation, projectType: body.eventType,
      message: body.details || "Conference proposal requested",
      metadata: { date: body.date, delegates: body.delegates, venue: body.venue, organisationType: body.organisationType, services: body.services },
    }, request.headers.get("idempotency-key"));
    if (!result.duplicate) scheduleLeadEmails(result.id);
    return Response.json({ success: true, submissionId: result.id, reference: enquiryReference(result.id), duplicate: result.duplicate, saved: true, notificationStatus: result.notified ? "accepted" : "pending" }, { status: result.duplicate ? 200 : 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return errorResponse(error); }
}
