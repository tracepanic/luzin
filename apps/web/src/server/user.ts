import { db } from "@/db";
import { users } from "@/db/schema/users";
import { UserRoleType } from "@/lib/types";
import { NotFoundException } from "@repo/actionkit";
import { eq } from "drizzle-orm";

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
