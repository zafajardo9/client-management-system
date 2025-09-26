-- Transform share links to single token-based entries
ALTER TABLE "ShareLink" DROP CONSTRAINT IF EXISTS "ShareLink_slug_key";
ALTER TABLE "ShareLink" DROP CONSTRAINT IF EXISTS "ShareLink_projectId_slug_key";

ALTER TABLE "ShareLink"
  DROP COLUMN IF EXISTS "slug",
  DROP COLUMN IF EXISTS "passwordHash",
  DROP COLUMN IF EXISTS "visibility",
  DROP COLUMN IF EXISTS "tagFilter",
  DROP COLUMN IF EXISTS "revokedAt";

ALTER TABLE "ShareLink" ADD COLUMN IF NOT EXISTS "token" TEXT;
UPDATE "ShareLink" SET "token" = md5(random()::text || clock_timestamp()::text) WHERE "token" IS NULL;
ALTER TABLE "ShareLink" ALTER COLUMN "token" SET NOT NULL;
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_token_key" UNIQUE ("token");

DROP INDEX IF EXISTS "ShareLink_projectId_idx";
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_projectId_key" UNIQUE ("projectId");

ALTER TABLE "ShareLink" ALTER COLUMN "enabled" SET DEFAULT false;

ALTER TABLE "ShareLink" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now();
UPDATE "ShareLink" SET "updatedAt" = now() WHERE "updatedAt" IS NULL;
ALTER TABLE "ShareLink" ALTER COLUMN "updatedAt" SET NOT NULL;

DROP TYPE IF EXISTS "ShareVisibility";
