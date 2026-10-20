/** @jest-environment node */
import { migrationPostgresUrl } from "@/lib/postgres-url";
it("derives a direct Neon endpoint while preserving credentials and TLS", () => {
  const result = new URL(migrationPostgresUrl("postgresql://fixture:fixture-password@ep-example-pooler.us-east-2.aws.neon.tech/neondb?connection_limit=5&pool_timeout=20&pgbouncer=true"));
  expect(result.hostname).toBe("ep-example.us-east-2.aws.neon.tech");
  expect(result.username).toBe("fixture");
  expect(result.password).toBe("fixture-password");
  expect(result.searchParams.get("sslmode")).toBe("require");
  expect(result.searchParams.get("sslaccept")).toBe("strict");
  for (const key of ["connection_limit", "pool_timeout", "pgbouncer"]) expect(result.searchParams.has(key)).toBe(false);
});
it("preserves an isolated non-Neon host", () => {
  const result = new URL(migrationPostgresUrl("postgresql://fixture:fixture@localhost:5432/mms_test"));
  expect(result.hostname).toBe("localhost");
  expect(result.searchParams.has("sslmode")).toBe(false);
});
it("redacts malformed URL diagnostics", () => {
  expect(() => migrationPostgresUrl("private-credential-invalid-url")).toThrow("Invalid PostgreSQL configuration");
});
