import { userRole } from "@/db/schema/_enums";
import { timestamps } from "@/db/schema/timestamps";
import { academicYears } from "@/db/schema/years";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const invites = pgTable("invites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull(),
  role: userRole().notNull(),
  link: text("link").unique().notNull(),
  used: boolean("used").notNull().default(false),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  academicYearId: text("academic_year_id").references(() => academicYears.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  ...timestamps,
});

export const invitesRelations = relations(invites, ({ one }) => ({
  academicYear: one(academicYears, {
    fields: [invites.academicYearId],
    references: [academicYears.id],
  }),
}));
