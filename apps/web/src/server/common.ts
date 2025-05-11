"use server";

import { auth } from "@/lib/auth";
import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from "@repo/actionkit";
import { headers } from "next/headers";

export async function validateUserIsAdmin() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      throw new UnauthorizedException();
    }

    if (!session.user.role || session.user.role !== "admin") {
      throw new ForbiddenException();
    }
  } catch (error) {
    throw new InternalServerErrorException();
  }
}
