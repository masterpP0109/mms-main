import { submitReview, getApprovedReviews } from "@/lib/reviews";
import { errorResponse, parseJson } from "@/lib/http";
import { reviewSubmissionSchema } from "@/lib/validation/reviews";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const data = await parseJson(request, reviewSubmissionSchema);
    const result = await submitReview(data);

    return Response.json(
      {
        success: true,
        saved: true,
        submissionId: result.id,
        reference: result.reference,
        status: result.status,
        message: "Thank you for sharing your experience! Your review has been received and will be published following moderation.",
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const service = url.searchParams.get("service")?.trim() || undefined;
    const featuredOnly = url.searchParams.get("featured") === "true";
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 20), 1), 50);

    const reviews = await getApprovedReviews({ service, featuredOnly, limit });

    return Response.json(
      { success: true, reviews },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
