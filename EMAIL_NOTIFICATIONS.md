# Titan SMTP and PostgreSQL notifications

The Node.js server uses Nodemailer; Resend has been removed. Configuration and passwords stay server-side. No deployment or production configuration is performed by these local tools.

## Local configuration and provenance

Use ignored `.env.local` or inherited environment variables. Inherited variables take precedence, matching Next.js. Never print environment files, put secrets in `NEXT_PUBLIC_` variables, or commit credentials. `.env.example` contains placeholders.

Set `SMTP_HOST=smtp.titan.email`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER=info@mosimediasolutions.com`, `CONTACT_EMAIL_TO=info@mosimediasolutions.com`, and set `SMTP_PASSWORD` locally. Password whitespace is preserved.

`email:verify` reports loaded filenames and whether each effective setting matches `.env.local`, without printing passwords or password hashes. Restart an existing server after changing environment values. The standalone command reads current files on every run.

Titan documents port 465 with SSL/TLS, the full mailbox address as username, and enabled third-party access: https://support.titan.email/hc/en-us/articles/900001311526-Configure-Titan-Mail-on-Outlook . Authentication rejection `EAUTH` / `535` can indicate invalid credentials or account access restrictions. Do not weaken TLS to address authentication failure.

## Independent checks: no emails or database writes

```text
npm run email:verify
npm run db:check
npm run db:check -- --schema
```

`email:verify` has no database dependency and never invokes `sendMail`. `email:test:local` is a safe compatibility alias for verification only. Verification confirms connection and authentication, not inbox delivery.

The database diagnostic uses the installed Prisma Client and executes only `SELECT 1` and a read of the current session's TLS status. It forces `sslmode=require` and `sslaccept=strict` in memory without editing the connection string on disk. A proxy's `pg_stat_ssl` result describes its backend hop, not client-to-proxy TLS. Errors are allowlisted and sanitized; connection URLs and raw Prisma error payloads are never logged.

`--schema` additionally reads column metadata and completed migration names, compares them with the checked-in Prisma models, and exits nonzero if required columns are missing. It never applies migrations. The current database is behind four existing migrations: `20261017010000_notification_attempts`, `20261017020000_whatsapp_threads`, `20261017030000_atomic_rate_limit`, and `20261017040000_content_metadata`. This leaves contact-critical attempt columns and the rate-limit table missing, and causes the Services page's `P2022` missing `Service.heroAlt` error. Schema alignment is required before a live contact submission can succeed. The contact-send test checks `Lead` and `RateLimit` metadata before submitting.

The current provider is Prisma Postgres (`db.prisma.io`), with Prisma / Prisma Client 6.19.3 and the native Windows engine. The configured URL originally specified `sslmode=require` without `sslaccept`. Application connections now enforce strict certificate verification through `lib/postgres-url.ts`. Explicitly isolated loopback test databases retain their local SSL mode; remote connections always require TLS.

Observed locally: the restricted Windows process fails with `SEC_E_NO_CREDENTIALS`, OS error `-2146893042`. The same client, credentials and strict TLS query succeed outside that restricted process. This isolates the failure to that Windows execution/security context; it is not evidence of a bad database password, an invalid server certificate, or a need to migrate/reset the database. Run the local server from a normal user terminal with outbound access when reproducing. No Windows security policy, certificate store, database schema or provider settings have been changed.

Prisma v6 TLS parameters: https://docs.prisma.io/docs/orm/v6/overview/databases/postgresql . Prisma Postgres connections: https://www.prisma.io/docs/postgres/database/connecting-to-your-database .

## Explicit one-time email send: run only when requested

```text
npm run email:test:send -- --confirm-send
```

The command verifies SMTP first, then sends one message with subject **MMS Local Titan SMTP Test** to the authorized MMS mailbox. It refuses other recipients and respects prior attempt state. An exclusively created ignored `.cache/titan-direct-test-once.json` lock prevents concurrent or repeated sends, including after an ambiguous crash. Do not remove locks and blindly retry; reconcile Titan first. Only an accepted intended recipient, a final positive SMTP reply and a Message-ID count as SMTP acceptance. Confirm inbox or spam-folder arrival separately with the recipient.

## Explicit contact endpoint test: run only when requested

After both independent checks pass, build and start a local server in a normal terminal:

```text
npm run build
npm run start -- --hostname 127.0.0.1 --port 3300
npm run contact:test:local -- http://localhost:3300 --confirm-send
```

Run the last command in a second terminal. It can write one clearly labelled test enquiry and send one notification. Without `--confirm-send` it refuses to proceed. It verifies SMTP and performs the read-only database check before submitting. It tests origin, honeypot and visitor-email rejection; any failed security check blocks the valid submission. Use `localhost` because this Next server constructs its local request URL with that hostname.

For checks that cannot store an enquiry or send mail, use `npm run contact:check:local -- http://localhost:3300`. This checks `/contact` and the database-backed `/services` route plus rejection of invalid contact requests, then exits before the valid submission and notification code.

The command uses the existing `/api/leads` route and a fixed idempotency key, reads the exact stored fixture back, then processes only that test row through the existing notification function. It does not run a worker batch or send WhatsApp notifications. An exclusive `.cache/titan-contact-test-once.json` lock and existing notification claims prevent duplicate notification attempts. A previous stored test must be reconciled instead of blindly submitted again. Failed or uncertain attempts leave their guards intact. Ignored `.cache/titan-smtp-local-test.json` preserves the earlier test history.

## Storage, headers and retry behavior

The existing HTML/plain-text templates, validation, honeypots, body-size limits, origin checks, rate limits, enquiry storage and submission idempotency are preserved. From is always the authenticated mailbox; To is `CONTACT_EMAIL_TO`; Reply-To is the validated visitor email. Phone-only enquiries omit Reply-To. SMTP uses implicit TLS on 465, certificate verification, TLS 1.2 minimum and bounded timeouts. Protocol debugging, file content access and URL content access are disabled.

Forms acknowledge durable storage and queue notifications. The authenticated worker awaits SMTP independently. No email failure deletes a saved enquiry or makes the API claim delivery. Only confirmed SMTP acceptance records `accepted`. Historical `sent` statuses are recognized.

Configuration errors and explicit rejections become `retry_required`. Connection loss or timeouts during/after DATA are uncertain and become `reconciliation_required`. Failure to record acceptance leaves `sending` for reconciliation. SMTP has no Resend-style idempotency guarantee; a stable Message-ID helps identify a message but cannot guarantee deduplication. Legacy provider failures cannot be blindly replayed through SMTP.

```text
npm run notifications:retry -- LEAD_ID
```

The retry command uses the shared server bootstrap, correct CommonJS interop and current local environment. It refuses accepted/sent/sending records. After independently verifying that an uncertain attempt was never accepted, an operator can use `--confirmed-not-accepted`. The flag is an operator assertion, not delivery verification. The existing five-attempt cap remains.

## Deployment requirements

No deployment was performed. Before a future deployment, configure the six SMTP settings and `DATABASE_URL` in the hosting environment, retain Node.js runtime and strict TLS, allow outbound port 465 and PostgreSQL connectivity, and verify the authenticated notification scheduler's `CRON_SECRET`. `.env.local` is not deployed or committed. SMTP requires no new schema migration, but the four existing pending migrations must be reviewed and applied to the intended database before the current application can work. Complete the explicitly approved contact test and confirm mailbox arrival before treating delivery as verified.
