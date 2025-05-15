CREATE TYPE "public"."attendee_role" AS ENUM('participant', 'organizer', 'observer');--> statement-breakpoint
CREATE TYPE "public"."attendee_status" AS ENUM('invited', 'accepted', 'declined', 'tentative');--> statement-breakpoint
CREATE TYPE "public"."event_scope" AS ENUM('global', 'targeted', 'class_instance', 'academic_year');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('lesson', 'exam', 'holiday', 'meeting', 'school_schedule', 'custom');--> statement-breakpoint
CREATE TABLE "attendees" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "attendee_status" NOT NULL,
	"role" "attendee_role" NOT NULL,
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "event_type" NOT NULL,
	"scope" "event_scope" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"string" text,
	"metadata" jsonb,
	"color" text DEFAULT '#0000FF' NOT NULL,
	"location" text,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"class_instance_id" text,
	"school_id" text NOT NULL,
	"academic_year_id" text,
	"host_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_class_instance_id_class_instances_id_fk" FOREIGN KEY ("class_instance_id") REFERENCES "public"."class_instances"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "event_user_idx" ON "attendees" USING btree ("event_id","user_id");