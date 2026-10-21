/** @jest-environment node */
import { securePostgresUrl } from "@/lib/postgres-url";

it.each(["", "sslmode=disable", "sslmode=prefer&sslaccept=accept_invalid_certs", "sslmode=require"])("requires strict TLS for remote databases: %s", query => {
  const url = new URL(securePostgresUrl(`postgresql://USER:PLACEHOLDER@db.example.com/app?${query}`));
  expect(url.searchParams.get("sslmode")).toBe("require");
  expect(url.searchParams.get("sslaccept")).toBe("strict");
});
it("preserves credentials, identity certificates and other connection parameters", () => {
  const original = new URL("postgres://USER:PLACEHOLDER@db.example.com:5432/app?sslcert=ca.pem&sslidentity=client.p12&schema=public&connection_limit=3");
  const actual = new URL(securePostgresUrl(original.href));
  for (const property of ["username", "password", "hostname", "port", "pathname"] as const) expect(actual[property]).toBe(original[property]);
  for (const key of ["sslcert", "sslidentity", "schema", "connection_limit"]) expect(actual.searchParams.get(key)).toBe(original.searchParams.get(key));
});
it.each(["localhost", "127.0.0.1", "[::1]"])("preserves explicitly isolated local no-TLS configuration: %s", host => {
  expect(new URL(securePostgresUrl(`postgresql://USER:PLACEHOLDER@${host}/app_test?sslmode=disable`)).searchParams.get("sslmode")).toBe("disable");
});
it.each(["invalid", "https://example.com"])("rejects unsupported configuration without echoing it", input => {
  expect(() => securePostgresUrl(input)).toThrow(/Invalid PostgreSQL/);
});

it("bounds Neon runtime pools and allows time for a suspended compute to wake", () => {
  const url = new URL(securePostgresUrl("postgresql://USER:PLACEHOLDER@ep-test-pooler.us-east-2.aws.neon.tech/app"));
  expect(url.searchParams.get("connection_limit")).toBe("5");
  expect(url.searchParams.get("connect_timeout")).toBe("15");
  expect(url.searchParams.get("pool_timeout")).toBe("20");
});
it("preserves explicitly tuned Neon pool settings", () => {
  const url = new URL(securePostgresUrl("postgresql://USER:PLACEHOLDER@ep-test-pooler.us-east-2.aws.neon.tech/app?connection_limit=2&connect_timeout=30&pool_timeout=10"));
  expect(url.searchParams.get("connection_limit")).toBe("2");
  expect(url.searchParams.get("connect_timeout")).toBe("30");
  expect(url.searchParams.get("pool_timeout")).toBe("10");
});
it("leaves direct Neon connections free of runtime pool defaults", () => {
  const url = new URL(securePostgresUrl("postgresql://USER:PLACEHOLDER@ep-test.us-east-2.aws.neon.tech/app"));
  expect(url.searchParams.has("connection_limit")).toBe(false);
});
