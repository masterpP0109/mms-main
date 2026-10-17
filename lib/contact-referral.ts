// Unambiguous, slash-separated local paths; shared by the form and API schema.
export const CONTACT_ORIGIN_PATTERN = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*\/?)?$/;

export function contactReferral(params: URLSearchParams) {
  const rawOrigin = params.get("origin") ?? "";
  return {
    origin: rawOrigin.length <= 300 && CONTACT_ORIGIN_PATTERN.test(rawOrigin) ? rawOrigin : "/contact",
    service: params.get("service")?.trim().slice(0, 160) || undefined,
  };
}
