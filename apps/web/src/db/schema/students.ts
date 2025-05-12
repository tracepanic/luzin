import { classInstances } from "@/db/schema/classes";
import { schools } from "@/db/schema/schools";
import { timestamps } from "@/db/schema/timestamps";
import { users } from "@/db/schema/users";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const students = pgTable(
  "students",
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
    uniqueIndex("student_school_idx").on(table.userId, table.schoolId),
  ],
);

export const studentClasses = pgTable(
  "student_classes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    studentId: text("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    classInstanceId: text("class_instance_id")
      .notNull()
      .references(() => classInstances.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    joinedAt: timestamp("joined_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    leftAt: timestamp("left_at", { mode: "date", withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("student_class_instance_idx").on(
      table.studentId,
      table.classInstanceId,
    ),
  ],
);

export const studentsRelations = relations(students, ({ one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
}));

export const studentClassesRelations = relations(studentClasses, ({ one }) => ({
  student: one(users, {
    fields: [studentClasses.studentId],
    references: [users.id],
  }),
  classInstance: one(classInstances, {
    fields: [studentClasses.classInstanceId],
    references: [classInstances.id],
  }),
}));
