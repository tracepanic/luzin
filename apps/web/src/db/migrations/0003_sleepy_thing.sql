ALTER TABLE "admins" DROP CONSTRAINT "admins_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "admins" DROP CONSTRAINT "admins_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "class_instances" DROP CONSTRAINT "class_instances_academic_year_id_academic_years_id_fk";
--> statement-breakpoint
ALTER TABLE "class_instances" DROP CONSTRAINT "class_instances_class_id_classes_id_fk";
--> statement-breakpoint
ALTER TABLE "classes" DROP CONSTRAINT "classes_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "student_classes" DROP CONSTRAINT "student_classes_student_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "student_classes" DROP CONSTRAINT "student_classes_class_instance_id_class_instances_id_fk";
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "subject_classes" DROP CONSTRAINT "subject_classes_subject_id_subjects_id_fk";
--> statement-breakpoint
ALTER TABLE "subject_classes" DROP CONSTRAINT "subject_classes_class_instance_id_class_instances_id_fk";
--> statement-breakpoint
ALTER TABLE "teacher_subject_classes" DROP CONSTRAINT "teacher_subject_classes_teacher_id_teachers_id_fk";
--> statement-breakpoint
ALTER TABLE "teacher_subject_classes" DROP CONSTRAINT "teacher_subject_classes_subject_class_id_subject_classes_id_fk";
--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "class_instances" ADD CONSTRAINT "class_instances_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "class_instances" ADD CONSTRAINT "class_instances_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_class_instance_id_class_instances_id_fk" FOREIGN KEY ("class_instance_id") REFERENCES "public"."class_instances"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subject_classes" ADD CONSTRAINT "subject_classes_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subject_classes" ADD CONSTRAINT "subject_classes_class_instance_id_class_instances_id_fk" FOREIGN KEY ("class_instance_id") REFERENCES "public"."class_instances"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "teacher_subject_classes" ADD CONSTRAINT "teacher_subject_classes_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "teacher_subject_classes" ADD CONSTRAINT "teacher_subject_classes_subject_class_id_subject_classes_id_fk" FOREIGN KEY ("subject_class_id") REFERENCES "public"."subject_classes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE cascade;