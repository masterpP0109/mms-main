# Website notifications with Resend

Titan continues receiving business mail. No DNS changes or production deployment were made by this implementation. A sending domain must already be verified in Resend; if it is not, domain verification is a separate prerequisite requiring review of Resend's supplied records. Do not change Titan MX or website records, and do not enable Resend receiving.

## Vercel server-side variables

- RESEND_API_KEY: Resend sending API key authorized for the verified domain.
- MMS_FROM_EMAIL: plain email address on that verified sending domain, for example website@mosimediasolutions.com only if that domain is verified.
- MMS_NOTIFICATION_EMAIL: info@mosimediasolutions.com.
- DATABASE_URL: existing PostgreSQL/Prisma connection; retain existing WhatsApp configuration.

Never use NEXT_PUBLIC_ for secrets. Remove the obsolete SENDLAYER_API_KEY from Vercel after review and successful preview verification. Do not put real keys in source control. Installation: npm install; npm run build. No database migration is required: existing Lead.emailStatus, emailProviderId, notificationError and unique idempotencyKey fields are reused. Existing records are preserved; historical sent values remain recognized as already notified.

## Meaning of success

The API returns HTTP 200, success: true, saved: true and submissionId after persistence, even when notification fails. notificationStatus is accepted only when an email is recorded as accepted (historical sent records are also treated as already notified); pending_retry includes failed, pending or uncertain attempts. No response asserts mailbox delivery. Lead.emailStatus values: pending, sending, accepted, retry_required; old sent values are preserved. Use Resend logs and the provider ID to confirm delivery/bounces. Customer email is used only as Reply-To; phone-only inbound enquiries also notify the team.

Notifications contain escaped HTML and plain text, contact information, requested services, event metadata, message, lead ID and stored UTC submission date. Logs contain IDs and numeric provider status only, never provider error messages or customer payloads. WhatsApp behavior remains independent.

## Duplicate prevention and limits

An identical payload and submission key returns the existing record without notifying again. Without a key, identical payloads are deduplicated in five-minute buckets. Forms retain their key for identical retries. An atomic status claim prevents concurrent notifications; Resend receives mms-lead/LEAD_ID as its idempotency key. Changed payloads create new enquiries. Database rate limiting permits fewer than ten prior enquiries per email (or phone) in ten minutes. This is a basic customer-based limit, not a replacement for perimeter bot controls; simultaneous requests can exceed the limit. Origin validation, 20 KB body limits and honeypots remain active.

## Retry procedure

There is no unattended worker. Review retry_required/pending leads in PostgreSQL and fix missing configuration or provider issues, then run from a trusted environment with the matching database and secrets:

    npm run notifications:retry -- LEAD_ID

This sends only the email and uses the same content, stored submission date, and provider idempotency key. The database claim prevents simultaneous runs. It refuses accepted/sent/sending records. For enquiries older than 23 hours it requires explicit operator reconciliation, because Resend's idempotency retention is 24 hours (https://resend.com/docs/dashboard/emails/idempotency-keys). Do not change sender/recipient configuration during ambiguous retries because the request payload must match.

A sending record can mean the process stopped after Resend acceptance but before recording it. Reconcile Resend logs before changing status. For old or uncertain attempts, verify whether the email was accepted/delivered; record the provider ID and accepted status if found. If verified never accepted, an operator can run `npm run notifications:retry -- LEAD_ID --confirmed-not-accepted` after review. This flag is an operator assertion, not automated delivery verification. Do not blindly reset status or resend after the provider retention window. Existing historical failed notifications are not automatically retried, avoiding SendLayer/Resend duplicates.

## Verification before production review

    npm install
    npx tsc --noEmit
    npm run lint
    npm test -- --runInBand
    npm run build

Use a separate preview database and a verified test sender/recipient. Submit contact, homepage quote builder and conference forms; confirm each saved record, Resend acceptance ID, complete email contents and working Reply-To. Disable the API key and confirm the enquiry still saves with retry_required and the visitor sees successful submission. Restore the key, run the reviewed retry command, confirm acceptance, then rerun and confirm no second send. Repeat identical requests with one submission key and confirm a single lead/notification. Check delivery separately in Resend logs and the Titan inbox. Do not deploy production until checks pass and the change is reviewed.

## Changed files

- package.json, package-lock.json: official Resend SDK, server-only marker and retry command.
- lib/email/resend.ts: new adapter; lib/email/sendlayer.ts removed.
- lib/providers/email.ts: formatted notification and stored submission date.
- lib/env.ts: Resend configuration and independent email validation.
- lib/leads.ts: save-first processing, atomic notification claim, acceptance/retry status, duplicate checks and database rate limit.
- lib/http.ts: safe error logging.
- lib/submission-key.ts: stable keys for identical form retries.
- app/api/leads/route.ts, app/api/conference-enquiry/route.ts: saved/accepted response distinction.
- app/contact/page.tsx, app/conference-production/page.tsx, app/page.tsx: stable submission keys.
- scripts/retry-notifications.cjs: controlled operator retry.
- __tests__/email.test.ts, __tests__/lead-api.test.ts: provider/configuration and API tests.
- __tests__/lead-persistence.test.ts, __tests__/submission-key.test.ts: persistence, duplicate protection, status claims and retry keys.
- jest.setup.js: repair chainable GSAP and ScrollTrigger test mocks; production animations unchanged.
- .env.example, README.md, EMAIL_NOTIFICATIONS.md: configuration and operational documentation.

## Verification result (9 October 2026)

TypeScript, lint and the production build passed. Full Jest suite: 11 suites, 123 tests passed. The retry CLI refused missing lead ID as expected. Provider tests mock Resend; persistence tests mock Prisma. No live emails were sent, no database records were modified, no database migration was applied, and no DNS or production deployment changes were made. Preview end-to-end verification and production review remain required.
