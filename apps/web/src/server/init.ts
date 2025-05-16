"use server";

import { db } from "@/db";
import { admins } from "@/db/schema/admins";
import { schools } from "@/db/schema/schools";
import { users } from "@/db/schema/users";
import { auth } from "@/lib/auth";
import { CreateSchoolSchema, SignupSchema } from "@/lib/schema";
import { UserRole } from "@/lib/types";
import { headers } from "next/headers";
import { z } from "zod";

export async function initializeLMS({
  user,
  school,
}: {
  user: z.infer<typeof SignupSchema>;
  school: z.infer<typeof CreateSchoolSchema>;
}) {
  try {
    const validUser = SignupSchema.parse(user);
    const validSchool = CreateSchoolSchema.parse(school);

    const [dbUser, dbSchool] = await Promise.all([
      db.select().from(users).limit(1).execute(),
      db.select().from(schools).limit(1).execute(),
    ]);

    if (dbUser.length === 1 || dbSchool.length === 1) {
      throw new Error("LMS is already initialized");
    }

    const response = await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: validUser.name,
        role: UserRole.ADMIN,
        email: validUser.email,
        password: validUser.password,
      },
    });

    if (!response.user.id) {
      throw new Error("Failed to create user");
    }

    try {
      await db.transaction(async (tx) => {
        const scholId = await tx
          .insert(schools)
          .values({ name: validSchool.name })
          .returning({ id: schools.id });

        if (scholId.length !== 1 || !scholId[0]?.id) {
          throw new Error("Failed to create school");
        }

        const adminId = await tx
          .insert(admins)
          .values({ userId: response.user.id, schoolId: scholId[0].id })
          .returning({ id: admins.id });

        if (adminId.length !== 1 || !adminId[0]?.id) {
          throw new Error("Failed to create admin");
        }
      });
    } catch {
      // Delete user created by better auth if this fails

      throw new Error("Failed to initialize LMS");
    }

    await auth.api.sendVerificationEmail({
      headers: await headers(),
      body: {
        email: validUser.email,
        callbackURL: "/email-verification-successful",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to initialize LMS");
  }
}

export async function isLmsInitialized(): Promise<boolean> {
  try {
    const [dbUser, dbSchool] = await Promise.all([
      db.select().from(users).limit(1).execute(),
      db.select().from(schools).limit(1).execute(),
    ]);

    if (dbUser.length !== 1 || dbSchool.length !== 1) {
      throw new Error("LMS already initialized");
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to get LMS status");
  }
}
