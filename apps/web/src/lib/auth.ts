import { db } from "@/db";
import { accounts } from "@/db/schema/accounts";
import { sessions } from "@/db/schema/sessions";
import { users } from "@/db/schema/users";
import { verifications } from "@/db/schema/verifications";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

const drizzleSchemas = { users, accounts, sessions, verifications };

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: drizzleSchemas,
  }),
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: true,
      },
    },
  },
  session: {
    modelName: "sessions",
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
  emailAndPassword: {
    enabled: true,
  },
  advanced: { database: { generateId: false } },
  plugins: [nextCookies()],
});
