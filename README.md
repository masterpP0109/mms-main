# Mosi Media Solutions

MMS is a Next.js App Router website for conference, event and media production. Its existing dark and gold design is preserved. PostgreSQL is authoritative for published services and projects.

## Local setup

Use Node 22 or 24, install with `npm ci`, copy `.env.example` to `.env`, and configure a **local or staging** PostgreSQL connection. Run `npm run db:generate`, `npm run db:migrate:deploy`, then `npm run content:import` for a dry run. Review existing content before `npm run content:import -- --apply`; existing slugs are never overwritten. Start with `npm run dev`.

Do not point development, seeding or tests at the production database. No provider sends are needed to run unit tests. Use distinct databases and credentials for development, preview, production and tests.

## Enquiries and notifications

The API validates and saves an enquiry with pending notification states in one database insert. Success acknowledges persistence, not email/WhatsApp delivery. An authenticated worker processes pending rows independently; see DEPLOYMENT_CHECKLIST.md before deploying this change. A missing scheduler leaves saved enquiries pending. There is no unawaited serverless background task and no extra queue infrastructure.

`CRON_SECRET` must contain at least 32 random characters. The example five-minute Vercel cron needs a compatible plan; alternatively invoke the worker from an authenticated external scheduler. Never deploy the asynchronous notification path without configuring and verifying processing and monitoring.

Email retries are bounded to five attempts and a conservative 23-hour window. Ambiguous WhatsApp sends and stale sending states require operator reconciliation; do not blindly resend. The manual email retry command remains `npm run notifications:retry -- LEAD_ID`.

## Quality commands

- `npm run lint`
- `npm run typecheck`
- `npm test -- --runInBand`
- `npm run test:coverage -- --runInBand`
- `npm run media:check`
- `npm run build`
- `npm run performance:measure` after building; local synthetic results include explicit limitations.
- `npm audit --omit=dev --audit-level=high`
- `npm run test:integration` with `MMS_TEST_DATABASE_URL` set to an isolated local database whose name ends in `_test`.
- `npm run test:e2e` after installing Chromium with Playwright. Set `PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright` during browser installation. Database-backed journeys require `MMS_TEST_DATABASE_URL`; other journeys mock enquiry APIs and never send to providers.

GitHub Actions provisions its own PostgreSQL service; it never uses production credentials. See TEST_REPORT.md for actual executed checks, failures and unavailable checks.

## Staff content workflow

See docs/CONTENT_MANAGEMENT.md. Use an authenticated managed database editor with a role restricted to Service and Project records. There is no public administrative write endpoint or custom CMS. Staff identity provisioning is an operational prerequisite, not a security placeholder in application code.

## Media and private material

`ASSET_INVENTORY.csv` inventories public assets. `MEDIA_OPTIMIZATION.json` records actual byte savings. Oversized JPEGs retain stable filenames for database compatibility; Next Image negotiates AVIF/WebP. `npm run media:optimize` defaults to a dry run. `--apply` archives originals in `.private-assets`, which must remain excluded from Git, Vercel and public assets. Back this private directory up securely outside the checkout; it is not included in commits.

## Operations

Read DEPLOYMENT_CHECKLIST.md, SECURITY_REVIEW.md, CODE_QUALITY_IMPROVEMENTS.md and REMAINING_WORK.md. Retention is owner-configured: set `RETENTION_DAYS`, run `npm run privacy:retention` to inspect counts, and review before `--apply`. Database deletion does not delete email, WhatsApp or backup copies. No retention deletion was executed during implementation.

Production migrations, content reconciliation, scheduler activation, staff permissions, provider configuration and a staged deployment must be completed before release. No production deployment or history rewrite is part of this local implementation.
