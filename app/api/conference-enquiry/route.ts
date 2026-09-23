import { createLead } from "@/lib/leads";
import { errorResponse, parseJson } from "@/lib/http";
import { conferenceLeadSchema } from "@/lib/validation/leads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await parseJson(request, conferenceLeadSchema);
    const result = await createLead({
      source: "conference", name: body.contact, email: body.email, phone: body.phone,
      organisation: body.organisation, projectType: body.eventType,
      message: body.details || "Conference proposal requested",
      metadata: { date: body.date, delegates: body.delegates, venue: body.venue, organisationType: body.organisationType, services: body.services },
    }, request.headers.get("idempotency-key"));
    return Response.json({ success: true, submissionId: result.id, duplicate: result.duplicate, notificationPending: !result.notified }, { status: result.notified || result.duplicate ? 200 : 202 });
  } catch (error) { return errorResponse(error); }
}
