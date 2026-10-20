# MMS local integration debugging — 19 October 2026

No email was sent in this debugging pass. No database rows were inserted, updated or deleted. No migrations, database resets, certificate-store changes, Windows policy changes or production deployment were performed. The rotated SMTP credential was stored only in Git-ignored `.env.local`; no credential value or password hash is included here.

## SMTP result

`npm.cmd run email:verify` passed when run with outbound network access outside the restricted Windows execution context. The effective host is `smtp.titan.email`, port `465`, implicit TLS is enabled, and certificate verification is enabled. Username, From and recipient all match the intended `info@mosimediasolutions.com` mailbox. `SMTP_SECURE=true` is validated; `false` is rejected. All six effective SMTP settings matched the parsed `.env.local` entries. Neither their passwords nor fingerprints were printed.

The updated credential resolved the previous `EAUTH` / SMTP `535` rejection. Verification checks connection and authentication only; it does not send a message, test final message acceptance or prove inbox delivery. The standalone verifier does not import the database client.

Titan's official settings and third-party access guidance: https://support.titan.email/hc/en-us/articles/900001311526-Configure-Titan-Mail-on-Outlook .

## Database result

Provider: **Prisma Postgres**, direct TCP endpoint `db.prisma.io:5432`. Prisma CLI, generated client and installed client are **6.19.3**. No driver or Prisma version replacement was needed.

The configured URL specified `sslmode=require`, with no custom client identity/certificate and no explicit `sslaccept`. Prisma v6's strict verification must be requested separately. The application and diagnostic now use `sslaccept=strict`; remote application URLs also require `sslmode=require`. No secret connection string was printed or changed in a production setting.

The same native Prisma engine, credentials and strict-TLS read-only query behave differently by execution context:

| Context | Result |
| --- | --- |
| Restricted Windows process | `SEC_E_NO_CREDENTIALS`: `No credentials are available in the security package (os error -2146893042)` |
| Normal process outside that restriction | `SELECT 1` succeeds with required TLS and strict certificate verification |

This comparison isolates the earlier failure to the restricted Windows execution/security context. It does not indicate an invalid database password or a need to disable certificate verification. The normal local Next server reaches the database and reports a schema error instead of the earlier TLS failure.

The diagnostic also observed `pg_stat_ssl.ssl=false` for the backend session. That field describes the managed service's backend hop; it does not describe client-to-proxy TLS. The client connection still requires TLS and strict certificate validation. No downgrade was made based on that field.

References: https://docs.prisma.io/docs/orm/v6/overview/databases/postgresql and https://www.prisma.io/docs/postgres/database/connecting-to-your-database .

## Remaining schema blocker

`npm.cmd run db:check -- --schema` reads only `information_schema.columns` and completed `_prisma_migrations` names. It found four existing migrations pending:

| Existing migration | Reviewed effects |
| --- | --- |
| `20261017010000_notification_attempts` | Adds email/WhatsApp attempt counters and indexes. Sets attempt metadata to 1 for existing `retry_required` rows. |
| `20261017020000_whatsapp_threads` | Adds contact/conversation/message tables and relationships; adds webhook message ID metadata/index. |
| `20261017030000_atomic_rate_limit` | Creates the rate-limit table and expiry index. |
| `20261017040000_content_metadata` | Adds content alt/SEO fields, defaults and timestamp triggers. |

These SQL files contain no DROP, TRUNCATE or DELETE statements. They still change the remote schema/metadata and were **not applied** in this read-only pass. No new migration was generated for SMTP.

Contact-critical missing schema includes `Lead.emailAttempts`, `Lead.whatsappAttempts` and the `RateLimit` table. The Services page returns `P2022`: `The column Service.heroAlt does not exist in the current database.` Project content metadata and WhatsApp-thread schema are also missing. The schema audit therefore exits nonzero even though connectivity passes.

## Live local HTTP checks

The production build was served outside the restricted Windows process. `npm.cmd run contact:check:local -- http://localhost:3300` returned:

| Check | Result |
| --- | --- |
| `GET /contact` | 200 — passed |
| `GET /services` | 500 — failed due to missing `Service.heroAlt` (`P2022`) |
| Cross-origin contact request | 403 — passed |
| Honeypot contact request | 422 — passed |
| Invalid visitor email | 422 — passed |

The command explicitly reported `enquirySubmitted=false` and `emailSent=false`. A valid live contact POST and Titan notification acceptance remain untested pending schema alignment and the user's explicit send request. Mocked tests exercise persistence verification, SMTP provenance, confirmation gates and check-only behavior without real sends.

## Review of the previous email change set

- Retained server-only transport, authenticated From, validated visitor Reply-To and unchanged escaped templates.
- Retained save-first storage, request validation/spam protection, atomic claims and honest acceptance/reconciliation statuses.
- Removed the combined test command's automatic email sending. Verification, direct one-time send, read-only HTTP checks and confirmed contact sending are now separate commands.
- Added exclusive one-time lock files so concurrent test processes cannot send twice. Existing test history is retained; ambiguous attempts are not silently replayed.
- Removed the unsafe assumption that Nodemailer's `CONN` error label proves no send happened. Installed Nodemailer source uses that label even for lost connections after DATA. Unknown connection loss now requires reconciliation.
- Consolidated CLI bootstrapping and enabled CommonJS/ES-module interop in the retry CLI, matching the working SMTP adapter.
- Removed redundant `@types/nodemailer`; Nodemailer 10 includes its own declarations. No unrelated dependency upgrades were made.
- Retained blank SMTP credentials in Playwright/integration/performance test processes to prevent accidental real sends. Those earlier changes are necessary safety adaptations to the provider replacement.
- Added strict remote PostgreSQL URL normalization without rewriting credentials, disabling validation, changing drivers or altering schema.

## Exact operational commands executed

Read-only inspection commands and source reads were used to review the repository. The reproducible dependency, diagnostic and validation commands were:

```text
node scripts/check-db.cjs
npm.cmd run db:check
npm.cmd run db:check -- --schema
npm.cmd run email:verify
npm.cmd uninstall --save-dev @types/nodemailer --cache .cache/npm --no-audit --no-fund
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test -- --runInBand
npm.cmd test -- --runInBand __tests__/smtp-email.test.ts __tests__/lead-persistence.test.ts __tests__/notification-worker.test.ts
npm.cmd test -- --runInBand __tests__/local-email-commands.test.ts
npm.cmd run lint -- lib/email/errors.ts scripts/check-db.cjs scripts/server-bootstrap.cjs scripts/smtp.cjs scripts/test-titan-smtp.cjs __tests__/smtp-email.test.ts
npm.cmd run lint -- scripts/test-titan-smtp.cjs
npm.cmd run build
npm.cmd run contact:check:local -- http://localhost:3300
git diff --check
git check-ignore .env.local
```

`db:check` was compared inside and outside the restricted process. SMTP verification used permitted outbound network access. Read-only database checks were repeated after sharing the application's strict URL policy. No send command was executed.

The owned local server was launched with this command, which disables its scheduler and WhatsApp credentials in memory:

```powershell
node -e "require('@next/env').loadEnvConfig(process.cwd(),true,{info(){},error(){}});const {spawn}=require('node:child_process');const child=spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','--hostname','127.0.0.1','--port','3300'],{stdio:'inherit',windowsHide:true,env:{...process.env,WHATSAPP_ACCESS_TOKEN:'',CRON_SECRET:''}});child.on('exit',code=>{process.exitCode=code||0});"
```

## Validation and next commands

Lint, type-checking and production build passed. The complete suite passed **200 tests across 19 suites**. Secret scanning found zero occurrences of the local SMTP credential in tracked or unignored files. `.env.local` remains ignored.

Independent verification, with no sending:

```text
npm run email:verify
npm run db:check
npm run db:check -- --schema
```

Explicit one-time SMTP message, **not executed**:

```text
npm run email:test:send -- --confirm-send
```

Complete local contact test after schema alignment and an explicit send request, **not executed**:

```text
npm run contact:test:local -- http://localhost:3300 --confirm-send
```

The contact command first verifies SMTP and the required `Lead`/`RateLimit` schema, then submits one labelled fixture with a fixed idempotency key, reads back the stored row, and processes only that notification. It verifies the accepted status and expected SMTP Message-ID rather than treating any historical provider's acceptance as Titan acceptance. Locks and atomic claims prevent duplicate notification attempts. The command never runs an unrelated notification batch.

## Deployment requirements

No deployment or production setting was changed. Before deployment, review/apply the four existing pending migrations to the intended database using the normal migration workflow; this was not performed here. Configure server-only SMTP settings and the database URL in the host, preserve Node.js runtime and strict TLS, allow outbound SMTP 465/database connectivity, and configure the authenticated notification scheduler's `CRON_SECRET`. Restart local servers after environment changes. Complete the requested live contact test and obtain recipient confirmation from Titan's inbox or spam folder before claiming delivery.
