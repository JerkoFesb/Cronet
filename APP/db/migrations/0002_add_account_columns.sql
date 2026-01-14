-- Add fields expected by better-auth/drizzle adapter to `account` table
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "account_id" text NOT NULL;
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "access_token" text;
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "refresh_token" text;
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "id_token" text;
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "access_token_expires_at" timestamp;
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "refresh_token_expires_at" timestamp;
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "scope" text;
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now();
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();

-- Add index on user_id if missing (used by queries)
CREATE INDEX IF NOT EXISTS account_userId_idx ON "account" ("user_id");
