/* eslint-disable @typescript-eslint/no-require-imports -- read-only local database diagnostic. */
require("./server-bootstrap.cjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { securePostgresUrl } = require("../lib/postgres-url.ts");
const fs = require("node:fs");
const path = require("node:path");

function safeDatabaseError(error) {
  const text = error instanceof Error ? error.message : "";
  const code = error && typeof error === "object" && /^P\d{4}$/.test(error.errorCode || error.code || "") ? error.errorCode || error.code : undefined;
  const details = [
    ["-2146893042", "Windows SEC_E_NO_CREDENTIALS: No credentials are available in the security package (os error -2146893042)"],
    ["-2146762487", "Windows certificate chain ends in an untrusted root (os error -2146762487)"],
    ["certificate verify failed", "TLS certificate verification failed"],
    ["certificate was not trusted", "TLS certificate was not trusted"],
    ["Can't reach database server", "Database server unreachable"],
    ["Authentication failed", "Database authentication rejected"],
  ].find(([needle]) => text.includes(needle));
  return { code, error: details?.[1] || "Database connection/query failed; raw details suppressed" };
}

async function checkDatabase({ checkSchema = false, requiredModels } = {}) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  const url = new URL(securePostgresUrl(process.env.DATABASE_URL));
  // Diagnose with required TLS and strict verification; never weaken TLS.
  url.searchParams.set("sslmode", "require");
  url.searchParams.set("sslaccept", "strict");
  url.searchParams.set("connect_timeout", "15");
  url.searchParams.set("socket_timeout", "15");
  const db = new PrismaClient({ datasources: { db: { url: url.href } }, log: [] });
  try {
    const rows = await db.$queryRaw`SELECT 1::integer AS ok, (SELECT ssl FROM pg_stat_ssl WHERE pid = pg_backend_pid()) AS tls`;
    console.log(JSON.stringify({ stage: "read-only-query", selectOne: rows[0]?.ok === 1, backendSessionTls: rows[0]?.tls ?? null }));
    // A managed proxy can terminate client TLS and use another backend session.
    // pg_stat_ssl describes that backend hop, not the client-to-proxy handshake.
    if (rows[0]?.ok !== 1) throw new Error("Read-only probe did not pass");
    const result = { passed: true, prisma: Prisma.prismaVersion.client, clientTlsRequired: true, certificateVerification: "strict", sslmode: "require", sslaccept: "strict", query: "SELECT 1 and current-session TLS status" };
    if (checkSchema) {
      const columns = await db.$queryRaw`SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public'`;
      const actual = new Set(columns.map(column => `${column.table_name}.${column.column_name}`));
      const models = Prisma.dmmf.datamodel.models.filter(model => !requiredModels || requiredModels.includes(model.name));
      const missingColumns = models.flatMap(model => model.fields.filter(field => field.kind !== "object" && !actual.has(`${model.dbName || model.name}.${field.dbName || field.name}`)).map(field => `${model.name}.${field.name}`));
      const hasHistory = columns.some(column => column.table_name === "_prisma_migrations");
      const applied = hasHistory ? await db.$queryRaw`SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL` : [];
      const appliedNames = new Set(applied.map(row => row.migration_name));
      const repoNames = fs.readdirSync(path.join(process.cwd(), "prisma/migrations"), { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);
      const pendingMigrations = repoNames.filter(name => !appliedNames.has(name));
      console.log(JSON.stringify({ stage: "schema-metadata", inspectedModels: models.map(model => model.name), missingColumns, migrationHistoryPresent: hasHistory, pendingMigrations }));
      result.passed = missingColumns.length === 0;
    }
    return result;
  } finally { await db.$disconnect(); }
}
module.exports = { checkDatabase, safeDatabaseError };
if (require.main === module) checkDatabase({ checkSchema: process.argv.includes("--schema") }).then(result => { console.log(JSON.stringify(result)); if (!result.passed) process.exitCode = 1; }).catch(error => {
  console.error(JSON.stringify({ passed: false, ...safeDatabaseError(error) })); process.exitCode = 1;
});
