import { userRole } from "@/db/schema/_enums";
import { accounts } from "@/db/schema/accounts";
import { admins } from "@/db/schema/admins";
import { attendees } from "@/db/schema/attendees";
import { events } from "@/db/schema/events";
import { sessions } from "@/db/schema/sessions";
import { students } from "@/db/schema/students";
import { teachers } from "@/db/schema/teachers";
import { timestamps } from "@/db/schema/timestamps";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  role: userRole("role").notNull(),
  emailVerified: boolean("email_verified")
    .notNull()
    .$default(() => false),
  image: text("image"),
  ...timestamps,
});

export const userRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  events: many(events),
  attending: many(attendees),
  adminProfile: one(admins, {
    fields: [users.id],
    references: [admins.userId],
  }),
  studentProfile: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  teacherProfile: one(teachers, {
    fields: [users.id],
    references: [teachers.userId],
  }),
}));
