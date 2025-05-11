import { schools } from "@/db/schema/schools";
import { studentClasses } from "@/db/schema/students";
import { subjectClasses } from "@/db/schema/subjects";
import { timestamps } from "@/db/schema/timestamps";
import { academicYears } from "@/db/schema/years";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const classes = pgTable(
  "classes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    schoolId: text("school_id")
      .notNull()
      .references(() => schools.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("school_class_name_idx").on(table.name, table.schoolId),
  ],
);

export const classInstances = pgTable(
  "class_instances",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    academicYearId: text("academic_year_id")
      .notNull()
      .references(() => academicYears.id, { onDelete: "cascade" }),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("academic_year_class_idx").on(
      table.academicYearId,
      table.classId,
    ),
  ],
);

export const classesRelations = relations(classes, ({ one, many }) => ({
  school: one(schools, {
    fields: [classes.schoolId],
    references: [schools.id],
  }),
  classInstances: many(classInstances),
}));

export const classInstancesRelations = relations(
  classInstances,
  ({ one, many }) => ({
    academicYear: one(academicYears, {
      fields: [classInstances.academicYearId],
      references: [academicYears.id],
    }),
    classes: one(classes, {
      fields: [classInstances.classId],
      references: [classes.id],
    }),
    students: many(studentClasses),
    subjects: many(subjectClasses),
  }),
);
