import { db } from "@/db";
import { accounts } from "@/db/schema/accounts";
import { sessions } from "@/db/schema/sessions";
import { users } from "@/db/schema/users";
import { verifications } from "@/db/schema/verifications";
import { sendVerificationEmail } from "@/emails";
import { getUserRole } from "@/server/user";
import { handleAction } from "@repo/actionkit";
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
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url);
    },
  },
  advanced: { database: { generateId: false } },
  plugins: [
    customSession(async ({ user, session }) => {
      // Right now we read from DB, we will definately need a cache for this
      const { data, success } = await handleAction(getUserRole, user.id);

      if (!success || !data) {
        return {
          session: null,
          user: null,
        };
      }

      return {
        session,
        user: {
          ...user,
          role: data,
        },
      };
    }),
    nextCookies(),
  ],
});
