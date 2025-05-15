import { classInstances } from "@/db/schema/classes";
import { events } from "@/db/schema/events";
import { invites } from "@/db/schema/invites";
import { students } from "@/db/schema/students";
import { timestamps } from "@/db/schema/timestamps";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const academicYears = pgTable(
  "academic_years",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull().unique(),
    isCurrent: boolean().notNull().default(false),
    startsAt: timestamp("starts_at", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    endsAt: timestamp("ends_at", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("academic_year_dates_idx").on(table.startsAt, table.endsAt),
  ],
);

export const academicYearsRelations = relations(academicYears, ({ many }) => ({
  students: many(students),
  classInstances: many(classInstances),
  invites: many(invites),
  events: many(events),
}));
