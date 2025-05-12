"use server";

import { db } from "@/db";
import { academicYears } from "@/db/schema/years";
import { CreateAcademicYearSchema } from "@/lib/schema";
import { AcademicYear } from "@/lib/types";
import { validateUserIsAdmin } from "@/server/common";
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from "@repo/actionkit";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

export async function createAcademicYear(
  values: z.infer<typeof CreateAcademicYearSchema>,
) {
  try {
    const data = CreateAcademicYearSchema.parse(values);

    await validateUserIsAdmin();

    const res = await db
      .insert(academicYears)
      .values({ ...data })
      .returning({ id: academicYears.id });

    if (res.length !== 1 || !res[0]?.id) {
      throw new BadRequestException("Failed to create academic year");
    }
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException(
      "Failed to create academic year",
      error,
    );
  }
}

export async function getAcademicYears(): Promise<AcademicYear[]> {
  try {
    return db
      .select()
      .from(academicYears)
      .orderBy(asc(academicYears.createdAt));
  } catch (error) {
    throw new InternalServerErrorException("Failed get academic years", error);
  }
}

export async function getCurrentAcademicYear(): Promise<AcademicYear> {
  try {
    const res = await db
      .select()
      .from(academicYears)
      .where(eq(academicYears.isCurrent, true))
      .limit(1);

    if (res.length !== 1 || !res[0]) {
      throw new NotFoundException("No current academic year found");
    }

    return res[0];
  } catch (error) {
    throw new InternalServerErrorException(
      "Failed get current academic year",
      error,
    );
  }
}
