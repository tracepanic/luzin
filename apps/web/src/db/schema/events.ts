import { eventScope, eventType } from "@/db/schema/_enums";
import { attendees } from "@/db/schema/attendees";
import { classInstances } from "@/db/schema/classes";
import { schools } from "@/db/schema/schools";
import { timestamps } from "@/db/schema/timestamps";
import { users } from "@/db/schema/users";
import { academicYears } from "@/db/schema/years";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  type: eventType("type").notNull(),
  scope: eventScope("scope").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  rrule: text("rrule").notNull(),
  duration: text("duration").notNull(),
  metadata: jsonb("metadata"),
  location: text("location"),
  classInstanceId: text("class_instance_id").references(
    () => classInstances.id,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  ),
  schoolId: text("school_id")
    .notNull()
    .references(() => schools.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  academicYearId: text("academic_year_id").references(() => academicYears.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  hostId: text("host_id")
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  ...timestamps,
});

export const eventsRelations = relations(events, ({ many, one }) => ({
  attendees: many(attendees),
  host: one(users, {
    fields: [events.hostId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [events.schoolId],
    references: [schools.id],
  }),
  classInstance: one(classInstances, {
    fields: [events.classInstanceId],
    references: [classInstances.id],
  }),
  academicYear: one(academicYears, {
    fields: [events.academicYearId],
    references: [academicYears.id],
  }),
}));
