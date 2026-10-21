import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";
import { migrationPostgresUrl } from "./lib/postgres-url";

// Match Next.js env precedence, including .env.local, in Prisma's CLI.
loadEnvConfig(process.cwd());
const migrationUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

const paths = {
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
};

export default defineConfig(migrationUrl ? {
  ...paths,
  engine: "classic",
  datasource: { url: migrationPostgresUrl(migrationUrl) },
} : paths);
