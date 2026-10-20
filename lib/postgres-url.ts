/** Enforce certificate verification for PostgreSQL without changing credentials. */
export function securePostgresUrl(value: string): string {
  let url: URL;
  try { url = new URL(value); }
  catch { throw new Error("Invalid PostgreSQL configuration"); }
  if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("Invalid PostgreSQL protocol");
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  // Isolated local test databases may run without TLS. Remote databases may not.
  if (!local) url.searchParams.set("sslmode", "require");
  url.searchParams.set("sslaccept", "strict");
  // Bound each Prisma instance's pool when running as a serverless Node function.
  if (url.hostname.endsWith(".neon.tech") && url.hostname.includes("-pooler.")) {
    for (const [key, value] of [["connection_limit", "5"], ["connect_timeout", "15"], ["pool_timeout", "20"]]) {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    }
  }
  return url.href;
}

/** Neon migrations use a direct endpoint even when only the runtime URL exists. */
export function migrationPostgresUrl(value: string): string {
  const url = new URL(securePostgresUrl(value));
  if (url.hostname.endsWith(".neon.tech")) {
    url.hostname = url.hostname.replace("-pooler.", ".");
    for (const key of ["connection_limit", "pool_timeout", "pgbouncer"]) url.searchParams.delete(key);
  }
  return securePostgresUrl(url.href);
}
