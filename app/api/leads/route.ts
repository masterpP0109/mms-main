import { createLead } from "@/lib/leads";
import { errorResponse, parseJson } from "@/lib/http";
import { contactLeadSchema, projectBriefSchema } from "@/lib/validation/leads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const raw = await parseJson(request, contactLeadSchema.or(projectBriefSchema));
    const isBrief = "goal" in raw;
    const input = isBrief
      ? { source: "project_builder" as const, name: raw.name, email: raw.email, phone: raw.phone, projectType: raw.goal, message: raw.details || "Project brief submitted", metadata: { audience: raw.audience, timeline: raw.timeline } }
      : { source: "contact" as const, name: raw.name, email: raw.email, phone: raw.phone, projectType: raw.projectType, message: raw.message };
    const result = await createLead(input, request.headers.get("idempotency-key"));
    return Response.json({ success: true, submissionId: result.id, duplicate: result.duplicate, notificationPending: !result.notified }, { status: result.notified || result.duplicate ? 200 : 202 });
  } catch (error) { return errorResponse(error); }
}
