ALTER TABLE "events" ALTER COLUMN "string" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "host_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "starts_at";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "ends_at";