import { Prisma } from "@prisma/client";
import { ZodError, type ZodType } from "zod";

/** Read exact bytes with a limit, including chunked bodies without Content-Length. */
export async function readBoundedBody(request: Request, limit = 20_000): Promise<Buffer> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > limit)) throw new RequestError(413, "Submission too large");
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new RequestError(413, "Submission too large");
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks);
  } finally { reader.releaseLock(); }
}

export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.split(";", 1)[0].trim().toLowerCase() !== "application/json") throw new RequestError(415, "Content-Type must be application/json");
  const origin = request.headers.get("origin");
  const target = new URL(request.url);
  // Next's Node adapter can construct request.url with localhost while the
  // browser used 127.0.0.1. Host is browser-controlled by the destination URL;
  // never trust a client-supplied X-Forwarded-Host for this same-origin check.
  const host = request.headers.get("host");
  if (host && !/^(?:[a-z0-9.-]+|\[[a-f0-9:]+\])(?::\d{1,5})?$/i.test(host)) throw new RequestError(400, "Invalid request host");
  let expectedOrigin: string;
  try { expectedOrigin = host ? new URL(`${target.protocol}//${host}`).origin : target.origin; }
  catch { throw new RequestError(400, "Invalid request host"); }
  if (origin && origin !== expectedOrigin) {
    let submittedOrigin = "invalid";
    try { submittedOrigin = new URL(origin).origin; } catch { /* Never log raw headers. */ }
    console.error("Enquiry origin mismatch", { requestOrigin: expectedOrigin, submittedOrigin });
    throw new RequestError(403, "Invalid origin");
  }
  if (Number(request.headers.get("content-length")) > 20000) throw new RequestError(413, "Submission too large");
  let body: unknown;
  try {
    body = JSON.parse((await readBoundedBody(request)).toString("utf8"));
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
  const reply = (status: number, code: string, error: string) => Response.json({ error, code }, { status, headers: { "Cache-Control": "no-store" } });
  if (error instanceof RequestError) {
    const messages: Record<number, string> = {
      400: "Please send a valid enquiry request.", 401: "Authentication required.", 403: "This request is not allowed.",
      413: "Your enquiry is too long. Please shorten it and try again.", 415: "Please send your enquiry as JSON.",
      422: "Please check your contact details and message, then try again.", 429: "Too many enquiries. Please wait a few minutes and try again.",
    };
    return reply(error.status, `REQUEST_${error.status}`, messages[error.status] ?? "We couldn't process your request. Please try again.");
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma messages/meta can contain SQL, connection strings and submitted values.
    console.error("Database request failed", { type: "PrismaClientKnownRequestError", code: /^P\d{4}$/.test(error.code) ? error.code : "UNKNOWN", schemaFailure: error.code === "P2022" });
    if (error.code === "P2002") return reply(409, "CONFLICT", "This enquiry conflicts with an existing submission. Please check and try again.");
  } else {
    console.error("Lead request failed", { type: error instanceof Prisma.PrismaClientValidationError ? "PrismaClientValidationError" : "UnexpectedError" });
  }
  return reply(500, "INTERNAL_ERROR", "We couldn't send your enquiry right now. Please try again or contact Mosi Media Solutions directly.");
}
