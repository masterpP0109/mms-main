CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "organisation" TEXT,
    "projectType" TEXT,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "idempotencyKey" TEXT NOT NULL,
    "externalId" TEXT,
    "emailStatus" TEXT NOT NULL DEFAULT 'pending',
    "emailProviderId" TEXT,
    "whatsappStatus" TEXT NOT NULL DEFAULT 'not_requested',
    "whatsappProviderId" TEXT,
    "notificationError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Lead_idempotencyKey_key" ON "Lead"("idempotencyKey");
CREATE UNIQUE INDEX "Lead_externalId_key" ON "Lead"("externalId");
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
CREATE INDEX "Lead_email_idx" ON "Lead"("email");
CREATE INDEX "Lead_phone_idx" ON "Lead"("phone");
CREATE UNIQUE INDEX "WebhookEvent_provider_externalId_key" ON "WebhookEvent"("provider", "externalId");
