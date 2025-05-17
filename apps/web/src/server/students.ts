"use server";

import { SignupSchema } from "@/schemas/auth";
import { z } from "zod";

export async function createStudent(values: z.infer<typeof SignupSchema>) {
  try {
    const data = SignupSchema.parse(values);

    if (data.role !== "student") {
      throw new Error("Invalid role");
    }
  } catch (error) {}
}
