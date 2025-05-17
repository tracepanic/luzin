import { classes, classInstances } from "@/db/schema/classes";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export type Class = InferSelectModel<typeof classes>;
export type ClassInstance = InferSelectModel<typeof classInstances>;

export const CreateClassTemplateSchema = z.object({
  name: z.string().min(3).max(255),
});

export const CreateClassInstanceSchema = z.object({
  name: z.string().min(3).max(255),
  academicYearId: z.string().cuid2(),
  classId: z.string().cuid2(),
});
