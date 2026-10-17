# Implemented engineering improvements

## Architecture decisions

Keep one Next.js application, PostgreSQL, Resend and Meta. Lead rows also hold the two fixed notification work states, atomically persisted with the enquiry. A separate outbox table or queue product would add a cross-record invariant without adding value for these two channels. An authenticated bounded worker claims work with conditional updates; delivery is independent of the visitor request. There is no CRM application, unawaited background promise or custom public CMS.

PostgreSQL now supplies both catalogue listings and detail routes. Client view components preserve the existing composition and interactions. The code catalogue and extracted project snapshot are explicit import sources only. Content import inserts missing records without overwriting existing client edits. Production data reconciliation is mandatory before switching.

## Confirmed issues and fixes

| Issue / root cause | Implemented change | Main files |
| --- | --- | --- |
| Public business documents and browser downloads | Private quarantine, Git/deployment exclusions, complete inventory | .gitignore, .vercelignore, ASSET_INVENTORY.csv |
| Webhook unlimited input and unchecked JSON | Byte-bounded raw Buffer, Zod validation, exact signature input | lib/http.ts, app/api/webhooks/whatsapp/route.ts |
| Contact profile read from message instead of value | Match value.contacts by wa_id | app/api/webhooks/whatsapp/route.ts |
| Every WhatsApp message created a lead | Contact, continuing thread and message records, transactional deduplication | prisma/schema.prisma, webhook route, additive migrations |
| Visitor waits on provider sends | Save pending work and acknowledge persistence; authenticated scheduled worker | lib/leads.ts, app/api/internal/notifications/route.ts |
| Concurrent rate checks could all pass | Atomic PostgreSQL upsert bucket per normalised identity | lib/rate-limit.ts, additive migration |
| Meta request could hang | Ten-second AbortSignal timeout and response ID type validation | lib/providers/whatsapp.ts |
| Uncertain sends could be blindly replayed | WhatsApp reconciliation state, email attempt cap and safe retry age window | lib/leads.ts, worker |
| Identical genuine repeat enquiry suppressed | Clear client key only on validated persistence acknowledgement | lib/submission-key.ts, lib/submit-enquiry.ts |
| Three repeated form transport implementations | Shared timeout, response validation and retry handling | lib/submit-enquiry.ts, contact/conference forms, ProjectBriefBuilder |
| Content edits hidden by hardcoded overrides | One published database source for listings/details, stable stored slugs | lib/get-service.ts, services/projects pages and view components |
| Seed overwrote approved edits | Existing rows left unchanged | prisma/seed.mjs, scripts/import-current-content.cjs |
| Homepage mixed brief state with page composition | Extract ProjectBriefBuilder, HomeExperience and useHomeMotion; server page wrapper | app/components/home, app/page.tsx |
| Desktop listeners survived media-query changes | Media-query cleanup disposes resize/image handlers; mobile animation respects reduced motion | useHomeMotion.ts |
| Test image mock rendered text | Render actual img with source and alt; omit framework-only props | jest.setup.js |
| Vacuous assertions | Positive image/heading/control assertions and interval cleanup checks | homepage test suites |
| Missing media | Fix Falls banner URL; remove nonexistent DSC_7704 gallery entry | gallery, project import snapshot/seed |
| Oversized photographs | 37 JPEGs resized within 2560px at quality 88; originals archived, URLs preserved | scripts/optimize-media.mjs, MEDIA_OPTIMIZATION.json |
| Missing deployment reproducibility | Explicit scripts, lockfile, Prisma generation, additive migrations and isolated CI | package.json, .github/workflows/quality.yml |
| Inaccurate privacy expectations | Accurate notice and explicit dry-run retention CLI | app/privacy, scripts/retention.mjs |
| Metadata consistency | Page metadata, published-content sitemap, robots, optional content SEO/alt fields | app layouts/sitemap/robots, schema and metadata migration |

## Security dependency updates

The initial npm report confirmed a critical Next.js advisory and vulnerable sharp/source-map dependencies. Non-breaking audit fixes were applied without --force. See SECURITY_REVIEW.md and TEST_REPORT.md for final versions/results; no successful audit is assumed merely because packages installed.

## Limits and tradeoffs

- The worker processes three rows per call. At five-minute frequency this is suitable only for modest traffic; monitor backlog and adjust batch/frequency within function budgets if measured volume grows.
- Meta acceptance after a network failure is ambiguous. Manual reconciliation is safer than duplicate internal sends. Automatic retry is deliberately limited to safe email attempts.
- The identity limiter is atomic but cannot stop a distributed attacker rotating identities. Configure edge/IP abuse rules before launch.
- One continuing WhatsApp thread per phone avoids generating a new sales opportunity for each message. Staff decide when a later project is a new enquiry; this is not a CRM.
- The staff publishing workflow uses a restricted authenticated database editor. Named staff accounts/permissions must be provisioned outside the application; no custom administration UI is exposed.
- JPEG URLs remain stable for existing database references. Next Image negotiates modern formats; direct original URLs remain JPEG.
- No claimed Lighthouse, LCP, INP, CLS or JavaScript bundle improvement without measurements. See REMAINING_WORK.md for incomplete verification and operational setup.

Submission retries persist only a SHA-256 fingerprint and expiring UUID in session storage, allowing reload retries without storing raw form data. Signed Meta delivery events reconcile accepted outbound work, including out-of-order arrival. Gallery cards use native keyboard-accessible buttons with explicit focus styling.
