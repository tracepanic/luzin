import { attendeeRole, attendeeStatus } from "@/db/schema/_enums";
import { events } from "@/db/schema/events";
import { timestamps } from "@/db/schema/timestamps";
import { users } from "@/db/schema/users";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const attendees = pgTable(
  "attendees",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    status: attendeeStatus("status").notNull(),
    role: attendeeRole("role").notNull(),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    ...timestamps,
  },
  (table) => [uniqueIndex("event_user_idx").on(table.eventId, table.userId)],
);

export const eventAttendeesRelations = relations(attendees, ({ one }) => ({
  event: one(events, {
    fields: [attendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [attendees.userId],
    references: [users.id],
  }),
}));
