# Lead persistence and email recovery

`POST /api/leads` and `POST /api/conference-enquiry` return **201** for a new persisted enquiry and **200** for an identical idempotent replay. The response includes `saved`, the existing `submissionId`, a stable `MMS-...` customer `reference`, and the internal email's current `notificationStatus`. `pending` means saved and awaiting processing. It does not mean email delivery. Invalid JSON returns 400; invalid form fields return 422; conflicts return 409. Database schema errors return a generic 500. Database messages, SQL, submitted values and credentials are excluded from application error logs.

## Transactional outbox

The `Lead` row is the database-backed outbox for two fixed email channels. Its initial insert atomically records both the enquiry and pending notifications. Historical `not_requested` acknowledgements are never backfilled. Each channel has independent status, attempt count, provider ID, error, claim time and next retry time.

The route uses Next.js 16.4.2 `after()` to start both emails after the response. Next's installed `after` documentation describes Node/Vercel `waitUntil` support, subject to the route's execution limit. This is a best-effort trigger, not a durable queue. Scheduling failure still leaves committed work for recovery.

The authenticated `/api/internal/notifications` worker recovers pending work and retries explicit SMTP non-acceptance. Claims are atomic; only one concurrent worker sends each channel. Retries use channel-specific exponential backoff (5, 10, 20, 40 minutes), with five total automatic attempts. SMTP has per-phase timeouts and a 45-second overall deadline. A worker processes at most three leads and avoids starting another batch near its execution deadline.

`accepted` means the configured recipient was accepted with SMTP's final 250 response and a message ID. It does not prove inbox delivery. `reconciliation_required` means acceptance is uncertain, the retry budget was exhausted, or an old provider failure needs review. Connection loss after DATA and claims older than ten minutes are retained for reconciliation. SMTP cannot guarantee exactly-once delivery: automatically replaying an uncertain attempt could send duplicate email.

## Production recovery scheduler

The GitHub Actions `Recover pending enquiry notifications` workflow calls the worker every five minutes and supports manual dispatch. GitHub scheduled runs may be delayed and only run from the default branch. Configure these **repository Actions secrets** before enabling production recovery:

- `MMS_NOTIFICATION_WORKER_URL`: the deployed HTTPS URL ending in `/api/internal/notifications`.
- `CRON_SECRET`: at least 32 random characters; the same value must exist in Vercel's server environment.

An existing authenticated external scheduler may call the same endpoint instead. Monitor scheduler failures, the worker's `attention` count, and application logs. Increase processing capacity if arrivals exceed the bounded worker throughput. Persistent queue storage alone does not establish that a scheduler is configured or running.

Apply migrations to the target database **before deploying code**: `npx prisma migrate deploy`. Use `DATABASE_URL_UNPOOLED` for migrations and a pooled `DATABASE_URL` for the runtime. The CLI configuration loads `.env.local` with Next.js precedence. Migration `20261020103925_customer_acknowledgements` was already applied during earlier work and only normalizes content ID defaults; retain it in repository history. `20261020120000_notification_recovery` adds nullable channel clocks without replaying historical enquiries.

## Titan configuration

Retain `SMTP_HOST=smtp.titan.email`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER`, `SMTP_PASSWORD`, and `CONTACT_EMAIL_TO`. The authenticated SMTP user is the sender. Port 465 uses implicit TLS with certificate verification; STARTTLS and other ports are intentionally rejected. The internal recipient comes only from `CONTACT_EMAIL_TO`; the customer recipient comes only from the validated enquiry email. Keep all credentials server-side and out of Git.

## Verification and manual recovery

- `npm run email:verify` tests TLS/authentication without sending mail.
- `node --conditions=react-server scripts/verify-lead-recovery.cjs --confirm-test-records` creates UUID-scoped database fixtures, tests simulated failures/concurrency/recovery, and removes only its fixtures. It sends no real emails.
- After a production build, `node --conditions=react-server scripts/verify-lead-workflow.cjs --confirm-send --customer-email=APPROVED_TEST_INBOX` runs a real browser submission, retrieves the exact row, replays its idempotency key, checks independent SMTP acceptance, and saves local HTML/screenshots. It retains one clearly labelled test lead and uses an exclusive `.cache/lead-workflow-once.json` lock. Reconcile that record before repeating. Never substitute a real customer's address.
- Reconcile uncertain sends against Titan using the stable Message-ID recorded for the attempt. Confirm non-acceptance before running `npm run notifications:retry -- LEAD_ID --confirmed-not-accepted` or `node --conditions=react-server scripts/retry-acknowledgement.cjs LEAD_ID --confirmed-not-accepted`. Review exhausted budgets too. Accepted channels are never replayed to repair the other channel. Safe retries before their due time remain deferred.

The customer template excludes technical metadata and source paths. The internal template puts reference, source page and a Zimbabwe-local submission date in a muted footer. WhatsApp links are generated only for unambiguous Zimbabwe mobile numbers; invalid or foreign numbers remain plain text.
