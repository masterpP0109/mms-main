import { ZodError, type ZodType } from "zod";

export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) throw new RequestError(415, "Content-Type must be application/json");
  let body: unknown;
  try { body = await request.json(); } catch { throw new RequestError(400, "Malformed JSON body"); }
  try { return schema.parse(body); } catch (error) {
    if (error instanceof ZodError) throw new RequestError(422, "Invalid submission", error.flatten().fieldErrors);
    throw error;
  }
}

export class RequestError extends Error {
  constructor(public status: number, message: string, public fields?: Record<string, string[] | undefined>) { super(message); }
}

export function errorResponse(error: unknown) {
  if (error instanceof RequestError) return Response.json({ error: error.message, fields: error.fields }, { status: error.status });
  console.error("Lead request failed", { error: error instanceof Error ? error.message : "Unknown error" });
  return Response.json({ error: "We could not process your request. Please try again later." }, { status: 500 });
}
