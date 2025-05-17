ALTER TABLE "class_instances" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "class_instances" ADD CONSTRAINT "class_instances_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_name_unique" UNIQUE("name");