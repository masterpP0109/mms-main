import { getAdminReviews, updateReview, deleteReview, getReviewMetrics } from "@/lib/reviews";
import { errorResponse, parseJson } from "@/lib/http";
import { reviewModerationSchema } from "@/lib/validation/reviews";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  id: z.string().min(1),
  updates: reviewModerationSchema,
}).strict();

const deleteSchema = z.object({
  id: z.string().min(1),
}).strict();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const rating = Number(url.searchParams.get("rating")) || 0;
    const service = url.searchParams.get("service") || "all";
    const search = url.searchParams.get("search") || "";
    const take = Math.min(Math.max(Number(url.searchParams.get("limit") || 50), 1), 100);
    const skip = Math.max(Number(url.searchParams.get("offset") || 0), 0);

    const [reviewsData, metrics] = await Promise.all([
      getAdminReviews({ status, rating, service, search, take, skip }),
      getReviewMetrics(),
    ]);

    return Response.json(
      {
        success: true,
        ...reviewsData,
        metrics,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, updates } = await parseJson(request, patchSchema);
    const updated = await updateReview(id, updates);

    return Response.json(
      { success: true, review: updated },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await parseJson(request, deleteSchema);
    await deleteReview(id);

    return Response.json(
      { success: true, id },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
