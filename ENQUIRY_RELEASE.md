# MMS enquiry completion

## Behaviour

Contact, conference and project-builder enquiries save before email attempts. Each new web enquiry with a valid customer email schedules two independent emails: the MMS notification and the customer acknowledgement. Both use responsive, single-column dark/gold HTML with plain-text alternatives, enquiry reference, stored UTC submission time, full message and readable builder selections. No acknowledgement claims a human has already read the enquiry or promises a response time.

From is always the authenticated Titan mailbox. MMS notification To is CONTACT_EMAIL_TO and Reply-To is the validated customer address. Customer acknowledgement To is the submitted email; Reply-To is the authenticated MMS mailbox. Phone-only/WhatsApp records do not trigger customer acknowledgement. Addresses, messages and credentials are never logged. Existing strict validation, honeypots, bounded body reads, same-origin checks, shared database rate limits and persisted tab retry keys remain active. Perimeter bot protection remains an operational control; an acknowledgement does not verify ownership of the submitted address.

Saving and SMTP acceptance are distinct. A customer acknowledgement failure cannot erase the enquiry, mark the accepted staff notification failed, or cause the browser to request resubmission. Success screens display the reference and acknowledge storage only. SMTP acceptance is not confirmed inbox delivery.

## Environment: local and Vercel

Use the existing server-only variables: SMTP_HOST=smtp.titan.email, SMTP_PORT=465, SMTP_SECURE=true, SMTP_USER=info@mosimediasolutions.com, SMTP_PASSWORD (secret), CONTACT_EMAIL_TO=info@mosimediasolutions.com, and DATABASE_URL. No new SMTP secret is required for acknowledgements. Set these independently for local/preview/production. Never commit .env.local or prefix secrets with NEXT_PUBLIC_. DATABASE_URL_UNPOOLED may be used by the existing local Prisma configuration; follow the database provider's migration guidance. SITE_URL should be https://www.mosimediasolutions.com for production canonical metadata.

The authenticated recovery worker requires CRON_SECRET (at least 32 random characters) and the existing external scheduler calling /api/internal/notifications with an Authorization bearer header. Vercel Hobby has no five-minute cron in this repository. Verify the recovery schedule and monitor pending work and attention counts before production release. Initial web submissions await both independent email attempts; recovery never blindly replays uncertain SMTP sends.

## Additive migration and recovery

Review and apply prisma/migrations/20261020000000_customer_acknowledgements/migration.sql in an isolated/staging database before releasing the code. It adds acknowledgementStatus, acknowledgementProviderId, acknowledgementAttempts and acknowledgementError plus a queue index. Existing enquiries default to not_requested: migration never sends historical customer emails. No customer records are deleted or rewritten.

The worker claims each message atomically, caps attempts at five, backs off safe failures and processes staff/customer statuses independently. Explicit rejection/configuration failures become retry_required. Disconnects/timeouts with uncertain acceptance become reconciliation_required; crashes after send can leave sending. Reconcile Titan before replaying either. A stable per-channel Message-ID helps reconciliation but is not an SMTP deduplication guarantee.

Staff email: npm run notifications:retry -- LEAD_ID

Customer email only: node --conditions=react-server scripts/retry-acknowledgement.cjs LEAD_ID

The customer command never resends the MMS notification. --confirmed-not-accepted is reserved for operator-reviewed uncertain sends. Accepted/not_requested/sending records are refused. Attempt caps still apply; do not clear status or locks to bypass them.

Rollback: restore the preceding application version while retaining the additive columns and all enquiry records. Pause recovery scheduling while reconciling sending/reconciliation_required states. Do not drop columns with acceptance history or blindly replay pending/uncertain messages.

## Review and CI/CD

Follow the existing pull-request process into main. Quality checks run for pull_request and pushes to main. The workflow provisions isolated PostgreSQL and runs migrations, content import, integration, lint, typecheck, Jest, media checks, production build, production audit and Playwright. Keep existing unrelated local changes outside this commit. Do not merge or change production DNS, SMTP credentials or database records as part of preparing the review branch.

Local verification commands: npm run db:generate; npm run lint; npm run typecheck; npm test -- --runInBand; npm run media:check; npm run build; npm run test:e2e. Database integration must use an isolated local/CI database ending in _test, never production. Email-render browser fixtures are synthetic and produce screenshots under ignored test-results.

Live verification must use an explicitly approved test recipient. Confirm the saved reference, staff acceptance and customer acceptance independently, then confirm inbox/spam arrival with both recipients. Do not treat unit tests, SMTP authentication, a preview build or an SMTP 250 response as proof of final delivery.

For a clearly labelled template-only SMTP test (no enquiry/database writes): `node --conditions=react-server scripts/test-enquiry-emails.cjs --confirm-send`. Both templates go to MMS by default. To test a separately approved customer mailbox, add `--customer-email=APPROVED_ADDRESS`. The ignored exclusive `.cache/enquiry-template-test-once.json` guard prevents repeated sends and records partial acceptance without credentials. Reconcile any prior attempt before repeating. A self-test verifies SMTP acceptance to MMS, not external customer delivery or the full database-backed form flow.
