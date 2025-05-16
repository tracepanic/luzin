import { db } from "@/db";
import { accounts } from "@/db/schema/accounts";
import { sessions } from "@/db/schema/sessions";
import { users } from "@/db/schema/users";
import { verifications } from "@/db/schema/verifications";
import { sendVerificationEmail } from "@/emails";
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
  plugins: [nextCookies()],
});
