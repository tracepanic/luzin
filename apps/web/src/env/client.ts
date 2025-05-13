import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_EMAIL_DOMAIN: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_EMAIL_DOMAIN: process.env.NEXT_PUBLIC_EMAIL_DOMAIN,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
