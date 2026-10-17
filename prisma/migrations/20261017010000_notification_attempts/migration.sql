-- Additive only. Existing accepted/sending states are intentionally preserved.
ALTER TABLE "Lead" ADD COLUMN "emailAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Lead" ADD COLUMN "whatsappAttempts" INTEGER NOT NULL DEFAULT 0;
CREATE INDEX "Lead_emailStatus_createdAt_idx" ON "Lead"("emailStatus", "createdAt");
CREATE INDEX "Lead_whatsappStatus_createdAt_idx" ON "Lead"("whatsappStatus", "createdAt");

-- Legacy retry_required rows have already had an attempt; retain conservative retry-age protection.
UPDATE "Lead" SET "emailAttempts" = 1 WHERE "emailStatus" = 'retry_required';
