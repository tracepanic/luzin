import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/schema/timestamps";
import { createId } from "@paralleldrive/cuid2";

export const verifications = pgTable("verifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").unique().notNull(),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  ...timestamps,
});
