import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { RequestError } from "@/lib/http";

/** An atomic bucket shared across all serverless instances. */
export async function enforceIdentityLimit(identity: string) {
  const window = Math.floor(Date.now() / 600_000);
  const key = createHash("sha256").update(`${identity.trim().toLowerCase()}:${window}`).digest("hex");
  const expiresAt = new Date((window + 1) * 600_000);
  const rows = await db.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "RateLimit" ("key", "expiresAt", "count") VALUES (${key}, ${expiresAt}, 1)
    ON CONFLICT ("key") DO UPDATE SET "count" = "RateLimit"."count" + 1
    WHERE "RateLimit"."count" < 10 RETURNING "count"
  `;
  if (!rows.length) throw new RequestError(429, "Too many enquiries");
}
