# Staff publishing with the existing database

## Architecture decision

Keep PostgreSQL as the single source for services and projects. For a small business catalogue, use the hosting provider's authenticated data editor with a restricted staff database role rather than building a second authentication and CMS application. No public admin route is exposed. The application has no unauthenticated write path for content. A hosted CMS can be added if the editing workload proves the need, after the provider and identities are configured.

## Activation prerequisites

The database owner must provision named staff identities using the provider's authenticated console or an approved database editor, enforce MFA where supported, and grant a content-only role. No shared owner credentials. Grant SELECT/INSERT/UPDATE on Service and Project, and schema usage/connect as required. Do not grant access to Lead, Contact, Conversation, Message, WebhookEvent or RateLimit. The application account and migration account must be separate. The repository does not create login passwords or provision production staff accounts.

This staff console is **not operational until those identities and permissions are configured and tested**. There is deliberately no partially secured application admin UI.

## Import and reconciliation

`npm run content:import` reads the approved code snapshots without touching the database. `--apply` imports missing slugs in a transaction; existing records are preserved. Before switching production listings to PostgreSQL, compare each existing record against the approved current website. Resolve differing titles, descriptions and galleries with MMS; do not overwrite staff edits or replace portfolio descriptions automatically. The older development seed now also leaves existing rows unchanged.

The current import contains eight grouped services and twelve projects. Videography/photography and conference-related categories remain grouped. Drone, podcast, 360 booth and effects currently appear as supplementary offerings. The requested eleven business offerings do not imply eleven new navigation pages. Any regrouping or claims about DJ availability and media must be approved by MMS; do not invent marketing content.

The metadata migration provides database-side UUID defaults and update timestamps for managed-editor writes. Existing IDs are preserved. Review docs/content-editor-role.sql; it provisions a NOLOGIN permission group only, never credentials.

## Editing

Edit title, description, category, heroImage, ordered gallery paths, features/tags, ctaLabel, sortOrder and published status. Slugs are permanent URLs: keep existing slugs stable. New slugs should use lowercase letters, numbers and hyphens. Use only existing public asset paths or review/upload approved assets through the repository; remote image hosts are not enabled. Set heroAlt and ordered galleryAlts for descriptive alternatives. galleryAlts must follow gallery ordering; empty alternatives fall back to page titles. Optional seoTitle and seoDescription override page metadata while preserving marketing copy.

Descriptions are rendered as text, not executable HTML. Page titles and descriptions derive from the same records. Listings and detail pages query published rows; unpublished/missing details return 404. Order uses sortOrder, then slug. Test edits in staging, verify media paths, preview both listing and detail, then publish.

## Recovery

Take a database backup before bulk edits or imports. Unpublish incorrect records while correcting them. Restore individual rows from a reviewed backup rather than reseeding over the catalogue. Historical code snapshots are import material only; runtime pages never silently fall back to them.
