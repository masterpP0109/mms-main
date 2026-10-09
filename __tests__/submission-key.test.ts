/** @jest-environment node */
import { submissionKey } from "@/lib/submission-key";
it("reuses the key for identical retries and changes it when the payload changes", () => {
  const first = submissionKey({ message: "Hello" });
  expect(submissionKey({ message: "Hello" })).toBe(first);
  expect(submissionKey({ message: "Different" })).not.toBe(first);
});
