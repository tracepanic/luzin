"use server";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { UserRoleType } from "@/lib/types";
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from "@repo/actionkit";
import { eq } from "drizzle-orm";

export async function getUserRole(userId: string): Promise<UserRoleType> {
  try {
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
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException("User not found", error);
  }
}
