"use server";

import { db } from "@/db";
import { schools } from "@/db/schema/school";
import { users } from "@/db/schema/users";
import { CreateSchoolSchema, SignupSchema } from "@/lib/schema";
import { BadRequestException } from "@repo/actionkit";
import { z } from "zod";

export async function initializeLMS(
  user: z.infer<typeof SignupSchema>,
  school: z.infer<typeof CreateSchoolSchema>,
) {
  const validUser = SignupSchema.parse(user);
  const validSchool = CreateSchoolSchema.parse(school);

  const [dbUser, dbSchool] = await Promise.all([
    db.select().from(users).limit(1).execute,
    db.select().from(schools).limit(1).execute,
  ]);

  if (dbUser.length === 1 || dbSchool.length === 1) {
    throw new BadRequestException("LMS is already initialized");
  }

  // Do initialization
}
