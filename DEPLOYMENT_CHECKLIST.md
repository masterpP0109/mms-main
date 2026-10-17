# Deployment checklist

## Release gate

Do not deploy the asynchronous enquiry path until the database migrations, worker scheduling and monitoring have been verified together in staging. Existing public URLs and marketing design are preserved, but this release changes enquiry operations and the authoritative content source. Production writes/deployment were not executed during implementation.

## Configuration

- DATABASE_URL: environment-specific PostgreSQL URL with TLS. Use a pooled endpoint suitable for serverless runtime; review connection limits. Keep a separate migration credential/connection as appropriate for the database provider.
- RESEND_API_KEY, MMS_FROM_EMAIL, MMS_NOTIFICATION_EMAIL: server-only; verify the existing sender without changing business DNS/mail hosting unnecessarily.
- WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_APP_SECRET, WHATSAPP_VERIFY_TOKEN, WHATSAPP_NOTIFICATION_TO, WHATSAPP_NOTIFICATION_TEMPLATE, WHATSAPP_API_VERSION: approved internal template and configured business account. No unsolicited customer messaging.
- CRON_SECRET: at least 32 random characters, server-only. Scheduler must send Authorization: Bearer <secret>.
- SITE_URL: official production origin for canonical metadata and sitemap. Do not use a preview URL as the permanent canonical origin.
- RETENTION_DAYS: owner-approved 30 to 3650 day period for the explicit operator retention CLI; not an automatic deletion promise.
- MMS_TEST_DATABASE_URL: isolated local/CI PostgreSQL ending in _test, never production. Not needed in production.

Keep secrets out of NEXT_PUBLIC variables, committed files, build output and logs. Preview deployments must not reuse production write credentials or enable provider sends/schedulers inadvertently.

## Database and content

1. Back up the target database and confirm restoration ownership.
2. Run npm ci and npm run db:generate against the locked dependencies.
3. Review all four 20261017 additive migration files, then run npm run db:migrate:deploy in staging. Verify row counts and existing lead states; do not reset the database.
4. Run npm run content:import for a dry run. Compare approved current content with existing rows before --apply. Imports do not overwrite existing slugs; resolve conflicts with MMS. Confirm all existing public slugs are present, publication/order is correct and galleries resolve.
5. Test concurrent enquiries and signed webhook replays against isolated test data. Review historical WhatsApp leads manually; no destructive automatic merge/backfill is included.
6. Provision named staff content identities/roles as described in docs/CONTENT_MANAGEMENT.md. Test that those identities cannot read enquiries or change schema.

## Vercel and scheduler

Build uses next build; postinstall generates Prisma. Review Node 22/24 compatibility. vercel.json proposes a five-minute cron invoking /api/internal/notifications. This frequency requires a compatible Vercel plan; if unavailable, replace the cron with an authenticated external scheduler. The worker exports maxDuration=120; confirm the project's function duration allowance. No unawaited promise is used.

Vercel sends CRON_SECRET as a bearer header: https://vercel.com/docs/cron-jobs/manage-cron-jobs . Scheduling invokes production functions: https://vercel.com/docs/cron-jobs . Configuration in source is not proof of active scheduling.

Verify unauthenticated calls are rejected, missing secret fails closed, and authenticated invocations process a staging pending lead. Confirm both provider IDs/statuses without sending to customers. Return success to the visitor only for persisted data; the scheduled worker handles delivery independently.

## Monitoring and recovery

Alert on scheduler failures, oldest pending enquiry above the business response budget, reconciliation_required states and sending states older than ten minutes. Monitor database availability, provider rejections and backlog growth. Assign an MMS operator to review the attention count; console logging alone is not an operational paging integration.

Email has at most five automatic attempts inside a conservative 23-hour period. Investigate Resend acceptance before manual retry outside that window. Never reset ambiguous WhatsApp sending/reconciliation states to pending until Meta records confirm no acceptance; Meta has no equivalent idempotency key. Keep a record of reviewed manual recovery.

Run media:check, lint, typecheck, unit/coverage, isolated integration, browser journeys and production build. Verify contact, conference and quote forms, gallery focus restoration, mobile navigation, 404s, publication changes and all six viewport widths. Review the dependency audit and any remaining advisories. Confirm private documents, browser captures, .private-assets and .cache cannot be fetched from the preview.

## Rollback

Retain a known-good application deployment and database backup. Additive migrations can remain when rolling back application code; do not drop new tables/columns containing customer data. Stop scheduling while investigating worker defects, inspect pending/sending/accepted states and reconcile provider outcomes before resuming. Restoring old synchronous code can resend pending work: do not blindly redeploy and retry. Restore approved catalogue rows individually; never reseed over client edits. Redeploy cleaned assets even if code is rolled back so exposed documents are not republished.

