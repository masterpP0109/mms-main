// Reuse one key for identical retries during this page session (including lost responses).
const submissions = new Map<string, string>();
export function submissionKey(payload: unknown): string {
  const fingerprint = JSON.stringify(payload);
  const existing = submissions.get(fingerprint);
  if (existing) return existing;
  const key = crypto.randomUUID();
  if (submissions.size >= 100) submissions.delete(submissions.keys().next().value!);
  submissions.set(fingerprint, key);
  return key;
}
