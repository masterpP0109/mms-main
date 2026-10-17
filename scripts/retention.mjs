import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";
nextEnv.loadEnvConfig(process.cwd());
const days = Number(process.env.RETENTION_DAYS);
if (!Number.isInteger(days) || days < 30 || days > 3650) throw new Error("Set an owner-approved RETENTION_DAYS between 30 and 3650.");
const cutoff = new Date(Date.now() - days * 86400000);
const db = new PrismaClient();
try {
  const where = { updatedAt: { lt: cutoff }, OR: [{ conversation: { is: null } }, { conversation: { is: { messages: { none: { receivedAt: { gte: cutoff } } } } } }] };
  const count = await db.lead.count({ where });
  console.log({ eligibleEnquiries: count, retentionDays: days, apply: process.argv.includes("--apply") });
  if (process.argv.includes("--apply")) {
    await db.$transaction(async tx => {
      await tx.message.deleteMany({ where: { receivedAt: { lt: cutoff } } });
      await tx.webhookEvent.deleteMany({ where: { processedAt: { lt: cutoff } } });
      await tx.lead.deleteMany({ where });
      await tx.conversation.deleteMany({ where: { leadId: null, messages: { none: {} } } });
      await tx.contact.deleteMany({ where: { conversation: { is: null } } });
      await tx.rateLimit.deleteMany({ where: { expiresAt: { lt: cutoff } } });
    });
  }
} finally { await db.$disconnect(); }
