# Security review

## Confirmed public exposure

The GitHub repository is public. Four unrelated/internal DOCX/PDF documents, a captured HTML page and its support files were tracked under public. An untracked HTML download and operating-system ISO were also present. These were quarantined in ignored .private-assets; originals are preserved locally but are excluded from Git and Vercel. No confidential document contents are copied into reports.

History on main contains relevant asset commits a37fd73 (2026-10-03), 9351885 (2026-10-03) and a124197 (2026-10-09). Removal from this branch does not remove published history, forks, caches or existing deployments. Rewriting history and force pushes were not performed. The owner must review the exposed documents privately, remove old deployment copies where possible, and decide whether coordinated history cleanup is warranted. Rotate any credentials or private links discovered by that review; their presence/validity has not been asserted.

A filename-only credential-pattern scan matched downloaded page support files; minified downloaded content is not evidence of an active credential. That entire unreferenced browser capture was quarantined. Only .env.example is tracked as an environment file. These checks are not a complete historical secret scanner or a guarantee that no secret ever existed.

ASSET_INVENTORY.csv classifies every remaining public file and records source references/hashes. Absence of a source reference does not establish that a photograph is unused: database references must also be reviewed. ASSET_DUPLICATES.json records identical files; arbitrary portfolio deletion is avoided.

## API and persistence controls

- Form schemas are strict; request media type must be application/json, including when parameters are present.
- Form bodies are limited to 20 KB and webhook bodies to 256 KB, including chunked requests without Content-Length.
- Meta signatures use exact bytes before JSON parsing. Subscription token comparison is timing-safe.
- Webhook shape/array lengths and text sizes are validated; repeated message IDs are transactionally deduplicated.
- Shared identity rate limits are atomic PostgreSQL buckets. This is not a replacement for edge/IP abuse protection.
- Unique idempotency keys and conditional notification claims control races. Public success acknowledges saved enquiries, not confirmed delivery.
- Worker authentication fails closed without a 32-character CRON_SECRET and checks a hashed bearer credential with timingSafeEqual. No secret is returned in responses.
- WhatsApp has a bounded timeout. Uncertain outcomes require reconciliation. Email retains escaped HTML, timeout and provider idempotency.
- API responses disable caching through Next headers; nosniff, referrer, framing and permissions headers are configured.
- No unauthenticated administrative content write endpoint exists. Staff publishing requires externally provisioned named identities and restricted database permissions.

## Customer data

Names/contact details and enquiry/event content are persisted; internal notification providers receive information needed to notify MMS staff. WhatsApp text messages are stored by conversation. Webhook audit records retain type/identifiers rather than copying raw customer message bodies. Logs use safe identifiers/types/counts rather than request payloads or provider error text. The privacy notice describes these behaviours and the limits of deletion.

Retention requires an owner-approved RETENTION_DAYS and an explicit operator --apply. The default command only reports aggregate counts. No retention deletion was executed. Email/WhatsApp/backups require separate retention/deletion procedures. Least-privileged application, content-editor and migration roles must be configured by the database owner.

## Dependency audit

Initial production audit: 7 findings (1 critical, 5 high, 1 moderate), including Next.js 16.3.3. A non-breaking npm audit fix removed the critical advisory and the sharp/source-map findings. The deepmerge-ts risk in Prisma configuration was fixed with a patched version 8 override. Prisma generation/validation, TypeScript, unit tests and the Next 16.4.2 production build passed. Final production-only audit reports zero vulnerabilities; the full development tree retains 24 findings (19 moderate, 5 high). Dev-tool advisories must be reported separately, not hidden by production-only scanning. No forced Prisma/Jest/ESLint downgrade or major migration was applied.

## Required operational actions

Before production: review historical exposure; secure/private backup the quarantine; apply reviewed additive migrations; reconcile content; provision staff roles; configure scheduler, provider credentials and monitoring; add edge/IP abuse limits; confirm backup and restore procedures; approve retention and privacy wording. Do not assume any of these are operational merely because code/configuration exists. See DEPLOYMENT_CHECKLIST.md and REMAINING_WORK.md.

