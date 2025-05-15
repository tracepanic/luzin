ALTER TABLE "events" RENAME COLUMN "string" TO "rrule";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "duration" text NOT NULL;