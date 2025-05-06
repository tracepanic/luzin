import { admins } from "@/db/schema/admins";
import { timestamps } from "@/db/schema/timestamps";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const schools = pgTable("schools", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps,
});

export const schoolsRelations = relations(schools, ({ many }) => ({
  admins: many(admins),
}));
