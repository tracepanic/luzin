import { classInstances } from "@/db/schema/classes";
import { teacherSubjectClasses } from "@/db/schema/teachers";
import { timestamps } from "@/db/schema/timestamps";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const subjects = pgTable("subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").unique().notNull(),
  ...timestamps,
});

export const subjectClasses = pgTable(
  "subject_classes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    classInstanceId: text("class_instance_id")
      .notNull()
      .references(() => classInstances.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("subject_class_instance_idx").on(
      table.subjectId,
      table.classInstanceId,
    ),
  ],
);

export const subjectsRelations = relations(subjects, ({ many }) => ({
  subjectClasses: many(subjectClasses),
}));

export const subjectClassesRelations = relations(
  subjectClasses,
  ({ one, many }) => ({
    subject: one(subjects, {
      fields: [subjectClasses.subjectId],
      references: [subjects.id],
    }),
    classInstance: one(classInstances, {
      fields: [subjectClasses.classInstanceId],
      references: [classInstances.id],
    }),
    teachers: many(teacherSubjectClasses),
  }),
);
