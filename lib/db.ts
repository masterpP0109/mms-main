import "server-only";
import { PrismaClient } from "@prisma/client";
import { securePostgresUrl } from "@/lib/postgres-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient({
  ...(process.env.DATABASE_URL ? { datasources: { db: { url: securePostgresUrl(process.env.DATABASE_URL) } } } : {}),
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
