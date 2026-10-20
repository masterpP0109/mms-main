-- Existing enquiries remain not_requested: never backfill customer emails automatically.
ALTER TABLE "Lead"
  ADD COLUMN "acknowledgementStatus" TEXT NOT NULL DEFAULT 'not_requested',
  ADD COLUMN "acknowledgementProviderId" TEXT,
  ADD COLUMN "acknowledgementAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "acknowledgementError" TEXT;
CREATE INDEX "Lead_acknowledgementStatus_createdAt_idx" ON "Lead"("acknowledgementStatus", "createdAt");
