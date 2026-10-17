-- Review/run through an authorised database owner; this creates no staff login.
CREATE ROLE mms_content_editor NOLOGIN;
GRANT USAGE ON SCHEMA public TO mms_content_editor;
GRANT SELECT, INSERT ON TABLE "Service", "Project" TO mms_content_editor;
GRANT UPDATE ("title", "category", "description", "heroImage", "heroAlt", "gallery", "galleryAlts", "features", "ctaLabel", "published", "sortOrder", "seoTitle", "seoDescription") ON "Service" TO mms_content_editor;
GRANT UPDATE ("title", "category", "description", "year", "heroImage", "heroAlt", "gallery", "galleryAlts", "tags", "published", "sortOrder", "seoTitle", "seoDescription") ON "Project" TO mms_content_editor;
-- IDs/slugs cannot be updated with this group; no enquiry/schema privileges are granted.
-- Provision individual authenticated logins separately and grant membership.
-- Verify those logins inherit no owner/other/PUBLIC privileges on customer tables.
