/** @jest-environment node */
import { errorResponse, parseJson, readBoundedBody } from "@/lib/http";
import { z } from "zod";

it("rejects a misleading JSON content type", async () => {
  const request = new Request("https://example.com/api", { method: "POST", headers: { "Content-Type": "application/json-malicious" }, body: "{}" });
  await expect(parseJson(request, z.object({}))).rejects.toMatchObject({ status: 415 });
});
it("rejects a streamed oversized body without relying on Content-Length", async () => {
  await expect(readBoundedBody(new Request("https://example.com/api", { method: "POST", body: "x".repeat(20001) }))).rejects.toMatchObject({ status: 413 });
});
it("preserves exact raw bytes for signature verification", async () => {
  const bytes = new Uint8Array([255, 0, 10, 123]);
  const result = await readBoundedBody(new Request("https://example.com/api", { method: "POST", body: bytes }));
  expect([...result]).toEqual([...bytes]);
});

it("rejects cross-origin submissions", async () => {
  const request = new Request("https://example.com/api", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://untrusted.example" }, body: "{}" });
  await expect(parseJson(request, z.object({}))).rejects.toMatchObject({ status: 403 });
});
it("rejects malformed JSON without exposing parser diagnostics", async () => {
  const request = new Request("https://example.com/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  await expect(parseJson(request, z.object({}))).rejects.toMatchObject({ status: 400 });
});
it("redacts unexpected server errors from responses and logs", async () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  const response = errorResponse(new Error("private credential or customer data"));
  expect(response.status).toBe(500);
  expect(JSON.stringify(await response.json())).not.toContain("private credential");
  expect(JSON.stringify(log.mock.calls)).not.toContain("private credential");
  log.mockRestore();
});
