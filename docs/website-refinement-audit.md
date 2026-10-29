# Website refinement audit — 24 October 2026

## Stage A: confirmed baseline

The existing Next.js 16.4.2 / React 19 design, brand palette, fonts, media, motion, page order, five-step brief builder and dedicated conference form are retained. Existing workspace changes predate this audit and are preserved.

Before implementation: production build, ESLint, TypeScript, production dependency audit, media-reference check and 24 unit suites / 265 tests passed. Chromium inspected ten public pages at 390px and 1440px: HTTP 200, no page errors or horizontal overflow. Lazy-loaded images still require a full scroll inspection. Evidence: `.cache/refinement-before/` (local, ignored).

| Priority | Confirmed finding | Business impact / proposed correction |
| --- | --- | --- |
| High | Live www sitemap returns an empty URL set; robots.txt omits sitemap when SITE_URL is absent. | Restore public-page discovery with the established www production origin, retaining published catalogue URLs when available. |
| High | Homepage asserts “100% Protected” payments and 24-hour average response; About/conference pages assert insurance and drone certification without supporting records. | Replace unsupported guarantees with descriptions of the enquiry/planning process. Owner must verify credentials before publishing claims. |
| High | Visual QA found widespread caption/category mismatches across the 66 gallery photographs: food presented as conference sessions, portraits as aerial footage and a graduation photograph with wedding attribution. | Keep the images, correct visible-subject descriptions and categories, and distinguish reference artwork from asserted commissioned work. Database-backed case-study associations require separate owner review. |
| Medium | David K. testimonial displays JP; other testimonials, portraits and quantified results lack approval evidence. | Remove inconsistent fallback initials. Record quotes/results/portraits as requiring owner verification; do not fabricate identities or rewrite quotations. |
| Medium | Homepage/Privacy and dynamic service/project detail pages lack explicit canonical URLs. Many social metadata fields are inherited rather than page-specific. | Add consistent per-page canonical and sharing metadata. |
| Medium | Homepage service cards mostly return to the general service listing. | Link to the corresponding service or conference destination. |
| Medium | Homepage workflow ends with a wedding-film promise despite serving corporate audiences. | Describe briefing, planning, delivery and agreed outputs across service categories. |
| Medium | Contact says WhatsApp is available on request although the builder has a configured public number. | Reuse that central configuration in a direct contact link. |
| Medium | Several major pages lack a main landmark; no skip link is available. | Add semantic main landmarks and a keyboard-only skip link without changing layout. |
| Medium | No-JavaScript gallery content was unusable; desktop pinning/refresh could drop carousel keyboard focus. | Provide ordinary static photograph links before hydration and preserve focus around the existing animation lifecycle. |
| Medium | Gallery category state is initialised from the URL only; filtering does not update shareable URLs. Project “View More Projects” links to a different gallery instead of revealing remaining records. | Synchronise gallery filters with browser history and reveal the remaining published projects in place. |
| Medium | A rapidly clicked fading gallery tile could select an invalid position after a category change; the Services cold-spark photo returned an image-optimizer 404. | Select lightbox photographs by source identity and encode the existing media URL; add browser regression and image-load checks. |
| Medium | Jest discovers ignored cached copies of Playwright tests when run without explicit paths. | Exclude cache/private/build artefacts so the documented test command runs the actual project tests. |
| Medium | Conference input lengths and phone constraints do not match server bounds; delegate counts are unvalidated free text on the server. | Align browser constraints and reject invalid counts before persistence. |

## Domain and integration boundaries

Public HTTP checks on 24 October 2026: apex `/`, `/robots.txt` and `/sitemap.xml` return 308 to the equivalent www paths; www homepage returns 200. No hosting or DNS change is needed on that evidence. Direct DNS inspection was unavailable in this environment.

PostgreSQL/Prisma remains authoritative for published services/projects. No production database writes, migrations, real enquiries, emails or WhatsApp messages are authorised for testing. Docker's daemon is unavailable locally. Provider behavior is reviewed in code and exercised with mocks; live provider delivery and durable persistence remain separate release checks. Never infer current production state from older reports in this repository.

## Owner verification queue

- Approval and original source for every testimonial (David K., Tanya, Sarah M., Maria R., Alex T.), portrait consent, ratings and the 50,000+ viewer claim.
- Evidence for historical project names, dates, clients and deliverables, including the named spirits-brand campaign; confirm which media is commissioned work versus illustrative/reference material.
- Evidence for event totals, hours delivered, institutional-client counts and average ratings displayed by the Projects page.
- Current insurance, operator credentials and location-specific drone permissions; supported equipment configurations and production staffing capacity.
- Actual enquiry response expectations; booking/payment terms and any payment-provider protections.
- Confirm ownership and monitoring of the already configured WhatsApp number and enquiry inbox, scheduler operation, privacy/retention policy and operational alert ownership.

Implementation and final evidence are recorded in `website-refinement-report.md`.
