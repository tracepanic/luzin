import { accounts } from "@/db/schema/accounts";
import { admins } from "@/db/schema/admins";
import { sessions } from "@/db/schema/sessions";
import { timestamps } from "@/db/schema/timestamps";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const userType = pgEnum("user_type", ["student", "teacher", "admin"]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  type: userType("type").notNull(),
  emailVerified: boolean("email_verified")
    .notNull()
    .$default(() => false),
  image: text("image"),
  ...timestamps,
});

export const userRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  adminProfile: one(admins, {
    fields: [users.id],
    references: [admins.userId],
  }),
}));
