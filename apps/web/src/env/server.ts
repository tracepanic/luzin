import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    SESSION_SECRET: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
