# Remaining work

- Recheck CI on the final review-branch head. The first CI run passed real PostgreSQL integration and all 14 browser journeys; local Docker remains unavailable. See TEST_REPORT.md.
- Review and apply production migrations in staging first, back up the database, and reconcile/import approved catalogue content. The configured database currently has zero Service/Project rows. Imports preserve existing edits and must not be pointed at production casually.
- Configure and verify the five-minute scheduler, strong CRON_SECRET, notification providers, alert ownership and edge/IP abuse limits before deploying asynchronous enquiries. Saved work depends on an operational worker.
- Provision named staff identities and content-only permissions in an authenticated managed database editor. The role template is provided; no custom CMS is required.
- Confirm grouping and marketing/media approvals for all eleven business offerings represented by the eight existing service groups. Do not invent missing business copy or project claims.
- Review historical public document exposure, old deployments/caches and any private credentials/links in quarantined material. History cleanup requires separate authorisation. Back up private originals securely outside this checkout.
- Approve retention/privacy wording and separately manage provider/backup deletion. No retention deletion has run.
- Review the remaining development-tool dependency advisories. Production-only audit is clean; the entire development tree is not.
- Collect production field performance and representative INP, and complete broader accessibility/visual acceptance. Local synthetic measurements have explicit limits.
- Review and merge the improvement PR only after CI and operational gates pass. No main merge, production deployment or history rewrite was performed.

Seven proven unreferenced duplicates and the two remaining nonstandard downloads have been privately archived. Two duplicate groups remain intentionally because their paths are referenced; unreferenced photographs are otherwise preserved.
