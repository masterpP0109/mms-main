# Mosi Media Solutions

MMS is a Next.js App Router website for conference, event and media production. Its existing dark and gold design is preserved. PostgreSQL is authoritative for published services and projects.

## Local setup

Use Node 22 or 24, install with `npm ci`, copy `.env.example` to `.env`, and configure a **local or staging** PostgreSQL connection. Run `npm run db:generate`, `npm run db:migrate:deploy`, then `npm run content:import` for a dry run. Review existing content before `npm run content:import -- --apply`; existing slugs are never overwritten. Start with `npm run dev`.

Do not point development, seeding or tests at the production database. No provider sends are needed to run unit tests. Use distinct databases and credentials for development, preview, production and tests.

## Enquiries and notifications

The API validates and saves an enquiry with pending notification states in one database insert, then awaits independent Titan SMTP attempts for MMS and the submitting customer. Success acknowledges persistence, not inbox delivery. Partial email failure never invalidates the saved enquiry. An authenticated worker recovers eligible pending/retry work independently; see ENQUIRY_RELEASE.md and DEPLOYMENT_CHECKLIST.md before deployment. There is no unawaited serverless background task and no extra queue infrastructure.

`CRON_SECRET` must contain at least 32 random characters. The default Vercel configuration supports Hobby and does not register a cron. Configure an authenticated external scheduler every five minutes, or explicitly opt into the Pro-only example in `docs/vercel-pro.example.json`. Never release the asynchronous notification path without verifying processing and monitoring; a successful preview build does not activate notification delivery.

Email retries are bounded to five attempts. Ambiguous SMTP/WhatsApp sends and stale sending states require operator reconciliation; do not blindly resend. The manual MMS email retry command remains `npm run notifications:retry -- LEAD_ID`; customer-only retries use `node --conditions=react-server scripts/retry-acknowledgement.cjs LEAD_ID`. See ENQUIRY_RELEASE.md for the additive acknowledgement migration, environment settings, templates and verification.

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
