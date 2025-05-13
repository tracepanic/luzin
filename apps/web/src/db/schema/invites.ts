import { userRole } from "@/db/schema/_enums";
import { schools } from "@/db/schema/schools";
import { timestamps } from "@/db/schema/timestamps";
import { academicYears } from "@/db/schema/years";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const invites = pgTable(
  "invites",
  {
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
    schoolId: text("school_id").references(() => schools.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    academicYearId: text("academic_year_id").references(
      () => academicYears.id,
      {
        onDelete: "cascade",
        onUpdate: "cascade",
      },
    ),
    ...timestamps,
  },
  (table) => [uniqueIndex("email_school_idx").on(table.email, table.schoolId)],
);

export const invitesRelations = relations(invites, ({ one }) => ({
  school: one(schools, {
    fields: [invites.schoolId],
    references: [schools.id],
  }),
  academicYear: one(academicYears, {
    fields: [invites.academicYearId],
    references: [academicYears.id],
  }),
}));
