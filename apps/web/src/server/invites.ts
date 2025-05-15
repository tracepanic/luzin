"use server";

import { db } from "@/db";
import { invites } from "@/db/schema/invites";
import { sendInviteEmail } from "@/emails";
import { InviteUserSchema } from "@/lib/schema";
import { Invite } from "@/lib/types";
import { validateUserIsAdmin } from "@/server/common";
import { createId } from "@paralleldrive/cuid2";
import { asc } from "drizzle-orm";
import { z } from "zod";

export async function adminInviteUser(
  values: z.infer<typeof InviteUserSchema>,
) {
  try {
    const data = InviteUserSchema.parse(values);

    await validateUserIsAdmin();

    const link = createId();

    const res = await db
      .insert(invites)
      .values({ ...data, link })
      .returning();

    if (res.length !== 1 || !res[0]) {
      throw new Error("Failed to send invite");
    }

    await sendInviteEmail(res[0]);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to send invite");
  }
}

export async function adminGetInvites(): Promise<Invite[]> {
  try {
    await validateUserIsAdmin();

    return db.select().from(invites).orderBy(asc(invites.createdAt));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed get academic years");
  }
}
