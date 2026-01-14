CREATE TABLE "provideri" (
	"id" text PRIMARY KEY NOT NULL,
	"provider_name" text NOT NULL,
	"package_name" text NOT NULL,
	"city" text NOT NULL,
	"region" text,
	"access_type" text NOT NULL,
	"download_mbps" integer NOT NULL,
	"upload_mbps" integer NOT NULL,
	"latency_ms" integer NOT NULL,
	"jitter_ms" integer NOT NULL,
	"packet_loss_percent" real NOT NULL,
	"cgnat" boolean NOT NULL,
	"ipv6_support" boolean NOT NULL,
	"price_eur" real NOT NULL,
	"installation_fee_eur" real NOT NULL,
	"contract_months" integer NOT NULL,
	"data_limit_gb" integer,
	"tv_included" boolean DEFAULT false,
	"phone_included" boolean DEFAULT false,
	"router_included" boolean DEFAULT true,
	"score_gaming" integer NOT NULL,
	"score_streaming" integer NOT NULL,
	"score_work" integer NOT NULL,
	"score_family" integer NOT NULL,
	"availability" text NOT NULL,
	"promotion_active" boolean DEFAULT false,
	"promotion_description" text,
	"website_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "id_token" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "access_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");