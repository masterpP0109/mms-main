-- Independent channel clocks prevent one notification from delaying the other.
-- No historical customer acknowledgement is backfilled or sent.
ALTER TABLE "Lead"
  ADD COLUMN "emailNextAttemptAt" TIMESTAMP(3),
  ADD COLUMN "emailClaimedAt" TIMESTAMP(3),
  ADD COLUMN "acknowledgementNextAttemptAt" TIMESTAMP(3),
  ADD COLUMN "acknowledgementClaimedAt" TIMESTAMP(3);
