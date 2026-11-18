-- AlterTable Lead
ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "funnel" TEXT NOT NULL DEFAULT 'contact',
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS "priority" TEXT NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS "organisationType" TEXT,
  ADD COLUMN IF NOT EXISTS "eventDate" TEXT,
  ADD COLUMN IF NOT EXISTS "venue" TEXT,
  ADD COLUMN IF NOT EXISTS "delegates" INTEGER,
  ADD COLUMN IF NOT EXISTS "packageId" TEXT,
  ADD COLUMN IF NOT EXISTS "packageName" TEXT,
  ADD COLUMN IF NOT EXISTS "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "originPath" TEXT,
  ADD COLUMN IF NOT EXISTS "utmSource" TEXT,
  ADD COLUMN IF NOT EXISTS "utmMedium" TEXT,
  ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT,
  ADD COLUMN IF NOT EXISTS "notes" TEXT,
  ADD COLUMN IF NOT EXISTS "assignedTo" TEXT,
  ADD COLUMN IF NOT EXISTS "followedUpAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_funnel_createdAt_idx" ON "Lead"("funnel", "createdAt");
CREATE INDEX IF NOT EXISTS "Lead_priority_idx" ON "Lead"("priority");

-- AlterTable Review
ALTER TABLE "Review"
  ADD COLUMN IF NOT EXISTS "stoodOut" TEXT,
  ADD COLUMN IF NOT EXISTS "contribution" TEXT,
  ADD COLUMN IF NOT EXISTS "improvements" TEXT;
