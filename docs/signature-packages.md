# Signature Experiences

Routes: `/packages`, `/packages/weddings`, `/packages/drone`, `/packages/podcasts`.
The homepage replaces its standalone wedding feature with the three-category
Signature Experiences section between Services and Featured Work. The services
catalogue retains its wedding feature and all existing service URLs.

## Editorial approval

`lib/packages.ts` is the single configuration for names, copy, visual references,
benefits, comparison cards, enhancements, process, FAQs and approved proof.
The proposed options describe briefs to discuss, not fixed commercial offers.
Before marketing them as fixed packages, MMS must approve:

- Package names, scope, coverage time, crew, deliverables and revisions.
- Pricing, travel, licensing, booking/cancellation and delivery terms.
- Drone safety, permission review responsibilities and weather contingencies.
- Podcast location/studio, equipment, participant arrangements and distribution.
- Actual project references or testimonials, with client sharing permission.

Images are existing library assets, clearly labelled illustrative. No new client
projects, testimonials, prices, availability or production guarantees are asserted.
`approvedProof` is empty until MMS supplies approved evidence; the pages link to
the existing published work collection and invite sample requests in the meantime.

## Lead capture

The forms reuse `/api/leads`, `submitEnquiry`, idempotency keys, Prisma Lead rows,
the durable email outbox, independent staff/customer processing and recovery worker.
No schema migration or second backend is needed. `source` remains `contact`.

The strict package schema validates category/option pairs and calendar dates.
The server derives service, package label and source route from the configuration.
Lead metadata includes `service`, `packageId`, `packageName`, `date`, `origin` and
allowlisted attribution. Project details remain in the existing `message` field.
Both email templates include the selected package and date. Campaign data and
project details appear only in internal staff notifications, not customer summaries.
A successful response confirms persistence, not mailbox delivery or a booking.

Package links accept `?package=<id>&preferred_date=YYYY-MM-DD&details=<text>`.
Unknown options fall back to a tailored brief. Users can edit the preference, date
and details in the form. Existing contact/conference/builder requests remain valid.

## Attribution and conversion integrations

`CampaignCapture` records the last campaign touch on entry and retains it across
internal navigation in session storage for 30 minutes. No full referring URLs or
personal form details are stored there. If storage is blocked, direct URL attribution
still works and the enquiry can proceed. Allowlisted keys: `utm_source`, `utm_medium`,
`utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `gclid`, `gbraid`, `wbraid`, `fbclid`.
Do not put customer details in campaign parameters.

No advertising or analytics scripts are installed by this feature. The site's
consent integration must set `window.mmsAnalyticsConsent = true` only after consent,
and set it to false on withdrawal. Until then no conversion events are emitted.
After consent, `lib/package-analytics.ts` pushes a dataLayer event and dispatches
`mms:conversion`. Configure a GTM custom-event trigger to forward `generate_lead`
to GA4 after the API confirms a saved enquiry. See Google's [recommended events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead).
The payload has category, package ID, source and method; it excludes personal data,
project text, URL parameters and click identifiers. No invented monetary value is sent.

Future Meta Pixel / Google Ads adapters can consume the same consent-gated event.
Avoid duplicate tracking when mapping it through more than one integration. Keep
server credentials out of browser code. Configure account IDs/tags in the approved
consent/tag-management system; this feature does not activate advertising tracking.

## SEO and release

Each page has distinct metadata, canonical URL and Open Graph/Twitter imagery.
Structured data describes the Service and breadcrumbs, or the overview collection;
there are no unapproved offers, ratings or testimonials in structured data.
Keep `SITE_URL=https://www.mosimediasolutions.com` in production so canonical,
Open Graph, JSON-LD and sitemap URLs resolve to the intended domain.

Use the existing GitHub pull-request quality workflow. It provisions isolated
PostgreSQL, runs migrations, integration/recovery checks, lint, types, Jest,
media checks, build and Playwright. Local package browser tests intercept submissions;
they do not send emails. Actual provider acceptance and inbox delivery must be
verified separately in an approved environment before claiming delivery.
