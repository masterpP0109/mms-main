-- Optional metadata keeps approved existing titles and alternatives as fallbacks.
ALTER TABLE "Service" ADD COLUMN "heroAlt" TEXT, ADD COLUMN "galleryAlts" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], ADD COLUMN "seoTitle" TEXT, ADD COLUMN "seoDescription" TEXT;
ALTER TABLE "Project" ADD COLUMN "heroAlt" TEXT, ADD COLUMN "galleryAlts" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], ADD COLUMN "seoTitle" TEXT, ADD COLUMN "seoDescription" TEXT;

-- Database editor inserts need database-side IDs/defaults; old IDs remain intact.
ALTER TABLE "Service" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT, ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT, ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
CREATE FUNCTION mms_content_timestamp() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;
CREATE TRIGGER mms_service_timestamp BEFORE UPDATE ON "Service" FOR EACH ROW EXECUTE FUNCTION mms_content_timestamp();
CREATE TRIGGER mms_project_timestamp BEFORE UPDATE ON "Project" FOR EACH ROW EXECUTE FUNCTION mms_content_timestamp();
