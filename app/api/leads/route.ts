import { submitLead } from "@/lib/leads";
import { errorResponse, parseJson } from "@/lib/http";
import { contactLeadSchema, projectBriefSchema } from "@/lib/validation/leads";
import { scheduleLeadEmails } from "@/lib/schedule-lead-emails";
import { enquiryReference } from "@/lib/enquiry-reference";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const raw = await parseJson(request, contactLeadSchema.or(projectBriefSchema));
    const isBrief = "goal" in raw;
    const input = isBrief
      ? { source: "project_builder" as const, name: raw.name, email: raw.email, phone: raw.phone, projectType: raw.goal, message: raw.details || "Project brief submitted", metadata: { audience: raw.audience, timeline: raw.timeline } }
      : { source: "contact" as const, name: raw.name, email: raw.email, phone: raw.phone, organisation: raw.organisation, projectType: raw.projectType, message: raw.message, metadata: { service: raw.service, origin: raw.origin } };
    const result = await submitLead(input, request.headers.get("idempotency-key"));
    if (!result.duplicate) scheduleLeadEmails(result.id);
    return Response.json({ success: true, submissionId: result.id, reference: enquiryReference(result.id), duplicate: result.duplicate, saved: true, notificationStatus: result.notified ? "accepted" : "pending" }, { status: result.duplicate ? 200 : 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return errorResponse(error); }
}
