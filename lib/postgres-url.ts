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
  return url.href;
}
