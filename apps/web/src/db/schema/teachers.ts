import { schools } from "@/db/schema/schools";
import { subjectClasses } from "@/db/schema/subjects";
import { timestamps } from "@/db/schema/timestamps";
import { users } from "@/db/schema/users";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const teachers = pgTable(
  "teachers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    schoolId: text("school_id")
      .notNull()
      .references(() => schools.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("teacher_school_idx").on(table.userId, table.schoolId),
  ],
);

export const teacherSubjectClasses = pgTable(
  "teacher_subject_classes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => teachers.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    subjectClassId: text("subject_class_id")
      .notNull()
      .references(() => subjectClasses.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("teacher_subject_class_idx").on(
      table.teacherId,
      table.subjectClassId,
    ),
  ],
);

export const teachersRelations = relations(teachers, ({ one }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [teachers.schoolId],
    references: [schools.id],
  }),
}));
