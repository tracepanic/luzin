"use server";

import { db } from "@/db";
import { schools } from "@/db/schema/schools";
import { School } from "@/schemas/schools";

export async function getSchoolInfo(): Promise<School> {
  try {
    const school = await db.select().from(schools).limit(1);

    if (school.length !== 1 || !school[0]) {
      throw new Error("School not found");
    }

    return school[0];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("School not found");
  }
}
