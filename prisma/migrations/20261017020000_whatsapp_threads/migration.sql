-- Additive; historical leads are preserved for manual reconciliation.
CREATE TABLE "Contact" ("id" TEXT NOT NULL, "phone" TEXT NOT NULL, "name" TEXT NOT NULL, CONSTRAINT "Contact_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Contact_phone_key" ON "Contact"("phone");
CREATE TABLE "Conversation" ("id" TEXT NOT NULL, "contactId" TEXT NOT NULL, "leadId" TEXT, CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Conversation_contactId_key" ON "Conversation"("contactId");
CREATE UNIQUE INDEX "Conversation_leadId_key" ON "Conversation"("leadId");
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE TABLE "Message" ("id" TEXT NOT NULL, "externalId" TEXT NOT NULL, "conversationId" TEXT NOT NULL, "type" TEXT NOT NULL, "text" TEXT NOT NULL, "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Message_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Message_externalId_key" ON "Message"("externalId");
CREATE INDEX "Message_conversationId_receivedAt_idx" ON "Message"("conversationId", "receivedAt");
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WebhookEvent" ADD COLUMN "providerMessageId" TEXT;
CREATE INDEX "WebhookEvent_provider_providerMessageId_idx" ON "WebhookEvent"("provider", "providerMessageId");
