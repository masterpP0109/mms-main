# Verification evidence

## Hands-on regression follow-up

The latest hosted integrations on 0c252f5 were green, including Vercel, CodeRabbit and Quality checks. Review findings were then independently checked while testing the new functionality. Confirmed fixes: the project modal's bottom Close button resolved to window.close; malformed optional referral parameters could block a valid contact enquiry; the origin path regex admitted excessive backtracking; missing WhatsApp configuration consumed its only send attempt despite no provider request.

The new tests cover valid/invalid referral paths, a bounded child-process regex near-match, configuration deferral without an attempt, recovery eligibility, project-modal closure without closing the tab, and a browser contact submission whose payload must pass the real server schema. The isolated integration runner additionally checks recovery with two concurrent workers and exactly one mocked provider call. No real provider notifications are sent by these tests.

Local unit run: 16 suites / 164 tests passed. Lint and TypeScript passed. The first browser launch correctly refused to replace an existing Next development server on port 3000; targeted mocked browser tests instead use an ignored local Playwright config pointing to that existing server. Final browser and CI outcomes are recorded in the PR after execution.

## Hosted checks follow-up

The earlier green Quality checks workflow did not mean all hosted integrations passed. Vercel's PR comment confirmed deployment validation rejected the five-minute cron on Hobby. Root vercel.json now has no native cron; the Pro-only example is separate and the external-scheduler requirement is explicit in DEPLOYMENT_CHECKLIST.md. No scheduler was activated or paid plan purchased.

CodeRabbit skipped its review because its default scope included 120 files, including deleted downloaded HTML/CSS/scripts. The new .coderabbit.yaml excludes public assets and the dependency lockfile, while retaining application code, tests, migrations, scripts and documentation. Asset removals remain documented in the inventories. Review status and CI validation after this follow-up must be read from the latest PR checks, not inferred from an earlier commit.

## Final local checks (2026-10-17)

- `npm run lint`: passed without diagnostics.
- `npm run typecheck`: Next route generation and TypeScript passed.
- `npm run test:coverage -- --runInBand`: 15 suites, 149 tests passed; configured critical-path coverage gates passed. Overall statement coverage is 44.25% and line coverage 46.09%; this is not complete UI coverage. Lead persistence has 94% statement / 95.65% line coverage; shared form transport has 100% coverage; submission-key handling has 100% line coverage.
- `npm run build`: passed on Next 16.4.2, including static generation, route collection and TypeScript. Existing Google fonts required approved network access.
- `git diff --check`: passed.
- Chromium: six homepage widths (320, 375, 390, 768, 1024, 1440) passed overflow checks and screenshot capture. Targeted gallery keyboard/filter/focus, contact, conference, five-step brief builder and mobile navigation journeys passed. The additional contact retry/reload/acknowledged-repeat journey passed after correcting an ambiguous test alert locator. Database-backed catalogue journeys are explicitly skipped locally without an isolated test database.
- The complete browser suite has not yet passed in one final run; individual successful journeys do not establish that result. Screenshots and traces are test artifacts, not an accessibility certification.
- Read-only configured content-database check: zero services and zero projects. The reviewed import is mandatory before enabling database-authoritative catalogues; no production content was written.
- Content import dry run: 8 grouped services / 12 projects, existing slugs preserved.
- 37 oversized photographs: 424,935,796 bytes reduced to 28,524,967, originals privately preserved. Seven byte-identical unreferenced duplicates archived after code/database-reference checks. Final public directory: 217 files / 213,368,566 bytes (includes three pre-existing untracked user photographs).

## Database and CI limitations

Docker is installed but its daemon is unavailable (named pipe not found). The local PostgreSQL integration runner was therefore not executed. It accepts only a local database ending in `_test`, disables providers, and verifies concurrent idempotency, pending work, signed webhook deduplication/conversation grouping and editable published content. No production migration, provider send or retention deletion was performed.

GitHub Actions provisions PostgreSQL 16, applies migrations, imports content, runs integration/unit/browser checks and builds. Configuration alone is not a completed CI run; record the actual review-branch run separately. CI uses its own test credentials.

## Dependency evidence

Production audit after targeted updates: zero vulnerabilities. Next 16.4.2, sharp 0.35.5 and a patched deepmerge-ts 8 override replace the vulnerable production tree. Prisma remains on 6.19.3; generation, validation and production build compatibility were checked rather than forcing a major upgrade.

The full development tree still reports 24 advisories (19 moderate, 5 high), including tooling chains through ESLint/Jest. This is distinct from the clean production-only audit. No forced downgrade or major migration was applied.

## Baseline and corrected failures

Baseline: 11 suites / 123 tests and lint passed. Initial TypeScript failed in corrupted generated `.next/dev/types/validator.ts`; scoped regeneration fixed it without suppressions. The initial restricted build could not download fonts. An intermediate build encountered a stale generated Prisma client while schema work was ongoing; regeneration fixed it.

Browser test corrections included an incorrect navigation role, an ambiguous Contact link, counting paginated gallery cards, and matching Next's route announcer as a form alert. Those assertions were corrected against inspected traces. Earlier failures are not reported as successful full-suite runs.

## Performance

`npm run performance:measure` records a local production Chromium sample and its conditions in PERFORMANCE_REPORT.json. It is not a field measurement or Lighthouse score; INP requires representative interactions and is explicitly unmeasured. Production traffic, mobile throttling and a complete accessibility review remain release follow-up work.

Latest checks: media:check and Prisma schema validation passed. Production npm audit rechecked with network access: zero vulnerabilities. The first performance-helper attempt failed because Playwright was imported before setting its cache path; dynamic import fixed the helper. The completed local sample recorded LCP 9,588 ms, CLS 0, image transfer 448,714 bytes and JavaScript transfer 279,534 bytes. This slow local LCP remains a limitation; no before/after LCP improvement is claimed. The production desktop screenshot was visually inspected.

Final full local browser run before the gallery correction: 11 passed, 2 database journeys skipped, 1 gallery failure. The trace showed the initial filter click before hydration left All selected. Filters now remain disabled until hydrated; the targeted gallery filter, loaded-image, keyboard/Escape and focus-restoration journey passed after the fix. Draft review: https://github.com/masterpP0109/mms-main/pull/2 . CI execution is tracked there.

## Executed CI evidence

GitHub Actions run https://github.com/masterpP0109/mms-main/actions/runs/39019222521 passed all quality steps on commit 1ce7ed5: clean npm ci, PostgreSQL 16 migrations/import, real database integration, lint, TypeScript, 149 unit tests, static media references, production build, production audit and all 14 browser journeys (no database skips). The gallery hydration follow-up is additionally covered by its local targeted passing journey and will run through CI on the next push. Earlier local limitations above remain part of the execution history, not unresolved CI failures.
