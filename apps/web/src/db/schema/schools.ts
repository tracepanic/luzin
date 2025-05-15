import { admins } from "@/db/schema/admins";
import { classes } from "@/db/schema/classes";
import { events } from "@/db/schema/events";
import { invites } from "@/db/schema/invites";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";
import { timestamps } from "@/db/schema/timestamps";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const schools = pgTable("schools", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull().unique(),
  description: text("description"),
  ...timestamps,
});

export const schoolsRelations = relations(schools, ({ many }) => ({
  admins: many(admins),
  classes: many(classes),
  students: many(students),
  teachers: many(teachers),
  invites: many(invites),
  events: many(events),
}));
