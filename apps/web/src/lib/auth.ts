import { db } from "@/db";
import { accounts } from "@/db/schema/accounts";
import { sessions } from "@/db/schema/sessions";
import { users } from "@/db/schema/users";
import { verifications } from "@/db/schema/verifications";
import { getUserRole } from "@/lib/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";

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
    cookieCache: {
      enabled: true,
    },
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  advanced: { database: { generateId: false } },
  plugins: [
    customSession(async ({ user, session }) => {
      // Right now we read from DB, we will need a cache for this later
      const role = await getUserRole(user.id);

      return {
        session,
        user: {
          ...user,
          role,
        },
      };
    }),
    nextCookies(),
  ],
});
