"use server";

import { auth } from "@/lib/auth";
import type { User } from "better-auth";
import { headers } from "next/headers";

export async function validateUserIsAdmin(): Promise<User> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (
      !session ||
      !session.user ||
      !session.user.role ||
      session.user.role !== "admin"
    ) {
      throw new Error("User is unauthorized");
    }

    return session.user;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("User is unauthorized");
  }
}
