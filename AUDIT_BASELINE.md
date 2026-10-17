# MMS engineering baseline

Inspected 2026-10-17 on `improvement/mms-production-hardening`. This report describes the original checkout, before fixes. Existing untracked DJ photographs, HTML and ISO downloads are user files.

## Architecture

Next.js 16 App Router, React 19, TypeScript, PostgreSQL/Prisma 6, Resend and Meta WhatsApp. Public pages mix interactive client pages with database-backed detail routes. Lead rows contain notification status fields; notifications run during submission. A manual email retry CLI exists. No authenticated content administration or scheduled notification worker was present.

## Verified findings

| Severity | Finding and evidence | Files |
| --- | --- | --- |
| Critical | Four private/unrelated business documents are deployed under public; downloaded HTML is also present. An untracked operating-system ISO is under public. | public/mms/djServices, public/mms/ledScreens, public/services images |
| High | Webhook reads an unlimited body, casts JSON without runtime validation, and reads contacts from individual messages rather than value.contacts. | app/api/webhooks/whatsapp/route.ts |
| High | Every inbound WhatsApp message creates a separate lead. | app/api/webhooks/whatsapp/route.ts |
| High | Email and WhatsApp run during visitor requests; no automatic retry worker. WhatsApp has no timeout and uncertain sends are not distinguished from rejections. | lib/leads.ts, lib/providers/whatsapp.ts |
| High | Existing content edits are overridden by the hardcoded service catalogue. Project listings are hardcoded while details query PostgreSQL. | lib/get-service.ts, app/services/page.tsx, app/projects/page.tsx |
| Medium | Database count-based abuse protection is shared, but not atomic, and can be bypassed with different identities. | lib/leads.ts |
| Medium | Identical successful submissions reuse the client key for the entire page session, suppressing legitimate repeat enquiries. | lib/submission-key.ts |
| Medium | next/image test mock returns a string rather than a DOM image; coverage omits business logic. | jest.setup.js, jest.config.js |
| Medium | Homepage mixes multiple sections, animations and enquiry logic. | app/page.tsx |

Existing safeguards: enquiry request bodies are bounded; Zod validates form inputs; origin checking exists; email HTML is escaped; Resend has timeout and idempotency keys; duplicate lead inserts have unique constraints; webhook signatures are verified; retry CLI avoids blind retries after provider idempotency expiry. These are working safeguards, not missing implementations.

## Initial verification

- `npm.cmd test -- --runInBand`: 11 suites passed, 123 tests passed.
- `npm.cmd run lint`: passed (no diagnostics).
- `npx.cmd tsc --noEmit`: failed with TS1109 in generated `.next/dev/types/validator.ts`, lines 63 to 67. Required regeneration and recheck; subsequent checks passed without source suppressions (see TEST_REPORT.md).
- Production build: started; outcome recorded in TEST_REPORT.md when available.

## Limitations

No production database writes, provider sends, DNS edits or live deployment authorized by this audit. Customer records and environment secrets are not printed. Browser metrics, production scheduler activation, staff identity provisioning and historical credential validity require independent verification. A passing mock test suite is not proof of database integration or production readiness.
