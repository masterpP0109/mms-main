"use client";

type RetryKey = { key: string; createdAt: number };
const submissions = new Map<string, RetryKey>();
const prefix = "mms-enquiry:";
const lifetime = 24 * 3600_000;

function storage(): Storage | undefined {
  try { return typeof window === "undefined" ? undefined : window.sessionStorage; }
  catch { return undefined; }
}
async function fingerprint(payload: unknown): Promise<string> {
  const serialized = JSON.stringify(payload, (_key: string, value: unknown) => value && typeof value === "object" && !Array.isArray(value) ? Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b))) : value) ?? "null";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(serialized));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
function valid(value: unknown): value is RetryKey {
  if (!value || typeof value !== "object" || !("key" in value) || typeof value.key !== "string" || !("createdAt" in value) || typeof value.createdAt !== "number") return false;
  return /^[0-9a-f-]{36}$/i.test(value.key) && Date.now() >= value.createdAt && Date.now() - value.createdAt < lifetime;
}

// Only a payload digest and opaque retry metadata persist in the tab, never customer text.
export async function submissionKey(payload: unknown): Promise<string> {
  const id = await fingerprint(payload);
  let existing: unknown = submissions.get(id);
  const browser = storage();
  if (!valid(existing)) {
    try { existing = JSON.parse(browser?.getItem(prefix + id) ?? "null"); } catch { existing = undefined; }
  }
  const entry = valid(existing) ? existing : { key: crypto.randomUUID(), createdAt: Date.now() };
  if (submissions.size >= 100) submissions.delete(submissions.keys().next().value!);
  submissions.set(id, entry);
  try {
    if (browser) {
      const keys = Array.from({ length: browser.length }, (_, index) => browser.key(index)).filter((key): key is string => Boolean(key?.startsWith(prefix)));
      if (keys.length >= 100 && !keys.includes(prefix + id)) browser.removeItem(keys[0]);
      browser.setItem(prefix + id, JSON.stringify(entry));
    }
  } catch { /* Restricted storage falls back to this page's in-memory retry key. */ }
  return entry.key;
}

export async function acknowledgeSubmission(payload: unknown): Promise<void> {
  const id = await fingerprint(payload);
  submissions.delete(id);
  try { storage()?.removeItem(prefix + id); } catch { /* Persistence already succeeded. */ }
}
