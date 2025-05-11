import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    DATABASE_URL: z.string().url().startsWith("postgresql://"),
    SESSION_SECRET: z.string(),
    RESEND_API_KEY: z.string().startsWith("re_"),
  },
  experimental__runtimeEnv: process.env,
});
