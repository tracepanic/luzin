import { db } from "@/db";
import { academicYears } from "@/db/schema/years";
import { CreateAcademicYearSchema } from "@/lib/schema";
import { validateUserIsAdmin } from "@/server/common";
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from "@repo/actionkit";
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
