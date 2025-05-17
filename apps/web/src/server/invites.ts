"use server";

import { db } from "@/db";
import { invites } from "@/db/schema/invites";
import { academicYears } from "@/db/schema/years";
import { sendInviteEmail } from "@/emails";
import { InviteUserSchema } from "@/lib/schema";
import { Invite } from "@/lib/types";
import { validateUserIsAdmin } from "@/server/common";
import { createId } from "@paralleldrive/cuid2";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export async function adminInviteUser(
  values: z.infer<typeof InviteUserSchema>,
): Promise<boolean> {
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

    return true;
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

    return db.select().from(invites).orderBy(desc(invites.createdAt));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed get invites");
  }
}

export async function getInviteByLink(link: string): Promise<Invite> {
  try {
    if (!link) {
      throw new Error("Failed to get invite");
    }

    const res = await db
      .select()
      .from(invites)
      .where(eq(invites.link, link))
      .limit(1);

    if (res.length !== 1 || !res[0]) {
      throw new Error("Failed to get invite");
    }

    return res[0];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed get invite");
  }
}
