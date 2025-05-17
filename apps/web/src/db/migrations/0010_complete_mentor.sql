ALTER TABLE "invites" DROP CONSTRAINT "invites_school_id_schools_id_fk";
--> statement-breakpoint
DROP INDEX "email_school_idx";--> statement-breakpoint
ALTER TABLE "invites" DROP COLUMN "school_id";