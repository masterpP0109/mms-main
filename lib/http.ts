import { ZodError, type ZodType } from "zod";

export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) throw new RequestError(415, "Content-Type must be application/json");
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new RequestError(403, "Invalid origin");
  if (Number(request.headers.get("content-length")) > 20000) throw new RequestError(413, "Submission too large");
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new RequestError(400, "Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 20000) { await reader.cancel(); throw new RequestError(413, "Submission too large"); }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError(400, "Malformed JSON body");
  }
  try { return schema.parse(body); } catch (error) {
    if (error instanceof ZodError) throw new RequestError(422, "Invalid submission", error.flatten().fieldErrors);
    throw error;
  }
}

export class RequestError extends Error {
  constructor(public status: number, message: string, public fields?: Record<string, string[] | undefined>) { super(message); }
}

export function errorResponse(error: unknown) {
  if (error instanceof RequestError) return Response.json({ error: "We couldn't send your enquiry right now. Please try again or contact Mosi Media Solutions directly." }, { status: error.status });
  console.error("Lead request failed", { error: error instanceof Error ? error.message : "Unknown error" });
  return Response.json({ error: "We couldn't send your enquiry right now. Please try again or contact Mosi Media Solutions directly." }, { status: 500 });
}
