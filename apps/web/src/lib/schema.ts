import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email().min(5).max(255),
  password: z.string().min(8).max(255),
});

export const CreateSchoolSchema = z.object({
  name: z.string().min(5).max(255),
});
