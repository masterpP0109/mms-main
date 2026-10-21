/** @jest-environment node */
import { errorResponse, parseJson, readBoundedBody } from "@/lib/http";
import { z } from "zod";
import { Prisma } from "@prisma/client";

it.each([["P2002", 409], ["P2022", 500], ["P2003", 500]])("safely maps Prisma %s to %s", async (code, status) => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  const error = new Prisma.PrismaClientKnownRequestError("postgresql://private:credential@host private client", { code: String(code), clientVersion: "6", meta: { target: "private client" } });
  const response = errorResponse(error);
  expect(response.status).toBe(status);
  const body = await response.json();
  expect(body).toHaveProperty("code");
  expect(JSON.stringify([body, log.mock.calls])).not.toMatch(/postgresql|credential|private client/);
  expect(log).toHaveBeenCalledWith("Database request failed", expect.objectContaining({ code }));
  log.mockRestore();
});

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
it("accepts the browser destination Host when the Node adapter uses localhost", async () => {
  const request = new Request("http://localhost:3104/api", { method: "POST", headers: { "Content-Type": "application/json", Host: "127.0.0.1:3104", Origin: "http://127.0.0.1:3104" }, body: "{}" });
  await expect(parseJson(request, z.object({}))).resolves.toEqual({});
});
it("rejects a foreign origin despite spoofed forwarded host headers", async () => {
  const request = new Request("https://example.com/api", { method: "POST", headers: { "Content-Type": "application/json", Host: "example.com", Origin: "https://attacker.example", "X-Forwarded-Host": "attacker.example" }, body: "{}" });
  await expect(parseJson(request, z.object({}))).rejects.toMatchObject({ status: 403 });
});
it.each(["example.com/path", "example.com:99999"])("rejects malformed request Host %s", async host => {
  const request = new Request("https://example.com/api", { method: "POST", headers: { "Content-Type": "application/json", Host: host }, body: "{}" });
  await expect(parseJson(request, z.object({}))).rejects.toMatchObject({ status: 400 });
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
