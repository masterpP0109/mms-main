-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
