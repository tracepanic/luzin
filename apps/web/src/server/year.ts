"use server";

import { db } from "@/db";
import { academicYears } from "@/db/schema/years";
import { CreateAcademicYearSchema } from "@/lib/schema";
import { AcademicYear } from "@/lib/types";
import { validateUserIsAdmin } from "@/server/common";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export async function createAcademicYear(
  values: z.infer<typeof CreateAcademicYearSchema>,
): Promise<boolean> {
  try {
    const data = CreateAcademicYearSchema.parse(values);

    await validateUserIsAdmin();

    const res = await db
      .insert(academicYears)
      .values({ ...data })
      .returning({ id: academicYears.id });

    if (res.length !== 1 || !res[0]?.id) {
      throw new Error("Failed to create academic year");
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to create academic year");
  }
}

export async function getAcademicYears(): Promise<AcademicYear[]> {
  try {
    return db
      .select()
      .from(academicYears)
      .orderBy(desc(academicYears.createdAt));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed get academic years");
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
      throw new Error("No current academic year found");
    }

    return res[0];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed get current academic year");
  }
}
