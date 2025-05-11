"use server";

import { db } from "@/db";
import { admins } from "@/db/schema/admins";
import { schools } from "@/db/schema/school";
import { users } from "@/db/schema/users";
import { auth } from "@/lib/auth";
import { CreateSchoolSchema, SignupSchema } from "@/lib/schema";
import { UserRole, UserRoleType } from "@/lib/types";
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@repo/actionkit";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

export async function initializeLMS(
  user: z.infer<typeof SignupSchema>,
  school: z.infer<typeof CreateSchoolSchema>,
) {
  const validUser = SignupSchema.parse(user);
  const validSchool = CreateSchoolSchema.parse(school);

  const [dbUser, dbSchool] = await Promise.all([
    db.select().from(users).limit(1).execute(),
    db.select().from(schools).limit(1).execute(),
  ]);

  if (dbUser.length === 1 || dbSchool.length === 1) {
    throw new BadRequestException("LMS is already initialized");
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
    throw new BadRequestException("Failed to create user");
  }

  try {
    await db.transaction(async (tx) => {
      const scholId = await tx
        .insert(schools)
        .values({ name: validSchool.name })
        .returning({ id: schools.id });

      if (scholId.length !== 1 || !scholId[0]?.id) {
        throw new BadRequestException("Failed to create school");
      }

      const adminId = await tx
        .insert(admins)
        .values({ userId: response.user.id, schoolId: scholId[0].id })
        .returning({ id: admins.id });

      if (adminId.length !== 1 || !adminId[0]?.id) {
        throw new BadRequestException("Failed to create admin");
      }
    });
  } catch (error) {
    // Delete user created by better auth if this fails

    throw new InternalServerErrorException("Failed to initialize LMS", error);
  }

  await auth.api.sendVerificationEmail({
    headers: await headers(),
    body: {
      email: validUser.email,
      callbackURL: "/email-verification-successful",
    },
  });
}

export async function isLmsInitialized(): Promise<boolean> {
  const [dbUser, dbSchool] = await Promise.all([
    db.select().from(users).limit(1).execute(),
    db.select().from(schools).limit(1).execute(),
  ]);

  if (dbUser.length === 1 || dbSchool.length === 1) {
    return true;
  }

  return false;
}

export async function getUserRole(userId: string): Promise<UserRoleType> {
  const role = await db
    .select({
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (role.length !== 1 || !role[0]?.role) {
    throw new NotFoundException("User not found");
  }

  return role[0].role;
}
